/**
 * API缓存管理工具
 * 提供内存缓存和本地存储缓存两种方式
 */
class ApiCache {
  constructor() {
    // 内存缓存
    this.memoryCache = new Map();
    // 缓存键前缀
    this.keyPrefix = 'api_cache_';
    // 默认过期时间（5分钟）
    this.defaultExpiration = 5 * 60 * 1000;
  }

  /**
   * 生成缓存键
   * @param {string} endpoint - API端点
   * @param {Object} params - 请求参数
   * @returns {string} - 缓存键
   */
  generateKey(endpoint, params = {}) {
    // 将参数排序后序列化，确保相同参数生成相同的键
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {});
    
    return `${this.keyPrefix}${endpoint}_${JSON.stringify(sortedParams)}`;
  }

  /**
   * 获取缓存数据
   * @param {string} endpoint - API端点
   * @param {Object} params - 请求参数
   * @param {boolean} useLocalStorage - 是否使用本地存储
   * @returns {any} - 缓存数据或null
   */
  get(endpoint, params = {}, useLocalStorage = false) {
    const key = this.generateKey(endpoint, params);
    
    // 优先从内存缓存获取
    if (this.memoryCache.has(key)) {
      const cacheItem = this.memoryCache.get(key);
      if (this.isValid(cacheItem)) {
        return cacheItem.data;
      } else {
        // 清除过期缓存
        this.memoryCache.delete(key);
      }
    }
    
    // 如果启用本地存储，从localStorage获取
    if (useLocalStorage) {
      try {
        const storageItem = localStorage.getItem(key);
        if (storageItem) {
          const cacheItem = JSON.parse(storageItem);
          if (this.isValid(cacheItem)) {
            // 同步到内存缓存
            this.memoryCache.set(key, cacheItem);
            return cacheItem.data;
          } else {
            // 清除过期缓存
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.warn('从本地存储获取缓存失败:', error);
      }
    }
    
    return null;
  }

  /**
   * 设置缓存数据
   * @param {string} endpoint - API端点
   * @param {Object} params - 请求参数
   * @param {any} data - 缓存数据
   * @param {number} expiration - 过期时间（毫秒）
   * @param {boolean} useLocalStorage - 是否使用本地存储
   */
  set(endpoint, params = {}, data, expiration = this.defaultExpiration, useLocalStorage = false) {
    const key = this.generateKey(endpoint, params);
    const now = Date.now();
    const cacheItem = {
      data,
      timestamp: now,
      expiration: now + expiration
    };
    
    // 设置内存缓存
    this.memoryCache.set(key, cacheItem);
    
    // 如果启用本地存储，保存到localStorage
    if (useLocalStorage) {
      try {
        localStorage.setItem(key, JSON.stringify(cacheItem));
      } catch (error) {
        console.warn('保存缓存到本地存储失败:', error);
      }
    }
  }

  /**
   * 清除指定缓存
   * @param {string} endpoint - API端点
   * @param {Object} params - 请求参数
   * @param {boolean} useLocalStorage - 是否使用本地存储
   */
  clear(endpoint, params = {}, useLocalStorage = false) {
    const key = this.generateKey(endpoint, params);
    
    // 清除内存缓存
    this.memoryCache.delete(key);
    
    // 如果启用本地存储，清除localStorage
    if (useLocalStorage) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('从本地存储清除缓存失败:', error);
      }
    }
  }

  /**
   * 清除所有缓存
   * @param {boolean} useLocalStorage - 是否使用本地存储
   */
  clearAll(useLocalStorage = false) {
    // 清除内存缓存
    this.memoryCache.clear();
    
    // 如果启用本地存储，清除所有相关localStorage
    if (useLocalStorage) {
      try {
        Object.keys(localStorage)
          .filter(key => key.startsWith(this.keyPrefix))
          .forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.warn('清除所有本地存储缓存失败:', error);
      }
    }
  }

  /**
   * 检查缓存项是否有效
   * @param {Object} cacheItem - 缓存项
   * @returns {boolean} - 是否有效
   */
  isValid(cacheItem) {
    return cacheItem && cacheItem.expiration > Date.now();
  }
}

// 导出单例
export default new ApiCache(); 