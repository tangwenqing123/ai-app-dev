import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import type { WritingMode, GenerationRecord } from './types/writing';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useStreamingGeneration } from './hooks/useStreamingGeneration';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { HistoryPanel } from './components/HistoryPanel';

const HISTORY_KEY = 'writing-history';
const TEMPERATURE_KEY = 'writing-temperature';
const MAX_TOKENS_KEY = 'writing-maxTokens';

function App() {
  const [mode, setMode] = useState<WritingMode>('continue');
  const [inputText, setInputText] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [temperature, setTemperature] = useLocalStorage(TEMPERATURE_KEY, 0.7);
  const [maxTokens, setMaxTokens] = useLocalStorage(MAX_TOKENS_KEY, 800);
  const [history, setHistory] = useLocalStorage<GenerationRecord[]>(HISTORY_KEY, []);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const outputRef = useRef<HTMLDivElement>(null);

  const { isGenerating, outputText, error, generate, optimizePrompt } = useStreamingGeneration({
    onComplete: (record) => {
      setHistory((prev) => [record, ...prev]);
    },
  });

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputText]);

  const handleGenerate = () => {
    generate(mode, inputText, temperature, maxTokens, emailSubject);
  };

  const handleOptimizePrompt = () => {
    const currentPrompt = inputText;
    optimizePrompt(currentPrompt, (optimized) => {
      setInputText(optimized);
    });
  };

  const handleClear = () => {
    setInputText('');
    setEmailSubject('');
  };

  const handleSelectHistory = (record: GenerationRecord) => {
    setMode(record.mode);
    setInputText(record.inputText);
    setEmailSubject('');
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-2/5 lg:w-2/5 border-r border-[#404040] flex flex-col">
          <div className="p-4 border-b border-[#404040] flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#e0e0e0]">智能写作助手</h1>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="p-2 md:hidden text-[#a0a0a0] hover:text-[#e0e0e0]"
            >
              {isHistoryOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <InputPanel
              mode={mode}
              inputText={inputText}
              emailSubject={emailSubject}
              temperature={temperature}
              maxTokens={maxTokens}
              isGenerating={isGenerating}
              onModeChange={setMode}
              onInputChange={setInputText}
              onEmailSubjectChange={setEmailSubject}
              onTemperatureChange={setTemperature}
              onMaxTokensChange={setMaxTokens}
              onGenerate={handleGenerate}
              onOptimizePrompt={handleOptimizePrompt}
              onClear={handleClear}
            />
          </div>
        </div>

        <div className="hidden md:flex md:w-3/5 lg:w-3/5 flex-col">
          <OutputPanel
            content={outputText}
            isGenerating={isGenerating}
            error={error}
          />
        </div>

        {isHistoryOpen && (
          <div className="fixed md:hidden inset-0 z-50">
            <HistoryPanel
              records={history}
              isOpen={isHistoryOpen}
              onSelect={handleSelectHistory}
              onDelete={handleDeleteHistory}
              onClearAll={handleClearAllHistory}
            />
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <HistoryPanel
          records={history}
          isOpen={isHistoryOpen}
          onSelect={handleSelectHistory}
          onDelete={handleDeleteHistory}
          onClearAll={handleClearAllHistory}
        />
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#404040] bg-[#1e1e1e]">
        <div className="h-48 overflow-auto" ref={outputRef}>
          <OutputPanel
            content={outputText}
            isGenerating={isGenerating}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
