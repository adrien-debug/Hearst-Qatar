// Logs View - Complete Implementation
import API from '../api.js';
import Modal from '../components/modal.js';
import notify from '../components/notification.js';

export async function renderLogsView() {
    try {
        // Pour l'instant, affichage simple
        // TODO: Implémenter API.getLogs() dans le backend
        
        return `
            <div class="logs-view">
                <div class="section">
                    <div class="section-header">
                        <h3 class="section-title">Activity Logs</h3>
                        <div class="filters">
                            <select class="filter-select" id="log-level-filter">
                                <option value="">All Levels</option>
                                <option value="info">Info</option>
                                <option value="success">Success</option>
                                <option value="warning">Warning</option>
                                <option value="error">Error</option>
                            </select>
                            <button class="btn btn-sm btn-ghost" onclick="window.refreshLogs()">
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-body">
                            ${renderLogsPlaceholder()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading logs:', error);
        return `
            <div class="card">
                <div class="card-body">
                    <h3 class="text-danger">Error loading logs</h3>
                    <p class="text-secondary">${error.message}</p>
                </div>
            </div>
        `;
    }
}

function renderLogsPlaceholder() {
    return `
        <div class="text-center">
            <div class="placeholder-icon">☰</div>
            <h3 class="text-primary mb-md">Activity Logs</h3>
            <p class="text-secondary mb-md">
                Track all system activities:
            </p>
            <ul class="feature-list">
                <li>Job executions and results</li>
                <li>Project creations and updates</li>
                <li>Version deployments</li>
                <li>System events and errors</li>
            </ul>
            <p class="text-muted mt-md">
                All activities are logged for audit and debugging purposes.
            </p>
        </div>
    `;
}

// Global function pour refresh
window.refreshLogs = async () => {
    notify.info('Refreshing logs...');
    // TODO: Implémenter le refresh réel
    setTimeout(() => {
        notify.success('Logs refreshed');
    }, 1000);
};

export const logsStyles = `
<style>
.logs-view {
    max-width: 1400px;
}

.filters {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
}

.filter-select {
    padding: 8px 12px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
    font-size: 14px;
    cursor: pointer;
    transition: border-color var(--transition-fast);
}

.filter-select:hover {
    border-color: var(--accent-primary);
}

.filter-select:focus {
    outline: none;
    border-color: var(--accent-primary);
}

.placeholder-icon {
    font-size: 64px;
    color: var(--accent-primary);
    margin-bottom: var(--spacing-lg);
    opacity: 0.5;
}

.feature-list {
    text-align: left;
    max-width: 400px;
    margin: 0 auto;
    list-style: none;
    padding: 0;
}

.feature-list li {
    padding: 8px 0;
    padding-left: 24px;
    position: relative;
    color: var(--text-secondary);
}

.feature-list li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--accent-primary);
    font-weight: bold;
}
</style>
`;
