
export type Platform = 'youtube' | 'instagram' | 'threads' | 'twitter' | 'linkedin' | 'github' | 'blog' | 'news' | 'shopping' | 'other';

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
  note?: string;
  author?: string; // 작성자 계정 명 (@username)
  authorProfileUrl?: string; // 작성자 프로필 주소
  platformId?: string; // 게시물 고유 ID (postId)
  fullContentCollected?: boolean; // 본문 전문 수집 성공 여부
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
