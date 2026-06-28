export interface AppError {
  code: string;
  message: string;
}

export const ErrorMessages: Record<string, string> = {
  MIC_PERMISSION_DENIED: '需要麦克风权限才能录音，请在浏览器设置中允许访问麦克风。',
  NETWORK_ERROR: '网络连接失败，请检查网络后重试。',
  API_KEY_INVALID: '服务配置错误，请联系管理员。',
  AUDIO_FORMAT_NOT_SUPPORTED: '音频格式不支持，请尝试重新录音。',
  RECOGNITION_TIMEOUT: '识别超时，请重试。',
  FILE_TOO_LARGE: '录音文件过大，请缩短录音时长（≤60秒）。',
  UNKNOWN_ERROR: '发生未知错误，请重试。',
};

export function getErrorMessage(code: string): string {
  return ErrorMessages[code] || ErrorMessages.UNKNOWN_ERROR;
}
