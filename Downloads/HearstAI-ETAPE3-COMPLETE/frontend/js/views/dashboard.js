// Dashboard View Template - NEARST STYLE
export function renderDashboard(data) {
    return `
        <div class="dashboard-view">
            
            <!-- Stats cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-info">
                        <div class="stat-label">Total Projects</div>
                        <div class="stat-value">${data.stats?.total_projects || 0}</div>
                    </div>
                    <div class="stat-icon">◫</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-info">
                        <div class="stat-label">Jobs Running</div>
                        <div class="stat-value">${data.stats?.jobs_running || 0}</div>
                    </div>
                    <div class="stat-icon">⚡</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-info">
                        <div class="stat-label">Success Rate</div>
                        <div class="stat-value">${Math.round((data.stats?.jobs_success_rate || 0) * 100)}%</div>
                    </div>
                    <div class="stat-icon">✓</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-info">
                        <div class="stat-label">Total Versions</div>
                        <div class="stat-value">${data.stats?.total_versions || 0}</div>
                    </div>
                    <div class="stat-icon">◉</div>
                </div>
            </div>
            
            <!-- Recent projects -->
            <div class="section">
                <div class="section-header">
                    <h3 class="section-title">Recent Projects</h3>
                    <a href="#projects" class="btn btn-ghost btn-sm">View All →</a>
                </div>
                
                <div class="card-grid">
                    ${renderProjectCards(data.projects || [])}
                </div>
            </div>
            
            <!-- Recent jobs -->
            <div class="section mt-lg">
                <div class="section-header">
                    <h3 class="section-title">Recent Jobs</h3>
                    <a href="#jobs" class="btn btn-ghost btn-sm">View All →</a>
                </div>
                
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Duration</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${renderJobRows(data.jobs || [])}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    `;
}

function renderProjectCards(projects) {
    if (!projects.length) {
        return `<div class="card"><p class="text-secondary">No projects yet. Create your first project!</p></div>`;
    }
    
    return projects.slice(0, 6).map(project => `
        <div class="card project-card" data-project-id="${project.id}">
            <div class="card-header">
                <h4 class="card-title">${project.name}</h4>
                <span class="badge badge-neutral">${project.type}</span>
            </div>
            <div class="card-body">
                <div class="project-info">
                    <div class="info-row">
                        <span class="info-label">Stable Version:</span>
                        <span class="info-value">${project.stable_version_label || 'None'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Last Job:</span>
                        <span class="badge badge-${getJobStatusClass(project.last_job_status)}">${project.last_job_status || 'None'}</span>
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

function renderJobRows(jobs) {
    if (!jobs.length) {
        return `<tr><td colspan="6" class="text-center text-secondary">No recent jobs</td></tr>`;
    }
    
    return jobs.slice(0, 10).map(job => `
        <tr>
            <td><strong>${job.project?.name || 'Unknown'}</strong></td>
            <td><span class="badge badge-neutral">${job.type}</span></td>
            <td><span class="badge badge-${getJobStatusClass(job.status)} badge-dot">${job.status}</span></td>
            <td>${job.duration_seconds ? job.duration_seconds + 's' : '-'}</td>
            <td class="text-muted">${formatDate(job.created_at)}</td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="viewJob('${job.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

function getJobStatusClass(status) {
    const statusMap = {
        success: 'success',
        running: 'info',
        pending: 'warning',
        failed: 'danger',
        cancelled: 'neutral'
    };
    return statusMap[status] || 'neutral';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Add custom styles for dashboard - NEARST THEME
const dashboardStyles = `
<style>
.dashboard-view {
    max-width: 1400px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}

.stat-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: var(--spacing-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all var(--transition-normal);
}

.stat-card:hover {
    border-color: var(--accent-primary);
    transform: translateY(-2px);
}

.stat-icon {
    font-size: 32px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-primary);
    opacity: 0.7;
}

.stat-info {
    flex: 1;
}

.stat-label {
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
}

.stat-value {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
}

.section {
    margin-bottom: var(--spacing-xl);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
}

.project-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
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

.text-center {
    text-align: center;
}
</style>
`;

export const dashboardTemplate = renderDashboard;
export { dashboardStyles };
