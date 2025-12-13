/**
 * Script pour générer un fichier JSON avec toutes les positions
 * pour faciliter l'import dans Spline
 * 
 * Usage: node scripts/generate-spline-positions.js
 */

const fs = require('fs');
const path = require('path');

// Configuration (identique à splineSceneData.ts)
const SUBSTATION_POSITION = { x: 0, y: 0.5, z: 0, name: 'Substation_200MW', type: 'substation' };
const POWER_BLOCK_SPACING = 50;
const POWER_BLOCK_START_X = -75;
const POWER_BLOCK_START_Z = -35;
const TRANSFORMER_VERTICAL_SPACING = 20;
const TRANSFORMER_START_Z = -55;
const SWITCHGEAR_OFFSET = 4.5;
const CONTAINER_OFFSET = 12;

function generatePowerBlockData(pbIndex) {
  const pbNum = pbIndex + 1;
  const pbX = POWER_BLOCK_START_X + (pbIndex * POWER_BLOCK_SPACING);
  
  const objects = [];
  
  // Power Block
  objects.push({
    x: pbX,
    y: 0.5,
    z: POWER_BLOCK_START_Z,
    name: `PowerBlock_${pbNum}`,
    type: 'powerblock',
  });
  
  // Transformateurs
  for (let trIndex = 0; trIndex < 6; trIndex++) {
    const trNum = trIndex + 1;
    const trZ = TRANSFORMER_START_Z - (trIndex * TRANSFORMER_VERTICAL_SPACING);
    const transformerId = `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_Transformer`;
    
    // Transformateur
    objects.push({
      x: pbX,
      y: 0.3,
      z: trZ,
      name: transformerId,
      type: 'transformer',
    });
    
    // Containers
    objects.push({
      x: pbX - CONTAINER_OFFSET,
      y: 0.3,
      z: trZ,
      name: `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_A`,
      type: 'container',
    });
    
    objects.push({
      x: pbX + CONTAINER_OFFSET,
      y: 0.3,
      z: trZ,
      name: `PB${pbNum}_TR${trNum.toString().padStart(2, '0')}_HD5_B`,
      type: 'container',
    });
    
    // Switchgears
    objects.push({
      x: pbX - SWITCHGEAR_OFFSET,
      y: 0.3,
      z: trZ,
      name: `PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_L`,
      type: 'switchgear',
    });
    
    objects.push({
      x: pbX + SWITCHGEAR_OFFSET,
      y: 0.3,
      z: trZ,
      name: `PB${pbNum}_SG_${trNum.toString().padStart(2, '0')}_R`,
      type: 'switchgear',
    });
  }
  
  return objects;
}

// Générer toutes les positions
const allObjects = [SUBSTATION_POSITION];

for (let i = 0; i < 4; i++) {
  allObjects.push(...generatePowerBlockData(i));
}

// Créer le fichier JSON
const outputPath = path.join(__dirname, '..', 'public', 'spline-positions.json');
fs.writeFileSync(outputPath, JSON.stringify(allObjects, null, 2), 'utf8');

console.log(`✅ Fichier généré : ${outputPath}`);
console.log(`📊 Total d'objets : ${allObjects.length}`);
console.log(`\n📋 Répartition :`);
console.log(`   - Substation : 1`);
console.log(`   - Power Blocks : 4`);
console.log(`   - Transformateurs : 24`);
console.log(`   - Containers HD5 : 48`);
console.log(`   - Switchgears : 48`);

// Créer aussi un fichier CSV pour faciliter l'import dans Spline
const csvLines = ['Name,Type,X,Y,Z'];
allObjects.forEach(obj => {
  csvLines.push(`${obj.name},${obj.type},${obj.x},${obj.y},${obj.z}`);
});

const csvPath = path.join(__dirname, '..', 'public', 'spline-positions.csv');
fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf8');

console.log(`\n✅ Fichier CSV généré : ${csvPath}`);
console.log(`\n💡 Vous pouvez maintenant :`);
console.log(`   1. Ouvrir spline-positions.json pour voir toutes les positions`);
console.log(`   2. Utiliser spline-positions.csv pour importer dans Spline (si supporté)`);
console.log(`   3. Suivre SPLINE_SCENE_CONFIGURATION_COMPLETE.md pour créer la scène`);
