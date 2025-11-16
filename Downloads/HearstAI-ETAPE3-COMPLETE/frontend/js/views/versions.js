// Versions View - Complete Implementation
import API from '../api.js';
import Modal from '../components/modal.js';
import notify from '../components/notification.js';

export async function renderVersionsView() {
    try {
        // Pour l'instant, affichage simple
        // TODO: Implémenter API.getVersions() dans le backend
        
        return `
            <div class="versions-view">
                <div class="section">
                    <div class="section-header">
                        <h3 class="section-title">All Versions</h3>
                        <div class="filters">
                            <select class="filter-select" id="version-project-filter">
                                <option value="">All Projects</option>
                            </select>
                            <select class="filter-select" id="version-status-filter">
                                <option value="">All Statuses</option>
                                <option value="stable">Stable Only</option>
                                <option value="draft">Draft Only</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="card-grid">
                        ${renderVersionsPlaceholder()}
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading versions:', error);
        return `
            <div class="card">
                <div class="card-body">
                    <h3 class="text-danger">Error loading versions</h3>
                    <p class="text-secondary">${error.message}</p>
                </div>
            </div>
        `;
    }
}

function renderVersionsPlaceholder() {
    return `
        <div class="card">
            <div class="card-body text-center">
                <div class="placeholder-icon">◉</div>
                <h3 class="text-primary mb-md">Versions Feature</h3>
                <p class="text-secondary mb-md">
                    Version management system allows you to:
                </p>
                <ul class="feature-list">
                    <li>Track code changes across iterations</li>
                    <li>Mark stable versions for production</li>
                    <li>Compare different versions</li>
                    <li>Rollback to previous versions</li>
                </ul>
                <p class="text-muted mt-md">
                    Versions are automatically created when jobs complete successfully.
                </p>
            </div>
        </div>
    `;
}

export const versionsStyles = `
<style>
.versions-view {
    max-width: 1400px;
}

.filters {
    display: flex;
    gap: var(--spacing-md);
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
