/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
      level: 'error', 
      fetches: {
        fullUrl: false
      }
    },
    
    webpack: (config, { dev }) => {
      if (dev) {
        config.infrastructureLogging = {
          level: 'error',
          debug: false
        };
        
        config.optimization = {
          ...config.optimization,
          minimize: false,
          removeAvailableModules: false,
          removeEmptyChunks: false,
          splitChunks: false,
        };
      }
      return config;
    }
  };
  
  export default nextConfig;