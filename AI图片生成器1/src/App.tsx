import { useState, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { ImageDisplay } from './components/ImageDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { ErrorMessage } from './components/ErrorMessage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useImageGeneration } from './hooks/useImageGeneration';
import type { GenerationRecord, SizeOption } from './types/image';

function App() {
  const [history, setHistory, clearHistory] = useLocalStorage<GenerationRecord[]>('ai-image-history', []);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSuccess = useCallback((record: GenerationRecord) => {
    setCurrentImageUrl(record.imageUrl);
    setHistory((prev: GenerationRecord[]) => [record, ...prev]);
  }, [setHistory]);

  const { isLoading, error: apiError, generate } = useImageGeneration(handleGenerateSuccess);

  const handleGenerate = async (params: { prompt: string; size: SizeOption; promptExtend: boolean }) => {
    setError(null);
    await generate(params, params.prompt, params.promptExtend ? params.prompt : undefined);
  };

  const handleSelectRecord = (record: GenerationRecord) => {
    setCurrentImageUrl(record.imageUrl);
  };

  const handleDeleteRecord = (id: string) => {
    setHistory((prev: GenerationRecord[]) => prev.filter((r: GenerationRecord) => r.id !== id));
  };

  const handleClearAll = () => {
    clearHistory();
    setCurrentImageUrl(null);
  };

  const displayError = error || apiError;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧 - 输入面板 */}
          <div className="w-full md:w-2/5 flex flex-col gap-4">
            <InputPanel
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* 右侧 - 展示区 */}
          <div className="w-full md:w-3/5 flex flex-col gap-4">
            {displayError && (
              <ErrorMessage
                message={displayError}
                onClose={() => {
                  setError(null);
                }}
              />
            )}
            <ImageDisplay
              imageUrl={currentImageUrl}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* 底部 - 历史记录 */}
        <div className="mt-6 h-64">
          <HistoryPanel
            records={history}
            onSelectRecord={handleSelectRecord}
            onDeleteRecord={handleDeleteRecord}
            onClearAll={handleClearAll}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
