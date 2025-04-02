import config, { HTTP_METHODS } from './config';
import ApiErrorHandler from '../utils/errorHandler';

/**
 * 基础API服务类
 * 处理所有网络请求、响应和错误
 */
class ApiService {
  /**
   * 发送HTTP请求
   * @param {string} endpoint - API端点
   * @param {string} method - HTTP方法
   * @param {Object} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} - 响应数据
   */
  static async request(endpoint, method = HTTP_METHODS.GET, data = null, options = {}) {
    const { 
      headers = {}, 
      params = {}, 
      timeout = config.timeout,
      withCredentials = config.withCredentials 
    } = options;
    
    // 构建URL
    let url = `${config.baseURL}/${endpoint}`;
    
    // 添加查询参数
    if (Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    // 请求配置
    const requestConfig = {
      method,
      headers: {
        ...config.headers,
        ...headers
      },
      credentials: withCredentials ? 'include' : 'same-origin'
    };
    
    // 添加请求体
    if (data && method !== HTTP_METHODS.GET) {
      requestConfig.body = JSON.stringify(data);
    }
    
    // 设置超时
    const controller = new AbortController();
    requestConfig.signal = controller.signal;
    
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);
    
    try {
      // 发送请求
      const response = await fetch(url, requestConfig);
      clearTimeout(timeoutId);
      
      // 检查响应状态
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        const error = new Error(
          errorData.message || `请求失败: ${response.status} ${response.statusText}`
        );
        error.response = response;
        error.response.data = errorData;
        
        throw error;
      }
      
      // 解析响应
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      
      // 处理超时错误
      if (error.name === 'AbortError') {
        throw new Error(`请求超时: ${endpoint}`);
      }
      
      // 处理网络错误
      if (!error.response) {
        throw new Error(`网络错误: ${error.message}`);
      }
      
      throw error;
    }
  }
  
  /**
   * 发送GET请求
   * @param {string} endpoint - API端点
   * @param {Object} params - 查询参数
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} - 响应数据
   */
  static async get(endpoint, params = {}, options = {}) {
    return this.request(endpoint, HTTP_METHODS.GET, null, { ...options, params });
  }
  
  /**
   * 发送POST请求
   * @param {string} endpoint - API端点
   * @param {Object} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} - 响应数据
   */
  static async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, HTTP_METHODS.POST, data, options);
  }
  
  /**
   * 发送PUT请求
   * @param {string} endpoint - API端点
   * @param {Object} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} - 响应数据
   */
  static async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, HTTP_METHODS.PUT, data, options);
  }
  
  /**
   * 发送PATCH请求
   * @param {string} endpoint - API端点
   * @param {Object} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} - 响应数据
   */
  static async patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, HTTP_METHODS.PATCH, data, options);
  }
  
  /**
   * 发送DELETE请求
   * @param {string} endpoint - API端点
   * @param {Object} params - 查询参数
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} - 响应数据
   */
  static async delete(endpoint, params = {}, options = {}) {
    return this.request(endpoint, HTTP_METHODS.DELETE, null, { ...options, params });
  }
}

export default ApiService; 