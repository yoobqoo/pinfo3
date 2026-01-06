
import React, { useState, useEffect, useRef } from 'react';
import { Pin, Platform } from '../types';
import { PlatformIcon } from './Icons';
import { ExternalLink, ArrowUpRight, Loader2, Sparkles, Link as LinkIcon, Image as ImageIcon, ChevronDown, ChevronUp, StickyNote, Check, AlertCircle, Trash2 } from 'lucide-react';

interface PinCardProps {
  pin: Pin;
  color: string;
  onUpdateNote?: (pinId: string, note: string) => void;
  onDeletePin?: (pinId: string) => void;
}

const isLightColor = (hex: string) => {
  const lightColors = ['#FDD248', '#F7EDC8', '#F2F0E9'];
  const upper = hex.toUpperCase();
  return lightColors.includes(upper) || upper.startsWith('#F');
};

export const PinCard: React.FC<PinCardProps> = ({ pin, color, onUpdateNote, onDeletePin }) => {
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
  
  const tagClass = isLight ? 'bg-black/10 text-black/60 font-bold' : 'bg-black/30 text-white/80 font-bold';
  
  const iconColor = isLight ? 'text-black' : 'text-white';
  const shimmerClass = isLight ? 'bg-black/5' : 'bg-white/10';
  const dividerClass = isLight ? 'bg-black/10' : 'bg-white/10';

  const saveNote = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onUpdateNote?.(pin.id, localNote);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalNote(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
        onUpdateNote?.(pin.id, val);
    }, 1500);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("이 핀을 삭제하시겠습니까?")) {
      onDeletePin?.(pin.id);
    }
  };

  return (
    <div 
      className={`group relative flex flex-col rounded-[2.5rem] overflow-hidden shadow-xl transition-all duration-500 cursor-pointer border-t border-white/20 ${textColorClass} ${isExpanded ? 'min-h-[500px]' : 'min-h-[380px]'}`}
      style={{ 
        backgroundColor: color,
        boxShadow: `0 25px 50px -12px ${color}40`
      }}
    >
      {/* Top Section */}
      <div className="p-7 pb-4 relative z-20 flex flex-col gap-5">
        <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 opacity-90 overflow-hidden">
                <div className={`p-2 rounded-2xl shrink-0 ${isLight ? 'bg-white/50' : 'bg-black/20'}`}>
                   <PlatformIcon platform={pin.platform} className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50 leading-none">{pin.platform}</span>
                  {pin.author && (
                    <span className="text-xs font-black truncate max-w-[140px] mt-0.5">{pin.author}</span>
                  )}
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <button 
                  onClick={handleDelete}
                  className={`p-2.5 rounded-full shrink-0 transition-all hover:scale-110 active:scale-90 ${isLight ? 'bg-black/5 text-black/30 hover:text-red-500 hover:bg-red-50' : 'bg-white/10 text-white/40 hover:text-red-300 hover:bg-white/20'}`}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <a 
                  href={pin.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-full shrink-0 transition-all hover:scale-110 active:scale-90 ${isLight ? 'bg-[#1A1918] text-white shadow-md' : 'bg-white text-black shadow-md'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                    <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
                </a>
            </div>
        </div>

        <div className="space-y-4">
            {pin.thumbnailUrl && !imgError ? (
                <div className="w-full h-44 rounded-[1.8rem] overflow-hidden bg-black/5 shadow-inner relative transition-transform duration-700 group-hover:scale-[1.02]">
                    <img 
                        src={pin.thumbnailUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                </div>
            ) : pin.isAnalyzing ? (
              <div className={`w-full h-44 rounded-[1.8rem] overflow-hidden ${shimmerClass} animate-pulse flex items-center justify-center`}>
                <ImageIcon className={`w-10 h-10 ${iconColor} opacity-10`} />
              </div>
            ) : null}

            <div>
                 <h3 className={`text-2xl font-black leading-tight tracking-tight line-clamp-2`}>
                    {pin.title}
                </h3>
            </div>
        </div>
      </div>
      
      <div className={`mx-7 h-px ${dividerClass}`} />

      {/* Bottom Section (AI Insight & Notes) */}
      <div className={`p-7 pt-5 flex-grow flex flex-col justify-between transition-all duration-500 ${isExpanded ? 'bg-black/10' : 'bg-black/0'}`}>
        {pin.isAnalyzing ? (
            <div className="flex flex-col gap-4 py-2 opacity-60">
                <div className="flex items-center gap-2">
                    <Loader2 className={`w-4 h-4 animate-spin ${subTextColorClass}`} />
                    <span className={`text-xs font-black tracking-widest ${subTextColorClass}`}>ANALYZING...</span>
                </div>
                <div className="space-y-2">
                    <div className={`h-3 w-full rounded-full ${shimmerClass} animate-pulse`}></div>
                    <div className={`h-3 w-4/5 rounded-full ${shimmerClass} animate-pulse`}></div>
                </div>
            </div>
        ) : (
            <>
                <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 opacity-50">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-[10px] font-black tracking-widest">AI INSIGHT</span>
                        </div>
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsExpanded(!isExpanded); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all active:scale-95 ${isLight ? 'bg-black/5 text-black' : 'bg-white/20 text-white'}`}
                        >
                            {isExpanded ? <><ChevronUp className="w-3.5 h-3.5" /> 접기</> : <><ChevronDown className="w-3.5 h-3.5" /> 더보기</>}
                        </button>
                    </div>
                    
                    <div className={`transition-all duration-500 ${isExpanded ? '' : 'max-h-[80px] overflow-hidden relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-10 after:bg-gradient-to-t after:from-inherit after:to-transparent'}`}>
                        {pin.platform === 'threads' && pin.fullContentCollected === false && (
                          <div className={`flex items-start gap-2 mb-3 p-3 rounded-2xl text-[11px] font-bold leading-snug ${isLight ? 'bg-black/5 text-black/50' : 'bg-white/10 text-white/50'}`}>
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>Threads 특성상 요약 정보만 수집되었습니다. 본문은 노트를 활용해 주세요.</span>
                          </div>
                        )}
                        <p className={`text-[15px] leading-relaxed ${subTextColorClass} font-medium tracking-tight whitespace-pre-wrap`}>
                            {pin.summary || "분석을 완료하는 중입니다..."}
                        </p>
                    </div>
                </div>

                <div className="pt-6 flex flex-col gap-5 relative">
                    <div 
                        className={`flex items-center gap-3 px-5 py-4 rounded-[1.5rem] transition-all border ${isLight ? 'bg-white/40 border-black/5 focus-within:bg-white focus-within:border-black/20' : 'bg-black/20 border-white/5 focus-within:bg-black/40 focus-within:border-white/20'} relative group/note`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <StickyNote className={`w-4 h-4 opacity-40 ${iconColor}`} />
                        <input 
                            type="text" 
                            placeholder="나만의 노트를 남겨보세요..."
                            className={`bg-transparent border-none outline-none text-sm font-bold w-full placeholder:opacity-30 pr-10 ${textColorClass}`}
                            value={localNote}
                            onChange={handleNoteChange}
                            onKeyDown={(e) => { if(e.key === 'Enter') saveNote(); }}
                        />
                        <button 
                          onClick={(e) => { e.stopPropagation(); saveNote(); }}
                          className={`absolute right-4 p-2 rounded-full transition-all active:scale-90 hover:scale-105 ${localNote ? 'opacity-100' : 'opacity-0 scale-50 pointer-events-none'} ${isLight ? 'bg-[#1A1918] text-white' : 'bg-white text-black'}`}
                        >
                          <Check className="w-4 h-4" strokeWidth={4} />
                        </button>
                    </div>

                    {showSavedToast && (
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-[#1A1918] text-white text-[11px] font-black flex items-center gap-2 shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-300 z-50">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        노트 저장 완료
                      </div>
                    )}

                    <div className="flex items-end justify-between">
                        <div className="flex flex-wrap gap-2">
                        {(pin.tags.length > 0 ? pin.tags : [pin.platform]).map((tag, idx) => (
                            <span key={idx} className={`inline-flex items-center text-[10px] font-black px-3.5 py-1.5 rounded-full ${tagClass} uppercase tracking-wider`}>
                            #{tag}
                            </span>
                        ))}
                        </div>
                        <span className="text-[10px] font-black opacity-30 shrink-0 ml-2 tracking-tighter uppercase">{dateStr}</span>
                    </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};
