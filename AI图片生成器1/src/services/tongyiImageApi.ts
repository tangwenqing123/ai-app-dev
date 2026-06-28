import type { GenerateParams, ApiError } from '../types/image';

const API_KEY = import.meta.env.VITE_DASHSCOPE_API_KEY;
const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

interface WanxiangResponse {
  output?: {
    choices?: Array<{
      message?: {
        content?: Array<{
          image?: string;
        }>;
      };
    }>;
  };
  request_id?: string;
  code?: string;
  message?: string;
  usage?: {
    width?: number;
    height?: number;
    image_count?: number;
  };
}

export async function generateImage(params: GenerateParams): Promise<string> {
  if (!API_KEY) {
    throw { message: 'API Key 未配置', code: 'MISSING_API_KEY' } as ApiError;
  }

  // Map size options to API format
  const sizeMap: Record<string, string> = {
    '1K': '1024*1024',
    '2K': '1024*1024',  // 使用 1K 因为 API 只支持 1024*1024
    '4K': '1024*1024'
  };

  const requestBody = {
    model: 'qwen-image-2.0-pro',
    input: {
      messages: [
        {
          role: 'user',
          content: [{ text: params.prompt }]
        }
      ]
    },
    parameters: {
      size: sizeMap[params.size] || '1024*1024'
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as WanxiangResponse;
      throw {
        message: errorData.message || `请求失败: ${response.status}`,
        code: errorData.code || `HTTP_${response.status}`
      } as ApiError;
    }

    const data = await response.json() as WanxiangResponse;

    // 解析新的 API 响应格式
    const imageUrl = data.output?.choices?.[0]?.message?.content?.[0]?.image;

    if (imageUrl) {
      return imageUrl;
    }

    throw { message: '未获取到生成的图片', code: 'NO_IMAGE' } as ApiError;
  } catch (error) {
    if ((error as ApiError).message) {
      throw error;
    }
    throw { message: '网络连接失败，请稍后重试', code: 'NETWORK_ERROR' } as ApiError;
  }
}
