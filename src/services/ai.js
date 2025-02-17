import { AnalysisOrchestrator } from './orchestrator/AnalysisOrchestrator';
import { QuestionAnalyzer } from './utils/questionAnalyzer';
import { delay, shouldRetry } from './utils/aiClient';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒a 

// 创建 Orchestrator 实例
const orchestrator = new AnalysisOrchestrator();

/**
 * 问答函数
 * @param {string} question - 用户问题
 * @returns {Promise<Object>} - 回答结果
 */
export async function askQuestion(question, retryCount = 0) {
  try {
    // 思考过程的动态展示
    const thinkingProcess = {
      start: '🤖 让我想想...',
      region: '🌏 正在分析目标区域',
      concept: '🔍 正在理解核心概念',
      industry: '🏢 正在识别相关行业',
      research: '📚 正在检索研究资料',
      solution: '💡 正在生成解决方案',
      providers: '🤝 正在匹配服务商',
      complete: '✨ 分析完成，正在整理报告'
    };

    // 解析输入
    console.log(thinkingProcess.start);
    const { region, question: userQuestion } = QuestionAnalyzer.parseInput(question);
    console.log(thinkingProcess.region);
    
    // 分析问题
    console.log(thinkingProcess.concept);
    const { concepts, industry } = await QuestionAnalyzer.analyze(userQuestion);
    console.log(thinkingProcess.industry);
    
    // 收集信息
    console.log(thinkingProcess.research);
    const explanation = await QuestionAnalyzer.getConceptExplanation(concepts);
    
    console.log(thinkingProcess.solution);
    const analysis = await QuestionAnalyzer.getRegionalAnalysis(concepts, region);
    
    console.log(thinkingProcess.providers);
    const providers = await QuestionAnalyzer.getServiceProviders(industry, region);

    console.log(thinkingProcess.complete);

    // 组合最终结果
    const answer = combineResults({
      concepts,
      industry,
      explanation,
      analysis,
      providers
    });

    return {
      success: true,
      answer,
    };
  } catch (error) {
    console.error('❌ AI 服务错误:', error);

    // 检查是否应该重试
    if (retryCount < MAX_RETRIES && shouldRetry(error)) {
      console.log(`尝试重新连接... (${retryCount + 1}/${MAX_RETRIES})`);
      await delay(RETRY_DELAY * (retryCount + 1)); // 指数退避
      return askQuestion(question, retryCount + 1);
    }

    // 根据错误类型返回不同的错误信息
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'API 密钥无效，请联系管理员';
          break;
        case 429:
          errorMessage = '请求过于频繁，请稍后再试';
          break;
        case 503:
          errorMessage = '服务器正在维护，请稍后再试';
          break;
        case 500:
          errorMessage = '服务器内部错误，请稍后再试';
          break;
        default:
          errorMessage = error.response.data?.error || '服务暂时不可用，请稍后再试';
      }
    } else if (error.request) {
      errorMessage = '网络连接失败，请检查您的网络连接';
    } else {
      errorMessage = '发送请求时出错，请稍后再试';
    }

    return {
      success: false,
      error: errorMessage,
      retryCount,
    };
  }
}

// 组合最终结果
function combineResults(results) {
  const { concepts, industry, explanation, analysis, providers } = results;
  
  // 根据问题类型选择不同的输出格式
  if (concepts.includes('物流') || industry.includes('物流')) {
    return `
📊 物流方案分析报告

核心概念：
${concepts}

所属行业：
${industry}

方案分析：
${analysis}

服务推荐：
${providers}

市场解读：
${explanation}

注意事项：
- 以上方案基于当前市场情况，建议实时关注市场变化
- 具体实施时需要考虑货物特性和季节性因素
- 建议与多家服务商进行详细询价和商谈`;
  }
  
  if (concepts.includes('法律') || industry.includes('法律')) {
    return `
⚖️ 法律合规分析报告

核心概念：
${concepts}

所属行业：
${industry}

法规解读：
${explanation}

合规分析：
${analysis}

推荐服务：
${providers}

重要提醒：
- 本分析仅供参考，具体问题请咨询专业律师
- 法律法规可能随时更新，请关注最新政策
- 建议建立合规管理制度和风险预警机制`;
  }
  
  // 默认商务分析格式
  return `
💼 商业解决方案

核心概念：
${concepts}

所属行业：
${industry}

市场分析：
${explanation}

解决方案：
${analysis}

推荐资源：
${providers}

执行建议：
- 建议先进行小规模试点，验证方案可行性
- 密切关注市场动态，及时调整策略
- 做好风险管理，建立应急预案
- 重视团队建设和人才储备`;
} 