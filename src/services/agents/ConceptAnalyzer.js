import { BaseAgent } from './BaseAgent';

/**
 * 概念分析 Agent
 * 负责分析输入文本，提取核心概念和所属行业
 */
export class ConceptAnalyzer extends BaseAgent {
  constructor() {
    super('你是一个专业的概念分析专家，擅长提取和分析核心概念。');
  }

  /**
   * 分析文本
   * @param {string} text - 输入文本
   * @returns {Promise<string>} - 分析结果
   */
  async analyze(text) {
    const prompt = `请分析以下文本，提取核心概念和所属行业：
${text}

请按以下格式回答：
核心概念：[概念]
所属行业：[行业]`;

    return await this.think(prompt, 0.3);
  }

  /**
   * 解析分析结果
   * @param {string} result - AI 返回的结果
   * @returns {{ concepts: string, industry: string }} - 解析后的结果
   */
  parseResult(result) {
    const concepts = result.match(/核心概念：(.*?)(?:\n|$)/)?.[1]?.trim() || '未识别';
    const industry = result.match(/所属行业：(.*?)(?:\n|$)/)?.[1]?.trim() || '未识别';
    return { concepts, industry };
  }
} 