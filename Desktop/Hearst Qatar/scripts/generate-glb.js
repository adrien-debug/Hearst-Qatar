/**
 * Script pour générer un modèle GLB basique à partir de la structure procédurale
 * 
 * Note: Ce script nécessite l'installation de gltf-pipeline ou three.js
 * npm install gltf-pipeline three
 * 
 * Usage: node scripts/generate-glb.js
 */

const fs = require('fs');
const path = require('path');

// Structure de données pour le modèle
const structure = {
  substation: {
    position: [0, 20, 0],
    dimensions: [40, 30, 15],
    color: '#6b7280'
  },
  powerBlocks: [
    { x: -60, y: -40, z: 0, id: 'PB1' },
    { x: -20, y: -40, z: 0, id: 'PB2' },
    { x: 20, y: -40, z: 0, id: 'PB3' },
    { x: 60, y: -40, z: 0, id: 'PB4' }
  ],
  transformers: [],
  switchgears: [],
  containers: []
};

// Générer les transformateurs
for (let pb = 1; pb <= 4; pb++) {
  const pbX = [-60, -20, 20, 60][pb - 1];
  for (let tr = 1; tr <= 6; tr++) {
    const trY = [-60, -80, -100, -120, -140, -160][tr - 1];
    
    // Transformateur
    structure.transformers.push({
      id: `PB${pb}_TR${tr.toString().padStart(2, '0')}`,
      position: [pbX, trY, 0],
      dimensions: [4, 3, 5],
      color: '#059669'
    });
    
    // Switchgear
    structure.switchgears.push({
      id: `PB${pb}_SG_${tr.toString().padStart(2, '0')}`,
      position: [pbX + 5, trY, 0],
      dimensions: [2, 2, 1.5],
      color: '#9ca3af'
    });
    
    // 2 Containers HD5
    structure.containers.push(
      {
        id: `PB${pb}_TR${tr.toString().padStart(2, '0')}_HD5_A`,
        position: [pbX - 2, trY, 0],
        dimensions: [12.196, 2.438, 2.896],
        color: '#4b5563'
      },
      {
        id: `PB${pb}_TR${tr.toString().padStart(2, '0')}_HD5_B`,
        position: [pbX + 2, trY, 0],
        dimensions: [12.196, 2.438, 2.896],
        color: '#4b5563'
      }
    );
  }
}

console.log('📦 Structure générée:');
console.log(`- 1 Substation`);
console.log(`- ${structure.powerBlocks.length} Power Blocks`);
console.log(`- ${structure.transformers.length} Transformateurs`);
console.log(`- ${structure.switchgears.length} Switchgears`);
console.log(`- ${structure.containers.length} Containers HD5`);

// Créer un fichier JSON avec la structure pour référence
const outputDir = path.join(__dirname, '../public/models');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'structure-data.json'),
  JSON.stringify(structure, null, 2)
);

console.log('\n✅ Fichier structure-data.json créé dans public/models/');
console.log('\n⚠️  Note: Pour créer un vrai fichier GLB, vous devez:');
console.log('   1. Utiliser Blender avec le script generate_hd5_containers.py');
console.log('   2. Modéliser tous les éléments selon BLENDER_CHECKLIST.md');
console.log('   3. Exporter en glTF Binary (.glb)');
console.log('\n💡 La version procédurale fonctionne déjà dans le navigateur!');
