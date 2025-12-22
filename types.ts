
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
  thumbnailUrl?: string; // Optional place for an image if we had one
  isAnalyzing?: boolean; // New flag for loading state
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string; // Changed from emoji to color hex code
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