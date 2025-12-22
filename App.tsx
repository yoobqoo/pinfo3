
import React, { useState, useEffect } from 'react';
import { PinCard } from './components/PinCard';
import { BottomNav } from './components/BottomNav';
import { CategoryList } from './components/CategoryList';
import { SettingsView } from './components/SettingsView';
import { UpgradeModal } from './components/UpgradeModal';
import { AuthModal } from './components/AuthModal'; 
import { Logo } from './components/Logo';
import { scrapeMetadata, generateAIInsight } from './services/geminiService';
import { 
    supabase, 
    fetchUserProjects, 
    createProjectInDb, 
    createPinInDb 
} from './services/supabase';
import { requestPayment } from './services/payment'; 
import { Project, Pin, PlanType, Platform } from './types';
import { Plus, Search, Loader2, ArrowRight, X, Check, ChevronDown, LayoutGrid, Sparkles, Link as LinkIcon } from 'lucide-react';

const STORAGE_KEY = 'pinai_data_v2';
const PLAN_KEY = 'pinai_plan_v1';
type Tab = 'pins' | 'category' | 'settings';

const FREE_PIN_LIMIT = 30;

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userPlan, setUserPlan] = useState<PlanType>('free');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>('pins');
  
  const [urlInput, setUrlInput] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  
  const [showInput, setShowInput] = useState(false);
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
    const inputUrl = urlInput.trim();
    if (!inputUrl) return;

    if (userPlan === 'free' && totalPins >= FREE_PIN_LIMIT) {
        setShowInput(false);
        setShowUpgradeModal(true);
        return;
    }
    
    const targetProjectId = selectedTargetId;
    if (!targetProjectId) return;

    // 중복 체크
    const targetProject = projects.find(p => p.id === targetProjectId);
    if (targetProject) {
        const normalizedInput = inputUrl.toLowerCase().replace(/\/$/, "");
        if (targetProject.pins.some(p => p.originalUrl.toLowerCase().replace(/\/$/, "") === normalizedInput)) {
            alert("이미 해당 카테고리에 저장된 링크입니다.");
            return;
        }
    }

    setShowInput(false);
    setUrlInput('');
    setActiveProjectId(targetProjectId);

    // [1단계] 즉각적인 스크래핑 (제목/이미지 UI 먼저 노출)
    const tempId = Date.now().toString();
    const meta = await scrapeMetadata(inputUrl);

    const initialPin: Pin = {
        id: tempId,
        originalUrl: inputUrl,
        title: meta.title, 
        summary: "",
        platform: meta.platform, 
        tags: [],
        createdAt: Date.now(),
        thumbnailUrl: meta.image,
        isAnalyzing: true 
    };

    setProjects(prev => prev.map(proj => {
        if (proj.id === targetProjectId) return { ...proj, pins: [initialPin, ...proj.pins] };
        return proj;
    }));

    // [2단계] 백그라운드 AI 분석 (비동기 수행)
    try {
      const aiInsight = await generateAIInsight(inputUrl, meta.title, meta.description, meta.platform);
      
      const finalPin: Pin = {
          ...initialPin,
          summary: aiInsight.summary,
          tags: aiInsight.tags,
          isAnalyzing: false
      };

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
    } catch (err) {
      console.error("AI Step Failed", err);
      setProjects(prev => prev.map(proj => {
        if (proj.id === targetProjectId) {
            return {
                ...proj,
                pins: proj.pins.map(pin => pin.id === tempId ? { 
                    ...pin, 
                    summary: "분석을 완료하지 못했지만 링크가 저장되었습니다.", 
                    isAnalyzing: false,
                    tags: ["분석지연"]
                } : pin)
            };
        }
        return proj;
      }));
    }
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
             <div className="bg-[#F2F0E9] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">카테고리 선택</h3>
                    <button onClick={() => setShowProjectSelector(false)} className="p-2 bg-white rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
                    <button onClick={() => { setActiveProjectId(null); setShowProjectSelector(false); }} className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${activeProjectId === null ? 'bg-[#1A1918] text-white' : 'bg-white text-gray-800'}`}>
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeProjectId === null ? 'bg-white/20' : 'bg-gray-100'}`}><LayoutGrid className="w-5 h-5" /></div>
                         <div className="flex-1 font-bold">All Pins</div>
                         {activeProjectId === null && <Check className="w-5 h-5" />}
                    </button>
                    {projects.map(proj => (
                         <button key={proj.id} onClick={() => { setActiveProjectId(proj.id); setShowProjectSelector(false); }} className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${activeProjectId === proj.id ? 'bg-[#1A1918] text-white' : 'bg-white text-gray-800'}`}>
                            <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: proj.color + '20' }}><span className="w-3 h-3 rounded-full" style={{ backgroundColor: proj.color }}></span></span>
                            <div className="flex-1 font-bold">{proj.name}</div>
                            {activeProjectId === proj.id && <Check className="w-5 h-5" />}
                         </button>
                    ))}
                </div>
             </div>
          </div>
      )}

      {showInput && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
              <div className="bg-[#F2F0E9] w-full max-w-md rounded-[2rem] p-6 shadow-2xl flex flex-col max-h-[90vh]">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold">새로운 핀 추가</h3>
                      <button onClick={() => setShowInput(false)} className="p-2 bg-white rounded-full"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleAddPin} className="flex flex-col gap-4 overflow-hidden">
                      <input type="url" autoFocus value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="URL을 붙여넣으세요..." className="w-full p-4 rounded-2xl bg-white border-none text-lg focus:ring-2 focus:ring-black" />
                      <div className="overflow-y-auto no-scrollbar">
                        <label className="text-xs font-bold text-gray-400 px-2 mb-3 block uppercase">저장 위치</label>
                        <div className="flex flex-wrap gap-2 px-1">
                           {projects.map(proj => (
                               <button key={proj.id} type="button" onClick={() => setSelectedTargetId(proj.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${selectedTargetId === proj.id ? 'bg-white border-black ring-2 ring-black/5 shadow-md' : 'bg-white border-[#EAE6DF]'}`}>
                                   <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: proj.color }}></span>
                                   <span className={`font-bold text-sm ${selectedTargetId === proj.id ? 'text-black' : 'text-gray-600'}`}>{proj.name}</span>
                               </button>
                           ))}
                        </div>
                      </div>
                      <button type="submit" className="w-full py-4 bg-[#1A1918] text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform mt-2">분석 및 저장</button>
                  </form>
              </div>
          </div>
      )}

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {currentTab === 'pins' && (
            <div className="px-6 pb-32 pt-4 min-h-full flex flex-col">
                <div className="mb-2"><Logo className="h-6 w-auto" /></div>
                <div className="flex items-start justify-between mb-6">
                    <button onClick={() => setShowProjectSelector(true)} className="flex flex-col items-start">
                        <div className="flex items-center gap-2 text-3xl font-black tracking-tight text-[#1A1918] leading-tight">
                            {activeProject ? (<><span className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: activeProject.color }}></span><span>{activeProject.name}</span></>) : (<span>All Pins</span>)}
                            <ChevronDown className="w-6 h-6 text-gray-400 mt-1" strokeWidth={3} />
                        </div>
                        <p className="text-gray-500 font-medium text-sm mt-1 ml-1">{displayedPins.length}개의 수집된 영감</p>
                    </button>
                    <button onClick={() => { 
                      if (activeProjectId) setSelectedTargetId(activeProjectId);
                      else if (projects.length > 0) setSelectedTargetId(projects[0].id);
                      setShowInput(true);
                    }} className="w-12 h-12 bg-[#1A1918] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform mt-0.5"><Plus className="w-6 h-6" /></button>
                </div>

                {displayedPins.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-10">
                        <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-sm">
                            <Sparkles className="w-10 h-10 text-[#FDD248]" fill="currentColor" />
                        </div>
                        <h3 className="text-2xl font-black text-[#1A1918] mb-4">수집된 영감이 없습니다</h3>
                        <p className="text-gray-500 font-medium leading-relaxed max-w-[280px] mb-8">
                            관심 있는 웹사이트나 링크를 붙여넣으세요.<br/>
                            AI가 내용을 분석하고 카테고리별로<br/>
                            정리해드립니다.
                        </p>
                        <button 
                            onClick={() => { 
                                if (activeProjectId) setSelectedTargetId(activeProjectId);
                                else if (projects.length > 0) setSelectedTargetId(projects[0].id);
                                setShowInput(true);
                            }}
                            className="flex items-center gap-2 px-8 py-3 bg-[#1A1918] text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-transform"
                        >
                            <LinkIcon className="w-4 h-4" />
                            <span>첫 번째 핀 추가하기</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 pb-20">
                        {displayedPins.map((item) => (
                            <PinCard key={item.id} pin={item} color={item.color} />
                        ))}
                    </div>
                )}
            </div>
        )}
        {currentTab === 'category' && <CategoryList projects={projects} activeProjectId={activeProjectId} onSelectProject={(id) => { setActiveProjectId(id); setCurrentTab('pins'); }} onCreateProject={(name, color) => {
             const newProject = { id: Date.now().toString(), name, color, pins: [], createdAt: Date.now() };
             setProjects([...projects, newProject]);
        }} />}
        {currentTab === 'settings' && <SettingsView userPlan={userPlan} onReset={() => { if(confirm('모든 데이터를 삭제할까요?')) { localStorage.clear(); window.location.reload(); } }} onUpgrade={handleUpgradePayment} onLoginClick={() => setShowAuthModal(true)} session={session} />}
      </main>
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;
