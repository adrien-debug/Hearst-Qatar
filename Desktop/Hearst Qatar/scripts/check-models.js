/**
 * Script pour vérifier que tous les modèles GLB sont présents
 * 
 * Usage: node scripts/check-models.js
 */

const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'public', 'models');
const requiredModels = [
  'hd5_container.glb',
  'transformer.glb',
  'switchgear.glb',
  'power_block.glb',
  'substation_200mw.glb',
];

console.log('🔍 Vérification des modèles GLB...\n');

let allPresent = true;
const missingModels = [];
const presentModels = [];

requiredModels.forEach((model) => {
  const modelPath = path.join(modelsDir, model);
  if (fs.existsSync(modelPath)) {
    const stats = fs.statSync(modelPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✅ ${model} (${sizeMB} MB)`);
    presentModels.push(model);
  } else {
    console.log(`❌ ${model} - MANQUANT`);
    missingModels.push(model);
    allPresent = false;
  }
});

console.log('\n📊 Résumé :');
console.log(`   Présents : ${presentModels.length}/${requiredModels.length}`);
console.log(`   Manquants : ${missingModels.length}`);

if (allPresent) {
  console.log('\n✅ Tous les modèles sont présents !');
  console.log('   Vous pouvez maintenant utiliser la page substation-3d-auto.tsx');
} else {
  console.log('\n⚠️  Modèles manquants :');
  missingModels.forEach((model) => {
    console.log(`   - ${model}`);
  });
  console.log('\n💡 Solutions :');
  console.log('   1. Exportez vos modèles depuis Blender en GLB');
  console.log('   2. Placez-les dans /public/models/');
  console.log('   3. Utilisez les noms exacts listés ci-dessus');
  console.log('\n📚 Voir scripts/export-blender-to-spline.md pour les instructions d\'export');
}

// Vérifier aussi si le dossier models existe
if (!fs.existsSync(modelsDir)) {
  console.log(`\n⚠️  Le dossier ${modelsDir} n'existe pas`);
  console.log('   Création du dossier...');
  fs.mkdirSync(modelsDir, { recursive: true });
  console.log('   ✅ Dossier créé');
}
