import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, LayoutGrid, Sparkles } from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onCreateProject: (name: string, color: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  projects, 
  activeProjectId, 
  onSelectProject, 
  onCreateProject 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  // Minimal sidebar implementation just to prevent errors, as Mobile View is main.
  // Defaulting to black for sidebar creation for simplicity if used.
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onCreateProject(newProjectName, '#1A1918');
      setNewProjectName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-72 bg-[#1A1918] text-[#E0DCD6] h-screen flex flex-col fixed left-0 top-0 border-r border-[#2C2A28] z-20 font-[Noto Sans KR] hidden md:flex">
      <div className="p-8">
        <div className="flex items-center space-x-3 text-white font-bold text-2xl tracking-tight mb-10">
          <div className="w-10 h-10 bg-[#E0DCD6] rounded-xl flex items-center justify-center text-black">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold">PinAI</span>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onSelectProject(null)}
            className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
              activeProjectId === null 
                ? 'bg-[#E0DCD6] text-black shadow-lg shadow-white/5 font-bold scale-[1.02]' 
                : 'hover:bg-[#2C2A28] text-[#9A9690] hover:text-white'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-sm font-medium">전체 보기</span>
          </button>
        </div>
      </div>

      <div className="px-8 pb-3 flex items-center justify-between mt-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#5E5B55]">Projects</h3>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="p-1.5 hover:bg-[#3E3C38] rounded-lg text-[#9A9690] hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">
        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="mb-4 bg-[#2C2A28] p-3 rounded-2xl border border-[#3E3C38]">
             <div className="flex space-x-2 mb-3">
               <input 
                  type="text" 
                  autoFocus
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="프로젝트 이름"
                  className="flex-1 h-10 bg-[#1A1918] border border-[#3E3C38] rounded-xl px-3 text-sm text-white focus:outline-none focus:border-[#E0DCD6] transition-colors"
                />
             </div>
             <div className="flex justify-end gap-2">
               <button 
                 type="submit" 
                 className="text-xs px-3 py-1.5 bg-[#E0DCD6] text-black font-bold rounded-lg hover:bg-white"
               >
                 생성
               </button>
             </div>
          </form>
        )}

        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
              activeProjectId === project.id 
                ? 'bg-[#E0DCD6] text-black shadow-lg shadow-white/5 font-bold scale-[1.02]' 
                : 'hover:bg-[#2C2A28] text-[#9A9690] hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></span>
              <span className="truncate text-sm font-medium">{project.name}</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeProjectId === project.id ? 'bg-black/10 text-black' : 'bg-[#2C2A28] text-[#5E5B55]'}`}>
              {project.pins.length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};