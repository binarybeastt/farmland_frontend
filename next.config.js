/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Fix CSS HMR issues
    if (dev && !isServer) {
      // Force CSS to refresh on any changes
      const miniCssExtractPlugin = config.plugins.find(
        (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
      );
      if (miniCssExtractPlugin) {
        miniCssExtractPlugin.options.ignoreOrder = true;
      }
    }
    return config;
  },
};

module.exports = nextConfig; 