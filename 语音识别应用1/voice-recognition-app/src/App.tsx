/**
 * 语音识别应用主组件
 * 优先使用浏览器原生 API，备用阿里云 API
 */

import { useState, useCallback } from 'react';
import { RecordButton } from './components/RecordButton';
import { ResultPanel } from './components/ResultPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { LoadingIndicator } from './components/LoadingIndicator';
import { useRecorder } from './hooks/useRecorder';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { TranscriptionRecord } from './types/asr';
import { recognizeWithBrowser, isBrowserRecognitionSupported } from './services/browserAsrApi';
import { AlertCircle, RefreshCw, Info } from 'lucide-react';

function App() {
  // 识别结果
  const [resultText, setResultText] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 历史记录
  const [history, setHistory, clearHistory] = useLocalStorage<TranscriptionRecord[]>(
    'asr-history',
    []
  );

  // 录音 Hook
  const {
    state: recorderState,
    duration,
    error: recorderError,
    startRecording,
    stopRecording,
    reset,
  } = useRecorder();

  // 检查浏览器是否支持
  const browserSupported = isBrowserRecognitionSupported();

  // 处理录音完成
  const handleStopRecording = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  // 执行语音识别 - 使用浏览器原生 API
  const handleRecognize = useCallback(async () => {
    setIsRecognizing(true);
    setError(null);

    try {
      // 使用浏览器原生语音识别
      const result = await recognizeWithBrowser();

      // 更新结果
      setResultText(result.text);

      // 保存到历史记录
      if (result.text.trim()) {
        const newRecord: TranscriptionRecord = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: result.text,
          timestamp: Date.now(),
        };
        setHistory((prev) => [newRecord, ...prev]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '识别失败，请重试';
      setError(errorMessage);
    } finally {
      setIsRecognizing(false);
    }
  }, [setHistory]);

  // 选择历史记录
  const handleSelectHistory = useCallback((record: TranscriptionRecord) => {
    setResultText(record.text);
  }, []);

  // 删除历史记录
  const handleDeleteHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  }, [setHistory]);

  // 清空所有历史记录
  const handleClearAll = useCallback(() => {
    if (confirm('确定要清空所有历史记录吗？')) {
      clearHistory();
    }
  }, [clearHistory]);

  // 处理错误
  const handleRetryPermission = useCallback(() => {
    reset();
    startRecording();
  }, [reset, startRecording]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] flex flex-col">
      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-center">
          语音识别应用
        </h1>

        {/* 浏览器兼容性提示 */}
        {!browserSupported && (
          <div className="flex items-center gap-2 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-400 max-w-md">
            <Info className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">您的浏览器不支持语音识别，请使用 Chrome/Edge/Safari</span>
          </div>
        )}

        {/* 录音按钮区域 */}
        <div className="flex flex-col items-center gap-4">
          <RecordButton
            state={recorderState}
            duration={duration}
            onStart={startRecording}
            onStop={handleStopRecording}
            disabled={isRecognizing || !browserSupported}
          />

          {/* 麦克风权限错误 */}
          {recorderError && (
            <div className="flex flex-col items-center gap-2 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{recorderError}</span>
              </div>
              <button
                onClick={handleRetryPermission}
                className="flex items-center gap-1 text-sm text-red-300 hover:text-red-200"
              >
                <RefreshCw className="w-4 h-4" />
                重新请求权限
              </button>
            </div>
          )}
        </div>

        {/* 识别按钮 - 录音停止后显示 */}
        {recorderState === 'stopped' && !isRecognizing && browserSupported && (
          <button
            onClick={handleRecognize}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            开始识别
          </button>
        )}

        {/* 识别中状态 */}
        {isRecognizing && (
          <LoadingIndicator message="正在聆听，请说话..." />
        )}

        {/* 识别错误 */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* 识别结果 */}
        {(resultText || isRecognizing) && (
          <ResultPanel
            text={resultText}
            isLoading={isRecognizing}
            onTextChange={setResultText}
          />
        )}
      </main>

      {/* 底部历史记录 */}
      <footer className="border-t border-[#404040] bg-[#0a0a0a] p-6">
        <div className="max-w-2xl mx-auto">
          <HistoryPanel
            records={history}
            onSelect={handleSelectHistory}
            onDelete={handleDeleteHistory}
            onClearAll={handleClearAll}
          />
        </div>
      </footer>
    </div>
  );
}

export default App;
