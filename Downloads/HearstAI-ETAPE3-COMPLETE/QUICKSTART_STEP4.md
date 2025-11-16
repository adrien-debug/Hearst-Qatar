# ⚡ DÉMARRAGE RAPIDE — ÉTAPE 4

## 🚀 Lancer le système complet en 3 étapes

### 1️⃣ Installer les dépendances backend

```bash
cd backend
npm install
```

### 2️⃣ Lancer le backend

```bash
# Depuis backend/
node server.js
```

✅ Vous devriez voir :
```
✅ Database initialized successfully
✅ Server running on: http://localhost:3001
```

### 3️⃣ Lancer le frontend

**Dans un NOUVEAU terminal :**

```bash
# Depuis la racine
node dev-server.js
```

✅ Vous devriez voir :
```
✅ Server running at: http://localhost:3000
```

### 4️⃣ Ouvrir l'application

👉 **http://localhost:3000**

---

## ✅ Vérification rapide

1. **Dashboard charge** → Stats affichées (0/0/0/0 si base vide)
2. **Console navigateur** → "✅ Backend connected"
3. **Pas d'erreur** → Tout fonctionne !

---

## 🧪 Tester l'API

### Créer un projet de test

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "type": "html_static",
    "repo_type": "local"
  }'
```

### Voir les projets

```bash
curl http://localhost:3001/api/projects
```

### Rafraîchir le dashboard

→ Les stats devraient montrer "1 project"

---

## 🐛 Problèmes ?

**"Backend connection failed"**
→ Backend pas démarré. Lancer `node server.js` dans `backend/`

**"Cannot find module"**
→ `cd backend && npm install`

**Port déjà utilisé**
→ Tuer le processus ou changer le port dans `server.js`

---

## 🎉 Félicitations !

Le cockpit fonctionne avec :
- ✅ Backend Node.js + SQLite
- ✅ Frontend connecté
- ✅ API REST opérationnelle
- ✅ Charte NEARST appliquée

**Prêt pour les vues et modals !** 🚀
