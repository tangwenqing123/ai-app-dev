import { useState, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { ImageDisplay } from './components/ImageDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useImageGeneration } from './hooks/useImageGeneration';
import type { GenerationRecord, SizeOption } from './types/image';

function App() {
  const [history, setHistory] = useLocalStorage<GenerationRecord[]>('ai-image-history', []);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const handleGenerateSuccess = useCallback((record: GenerationRecord) => {
    setHistory(prev => [record, ...prev]);
    setCurrentImageUrl(record.imageUrl);
  }, [setHistory]);

  const { isLoading, error, generate, clearError } = useImageGeneration(handleGenerateSuccess);

  const handleGenerate = async (prompt: string, size: SizeOption, promptExtend: boolean) => {
    await generate({ prompt, size, promptExtend }, prompt);
  };

  const handleSelectRecord = (record: GenerationRecord) => {
    setCurrentImageUrl(record.imageUrl);
  };

  const handleDeleteRecord = (id: string) => {
    setHistory(prev => prev.filter(r => r.id !== id));
  };

  const handleClearAll = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-6">
      <header className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
          AI 图片生成器
        </h1>
        <p className="text-gray-500 text-center mt-2">
          基于通义万相 · 文字生成图片
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/5 flex flex-col gap-6">
            <InputPanel
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
            <div className="lg:hidden">
              <HistoryPanel
                records={history}
                onSelect={handleSelectRecord}
                onDelete={handleDeleteRecord}
                onClearAll={handleClearAll}
              />
            </div>
          </div>

          <div className="w-full lg:w-3/5">
            <ImageDisplay
              imageUrl={currentImageUrl}
              isLoading={isLoading}
              error={error}
              onClearError={clearError}
            />
          </div>

          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="h-full max-h-[calc(100vh-150px)] sticky top-6">
              <HistoryPanel
                records={history}
                onSelect={handleSelectRecord}
                onDelete={handleDeleteRecord}
                onClearAll={handleClearAll}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
