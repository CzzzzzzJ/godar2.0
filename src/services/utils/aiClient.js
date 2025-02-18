import axios from 'axios';

// 从环境变量中获取配置
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
const MAX_RETRIES = parseInt(process.env.REACT_APP_MAX_RETRIES || '3');
const RETRY_DELAY = parseInt(process.env.REACT_APP_RETRY_DELAY || '2000');
const TIMEOUT = parseInt(process.env.REACT_APP_TIMEOUT || '30000');

// 安全检查和日志脱敏工具
const securityUtils = {
  // 检查 API Key 格式
  validateApiKey: (key) => {
    return /^sk-[A-Za-z0-9]{32,}$/.test(key);
  },
  
  // 检查 URL 格式
  validateUrl: (url) => {
    try {
      new URL(url);
      return url.startsWith('https://');
    } catch {
      return false;
    }
  },
  
  // 脱敏 API Key
  maskApiKey: (key) => {
    if (!key) return '';
    return `${key.slice(0, 5)}...${key.slice(-4)}`;
  },
  
  // 脱敏请求日志
  maskSensitiveData: (data) => {
    if (!data) return data;
    const masked = JSON.parse(JSON.stringify(data));
    if (masked.headers?.Authorization) {
      masked.headers.Authorization = 'Bearer sk-***';
    }
    return masked;
  }
};

// 增强的环境变量验证
if (!API_BASE_URL || !API_KEY) {
  console.error('错误: 缺少必要的环境变量配置');
  throw new Error('请检查环境变量配置是否完整 (API_BASE_URL, API_KEY)');
}

if (!securityUtils.validateUrl(API_BASE_URL)) {
  console.error('API URL 验证失败:', API_BASE_URL);
  throw new Error('API_BASE_URL 格式无效: 必须是有效的 HTTPS URL');
}

if (!securityUtils.validateApiKey(API_KEY)) {
  console.error('API Key 验证失败:', securityUtils.maskApiKey(API_KEY));
  throw new Error('API_KEY 格式无效: 必须以 sk- 开头，并包含足够的字符');
}

// 创建 API 客户端，添加安全配置
const aiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'X-Security-Headers': '1',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  },
  timeout: TIMEOUT,
  withCredentials: false, // 禁用凭证
  maxContentLength: 50 * 1024 * 1024, // 限制响应大小为 50MB
  maxBodyLength: 50 * 1024 * 1024, // 限制请求体大小为 50MB
});

// 增强的请求拦截器
aiClient.interceptors.request.use(
  config => {
    // 记录脱敏的请求日志
    if (process.env.NODE_ENV === 'development') {
      console.log('API 请求配置:', securityUtils.maskSensitiveData(config));
    }
    return config;
  },
  error => {
    console.error('请求拦截器错误:', error.message);
    return Promise.reject(error);
  }
);

// 增强的响应拦截器
aiClient.interceptors.response.use(
  response => {
    // 检查响应中的敏感信息
    if (process.env.NODE_ENV === 'development') {
      console.log('API 响应:', securityUtils.maskSensitiveData(response.data));
    }
    return response;
  },
  error => {
    if (error.code === 'ECONNABORTED') {
      error.isTimeout = true;
    }
    // 脱敏错误日志
    console.error('API 错误:', securityUtils.maskSensitiveData(error));
    return Promise.reject(error);
  }
);

/**
 * 通用的 AI 调用函数
 * @param {string} prompt - 用户提示词
 * @param {string} systemPrompt - 系统提示词
 * @param {number} temperature - 温度参数
 * @param {number} retryCount - 重试次数
 * @returns {Promise<string>} - AI 响应内容
 */
export async function callAI(prompt, systemPrompt = '', temperature = 0.7, retryCount = 0) {
  try {
    // 输入验证
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('无效的提示词');
    }

    if (prompt.length > 4000) {
      throw new Error('提示词超出长度限制');
    }

    // 修改请求格式
    const requestBody = {
      model: 'o1-mini',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      presence_penalty: 0,
      frequency_penalty: 0
    };

    const response = await aiClient.post('/v1/chat/completions', requestBody);
    
    // 验证响应格式
    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('无效的 API 响应格式');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI 调用错误:', error);
    
    // 打印详细的错误信息
    if (error.response?.data) {
      console.error('API 错误详情:', JSON.stringify(error.response.data, null, 2));
    }

    // 如果是超时错误或网络错误，并且未超过重试次数，则重试
    if (retryCount < MAX_RETRIES && (error.isTimeout || !error.response)) {
      const nextRetryDelay = RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`请求超时，${retryCount + 1}/${MAX_RETRIES} 次重试，等待 ${nextRetryDelay/1000} 秒...`);
      await delay(nextRetryDelay);
      return callAI(prompt, systemPrompt, temperature, retryCount + 1);
    }

    // 如果是 400 错误，可能是 API 格式问题
    if (error.response?.status === 400) {
      const errorMessage = error.response.data?.error?.message || '未知的 API 格式错误';
      console.error('API 格式错误:', errorMessage);
      throw new Error(`API 格式错误: ${errorMessage}`);
    }

    // 如果重试次数已达上限，返回友好的错误信息
    if (retryCount >= MAX_RETRIES) {
      throw new Error('服务响应超时，请稍后重试');
    }

    throw new Error(getErrorMessage(error));
  }
}

/**
 * 获取错误信息
 * @param {Error} error - 错误对象
 * @returns {string} - 格式化的错误信息
 */
export function getErrorMessage(error) {
  if (error.response?.data?.error) {
    const errorData = error.response.data.error;
    return typeof errorData === 'object' 
      ? `错误: ${errorData.message || JSON.stringify(errorData)}`
      : errorData;
  }
  
  if (error.response) {
    switch (error.response.status) {
      case 401: return 'API 密钥无效，请检查密钥配置';
      case 429: return '请求过于频繁，请稍后再试';
      case 503: return '服务暂时不可用，请稍后再试';
      case 500: return '服务器内部错误，请联系技术支持';
      default: return `请求失败 (${error.response.status})`;
    }
  }
  
  return error.message || '未知错误';
}

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 检查是否应该重试
 * @param {Error} error - 错误对象
 * @returns {boolean}
 */
export function shouldRetry(error) {
  const status = error.response?.status;
  return status === 503 || status === 429 || status === 500 || !status;
} 