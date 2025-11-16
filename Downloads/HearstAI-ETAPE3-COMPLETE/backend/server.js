// Claude CI/CD Cockpit - Main Server
// Express + SQLite Backend

const express = require('express');
const cors = require('cors');
const path = require('path');
const dbManager = require('./database/db');

// Import routes
const projectsRouter = require('./routes/projects');
const versionsRouter = require('./routes/versions');
const jobsRouter = require('./routes/jobs');
const promptsRouter = require('./routes/prompts');
const logsRouter = require('./routes/logs');
const diffRouter = require('./routes/diff');
const statsRouter = require('./routes/stats');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARE
// ============================================

// CORS - Allow frontend to connect
app.use(cors());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ============================================
// API ROUTES
// ============================================

app.use('/api/projects', projectsRouter);
app.use('/api/versions', versionsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/logs', logsRouter);
app.use('/api/diff', diffRouter);
app.use('/api/stats', statsRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: dbManager.getDb() ? 'connected' : 'disconnected'
    });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ============================================
// SERVER STARTUP
// ============================================

async function startServer() {
    try {
        // Initialize database
        console.log('🔧 Initializing database...');
        dbManager.initialize();

        // Start server
        app.listen(PORT, () => {
            console.log('');
            console.log('🚀 Claude CI/CD Cockpit - Backend Server');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`✅ Server running on: http://localhost:${PORT}`);
            console.log(`✅ API available at: http://localhost:${PORT}/api`);
            console.log(`✅ Database: SQLite (${dbManager.dbPath})`);
            console.log('');
            console.log('📡 API Endpoints:');
            console.log('   GET  /api/health');
            console.log('   GET  /api/projects');
            console.log('   GET  /api/jobs');
            console.log('   GET  /api/prompts');
            console.log('   GET  /api/stats');
            console.log('');
            console.log('Press Ctrl+C to stop');
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down gracefully...');
    dbManager.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down gracefully...');
    dbManager.close();
    process.exit(0);
});

// Start server
startServer();

module.exports = app;
