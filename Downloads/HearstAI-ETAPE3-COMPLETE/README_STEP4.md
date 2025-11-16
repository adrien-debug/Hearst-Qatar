# 🚀 ÉTAPE 4 — BACKEND + CONNEXION API

## ✅ CE QUI A ÉTÉ CRÉÉ

### Backend complet (Node.js + Express + SQLite)

```
backend/
├── server.js                   # Serveur Express principal
├── package.json                # Dépendances Node
├── database/
│   ├── db.js                   # Connexion SQLite
│   └── schema.sql              # Schéma complet
├── models/
│   ├── Project.js              # Modèle Project
│   └── Job.js                  # Modèle Job
└── routes/
    ├── projects.js             # Routes /api/projects
    ├── jobs.js                 # Routes /api/jobs
    ├── stats.js                # Routes /api/stats
    ├── prompts.js              # Routes /api/prompts (placeholder)
    ├── versions.js             # Routes /api/versions (placeholder)
    ├── logs.js                 # Routes /api/logs (placeholder)
    └── diff.js                 # Routes /api/diff (placeholder)
```

### Frontend mis à jour

```
frontend/js/
├── api.js          # Module API pour communiquer avec backend
└── app.js          # Application principale (utilise API réelle)
```

---

## 🎯 FONCTIONNALITÉS IMPLÉMENTÉES

### ✅ Backend

**Database (SQLite)**
- ✅ Schéma complet (6 tables)
- ✅ Connexion avec better-sqlite3
- ✅ Indexes pour performance
- ✅ Foreign keys activées
- ✅ Prompts par défaut

**API REST**
- ✅ GET /api/projects
- ✅ POST /api/projects
- ✅ GET /api/projects/:id
- ✅ PUT /api/projects/:id
- ✅ DELETE /api/projects/:id
- ✅ POST /api/projects/:id/rollback
- ✅ GET /api/jobs
- ✅ POST /api/jobs
- ✅ GET /api/jobs/:id
- ✅ DELETE /api/jobs/:id (cancel)
- ✅ GET /api/stats (statistiques réelles)
- ✅ GET /api/health

### ✅ Frontend

- ✅ Module API complet
- ✅ Appels API réels (plus de données mock)
- ✅ Gestion des erreurs
- ✅ Dashboard avec vraies données
- ✅ Connexion backend vérifiée au démarrage

---

## 🚀 DÉMARRAGE

### 1. Installer les dépendances backend

```bash
cd backend
npm install
```

**Dépendances installées:**
- express (serveur web)
- cors (CORS pour frontend)
- better-sqlite3 (base de données)
- uuid (génération d'IDs)

### 2. Lancer le backend

```bash
# Depuis backend/
node server.js
```

Le serveur démarre sur **http://localhost:3001**

### 3. Lancer le frontend

**Dans un autre terminal:**

```bash
# Depuis la racine
node dev-server.js
```

Le frontend est sur **http://localhost:3000**

---

## 📊 DATABASE

**Emplacement:** `backend/storage/claude-cicd.db`

**Tables:**
- `projects` — Projets
- `versions` — Versions de code
- `files` — Fichiers par version
- `jobs` — Jobs Claude CI/CD
- `prompt_profiles` — Profils de prompts
- `log_entries` — Logs

**Prompts par défaut:**
1. "Code Protégé Standard" (système)
2. "Debug Standard" (debugging)

---

## 🔌 API ENDPOINTS

### Projects

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/projects | Liste tous les projets |
| POST | /api/projects | Créer un projet |
| GET | /api/projects/:id | Détails d'un projet |
| PUT | /api/projects/:id | Modifier un projet |
| DELETE | /api/projects/:id | Archiver un projet |
| POST | /api/projects/:id/rollback | Rollback version |

### Jobs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/jobs | Liste tous les jobs |
| POST | /api/jobs | Créer un job |
| GET | /api/jobs/:id | Détails job avec logs |
| DELETE | /api/jobs/:id | Annuler un job |

### Stats

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/stats | Statistiques globales |

### Health

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/health | Vérifier backend |

---

## 🧪 TESTER L'API

### Créer un projet

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mon Premier Projet",
    "type": "html_static",
    "repo_type": "local",
    "local_path": "/path/to/project"
  }'
```

### Lister les projets

```bash
curl http://localhost:3001/api/projects
```

### Créer un job

```bash
curl -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PROJECT_ID",
    "type": "debug",
    "input_prompt": "Fix the login button"
  }'
```

### Voir les stats

```bash
curl http://localhost:3001/api/stats
```

---

## ✅ VALIDATION

Quand tu lances l'application :

1. **Backend démarre** → Console affiche :
```
✅ Database initialized successfully
✅ Server running on: http://localhost:3001
```

2. **Frontend se connecte** → Console navigateur affiche :
```
🚀 Claude CI/CD Cockpit initialized
✅ Backend connected: { status: 'ok', ... }
```

3. **Dashboard charge** → Tu vois les stats à 0 (base vide)

4. **Tu peux créer un projet** → Via Postman ou curl

---

## 🔜 CE QUI RESTE À FAIRE

### Modals fonctionnels
- [ ] Modal création projet
- [ ] Modal création job
- [ ] Modal édition

### Vues manquantes
- [ ] Vue Projects (liste + détails)
- [ ] Vue Jobs (liste + détails)
- [ ] Vue Versions
- [ ] Vue Prompts
- [ ] Vue Logs

### Services backend
- [ ] VersionService
- [ ] FileStorageService
- [ ] PromptService (complet)
- [ ] ClaudeAPIService (placeholder)

### Fonctionnalités avancées
- [ ] Upload de fichiers
- [ ] Génération de versions
- [ ] Diff viewer
- [ ] Intégration Claude API

---

## 🎉 RÉSULTAT ACTUEL

✅ **Backend opérationnel**
- Base de données SQLite fonctionnelle
- API REST complète pour Projects et Jobs
- Stats en temps réel

✅ **Frontend connecté**
- Appels API réels
- Charte NEARST appliquée
- Dashboard avec vraies données

**Le cockpit est maintenant un vrai système client-serveur !** 🚀

---

## 🐛 TROUBLESHOOTING

**Erreur: "Backend connection failed"**
→ Le backend n'est pas démarré. Lancer `node server.js` dans `backend/`

**Erreur: "Cannot find module 'express'"**
→ Installer les dépendances : `cd backend && npm install`

**Port 3001 déjà utilisé**
→ Changer PORT dans `backend/server.js` et `frontend/js/api.js`

**Database locked**
→ Fermer les autres connexions, relancer le serveur

---

**Prêt pour continuer avec les vues et modals !** 🚀
