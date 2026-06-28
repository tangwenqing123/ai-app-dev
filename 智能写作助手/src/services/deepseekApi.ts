import type { GenerateParams } from '@/types/writing';

const API_BASE_URL = '/api/v1/chat/completions';
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

console.debug('[DEBUG] DeepSeek API Key loaded:', API_KEY ? 'Yes' : 'No');
console.debug('[DEBUG] API Key length:', API_KEY?.length || 0);

interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    delta: { content?: string };
    finish_reason: string | null;
    index: number;
  }>;
}

export async function* streamGenerate(
  prompt: string,
  params: GenerateParams
): AsyncGenerator<string> {
  console.debug('[DEBUG] streamGenerate called with:', {
    promptLength: prompt.length,
    temperature: params.temperature,
    maxTokens: params.maxTokens
  });

  if (!API_KEY) {
    console.error('[ERROR] API Key not configured');
    throw new Error('API Key 未配置，请设置 VITE_DEEPSEEK_API_KEY 环境变量');
  }

  console.debug('[DEBUG] Making fetch request to:', API_BASE_URL);
  
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一个专业的写作助手。' },
        { role: 'user', content: prompt },
      ],
      stream: true,
      temperature: params.temperature,
      max_tokens: params.maxTokens,
    }),
  });

  console.debug('[DEBUG] Fetch response status:', response.status, response.statusText);
  console.debug('[DEBUG] Content-Type:', response.headers.get('content-type'));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[ERROR] API request failed:', response.status, errorText);
    throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
  }

  const reader = response.body?.getReader();
  console.debug('[DEBUG] Reader obtained:', reader ? 'Yes' : 'No');

  if (!reader) {
    console.error('[ERROR] Cannot get response body reader');
    throw new Error('无法获取响应流');
  }

  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let chunkCount = 0;
  let totalContentLength = 0;

  console.debug('[DEBUG] Starting stream parsing...');

  try {
    while (true) {
      console.debug('[DEBUG] Waiting for next chunk...');
      const { done, value } = await reader.read();
      
      console.debug('[DEBUG] Reader read result:', { 
        done, 
        valueLength: value?.length || 0 
      });
      
      // 解码当前数据块
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        console.debug('[DEBUG] Buffer length after append:', buffer.length);
      }
      
      // 处理缓冲区中的完整行
      while (buffer.includes('\n')) {
        const lineEnd = buffer.indexOf('\n');
        const line = buffer.slice(0, lineEnd);
        buffer = buffer.slice(lineEnd + 1);
        
        console.debug('[DEBUG] Processing line:', line.length, 'chars');
        
        if (!line.trim()) continue;
        if (line.trim() === 'data: [DONE]') {
          console.debug('[DEBUG] Received [DONE] marker');
          console.debug('[DEBUG] Stream completed - Total chunks:', chunkCount, 'Total content:', totalContentLength);
          return;
        }
        if (!line.startsWith('data: ')) continue;

        try {
          const jsonStr = line.slice(6);
          console.debug('[DEBUG] JSON string length:', jsonStr.length);
          const chunk: StreamChunk = JSON.parse(jsonStr);
          const content = chunk.choices[0]?.delta?.content;
          
          if (content) {
            chunkCount++;
            totalContentLength += content.length;
            console.debug(`[DEBUG] Yielding chunk #${chunkCount}: length=${content.length}, total=${totalContentLength}`);
            yield content;
          }
        } catch (e) {
          console.warn('[WARN] Failed to parse chunk:', e);
          continue;
        }
      }

      // 当 done 为 true 且缓冲区为空时退出
      if (done && !buffer.trim()) {
        console.debug('[DEBUG] Stream completed (done), total chunks:', chunkCount, 'Total content:', totalContentLength);
        return;
      }
    }
  } finally {
    console.debug('[DEBUG] Stream generator cleanup');
  }
}

export async function generateNonStreaming(
  prompt: string,
  params: GenerateParams
): Promise<string> {
  if (!API_KEY) {
    throw new Error('API Key 未配置，请设置 VITE_DEEPSEEK_API_KEY 环境变量');
  }

  console.debug('[DEBUG] generateNonStreaming - 开始请求');
  console.debug('[DEBUG] Prompt:', prompt.substring(0, 100) + '...');

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一个专业的写作助手。' },
        { role: 'user', content: prompt },
      ],
      stream: false,
      temperature: params.temperature,
      max_tokens: params.maxTokens,
    }),
  });

  console.debug('[DEBUG] Response status:', response.status);
  console.debug('[DEBUG] Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[ERROR] API 请求失败:', response.status, errorText);
    throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.debug('[DEBUG] Response data keys:', Object.keys(data));
  console.debug('[DEBUG] Response data:', JSON.stringify(data).substring(0, 500));

  const content = data.choices?.[0]?.message?.content;
  console.debug('[DEBUG] Extracted content length:', content?.length || 0);

  return content || '';
}
