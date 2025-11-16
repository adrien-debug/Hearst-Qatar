// Prompts View - Complete Implementation
import API from '../api.js';
import Modal from '../components/modal.js';
import notify from '../components/notification.js';

export async function renderPromptsView() {
    try {
        // Pour l'instant, affichage simple
        // TODO: Implémenter API.getPrompts() dans le backend
        
        return `
            <div class="prompts-view">
                <div class="section">
                    <div class="section-header">
                        <h3 class="section-title">Prompt Templates</h3>
                    </div>
                    
                    <div class="card-grid">
                        ${renderPromptsPlaceholder()}
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading prompts:', error);
        return `
            <div class="card">
                <div class="card-body">
                    <h3 class="text-danger">Error loading prompts</h3>
                    <p class="text-secondary">${error.message}</p>
                </div>
            </div>
        `;
    }
}

function renderPromptsPlaceholder() {
    return `
        <div class="card">
            <div class="card-body text-center">
                <div class="placeholder-icon">≡</div>
                <h3 class="text-primary mb-md">Prompt Templates</h3>
                <p class="text-secondary mb-md">
                    Save and reuse your best Claude prompts:
                </p>
                <ul class="feature-list">
                    <li>Create reusable prompt templates</li>
                    <li>Organize by categories (debug, refactor, etc.)</li>
                    <li>Use variables for dynamic content</li>
                    <li>Share prompts across projects</li>
                </ul>
                <p class="text-muted mt-md">
                    Coming soon: Build your prompt library for faster job creation.
                </p>
            </div>
        </div>
    `;
}

export const promptsStyles = `
<style>
.prompts-view {
    max-width: 1400px;
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
