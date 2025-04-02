import { STATUS_HANDLERS } from '../services/config';

/**
 * API错误处理类
 */
class ApiErrorHandler {
  /**
   * 处理API错误
   * @param {Error} error - 错误对象
   * @param {Object} options - 处理选项
   * @returns {Object} - 处理结果
   */
  static handleError(error, options = {}) {
    // 默认处理选项
    const defaultOptions = {
      showNotification: true, // 是否显示通知
      logError: true, // 是否记录错误日志
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    const { showNotification, logError } = finalOptions;
    
    // 提取状态码和消息
    const statusCode = error.response?.status || 0;
    const errorMessage = this.getErrorMessage(error);
    
    // 记录错误日志
    if (logError) {
      console.error(`[API Error] ${statusCode}: ${errorMessage}`, error);
    }
    
    // 获取状态处理器
    const statusHandler = STATUS_HANDLERS[statusCode];
    
    // 执行状态处理
    if (statusHandler && showNotification) {
      this.executeStatusHandler(statusHandler, errorMessage);
    }
    
    return {
      statusCode,
      message: errorMessage,
      originalError: error,
      handled: !!statusHandler
    };
  }
  
  /**
   * 获取错误消息
   * @param {Error} error - 错误对象
   * @returns {string} - 错误消息
   */
  static getErrorMessage(error) {
    // 从不同位置提取错误消息
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      '未知错误'
    );
  }
  
  /**
   * 执行状态处理器
   * @param {Object} handler - 状态处理器
   * @param {string} message - 错误消息
   */
  static executeStatusHandler(handler, message) {
    const { action, path } = handler;
    const displayMessage = handler.message || message;
    
    switch (action) {
      case 'redirect':
        // 重定向到指定路径
        window.location.href = path;
        break;
      case 'alert':
        // 显示警告消息
        alert(displayMessage); // 这里可以替换为更友好的通知组件
        break;
      case 'custom':
        // 执行自定义处理函数
        if (typeof handler.handler === 'function') {
          handler.handler(message);
        }
        break;
      default:
        console.warn(`未知的错误处理操作: ${action}`);
    }
  }
  
  /**
   * 格式化API错误对象
   * @param {Error} error - 原始错误
   * @returns {Error} - 格式化后的错误
   */
  static formatError(error) {
    // 创建一个新的错误对象，包含更多上下文信息
    const formattedError = new Error(this.getErrorMessage(error));
    
    // 添加额外属性
    formattedError.statusCode = error.response?.status;
    formattedError.data = error.response?.data;
    formattedError.originalError = error;
    formattedError.timestamp = new Date().toISOString();
    
    return formattedError;
  }
}

export default ApiErrorHandler; 