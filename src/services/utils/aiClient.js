import axios from 'axios';

const API_BASE_URL = 'https://api.fast-tunnel.one';
const API_KEY = 'sk-YT7uKeBySL3G9rjG5bDbC08131Dd476aA7151c5cF0810d35';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 增加到2秒
const TIMEOUT = 30000; // 增加到30秒

// 创建 API 客户端
const aiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: TIMEOUT,
});

// 添加响应拦截器
aiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      error.isTimeout = true;
    }
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
    const requestBody = {
      model: 'o1-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt || '你是一个专业的AI助手。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature,
    };

    const response = await aiClient.post('/v1/chat/completions', requestBody);
    return response.data?.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('AI 调用错误:', error);

    // 如果是超时错误或网络错误，并且未超过重试次数，则重试
    if (retryCount < MAX_RETRIES && (error.isTimeout || !error.response)) {
      const nextRetryDelay = RETRY_DELAY * Math.pow(2, retryCount); // 指数退避
      console.log(`请求超时，${retryCount + 1}/${MAX_RETRIES} 次重试，等待 ${nextRetryDelay/1000} 秒...`);
      await delay(nextRetryDelay);
      return callAI(prompt, systemPrompt, temperature, retryCount + 1);
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
    return typeof error.response.data.error === 'object'
      ? JSON.stringify(error.response.data.error)
      : error.response.data.error;
  }
  
  if (error.response) {
    switch (error.response.status) {
      case 401: return 'API 密钥无效';
      case 429: return '请求过于频繁';
      case 503: return '服务暂时不可用';
      case 500: return '服务器内部错误';
      default: return '请求失败';
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