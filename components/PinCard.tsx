import React, { useState } from 'react';
import { Pin, Platform } from '../types';
import { PlatformIcon } from './Icons';
import { ExternalLink, ArrowUpRight, Loader2, Sparkles, Link as LinkIcon, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface PinCardProps {
  pin: Pin;
  color: string;
}

const isLightColor = (hex: string) => {
  const lightColors = ['#FDD248', '#F7EDC8'];
  return lightColors.includes(hex.toUpperCase()) || lightColors.includes(hex);
};

export const PinCard: React.FC<PinCardProps> = ({ pin, color }) => {
  const [imgError, setImgError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const dateStr = new Date(pin.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  const isLight = isLightColor(color);
  const textColorClass = isLight ? 'text-gray-900' : 'text-white';
  const subTextColorClass = isLight ? 'text-gray-700' : 'text-white/80';
  const tagClass = isLight ? 'bg-black/5 text-black/70' : 'bg-white/10 text-white/90';
  const iconColor = isLight ? 'text-black' : 'text-white';
  const shimmerClass = isLight ? 'bg-black/5' : 'bg-white/10';
  const dividerClass = isLight ? 'bg-black/10' : 'bg-white/10';

  return (
    <div 
      className={`group relative flex flex-col rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer border-t border-white/10 ${textColorClass} ${isExpanded ? 'min-h-[500px]' : 'min-h-[350px]'}`}
      style={{ 
        backgroundColor: color,
        boxShadow: `0 20px 40px -10px ${color}60`
      }}
    >
      {/* SECTION 1: RAW META DATA */}
      <div className="p-6 pb-4 relative z-20 flex flex-col gap-4">
        {/* Header */}
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
              className={`p-2 rounded-full ${tagClass} transition-all hover:scale-110 active:scale-95`}
            >
                <ArrowUpRight className="w-4 h-4" />
            </a>
        </div>

        {/* Content */}
        <div className="space-y-4">
            {pin.isAnalyzing && !pin.thumbnailUrl ? (
                <div className={`w-full h-40 rounded-2xl overflow-hidden ${shimmerClass} flex items-center justify-center`}>
                     <ImageIcon className={`w-8 h-8 ${iconColor} opacity-20`} />
                </div>
            ) : pin.thumbnailUrl && !imgError ? (
                <div className="w-full h-40 rounded-2xl overflow-hidden bg-black/10 shadow-inner relative group-hover:scale-[1.01] transition-transform duration-500">
                    <img 
                        src={pin.thumbnailUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                </div>
            ) : null}

            <div>
                 <h3 className={`text-xl font-bold leading-snug tracking-tight line-clamp-2 ${pin.isAnalyzing ? 'opacity-70' : ''}`}>
                    {pin.title}
                </h3>
            </div>
        </div>
      </div>
      
      <div className={`mx-6 h-px ${dividerClass}`} />

      {/* SECTION 2: AI INSIGHT */}
      <div className={`p-6 pt-4 flex-grow flex flex-col justify-between transition-all duration-500 ${isExpanded ? 'bg-black/10' : 'bg-black/5'}`}>
        {pin.isAnalyzing ? (
            <div className="flex flex-col gap-3 py-2 animate-pulse opacity-70">
                <div className="flex items-center gap-1.5">
                    <Loader2 className={`w-3.5 h-3.5 animate-spin ${subTextColorClass}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${subTextColorClass}`}>AI 분석 중...</span>
                </div>
                <div className="space-y-2">
                    <div className={`h-2.5 w-full rounded-full ${shimmerClass}`}></div>
                    <div className={`h-2.5 w-5/6 rounded-full ${shimmerClass}`}></div>
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
                        {/* Expand Button */}
                        <button 
                            onClick={(e) => { e.preventDefault(); setIsExpanded(!isExpanded); }}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight transition-all active:scale-95 shadow-sm ${isLight ? 'bg-black/10 text-black' : 'bg-white/20 text-white'}`}
                        >
                            {isExpanded ? (
                                <><ChevronUp className="w-3 h-3" /> 접기</>
                            ) : (
                                <><ChevronDown className="w-3 h-3" /> 더보기</>
                            )}
                        </button>
                    </div>
                    
                    <div className={`transition-all duration-500 ${isExpanded ? '' : 'max-h-[85px] overflow-hidden relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-8 after:bg-gradient-to-t after:from-inherit after:to-transparent'}`}>
                        <p className={`text-[13.5px] leading-[1.7] ${subTextColorClass} font-medium whitespace-pre-wrap tracking-tight`}>
                            {pin.summary}
                        </p>
                    </div>
                </div>

                <div className="pt-6 flex items-end justify-between">
                    <div className="flex flex-wrap gap-2">
                    {pin.tags.map((tag, idx) => (
                        <span key={idx} className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full ${tagClass} uppercase tracking-wide`}>
                        #{tag}
                        </span>
                    ))}
                    </div>
                    <span className="text-[10px] font-bold opacity-30 shrink-0 ml-2 uppercase tracking-tighter">{dateStr}</span>
                </div>
            </>
        )}
      </div>
    </div>
  );
};
