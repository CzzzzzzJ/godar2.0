import { BaseAgent } from './BaseAgent';

/**
 * 服务商推荐 Agent
 * 负责匹配最合适的服务提供商
 */
export class ProviderRecommender extends BaseAgent {
  constructor() {
    super('你是一个专业的服务商推荐专家，擅长匹配最合适的服务提供商。');
  }

  /**
   * 推荐服务商
   * @param {string} industry - 行业
   * @param {string} region - 地区
   * @returns {Promise<string>} - 推荐结果
   */
  async recommend(industry, region) {
    const prompt = `请推荐以下场景的优质服务商：
行业：${industry}
地区：${region}

请提供：
1. 推荐服务商（至少3家）
2. 选择理由
3. 合作建议`;

    return await this.think(prompt, 0.3);
  }
} 