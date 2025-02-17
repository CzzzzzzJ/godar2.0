import { callAI } from './aiClient';

/**
 * 问题分析器
 */
export const QuestionAnalyzer = {
  // 解析地域和问题
  parseInput: (input) => {
    const match = input.match(/^(.*?)及(.*)$/);
    if (!match) {
      return { region: '全球', question: input };
    }
    return {
      region: match[1],
      question: match[2]
    };
  },

  /**
   * 分析问题，提取核心概念和所属行业
   * @param {string} question - 用户问题
   * @returns {Promise<{concepts: string, industry: string}>} - 分析结果
   */
  async analyze(question) {
    try {
      const prompt = `请分析以下问题，提取核心概念和所属行业：
${question}

请按以下格式回答：
核心概念：[概念]
所属行业：[行业]`;

      const result = await callAI(prompt, '', 0.3);
      
      // 解析结果
      const concepts = result.match(/核心概念：(.*?)(?:\n|$)/)?.[1]?.trim() || '未识别';
      const industry = result.match(/所属行业：(.*?)(?:\n|$)/)?.[1]?.trim() || '未识别';
      
      return { concepts, industry };
    } catch (error) {
      console.error('概念分析失败:', error);
      // 返回更友好的错误信息
      return {
        concepts: error.message === '服务响应超时，请稍后重试' ? 
          '服务暂时无法响应，请稍后再试' : '未能识别具体概念',
        industry: error.message === '服务响应超时，请稍后重试' ? 
          '服务暂时无法响应，请稍后再试' : '未能识别具体行业'
      };
    }
  },

  /**
   * 获取概念解释
   */
  async getConceptExplanation(concept) {
    try {
      if (!concept || concept.includes('无法响应') || concept === '未能识别具体概念') {
        return '无法提供概念解释，因为未能正确识别关键概念。';
      }
      const prompt = `请用一段话解释这个概念："${concept}"`;
      return await callAI(prompt, '', 0.7);
    } catch (error) {
      console.error('获取概念解释失败:', error);
      return error.message === '服务响应超时，请稍后重试' ? 
        '服务暂时无法响应，请稍后再试' : '暂时无法提供概念解释。';
    }
  },

  /**
   * 获取地域相关研究结论
   */
  async getRegionalAnalysis(concept, region) {
    try {
      if (!concept || concept.includes('无法响应') || concept === '未能识别具体概念') {
        return '无法提供研究结论，因为未能正确识别关键概念。';
      }
      const prompt = `请分析${region}地区的"${concept}"现状和发展趋势。`;
      return await callAI(prompt, '', 0.7);
    } catch (error) {
      console.error('获取研究结论失败:', error);
      return error.message === '服务响应超时，请稍后重试' ? 
        '服务暂时无法响应，请稍后再试' : '暂时无法提供研究结论。';
    }
  },

  /**
   * 获取服务商信息
   */
  async getServiceProviders(industry, region) {
    try {
      if (!industry || industry.includes('无法响应') || industry === '未能识别具体行业') {
        return '无法提供服务商信息，因为未能正确识别行业。';
      }
      const prompt = `请推荐${region}的${industry}行业中最具代表性的服务商。`;
      return await callAI(prompt, '', 0.7);
    } catch (error) {
      console.error('获取服务商信息失败:', error);
      return error.message === '服务响应超时，请稍后重试' ? 
        '服务暂时无法响应，请稍后再试' : '暂时无法提供服务商信息。';
    }
  }
}; 