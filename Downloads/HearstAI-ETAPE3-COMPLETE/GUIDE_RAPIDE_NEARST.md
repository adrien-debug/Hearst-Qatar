# ⚡ GUIDE RAPIDE — CHARTE NEARST

## 🎨 LA CHARTE EN 30 SECONDES

### Couleurs principales
```
VERT MENTHE  #7bed9f  ⬤  → Accent principal (boutons, nav active)
NOIR PUR     #0a0a0a  ⬤  → Background primary
NOIR DOUX    #1a1a1a  ⬤  → Background secondary (sidebar, cards)
BLANC        #ffffff  ⬤  → Texte principal
GRIS CLAIR   #b8b8b8  ⬤  → Texte secondaire
```

### Règles d'or
1. **Nav active** = VERT MENTHE complet (background + texte noir)
2. **Bouton primary** = VERT MENTHE (texte noir)
3. **Logo** = Text-only "CLAUDE CI/CD" uppercase
4. **Icônes** = Unicode minimalistes (⌂ ◫ ⚡ ◉)
5. **Badges** = UPPERCASE + border

---

## 🚀 LANCER L'APPLICATION

```bash
node dev-server.js
```

Ouvrir : **http://localhost:3000**

---

## 📁 FICHIERS MODIFIÉS

- `/css/main.css` → Variables + Layout NEARST
- `/css/components.css` → Composants
- `/index.html` → Logo + icônes
- `/preview.html` → Logo + icônes  
- `/js/views/dashboard.js` → Styles

---

## ✅ CHECKLIST VISUELLE

Quand tu ouvres l'app, tu dois voir :
- ✅ Sidebar noire (200px)
- ✅ Logo "CLAUDE CI/CD" uppercase sans icône
- ✅ Icônes minimalistes (⌂ ◫ ⚡)
- ✅ Nav "Home" avec **fond VERT MENTHE**
- ✅ Boutons verts avec texte noir
- ✅ Noir profond partout

---

## 🎯 COMPOSANTS CLÉS

### Bouton Primary
```css
background: #7bed9f;  /* Vert menthe */
color: #0a0a0a;       /* Texte noir */
```

### Nav Active
```css
background: #7bed9f;  /* Vert menthe */
color: #0a0a0a;       /* Texte noir */
```

### Badge Success
```css
background: rgba(123, 237, 159, 0.15);
color: #7bed9f;
border: 1px solid rgba(123, 237, 159, 0.3);
text-transform: uppercase;
```

---

## 📝 NOTES IMPORTANTES

⚠️ **Texte sur vert menthe** = TOUJOURS noir `#0a0a0a`
⚠️ **Badges** = TOUJOURS uppercase
⚠️ **Icônes** = Unicode minimalistes, pas d'emoji

---

C'est tout ! Le cockpit a maintenant le look NEARST. 🎉
