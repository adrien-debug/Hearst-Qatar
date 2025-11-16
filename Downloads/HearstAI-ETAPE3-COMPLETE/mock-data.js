// ===================================
// MOCK DATA - Pour tester le frontend sans backend
// ===================================

// Pour utiliser ce mock, modifiez temporairement api.js :
// 1. Importez ce fichier
// 2. Retournez les données mockées au lieu de faire les fetch

export const MOCK_DATA = {
    projects: [
        {
            id: "proj-001",
            name: "Dashboard Analytics",
            description: "Dashboard de visualisation de données",
            type: "dashboard",
            repo_type: "local",
            local_path: "/projects/dashboard-analytics",
            stable_version_id: "ver-003",
            stable_version_label: "VERSION_03",
            last_job_status: "success",
            created_at: "2025-01-10T10:00:00Z",
            updated_at: "2025-01-20T14:30:00Z",
            status: "active",
            versions_count: 5,
            jobs_count: 12
        },
        {
            id: "proj-002",
            name: "Landing Page",
            description: "Site vitrine client",
            type: "html_static",
            repo_type: "github",
            repo_url: "https://github.com/user/landing-page",
            stable_version_id: "ver-007",
            stable_version_label: "VERSION_02",
            last_job_status: "success",
            created_at: "2025-01-15T09:00:00Z",
            updated_at: "2025-01-21T10:15:00Z",
            status: "active",
            versions_count: 3,
            jobs_count: 8
        },
        {
            id: "proj-003",
            name: "E-commerce SPA",
            description: "Application e-commerce React",
            type: "spa",
            repo_type: "github",
            repo_url: "https://github.com/user/ecommerce-spa",
            stable_version_id: null,
            stable_version_label: null,
            last_job_status: "running",
            created_at: "2025-01-18T14:00:00Z",
            updated_at: "2025-01-22T08:45:00Z",
            status: "active",
            versions_count: 2,
            jobs_count: 5
        }
    ],

    versions: [
        {
            id: "ver-001",
            project_id: "proj-001",
            label: "VERSION_00_BASE",
            description: "Version initiale importée",
            parent_version_id: null,
            is_stable: false,
            file_count: 8,
            total_size_bytes: 125440,
            created_at: "2025-01-10T10:00:00Z",
            created_by_job_id: null
        },
        {
            id: "ver-002",
            project_id: "proj-001",
            label: "VERSION_01",
            description: "Fix responsive mobile",
            parent_version_id: "ver-001",
            is_stable: false,
            file_count: 8,
            total_size_bytes: 128900,
            created_at: "2025-01-12T15:30:00Z",
            created_by_job_id: "job-001"
        },
        {
            id: "ver-003",
            project_id: "proj-001",
            label: "VERSION_03",
            description: "Optimisation performances + debug chart loader",
            parent_version_id: "ver-002",
            is_stable: true,
            file_count: 10,
            total_size_bytes: 132100,
            created_at: "2025-01-20T14:30:00Z",
            created_by_job_id: "job-005"
        }
    ],

    files: [
        {
            id: "file-001",
            version_id: "ver-003",
            path: "index.html",
            filename: "index.html",
            extension: "html",
            size_bytes: 8192,
            content_hash: "abc123...",
            created_at: "2025-01-20T14:30:00Z"
        },
        {
            id: "file-002",
            version_id: "ver-003",
            path: "css/style.css",
            filename: "style.css",
            extension: "css",
            size_bytes: 24576,
            content_hash: "def456...",
            created_at: "2025-01-20T14:30:00Z"
        },
        {
            id: "file-003",
            version_id: "ver-003",
            path: "js/app.js",
            filename: "app.js",
            extension: "js",
            size_bytes: 45000,
            content_hash: "ghi789...",
            created_at: "2025-01-20T14:30:00Z"
        }
    ],

    jobs: [
        {
            id: "job-001",
            project_id: "proj-001",
            type: "debug",
            status: "success",
            prompt_profile_id: "prompt-001",
            input_prompt: "Fix the responsive layout on mobile devices",
            output_summary: "Fixed CSS grid breakpoints and media queries",
            output_version_id: "ver-002",
            started_at: "2025-01-12T15:28:00Z",
            completed_at: "2025-01-12T15:30:15Z",
            duration_seconds: 135,
            created_at: "2025-01-12T15:28:00Z",
            project: { id: "proj-001", name: "Dashboard Analytics" },
            prompt_profile: { id: "prompt-001", name: "Debug Standard" }
        },
        {
            id: "job-005",
            project_id: "proj-001",
            type: "patch",
            status: "success",
            prompt_profile_id: "prompt-001",
            input_prompt: "Optimize chart loading performance and fix initial render bug",
            output_summary: "Implemented lazy loading for charts, fixed D3.js initialization",
            output_version_id: "ver-003",
            started_at: "2025-01-20T14:25:00Z",
            completed_at: "2025-01-20T14:30:00Z",
            duration_seconds: 300,
            created_at: "2025-01-20T14:25:00Z",
            project: { id: "proj-001", name: "Dashboard Analytics" },
            prompt_profile: { id: "prompt-001", name: "Debug Standard" }
        },
        {
            id: "job-010",
            project_id: "proj-003",
            type: "refactor",
            status: "running",
            prompt_profile_id: "prompt-002",
            input_prompt: "Refactor product listing component to use hooks",
            output_summary: null,
            output_version_id: null,
            started_at: "2025-01-22T08:45:00Z",
            completed_at: null,
            duration_seconds: null,
            created_at: "2025-01-22T08:44:00Z",
            project: { id: "proj-003", name: "E-commerce SPA" },
            prompt_profile: { id: "prompt-002", name: "Refactor Controlé" }
        }
    ],

    prompts: [
        {
            id: "prompt-001",
            name: "Debug Standard",
            description: "Profil standard pour debug avec protection du code",
            type: "debugging",
            system_prompt: "Tu es un expert en debugging. Tu appliques les règles : Code protégé, Zero casse, Zero doublon.",
            rules: "1. Ne jamais casser le code existant\n2. Faire des modifications minimales ciblées\n3. Tester les modifications",
            examples: "Exemple: Fix login button not working -> Vérifier event listeners, valider formulaire",
            is_default: true,
            usage_count: 45,
            created_at: "2025-01-05T10:00:00Z",
            updated_at: "2025-01-05T10:00:00Z"
        },
        {
            id: "prompt-002",
            name: "Refactor Contrôlé",
            description: "Refactoring avec contrôle strict des modifications",
            type: "atomic_task",
            system_prompt: "Tu es un expert en refactoring. Tu procèdes par étapes atomiques et documentées.",
            rules: "1. Refactorer une fonction à la fois\n2. Maintenir les tests existants\n3. Documenter chaque changement",
            examples: "Exemple: Refactor classe -> composant fonctionnel",
            is_default: false,
            usage_count: 23,
            created_at: "2025-01-08T14:00:00Z",
            updated_at: "2025-01-08T14:00:00Z"
        },
        {
            id: "prompt-003",
            name: "Génération Page",
            description: "Génération de nouvelles pages HTML/React",
            type: "custom",
            system_prompt: "Tu es un expert en génération de code frontend. Tu crées des composants réutilisables et bien structurés.",
            rules: "1. Suivre la structure du projet\n2. Utiliser les composants existants\n3. Respecter le design system",
            examples: "Exemple: Créer page de contact avec formulaire",
            is_default: false,
            usage_count: 12,
            created_at: "2025-01-10T11:00:00Z",
            updated_at: "2025-01-10T11:00:00Z"
        }
    ],

    logs: [
        {
            id: "log-001",
            job_id: "job-001",
            project_id: "proj-001",
            level: "info",
            message: "Job started: Fix responsive layout",
            timestamp: "2025-01-12T15:28:00Z"
        },
        {
            id: "log-002",
            job_id: "job-001",
            project_id: "proj-001",
            level: "success",
            message: "Job completed successfully",
            timestamp: "2025-01-12T15:30:15Z"
        },
        {
            id: "log-003",
            job_id: "job-005",
            project_id: "proj-001",
            level: "info",
            message: "Job started: Optimize chart loading",
            timestamp: "2025-01-20T14:25:00Z"
        },
        {
            id: "log-004",
            job_id: "job-005",
            project_id: "proj-001",
            level: "warning",
            message: "Large file detected: bundle.js (2.5MB)",
            timestamp: "2025-01-20T14:27:30Z"
        },
        {
            id: "log-005",
            job_id: "job-005",
            project_id: "proj-001",
            level: "success",
            message: "Job completed successfully",
            timestamp: "2025-01-20T14:30:00Z"
        },
        {
            id: "log-006",
            job_id: "job-010",
            project_id: "proj-003",
            level: "info",
            message: "Job started: Refactor product listing",
            timestamp: "2025-01-22T08:45:00Z"
        }
    ],

    stats: {
        total_projects: 3,
        total_versions: 8,
        total_jobs: 15,
        jobs_success_rate: 0.93,
        total_storage_mb: 145.2,
        last_7_days_jobs: 8
    }
};
