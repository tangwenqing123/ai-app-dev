/**
 * 语音识别相关类型定义
 */

// 识别记录
export interface TranscriptionRecord {
  id: string;           // timestamp + random
  text: string;         // 识别文本
  timestamp: number;    // 识别时间戳（毫秒）
}

// 识别结果
export interface RecognitionResult {
  text: string;         // 识别出的文字
  requestId?: string;   // API 请求 ID（用于调试）
}

// 录音状态
export type RecorderState = 'idle' | 'recording' | 'stopped';

// API 错误响应
export interface ApiError {
  message: string;
  code?: string;
}
