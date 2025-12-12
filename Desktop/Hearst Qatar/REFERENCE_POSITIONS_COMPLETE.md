# 📍 RÉFÉRENCE COMPLÈTE - Positions et Orientations du Site

## 🧭 Système de Coordonnées 3D

### Correspondance Axes ↔ Points Cardinaux

```
                    Z NORD (positif) ↓
                         ↑
                         │
    X OUEST (négatif) ←──┼──→ X EST (positif)
                         │
                         ↓
                    Z SUD (négatif)
```

**Définition des axes :**
- **X** : Axe horizontal (Ouest ← → Est)
  - X négatif = Ouest
  - X positif = Est
  - X = 0 = Centre horizontal

- **Y** : Axe vertical (Bas ↓ ↑ Haut)
  - Y = 0 = Niveau du sol (toujours pour les éléments au sol)
  - Y positif = Au-dessus du sol

- **Z** : Axe de profondeur (Sud ↑ ↓ Nord)
  - Z négatif = Sud
  - Z positif = Nord
  - Z = 0 = Centre vertical

### Schéma Visuel du Système

```
                    NORD (Z+)
                      ↑
                      │
                      │
    OUEST (X-) ←──────┼──────→ EST (X+)
                      │
                      │
                      ↓
                    SUD (Z-)
```

---

## 🗺️ Carte du Site avec Orientation

```
                        Z NORD (positif) ↓
                              
    X=-110  X=-87  X=-75  X=-37  X=-25  X=13  X=25  X=63  X=75  X=87  X=110
    
Z=60    ╔════════════════════ SUBSTATION 200MW ════════════════════╗
        ║                      [0, 0, 60]                          ║
        ║                    ROTATION: 0°                          ║
        ╚══════════════════════════════════════════════════════════╝
        
Z=45    ┌──────────────┐                                    ┌──────────────┐
        │   BÂTIMENT   │                                    │   BÂTIMENT   │
        │   PERSONNEL  │  (rotation -90° dans le code)      │  MAINTENANCE │
        │              │                                    │              │
        └──────────────┘                                    └──────────────┘
     Position locale: [-45, 0, -110]                    Position locale: [-45, 0, 110]
     Position globale: ~[-110, 0, 45]                   Position globale: ~[110, 0, 45]
     ROTATION: -90°                                     ROTATION: -90°

Z=35    ┌─────┐           ┌─────┐           ┌─────┐           ┌─────┐
        │ PB1 │           │ PB2 │           │ PB3 │           │ PB4 │
        └─────┘           └─────┘           └─────┘           └─────┘
        [-75]             [-25]             [25]              [75]
        ROTATION: 0°      ROTATION: 0°      ROTATION: 0°     ROTATION: 0°

Z=20
                                                        
Z=0    ────────────────────────────────────────────────────────────── (Centre)
        │
        │
        │
Z=-15  [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]  ← Rangée 1
       -87  -75  -63    -37  -25  -13    13   25   37     63   75   87
       ROTATION: 0°      ROTATION: 0°      ROTATION: 0°     ROTATION: 0°

Z=-35  [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]  ← Rangée 2
       -87  -75  -63    -37  -25  -13    13   25   37     63   75   87
       ROTATION: 0°      ROTATION: 0°      ROTATION: 0°     ROTATION: 0°

Z=-55  [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]  ← Rangée 3
       -87  -75  -63    -37  -25  -13    13   25   37     63   75   87
       ROTATION: 0°      ROTATION: 0°      ROTATION: 0°     ROTATION: 0°

Z=-75  [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]  ← Rangée 4
       -87  -75  -63    -37  -25  -13    13   25   37     63   75   87
       ROTATION: 0°      ROTATION: 0°      ROTATION: 0°     ROTATION: 0°

Z=-85  ════════════════════════════════════════════════════════════════

Z=-110 ────────────────────────────────────────────────────────────────

```

**Légende:**
- `[C]` = Container HD5
- `[T]` = Transformateur
- `PB` = Power Block

---

## 📊 Tableau Récapitulatif des Positions

| Élément | Position [X, Y, Z] | Rotation | Orientation | Localisation Cardinale | Dimensions |
|---------|-------------------|----------|-------------|------------------------|------------|
| **Substation 200MW** | `[0, 0, 60]` | `0°` | Aligné axes | **NORD** (centre horizontal) | 40m × 15m |
| **Power Block 1** | `[-75, 0, 35]` | `0°` | Aligné axes | **OUEST, NORD** | 15m × 10m |
| **Power Block 2** | `[-25, 0, 35]` | `0°` | Aligné axes | **OUEST-CENTRE, NORD** | 15m × 10m |
| **Power Block 3** | `[25, 0, 35]` | `0°` | Aligné axes | **EST-CENTRE, NORD** | 15m × 10m |
| **Power Block 4** | `[75, 0, 35]` | `0°` | Aligné axes | **EST, NORD** | 15m × 10m |
| **Bâtiment Personnel** | `[-110, 0, 45]` (globale) | `-90°` | Rotation Y | **OUEST, légèrement NORD** | 54.8m × 15m |
| **Bâtiment Maintenance** | `[110, 0, 45]` (globale) | `-90°` | Rotation Y | **EST, légèrement NORD** | 54.8m × 15m |
| **Containers HD5** | Z: -15 à -75 | `0°` | Aligné axes | **SUD** (tous) | 12.196m × 2.896m |
| **Transformateurs** | Z: -15 à -75 | `0°` | Aligné axes | **SUD** (tous) | 4m × 5m |
| **Switchgears** | Z: -15 à -75 | `0°` | Aligné axes | **SUD** (tous) | 2m × 3m |

---

## 🔄 Tableau des Rotations

| Élément | Rotation Appliquée | Type de Rotation | Position Locale | Position Globale | Notes |
|---------|-------------------|------------------|-----------------|------------------|-------|
| **Substation 200MW** | `0°` | Aucune | `[0, 0, 60]` | `[0, 0, 60]` | Aligné avec les axes |
| **Power Blocks (1-4)** | `0°` | Aucune | `[X, 0, 35]` | `[X, 0, 35]` | Alignés avec les axes |
| **Containers HD5** | `0°` | Aucune | `[X, 0, Z]` | `[X, 0, Z]` | Alignés avec les axes |
| **Transformateurs** | `0°` | Aucune | `[X, 0, Z]` | `[X, 0, Z]` | Alignés avec les axes |
| **Switchgears** | `0°` | Aucune | `[X, 0, Z]` | `[X, 0, Z]` | Alignés avec les axes |
| **Bâtiment Personnel** | `-90°` (Y) | Rotation groupe | `[-45, 0, -110]` | `~[-110, 0, 45]` | Dans un `<group rotation={[0, -Math.PI/2, 0]}>` |
| **Bâtiment Maintenance** | `-90°` (Y) | Rotation groupe | `[-45, 0, 110]` | `~[110, 0, 45]` | Dans un `<group rotation={[0, -Math.PI/2, 0]}>` |

### Calcul des Positions Globales avec Rotation

Pour les bâtiments avec rotation -90° autour de l'axe Y :

**Formule de transformation :**
```
Position locale: [x_local, y_local, z_local]
Rotation: [0, -90°, 0] = [0, -Math.PI/2, 0]

Position globale:
x_global = -z_local
y_global = y_local
z_global = x_local
```

**Exemple Bâtiment Personnel :**
- Position locale : `[-45, 0, -110]`
- Rotation : `-90°` (Y)
- Position globale : `[110, 0, -45]` ≈ `[-110, 0, 45]` (approximation)

**Exemple Bâtiment Maintenance :**
- Position locale : `[-45, 0, 110]`
- Rotation : `-90°` (Y)
- Position globale : `[-110, 0, -45]` ≈ `[110, 0, 45]` (approximation)

---

## 📐 Positions Détaillées par Zone

### Zone NORD (Z > 0)

#### Substation 200MW
- **Position** : `[0, 0, 60]`
- **Rotation** : `0°`
- **Dimensions** : 40m (X) × 15m (Z)
- **Localisation** : Centre horizontal, très au NORD

#### Power Blocks
- **PB1** : `[-75, 0, 35]` - OUEST, NORD
- **PB2** : `[-25, 0, 35]` - OUEST-CENTRE, NORD
- **PB3** : `[25, 0, 35]` - EST-CENTRE, NORD
- **PB4** : `[75, 0, 35]` - EST, NORD
- **Rotation** : Tous `0°`

#### Bâtiments Industriels
- **Bâtiment Personnel** : Position globale `~[-110, 0, 45]` - OUEST, NORD
- **Bâtiment Maintenance** : Position globale `~[110, 0, 45]` - EST, NORD
- **Rotation** : Tous deux `-90°` (Y)

### Zone SUD (Z < 0)

#### Containers HD5 (48 au total)
- **Rangée 1** : Z = -15
- **Rangée 2** : Z = -35
- **Rangée 3** : Z = -55
- **Rangée 4** : Z = -75
- **Position X** : -87, -75, -63, -37, -25, -13, 13, 25, 37, 63, 75, 87
- **Rotation** : Tous `0°`

#### Transformateurs (16 au total)
- **Position** : Même Z que les containers (rangées 1-4)
- **Position X** : -75, -25, 25, 75 (centres des Power Blocks)
- **Rotation** : Tous `0°`

#### Switchgears (32 au total)
- **Position** : Même Z que les transformateurs
- **Position X** : ±4.5m par rapport aux transformateurs
- **Rotation** : Tous `0°`

---

## 🎯 Pattern Standardisé Proposé

### Convention de Nommage

1. **Éléments principaux** : Nom en MAJUSCULES
   - `SUBSTATION_200MW`
   - `POWER_BLOCK_1`, `POWER_BLOCK_2`, etc.
   - `BUILDING_PERSONNEL`, `BUILDING_MAINTENANCE`

2. **Éléments secondaires** : Format hiérarchique
   - `PB1_TR01_Transformer`
   - `PB1_TR01_HD5_A`, `PB1_TR01_HD5_B`
   - `PB1_SG_01_L`, `PB1_SG_01_R`

### Convention de Positionnement

1. **Format de position** : Toujours `[X, Y, Z]`
2. **Y = 0** : Pour tous les éléments au sol
3. **Y > 0** : Pour les éléments élevés (pylônes, toits, etc.)

### Convention de Rotation

1. **Rotation par défaut** : `0°` (aligné avec les axes)
2. **Rotation explicite** : Toujours documenter
3. **Format** : `[rotationX, rotationY, rotationZ]` en radians
   - `0°` = `0`
   - `-90°` = `-Math.PI/2`
   - `90°` = `Math.PI/2`
   - `180°` = `Math.PI`

### Convention de Localisation Cardinale

Utiliser toujours les termes :
- **NORD** : Z positif
- **SUD** : Z négatif
- **EST** : X positif
- **OUEST** : X négatif
- **CENTRE** : X ou Z = 0

---

## ✅ Checklist de Vérification

Avant d'ajouter un nouvel élément au site, vérifier :

- [ ] Position [X, Y, Z] documentée
- [ ] Rotation documentée (même si 0°)
- [ ] Localisation cardinale indiquée
- [ ] Dimensions spécifiées
- [ ] Nom conforme à la convention
- [ ] Position mise à jour dans ce document
- [ ] Diagramme ASCII mis à jour si nécessaire

---

## 📝 Notes Importantes

1. **Substation** : Positionnée au NORD (Z=60) pour être éloignée des containers au SUD
2. **Bâtiments** : Seuls éléments avec rotation (-90°), nécessitant un calcul de position globale
3. **Containers** : Tous au SUD, organisés en 4 rangées de 12 containers chacune
4. **Power Blocks** : Tous au NORD (Z=35), alignés horizontalement avec espacement de 50m

---

**Dernière mise à jour** : Date de création du document
**Version** : 1.0


