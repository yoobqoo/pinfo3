import React from 'react';
import { PlanType } from '../types';
import { Crown, Zap, ChevronRight, LogIn, LogOut, ShieldCheck, Key } from 'lucide-react';
import { Logo } from './Logo';
import { supabase } from '../services/supabase';

interface SettingsViewProps {
    userPlan: PlanType;
    onReset: () => void;
    onUpgrade: () => void;
    onLoginClick: () => void; // Parent handles modal
    session: any; // Supabase session
}

export const SettingsView: React.FC<SettingsViewProps> = ({ userPlan, onReset, onUpgrade, onLoginClick, session }) => {
    const isPro = userPlan === 'pro';

    const handleLogout = async () => {
        if(confirm('로그아웃 하시겠습니까?')) {
            await supabase.auth.signOut();
            window.location.reload();
        }
    };

    return (
        <div className="px-6 pb-24 pt-4">
            {/* Logo Section */}
            <div className="mb-2">
               <Logo className="h-6 w-auto" />
            </div>

            <h2 className="text-3xl font-black tracking-tight text-[#1A1918] mb-8">Settings</h2>
            
            {/* Auth Banner */}
            {!session ? (
                <div 
                    onClick={onLoginClick}
                    className="bg-[#1A1918] rounded-[2rem] p-6 text-white mb-6 cursor-pointer active:scale-98 transition-transform relative overflow-hidden group"
                >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
                     <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-xl mb-1">로그인하기</h3>
                            <p className="text-white/60 text-xs font-medium">데이터를 클라우드에 안전하게 보관하세요.</p>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <LogIn className="w-5 h-5" />
                        </div>
                     </div>
                </div>
            ) : (
                <div className="bg-white border border-[#EAE6DF] rounded-[2rem] p-6 mb-6 flex items-center justify-between">
                     <div>
                        <h3 className="font-bold text-lg">{session.user.email}</h3>
                        <p className="text-gray-400 text-xs font-medium">로그인됨</p>
                    </div>
                    <button onClick={handleLogout} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <LogOut className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            )}
            
            {/* Membership Card */}
            <div className={`rounded-[2rem] p-6 shadow-sm border mb-6 relative overflow-hidden ${isPro ? 'bg-[#1A1918] text-white border-[#1A1918]' : 'bg-white border-[#EAE6DF]'}`}>
                {isPro && (
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFD60A] rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
                )}
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                    <div>
                        <div className="text-sm font-bold opacity-60 mb-1">CURRENT PLAN</div>
                        <h3 className="text-2xl font-black flex items-center gap-2">
                            {isPro ? 'Pro Member' : 'Free Starter'}
                            {isPro && <Crown className="w-5 h-5 text-[#FFD60A]" fill="currentColor" />}
                        </h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${isPro ? 'bg-[#FFD60A] text-black' : 'bg-gray-100 text-gray-500'}`}>
                        {isPro ? 'ACTIVE' : 'LIMITED'}
                    </div>
                </div>

                {!isPro ? (
                    <button 
                        onClick={onUpgrade}
                        className="w-full py-4 rounded-xl bg-[#1A1918] text-white font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                    >
                        <span>Upgrade to Pro</span>
                        <Zap className="w-4 h-4 fill-current" />
                    </button>
                ) : (
                    <div className="flex items-center gap-4 text-sm font-medium opacity-80">
                         <span>무제한 분석 및 저장이 활성화되었습니다.</span>
                    </div>
                )}
            </div>

            {/* API Key Guide (Production) */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#EAE6DF] mb-6">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Key className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg">프로덕션 설정</h3>
                 </div>
                 <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    실제 서비스 배포 시 Vercel 설정 페이지에서 아래 환경 변수를 추가하세요. 유료 티어를 사용하려면 Google AI Studio에서 결제 수단을 등록해야 합니다.
                 </p>
                 <div className="bg-gray-50 p-4 rounded-xl font-mono text-xs text-gray-700 select-all border border-gray-100">
                    API_KEY = "발급받은_키_입력"
                 </div>
                 <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-xs font-bold text-blue-600 hover:underline gap-1"
                 >
                    유료 결제 가이드 확인 <ChevronRight className="w-3 h-3" />
                 </a>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#EAE6DF] space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">AI 모델</h3>
                        <p className="text-sm text-gray-400">Gemini 3 Pro Preview</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-black">
                        <ShieldCheck className="w-3 h-3" />
                        <span>PREMIUM</span>
                    </div>
                </div>
                
                <div className="h-px bg-gray-100" />
                
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">앱 정보</h3>
                        <p className="text-sm text-gray-400">v1.1.0 (Production Ready)</p>
                    </div>
                </div>

                 <div className="h-px bg-gray-100" />

                 <div className="pt-2">
                    <button 
                        onClick={onReset}
                        className="w-full py-4 rounded-xl bg-[#F2F0E9] font-bold text-[#FF453A] hover:bg-[#FFE5E5] transition-colors"
                    >
                        로컬 데이터 초기화
                    </button>
                 </div>
            </div>
        </div>
    );
};
