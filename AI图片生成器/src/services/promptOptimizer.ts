// 提示词优化服务
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function optimizePrompt(prompt: string): Promise<string> {
  if (!API_KEY) {
    throw new Error('DeepSeek API Key 未配置');
  }

  const systemPrompt = `你是一位专业的 AI 绘画提示词工程师。请将用户输入的简单描述扩展为详细的图片生成提示词。

要求：
1. 详细描述主体：外观、特征、动作、表情等
2. 描述场景/环境：室内/室外、季节、天气、背景等
3. 指定风格：艺术风格、摄影风格等
4. 添加光线与氛围：光线类型、情绪基调
5. 加入构图和镜头：景别、视角
6. 添加质量修饰词：画质、细节等

请直接输出优化后的提示词，不要添加解释或其他内容。`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error('提示词优化失败');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
