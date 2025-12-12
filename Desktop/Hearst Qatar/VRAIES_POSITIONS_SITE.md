# 📍 VRAIES POSITIONS DU SITE - Vue de Dessus

## Système de Coordonnées 3D
- **X** : Axe horizontal (Ouest ← → Est)
- **Y** : Axe vertical (Bas ↓ ↑ Haut) - toujours Y=0 pour le sol
- **Z** : Axe de profondeur (Sud ↑ ↓ Nord)

---

## 🗺️ PLAN ASCII DU SITE (Vue de Dessus)

```
                        Z NORD (positif) ↓
                              
    X=-110  X=-87  X=-75  X=-37  X=-25  X=13  X=25  X=63  X=75  X=87  X=110
    
Z=60    ╔════════════════════ SUBSTATION 200MW ════════════════════╗
        ║                      [0, 0, 60]                          ║
        ╚══════════════════════════════════════════════════════════╝
        
Z=35    ┌─────┐           ┌─────┐           ┌─────┐           ┌─────┐
        │ PB1 │           │ PB2 │           │ PB3 │           │ PB4 │
        └─────┘           └─────┘           └─────┘           └─────┘
        [-75]             [-25]             [25]              [75]

Z=20
                                                        
Z=0    ────────────────────────────────────────────────────────────── (Centre)

Z=-15  [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]  ← Rangée 1
       -87  -75  -63    -37  -25  -13    13   25   37     63   75   87

Z=-35  [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]  ← Rangée 2
       -87  -75  -63    -37  -25  -13    13   25   37     63   75   87

Z=-55  [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]  ← Rangée 3
       -87  -75  -63    -37  -25  -13    13   25   37     63   75   87

Z=-75  [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]  ← Rangée 4
       -87  -75  -63    -37  -25  -13    13   25   37     63   75   87

Z=-85  ════════════════════════════════════════════════════════════════

Z=-110 ┌──────────────┐                                    ┌──────────────┐
       │   BÂTIMENT   │                                    │   BÂTIMENT   │
       │   PERSONNEL  │  (rotation -90° dans le code)      │  MAINTENANCE │
       │              │                                    │              │
       └──────────────┘                                    └──────────────┘
     Position dans groupe:                               Position dans groupe:
     LOCAL [-45, 0, -110]                               LOCAL [-45, 0, 110]
     
     GLOBAL RÉEL:                                        GLOBAL RÉEL:
     [-110, 0, 45] environ                              [110, 0, 45] environ

```

**Légende:**
- `[C]` = Container HD5
- `[T]` = Transformateur
- `PB` = Power Block

---

## 📊 POSITIONS EXACTES (Coordonnées Globales)

### SUBSTATION
```
Position: [0, 0, 60]
Dimensions: 40m × 15m
```

### POWER BLOCKS
```
PB1: [-75, 0, 35]
PB2: [-25, 0, 35]
PB3: [25, 0, 35]
PB4: [75, 0, 35]
```

### CONTAINERS HD5 (48 au total)
**4 Power Blocks × 4 Transformers × 2 Containers (A/B)**

#### Power Block 1 (X=-75)
```
Rangée 1 (Z=-15): Container A [-87, 0, -15], Container B [-63, 0, -15]
Rangée 2 (Z=-35): Container A [-87, 0, -35], Container B [-63, 0, -35]
Rangée 3 (Z=-55): Container A [-87, 0, -55], Container B [-63, 0, -55]
Rangée 4 (Z=-75): Container A [-87, 0, -75], Container B [-63, 0, -75]
```

#### Power Block 2 (X=-25)
```
Rangée 1 (Z=-15): Container A [-37, 0, -15], Container B [-13, 0, -15]
Rangée 2 (Z=-35): Container A [-37, 0, -35], Container B [-13, 0, -35]
Rangée 3 (Z=-55): Container A [-37, 0, -55], Container B [-13, 0, -55]
Rangée 4 (Z=-75): Container A [-37, 0, -75], Container B [-13, 0, -75]
```

#### Power Block 3 (X=25)
```
Rangée 1 (Z=-15): Container A [13, 0, -15], Container B [37, 0, -15]
Rangée 2 (Z=-35): Container A [13, 0, -35], Container B [37, 0, -35]
Rangée 3 (Z=-55): Container A [13, 0, -55], Container B [37, 0, -55]
Rangée 4 (Z=-75): Container A [13, 0, -75], Container B [37, 0, -75]
```

#### Power Block 4 (X=75)
```
Rangée 1 (Z=-15): Container A [63, 0, -15], Container B [87, 0, -15]
Rangée 2 (Z=-35): Container A [63, 0, -35], Container B [87, 0, -35]
Rangée 3 (Z=-55): Container A [63, 0, -55], Container B [87, 0, -55]
Rangée 4 (Z=-75): Container A [63, 0, -75], Container B [87, 0, -75]
```

### BÂTIMENTS INDUSTRIELS

**⚠️ ATTENTION : Ces bâtiments sont dans des groupes avec rotation -90°**

#### Bâtiment Personnel
```
Position dans le code (locale): [-45, 0, -110]
Groupe: rotation [0, -Math.PI/2, 0]
Position globale APPROXIMATIVE: [-110, 0, 45]
Dimensions: 54.8m × 15m × 14m (4 étages)
```

#### Bâtiment Maintenance
```
Position dans le code (locale): [-45, 0, 110]
Groupe: rotation [0, -Math.PI/2, 0]
Position globale APPROXIMATIVE: [110, 0, 45]
Dimensions: 54.8m × 15m × 14m (4 étages)
```

---

## 🔄 ROTATIONS ET POSITIONS GLOBALES

### Tableau Récapitulatif des Rotations

| Élément | Rotation | Type | Position Locale | Position Globale | Notes |
|---------|----------|------|-----------------|-----------------|-------|
| **Substation 200MW** | `0°` | Aucune | `[0, 0, 60]` | `[0, 0, 60]` | Aligné avec les axes |
| **Power Blocks (1-4)** | `0°` | Aucune | `[X, 0, 35]` | `[X, 0, 35]` | Alignés avec les axes |
| **Containers HD5** | `0°` | Aucune | `[X, 0, Z]` | `[X, 0, Z]` | Alignés avec les axes |
| **Transformateurs** | `0°` | Aucune | `[X, 0, Z]` | `[X, 0, Z]` | Alignés avec les axes |
| **Switchgears** | `0°` | Aucune | `[X, 0, Z]` | `[X, 0, Z]` | Alignés avec les axes |
| **Bâtiment Personnel** | `-90°` (Y) | Rotation groupe | `[-45, 0, -110]` | `~[-110, 0, 45]` | Dans un `<group rotation={[0, -Math.PI/2, 0]}>` |
| **Bâtiment Maintenance** | `-90°` (Y) | Rotation groupe | `[-45, 0, 110]` | `~[110, 0, 45]` | Dans un `<group rotation={[0, -Math.PI/2, 0]}>` |

### Calcul des Positions Globales avec Rotation

Les bâtiments industriels sont placés dans des groupes avec une rotation de `-90°` autour de l'axe Y. Cette rotation transforme les coordonnées locales en coordonnées globales.

#### Formule de Transformation

Pour une rotation de `-90°` autour de l'axe Y (rotation `[0, -Math.PI/2, 0]`) :

```
Position locale: [x_local, y_local, z_local]
Rotation: [0, -90°, 0] = [0, -Math.PI/2, 0]

Position globale calculée:
x_global = -z_local
y_global = y_local
z_global = x_local
```

#### Bâtiment Personnel - Calcul Détaillé

**Dans le code (AutoPlacedScene3D.tsx) :**
```tsx
<group rotation={[0, -Math.PI/2, 0]}>
  <IndustrialBuilding
    position={[-45, 0, -110]}  // Position locale
    type="personnel"
  />
</group>
```

**Transformation :**
- Position locale : `[-45, 0, -110]`
- Rotation : `-90°` (Y)
- Position globale calculée : `[110, 0, -45]`
- Position globale approximative observée : `[-110, 0, 45]`

**Note :** La position globale réelle dépend de l'origine du groupe. La position approximative `[-110, 0, 45]` est basée sur l'observation visuelle dans la scène 3D.

#### Bâtiment Maintenance - Calcul Détaillé

**Dans le code (AutoPlacedScene3D.tsx) :**
```tsx
<group rotation={[0, -Math.PI/2, 0]}>
  <IndustrialBuilding
    position={[-45, 0, 110]}  // Position locale
    type="maintenance"
  />
</group>
```

**Transformation :**
- Position locale : `[-45, 0, 110]`
- Rotation : `-90°` (Y)
- Position globale calculée : `[-110, 0, -45]`
- Position globale approximative observée : `[110, 0, 45]`

**Note :** La position globale réelle dépend de l'origine du groupe. La position approximative `[110, 0, 45]` est basée sur l'observation visuelle dans la scène 3D.

### Diagramme avec Points Cardinaux

```
                    ═══════════════════════════════════════════════════════
                    ║                    NORD (Z+)                        ║
                    ║                      ↑                              ║
                    ║                      │                              ║
                    ═══════════════════════════════════════════════════════
                              
    OUEST (X-) ←─────────────────────────────────────────────────→ EST (X+)
    
                    ═══════════════════════════════════════════════════════
                    ║                    SUD (Z-)                        ║
                    ║                      ↓                              ║
                    ═══════════════════════════════════════════════════════
```

### Localisation Cardinale des Éléments

#### Zone NORD (Z > 0)
- **Substation 200MW** : `[0, 0, 60]` - **NORD, CENTRE horizontal**
- **Power Blocks** : Z = 35 - **NORD**
  - PB1 : `[-75, 0, 35]` - **OUEST, NORD**
  - PB2 : `[-25, 0, 35]` - **OUEST-CENTRE, NORD**
  - PB3 : `[25, 0, 35]` - **EST-CENTRE, NORD**
  - PB4 : `[75, 0, 35]` - **EST, NORD**
- **Bâtiment Personnel** : `~[-110, 0, 45]` - **OUEST, NORD**
- **Bâtiment Maintenance** : `~[110, 0, 45]` - **EST, NORD**

#### Zone SUD (Z < 0)
- **Containers HD5** : Z = -15, -35, -55, -75 - **SUD**
- **Transformateurs** : Z = -15, -35, -55, -75 - **SUD**
- **Switchgears** : Z = -15, -35, -55, -75 - **SUD**

#### Zone OUEST (X < 0)
- **Power Block 1** : `[-75, 0, 35]`
- **Power Block 2** : `[-25, 0, 35]`
- **Bâtiment Personnel** : `~[-110, 0, 45]`
- **Containers PB1 et PB2** : X entre -87 et -13

#### Zone EST (X > 0)
- **Power Block 3** : `[25, 0, 35]`
- **Power Block 4** : `[75, 0, 35]`
- **Bâtiment Maintenance** : `~[110, 0, 45]`
- **Containers PB3 et PB4** : X entre 13 et 87

### Notes Importantes sur les Rotations

1. **Éléments sans rotation** : La majorité des éléments (Substation, Power Blocks, Containers, Transformateurs, Switchgears) ont une rotation de `0°` et sont alignés avec les axes du système de coordonnées.

2. **Éléments avec rotation** : Seuls les deux bâtiments industriels (Personnel et Maintenance) ont une rotation de `-90°` autour de l'axe Y. Cette rotation est appliquée via un groupe parent dans le code React Three Fiber.

3. **Calcul des positions globales** : Pour les éléments avec rotation, il est important de distinguer la position locale (dans le groupe) de la position globale (dans la scène). La transformation mathématique dépend de l'origine du groupe de rotation.

4. **Référence pour développement** : Voir `REFERENCE_POSITIONS_COMPLETE.md` pour une documentation complète du système de coordonnées et des rotations.

---

## 🅿️ ZONES DISPONIBLES POUR PARKING

### ❌ ZONES OCCUPÉES (NE PAS METTRE LE PARKING)
```
X = -87 à -63 : Zone containers PB1
X = -37 à -13 : Zone containers PB2
X = 13 à 37   : Zone containers PB3
X = 63 à 87   : Zone containers PB4
Z = -75 à -15 : Toutes les rangées de containers
```

### ✅ ZONES LIBRES (OK pour parking)

#### Option 1 : Ouest (avant containers)
```
Position: [-110, 0, 0] à [-90, 0, -10]
Avantages: Proche bâtiment Personnel, loin des containers
```

#### Option 2 : Est (après containers)  
```
Position: [95, 0, 0] à [110, 0, -10]
Avantages: Proche bâtiment Maintenance, symétrique à Option 1
```

#### Option 3 : Sud (derrière tout)
```
Position: [0, 0, -90] à [0, 0, -100]
Avantages: Ne gêne personne, zone calme
```

#### Option 4 : Entre PB1 et PB2
```
Position: [-50, 0, 0] à [-50, 0, -10]
Avantages: Central, entre deux power blocks
```

#### Option 5 : Entre PB3 et PB4
```
Position: [50, 0, 0] à [50, 0, -10]
Avantages: Central Est, symétrique à Option 4
```

---

## 🚨 PROBLÈME ACTUEL

**Position actuelle du parking : [85, 0, -20]**

❌ **CONFLIT DÉTECTÉ !**
```
X=85 est dans la zone des containers du Power Block 4 (X=63 à X=87)
Z=-20 est entre la rangée 1 (Z=-15) et la rangée 2 (Z=-35)
→ Le parking est AU MILIEU des containers !
```

---

## ✅ RECOMMANDATIONS

Je recommande **Option 2** ou **Option 1** :

### Option 2 (RECOMMANDÉE) - Parking Est
```
Position: [100, 0, 0]
Dimensions: 30m × 15m
Capacité: 30 places
```
- À l'EST du dernier container (X=87)
- Espace libre : X=90 à X=110
- Proche du bâtiment Maintenance

### Option 1 - Parking Ouest  
```
Position: [-100, 0, 0]
Dimensions: 30m × 15m
Capacité: 30 places
```
- À l'OUEST du premier container (X=-87)
- Espace libre : X=-110 à X=-90
- Proche du bâtiment Personnel

---

**Quelle position voulez-vous ?**

