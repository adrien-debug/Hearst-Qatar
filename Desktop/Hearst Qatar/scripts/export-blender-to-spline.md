# Guide : Exporter depuis Blender vers Spline

## 📋 Prérequis

- Blender installé (version 3.0+ recommandée)
- Modèles 3D prêts dans Blender

---

## 🎯 Export GLB depuis Blender

### Étape 1 : Préparer le modèle

1. **Ouvrez votre modèle dans Blender**
2. **Vérifiez l'échelle** :
   - Assurez-vous que les dimensions sont en **mètres**
   - Container HD5 : 12.196m × 2.438m × 2.896m
   - Transformateur : 4m × 3m × 5m
   - Power Block : 15m × 8m × 10m
   - Substation : 40m × 30m × 15m

3. **Centrez le modèle** :
   - Sélectionnez tous les objets (A)
   - Shift+S > "Cursor to World Origin"
   - Shift+S > "Selection to Cursor"
   - Ou utilisez : Object > Set Origin > Origin to Geometry

4. **Vérifiez les matériaux** :
   - Les matériaux seront exportés avec le modèle
   - Si vous utilisez des textures, assurez-vous qu'elles sont packées ou en chemins relatifs

### Étape 2 : Export GLB

1. **Sélectionnez les objets à exporter** :
   - Sélectionnez tous les objets du modèle (A pour tout sélectionner)
   - Ou sélectionnez un groupe spécifique

2. **Ouvrez le menu d'export** :
   - File > Export > glTF 2.0 (.glb/.gltf)

3. **Configurez les paramètres d'export** :

   **Onglet "Include"** :
   - ✅ Selected Objects (si vous avez sélectionné des objets)
   - ✅ Visible Objects (si vous voulez exporter tout ce qui est visible)
   - ❌ Custom Properties (optionnel, si vous avez des propriétés custom)

   **Onglet "Transform"** :
   - ✅ +Y Up (important pour Spline)
   - Scale: 1.0

   **Onglet "Geometry"** :
   - ✅ Apply Modifiers (recommandé)
   - ✅ UVs (pour les textures)
   - ✅ Normals
   - ✅ Vertex Colors (si vous en avez)
   - ✅ Materials (important !)
   - ✅ Images (pour les textures)

   **Onglet "Animation"** :
   - ❌ Animations (sauf si vous avez des animations)
   - Si vous avez des animations : ✅ Bake Animation

4. **Cliquez sur "Export glTF 2.0"**
5. **Nommez le fichier** : `hd5_container.glb` (ou autre nom approprié)
6. **Sauvegardez** dans un dossier accessible

---

## 🎨 Optimisations pour Spline

### Réduire la taille du fichier

1. **Simplifier la géométrie** (si nécessaire) :
   - Modifiers > Decimate (pour réduire les polygones)
   - Utilisez avec modération pour garder la qualité

2. **Optimiser les textures** :
   - Réduisez la résolution des textures (1024×1024 max recommandé)
   - Utilisez des formats compressés (JPEG pour couleurs, PNG pour transparence)

3. **Supprimer les éléments inutiles** :
   - Supprimez les objets cachés
   - Supprimez les matériaux non utilisés
   - Supprimez les textures non utilisées

### Vérifier l'export

1. **Ouvrez le fichier GLB** dans un visualiseur :
   - https://gltf-viewer.donmccurdy.com/
   - Ou Blender : File > Import > glTF 2.0

2. **Vérifiez** :
   - ✅ Le modèle s'affiche correctement
   - ✅ Les textures sont présentes
   - ✅ L'échelle est correcte
   - ✅ Le modèle est centré

---

## 📤 Importer dans Spline

1. **Ouvrez Spline** (https://spline.design)
2. **Créez un nouveau projet** ou ouvrez un projet existant
3. **Cliquez sur "Add"** (bouton +)
4. **Sélectionnez "Import 3D Model"**
5. **Uploadez votre fichier GLB**
6. **Attendez le chargement** (peut prendre quelques secondes)

### Après l'import

1. **Vérifiez l'échelle** :
   - Si le modèle est trop petit/grand, utilisez l'outil Scale (S)
   - Vérifiez les dimensions dans les propriétés de l'objet

2. **Vérifiez les matériaux** :
   - Les matériaux Blender peuvent être convertis automatiquement
   - Vous pouvez les ajuster dans le panneau Material de Spline

3. **Organisez la hiérarchie** :
   - Renommez l'objet (clic droit > Rename)
   - Groupez les objets si nécessaire (Ctrl+G / Cmd+G)

---

## 🔄 Workflow Recommandé

### Pour chaque type de modèle :

1. **Container HD5** :
   ```
   Blender > Export GLB > Spline > Renommer "HD5_Container_Base"
   ```

2. **Transformateur** :
   ```
   Blender > Export GLB > Spline > Renommer "Transformer_Base"
   ```

3. **Switchgear** :
   ```
   Blender > Export GLB > Spline > Renommer "Switchgear_Base"
   ```

4. **Power Block** :
   ```
   Blender > Export GLB > Spline > Renommer "PowerBlock_Base"
   ```

5. **Substation** :
   ```
   Blender > Export GLB > Spline > Renommer "Substation_200MW"
   ```

### Créer un template dans Spline

1. Importez tous les modèles de base
2. Placez-les dans la configuration finale (1 Transformateur + 2 Containers + 2 Switchgears)
3. Groupez le tout : `Template_Transformer_Unit`
4. Dupliquez ce template pour créer tous les autres

---

## ⚠️ Problèmes Courants

### Le modèle est trop petit/grand dans Spline

**Solution** : Vérifiez l'échelle dans Blender avant l'export. Dans Spline, utilisez l'outil Scale (S) pour ajuster.

### Les textures ne s'affichent pas

**Solution** :
- Vérifiez que "Images" est coché dans l'export Blender
- Packez les textures dans Blender : File > External Data > Pack All Into .blend
- Ou utilisez des chemins relatifs pour les textures

### Le modèle est à l'envers

**Solution** : Vérifiez que "+Y Up" est coché dans l'export Blender. Dans Spline, vous pouvez faire pivoter l'objet.

### Le fichier est trop lourd

**Solution** :
- Réduisez la résolution des textures
- Simplifiez la géométrie (Decimate modifier)
- Supprimez les éléments non visibles

---

## 📚 Ressources

- **Documentation Blender Export** : https://docs.blender.org/manual/en/latest/addons/io_scene_gltf2.html
- **Documentation Spline Import** : https://docs.spline.design/importing-3d-models
- **Format glTF** : https://www.khronos.org/gltf/

---

## ✅ Checklist d'Export

Pour chaque modèle :

- [ ] Modèle centré à l'origine dans Blender
- [ ] Échelle vérifiée (en mètres)
- [ ] Matériaux configurés
- [ ] Textures packées ou en chemins relatifs
- [ ] Export GLB avec les bons paramètres
- [ ] Fichier testé dans un visualiseur GLB
- [ ] Importé dans Spline
- [ ] Échelle vérifiée dans Spline
- [ ] Matériaux vérifiés dans Spline
- [ ] Objet renommé dans Spline

---

**Temps estimé par modèle** : 5-10 minutes

**Résultat** : Modèles prêts à être utilisés dans Spline pour créer votre scène !
