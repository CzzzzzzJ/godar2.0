import { callAI } from '../utils/aiClient';

/**
 * Agent 基类
 * 所有专门的 agent 都继承自这个基类
 */
export class BaseAgent {
  constructor(systemPrompt = '') {
    this.systemPrompt = systemPrompt;
  }

  /**
   * 思考/分析方法
   * @param {string} prompt - 提示词
   * @param {number} temperature - 温度参数
   * @returns {Promise<string>} - AI 响应
   */
  async think(prompt, temperature = 0.7) {
    return await callAI(prompt, this.systemPrompt, temperature);
  }
} 