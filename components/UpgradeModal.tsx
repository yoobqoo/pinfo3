import React from 'react';
import { X, Check, Zap, Crown } from 'lucide-react';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-[#F2F0E9] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Background Decorative Blobs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#FFD60A] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#FF453A] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

        <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 bg-black/5 rounded-full hover:bg-black/10 transition-colors"
        >
            <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-[#1A1918] rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3">
                <Crown className="w-8 h-8 text-[#FFD60A]" fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black text-[#1A1918] mb-2 leading-tight">
                무제한 영감을<br/>수집하세요
            </h2>
            <p className="text-gray-500 font-medium text-sm">
                무료 플랜은 핀을 30개까지 저장할 수 있습니다.<br/>
                Pro로 업그레이드하고 제한을 해제하세요.
            </p>
        </div>

        <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-[#EAE6DF]">
                <div className="w-8 h-8 rounded-full bg-[#34C759]/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-[#34C759]" strokeWidth={3} />
                </div>
                <div className="text-left">
                    <div className="font-bold text-sm text-[#1A1918]">무제한 핀 저장</div>
                </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-[#EAE6DF]">
                <div className="w-8 h-8 rounded-full bg-[#007AFF]/20 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-[#007AFF]" fill="currentColor" />
                </div>
                <div className="text-left">
                    <div className="font-bold text-sm text-[#1A1918]">심층 AI 분석 & 요약</div>
                </div>
            </div>
        </div>

        <button 
            onClick={onUpgrade}
            className="w-full py-4 bg-[#1A1918] text-white rounded-2xl font-bold text-lg shadow-xl shadow-black/10 active:scale-95 transition-all flex flex-col items-center justify-center gap-0.5"
        >
            <span>Pro 시작하기</span>
            <span className="text-[10px] font-medium opacity-60 font-mono">₩4,900 / 월</span>
        </button>
        
        <p className="text-center text-[10px] text-gray-400 mt-4 font-medium">
            언제든지 구독을 취소할 수 있습니다.
        </p>
      </div>
    </div>
  );
};