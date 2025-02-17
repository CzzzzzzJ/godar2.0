import axios from 'axios';

const API_BASE_URL = 'https://api.fast-tunnel.one';
const API_KEY = 'sk-YT7uKeBySL3G9rjG5bDbC08131Dd476aA7151c5cF0810d35';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

const aiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒超时
});

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 检查是否应该重试
const shouldRetry = (error) => {
  const status = error.response?.status;
  return (
    status === 503 || // 服务不可用
    status === 429 || // 请求过多
    status === 500 || // 服务器错误
    !status // 网络错误
  );
};

export const askQuestion = async (question, retryCount = 0) => {
  try {
    const response = await aiClient.post('/v1/chat/completions', {
      model: 'o1-mini',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的跨境信息分析助手，请用简洁专业的语言回答用户的问题。',
        },
        {
          role: 'user',
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const answer = response.data?.choices?.[0]?.message?.content;
    
    if (!answer) {
      throw new Error('未收到有效的回答');
    }

    return {
      success: true,
      answer: answer,
    };
  } catch (error) {
    console.error('AI 服务错误:', error);

    // 检查是否应该重试
    if (retryCount < MAX_RETRIES && shouldRetry(error)) {
      console.log(`尝试重新连接... (${retryCount + 1}/${MAX_RETRIES})`);
      await delay(RETRY_DELAY * (retryCount + 1)); // 指数退避
      return askQuestion(question, retryCount + 1);
    }

    // 根据错误类型返回不同的错误信息
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'API 密钥无效，请联系管理员';
          break;
        case 429:
          errorMessage = '请求过于频繁，请稍后再试';
          break;
        case 503:
          errorMessage = '服务器正在维护，请稍后再试';
          break;
        case 500:
          errorMessage = '服务器内部错误，请稍后再试';
          break;
        default:
          errorMessage = error.response.data?.error || '服务暂时不可用，请稍后再试';
      }
    } else if (error.request) {
      errorMessage = '网络连接失败，请检查您的网络连接';
    } else {
      errorMessage = '发送请求时出错，请稍后再试';
    }

    return {
      success: false,
      error: errorMessage,
      retryCount,
    };
  }
}; 