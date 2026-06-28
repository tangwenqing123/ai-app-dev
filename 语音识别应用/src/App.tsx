import { useState, useCallback, useEffect } from 'react';
import { RecordButton } from './components/RecordButton';
import { ResultPanel } from './components/ResultPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { LoadingIndicator } from './components/LoadingIndicator';
import { useRecorder } from './hooks/useRecorder';
import { useLocalStorage } from './hooks/useLocalStorage';
import { recognizeAudio } from './services/aliyunAsrApi';
import { getErrorMessage } from './utils/errorHandler';
import type { TranscriptionRecord } from './types/asr';
import { MicOff, RefreshCw } from 'lucide-react';

// 开发环境日志控制
const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

function App() {
  const [recognitionText, setRecognitionText] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<TranscriptionRecord[]>('asr-history', []);

  const {
    audioBlob,
    recorderState,
    duration,
    startRecording,
    stopRecording,
    error,
  } = useRecorder();

  useEffect(() => {
    if (error) {
      devLog('[App] Recorder error:', error);
      setErrorMessage(getErrorMessage(error));
    } else {
      setErrorMessage(null);
    }
  }, [error]);

  const handleStartRecognition = useCallback(async () => {
    if (!audioBlob) {
      devLog('[App] No audio blob available');
      return;
    }

    devLog('[App] Starting recognition...');
    setIsRecognizing(true);
    setErrorMessage(null);

    try {
      devLog('[App] Calling recognizeAudio with blob size:', audioBlob.size);
      const result = await recognizeAudio(audioBlob);
      devLog('[App] Recognition successful');
      setRecognitionText(result.text);

      const newRecord: TranscriptionRecord = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: result.text,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newRecord, ...prev]);
      devLog('[App] Record saved to history');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
      devLog('[App] Recognition failed:', message);
      setErrorMessage(getErrorMessage(message));
    } finally {
      setIsRecognizing(false);
      devLog('[App] Recognition process completed');
    }
  }, [audioBlob, setHistory]);

  const handleSelectRecord = useCallback((record: TranscriptionRecord) => {
    devLog('[App] Selecting record:', record.id);
    setRecognitionText(record.text);
  }, []);

  const handleDeleteRecord = useCallback((id: string) => {
    devLog('[App] Deleting record:', id);
    setHistory((prev) => prev.filter((r) => r.id !== id));
  }, [setHistory]);

  const handleClearAll = useCallback(() => {
    devLog('[App] Clearing all history');
    setHistory([]);
  }, [setHistory]);

  const isRecording = recorderState === 'recording';
  const hasRecording = recorderState === 'stopped' && audioBlob !== null;

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-dark-text mb-2">语音识别应用</h1>
        <p className="text-gray-400">点击按钮开始录音，录音完成后自动识别转文字</p>
      </header>

      {errorMessage && (
        <div className="w-full max-w-2xl mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl flex items-center gap-3">
          {error?.includes('MIC') || error === 'MIC_PERMISSION_DENIED' ? (
            <MicOff className="w-5 h-5 text-red-400 flex-shrink-0" />
          ) : (
            <RefreshCw className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <p className="text-red-300 text-sm flex-1">{errorMessage}</p>
          {error === 'MIC_PERMISSION_DENIED' && (
            <button
              onClick={startRecording}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors"
            >
              重新请求权限
            </button>
          )}
        </div>
      )}

      <main className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <RecordButton
            isRecording={isRecording}
            duration={duration}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            disabled={isRecognizing}
          />

          {hasRecording && !isRecognizing && (
            <button
              onClick={handleStartRecognition}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
            >
              开始识别
            </button>
          )}

          {isRecognizing && (
            <LoadingIndicator message="正在识别中，请稍候..." />
          )}
        </div>

        {recognitionText && <ResultPanel text={recognitionText} isEditing />}

        <HistoryPanel
          records={history}
          onSelectRecord={handleSelectRecord}
          onDeleteRecord={handleDeleteRecord}
          onClearAll={handleClearAll}
        />
      </main>

      <footer className="mt-auto pt-8 text-center text-gray-500 text-sm">
        <p>录音最长 60 秒 · 识别结果自动保存</p>
      </footer>
    </div>
  );
}

export default App;
