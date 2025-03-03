module.exports = {
  devServer: {
    allowedHosts: 'all',
    proxy: {
      '/nacos': {
        target: 'http://121.41.84.201:7848',
        changeOrigin: true,
        secure: false,
      }
    }
  }
}; 