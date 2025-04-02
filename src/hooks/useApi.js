import { useState, useEffect, useCallback } from 'react';
import ApiErrorHandler from '../utils/errorHandler';

/**
 * 使用API的React Hook
 * @param {Function} apiMethod - API方法函数
 * @param {Array} dependencies - 依赖项数组
 * @param {Object} options - 配置选项
 * @returns {Object} - 包含数据、加载状态、错误和刷新方法的对象
 */
function useApi(apiMethod, dependencies = [], options = {}) {
  const {
    autoFetch = true,          // 是否自动获取数据
    initialData = null,        // 初始数据
    onSuccess = null,          // 成功回调
    onError = null,            // 错误回调
    errorOptions = {}          // 错误处理选项
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // 执行API调用的方法
  const fetchData = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiMethod(...args);
      setData(result);
      
      // 执行成功回调
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      // 格式化错误
      const formattedError = ApiErrorHandler.handleError(err, errorOptions);
      setError(formattedError);
      
      // 执行错误回调
      if (onError) {
        onError(formattedError);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiMethod, onSuccess, onError, errorOptions]);

  // 首次加载和依赖变化时自动获取数据
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    setData
  };
}

/**
 * 使用异步执行API的React Hook
 * 不自动执行，仅在调用时执行
 * @param {Function} apiMethod - API方法
 * @param {Object} options - 配置选项
 * @returns {Array} - [执行函数, 数据, 加载状态, 错误]
 */
export function useApiExecution(apiMethod, options = {}) {
  const { onSuccess, onError, errorOptions } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiMethod(...args);
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const formattedError = ApiErrorHandler.handleError(err, errorOptions);
      setError(formattedError);
      
      if (onError) {
        onError(formattedError);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiMethod, onSuccess, onError, errorOptions]);
  
  return [execute, data, loading, error];
}

export default useApi; 