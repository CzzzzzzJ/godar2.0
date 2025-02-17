import { BaseAgent } from './BaseAgent';

/**
 * 研究分析 Agent
 * 负责分析市场现状和发展趋势
 */
export class ResearchAnalyzer extends BaseAgent {
  constructor() {
    super('你是一个专业的研究分析专家，擅长分析市场现状和发展趋势。');
  }

  /**
   * 分析研究
   * @param {string} concept - 核心概念
   * @param {string} region - 地区
   * @returns {Promise<string>} - 分析结果
   */
  async analyze(concept, region) {
    const prompt = `请分析以下内容：
概念：${concept}
地区：${region}

请提供：
1. 现状分析
2. 发展趋势
3. 机会挑战`;

    return await this.think(prompt, 0.5);
  }
} 