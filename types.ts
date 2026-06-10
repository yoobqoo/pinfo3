
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
  intent?: string; // 저장 목적 (맛집/공부/쇼핑/여행/영감/업무)
  tasks?: string[]; // AI가 추출한 실행 가능한 할 일 목록
  completedTasks?: number[]; // 완료된 task의 인덱스
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
