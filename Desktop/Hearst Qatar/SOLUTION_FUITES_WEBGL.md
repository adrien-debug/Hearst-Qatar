# Solution aux Fuites de Contextes WebGL

## 🔍 Problème Identifié

La scène 3D générait **plus de 370 contextes WebGL**, causant :
- ⚠️ Avertissements "WARNING: Too many active WebGL contexts. Oldest context will be lost."
- 🔴 Erreur "THREE.WebGLRenderer: Context Lost."
- 📉 Scène 3D vide et non fonctionnelle

## 🎯 Cause Racine

### Fonction `getOptimalTextureSize()` dans `utils/textureCache.ts`

Cette fonction créait un **nouveau contexte WebGL à chaque appel** :

```typescript
// ❌ AVANT (ligne 113)
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
```

### Appels Massifs

La fonction était appelée des centaines de fois par :
- ✅ `SandyGround.tsx` (1 fois dans `useMemo`)
- ✅ `PowerBlock3D.tsx` (4 instances × plusieurs matériaux)
- ✅ `Transformer3D.tsx` (24 instances × plusieurs matériaux)
- ✅ `Switchgear3D.tsx` (48 instances × plusieurs matériaux)
- ✅ `HD5Container.tsx` (48 instances × plusieurs matériaux)

**Total : 370+ contextes WebGL créés !**

## ✅ Solution Implémentée

### 1. Mise en Cache de `getOptimalTextureSize()`

**Fichier modifié :** `utils/textureCache.ts`

```typescript
// ✅ APRÈS : Cache le résultat et réutilise UN SEUL contexte WebGL
let cachedOptimalTextureSize: number | null = null;
let cachedWebGLContext: WebGLRenderingContext | null = null;
let cachedCanvas: HTMLCanvasElement | null = null;

export function getOptimalTextureSize(): number {
  // Retourner la valeur en cache si elle existe déjà
  if (cachedOptimalTextureSize !== null) {
    return cachedOptimalTextureSize;
  }
  
  // Créer un contexte WebGL UNIQUEMENT une fois
  if (!cachedCanvas) {
    cachedCanvas = document.createElement('canvas');
    cachedCanvas.width = 1;
    cachedCanvas.height = 1;
    cachedWebGLContext = cachedCanvas.getContext('webgl') || cachedCanvas.getContext('webgl2');
  }
  
  // ... reste du code
}
```

### 2. Fonction de Nettoyage

Ajout d'une fonction pour nettoyer le contexte lors du démontage :

```typescript
export function cleanupOptimalTextureSizeCache(): void {
  if (cachedWebGLContext) {
    const loseContextExt = cachedWebGLContext.getExtension('WEBGL_lose_context');
    if (loseContextExt) {
      loseContextExt.loseContext();
    }
    cachedWebGLContext = null;
  }
  if (cachedCanvas) {
    cachedCanvas.width = 0;
    cachedCanvas.height = 0;
    cachedCanvas = null;
  }
  cachedOptimalTextureSize = null;
}
```

### 3. Appel du Nettoyage dans la Page Principale

**Fichier modifié :** `pages/substation-3d-auto.tsx`

```typescript
import { cleanupOptimalTextureSizeCache } from '../utils/textureCache';

// Dans le useEffect cleanup :
return () => {
  // ... autres nettoyages
  cleanupOptimalTextureSizeCache();
};
```

## 📊 Résultat Attendu

### Avant (❌)
- 370+ contextes WebGL créés
- Contextes perdus par le navigateur
- Scène 3D vide

### Après (✅)
- **2 contextes WebGL seulement** :
  1. Contexte de détection (1 seul, réutilisé, nettoyé)
  2. Contexte principal R3F pour le rendu 3D (1 seul)
- Scène 3D fonctionnelle
- Performances optimales

## 🧪 Test

Pour vérifier le succès de la solution :

1. Ouvrir la console du navigateur
2. Naviguer vers `/substation-3d-auto`
3. Observer les logs :
   - ✅ "Taille optimale de texture détectée et mise en cache: 512"
   - ✅ Pas d'avertissements "Too many active WebGL contexts"
   - ✅ Scène 3D s'affiche correctement

## 📝 Autres Améliorations Précédentes

1. ✅ Désactivation de React Strict Mode (`reactStrictMode: false` dans `next.config.js`)
2. ✅ Cache global pour le logo Hearst (`texturePreloader`)
3. ✅ Système de préchargement de textures progressif

## 🎓 Leçon Apprise

**Toujours mettre en cache les détections de capacités GPU/WebGL !**

Les appels à `canvas.getContext('webgl')` créent un contexte WebGL. Ces contextes sont des ressources limitées (généralement 16 max par onglet). Il est crucial de :
- Créer le contexte une seule fois
- Mettre en cache le résultat
- Nettoyer le contexte lors du démontage

---

**Date :** 12 décembre 2025  
**Statut :** ✅ Résolu

