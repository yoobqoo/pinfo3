
import React from 'react';
import { PlanType } from '../types';
/* Added Sparkles to imports */
import { Crown, Zap, ChevronRight, LogIn, LogOut, ShieldCheck, Info, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { supabase } from '../services/supabase';

interface SettingsViewProps {
    userPlan: PlanType;
    onReset: () => void;
    onUpgrade: () => void;
    onLoginClick: () => void;
    session: any;
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
            <div className="mb-2">
               <Logo className="h-6 w-auto" />
            </div>

            <h2 className="text-3xl font-black tracking-tight text-[#1A1918] mb-8">Settings</h2>
            
            {/* Auth Banner */}
            {!session ? (
                <div 
                    onClick={onLoginClick}
                    className="bg-[#1A1918] rounded-[2rem] p-6 text-white mb-6 cursor-pointer active:scale-95 transition-all relative overflow-hidden group"
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
                     <div className="overflow-hidden">
                        <h3 className="font-bold text-lg truncate max-w-[200px]">{session.user.email}</h3>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Signed In</p>
                    </div>
                    <button onClick={handleLogout} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors active:scale-90">
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
                        <div className="text-[10px] font-black opacity-40 mb-1 uppercase tracking-widest">Current Plan</div>
                        <h3 className="text-2xl font-black flex items-center gap-2">
                            {isPro ? 'Pro Member' : 'Free Starter'}
                            {isPro && <Crown className="w-5 h-5 text-[#FFD60A]" fill="currentColor" />}
                        </h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${isPro ? 'bg-[#FFD60A] text-black' : 'bg-gray-100 text-gray-400'}`}>
                        {isPro ? 'ACTIVE' : 'LIMITED'}
                    </div>
                </div>

                {!isPro ? (
                    <button 
                        onClick={onUpgrade}
                        className="w-full py-4 rounded-2xl bg-[#1A1918] text-white font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                        <span>Upgrade to Pro</span>
                        <Zap className="w-4 h-4 fill-current" />
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                         <ShieldCheck className="w-4 h-4" />
                         <span>무제한 분석 및 저장이 활성화되었습니다.</span>
                    </div>
                )}
            </div>

            {/* Information List */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#EAE6DF] space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base">AI 모델</h3>
                            <p className="text-xs text-gray-400 font-medium">Gemini 3 Pro Preview</p>
                        </div>
                    </div>
                    <div className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-[9px] font-black tracking-widest uppercase">
                        Active
                    </div>
                </div>
                
                <div className="h-px bg-gray-50" />
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Info className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base">앱 정보</h3>
                            <p className="text-xs text-gray-400 font-medium">v1.2.0 (Latest)</p>
                        </div>
                    </div>
                </div>

                 <div className="h-px bg-gray-50" />

                 <div className="pt-2">
                    <button 
                        onClick={onReset}
                        className="w-full py-4 rounded-2xl bg-red-50 font-bold text-red-500 hover:bg-red-100 transition-colors active:scale-95"
                    >
                        로컬 데이터 초기화
                    </button>
                 </div>
            </div>
        </div>
    );
};
