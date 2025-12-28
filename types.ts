export type Platform = 'youtube' | 'instagram' | 'twitter' | 'linkedin' | 'github' | 'blog' | 'news' | 'shopping' | 'other';

export type PlanType = 'free' | 'pro';

// PortOne Global Object Type
declare global {
  interface Window {
    IMP: any;
  }
}

export interface UserProfile {
  id: string;
  plan: PlanType;
  pinCount: number;
}

export interface Pin {
  id: string;
  originalUrl: string;
  title: string;
  summary: string;
  platform: Platform;
  tags: string[];
  createdAt: number;
  thumbnailUrl?: string;
  isAnalyzing?: boolean;
  note?: string; // New: Simple note or to-do text
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  pins: Pin[];
  createdAt: number;
}

export interface AIAnalysisResult {
  title: string;
  summary: string;
  platform: Platform;
  tags: string[];
  thumbnailUrl?: string;
}