// Database Connection Module
// SQLite3 with better-sqlite3 for synchronous operations

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
    constructor() {
        this.db = null;
        this.dbPath = path.join(__dirname, '../../storage/claude-cicd.db');
    }

    /**
     * Initialize database connection and create tables
     */
    initialize() {
        try {
            // Ensure storage directory exists
            const storageDir = path.dirname(this.dbPath);
            if (!fs.existsSync(storageDir)) {
                fs.mkdirSync(storageDir, { recursive: true });
            }

            // Open database connection
            this.db = new Database(this.dbPath);
            
            // Enable foreign keys
            this.db.pragma('foreign_keys = ON');
            
            // Enable WAL mode for better concurrency
            this.db.pragma('journal_mode = WAL');

            // Create tables from schema
            this.createTables();

            console.log('✅ Database initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            throw error;
        }
    }

    /**
     * Create tables from schema.sql
     */
    createTables() {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Execute schema (supports multiple statements)
        this.db.exec(schema);
        
        console.log('✅ Database tables created/verified');
    }

    /**
     * Get database instance
     */
    getDb() {
        if (!this.db) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.db;
    }

    /**
     * Close database connection
     */
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
            console.log('✅ Database connection closed');
        }
    }

    /**
     * Execute a query
     */
    query(sql, params = []) {
        return this.db.prepare(sql).all(params);
    }

    /**
     * Execute a single row query
     */
    queryOne(sql, params = []) {
        return this.db.prepare(sql).get(params);
    }

    /**
     * Execute an insert/update/delete
     */
    run(sql, params = []) {
        return this.db.prepare(sql).run(params);
    }

    /**
     * Begin transaction
     */
    beginTransaction() {
        return this.db.prepare('BEGIN TRANSACTION').run();
    }

    /**
     * Commit transaction
     */
    commit() {
        return this.db.prepare('COMMIT').run();
    }

    /**
     * Rollback transaction
     */
    rollback() {
        return this.db.prepare('ROLLBACK').run();
    }

    /**
     * Execute in transaction
     */
    transaction(callback) {
        try {
            this.beginTransaction();
            const result = callback();
            this.commit();
            return result;
        } catch (error) {
            this.rollback();
            throw error;
        }
    }
}

// Singleton instance
const dbManager = new DatabaseManager();

module.exports = dbManager;
