/**
 * 浏览器原生语音识别服务
 * 使用 Web Speech API
 * 无需API Key，免费使用
 */

import type { RecognitionResult } from '../types/asr';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

// 声明全局类型
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

/**
 * 浏览器原生语音识别
 * 使用 Web Speech API
 */
export function recognizeWithBrowser(): Promise<RecognitionResult> {
  return new Promise((resolve, reject) => {
    // 检查浏览器支持
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      reject(new Error('您的浏览器不支持语音识别功能'));
      return;
    }

    const recognition = new SpeechRecognition();

    // 配置
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN'; // 中文

    let finalTranscript = '';
    let interimTranscript = '';

    recognition.onstart = () => {
      console.log('开始语音识别...');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // 处理中间结果
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript = transcript;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('语音识别错误:', event.error);
      reject(new Error(getErrorMessage(event.error)));
    };

    recognition.onend = () => {
      if (finalTranscript) {
        resolve({
          text: finalTranscript,
          requestId: 'browser-api',
        });
      } else if (interimTranscript) {
        resolve({
          text: interimTranscript,
          requestId: 'browser-api',
        });
      } else {
        reject(new Error('未识别到语音内容'));
      }
    };

    // 开始识别
    try {
      recognition.start();
    } catch (e) {
      reject(new Error('启动语音识别失败'));
    }
  });
}

/**
 * 获取错误信息
 */
function getErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    'no-speech': '未检测到语音',
    'audio-capture': '无法访问麦克风',
    'not-allowed': '麦克风权限被拒绝',
    'network': '网络错误',
    'aborted': '识别被中断',
    'language-not-supported': '不支持该语言',
  };

  return errorMessages[error] || `识别错误: ${error}`;
}

/**
 * 检查浏览器是否支持语音识别
 */
export function isBrowserRecognitionSupported(): boolean {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}
