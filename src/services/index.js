/**
 * API服务管理中心
 * 统一导出所有API服务，方便模块使用
 */

// 导入基础API服务
import ApiService from './api';

// 导入模块化API服务
import AssistantService from './modules/assistant';

// 导入配置
import config, { API_ENDPOINTS } from './config';

// 工具类
import ApiErrorHandler from '../utils/errorHandler';
import ApiCache from '../utils/apiCache';

// 导出API服务
export {
  ApiService,     // 基础API服务
  AssistantService, // AI助手服务
  config,         // API配置
  API_ENDPOINTS,  // API端点常量
  ApiErrorHandler, // API错误处理器
  ApiCache        // API缓存工具
};

// 默认导出所有模块化API服务的集合
export default {
  assistant: AssistantService,
  // 随着项目发展，可以添加更多服务模块
  // user: UserService,
  // auth: AuthService,
  // ...等
}; 