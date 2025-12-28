import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, ArrowRight, Sparkles, Check, Edit2, Trash2, X, MoreHorizontal } from 'lucide-react';
import { Logo } from './Logo';

interface CategoryListProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onCreateProject: (name: string, color: string) => void;
  onUpdateProject: (id: string, name: string, color: string) => void;
  onDeleteProject: (id: string) => void;
}

const PROJECT_COLORS = [
  '#7FC7B6', '#EE7548', '#FDD248', '#93B2DE', '#526CFE', '#B5A86E',
  '#E81E25', '#AFAFAF', '#6D8C62', '#B08C61', '#F7EDC8', '#D8A6F1',
];

export const CategoryList: React.FC<CategoryListProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onUpdateProject,
  onDeleteProject
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0]); 

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      if (projects.some(p => p.name.trim() === newProjectName.trim() && p.id !== editingId)) {
          alert("이미 존재하는 카테고리 이름입니다.");
          return;
      }
      
      if (editingId) {
          onUpdateProject(editingId, newProjectName, selectedColor);
      } else {
          onCreateProject(newProjectName, selectedColor);
      }
      
      setNewProjectName('');
      setEditingId(null);
      setIsCreating(false);
    }
  };

  const startEdit = (project: Project, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingId(project.id);
      setNewProjectName(project.name);
      setSelectedColor(project.color);
      setIsCreating(true);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (confirm(`'${name}' 카테고리와 그 안의 모든 핀을 삭제할까요?`)) {
          onDeleteProject(id);
      }
  };

  return (
    <div className="px-6 pb-24 pt-4">
        <div className="mb-2">
           <Logo className="h-6 w-auto" />
        </div>

        <div className="flex items-start justify-between mb-6">
            <div className="flex flex-col items-start">
                <h2 className="text-3xl font-black tracking-tight text-[#1A1918] leading-tight">Category</h2>
                <p className="text-gray-500 font-medium text-sm mt-1 ml-1">{projects.length}개의 수집된 카테고리</p>
            </div>
            <button 
              onClick={() => { setIsCreating(true); setEditingId(null); setNewProjectName(''); }}
              className="w-12 h-12 rounded-full bg-[#1A1918] text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform mt-0.5"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>

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
                        onClick={() => { setIsCreating(false); setEditingId(null); }}
                        className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-50"
                     >
                         취소
                     </button>
                     <button 
                        type="submit"
                        className="flex-1 py-3 rounded-xl bg-[#1A1918] text-white font-bold shadow-md"
                     >
                         {editingId ? '저장' : '만들기'}
                     </button>
                 </div>
             </form>
          </div>
        )}

        <div className="space-y-4">
            {projects.map(project => (
                <div key={project.id} className="relative group">
                    <button
                        onClick={() => onSelectProject(project.id)}
                        className={`w-full p-5 rounded-[2rem] flex items-center justify-between transition-all active:scale-[0.98] ${
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
                                <div className="text-sm text-gray-400">
                                    {project.pins.length} pins
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={(e) => startEdit(project, e)}
                                className={`p-2 rounded-full transition-colors ${activeProjectId === project.id ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                            >
                                <Edit2 className="w-4 h-4 opacity-40 hover:opacity-100" />
                            </button>
                            <button 
                                onClick={(e) => handleDelete(project.id, project.name, e)}
                                className={`p-2 rounded-full transition-colors ${activeProjectId === project.id ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                            >
                                <Trash2 className="w-4 h-4 opacity-40 hover:opacity-100 text-[#FF453A]" />
                            </button>
                            {activeProjectId === project.id && <ArrowRight className="w-6 h-6 ml-1" />}
                        </div>
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};