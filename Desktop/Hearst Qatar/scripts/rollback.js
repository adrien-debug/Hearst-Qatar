#!/usr/bin/env node

/**
 * Script de rollback pour Vercel
 * 
 * Ce script permet de faire un rollback vers une version précédente du déploiement.
 * 
 * Utilisation:
 *   node scripts/rollback.js [deployment-url]
 * 
 * Exemple:
 *   node scripts/rollback.js https://hearst-qatar-abc123.vercel.app
 * 
 * Note: Vous devez avoir VERCEL_TOKEN dans vos variables d'environnement
 * ou être connecté via `vercel login`
 */

const https = require('https');
const { execSync } = require('child_process');

const VERCEL_API = 'https://api.vercel.com';
const PROJECT_NAME = 'hearst-qatar'; // À adapter selon votre nom de projet

function getVercelToken() {
  try {
    // Essayer de récupérer depuis l'environnement
    if (process.env.VERCEL_TOKEN) {
      return process.env.VERCEL_TOKEN;
    }
    
    // Essayer de récupérer depuis la config Vercel locale
    const config = require('os').homedir() + '/.vercel/auth.json';
    try {
      const auth = require(config);
      if (auth.credentials && auth.credentials.length > 0) {
        return auth.credentials[0].token;
      }
    } catch (e) {
      // Fichier non trouvé ou erreur de lecture
    }
    
    throw new Error('Token Vercel non trouvé. Utilisez VERCEL_TOKEN ou connectez-vous avec `vercel login`');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const token = getVercelToken();
    const options = {
      hostname: 'api.vercel.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error: ${res.statusCode} - ${parsed.error?.message || body}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${e.message} - Body: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function getProjectDeployments() {
  try {
    console.log('📡 Récupération des déploiements...');
    const deployments = await makeRequest(`/v6/deployments?projectId=${PROJECT_NAME}&limit=10`);
    return deployments.deployments || [];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des déploiements:', error.message);
    process.exit(1);
  }
}

async function promoteDeployment(deploymentId) {
  try {
    console.log(`🔄 Promotion du déploiement ${deploymentId}...`);
    await makeRequest(`/v1/deployments/${deploymentId}/promote`, 'POST');
    console.log('✅ Déploiement promu avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de la promotion:', error.message);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📋 Liste des déploiements récents:');
    const deployments = await getProjectDeployments();
    
    deployments.forEach((deployment, index) => {
      const date = new Date(deployment.createdAt).toLocaleString('fr-FR');
      const state = deployment.readyState === 'READY' ? '✅' : '⏳';
      console.log(`${index + 1}. ${state} ${deployment.url} - ${date} (${deployment.state})`);
    });
    
    console.log('\n💡 Pour faire un rollback, utilisez:');
    console.log('   node scripts/rollback.js <deployment-url>');
    console.log('\n💡 Ou utilisez la CLI Vercel:');
    console.log('   vercel rollback <deployment-url>');
    return;
  }

  const deploymentUrl = args[0];
  console.log(`🔄 Rollback vers: ${deploymentUrl}`);
  
  // Récupérer tous les déploiements
  const deployments = await getProjectDeployments();
  
  // Trouver le déploiement correspondant
  const targetDeployment = deployments.find(d => 
    d.url === deploymentUrl || 
    d.url.includes(deploymentUrl) ||
    d.id === deploymentUrl
  );

  if (!targetDeployment) {
    console.error('❌ Déploiement non trouvé:', deploymentUrl);
    console.log('\n📋 Déploiements disponibles:');
    deployments.forEach((d, i) => {
      console.log(`   ${i + 1}. ${d.url} (${d.id})`);
    });
    process.exit(1);
  }

  if (targetDeployment.readyState !== 'READY') {
    console.error('❌ Le déploiement n\'est pas prêt:', targetDeployment.readyState);
    process.exit(1);
  }

  // Promouvoir le déploiement
  await promoteDeployment(targetDeployment.id);
  
  console.log('\n✅ Rollback terminé avec succès!');
  console.log(`🌐 URL: ${targetDeployment.url}`);
}

main().catch(console.error);



