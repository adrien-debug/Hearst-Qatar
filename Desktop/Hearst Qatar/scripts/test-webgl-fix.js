#!/usr/bin/env node

/**
 * Script de test automatisé pour vérifier la correction du bug WebGL
 * 
 * Ce script vérifie que :
 * 1. L'interception de console.warn a été supprimée
 * 2. Le nettoyage périodique a été supprimé
 * 3. Le code est simplifié
 */

const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.join(__dirname, '../pages/substation-3d-auto.tsx');

console.log('🧪 Test de la correction du bug WebGL\n');
console.log(`📁 Fichier testé: ${TARGET_FILE}\n`);

// Lire le fichier
let content;
try {
  content = fs.readFileSync(TARGET_FILE, 'utf8');
} catch (error) {
  console.error('❌ Erreur: Impossible de lire le fichier');
  process.exit(1);
}

let testsPassed = 0;
let testsFailed = 0;
const errors = [];

// Test 1: Vérifier que l'interception de console.warn a été supprimée
console.log('Test 1: Vérification de la suppression de l\'interception console.warn...');
if (content.includes('console.warn = function') && content.includes('Too many active WebGL contexts')) {
  testsFailed++;
  errors.push('❌ L\'interception de console.warn est toujours présente (ligne ~276)');
} else {
  testsPassed++;
  console.log('✅ L\'interception de console.warn a été supprimée\n');
}

// Test 2: Vérifier que le nettoyage périodique a été supprimé
console.log('Test 2: Vérification de la suppression du nettoyage périodique...');
if (content.includes('setInterval') && content.includes('cleanupAllWebGLContexts') && content.includes('10000')) {
  testsFailed++;
  errors.push('❌ Le nettoyage périodique (setInterval) est toujours présent (ligne ~288)');
} else {
  testsPassed++;
  console.log('✅ Le nettoyage périodique a été supprimé\n');
}

// Test 3: Vérifier que cleanupAllOtherCanvases n'est plus appelé au montage
console.log('Test 3: Vérification que cleanupAllOtherCanvases n\'est plus appelé au montage...');
if (content.includes('cleanupAllOtherCanvases') && content.includes('registerCanvas')) {
  // Vérifier que cleanupAllOtherCanvases n'est pas dans registerCanvas
  const registerCanvasMatch = content.match(/registerCanvas\([^)]+\)\s*\{[\s\S]*?\n\s*\}/);
  if (registerCanvasMatch && registerCanvasMatch[0].includes('cleanupAllOtherCanvases')) {
    testsFailed++;
    errors.push('❌ cleanupAllOtherCanvases est toujours appelé dans registerCanvas');
  } else {
    testsPassed++;
    console.log('✅ cleanupAllOtherCanvases n\'est plus appelé au montage\n');
  }
} else {
  testsPassed++;
  console.log('✅ cleanupAllOtherCanvases n\'est plus utilisé\n');
}

// Test 4: Vérifier que le nettoyage agressif dans useEffect a été supprimé
console.log('Test 4: Vérification que le nettoyage agressif dans useEffect a été supprimé...');
if (content.includes('NETTOYAGE SYNCHRONE ET RADICAL') || 
    (content.includes('useEffect') && content.match(/useEffect\(\(\)\s*=>\s*\{[\s\S]*?allCanvases\.forEach/g))) {
  testsFailed++;
  errors.push('❌ Le nettoyage agressif dans useEffect est toujours présent');
} else {
  testsPassed++;
  console.log('✅ Le nettoyage agressif dans useEffect a été supprimé\n');
}

// Test 5: Vérifier que WebGLContextManager est simplifié
console.log('Test 5: Vérification que WebGLContextManager est simplifié...');
if (content.includes('cleanupAllOtherCanvases') && content.includes('function') || 
    content.includes('cleanupAllOtherCanvases') && content.includes('=>')) {
  testsFailed++;
  errors.push('❌ cleanupAllOtherCanvases est toujours présent dans WebGLContextManager');
} else {
  testsPassed++;
  console.log('✅ WebGLContextManager est simplifié\n');
}

// Test 6: Vérifier que le code monte immédiatement sans délai
console.log('Test 6: Vérification que le montage est immédiat (sans setTimeout de 300ms)...');
if (content.includes('setTimeout') && content.includes('setMounted(true)') && content.includes('300')) {
  testsFailed++;
  errors.push('❌ Le délai de 300ms avant le montage est toujours présent');
} else {
  testsPassed++;
  console.log('✅ Le montage est immédiat\n');
}

// Test 7: Vérifier que cleanupAll n'est plus appelé dans handleContextLost
console.log('Test 7: Vérification que handleContextLost ne nettoie plus agressivement...');
if (content.includes('handleContextLost') && content.includes('cleanupAll()')) {
  testsFailed++;
  errors.push('❌ handleContextLost appelle toujours cleanupAll()');
} else {
  testsPassed++;
  console.log('✅ handleContextLost ne nettoie plus agressivement\n');
}

// Résumé
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSUMÉ DES TESTS');
console.log('='.repeat(60));
console.log(`✅ Tests réussis: ${testsPassed}`);
console.log(`❌ Tests échoués: ${testsFailed}`);
console.log('='.repeat(60) + '\n');

if (testsFailed > 0) {
  console.log('❌ ÉCHEC: Certains tests ont échoué:\n');
  errors.forEach(error => console.log(`  ${error}`));
  console.log('\n⚠️  Le bug n\'est peut-être pas complètement corrigé.');
  process.exit(1);
} else {
  console.log('✅ SUCCÈS: Tous les tests sont passés !');
  console.log('\n📝 Prochaines étapes:');
  console.log('   1. Ouvrir http://localhost:1111/substation-3d-auto dans le navigateur');
  console.log('   2. Ouvrir la console du navigateur (F12)');
  console.log('   3. Vérifier qu\'il n\'y a PAS de warnings "Too many active WebGL contexts"');
  console.log('   4. Vérifier que la scène 3D se charge correctement');
  console.log('   5. Recharger la page plusieurs fois pour vérifier la stabilité');
  console.log('\n✅ Le bug devrait être corrigé !');
  process.exit(0);
}
