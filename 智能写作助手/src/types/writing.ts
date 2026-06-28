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
  description: string;
}

export const WRITING_MODES: WritingModeOption[] = [
  { value: 'continue', label: '文章续写', description: '基于开头继续撰写连贯内容' },
  { value: 'rewrite', label: '内容改写', description: '优化文本使其更流畅专业' },
  { value: 'expand', label: '内容扩展', description: '增加细节和论证丰富内容' },
  { value: 'summarize', label: '内容总结', description: '提取核心要点生成摘要' },
  { value: 'email', label: '邮件撰写', description: '根据主题生成专业邮件' },
  { value: 'copywriting', label: '文案生成', description: '生成营销文案' },
];
