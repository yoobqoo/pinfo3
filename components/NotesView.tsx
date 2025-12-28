
import React from 'react';
import { Project, Pin } from '../types';
import { StickyNote, ArrowUpRight, MessageSquareOff } from 'lucide-react';
import { PlatformIcon } from './Icons';
import { Logo } from './Logo';

interface NotesViewProps {
  projects: Project[];
}

export const NotesView: React.FC<NotesViewProps> = ({ projects }) => {
  // Flatten all pins that have notes
  const pinsWithNotes = projects
    .flatMap(proj => proj.pins.map(pin => ({ ...pin, projectColor: proj.color })))
    .filter(pin => pin.note && pin.note.trim() !== '')
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="px-6 pb-32 pt-4 min-h-full flex flex-col">
        <div className="mb-2">
           <Logo className="h-6 w-auto" />
        </div>

        <div className="flex flex-col items-start mb-8">
            <h2 className="text-3xl font-black tracking-tight text-[#1A1918] leading-tight">My Notes</h2>
            <p className="text-gray-500 font-medium text-sm mt-1 ml-1">{pinsWithNotes.length}개의 작성된 노트</p>
        </div>

        {pinsWithNotes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-10">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                    <MessageSquareOff className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1918] mb-2">아직 작성된 노트가 없습니다</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[240px]">핀에 나만의 생각이나 할 일을 적어보세요.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {pinsWithNotes.map((pin) => (
                    <div 
                        key={pin.id} 
                        className="bg-white rounded-[2rem] p-6 border border-[#EAE6DF] shadow-sm hover:shadow-md transition-shadow relative group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-full bg-gray-50">
                                    <PlatformIcon platform={pin.platform} className="w-3.5 h-3.5 text-gray-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{pin.platform}</span>
                            </div>
                            <a 
                                href={pin.originalUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-black transition-colors"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-start gap-3">
                                <StickyNote className="w-5 h-5 text-[#FDD248] shrink-0 mt-0.5" fill="currentColor" />
                                <p className="text-lg font-bold text-[#1A1918] leading-snug">
                                    {pin.note}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pin.projectColor }}></div>
                                <h4 className="text-xs font-bold text-gray-400 truncate max-w-[200px]">{pin.title}</h4>
                            </div>
                            <span className="text-[10px] font-bold text-gray-300 shrink-0">
                                {new Date(pin.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};
