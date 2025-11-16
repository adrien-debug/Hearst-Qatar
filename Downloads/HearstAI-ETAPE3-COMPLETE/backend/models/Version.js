// Version Model
const { v4: uuidv4 } = require('uuid');
const dbManager = require('../database/db');
const fileStorage = require('../services/FileStorageService');

class Version {
    /**
     * Get all versions for a project
     */
    static getAll(projectId) {
        const db = dbManager.getDb();
        return db.prepare(
            'SELECT * FROM versions WHERE project_id = ? ORDER BY created_at DESC'
        ).all(projectId);
    }

    /**
     * Get version by ID
     */
    static getById(id) {
        const db = dbManager.getDb();
        return db.prepare('SELECT * FROM versions WHERE id = ?').get(id);
    }

    /**
     * Create new version
     */
    static create(data) {
        const db = dbManager.getDb();
        
        const version = {
            id: uuidv4(),
            project_id: data.project_id,
            label: data.label,
            description: data.description || null,
            parent_version_id: data.parent_version_id || null,
            is_stable: data.is_stable || 0,
            created_at: new Date().toISOString(),
            created_by_job_id: data.created_by_job_id || null,
            file_count: 0,
            total_size_bytes: 0,
            metadata: JSON.stringify(data.metadata || {})
        };

        const stmt = db.prepare(`
            INSERT INTO versions (
                id, project_id, label, description, parent_version_id,
                is_stable, created_at, created_by_job_id, file_count,
                total_size_bytes, metadata
            ) VALUES (
                @id, @project_id, @label, @description, @parent_version_id,
                @is_stable, @created_at, @created_by_job_id, @file_count,
                @total_size_bytes, @metadata
            )
        `);

        stmt.run(version);
        return version;
    }

    /**
     * Add file to version
     */
    static addFile(versionId, fileData) {
        const db = dbManager.getDb();
        
        const file = {
            id: uuidv4(),
            version_id: versionId,
            path: fileData.path,
            filename: fileData.filename || fileData.path.split('/').pop(),
            extension: fileData.extension || this.getExtension(fileData.path),
            size_bytes: fileData.size_bytes,
            content_hash: fileData.content_hash,
            storage_path: fileData.storage_path,
            created_at: new Date().toISOString(),
            metadata: JSON.stringify(fileData.metadata || {})
        };

        const stmt = db.prepare(`
            INSERT INTO files (
                id, version_id, path, filename, extension, size_bytes,
                content_hash, storage_path, created_at, metadata
            ) VALUES (
                @id, @version_id, @path, @filename, @extension, @size_bytes,
                @content_hash, @storage_path, @created_at, @metadata
            )
        `);

        stmt.run(file);

        // Update version stats
        this.updateStats(versionId);

        return file;
    }

    /**
     * Get files for version
     */
    static getFiles(versionId) {
        const db = dbManager.getDb();
        return db.prepare(
            'SELECT * FROM files WHERE version_id = ? ORDER BY path'
        ).all(versionId);
    }

    /**
     * Update version stats
     */
    static updateStats(versionId) {
        const db = dbManager.getDb();
        
        const stats = db.prepare(`
            SELECT COUNT(*) as count, SUM(size_bytes) as total_size
            FROM files WHERE version_id = ?
        `).get(versionId);

        db.prepare(`
            UPDATE versions 
            SET file_count = ?, total_size_bytes = ?
            WHERE id = ?
        `).run(stats.count, stats.total_size || 0, versionId);
    }

    /**
     * Mark version as stable
     */
    static markAsStable(versionId) {
        const db = dbManager.getDb();
        
        const version = this.getById(versionId);
        if (!version) {
            throw new Error('Version not found');
        }

        // Unmark other stable versions for this project
        db.prepare(
            'UPDATE versions SET is_stable = 0 WHERE project_id = ?'
        ).run(version.project_id);

        // Mark this version as stable
        db.prepare(
            'UPDATE versions SET is_stable = 1 WHERE id = ?'
        ).run(versionId);

        return this.getById(versionId);
    }

    /**
     * Get stable version for project
     */
    static getStableVersion(projectId) {
        const db = dbManager.getDb();
        return db.prepare(
            'SELECT * FROM versions WHERE project_id = ? AND is_stable = 1'
        ).get(projectId);
    }

    /**
     * Generate next version label
     */
    static generateNextLabel(projectId) {
        const versions = this.getAll(projectId);
        
        if (versions.length === 0) {
            return 'VERSION_00_BASE';
        }

        // Extract numbers from labels
        const numbers = versions
            .map(v => {
                const match = v.label.match(/VERSION_(\d+)/);
                return match ? parseInt(match[1]) : 0;
            })
            .filter(n => !isNaN(n));

        const maxNumber = Math.max(...numbers, -1);
        const nextNumber = maxNumber + 1;

        return `VERSION_${String(nextNumber).padStart(2, '0')}`;
    }

    /**
     * Get extension from filename
     */
    static getExtension(filename) {
        const parts = filename.split('.');
        return parts.length > 1 ? parts.pop() : '';
    }

    /**
     * Delete version
     */
    static delete(versionId) {
        const db = dbManager.getDb();
        const version = this.getById(versionId);
        
        if (!version) {
            throw new Error('Version not found');
        }

        // Delete files from storage
        try {
            fileStorage.deleteVersion(version.project_id, version.label);
        } catch (error) {
            console.warn('Could not delete version files:', error);
        }

        // Delete from database (cascade will delete files records)
        db.prepare('DELETE FROM versions WHERE id = ?').run(versionId);
    }
}

module.exports = Version;
