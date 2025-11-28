
export enum ClothingCategory {
  CUSTOM = '自定义上传',
  CASUAL = '休闲',
  FORMAL = '正式',
  SPORTS = '运动',
  EVENING = '晚礼服',
  STREETWEAR = '街头',
  BUSINESS_CASUAL = '商务休闲',
  MINIMALIST = '极简主义',
  VINTAGE = '复古风',
  BOHEMIAN = '波西米亚'
}

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  image: string;
  description: string;
  isCustom?: boolean; // New flag for user uploaded clothes
}

export interface Scene {
  id: string;
  name: string;
  prompt: string;
  image: string; 
}

export interface AnalysisData {
  bodyType: string;
  skinTone: string;
  styleAdvice: string;
  currentOutfitCritique: string;
  trendingNow: string;
  suggestedItemIds: string[]; 
}

export enum AppMode {
  UPLOAD = 'UPLOAD',
  CAMERA = 'CAMERA',
  FITTING = 'FITTING'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Configuration for generation
export interface GenerationConfig {
  pose: string;
  expression: string;
}
