import { useState, useCallback, useEffect } from 'react';
import { PenTool } from 'lucide-react';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { HistoryPanel } from '@/components/HistoryPanel';
import { EnvTest } from '@/components/EnvTest';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useStreamingGeneration } from '@/hooks/useStreamingGeneration';
import { buildPrompt, buildOptimizePrompt } from '@/services/promptTemplates';
import { generateNonStreaming } from '@/services/deepseekApi';
import type { WritingMode, GenerateParams, GenerationRecord } from '@/types/writing';

const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 800;
const HISTORY_KEY = 'writing-history';
const PARAMS_KEY = 'writing-params';

function App() {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<WritingMode>('continue');
  const [params, setParams] = useLocalStorage<GenerateParams>(PARAMS_KEY, {
    temperature: DEFAULT_TEMPERATURE,
    maxTokens: DEFAULT_MAX_TOKENS,
  });
  const [history, setHistory] = useLocalStorage<GenerationRecord[]>(HISTORY_KEY, []);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const { output, isGenerating, error, startGeneration, reset } = useStreamingGeneration();

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim() || isGenerating) {
      console.debug('[DEBUG] handleGenerate early return - empty input or already generating');
      return;
    }

    console.debug('[DEBUG] handleGenerate called');
    console.debug('[DEBUG] Input text length:', inputText.length);
    console.debug('[DEBUG] Mode:', mode);

    reset();
    const prompt = buildPrompt(mode, inputText);
    console.debug('[DEBUG] Built prompt length:', prompt.length);

    const currentInput = inputText;
    const currentMode = mode;

    console.debug('[DEBUG] Calling startGeneration...');
    await startGeneration(prompt, params, (generatedOutput) => {
      console.debug('[DEBUG] onComplete callback fired');
      console.debug('[DEBUG] Generated output length:', generatedOutput.length);

      const newRecord: GenerationRecord = {
        id: Date.now().toString(),
        mode: currentMode,
        inputText: currentInput,
        outputText: generatedOutput,
        createdAt: Date.now(),
      };
      console.debug('[DEBUG] Created new record, adding to history...');
      setHistory((prev) => [newRecord, ...prev]);
      console.debug('[DEBUG] History updated');
    });
    console.debug('[DEBUG] handleGenerate completed');
  }, [inputText, mode, params, isGenerating, reset, startGeneration, setHistory]);

  const handleOptimizePrompt = useCallback(async () => {
    if (!inputText.trim() || isGenerating || isOptimizing) return;

    setIsOptimizing(true);
    const optimizePrompt = buildOptimizePrompt(inputText, mode);

    try {
      const optimized = await generateNonStreaming(optimizePrompt, {
        temperature: 0.3,
        maxTokens: 500,
      });
      setInputText(optimized.trim());
    } catch (err) {
      console.error('优化提示词失败:', err);
    } finally {
      setIsOptimizing(false);
    }
  }, [inputText, mode, isGenerating, isOptimizing]);

  const handleLoadRecord = useCallback((record: GenerationRecord) => {
    setInputText(record.inputText);
    setMode(record.mode);
    reset();
  }, [reset]);

  const handleDeleteRecord = useCallback((id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  }, [setHistory]);

  const handleClearAllHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isGenerating) {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGenerating, reset]);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      <header className="border-b border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <PenTool size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">智能写作助手</h1>
              <p className="text-sm text-gray-400">基于 DeepSeek API 的 AI 写作工具</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)]">
          <div className="md:w-2/5 flex flex-col">
            <InputPanel
              inputText={inputText}
              mode={mode}
              params={params}
              isGenerating={isGenerating}
              onInputChange={setInputText}
              onModeChange={setMode}
              onParamsChange={setParams}
              onGenerate={handleGenerate}
              onOptimizePrompt={handleOptimizePrompt}
              isOptimizing={isOptimizing}
            />
          </div>

          <div className="md:w-3/5 flex flex-col">
            <OutputPanel content={output} isGenerating={isGenerating} error={error} />
          </div>
        </div>
      </main>

      <HistoryPanel
        records={history}
        onLoadRecord={handleLoadRecord}
        onDeleteRecord={handleDeleteRecord}
        onClearAll={handleClearAllHistory}
      />

      <EnvTest />
    </div>
  );
}

export default App;
