#!/usr/bin/env node

/**
 * Serveur local pour le plan interactif
 * Permet de servir plan-parking-advanced.html avec hot reload
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HTML_FILE = path.join(__dirname, '..', 'plan-parking-advanced.html');
const PUBLIC_DIR = path.join(__dirname, '..');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? HTML_FILE : path.join(PUBLIC_DIR, req.url);
  
  // Sécurité : empêcher l'accès en dehors du répertoire
  filePath = path.normalize(filePath);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Serveur local démarré !`);
  console.log(`📄 Plan interactif: http://localhost:${PORT}`);
  console.log(`📄 Ou directement: http://localhost:${PORT}/plan-parking-advanced.html`);
  console.log(`\n💡 Modifiez le fichier HTML et rechargez la page (F5) pour voir les changements`);
  console.log(`\n⏹️  Appuyez sur Ctrl+C pour arrêter le serveur\n`);
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté');
    process.exit(0);
  });
});



