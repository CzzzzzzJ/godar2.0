// Vercel Serverless Function
const https = require('https');
const fetch = require('node-fetch');

// 创建不验证SSL证书的agent
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// API基础URL
const API_BASE_URL = 'https://8.130.187.17/webapi';

module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理OPTIONS请求（预检请求）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 获取请求参数
  const { path, method = req.method } = req.query;
  
  if (!path) {
    return res.status(400).json({ error: true, message: '缺少path参数' });
  }
  
  // 构建API URL
  const apiUrl = `${API_BASE_URL}/${path}`;
  
  console.log(`[Vercel API Proxy] ${method} ${apiUrl}`);
  
  try {
    // 设置请求选项
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      agent: httpsAgent
    };
    
    // 如果有请求体，添加到选项中
    if (req.body && method !== 'GET') {
      options.body = JSON.stringify(req.body);
    }
    
    // 发送请求
    const response = await fetch(apiUrl, options);
    
    // 获取响应内容类型
    const contentType = response.headers.get('content-type');
    
    // 获取响应数据
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
      try {
        // 尝试解析JSON
        data = JSON.parse(data);
      } catch (e) {
        // 不是JSON，保持原样
      }
    }
    
    // 返回响应
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('[Vercel API Proxy] 错误:', error.message);
    return res.status(500).json({
      error: true,
      message: `代理请求失败: ${error.message}`
    });
  }
}; 