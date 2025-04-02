// API基础URL
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://8.130.187.17/webapi'  // 生产环境使用HTTPS
  : 'http://8.130.187.17/webapi';  // 开发环境使用HTTP

/**
 * API服务封装
 */
class ApiService {
  /**
   * 获取用户的AI助手列表
   * @param {string} userId - 用户ID
   * @returns {Promise<Array>} - 返回AI助手列表
   */
  static async getAIAssistants(userId) {
    try {
      const response = await fetch(`${BASE_URL}/AIAssistant/${userId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('[API] 获取AI助手成功:', data);
      return data;
    } catch (error) {
      console.error('[API] 获取AI助手失败:', error);
      throw error;
    }
  }
  
  /**
   * 通用的GET请求方法
   * @param {string} endpoint - API端点
   * @param {Object} params - URL参数
   * @returns {Promise<any>} - 返回API响应
   */
  static async get(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    
    // 添加URL参数
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`[API] GET请求失败 ${endpoint}:`, error);
      throw error;
    }
  }
  
  /**
   * 通用的POST请求方法
   * @param {string} endpoint - API端点
   * @param {Object} data - 请求体数据
   * @returns {Promise<any>} - 返回API响应
   */
  static async post(endpoint, data = {}) {
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`[API] POST请求失败 ${endpoint}:`, error);
      throw error;
    }
  }
  
  /**
   * 通用的PUT请求方法
   * @param {string} endpoint - API端点
   * @param {Object} data - 请求体数据
   * @returns {Promise<any>} - 返回API响应
   */
  static async put(endpoint, data = {}) {
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`[API] PUT请求失败 ${endpoint}:`, error);
      throw error;
    }
  }
  
  /**
   * 通用的DELETE请求方法
   * @param {string} endpoint - API端点
   * @returns {Promise<any>} - 返回API响应
   */
  static async delete(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`[API] DELETE请求失败 ${endpoint}:`, error);
      throw error;
    }
  }
}

export default ApiService; 