export interface AppError extends Error {
  code?: string;
  statusCode?: number;
}

export function handleApiError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: getErrorCode(error),
      statusCode: getStatusCode(error),
    };
  }

  return {
    name: 'UnknownError',
    message: String(error),
    code: 'UNKNOWN',
  };
}

function getErrorCode(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes('api key')) return 'API_KEY_ERROR';
  if (message.includes('network')) return 'NETWORK_ERROR';
  if (message.includes('timeout')) return 'TIMEOUT_ERROR';
  if (message.includes('rate limit')) return 'RATE_LIMIT_ERROR';
  if (message.includes('quota')) return 'QUOTA_ERROR';

  return 'GENERAL_ERROR';
}

function getStatusCode(error: Error): number | undefined {
  const message = error.message;

  if (message.includes('401')) return 401;
  if (message.includes('403')) return 403;
  if (message.includes('429')) return 429;
  if (message.includes('500')) return 500;
  if (message.includes('503')) return 503;

  return undefined;
}

export function getUserFriendlyMessage(error: AppError): string {
  switch (error.code) {
    case 'API_KEY_ERROR':
      return 'API Key 无效或未配置，请检查环境变量 VITE_DEEPSEEK_API_KEY';
    case 'NETWORK_ERROR':
      return '网络连接失败，请检查网络后重试';
    case 'TIMEOUT_ERROR':
      return '请求超时，请稍后重试';
    case 'RATE_LIMIT_ERROR':
      return '请求过于频繁，请稍后再试';
    case 'QUOTA_ERROR':
      return 'API 配额已用尽，请检查账户余额';
    case 'GENERAL_ERROR':
    default:
      return error.message || '生成失败，请稍后重试';
  }
}
