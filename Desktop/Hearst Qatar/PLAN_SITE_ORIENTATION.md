# 🗺️ Plan du Site - Orientation et Positions

## Vue de Dessus avec Points Cardinaux

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

---

## Plan Détaillé avec Tous les Éléments

```
                        ═══════════════════════════════════════════════════════
                        ║                    NORD (Z+)                        ║
                        ║                                                      ║
    X=-110  X=-87  X=-75  X=-37  X=-25  X=0   X=25  X=63  X=75  X=87  X=110
    
Z=60    ╔══════════════════════════════════════════════════════════════════╗
        ║                    SUBSTATION 200MW                              ║
        ║                      [0, 0, 60]                                  ║
        ║                    ROTATION: 0°                                  ║
        ║                  Dimensions: 40m × 15m                           ║
        ╚══════════════════════════════════════════════════════════════════╝
        
Z=45    ┌──────────────┐                                    ┌──────────────┐
        │   BÂTIMENT   │                                    │   BÂTIMENT   │
        │   PERSONNEL  │                                    │  MAINTENANCE │
        │              │                                    │              │
        │  [-110,0,45] │                                    │  [110,0,45]  │
        │  ROT: -90°   │                                    │  ROT: -90°   │
        └──────────────┘                                    └──────────────┘
        
Z=35    ┌─────┐           ┌─────┐           ┌─────┐           ┌─────┐
        │ PB1 │           │ PB2 │           │ PB3 │           │ PB4 │
        │-75  │           │-25  │           │ 25  │           │ 75  │
        │ROT:0│           │ROT:0│           │ROT:0│           │ROT:0│
        └─────┘           └─────┘           └─────┘           └─────┘
        
Z=20    ────────────────────────────────────────────────────────────────
        
Z=0     ────────────────────────────────────────────────────────────────
        │                    CENTRE (0,0,0)                              │
        │                                                                 │
Z=-15   [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]
       -87  -75  -63    -37  -25  -13    13   25   37     63   75   87
       ROT:0° ROT:0°    ROT:0° ROT:0°    ROT:0° ROT:0°    ROT:0° ROT:0°
       
Z=-35   [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]
       -87  -75  -63    -37  -25  -13    13   25   37     63   75   87
       ROT:0° ROT:0°    ROT:0° ROT:0°    ROT:0° ROT:0°    ROT:0° ROT:0°
       
Z=-55   [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]
       -87  -75  -63    -37  -25  -13    13   25   37     63   75   87
       ROT:0° ROT:0°    ROT:0° ROT:0°    ROT:0° ROT:0°    ROT:0° ROT:0°
       
Z=-75   [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]    [C]  [T]  [C]
       -87  -75  -63    -37  -25  -13    13   25   37     63   75   87
       ROT:0° ROT:0°    ROT:0° ROT:0°    ROT:0° ROT:0°    ROT:0° ROT:0°
       
                        ═══════════════════════════════════════════════════════
                        ║                    SUD (Z-)                        ║
                        ═══════════════════════════════════════════════════════
```

**Légende:**
- `[C]` = Container HD5 (rotation 0°)
- `[T]` = Transformateur (rotation 0°)
- `PB` = Power Block (rotation 0°)

---

## Zones par Orientation Cardinale

### Zone NORD (Z > 0)

#### Éléments au NORD :
1. **Substation 200MW** - `[0, 0, 60]` - Centre horizontal, très au NORD
2. **Power Blocks 1-4** - Z = 35 - Ligne horizontale au NORD
3. **Bâtiment Personnel** - `~[-110, 0, 45]` - OUEST, NORD
4. **Bâtiment Maintenance** - `~[110, 0, 45]` - EST, NORD

### Zone SUD (Z < 0)

#### Éléments au SUD :
1. **Containers HD5** - Z: -15, -35, -55, -75 (4 rangées)
2. **Transformateurs** - Z: -15, -35, -55, -75 (4 rangées)
3. **Switchgears** - Z: -15, -35, -55, -75 (4 rangées)

### Zone OUEST (X < 0)

#### Éléments à l'OUEST :
1. **Power Block 1** - `[-75, 0, 35]`
2. **Power Block 2** - `[-25, 0, 35]`
3. **Bâtiment Personnel** - `~[-110, 0, 45]`
4. **Containers PB1 et PB2** - X: -87 à -13

### Zone EST (X > 0)

#### Éléments à l'EST :
1. **Power Block 3** - `[25, 0, 35]`
2. **Power Block 4** - `[75, 0, 35]`
3. **Bâtiment Maintenance** - `~[110, 0, 45]`
4. **Containers PB3 et PB4** - X: 13 à 87

---

## Tableau de Référence Rapide

| Zone | Éléments | Coordonnées Z | Coordonnées X |
|------|----------|---------------|---------------|
| **NORD** | Substation | 60 | 0 |
| **NORD** | Power Blocks | 35 | -75, -25, 25, 75 |
| **NORD** | Bâtiment Personnel | ~45 | ~-110 |
| **NORD** | Bâtiment Maintenance | ~45 | ~110 |
| **SUD** | Containers/Transformateurs | -15, -35, -55, -75 | -87 à 87 |
| **CENTRE** | Point d'origine | 0 | 0 |

---

## Rotations par Zone

### Zone NORD - Rotations

| Élément | Rotation | Type |
|---------|----------|------|
| Substation | 0° | Aucune |
| Power Blocks | 0° | Aucune |
| Bâtiment Personnel | -90° | Rotation Y |
| Bâtiment Maintenance | -90° | Rotation Y |

### Zone SUD - Rotations

| Élément | Rotation | Type |
|---------|----------|------|
| Containers HD5 | 0° | Aucune |
| Transformateurs | 0° | Aucune |
| Switchgears | 0° | Aucune |

---

## Questions de Clarification

### 1. Position de la Substation
- **Actuelle** : NORD (Z=60)
- **Question** : Cette position est-elle correcte ? La substation doit-elle rester au NORD ?

### 2. Rotations des Bâtiments
- **Actuelle** : -90° (rotation Y)
- **Question** : Cette rotation est-elle intentionnelle ? Faut-il les aligner différemment ?

### 3. Organisation des Zones
- **Actuelle** : NORD = Infrastructure principale, SUD = Containers
- **Question** : Cette organisation est-elle la bonne ?

---

**Dernière mise à jour** : Date de création du document
**Version** : 1.0


