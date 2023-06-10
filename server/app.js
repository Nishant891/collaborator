const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }
));

// Configure the proxy route
app.use('/api', createProxyMiddleware({
  target: 'https://cloud.appwrite.io/64719ed6c9b56a6c9afe',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/v1',  // Strip '/api' from the request path
  },
}));

// Start the server
const port = 5000; // Or any other port you prefer
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
