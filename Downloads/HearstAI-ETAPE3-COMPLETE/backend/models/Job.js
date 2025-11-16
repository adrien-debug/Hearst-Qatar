// Job Model
const { v4: uuidv4 } = require('uuid');
const dbManager = require('../database/db');

class Job {
    /**
     * Get all jobs
     */
    static getAll(filters = {}) {
        const db = dbManager.getDb();
        let sql = `
            SELECT j.*, p.name as project_name
            FROM jobs j
            LEFT JOIN projects p ON j.project_id = p.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.project_id) {
            sql += ' AND j.project_id = ?';
            params.push(filters.project_id);
        }

        if (filters.status) {
            sql += ' AND j.status = ?';
            params.push(filters.status);
        }

        if (filters.type) {
            sql += ' AND j.type = ?';
            params.push(filters.type);
        }

        const limit = filters.limit || 50;
        const offset = filters.offset || 0;
        
        sql += ' ORDER BY j.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        return db.prepare(sql).all(params);
    }

    /**
     * Get job by ID
     */
    static getById(id) {
        const db = dbManager.getDb();
        return db.prepare(`
            SELECT j.*, p.name as project_name
            FROM jobs j
            LEFT JOIN projects p ON j.project_id = p.id
            WHERE j.id = ?
        `).get(id);
    }

    /**
     * Create new job
     */
    static create(data) {
        const db = dbManager.getDb();
        
        const job = {
            id: uuidv4(),
            project_id: data.project_id,
            type: data.type,
            status: 'pending',
            prompt_profile_id: data.prompt_profile_id || null,
            input_prompt: data.input_prompt,
            context_data: JSON.stringify(data.context_data || {}),
            output_summary: null,
            output_version_id: null,
            started_at: null,
            completed_at: null,
            duration_seconds: null,
            created_at: new Date().toISOString(),
            error_message: null,
            metadata: JSON.stringify(data.metadata || {})
        };

        const stmt = db.prepare(`
            INSERT INTO jobs (
                id, project_id, type, status, prompt_profile_id, input_prompt,
                context_data, created_at, metadata
            ) VALUES (
                @id, @project_id, @type, @status, @prompt_profile_id, @input_prompt,
                @context_data, @created_at, @metadata
            )
        `);

        stmt.run(job);
        return job;
    }

    /**
     * Update job
     */
    static update(id, data) {
        const db = dbManager.getDb();
        
        const updates = [];
        const params = { id };

        if (data.status !== undefined) {
            updates.push('status = @status');
            params.status = data.status;

            // Auto-set started_at when status becomes 'running'
            if (data.status === 'running' && !params.started_at) {
                updates.push('started_at = @started_at');
                params.started_at = new Date().toISOString();
            }

            // Auto-set completed_at when status becomes final
            if (['success', 'failed', 'cancelled'].includes(data.status)) {
                updates.push('completed_at = @completed_at');
                params.completed_at = new Date().toISOString();

                // Calculate duration
                const job = this.getById(id);
                if (job && job.started_at) {
                    const start = new Date(job.started_at);
                    const end = new Date(params.completed_at);
                    updates.push('duration_seconds = @duration_seconds');
                    params.duration_seconds = Math.floor((end - start) / 1000);
                }
            }
        }

        if (data.output_summary !== undefined) {
            updates.push('output_summary = @output_summary');
            params.output_summary = data.output_summary;
        }

        if (data.output_version_id !== undefined) {
            updates.push('output_version_id = @output_version_id');
            params.output_version_id = data.output_version_id;
        }

        if (data.error_message !== undefined) {
            updates.push('error_message = @error_message');
            params.error_message = data.error_message;
        }

        if (updates.length === 0) return this.getById(id);

        const sql = `UPDATE jobs SET ${updates.join(', ')} WHERE id = @id`;
        db.prepare(sql).run(params);

        return this.getById(id);
    }

    /**
     * Get job with logs
     */
    static getWithLogs(id) {
        const db = dbManager.getDb();
        
        const job = this.getById(id);
        if (!job) return null;

        job.logs = db.prepare(
            'SELECT * FROM log_entries WHERE job_id = ? ORDER BY timestamp ASC'
        ).all(id);

        return job;
    }

    /**
     * Cancel job
     */
    static cancel(id) {
        return this.update(id, { status: 'cancelled' });
    }
}

module.exports = Job;
