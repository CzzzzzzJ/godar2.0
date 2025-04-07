import ApiService from '../api';
import { API_ENDPOINTS, MOCK_DATA } from '../config';
import apiCache from '../../utils/apiCache';

/**
 * AI助手服务
 */
class AssistantService {
  /**
   * 获取用户的所有AI助手
   * @param {string} userId - 用户ID
   * @param {Object} options - 请求选项
   * @returns {Promise<Array>} - AI助手列表
   */
  static async getAssistants(userId, options = {}) {
    const endpoint = API_ENDPOINTS.ASSISTANT.LIST;
    const params = { userId };
    
    // 缓存选项
    const { useCache = false, cacheTime = 5 * 60 * 1000 } = options;
    
    // 如果启用缓存，先尝试从缓存获取
    if (useCache) {
      const cachedData = apiCache.get(endpoint, params);
      if (cachedData) return cachedData;
    }
    
    // 检查是否在Vercel环境中
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
    
    try {
      let data;
      
      if (isVercel) {
        // 在Vercel环境中使用API路由
        console.log('使用Vercel API路由获取AI助手');
        const response = await fetch(`/api/assistants?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error(`API路由请求失败: ${response.status} ${response.statusText}`);
        }
        
        data = await response.json();
      } else {
        // 在非Vercel环境中直接调用API
        data = await ApiService.get(`${endpoint}/${userId}`);
      }
      
      // 如果启用缓存，将结果存入缓存
      if (useCache) {
        apiCache.set(endpoint, params, data, cacheTime);
      }
      
      return data;
    } catch (error) {
      // 处理错误，如果在生产环境并配置了模拟数据，则返回模拟数据
      if (process.env.NODE_ENV === 'production' && MOCK_DATA[endpoint]) {
        console.warn(`API请求失败，使用模拟数据: ${error.message}`);
        const mockData = MOCK_DATA[endpoint](params);
        return mockData;
      }
      
      throw error;
    }
  }
  
  /**
   * 获取单个AI助手详情
   * @param {number} assistantId - 助手ID
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} - 助手详情
   */
  static async getAssistantDetail(assistantId, options = {}) {
    const endpoint = API_ENDPOINTS.ASSISTANT.DETAIL;
    const params = { assistantId };
    
    // 缓存选项
    const { useCache = false, cacheTime = 5 * 60 * 1000 } = options;
    
    // 如果启用缓存，先尝试从缓存获取
    if (useCache) {
      const cachedData = apiCache.get(endpoint, params);
      if (cachedData) return cachedData;
    }
    
    try {
      // 发起请求
      const data = await ApiService.get(`${endpoint}/${assistantId}`);
      
      // 如果启用缓存，将结果存入缓存
      if (useCache) {
        apiCache.set(endpoint, params, data, cacheTime);
      }
      
      return data;
    } catch (error) {
      // 处理错误，如果在生产环境并配置了模拟数据，则返回模拟数据
      if (process.env.NODE_ENV === 'production' && MOCK_DATA[endpoint]) {
        console.warn(`API请求失败，使用模拟数据: ${error.message}`);
        const mockData = MOCK_DATA[endpoint](params);
        return mockData;
      }
      
      throw error;
    }
  }
  
  /**
   * 创建新AI助手
   * @param {Object} assistantData - 助手数据
   * @returns {Promise<Object>} - 创建结果
   */
  static async createAssistant(assistantData) {
    const endpoint = API_ENDPOINTS.ASSISTANT.CREATE;
    
    // 创建后清除列表缓存
    const clearCache = () => {
      apiCache.clear(API_ENDPOINTS.ASSISTANT.LIST, { userId: assistantData.UserId });
    };
    
    try {
      const result = await ApiService.post(endpoint, assistantData);
      clearCache();
      return result;
    } catch (error) {
      // 处理错误，如果在生产环境并配置了模拟数据，则返回模拟数据
      if (process.env.NODE_ENV === 'production' && MOCK_DATA[endpoint]) {
        console.warn(`API请求失败，使用模拟数据: ${error.message}`);
        const mockData = MOCK_DATA[endpoint](assistantData);
        return mockData;
      }
      throw error;
    }
  }
  
  /**
   * 更新AI助手
   * @param {number} assistantId - 助手ID
   * @param {Object} assistantData - 助手数据
   * @returns {Promise<Object>} - 更新结果
   */
  static async updateAssistant(assistantId, assistantData) {
    const endpoint = API_ENDPOINTS.ASSISTANT.UPDATE;
    const params = { assistantId };
    
    // 更新后清除相关缓存
    const clearCache = () => {
      apiCache.clear(API_ENDPOINTS.ASSISTANT.LIST, { userId: assistantData.UserId });
      apiCache.clear(API_ENDPOINTS.ASSISTANT.DETAIL, { assistantId });
    };
    
    try {
      const result = await ApiService.put(`${endpoint}/${assistantId}`, assistantData);
      clearCache();
      return result;
    } catch (error) {
      // 处理错误，如果在生产环境并配置了模拟数据，则返回模拟数据
      if (process.env.NODE_ENV === 'production' && MOCK_DATA[endpoint]) {
        console.warn(`API请求失败，使用模拟数据: ${error.message}`);
        const mockData = MOCK_DATA[endpoint](params, assistantData);
        return mockData;
      }
      throw error;
    }
  }
  
  /**
   * 删除AI助手
   * @param {number} assistantId - 助手ID
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} - 删除结果
   */
  static async deleteAssistant(assistantId, userId) {
    const endpoint = API_ENDPOINTS.ASSISTANT.DELETE;
    
    // 删除后清除相关缓存
    const clearCache = () => {
      apiCache.clear(API_ENDPOINTS.ASSISTANT.LIST, { userId });
      apiCache.clear(API_ENDPOINTS.ASSISTANT.DETAIL, { assistantId });
    };
    
    try {
      const result = await ApiService.delete(`${endpoint}/${assistantId}`);
      clearCache();
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default AssistantService; 