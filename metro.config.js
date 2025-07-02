const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable hot reloading and fast refresh
config.server = {
  ...config.server,
  port: 8081,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Enable CORS for hot reloading
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      
      if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
      } else {
        return middleware(req, res, next);
      }
    };
  },
};

// Configure resolver to handle ES modules
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: true,
  unstable_conditionNames: ['react-native', 'browser', 'require'],
};

// Configure transformer for better ES module support
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
  minifierConfig: {
    ecma: 8,
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

// Watch for file changes
config.watchFolders = [__dirname];

module.exports = config;