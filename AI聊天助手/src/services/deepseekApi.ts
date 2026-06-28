import type { Message, ChatCompletionResponse } from '../types/chat';

const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export async function fetchStreamResponse(
  messages: Message[],
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  if (!API_KEY) {
    onError('请配置 DeepSeek API Key');
    return;
  }

  const requestBody = {
    model: 'deepseek-chat',
    messages: messages.map(({ role, content }) => ({ role, content })),
    stream: true,
    temperature: 0.7,
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || `HTTP 错误: ${response.status}`;
      onError(errorMessage);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('无法获取响应流');
      return;
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        if (trimmedLine === 'data: [DONE]') {
          onComplete();
          return;
        }

        if (trimmedLine.startsWith('data: ')) {
          const jsonStr = trimmedLine.slice(6);
          try {
            const data: ChatCompletionResponse = JSON.parse(jsonStr);
            const content = data.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch {
            continue;
          }
        }
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '网络请求失败';
    onError(errorMessage);
  }
}
