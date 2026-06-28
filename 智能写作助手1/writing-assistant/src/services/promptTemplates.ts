import type { WritingMode } from '../types/writing';

export function buildPrompt(mode: WritingMode, userInput: string, emailSubject?: string): string {
  switch (mode) {
    case 'continue':
      return buildContinuePrompt(userInput);
    case 'rewrite':
      return buildRewritePrompt(userInput);
    case 'expand':
      return buildExpandPrompt(userInput);
    case 'summarize':
      return buildSummarizePrompt(userInput);
    case 'email':
      return buildEmailPrompt(userInput, emailSubject || '无主题');
    case 'copywriting':
      return buildCopywritingPrompt(userInput);
    default:
      return userInput;
  }
}

function buildContinuePrompt(userInput: string): string {
  return `请根据上文续写文章。要求：
- 严格保持上文的语气、节奏、视角（第一/第三人称）和用词习惯
- 段落之间逻辑紧密，无明显跳跃
- 若上文包含特定修辞手法（如比喻、排比），请延续使用
- 续写部分自然过渡，结尾可留有悬念或段落小结
- 总续写长度控制在 200-500 字之间

上文内容：
"""
${userInput}
"""`;
}

function buildRewritePrompt(userInput: string): string {
  return `请对以下文本进行专业级改写。要求：
- 纠正语法错误，优化句式结构（避免过长从句）
- 提升用词精准度：去除口语化表达，替换为更正式/专业的同义词
- 保持核心信息不变，不得增删事实性内容
- 输出时附上"改写说明"：列出3处主要改动及原因

目标场景：正式报告
原始文本：
"""
${userInput}
"""`;
}

function buildExpandPrompt(userInput: string): string {
  return `请扩展以下文本，使其更丰满、有说服力。扩展要求：
- 每段核心论点后增加1-2个具体例子或数据支撑（如无可信数据，可用"例如"打头的一般例证）
- 增加过渡句，使段落衔接更自然
- 若原文有观点无论证，请补充"为什么"的解释
- 总字数扩展至原始字数的 150% – 200%
- 扩展后附上"新增内容摘要"，用列表形式标出主要添加点

原始文本：
"""
${userInput}
"""`;
}

function buildSummarizePrompt(userInput: string): string {
  return `请对以下文本做多层级总结。输出格式必须为：
# 核心结论（一句话）
- 要点1：{概括+支持性细节（≤20字）}
- 要点2：...
- 要点3：...

# 关键数据/引用（如有）
- {数据1}
- {数据2}

# 行动建议或后续步骤（针对决策类文本）
- ...

原文：
"""
${userInput}
"""`;
}

function buildEmailPrompt(userInput: string, subject: string): string {
  return `请写一封邮件。要求：
- 收件人关系：客户（据此决定称呼、敬语、语气）
- 目的明确：首段点明写信意图
- 结构：问候 → 背景/事由 → 具体请求或信息 → 礼貌结尾（含期待回复）
- 长度：不超过200字（不含签名）
- 附上"语气评分"：指出哪些句子可能显得生硬，并提供温和替代版

邮件主题：${subject}
补充信息或要点：
"""
${userInput}
"""`;
}

function buildCopywritingPrompt(userInput: string): string {
  return `请为以下产品生成营销文案。要求：
- 产品定位：高端/性价比/创新
- 目标人群画像：25-40岁职场人群、注重品质生活
- 输出两个版本：版本A（理性说服型，列出功能与数据）；版本B（情感共鸣型，讲故事或激发渴望）
- 每个版本长度：50-80字，适合社交媒体（如朋友圈、微博）
- 结尾附带互动引导（如"点击下方了解详情"或"你更看重哪个功能？评论区告诉我们"）

产品/服务信息：
"""
${userInput}
"""`;
}

export function buildOptimizePrompt(originalPrompt: string): string {
  return `请帮我优化以下提示词，使其更清晰、更有效。输出只需给出优化后的提示词文本，不要额外解释。

原始提示词：
"""
${originalPrompt}
"""`;
}
