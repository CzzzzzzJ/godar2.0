import { BaseAgent } from './BaseAgent';

/**
 * 解决方案 Agent
 * 负责制定实施方案和评估可行性
 */
export class SolutionGenerator extends BaseAgent {
  constructor() {
    super('你是一个专业的解决方案专家，擅长制定实施方案和评估可行性。');
  }

  /**
   * 生成解决方案
   * @param {string} concept - 核心概念
   * @param {string} region - 地区
   * @param {string} industry - 行业
   * @returns {Promise<string>} - 解决方案
   */
  async generate(concept, region, industry) {
    const prompt = `请为以下场景制定解决方案：
概念：${concept}
地区：${region}
行业：${industry}

请提供：
1. 实施步骤
2. 时间周期
3. 资源需求
4. 风险评估`;

    return await this.think(prompt, 0.5);
  }
} 