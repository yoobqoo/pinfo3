
import React, { useState, useEffect, useRef } from 'react';
import { Pin, Platform } from '../types';
import { PlatformIcon } from './Icons';
import { ExternalLink, ArrowUpRight, Loader2, Sparkles, Link as LinkIcon, Image as ImageIcon, ChevronDown, ChevronUp, StickyNote, Check } from 'lucide-react';

interface PinCardProps {
  pin: Pin;
  color: string;
  onUpdateNote?: (pinId: string, note: string) => void;
}

const isLightColor = (hex: string) => {
  const lightColors = ['#FDD248', '#F7EDC8'];
  return lightColors.includes(hex.toUpperCase()) || lightColors.includes(hex);
};

export const PinCard: React.FC<PinCardProps> = ({ pin, color, onUpdateNote }) => {
  const [imgError, setImgError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localNote, setLocalNote] = useState(pin.note || '');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const timerRef = useRef<any>(null);

  const dateStr = new Date(pin.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  const isLight = isLightColor(color);
  const textColorClass = isLight ? 'text-gray-900' : 'text-white';
  const subTextColorClass = isLight ? 'text-gray-700' : 'text-white/80';
  
  // HashTags significantly darkened for better separation from background and note
  const tagClass = isLight ? 'bg-black/35 text-white/90 shadow-sm' : 'bg-black/50 text-white shadow-sm';
  
  const iconColor = isLight ? 'text-black' : 'text-white';
  const shimmerClass = isLight ? 'bg-black/10' : 'bg-white/20';
  const dividerClass = isLight ? 'bg-black/10' : 'bg-white/10';

  const saveNote = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onUpdateNote?.(pin.id, localNote);
    
    // Show success feedback
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalNote(val);
    
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
        onUpdateNote?.(pin.id, val);
    }, 2000);
  };

  return (
    <div 
      className={`group relative flex flex-col rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer border-t border-white/10 ${textColorClass} ${isExpanded ? 'min-h-[500px]' : 'min-h-[350px]'}`}
      style={{ 
        backgroundColor: color,
        boxShadow: `0 20px 40px -10px ${color}60`
      }}
    >
      {/* Top Content: Always visible */}
      <div className="p-6 pb-4 relative z-20 flex flex-col gap-4">
        <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 opacity-90">
                <div className={`p-1.5 rounded-full ${isLight ? 'bg-white/40' : 'bg-black/20'}`}>
                   <PlatformIcon platform={pin.platform} className={`w-4 h-4 ${iconColor}`} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{pin.platform}</span>
            </div>
            <a 
              href={pin.originalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${isLight ? 'bg-black/15 text-black' : 'bg-white/20 text-white'} transition-all hover:scale-110 active:scale-95`}
              onClick={(e) => e.stopPropagation()}
            >
                <ArrowUpRight className="w-4 h-4" />
            </a>
        </div>

        <div className="space-y-4">
            {pin.thumbnailUrl && !imgError ? (
                <div className="w-full h-40 rounded-2xl overflow-hidden bg-black/10 shadow-inner relative group-hover:scale-[1.01] transition-transform duration-500">
                    <img 
                        src={pin.thumbnailUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                </div>
            ) : pin.isAnalyzing ? (
              <div className={`w-full h-40 rounded-2xl overflow-hidden ${shimmerClass} animate-pulse flex items-center justify-center`}>
                <ImageIcon className={`w-8 h-8 ${iconColor} opacity-20`} />
              </div>
            ) : null}

            <div>
                 <h3 className={`text-xl font-bold leading-snug tracking-tight line-clamp-2`}>
                    {pin.title}
                </h3>
            </div>
        </div>
      </div>
      
      <div className={`mx-6 h-px ${dividerClass}`} />

      {/* Bottom Content: AI Insight (Loading state included) */}
      <div className={`p-6 pt-4 flex-grow flex flex-col justify-between transition-all duration-500 ${isExpanded ? 'bg-black/15' : 'bg-black/5'}`}>
        {pin.isAnalyzing ? (
            <div className="flex flex-col gap-3 py-2 animate-pulse opacity-70">
                <div className="flex items-center gap-1.5">
                    <Loader2 className={`w-3.5 h-3.5 animate-spin ${subTextColorClass}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${subTextColorClass}`}>AI 분석 중...</span>
                </div>
                <div className="space-y-2">
                    <div className={`h-2.5 w-full rounded-full ${shimmerClass}`}></div>
                    <div className={`h-2.5 w-3/4 rounded-full ${shimmerClass}`}></div>
                </div>
            </div>
        ) : (
            <>
                <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 opacity-60">
                            <Sparkles className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">AI INSIGHT</span>
                        </div>
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight transition-all active:scale-95 shadow-sm ${isLight ? 'bg-black/15 text-black' : 'bg-white/20 text-white'}`}
                        >
                            {isExpanded ? <><ChevronUp className="w-3 h-3" /> 접기</> : <><ChevronDown className="w-3 h-3" /> 더보기</>}
                        </button>
                    </div>
                    
                    <div className={`transition-all duration-500 ${isExpanded ? '' : 'max-h-[85px] overflow-hidden relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-8 after:bg-gradient-to-t after:from-inherit after:to-transparent'}`}>
                        <p className={`text-[13.5px] leading-[1.7] ${subTextColorClass} font-medium whitespace-pre-wrap tracking-tight`}>
                            {pin.summary || "분석 결과를 생성 중입니다..."}
                        </p>
                    </div>
                </div>

                <div className="pt-4 flex flex-col gap-4 relative">
                    {/* Note Input with Enhanced Action Button */}
                    <div 
                        className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all ${isLight ? 'bg-black/5 border-black/5' : 'bg-white/10 border-white/5'} border relative group/note`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <StickyNote className={`w-3.5 h-3.5 opacity-40 ${iconColor}`} />
                        <input 
                            type="text" 
                            placeholder="노트 작성하기..."
                            className={`bg-transparent border-none outline-none text-[13px] font-medium w-full placeholder:opacity-30 pr-10 ${textColorClass}`}
                            value={localNote}
                            onChange={handleNoteChange}
                            onKeyDown={(e) => { if(e.key === 'Enter') saveNote(); }}
                        />
                        <button 
                          onClick={(e) => { e.stopPropagation(); saveNote(); }}
                          className={`absolute right-3 p-1.5 rounded-full transition-all active:scale-90 hover:scale-105 ${localNote ? 'opacity-100' : 'opacity-0 scale-50 pointer-events-none'} ${isLight ? 'bg-black text-white' : 'bg-white text-black'}`}
                        >
                          <Check className="w-3 h-3" strokeWidth={4} />
                        </button>
                    </div>

                    {/* Saved Toast Notification */}
                    {showSavedToast && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 text-white text-[10px] font-bold flex items-center gap-1.5 animate-in slide-in-from-bottom-2 fade-in duration-300">
                        <Check className="w-3 h-3 text-green-400" strokeWidth={4} />
                        노트가 저장되었습니다
                      </div>
                    )}

                    <div className="flex items-end justify-between">
                        <div className="flex flex-wrap gap-2">
                        {pin.tags.map((tag, idx) => (
                            <span key={idx} className={`inline-flex items-center text-[10px] font-extrabold px-3 py-1.5 rounded-full ${tagClass} uppercase tracking-wider`}>
                            #{tag}
                            </span>
                        ))}
                        </div>
                        <span className="text-[9px] font-bold opacity-30 shrink-0 ml-2 uppercase tracking-tighter">{dateStr}</span>
                    </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};
