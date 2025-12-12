/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Désactivé pour éviter les fuites de contextes WebGL avec les pages 3D
  webpack: (config, { isServer, dev }) => {
    // Exclure les modules Node.js natifs du bundle client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        'serialport': false,
        '@serialport/bindings-cpp': false,
        'modbus-serial': false,
      };
      
      // Résoudre correctement les exports conditionnels
      config.resolve.conditionNames = ['import', 'require', 'default'];
    }
    
    // Ignorer les modules problématiques
    config.externals = config.externals || [];
    config.externals.push({
      'serialport': 'commonjs serialport',
      '@serialport/bindings-cpp': 'commonjs @serialport/bindings-cpp',
      'modbus-serial': 'commonjs modbus-serial',
    });
    
    // Résoudre le problème de three-mesh-bvh avec BatchedMesh
    // Créer un alias pour BatchedMesh si non disponible
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
      };
      
      // Ignorer les warnings pour three-mesh-bvh
      config.ignoreWarnings = [
        { module: /three-mesh-bvh/ },
        { message: /BatchedMesh/ },
      ];
    }
    
    // Désactiver Fast Refresh pour les pages 3D (problème de contextes WebGL multiples)
    // Note: La désactivation se fait aussi dans le fichier lui-même via module.hot.decline()
    if (dev && !isServer) {
      // S'assurer que le HMR ne recharge pas automatiquement les pages 3D
      // Le fichier substation-3d-auto.tsx gère lui-même la désactivation via module.hot.decline()
    }
    
    return config;
  },
};

module.exports = nextConfig;


