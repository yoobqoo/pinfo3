
import React from 'react';
import { Project, Pin } from '../types';
import { StickyNote, ArrowUpRight, MessageSquareOff, Calendar } from 'lucide-react';
import { PlatformIcon } from './Icons';
import { Logo } from './Logo';

interface NotesViewProps {
  projects: Project[];
}

export const NotesView: React.FC<NotesViewProps> = ({ projects }) => {
  // 모든 프로젝트의 핀 중 노트가 있는 것들만 추출
  const pinsWithNotes = projects
    .flatMap(proj => proj.pins.map(pin => ({ ...pin, projectColor: proj.color, projectName: proj.name })))
    .filter(pin => pin.note && pin.note.trim() !== '')
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="px-6 pb-32 pt-4 min-h-full flex flex-col">
        <div className="mb-2">
           <Logo className="h-6 w-auto" />
        </div>

        <div className="flex flex-col items-start mb-8">
            <h2 className="text-3xl font-black tracking-tight text-[#1A1918] leading-tight">My Notes</h2>
            <p className="text-gray-500 font-medium text-sm mt-1 ml-1">{pinsWithNotes.length}개의 기록된 생각들</p>
        </div>

        {pinsWithNotes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-10">
                <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm">
                    <StickyNote className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1918] mb-2">아직 기록이 없습니다</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[240px]">
                    핀 카드 하단에 노트를 작성해 보세요.<br/>중요한 생각들이 여기에 모입니다.
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {pinsWithNotes.map((pin) => (
                    <div 
                        key={pin.id} 
                        className="bg-white rounded-[2.5rem] p-6 border border-[#EAE6DF] shadow-sm hover:shadow-md transition-all active:scale-[0.99] group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-full bg-gray-50">
                                    <PlatformIcon platform={pin.platform} className="w-3.5 h-3.5 text-gray-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 leading-none">{pin.platform}</span>
                                    <span className="text-[10px] font-bold text-gray-400">{pin.projectName}</span>
                                </div>
                            </div>
                            <a 
                                href={pin.originalUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gray-50 text-gray-300 hover:text-black transition-colors"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="mb-5">
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-full min-h-[40px] rounded-full shrink-0" style={{ backgroundColor: pin.projectColor }}></div>
                                <p className="text-xl font-bold text-[#1A1918] leading-tight tracking-tight">
                                    "{pin.note}"
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden flex-1 mr-4">
                                <h4 className="text-[11px] font-bold text-gray-400 truncate opacity-60 italic">
                                    Ref: {pin.title}
                                </h4>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300 shrink-0">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(pin.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};
