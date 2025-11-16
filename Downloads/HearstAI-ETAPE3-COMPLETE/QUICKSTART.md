# 🚀 GUIDE DE DÉMARRAGE RAPIDE

## Claude CI/CD Cockpit - Étape 3 Terminée

### ✅ Fichiers créés

```
📦 claude-cicd-cockpit/
├── 📄 dev-server.js              # Serveur de développement
├── 📄 README_STEP3.md            # Documentation étape 3
├── 📄 QUICKSTART.md              # Ce fichier
└── 📁 frontend/
    ├── 📄 index.html             # Application principale
    ├── 📄 preview.html           # Prévisualisation des composants
    ├── 📁 css/
    │   ├── 📄 main.css           # Styles layout
    │   └── 📄 components.css     # Styles composants
    └── 📁 js/
        ├── 📄 app.js             # Application JS
        └── 📁 views/
            └── 📄 dashboard.js   # Vue Dashboard
```

---

## 🏃 Lancer l'application (2 méthodes)

### Méthode 1 : Serveur Node.js (recommandé)

```bash
# Depuis le dossier du projet
node dev-server.js
```

Puis ouvrir dans le navigateur :
- **Application:** http://localhost:3000
- **Composants:** http://localhost:3000/preview.html

### Méthode 2 : Directement dans le navigateur

Ouvrir simplement le fichier `frontend/index.html` dans votre navigateur.

⚠️ **Note:** Certaines fonctionnalités peuvent ne pas marcher correctement en mode "file://" à cause des modules ES6. Utilisez le serveur Node.js pour une expérience complète.

---

## 🎨 Aperçu du Cockpit

### Layout
- ✅ **Sidebar** fixe 260px avec navigation
- ✅ **Header** sticky avec titre dynamique et bouton d'action
- ✅ **Content area** responsive avec scroll

### Vues disponibles
1. **Dashboard** ✅ (100% fonctionnel)
   - 4 stat cards (Projects, Jobs Running, Success Rate, Versions)
   - Liste des projets récents (cards)
   - Liste des jobs récents (table)
   
2. **Projects** ⏳ (placeholder)
3. **Jobs** ⏳ (placeholder)
4. **Versions** ⏳ (placeholder)
5. **Prompts** ⏳ (placeholder)
6. **Logs** ⏳ (placeholder)

### Composants UI
- ✅ Boutons (6 variantes : primary, success, danger, secondary, ghost, disabled)
- ✅ Cards (avec header/body/footer)
- ✅ Tables (avec hover states)
- ✅ Badges (5 couleurs + variante dot)
- ✅ Forms (input, select, textarea)
- ✅ Alerts (4 types)
- ✅ Modals (structure CSS prête)

---

## 🎯 Tester la navigation

1. Cliquer sur les éléments de la sidebar → change de vue
2. Le titre du header s'adapte automatiquement
3. Le bouton d'action principal change selon la vue
4. Les stats se mettent à jour toutes les 30s

---

## 🔍 Page de prévisualisation

Pour voir **tous les composants UI** en un coup d'œil :

👉 **http://localhost:3000/preview.html**

Cette page montre :
- Tous les styles de boutons
- Tous les badges
- Cards
- Tables
- Alerts
- Forms

---

## 📊 Données actuelles

**⚠️ IMPORTANT:** Toutes les données affichées sont actuellement des **données mock** définies dans `js/app.js`.

Elles seront remplacées par de vrais appels API à **l'Étape 4**.

---

## 🔜 Prochaine étape

**Étape 4 :** Connexion Frontend ↔ Backend

On va créer :
1. Backend Node.js + Express avec les vrais endpoints API
2. Connexion du frontend au backend
3. Implémentation des vues manquantes (Projects, Jobs, Versions, Prompts, Logs)
4. Modals fonctionnels
5. Gestion des erreurs

---

## 💡 Notes techniques

### Architecture frontend
- **Vanilla JavaScript** (ES6 modules)
- **Routeur client-side** simple (hash-based)
- **Pas de framework** lourd (Vanilla JS pur)
- **Modulaire** : une vue = un fichier

### CSS
- **Variables CSS** pour thème
- **Grid & Flexbox** pour layout
- **Mobile-first** responsive
- **Thème sombre** premium

### Performance
- Aucune dépendance externe
- CSS < 10KB
- JS minimaliste
- Chargement instantané

---

## 🐛 Troubleshooting

**Problème:** Les modules ES6 ne chargent pas
- **Solution:** Utiliser le serveur Node.js (`node dev-server.js`) au lieu d'ouvrir directement le fichier HTML

**Problème:** Le port 3000 est déjà utilisé
- **Solution:** Modifier `PORT = 3000` dans `dev-server.js`

**Problème:** Les styles ne s'appliquent pas
- **Solution:** Vérifier que les chemins dans `index.html` pointent bien vers `css/main.css` et `css/components.css`

---

## ✨ Validation Étape 3

- ✅ Architecture frontend complète
- ✅ Design professionnel sombre/premium
- ✅ Navigation fonctionnelle
- ✅ Vue Dashboard 100% opérationnelle
- ✅ Tous les composants UI prêts
- ✅ Responsive
- ✅ Code propre et modulaire

**🎉 Étape 3 terminée avec succès !**

Prêt pour l'Étape 4 quand tu veux.
