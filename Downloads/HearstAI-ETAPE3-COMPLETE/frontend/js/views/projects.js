// Projects View - Complete Implementation
import API from '../api.js';
import Modal from '../components/modal.js';
import notify from '../components/notification.js';
import exportModule from '../export.js';

export async function renderProjectsView() {
    try {
        const { projects } = await API.getProjects();
        
        // Make export function global
        window.exportProjects = async () => {
            notify.info('Generating PDF...');
            await exportModule.exportProjectsPDF(projects);
            notify.success('PDF generated! Check your downloads.');
        };
        
        return `
            <div class="projects-view">
                <div class="projects-header">
                    <h2 class="view-title">All Projects</h2>
                    <button class="btn btn-sm btn-secondary" onclick="exportProjects()">
                        📄 Export PDF
                    </button>
                </div>
                <div class="card-grid">
                    ${renderProjectCards(projects || [])}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading projects:', error);
        notify.error('Failed to load projects: ' + error.message);
        return `
            <div class="card">
                <div class="card-body">
                    <h3 class="text-danger">Error loading projects</h3>
                    <p class="text-secondary">${error.message}</p>
                </div>
            </div>
        `;
    }
}

function renderProjectCards(projects) {
    if (!projects.length) {
        return `
            <div class="card">
                <div class="card-body">
                    <h3 class="text-primary mb-md">No projects yet</h3>
                    <p class="text-secondary">Create your first project to get started!</p>
                </div>
            </div>
        `;
    }
    
    return projects.map(project => `
        <div class="card project-card" data-project-id="${project.id}">
            <div class="card-header">
                <h4 class="card-title">${project.name}</h4>
                <span class="badge badge-neutral">${project.type}</span>
            </div>
            <div class="card-body">
                <p class="text-secondary">${project.description || 'No description'}</p>
                <div class="project-info">
                    <div class="info-row">
                        <span class="info-label">Type:</span>
                        <span class="info-value">${project.repo_type}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="badge badge-success">${project.status}</span>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-sm btn-secondary" onclick="viewProject('${project.id}')">View</button>
                <button class="btn btn-sm btn-primary" onclick="createJob('${project.id}')">New Job</button>
            </div>
        </div>
    `).join('');
}

export const projectsStyles = `
<style>
.projects-view {
    max-width: 1400px;
}

.projects-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
}

.view-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--spacing-lg);
}

.project-card {
    transition: all var(--transition-normal);
}

.project-card:hover {
    transform: translateY(-4px);
    border-color: var(--accent-primary);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.card-body {
    padding: var(--spacing-md);
}

.project-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
}

.info-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
}

.info-label {
    color: var(--text-muted);
}

.info-value {
    color: var(--text-primary);
    font-weight: 500;
}

.card-footer {
    padding: var(--spacing-md);
    border-top: 1px solid var(--border-color);
    display: flex;
    gap: var(--spacing-sm);
}
</style>
`;
