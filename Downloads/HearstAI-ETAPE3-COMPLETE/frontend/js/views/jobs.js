// Jobs View - Complete Implementation with Export
import API from '../api.js';
import Modal from '../components/modal.js';
import notify from '../components/notification.js';
import exportModule from '../export.js';

export async function renderJobsView() {
    try {
        const { jobs } = await API.getJobs();
        
        // Make export function global
        window.exportJobs = async () => {
            notify.info('Generating PDF...');
            await exportModule.exportJobsPDF(jobs);
            notify.success('PDF generated! Check your downloads.');
        };
        
        return `
            <div class="jobs-view">
                <div class="jobs-header">
                    <h2 class="view-title">All Jobs</h2>
                    <button class="btn btn-sm btn-secondary" onclick="exportJobs()">
                        📄 Export PDF
                    </button>
                </div>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Project</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${renderJobRows(jobs || [])}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading jobs:', error);
        notify.error('Failed to load jobs: ' + error.message);
        return `
            <div class="card">
                <div class="card-body">
                    <h3 class="text-danger">Error loading jobs</h3>
                    <p class="text-secondary">${error.message}</p>
                </div>
            </div>
        `;
    }
}

function renderJobRows(jobs) {
    if (!jobs.length) {
        return `
            <tr>
                <td colspan="6" class="text-center">
                    <div style="padding: 40px;">
                        <h3 class="text-primary mb-md">No jobs yet</h3>
                        <p class="text-secondary">Create a job to start working with Claude!</p>
                    </div>
                </td>
            </tr>
        `;
    }
    
    return jobs.map(job => `
        <tr>
            <td><code>${job.id.substring(0, 8)}</code></td>
            <td><strong>${job.project?.name || 'Unknown'}</strong></td>
            <td><span class="badge badge-neutral">${job.type}</span></td>
            <td><span class="badge badge-${getJobStatusClass(job.status)} badge-dot">${job.status}</span></td>
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

export const jobsStyles = `
<style>
.jobs-view {
    max-width: 1400px;
}

.jobs-header {
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

.table-container {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table thead {
    background: var(--bg-tertiary);
}

.table th {
    padding: var(--spacing-md);
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
}

.table td {
    padding: var(--spacing-md);
    border-top: 1px solid var(--border-color);
    color: var(--text-primary);
}

.table tbody tr {
    transition: background var(--transition-fast);
}

.table tbody tr:hover {
    background: var(--bg-hover);
}

.text-center {
    text-align: center;
}

.text-muted {
    color: var(--text-muted);
}

code {
    font-family: 'Courier New', monospace;
    background: var(--bg-tertiary);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    color: var(--accent-primary);
}

.badge-dot::before {
    content: '●';
    margin-right: 6px;
}
</style>
`;
