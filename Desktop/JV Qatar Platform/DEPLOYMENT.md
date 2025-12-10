# Guide de Déploiement sur Vercel

## Prérequis

- Compte Vercel (gratuit)
- Projet poussé sur GitHub : https://github.com/adrien-debug/JV-Qatar.git

## Déploiement via l'interface Vercel (Recommandé)

1. **Connectez-vous à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec votre compte GitHub

2. **Importez le projet**
   - Cliquez sur "Add New Project"
   - Sélectionnez le dépôt `adrien-debug/JV-Qatar`
   - Vercel détectera automatiquement Next.js

3. **Configuration du projet**
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./` (par défaut)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)
   - **Install Command** : `npm install` (par défaut)

4. **Variables d'environnement**
   - Aucune variable d'environnement requise pour ce projet

5. **Déployez**
   - Cliquez sur "Deploy"
   - Attendez la fin du build (2-3 minutes)
   - Votre site sera disponible sur une URL Vercel (ex: `jv-qatar.vercel.app`)

## Déploiement via CLI

### Installation de Vercel CLI

```bash
npm i -g vercel
```

### Déploiement

```bash
# Dans le répertoire du projet
cd "/Users/adrienbeyondcrypto/Desktop/JV Qatar Platform"

# Connexion à Vercel
vercel login

# Déploiement
vercel

# Pour un déploiement en production
vercel --prod
```

## Configuration automatique

Le projet contient déjà :
- ✅ `vercel.json` - Configuration Vercel
- ✅ `next.config.js` - Configuration Next.js optimisée
- ✅ `.gitignore` - Exclut `.next/` et `node_modules/`

## Vérification après déploiement

1. **Page d'accueil** : Redirige vers `/overview`
2. **Routes disponibles** :
   - `/overview` - Vue d'ensemble
   - `/full-view` - Plan d'implantation
   - `/blocks/[id]` - Détails d'un bloc
   - `/architecture` - Architecture
   - `/architecture-2d` - Architecture 2D
   - `/dashboard` - Dashboard
   - `/conteneurs` - Conteneurs
   - `/reseau` - Réseau

## Problèmes courants

### Erreur 404
- ✅ Résolu : Redirection côté serveur au lieu de côté client
- ✅ Configuration Vercel correcte

### Build échoue
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez les logs de build sur Vercel

### Images ne se chargent pas
- Les images doivent être dans le dossier `public/`
- Utilisez le composant `Image` de Next.js

## Mises à jour automatiques

Une fois connecté à GitHub, Vercel déploiera automatiquement :
- À chaque push sur `main`
- Pour chaque Pull Request (déploiement de prévisualisation)

## Support

- Documentation Vercel : https://vercel.com/docs
- Documentation Next.js : https://nextjs.org/docs
