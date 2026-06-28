import { useState, useCallback, useRef, useEffect } from 'react';
import type { RecorderState, UseRecorderReturn } from '../types/asr';

const MAX_DURATION = 60;

export function useRecorder(): UseRecorderReturn {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recorderState, setRecorderState] = useState<RecorderState>('idle');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    setDuration(0);
    timerRef.current = window.setInterval(() => {
      setDuration((prev) => {
        if (prev >= MAX_DURATION - 1) {
          clearTimer();
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }, [clearTimer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    clearTimer();
  }, [clearTimer]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const webmBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(webmBlob);
        setRecorderState('stopped');
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        setError('录音过程中发生错误: ' + (event.error?.message || '未知错误'));
        setRecorderState('idle');
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100);
      setRecorderState('recording');
      startTimer();
    } catch (err) {
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError('MIC_PERMISSION_DENIED');
      } else {
        setError('无法访问麦克风: ' + (err instanceof Error ? err.message : '未知错误'));
      }
      setRecorderState('idle');
    }
  }, [startTimer, clearTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [clearTimer]);

  return {
    audioBlob,
    recorderState,
    duration,
    startRecording,
    stopRecording,
    error,
  };
}
