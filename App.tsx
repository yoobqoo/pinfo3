
import React, { useState, useEffect } from 'react';
import { PinCard } from './components/PinCard';
import { BottomNav } from './components/BottomNav';
import { CategoryList } from './components/CategoryList';
import { SettingsView } from './components/SettingsView';
import { NotesView } from './components/NotesView';
import { UpgradeModal } from './components/UpgradeModal';
import { AuthModal } from './components/AuthModal'; 
import { Logo } from './components/Logo';
import { scrapeMetadata, generateAIInsight } from './services/geminiService';
import { 
    supabase, 
    fetchUserProjects, 
    createProjectInDb, 
    createPinInDb,
    updateProjectInDb,
    deleteProjectInDb,
    updatePinNoteInDb,
    deletePinFromDb
} from './services/supabase';
import { requestPayment } from './services/payment'; 
import { Project, Pin, PlanType, Platform } from './types';
import { Plus, Search, Loader2, ArrowRight, X, Check, ChevronDown, LayoutGrid, Sparkles, Link as LinkIcon } from 'lucide-react';

const STORAGE_KEY = 'pinai_data_v2';
const PLAN_KEY = 'pinai_plan_v1';
type Tab = 'pins' | 'category' | 'notes' | 'settings';

const FREE_PIN_LIMIT = 30;

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userPlan, setUserPlan] = useState<PlanType>('free');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>('pins');
  
  const [urlInput, setUrlInput] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  
  const [session, setSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const loadedData = localStorage.getItem(STORAGE_KEY);
    const loadedPlan = localStorage.getItem(PLAN_KEY);

    if (loadedData) {
        setProjects(JSON.parse(loadedData));
    } else {
      setProjects([
        { id: '1', name: '마케팅 레퍼런스', color: '#FDD248', createdAt: Date.now(), pins: [] }, 
        { id: '2', name: '디자인 영감', color: '#526CFE', createdAt: Date.now(), pins: [] }, 
      ]);
    }

    if (loadedPlan) setUserPlan(loadedPlan as PlanType);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
          supabase.from('profiles').select('plan_type').eq('id', session.user.id).single()
             .then(({ data }) => { if (data) setUserPlan(data.plan_type as PlanType); });
          fetchUserProjects(session.user.id).then(cloudProjects => {
              if (cloudProjects.length > 0) setProjects(cloudProjects);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
         supabase.from('profiles').select('plan_type').eq('id', session.user.id).single()
             .then(({ data }) => { if (data) setUserPlan(data.plan_type as PlanType); });
         fetchUserProjects(session.user.id).then(cloudProjects => {
              if (cloudProjects.length > 0) setProjects(cloudProjects);
         });
      } else {
          setUserPlan('free');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    localStorage.setItem(PLAN_KEY, userPlan);
  }, [projects, userPlan]);

  const totalPins = projects.reduce((acc, proj) => acc + proj.pins.length, 0);

  const handleAddPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const inputUrl = urlInput.trim();
    if (!inputUrl) return;

    if (userPlan === 'free' && totalPins >= FREE_PIN_LIMIT) {
        setShowInput(false);
        setShowUpgradeModal(true);
        return;
    }
    
    const targetProjectId = selectedTargetId || (projects.length > 0 ? projects[0].id : null);
    if (!targetProjectId) {
        alert("카테고리를 먼저 생성해주세요.");
        return;
    }

    setIsSubmitting(true);

    try {
        const tempId = Date.now().toString();
        const meta = await scrapeMetadata(inputUrl);

        if (!meta) throw new Error("URL 정보를 가져오지 못했습니다.");

        const initialPin: Pin = {
            id: tempId,
            originalUrl: (meta as any).canonicalUrl || inputUrl,
            title: (meta as any).title || "제목 없음", 
            summary: "",
            platform: (meta as any).platform, 
            tags: [],
            createdAt: (meta as any).createdAt || Date.now(),
            thumbnailUrl: (meta as any).image,
            author: (meta as any).author,
            authorProfileUrl: (meta as any).authorProfileUrl,
            platformId: (meta as any).platformId,
            fullContentCollected: (meta as any).fullContentCollected,
            isAnalyzing: true 
        };

        setProjects(prev => prev.map(proj => {
            if (proj.id === targetProjectId) return { ...proj, pins: [initialPin, ...proj.pins] };
            return proj;
        }));
        setShowInput(false);
        setUrlInput('');
        setActiveProjectId(targetProjectId);
        setIsSubmitting(false);

        generateAIInsight(inputUrl, (meta as any).title, (meta as any).description, (meta as any).platform).then(async (aiInsight) => {
            const finalPin: Pin = { ...initialPin, summary: aiInsight.summary, tags: aiInsight.tags, isAnalyzing: false };
            
            if (session) {
                const dbPin = await createPinInDb(session.user.id, targetProjectId, finalPin);
                if (dbPin) {
                    setProjects(prev => prev.map(proj => {
                        if (proj.id === targetProjectId) {
                            return { ...proj, pins: proj.pins.map(pin => pin.id === tempId ? dbPin : pin) };
                        }
                        return proj;
                    }));
                }
            } else {
                setProjects(prev => prev.map(proj => {
                    if (proj.id === targetProjectId) {
                        return { ...proj, pins: proj.pins.map(pin => pin.id === tempId ? finalPin : pin) };
                    }
                    return proj;
                }));
            }
        });

    } catch (err: any) {
        console.error(err);
        alert(err.message || "오류가 발생했습니다.");
        setIsSubmitting(false);
    }
  };

  const handleUpdateNote = async (pinId: string, note: string) => {
      setProjects(prev => prev.map(proj => ({
          ...proj,
          pins: proj.pins.map(pin => pin.id === pinId ? { ...pin, note } : pin)
      })));
      if (session) await updatePinNoteInDb(pinId, note);
  };

  const handleDeletePin = async (pinId: string) => {
      setProjects(prev => prev.map(proj => ({
          ...proj,
          pins: proj.pins.filter(pin => pin.id !== pinId)
      })));
      if (session) await deletePinFromDb(pinId);
  };

  const handleUpgradePayment = async () => {
      if (!session) { setShowUpgradeModal(false); setShowAuthModal(true); return; }
      const success = await requestPayment(session.user.email, session.user.id);
      if (success) {
          const { data } = await supabase.from('profiles').select('plan_type').eq('id', session.user.id).single();
          if (data) setUserPlan(data.plan_type as PlanType);
          setShowUpgradeModal(false);
      }
  };

  const activeProject = projects.find(p => p.id === activeProjectId);
  const displayedPins = activeProjectId 
    ? (activeProject?.pins.map(pin => ({ ...pin, color: activeProject.color })) || []) 
    : projects.flatMap(p => p.pins.map(pin => ({ ...pin, color: p.color }))).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="h-full w-full flex flex-col bg-[#F2F0E9] text-gray-900 font-[Noto Sans KR]">
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} onUpgrade={handleUpgradePayment} />}
      
      {showProjectSelector && (
          <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
             <div className="bg-[#F2F0E9] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black">카테고리 선택</h3>
                    <button onClick={() => setShowProjectSelector(false)} className="p-2 bg-white rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar">
                    <button onClick={() => { setActiveProjectId(null); setShowProjectSelector(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-[1.8rem] transition-all ${activeProjectId === null ? 'bg-[#1A1918] text-white' : 'bg-white text-gray-800'}`}>
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeProjectId === null ? 'bg-white/10' : 'bg-gray-100'}`}><LayoutGrid className="w-5 h-5" /></div>
                         <div className="flex-1 font-bold text-base">전체 핀 보기</div>
                         {activeProjectId === null && <Check className="w-5 h-5" strokeWidth={3} />}
                    </button>
                    {projects.map(proj => (
                         <button key={proj.id} onClick={() => { setActiveProjectId(proj.id); setShowProjectSelector(false); }} className={`flex items-center gap-4 px-5 py-4 rounded-[1.8rem] transition-all ${activeProjectId === proj.id ? 'bg-[#1A1918] text-white' : 'bg-white text-gray-800'}`}>
                            <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: proj.color + '20' }}><span className="w-3 h-3 rounded-full" style={{ backgroundColor: proj.color }}></span></span>
                            <div className="flex-1 font-bold text-base">{proj.name}</div>
                            {activeProjectId === proj.id && <Check className="w-5 h-5" strokeWidth={3} />}
                         </button>
                    ))}
                </div>
             </div>
          </div>
      )}

      {showInput && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
              <div className="bg-[#F2F0E9] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl flex flex-col max-h-[90vh]">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black">새로운 영감</h3>
                      <button onClick={() => setShowInput(false)} className="p-2 bg-white rounded-full" disabled={isSubmitting}><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleAddPin} className="flex flex-col gap-6 overflow-hidden">
                      <input 
                        type="url" 
                        autoFocus 
                        value={urlInput} 
                        onChange={(e) => setUrlInput(e.target.value)} 
                        placeholder="링크를 여기에 붙여넣으세요..." 
                        disabled={isSubmitting}
                        className="w-full p-5 rounded-3xl bg-white border-none text-lg font-bold shadow-inner focus:ring-4 focus:ring-black/5 disabled:opacity-50" 
                      />
                      <div className="overflow-y-auto no-scrollbar">
                        <label className="text-[10px] font-black text-gray-400 px-2 mb-3 block uppercase tracking-widest">분류 카테고리</label>
                        <div className="flex flex-wrap gap-2 px-1">
                           {projects.map(proj => (
                               <button 
                                key={proj.id} 
                                type="button" 
                                disabled={isSubmitting}
                                onClick={() => setSelectedTargetId(proj.id)} 
                                className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border transition-all ${selectedTargetId === proj.id ? 'bg-[#1A1918] text-white border-black shadow-lg scale-105' : 'bg-white border-[#EAE6DF] text-gray-600'} disabled:opacity-50`}
                               >
                                   <span className="w-3 h-3 rounded-full" style={{ backgroundColor: proj.color }}></span>
                                   <span className={`font-black text-sm`}>{proj.name}</span>
                               </button>
                           ))}
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-5 bg-[#1A1918] text-white rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-transform mt-2 disabled:bg-gray-400 flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? <><Loader2 className="w-6 h-6 animate-spin" /> 정보 수집 중...</> : '영감 저장하기'}
                      </button>
                  </form>
              </div>
          </div>
      )}

      <main className="flex-1 overflow-y-auto no-scrollbar relative z-10">
        {currentTab === 'pins' && (
            <div className="px-6 pb-40 pt-4 min-h-full flex flex-col">
                <div className="mb-2"><Logo className="h-6 w-auto" /></div>
                <div className="flex items-start justify-between mb-8">
                    <button onClick={() => setShowProjectSelector(true)} className="flex flex-col items-start group">
                        <div className="flex items-center gap-2 text-3xl font-black tracking-tight text-[#1A1918] leading-tight">
                            {activeProject ? (<><span className="w-4 h-4 rounded-full mt-1 shrink-0" style={{ backgroundColor: activeProject.color }}></span><span className="truncate max-w-[200px]">{activeProject.name}</span></>) : (<span>All Pins</span>)}
                            <ChevronDown className="w-6 h-6 text-gray-300 mt-1 transition-transform group-active:translate-y-1" strokeWidth={4} />
                        </div>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-2 ml-1">{displayedPins.length} SAVED INSPIRATIONS</p>
                    </button>
                    <button onClick={() => { 
                      if (activeProjectId) setSelectedTargetId(activeProjectId);
                      else if (projects.length > 0) setSelectedTargetId(projects[0].id);
                      setShowInput(true);
                    }} className="w-12 h-12 bg-[#1A1918] text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform mt-1"><Plus className="w-6 h-6" strokeWidth={3} /></button>
                </div>

                {displayedPins.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 -mt-10">
                        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-10 shadow-sm">
                            <Sparkles className="w-10 h-10 text-[#FDD248]" fill="currentColor" />
                        </div>
                        <h3 className="text-2xl font-black text-[#1A1918] mb-4">아직 수집된 핀이 없어요</h3>
                        <p className="text-gray-400 font-bold text-sm leading-relaxed max-w-[280px] mb-10">
                            영감을 주는 링크를 복사해서 붙여넣으세요. AI가 깔끔하게 정리해 드립니다.
                        </p>
                        <button onClick={() => setShowInput(true)} className="flex items-center gap-3 px-8 py-4 bg-[#1A1918] text-white rounded-[1.5rem] font-bold shadow-2xl active:scale-95 transition-transform"><LinkIcon className="w-4 h-4" /><span>첫 번째 핀 추가</span></button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {displayedPins.map((item) => (
                            <PinCard key={item.id} pin={item} color={item.color} onUpdateNote={handleUpdateNote} onDeletePin={handleDeletePin} />
                        ))}
                    </div>
                )}
            </div>
        )}
        {currentTab === 'category' && (
            <CategoryList 
                projects={projects} 
                activeProjectId={activeProjectId} 
                onSelectProject={(id) => { setActiveProjectId(id); setCurrentTab('pins'); }} 
                onCreateProject={async (name, color) => {
                    if (session) {
                        const newProj = await createProjectInDb(session.user.id, name, color);
                        if (newProj) setProjects([...projects, newProj]);
                    } else {
                        const newProject = { id: Date.now().toString(), name, color, pins: [], createdAt: Date.now() };
                        setProjects([...projects, newProject]);
                    }
                }}
                onUpdateProject={async (id, name, color) => {
                    setProjects(prev => prev.map(p => p.id === id ? { ...p, name, color } : p));
                    if (session) await updateProjectInDb(id, name, color);
                }}
                onDeleteProject={async (id) => {
                    setProjects(prev => prev.filter(p => p.id !== id));
                    if (activeProjectId === id) setActiveProjectId(null);
                    if (session) await deleteProjectInDb(id);
                }}
            />
        )}
        {currentTab === 'notes' && <NotesView projects={projects} />}
        {currentTab === 'settings' && <SettingsView userPlan={userPlan} onReset={() => { if(confirm('모든 데이터를 삭제할까요?')) { localStorage.clear(); window.location.reload(); } }} onUpgrade={handleUpgradePayment} onLoginClick={() => setShowAuthModal(true)} session={session} />}
      </main>
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;
