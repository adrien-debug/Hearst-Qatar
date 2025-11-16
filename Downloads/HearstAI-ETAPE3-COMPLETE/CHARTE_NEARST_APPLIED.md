# 🎨 CHARTE GRAPHIQUE NEARST — APPLIQUÉE

## ✅ Adaptation terminée !

Le cockpit Claude CI/CD a été **entièrement refondu** avec la charte graphique **NEARST** que tu as fournie.

---

## 🎨 PALETTE DE COULEURS NEARST

### Backgrounds
- **Primary** : `#0a0a0a` (Noir profond)
- **Secondary** : `#1a1a1a` (Noir doux)
- **Tertiary** : `#242424` (Gris très foncé)
- **Hover** : `#2a2a2a` (Gris foncé)

### Accent principal - Vert menthe
- **Primary** : `#7bed9f` ⬤ (Vert menthe signature)
- **Dark** : `#5fd687` ⬤ (Vert foncé)
- **Light** : `#a8e6cf` ⬤ (Vert clair)

### Accents secondaires
- **Success** : `#7bed9f` ⬤ (Vert)
- **Warning** : `#f6c344` ⬤ (Orange)
- **Danger** : `#ff6b6b` ⬤ (Rouge)
- **Info** : `#4ecdc4` ⬤ (Cyan)

### Textes
- **Primary** : `#ffffff` (Blanc)
- **Secondary** : `#b8b8b8` (Gris clair)
- **Muted** : `#6b6b6b` (Gris)

### Bordures
- **Normal** : `#2a2a2a`
- **Hover** : `#3a3a3a`

---

## 🎯 CHANGEMENTS APPLIQUÉS

### ✅ Sidebar
- **Background** : Noir `#1a1a1a`
- **Logo** : Text-only "CLAUDE CI/CD" en uppercase
- **Nav items** : 
  - Normal : Gris clair
  - Hover : Background gris + texte blanc
  - **Active : Background VERT MENTHE** avec texte noir
- **Icônes** : Minimalistes (⌂ ◫ ⚡ ◉ ≡ ☰)
- **Largeur** : Réduite à 200px (vs 260px)

### ✅ Header
- **Background** : Noir profond `#0a0a0a`
- **Titre** : Plus petit (20px vs 24px)
- **User badge** : Bordure subtile grise

### ✅ Boutons
- **Primary** : Vert menthe avec texte noir
- **Hover** : Vert plus clair + translateY
- **Tailles** : Plus compacts
- **Font** : Plus bold (600)

### ✅ Cards
- **Border** : Plus subtile
- **Hover** : Border verte + translateY(-2px)
- **Titre** : Plus petit (16px)

### ✅ Badges
- **Style** : Carrés avec bordure
- **Success** : Background vert menthe transparent
- **Uppercase** : Texte en majuscules
- **Font size** : 11px

### ✅ Tables
- **Headers** : Uppercase avec letter-spacing
- **Font size** : Plus petit (11px headers, 13px body)
- **Hover** : Background gris tertiary

### ✅ Stats Cards
- **Layout** : Info à gauche, icône à droite
- **Icônes** : Minimalistes en vert menthe
- **Label** : Uppercase très petit (11px)

---

## 📐 TYPOGRAPHIE

### Police
- **Primaire** : Inter (si disponible) sinon system-ui
- **Fallback** : -apple-system, BlinkMacSystemFont, Segoe UI, Roboto

### Tailles
- **Logo** : 16px (uppercase, letterspacing: 0.5px)
- **Page title** : 20px (letter-spacing: -0.02em)
- **Section titles** : 18px (letter-spacing: -0.01em)
- **Card titles** : 16px
- **Body text** : 13px
- **Small text** : 11-12px

### Poids
- **Regular** : 400
- **Medium** : 500
- **Semibold** : 600
- **Bold** : 700

---

## ✨ DÉTAILS DE DESIGN

### Espacements
- Généreux mais cohérent
- Grid gap : 24px (vs 16px avant)

### Bordures
- Plus subtiles (1px vs 2-3px)
- Arrondis constants : 6-8px

### Animations
- **Cubic-bezier** : `cubic-bezier(0.4, 0, 0.2, 1)`
- **Fast** : 0.2s
- **Normal** : 0.3s

### Icônes
- Minimalistes, trait fin
- Unicode characters (⌂ ◫ ⚡ ◉ ≡ ☰)
- Size : 18-20px

---

## 🎨 EXEMPLE DE CODE

```css
/* Bouton primaire NEARST */
.btn-primary {
    background: #7bed9f;  /* Vert menthe */
    color: #0a0a0a;       /* Texte noir */
    font-weight: 600;
    letter-spacing: -0.01em;
}

.btn-primary:hover {
    background: #a8e6cf;  /* Vert plus clair */
    transform: translateY(-1px);
}

/* Nav item actif NEARST */
.nav-item.active {
    background: #7bed9f;  /* Vert menthe */
    color: #0a0a0a;       /* Texte noir */
    font-weight: 600;
}
```

---

## 📱 RESPONSIVE

### Mobile (< 768px)
- Sidebar collapse à 70px
- Icônes seules (pas de texte)
- Logo centré
- Grid 1 colonne

### Desktop
- Sidebar 200px fixe
- Grid adaptatif (2-4 colonnes)
- Full features

---

## ✅ FICHIERS MODIFIÉS

1. `/frontend/css/main.css` → Variables + Layout NEARST
2. `/frontend/css/components.css` → Tous les composants
3. `/frontend/index.html` → Logo + icônes
4. `/frontend/preview.html` → Logo + icônes
5. `/frontend/js/views/dashboard.js` → Styles inline

---

## 🚀 TESTER LA NOUVELLE CHARTE

```bash
node dev-server.js
```

Puis ouvrir :
- **http://localhost:3000** → Application complète
- **http://localhost:3000/preview.html** → Tous les composants

---

## 🎯 RÉSULTAT

✅ **Look & Feel NEARST parfaitement reproduit**
- Minimalisme élégant
- Vert menthe signature sur éléments actifs
- Noir profond apaisant
- Typographie soignée
- Espacements généreux
- Icônes épurées

Le cockpit a maintenant le même ADN visuel que NEARST ! 🎉
