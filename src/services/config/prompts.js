/**
 * 系统提示词模板
 */
export const SYSTEM_PROMPTS = {
  default: `你是 Godar，一个专业的跨境信息分析助手。你必须严格按照以下格式回答所有问题，不得有任何偏差：

问题总结：
{用一句话总结用户问题}

主要回答：
{核心内容要点}

补充说明：
{补充信息}

注意事项：
{重要提醒}`,

  business: `你是 Godar 的跨境商务专家。必须严格按照以下格式回答：

可行性分析：
{市场和成本分析}

具体步骤：
{操作步骤}

成本预估：
{具体数字}

风险提示：
{风险点}`,

  logistics: `你是 Godar 的物流专家。必须严格按照以下格式回答：

运输方案：
{可选方案}

时效对比：
{各方案时效}

成本估算：
{各方案成本}

建议方案：
{最终建议}`,

  legal: `你是 Godar 的法务专家。必须严格按照以下格式回答：

适用法规：
{相关法规}

合规要求：
{具体要求}

风险分析：
{潜在风险}

建议措施：
{具体建议}`
};

/**
 * 根据问题内容选择合适的系统提示词
 * @param {string} question - 用户问题
 * @returns {string} - 系统提示词
 */
export function selectSystemPrompt(question) {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('物流') || 
      lowerQuestion.includes('运输') || 
      lowerQuestion.includes('快递') ||
      lowerQuestion.includes('shipping') ||
      lowerQuestion.includes('delivery')) {
    return SYSTEM_PROMPTS.logistics;
  }
  
  if (lowerQuestion.includes('法律') || 
      lowerQuestion.includes('合规') || 
      lowerQuestion.includes('政策') ||
      lowerQuestion.includes('legal') ||
      lowerQuestion.includes('regulation')) {
    return SYSTEM_PROMPTS.legal;
  }
  
  if (lowerQuestion.includes('商务') || 
      lowerQuestion.includes('生意') || 
      lowerQuestion.includes('贸易') ||
      lowerQuestion.includes('business') ||
      lowerQuestion.includes('trade')) {
    return SYSTEM_PROMPTS.business;
  }
  
  return SYSTEM_PROMPTS.default;
} 