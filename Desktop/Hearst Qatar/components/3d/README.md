# Composants 3D - Ferme Énergétique

Ce dossier contient les composants React Three Fiber pour la visualisation 3D de la ferme énergétique 200 MW.

## Composants

### Substation3D.tsx
Composant principal qui charge le modèle GLB ou génère une version procédurale de la ferme complète.

**Props:**
- `modelPath`: Chemin vers le fichier GLB (défaut: `/models/substation_200MW_schema.glb`)
- `onObjectClick`: Callback appelé lors du clic sur un objet
- `selectedObject`: ID de l'objet actuellement sélectionné
- `useProcedural`: Force l'utilisation de la version procédurale (défaut: true)

### PowerBlock3D.tsx
Représente un Power Block avec structure industrielle.

**Props:**
- `position`: Position 3D [x, y, z]
- `powerBlockId`: Identifiant unique
- `onSelect`: Callback de sélection
- `isSelected`: État de sélection

### Transformer3D.tsx
Modélise un transformateur industriel avec:
- Cuve principale
- 6 radiateurs verticaux
- 3 bushings HT (haut)
- 3 bushings BT (côté)
- Socle en béton

**Props:**
- `position`: Position 3D [x, y, z]
- `transformerId`: Identifiant unique
- `onSelect`: Callback de sélection
- `isSelected`: État de sélection

### HD5Container3D.tsx
Container Bitmain ANTSPACE HD5 avec dimensions exactes:
- Longueur: 12.196 m
- Largeur: 2.438 m
- Hauteur: 2.896 m

Inclut:
- Structure 40ft avec rainures
- Portes arrière
- Coffret électrique latéral
- Grilles de ventilation
- Pipes hydrauliques (entrée/sortie)
- Points d'interface (PowerIn, CoolingIn)

**Props:**
- `position`: Position 3D [x, y, z]
- `containerId`: Identifiant unique
- `onSelect`: Callback de sélection
- `isSelected`: État de sélection

### OptimizedHD5Container.tsx
Version optimisée utilisant l'instancing pour améliorer les performances avec 48 containers.

### SubstationContainer3D.tsx
**Nouveau composant** - Base avec panneaux bleus + Sous-station blanche empilée au-dessus.

Représente fidèlement la structure visible sur l'image de référence :
- **Base - Conteneur avec panneaux bleus (unité inférieure)** :
  - Plus large (2.6m) et moins haut (2.2m) que le standard
  - 8 panneaux bleus inclinés vers l'intérieur (bleu foncé #1e40af)
  - Partie supérieure ouverte avec 14 compartiments noirs (serveurs dans liquide d'immersion)
  - Barres transversales blanches supportant la structure
  - Extrémité droite: système de ventilation avec grille blanche et serpentins métalliques, "BITMAIN"
  - Extrémité gauche: marquage "HDS-R" vertical
  - Logo "ANT SPACE" au centre sur le cadre supérieur

- **Sous-station - Conteneur blanc standard (unité supérieure)** :
  - Plus étroit (2.438m) et plus haut (2.896m) que la base
  - Conteneur maritime standard fermé avec nervures horizontales (tôle ondulée)
  - Extrémité droite: deux grandes ouvertures carrées superposées avec grilles sombres (ventilateurs)
  - Petits conduits/tuyaux près de la base
  - Toit plat ondulé avec petit boîtier de ventilation courbé

**Dimensions:**
- Base: 12.196m × 2.6m × 2.2m (plus large, moins haut)
- Sous-station: 12.196m × 2.438m × 2.896m (plus étroit, plus haut)

**Props:**
- `position`: Position 3D [x, y, z]
- `containerId`: Identifiant unique
- `onSelect`: Callback de sélection
- `isSelected`: État de sélection

**Utilisation:**
```tsx
import SubstationContainer3D from '../components/3d/SubstationContainer3D';

<SubstationContainer3D 
  position={[0, 0, 0]}
  containerId="SUBSTATION_CONTAINER_001"
  onSelect={(id) => console.log(id)}
  isSelected={false}
/>
```

## Optimisations

1. **Instancing**: Utilisé pour les containers HD5 identiques
2. **Frustum Culling**: Les objets hors champ de vision ne sont pas rendus
3. **LOD (Level of Detail)**: À implémenter pour les vues éloignées
4. **Texture Atlasing**: Regrouper les textures pour réduire les appels de rendu

## Utilisation

```tsx
import Substation3D from '../components/3d/Substation3D';

<Canvas>
  <Substation3D 
    onObjectClick={(name) => console.log(name)}
    selectedObject={selectedId}
  />
</Canvas>
```

## Notes

- La version procédurale est utilisée par défaut si le modèle GLB n'est pas disponible
- Tous les composants supportent l'interactivité (clic, hover)
- Les matériaux utilisent PBR (Physically Based Rendering)

