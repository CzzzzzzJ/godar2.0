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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理OPTIONS请求（预检请求）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只处理GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: true, message: '方法不允许' });
  }
  
  // 获取用户ID
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: true, message: '缺少用户ID参数' });
  }
  
  // 构建API URL
  const apiUrl = `${API_BASE_URL}/AIAssistant/${userId}`;
  
  console.log(`[Vercel API] 获取用户 ${userId} 的AI助手`);
  
  try {
    // 发送请求
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      agent: httpsAgent
    });
    
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
    
    // 确保返回的是数组
    if (!Array.isArray(data)) {
      console.warn('[Vercel API] 响应不是数组，返回空数组');
      data = [];
    }
    
    // 返回响应
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('[Vercel API] 错误:', error.message);
    // 返回空数组，避免前端错误
    return res.status(200).json([]);
  }
}; 