export type SizeOption = '1K' | '2K' | '4K';

export interface GenerationRecord {
  id: string;
  originalPrompt: string;
  optimizedPrompt?: string;
  imageUrl: string;
  size: SizeOption;
  createdAt: number;
}

export interface GenerateParams {
  prompt: string;
  size: SizeOption;
  promptExtend: boolean;
  n?: number;
}

export interface ApiError {
  message: string;
  code?: string;
}
