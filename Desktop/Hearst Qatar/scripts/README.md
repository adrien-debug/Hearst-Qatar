# Scripts d'Export

## generate-glb.js

Script pour générer les données de structure (JSON) qui peuvent être utilisées pour créer le modèle GLB dans Blender.

### Utilisation

```bash
node scripts/generate-glb.js
```

Ce script génère un fichier `public/models/structure-data.json` contenant toutes les positions et dimensions des éléments.

## Note importante

**Je ne peux pas créer directement un fichier GLB binaire** car :
- Les fichiers GLB sont des fichiers binaires complexes
- Ils nécessitent Blender ou un outil de modélisation 3D
- La création nécessite des outils spécialisés (gltf-pipeline, etc.)

### Solution recommandée

1. **Utiliser la version procédurale** (déjà fonctionnelle dans le navigateur)
2. **Modéliser dans Blender** selon `BLENDER_CHECKLIST.md`
3. **Exporter depuis Blender** vers `public/models/substation_200MW_schema.glb`

### Alternative : Utiliser un service en ligne

Si vous voulez éviter Blender, vous pouvez :
- Utiliser des outils en ligne comme https://gltf.report/
- Utiliser des bibliothèques comme `gltf-pipeline` (nécessite Node.js)
- Utiliser Three.js pour exporter (mais limité)

La version procédurale actuelle fonctionne parfaitement et ne nécessite pas de fichier GLB !
