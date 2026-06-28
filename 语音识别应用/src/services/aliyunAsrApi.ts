import type { RecognitionResult } from '../types/asr';

const API_URL = '/api/asr';
const TIMEOUT_MS = 30000;

const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

interface ApiResponse {
  request_id: string;
  output: {
    sentence_count: number;
    sentences: Array<{
      text: string;
      start_time: number;
      end_time: number;
      confidence: number;
    }>;
  };
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function webmToWav(webmBlob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const audioContext = new AudioContext();
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      try {
        const arrayBuffer = fileReader.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const wavBuffer = audioBufferToWav(audioBuffer);
        const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
        audioContext.close();
        resolve(wavBlob);
      } catch (error) {
        audioContext.close();
        reject(error);
      }
    };

    fileReader.onerror = (error) => {
      audioContext.close();
      reject(error);
    };

    fileReader.readAsArrayBuffer(webmBlob);
  });
}

function audioBufferToWav(audioBuffer: AudioBuffer): ArrayBuffer {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length * numberOfChannels * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  let offset = 0;
  writeString(offset, 'RIFF');
  offset += 4;
  view.setUint32(offset, 36 + audioBuffer.length * numberOfChannels * 2, true);
  offset += 4;
  writeString(offset, 'WAVE');
  offset += 4;
  writeString(offset, 'fmt ');
  offset += 4;
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, numberOfChannels, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, sampleRate * 2 * numberOfChannels, true);
  offset += 4;
  view.setUint16(offset, numberOfChannels * 2, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  writeString(offset, 'data');
  offset += 4;
  view.setUint32(offset, audioBuffer.length * numberOfChannels * 2, true);
  offset += 4;

  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return buffer;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('RECOGNITION_TIMEOUT');
    }
    throw error;
  }
}

export async function recognizeAudio(audioBlob: Blob): Promise<RecognitionResult> {
  devLog('[ASR API] Starting audio recognition...');
  devLog('[ASR API] Audio blob type:', audioBlob.type, 'size:', audioBlob.size, 'bytes');

  try {
    let wavBlob = audioBlob;
    
    if (audioBlob.type.includes('webm')) {
      devLog('[ASR API] Converting webm to wav...');
      wavBlob = await webmToWav(audioBlob);
      devLog('[ASR API] Conversion completed, wav size:', wavBlob.size, 'bytes');
    }

    const audioBase64 = await blobToBase64(wavBlob);
    devLog('[ASR API] Audio base64 length:', audioBase64.length);

    const response = await fetchWithTimeout(
      API_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'paraformer-v2',
          input: {
            audio: audioBase64,
          },
          parameters: {
            language: 'zh-CN',
            audio_format: 'wav',
            sample_rate: 16000,
          },
        }),
      },
      TIMEOUT_MS
    );

    devLog('[ASR API] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      devLog('[ASR API] API call failed:', response.status, errorText);

      let errorCode = 'UNKNOWN_ERROR';
      try {
        const errorJson = JSON.parse(errorText);
        errorCode = errorJson.code || errorJson.message || 'UNKNOWN_ERROR';
      } catch {
        errorCode = `HTTP_${response.status}`;
      }

      if (errorCode.includes('InvalidParameter')) {
        throw new Error('AUDIO_FORMAT_NOT_SUPPORTED');
      }
      if (errorCode.includes('ApiKeyInvalid') || response.status === 401) {
        throw new Error('API_KEY_INVALID');
      }
      if (response.status === 413 || errorText.includes('too large')) {
        throw new Error('FILE_TOO_LARGE');
      }

      throw new Error(`API_ERROR:${errorCode}`);
    }

    const result: ApiResponse = await response.json();
    devLog('[ASR API] API response received');

    const text = result.output?.sentences?.map((s) => s.text).join('') || '';
    devLog('[ASR API] Recognition completed, text length:', text.length);

    return {
      text,
      requestId: result.request_id,
    };
  } catch (error) {
    devLog('[ASR API] Recognition error:', error);

    if (error instanceof Error) {
      if (
        error.message === 'RECOGNITION_TIMEOUT' ||
        error.message.startsWith('API_ERROR:') ||
        ['AUDIO_FORMAT_NOT_SUPPORTED', 'API_KEY_INVALID', 'FILE_TOO_LARGE'].includes(error.message)
      ) {
        throw error;
      }
      if (error.message.includes('fetch') || error.message.includes('network')) {
        throw new Error('NETWORK_ERROR');
      }
      throw new Error(error.message);
    }
    throw new Error('UNKNOWN_ERROR');
  }
}
