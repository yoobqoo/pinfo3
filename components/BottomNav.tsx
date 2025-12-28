
import React from 'react';
import { LayoutGrid, FolderOpen, Settings, StickyNote } from 'lucide-react';

type Tab = 'pins' | 'category' | 'notes' | 'settings';

interface BottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className="bg-[#1A1918] text-[#E0DCD6] px-6 py-3 rounded-[2rem] shadow-2xl flex items-end gap-6 pointer-events-auto scale-90 md:scale-100 transition-transform">
        <button 
          onClick={() => onTabChange('pins')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 w-12 ${currentTab === 'pins' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <div className={`p-1 rounded-full ${currentTab === 'pins' ? '' : 'bg-transparent'}`}>
             <LayoutGrid className="w-6 h-6" strokeWidth={currentTab === 'pins' ? 3 : 2} />
          </div>
          <span className="text-[10px] font-bold tracking-wide uppercase">Pins</span>
        </button>

        <button 
          onClick={() => onTabChange('category')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 w-12 ${currentTab === 'category' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <div className={`p-1 rounded-full ${currentTab === 'category' ? '' : 'bg-transparent'}`}>
            <FolderOpen className="w-6 h-6" strokeWidth={currentTab === 'category' ? 3 : 2} />
          </div>
          <span className="text-[10px] font-bold tracking-wide uppercase">Group</span>
        </button>

        <button 
          onClick={() => onTabChange('notes')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 w-12 ${currentTab === 'notes' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <div className={`p-1 rounded-full ${currentTab === 'notes' ? '' : 'bg-transparent'}`}>
            <StickyNote className="w-6 h-6" strokeWidth={currentTab === 'notes' ? 3 : 2} />
          </div>
          <span className="text-[10px] font-bold tracking-wide uppercase">Notes</span>
        </button>

        <button 
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 w-12 ${currentTab === 'settings' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
           <div className={`p-1 rounded-full ${currentTab === 'settings' ? '' : 'bg-transparent'}`}>
            <Settings className="w-6 h-6" strokeWidth={currentTab === 'settings' ? 3 : 2} />
          </div>
          <span className="text-[10px] font-bold tracking-wide uppercase">Setting</span>
        </button>
      </div>
    </div>
  );
};
