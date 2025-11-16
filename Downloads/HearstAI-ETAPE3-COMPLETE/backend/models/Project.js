// Project Model
const { v4: uuidv4 } = require('uuid');
const dbManager = require('../database/db');

class Project {
    /**
     * Get all projects
     */
    static getAll(filters = {}) {
        const db = dbManager.getDb();
        let sql = 'SELECT * FROM projects WHERE 1=1';
        const params = [];

        if (filters.status) {
            sql += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.type) {
            sql += ' AND type = ?';
            params.push(filters.type);
        }

        sql += ' ORDER BY updated_at DESC';

        return db.prepare(sql).all(params);
    }

    /**
     * Get project by ID
     */
    static getById(id) {
        const db = dbManager.getDb();
        return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    }

    /**
     * Create new project
     */
    static create(data) {
        const db = dbManager.getDb();
        
        const project = {
            id: uuidv4(),
            name: data.name,
            description: data.description || null,
            type: data.type,
            repo_type: data.repo_type,
            repo_url: data.repo_url || null,
            repo_branch: data.repo_branch || 'main',
            local_path: data.local_path || null,
            active_prompt_profile_id: data.active_prompt_profile_id || null,
            stable_version_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'active',
            metadata: JSON.stringify(data.metadata || {})
        };

        const stmt = db.prepare(`
            INSERT INTO projects (
                id, name, description, type, repo_type, repo_url, repo_branch,
                local_path, active_prompt_profile_id, created_at, updated_at, status, metadata
            ) VALUES (
                @id, @name, @description, @type, @repo_type, @repo_url, @repo_branch,
                @local_path, @active_prompt_profile_id, @created_at, @updated_at, @status, @metadata
            )
        `);

        stmt.run(project);
        return project;
    }

    /**
     * Update project
     */
    static update(id, data) {
        const db = dbManager.getDb();
        
        const updates = [];
        const params = {};

        if (data.name !== undefined) {
            updates.push('name = @name');
            params.name = data.name;
        }
        if (data.description !== undefined) {
            updates.push('description = @description');
            params.description = data.description;
        }
        if (data.active_prompt_profile_id !== undefined) {
            updates.push('active_prompt_profile_id = @active_prompt_profile_id');
            params.active_prompt_profile_id = data.active_prompt_profile_id;
        }
        if (data.stable_version_id !== undefined) {
            updates.push('stable_version_id = @stable_version_id');
            params.stable_version_id = data.stable_version_id;
        }
        if (data.status !== undefined) {
            updates.push('status = @status');
            params.status = data.status;
        }

        updates.push('updated_at = @updated_at');
        params.updated_at = new Date().toISOString();
        params.id = id;

        const sql = `UPDATE projects SET ${updates.join(', ')} WHERE id = @id`;
        db.prepare(sql).run(params);

        return this.getById(id);
    }

    /**
     * Delete project (soft delete - set to archived)
     */
    static delete(id) {
        return this.update(id, { status: 'archived' });
    }

    /**
     * Get project with related data
     */
    static getWithDetails(id) {
        const db = dbManager.getDb();
        
        const project = this.getById(id);
        if (!project) return null;

        // Get stable version
        if (project.stable_version_id) {
            project.stable_version = db.prepare(
                'SELECT * FROM versions WHERE id = ?'
            ).get(project.stable_version_id);
        }

        // Get versions count
        project.versions_count = db.prepare(
            'SELECT COUNT(*) as count FROM versions WHERE project_id = ?'
        ).get(id).count;

        // Get jobs count
        project.jobs_count = db.prepare(
            'SELECT COUNT(*) as count FROM jobs WHERE project_id = ?'
        ).get(id).count;

        // Get last job
        project.last_job = db.prepare(
            'SELECT * FROM jobs WHERE project_id = ? ORDER BY created_at DESC LIMIT 1'
        ).get(id);

        return project;
    }
}

module.exports = Project;
