// 通义万相 API 封装
import type { GenerateParams } from '../types/image';

const API_KEY = import.meta.env.VITE_DASHSCOPE_API_KEY;
const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

interface WanxiangResponse {
  output?: {
    results?: Array<{ url: string }>;
  };
  request_id?: string;
  code?: string;
  message?: string;
}

export async function generateImage(params: GenerateParams): Promise<string> {
  if (!API_KEY) {
    throw new Error('API Key 未配置，请设置 VITE_DASHSCOPE_API_KEY 环境变量');
  }

  const requestBody = {
    model: 'wan2.7-image-pro',
    input: {
      messages: [
        {
          role: 'user',
          content: [{ text: params.prompt }]
        }
      ]
    },
    parameters: {
      size: params.size,
      n: params.n || 1,
      prompt_extend: params.promptExtend,
      watermark: false
    }
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API 请求失败: ${response.status}`);
  }

  const data: WanxiangResponse = await response.json();

  if (data.code) {
    throw new Error(data.message || '图片生成失败');
  }

  if (!data.output?.results || data.output.results.length === 0) {
    throw new Error('未获取到生成的图片');
  }

  return data.output.results[0].url;
}
