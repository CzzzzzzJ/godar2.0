const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/nacos',
    createProxyMiddleware({
      target: 'http://121.41.84.201:7848',
      changeOrigin: true,
      secure: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,serviceName,ip,port,namespaceId,group,ephemeral,weight,enabled,healthy,metadata'
      }
    })
  );
}; 