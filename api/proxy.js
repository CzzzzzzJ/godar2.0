import fetch from 'node-fetch';
import https from 'https';

// 忽略SSL证书错误
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// API基础URL
const API_BASE_URL = 'https://8.130.187.17/webapi';

export default async function handler(req, res) {
  // 获取请求方法和路径
  const { method, query, body } = req;
  
  // 构建目标URL
  const path = query.path || '';
  const targetUrl = `${API_BASE_URL}/${path}`;
  
  // 记录请求信息
  console.log(`[API Proxy] ${method} ${targetUrl}`);
  
  try {
    // 转发请求
    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
        // 移除可能导致问题的头
        'host': undefined,
        'connection': undefined
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
      agent: httpsAgent
    });
    
    // 获取响应内容类型
    const contentType = response.headers.get('content-type');
    
    // 设置响应头
    res.setHeader('Content-Type', contentType || 'application/json');
    
    // 检查响应状态
    if (!response.ok) {
      console.error(`[API Proxy] Error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({
        error: true,
        message: `API请求失败: ${response.status} ${response.statusText}`
      });
    }
    
    // 解析响应
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // 返回响应
    return res.status(200).json(data);
  } catch (error) {
    console.error('[API Proxy] Error:', error);
    return res.status(500).json({
      error: true,
      message: `代理请求失败: ${error.message}`
    });
  }
} 