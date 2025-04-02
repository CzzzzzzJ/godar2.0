/**
 * API配置管理
 */

// 环境配置
const ENV = {
  development: {
    baseURL: 'http://8.130.187.17/webapi',
    timeout: 10000,
    withCredentials: true
  },
  production: {
    baseURL: 'https://8.130.187.17/webapi', // 生产环境使用HTTPS
    timeout: 15000,
    withCredentials: true
  },
  test: {
    baseURL: 'http://test-api.example.com',
    timeout: 10000,
    withCredentials: true
  }
};

// 当前环境
const currentEnv = process.env.NODE_ENV || 'development';

// 默认配置
const defaultConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  errorRetry: 1, // 错误重试次数
  useCache: false, // 默认不使用缓存
  cacheTime: 5 * 60 * 1000, // 默认缓存5分钟
  // 模拟数据配置，用于后端API不可用时
  mockConfig: {
    enabled: currentEnv === 'production',
    delay: 300, // 模拟延迟
  }
};

// 导出配置
export default {
  ...ENV[currentEnv],
  ...defaultConfig,
  // API版本
  apiVersion: 'v1',
  // 是否启用调试模式
  debug: currentEnv !== 'production',
  // 是否在HTTPS环境下使用模拟数据
  useMockInHttps: true
};

// HTTP方法常量
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

// API状态码处理配置
export const STATUS_HANDLERS = {
  401: {
    action: 'redirect',
    path: '/login',
    message: '请先登录'
  },
  403: {
    action: 'alert',
    message: '没有权限访问'
  },
  404: {
    action: 'alert',
    message: '资源不存在'
  },
  500: {
    action: 'alert',
    message: '服务器错误，请稍后再试'
  }
};

// API端点路径
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    FORGOT_PASSWORD: 'auth/forgot-password',
    RESET_PASSWORD: 'auth/reset-password',
    REFRESH_TOKEN: 'auth/refresh-token',
    LOGOUT: 'auth/logout'
  },
  // 用户相关
  USER: {
    PROFILE: 'user/profile',
    UPDATE_PROFILE: 'user/profile',
    CHANGE_PASSWORD: 'user/change-password'
  },
  // AI助手相关
  ASSISTANT: {
    LIST: 'AIAssistant', // 获取AI助手列表
    DETAIL: 'AIAssistant', // 获取单个AI助手详情
    CREATE: 'AIAssistant', // 创建AI助手
    UPDATE: 'AIAssistant', // 更新AI助手
    DELETE: 'AIAssistant' // 删除AI助手
  }
};

// 模拟数据
export const MOCK_DATA = {
  [API_ENDPOINTS.ASSISTANT.LIST]: (params) => {
    const userId = params?.userId || 'user123';
    return [
      {
        "AssistantId": 2,
        "UserId": userId,
        "Name": "专业数据处理专家",
        "Greeting": "我是专家，可以帮您处理各类数据分析任务",
        "PersonalityTraits": "专业、高效、细致",
        "CreatedAt": "2025-03-24T09:28:44",
        "UpdatedAt": "2025-03-24T09:28:44"
      },
      {
        "AssistantId": 1,
        "UserId": userId,
        "Name": "创意助手",
        "Greeting": "欢迎使用创意助手，让我们一起创造精彩",
        "PersonalityTraits": "创新、幽默、灵活",
        "CreatedAt": "2025-03-22T00:00:06",
        "UpdatedAt": "2025-03-22T00:00:06"
      }
    ];
  }
}; 