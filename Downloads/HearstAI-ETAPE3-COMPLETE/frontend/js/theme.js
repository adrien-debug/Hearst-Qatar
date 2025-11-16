// ===================================
// THEME.JS - Dark/Light mode system
// ===================================

class ThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // Default NEARST theme
        this.init();
    }

    init() {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('hearstai-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
        
        // Apply theme
        this.applyTheme(this.currentTheme);
        
        // Create theme toggle button
        this.createToggleButton();
    }

    createToggleButton() {
        const header = document.querySelector('.header-right');
        if (!header) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.innerHTML = this.getThemeIcon();
        toggleBtn.setAttribute('aria-label', 'Toggle theme');
        toggleBtn.title = 'Toggle dark/light mode';
        
        toggleBtn.addEventListener('click', () => this.toggle());
        
        // Insert before user badge
        const userBadge = header.querySelector('.user-badge');
        header.insertBefore(toggleBtn, userBadge);
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        this.saveTheme();
        
        // Update button icon
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = this.getThemeIcon();
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'light') {
            this.applyLightTheme();
        } else {
            this.applyDarkTheme();
        }
    }

    applyDarkTheme() {
        const root = document.documentElement;
        root.style.setProperty('--bg-primary', '#0a0a0a');
        root.style.setProperty('--bg-secondary', '#1a1a1a');
        root.style.setProperty('--bg-tertiary', '#242424');
        root.style.setProperty('--bg-hover', '#2a2a2a');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#b8b8b8');
        root.style.setProperty('--text-muted', '#6b6b6b');
        root.style.setProperty('--border-color', '#2a2a2a');
        root.style.setProperty('--border-hover', '#3a3a3a');
    }

    applyLightTheme() {
        const root = document.documentElement;
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f5f5f5');
        root.style.setProperty('--bg-tertiary', '#e8e8e8');
        root.style.setProperty('--bg-hover', '#f0f0f0');
        root.style.setProperty('--text-primary', '#1a1a1a');
        root.style.setProperty('--text-secondary', '#4a4a4a');
        root.style.setProperty('--text-muted', '#9a9a9a');
        root.style.setProperty('--border-color', '#e0e0e0');
        root.style.setProperty('--border-hover', '#d0d0d0');
    }

    getThemeIcon() {
        return this.currentTheme === 'dark' 
            ? '☀️' // Sun for switching to light
            : '🌙'; // Moon for switching to dark
    }

    saveTheme() {
        localStorage.setItem('hearstai-theme', this.currentTheme);
    }

    getTheme() {
        return this.currentTheme;
    }
}

// Styles pour le bouton toggle
const themeToggleStyles = `
<style>
.theme-toggle {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-right: 12px;
}

.theme-toggle:hover {
    background: var(--bg-hover);
    transform: scale(1.1);
}

.theme-toggle:active {
    transform: scale(0.95);
}

/* Animation de rotation au changement */
.theme-toggle.changing {
    animation: rotateTheme 0.3s ease-in-out;
}

@keyframes rotateTheme {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(180deg); }
}

/* Ajustements pour le light mode */
[data-theme="light"] .sidebar {
    background: #ffffff;
    border-right: 1px solid var(--border-color);
}

[data-theme="light"] .nav-item.active {
    background: rgba(123, 237, 159, 0.1);
}

[data-theme="light"] .logo-text {
    color: var(--text-primary);
}

[data-theme="light"] .card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
`;

// Injecter les styles
document.head.insertAdjacentHTML('beforeend', themeToggleStyles);

// Export singleton
const themeManager = new ThemeManager();
export default themeManager;
