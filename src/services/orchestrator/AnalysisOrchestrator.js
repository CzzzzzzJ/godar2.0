import { ConceptAnalyzer } from '../agents/ConceptAnalyzer';
import { ResearchAnalyzer } from '../agents/ResearchAnalyzer';
import { SolutionGenerator } from '../agents/SolutionGenerator';
import { ProviderRecommender } from '../agents/ProviderRecommender';

/**
 * 分析协调器
 * 负责协调各个 Agent 的工作，组织完整的分析流程
 */
export class AnalysisOrchestrator {
  constructor() {
    this.conceptAnalyzer = new ConceptAnalyzer();
    this.researchAnalyzer = new ResearchAnalyzer();
    this.solutionGenerator = new SolutionGenerator();
    this.providerRecommender = new ProviderRecommender();
  }

  /**
   * 解析输入，提取地域信息
   * @param {string} input - 用户输入
   * @returns {{ region: string, question: string }} - 解析结果
   */
  parseInput(input) {
    const match = input.match(/^(.*?)及(.*)$/);
    return match 
      ? { region: match[1], question: match[2] }
      : { region: '全球', question: input };
  }

  /**
   * 执行分析流程
   * @param {string} input - 用户输入
   * @param {function} onProgress - 进度回调函数
   * @returns {Promise<string>} - 分析报告
   */
  async analyze(input, onProgress) {
    try {
      // 1. 解析输入
      onProgress?.('开始分析问题...');
      const { region, question } = this.parseInput(input);
      
      // 2. 概念分析
      onProgress?.('正在识别核心概念...');
      const conceptResult = await this.conceptAnalyzer.analyze(question);
      const { concepts, industry } = this.conceptAnalyzer.parseResult(conceptResult);
      
      // 3. 研究分析
      onProgress?.('正在进行研究分析...');
      const researchResult = await this.researchAnalyzer.analyze(concepts, region);
      
      // 4. 生成解决方案
      onProgress?.('正在生成解决方案...');
      const solutionResult = await this.solutionGenerator.generate(concepts, region, industry);
      
      // 5. 推荐服务商
      onProgress?.('正在匹配服务商...');
      const providerResult = await this.providerRecommender.recommend(industry, region);
      
      // 6. 整合结果
      onProgress?.('正在生成报告...');
      return this.combineResults({
        region,
        concepts,
        industry,
        research: researchResult,
        solution: solutionResult,
        providers: providerResult
      });
    } catch (error) {
      console.error('分析过程出错:', error);
      throw error;
    }
  }

  /**
   * 整合所有结果
   * @param {Object} results - 各个 Agent 的分析结果
   * @returns {string} - 最终报告
   */
  combineResults(results) {
    const { region, concepts, industry, research, solution, providers } = results;
    
    return `📊 跨境分析报告

🌏 分析区域：${region}
🔍 核心概念：${concepts}
🏢 所属行业：${industry}

📈 研究分析：
${research}

💡 解决方案：
${solution}

🤝 推荐服务商：
${providers}

⚠️ 重要提醒：
1. 本报告基于AI分析，建议结合实际情况使用
2. 市场环境瞬息万变，建议定期更新分析
3. 具体实施前请咨询相关领域专家
4. 本报告仅供参考，不构成任何投资或决策建议`;
  }
} 