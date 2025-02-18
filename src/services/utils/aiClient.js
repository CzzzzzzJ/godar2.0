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
  
  // 脱敏请求日志
  maskSensitiveData: (data) => {
    if (!data) return data;
    const masked = JSON.parse(JSON.stringify(data));
    
    // 移除所有敏感信息
    if (masked.headers) {
      delete masked.headers.Authorization;
      delete masked.headers['X-Security-Headers'];
    }
    if (masked.baseURL) {
      masked.baseURL = '[已隐藏]';
    }
    if (masked.url) {
      masked.url = '[已隐藏]';
    }
    
    return masked;
  },

  // 安全的错误日志
  logError: (error, type = '错误') => {
    if (process.env.NODE_ENV === 'development') {
      const safeError = {
        message: error.message,
        status: error.response?.status,
        type: type
      };
      console.error(`API ${type}:`, safeError);
    }
  }
};

// 增强的环境变量验证
if (!API_BASE_URL || !API_KEY) {
  throw new Error('请检查环境变量配置是否完整');
}

if (!securityUtils.validateUrl(API_BASE_URL)) {
  throw new Error('API_BASE_URL 格式无效');
}

if (!securityUtils.validateApiKey(API_KEY)) {
  throw new Error('API_KEY 格式无效');
}

// 创建 API 客户端，添加安全配置
const aiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  withCredentials: false,
  maxContentLength: 50 * 1024 * 1024,
  maxBodyLength: 50 * 1024 * 1024,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 添加请求拦截器来设置认证头
aiClient.interceptors.request.use(
  config => {
    // 添加认证头
    config.headers['Authorization'] = `Bearer ${API_KEY}`;
    
    // 仅在开发环境记录非敏感信息
    if (process.env.NODE_ENV === 'development') {
      const safeConfig = {
        method: config.method,
        contentType: config.headers['Content-Type'],
        timestamp: new Date().toISOString()
      };
      console.log('API 请求:', safeConfig);
    }
    return config;
  },
  error => {
    securityUtils.logError(error, '请求错误');
    return Promise.reject(error);
  }
);

// 增强的响应拦截器
aiClient.interceptors.response.use(
  response => {
    // 仅在开发环境记录非敏感信息
    if (process.env.NODE_ENV === 'development') {
      const safeResponse = {
        status: response.status,
        timestamp: new Date().toISOString(),
        hasData: !!response.data
      };
      console.log('API 响应:', safeResponse);
    }
    return response;
  },
  error => {
    if (error.code === 'ECONNABORTED') {
      error.isTimeout = true;
    }
    securityUtils.logError(error, '响应错误');
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

    const requestBody = {
      model: 'o1-mini',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,

      presence_penalty: 0,
      frequency_penalty: 0,
      stream: false,
      n: 1
    };

    if (systemPrompt) {
      requestBody.messages.unshift({
        role: 'system',
        content: systemPrompt
      });
    }

    const response = await aiClient.post('/v1/chat/completions', requestBody);
    
    // 增强的响应验证和错误处理
    if (!response.data) {
      throw new Error('API 响应为空');
    }

    // 检查响应格式
    const responseData = response.data;
    
    // 调试信息（仅开发环境）
    if (process.env.NODE_ENV === 'development') {
      const debugInfo = {
        hasChoices: Array.isArray(responseData.choices),
        choicesLength: responseData.choices?.length,
        firstChoice: responseData.choices?.[0],
        hasMessage: responseData.choices?.[0]?.message !== undefined,
        messageType: typeof responseData.choices?.[0]?.message?.content,
        rawResponse: JSON.stringify(responseData),
        responseType: typeof responseData,
        finishReason: responseData.choices?.[0]?.finish_reason
      };
      console.log('详细响应结构:', debugInfo);
    }

    // 处理不同的响应格式
    let content = '';
    
    // 检查是否因为长度限制被截断
    const finishReason = responseData.choices?.[0]?.finish_reason;
    if (finishReason === 'length') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('响应因长度限制被截断，正在重试获取完整响应...');
      }
      // 如果是因为长度限制，且未超过重试次数，则重试
      if (retryCount < MAX_RETRIES) {
        await delay(RETRY_DELAY);
        return callAI(prompt, systemPrompt, temperature, retryCount + 1);
      }
    }

    // 尝试提取内容的不同方式
    if (responseData.choices?.[0]?.message?.content) {
      content = responseData.choices[0].message.content;
    } else if (responseData.choices?.[0]?.text) {
      content = responseData.choices[0].text;
    } else if (responseData.choices?.[0]?.content) {
      content = responseData.choices[0].content;
    } else if (typeof responseData.choices?.[0] === 'string') {
      content = responseData.choices[0];
    } else if (typeof responseData === 'string') {
      content = responseData;
    } else if (responseData.response) {
      content = responseData.response;
    } else if (responseData.result) {
      content = responseData.result;
    }

    // 如果内容为空，但响应中包含其他信息，尝试使用其他字段
    if (!content && responseData.choices?.[0]?.message) {
      const message = responseData.choices[0].message;
      if (message.function_call) {
        content = JSON.stringify(message.function_call);
      } else if (message.tool_calls) {
        content = JSON.stringify(message.tool_calls);
      }
    }

    // 如果仍然无法提取内容，尝试直接使用整个响应
    if (!content && typeof responseData === 'object') {
      content = JSON.stringify(responseData);
    }

    if (!content) {
      if (process.env.NODE_ENV === 'development') {
        console.error('无法提取内容，完整响应:', responseData);
      }
      throw new Error('无法从响应中提取有效内容');
    }

    // 确保返回的是字符串类型，且不为空
    content = String(content).trim();
    if (!content) {
      throw new Error('API 返回了空内容');
    }

    return content;
  } catch (error) {
    // 增强的错误处理
    if (process.env.NODE_ENV === 'development') {
      const safeError = {
        type: error.name,
        message: error.message,
        status: error.response?.status,
        responseType: error.response?.headers?.['content-type'],
        hasData: !!error.response?.data,
        responseData: error.response?.data ? JSON.stringify(error.response.data).slice(0, 200) : null
      };
      console.error('AI 调用详细错误:', safeError);
    }

    // 如果是超时错误或网络错误，并且未超过重试次数，则重试
    if (retryCount < MAX_RETRIES && (
      error.isTimeout || 
      !error.response || 
      error.message.includes('无法从响应中提取有效内容') ||
      error.message.includes('API 响应为空')
    )) {
      const nextRetryDelay = RETRY_DELAY * Math.pow(2, retryCount);
      if (process.env.NODE_ENV === 'development') {
        console.log(`重试中... (${retryCount + 1}/${MAX_RETRIES})`);
      }
      await delay(nextRetryDelay);
      return callAI(prompt, systemPrompt, temperature, retryCount + 1);
    }

    // 如果是 400 错误，可能是 API 格式问题
    if (error.response?.status === 400) {
      throw new Error('API 请求格式错误，请检查输入');
    }

    // 如果重试次数已达上限
    if (retryCount >= MAX_RETRIES) {
      throw new Error('多次请求失败，请稍后重试');
    }

    // 其他错误
    throw new Error(getErrorMessage(error));
  }
}

/**
 * 获取错误信息
 * @param {Error} error - 错误对象
 * @returns {string} - 格式化的错误信息
 */
export function getErrorMessage(error) {
  // 自定义错误信息
  const customErrors = {
    'API 响应为空': '服务暂时无响应，请稍后重试',
    '无法从响应中提取有效内容': '响应格式异常，请重试',
    'Network Error': '网络连接失败，请检查网络',
    'timeout of': '请求超时，请稍后重试',
  };

  // 检查是否匹配自定义错误
  for (const [key, value] of Object.entries(customErrors)) {
    if (error.message.includes(key)) {
      return value;
    }
  }

  // 处理标准 HTTP 错误
  if (error.response?.data?.error) {
    const errorData = error.response.data.error;
    if (typeof errorData === 'object') {
      // 处理详细的错误信息
      const errorMessage = errorData.message || errorData.msg || errorData.error || '未知错误';
      const errorCode = errorData.code || errorData.status || error.response.status;
      return `请求错误 (${errorCode}): ${errorMessage}`;
    }
    return errorData;
  }
  
  if (error.response) {
    const status = error.response.status;
    const statusMessages = {
      400: '请求格式错误，请检查API参数',
      401: 'API 认证失败，请检查密钥',
      403: '无权访问该资源',
      404: '请求的资源不存在',
      429: '请求过于频繁，请稍后再试',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务暂时不可用',
      504: '网关超时'
    };
    return statusMessages[status] || `请求失败 (${status})`;
  }
  
  // 如果是开发环境，返回更详细的错误信息
  if (process.env.NODE_ENV === 'development') {
    return `服务异常: ${error.message}`;
  }
  
  return '服务异常，请稍后重试';
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