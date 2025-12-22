
import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, ArrowRight, Sparkles, Check } from 'lucide-react';
import { Logo } from './Logo';

interface CategoryListProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onCreateProject: (name: string, color: string) => void;
}

// Updated colors based on the user's provided image
const PROJECT_COLORS = [
  '#7FC7B6', // Teal
  '#EE7548', // Orange
  '#FDD248', // Yellow
  '#93B2DE', // Light Blue
  '#526CFE', // Blue
  '#B5A86E', // Gold/Olive
  '#E81E25', // Red
  '#AFAFAF', // Grey
  '#6D8C62', // Green
  '#B08C61', // Brown
  '#F7EDC8', // Beige
  '#D8A6F1', // Lavender
];

export const CategoryList: React.FC<CategoryListProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0]); 

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      if (projects.some(p => p.name.trim() === newProjectName.trim())) {
          alert("이미 존재하는 카테고리 이름입니다.");
          return;
      }
      onCreateProject(newProjectName, selectedColor);
      setNewProjectName('');
      setSelectedColor(PROJECT_COLORS[0]);
      setIsCreating(false);
    }
  };

  return (
    <div className="px-6 pb-24 pt-4">
        {/* Logo Section */}
        <div className="mb-2">
           <Logo className="h-6 w-auto" />
        </div>

        {/* Header - Aligned with Pins View (items-start and w-12 h-12 button) */}
        <div className="flex items-start justify-between mb-6">
            <div className="flex flex-col items-start">
                <h2 className="text-3xl font-black tracking-tight text-[#1A1918] leading-tight">Category</h2>
                <p className="text-gray-500 font-medium text-sm mt-1 ml-1">{projects.length}개의 수집된 카테고리</p>
            </div>
            <button 
              onClick={() => setIsCreating(true)}
              className="w-12 h-12 rounded-full bg-[#1A1918] text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform mt-0.5"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>

        {/* Create Form */}
        {isCreating && (
          <div className="mb-6 bg-white p-5 rounded-[2rem] shadow-sm border border-[#EAE6DF] animate-in slide-in-from-top-4">
             <form onSubmit={handleCreateSubmit}>
                 <div className="mb-4">
                    <input 
                        type="text"
                        placeholder="새 카테고리 이름"
                        autoFocus
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className="w-full bg-[#F2F0E9] rounded-2xl px-4 py-3 text-lg font-bold placeholder-gray-400 focus:outline-none mb-4"
                    />
                    
                    <div className="grid grid-cols-6 gap-3 py-1">
                        {PROJECT_COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform mx-auto ${selectedColor === color ? 'scale-110 ring-2 ring-offset-2 ring-gray-200' : 'opacity-70 hover:opacity-100'}`}
                                style={{ backgroundColor: color }}
                            >
                                {selectedColor === color && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                            </button>
                        ))}
                    </div>
                 </div>
                 
                 <div className="flex gap-2">
                     <button 
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-50"
                     >
                         취소
                     </button>
                     <button 
                        type="submit"
                        className="flex-1 py-3 rounded-xl bg-[#1A1918] text-white font-bold shadow-md"
                     >
                         만들기
                     </button>
                 </div>
             </form>
          </div>
        )}

        {/* Project List */}
        <div className="space-y-4">
            {projects.map(project => (
                <button
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className={`w-full p-5 rounded-[2rem] flex items-center justify-between transition-all active:scale-95 ${
                        activeProjectId === project.id 
                        ? 'bg-[#1A1918] text-white shadow-xl' 
                        : 'bg-white text-black border border-[#EAE6DF]'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#F2F0E9] relative overflow-hidden">
                             <div className="w-full h-full opacity-50" style={{ backgroundColor: project.color }}></div>
                             <div className="w-4 h-4 rounded-full absolute" style={{ backgroundColor: project.color }}></div>
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-lg">{project.name}</div>
                            <div className={`text-sm ${activeProjectId === project.id ? 'text-gray-400' : 'text-gray-400'}`}>
                                {project.pins.length} pins
                            </div>
                        </div>
                    </div>
                    {activeProjectId === project.id && <ArrowRight className="w-6 h-6" />}
                </button>
            ))}
        </div>
    </div>
  );
};
