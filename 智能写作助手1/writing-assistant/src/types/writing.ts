export type WritingMode = 'continue' | 'rewrite' | 'expand' | 'summarize' | 'email' | 'copywriting';

export interface GenerationRecord {
  id: string;
  mode: WritingMode;
  inputText: string;
  outputText: string;
  createdAt: number;
}

export interface GenerateParams {
  temperature: number;
  maxTokens: number;
}

export interface WritingModeOption {
  value: WritingMode;
  label: string;
}

export const WRITING_MODES: WritingModeOption[] = [
  { value: 'continue', label: '文章续写' },
  { value: 'rewrite', label: '内容改写' },
  { value: 'expand', label: '内容扩展' },
  { value: 'summarize', label: '内容总结' },
  { value: 'email', label: '邮件撰写' },
  { value: 'copywriting', label: '文案生成' },
];
