import fetch from 'node-fetch';
import https from 'https';

// 忽略SSL证书错误
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// API基础URL
const API_BASE_URL = 'https://8.130.187.17/webapi';

export default async function handler(req, res) {
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
  
  // 记录请求信息
  console.log(`[Assistants API] 获取用户 ${userId} 的AI助手`);
  
  try {
    // 发送请求
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      agent: httpsAgent
    });
    
    // 检查响应状态
    if (!response.ok) {
      console.error(`[Assistants API] 错误: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({
        error: true,
        message: `API请求失败: ${response.status} ${response.statusText}`
      });
    }
    
    // 解析响应
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // 返回数据
    return res.status(200).json(data);
  } catch (error) {
    console.error('[Assistants API] 错误:', error);
    return res.status(500).json({
      error: true,
      message: `获取AI助手失败: ${error.message}`
    });
  }
} 