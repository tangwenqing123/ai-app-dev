/**
 * 阿里云语音识别 API 服务
 * 使用 DashScope 智能语音交互 API - 一句话识别
 * 参考：https://help.aliyun.com/document_detail/2712548.html
 */

import type { RecognitionResult } from '../types/asr';

const DASHSCOPE_API_KEY = import.meta.env.VITE_DASHSCOPE_API_KEY || '';

// 阿里云文件上传API
const FILE_UPLOAD_URL = 'https://dashscope.aliyuncs.com/api/v1/uploads';

// 一句话识别API
const RECOGNITION_URL = 'https://dashscope.aliyuncs.com/api/v1/services/audio/asr/recognition';

/**
 * 将音频Blob上传到阿里云OSS，获取临时URL
 */
async function uploadAudioToAliyun(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  const fileName = `audio_${Date.now()}.webm`;
  formData.append('files', new File([audioBlob], fileName, { type: 'audio/webm' }));
  formData.append('purpose', 'inference');

  const response = await fetch(FILE_UPLOAD_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `文件上传失败: ${response.status}`);
  }

  const data = await response.json();

  if (data.output?.files?.[0]?.uploaded_file_url) {
    return data.output.files[0].uploaded_file_url;
  }

  throw new Error('文件上传失败：无法获取文件URL');
}

/**
 * 一句话识别 - 通过文件URL进行识别
 */
async function recognizeFromUrl(fileUrl: string): Promise<RecognitionResult> {
  const response = await fetch(RECOGNITION_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'paraformer-v2',
      input: {
        file_urls: [fileUrl],
      },
      parameters: {
        language_hints: ['zh', 'en'],
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg = errorData.message || errorData.error?.message || `识别失败: ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();

  return {
    text: data.output?.text || '',
    requestId: data.request_id,
  };
}

/**
 * 语音识别主函数
 * 1. 上传音频文件
 * 2. 使用文件URL进行识别
 */
export async function recognizeSpeech(audioBase64: string): Promise<RecognitionResult> {
  if (!DASHSCOPE_API_KEY) {
    throw new Error('API Key 未配置，请检查环境变量');
  }

  try {
    // 1. Base64 转 Blob
    const byteCharacters = atob(audioBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const audioBlob = new Blob([new Uint8Array(byteNumbers)], { type: 'audio/webm' });

    // 2. 上传文件获取URL
    const fileUrl = await uploadAudioToAliyun(audioBlob);

    // 3. 调用识别API
    const result = await recognizeFromUrl(fileUrl);

    return result;
  } catch (error) {
    console.error('语音识别错误:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('识别失败，请重试');
  }
}
