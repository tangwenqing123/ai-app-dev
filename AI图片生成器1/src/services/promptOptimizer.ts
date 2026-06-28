import type { ApiError } from '../types/image';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

const SYSTEM_PROMPT = `你是一位专业的 AI 绘画提示词工程师。请将用户输入的简单描述扩展为详细的图片生成提示词。

要求：
1. 包含主体描述（外貌、特征、动作等细节）
2. 包含场景/环境（室内/室外、天气、时间等）
3. 包含风格（艺术风格、摄影风格等）
4. 包含光线与氛围
5. 包含色彩/色调
6. 包含构图和镜头语言
7. 包含质量修饰词

请直接输出优化后的提示词，不要添加任何解释或前缀。`;

export async function optimizePrompt(originalPrompt: string): Promise<string> {
  if (!API_KEY) {
    throw { message: 'DeepSeek API Key 未配置', code: 'MISSING_API_KEY' } as ApiError;
  }

  if (!originalPrompt.trim()) {
    throw { message: '请输入提示词', code: 'EMPTY_PROMPT' } as ApiError;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: originalPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.error?.message || `请求失败: ${response.status}`,
        code: `HTTP_${response.status}`
      } as ApiError;
    }

    const data = await response.json() as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    if (data.choices && data.choices.length > 0) {
      const optimizedPrompt = data.choices[0].message?.content?.trim();
      if (optimizedPrompt) {
        return optimizedPrompt;
      }
    }

    throw { message: '未能获取优化后的提示词', code: 'NO_RESPONSE' } as ApiError;
  } catch (error) {
    if ((error as ApiError).message) {
      throw error;
    }
    throw { message: '优化提示词失败，请稍后重试', code: 'OPTIMIZE_ERROR' } as ApiError;
  }
}
