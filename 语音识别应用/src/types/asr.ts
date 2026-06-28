export interface TranscriptionRecord {
  id: string;
  text: string;
  timestamp: number;
}

export interface RecognitionResult {
  text: string;
  requestId?: string;
}

export type RecorderState = 'idle' | 'recording' | 'stopped';

export interface UseRecorderReturn {
  audioBlob: Blob | null;
  recorderState: RecorderState;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: string | null;
}
