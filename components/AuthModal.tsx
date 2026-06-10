import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { X, Mail, Loader2, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

interface AuthModalProps {
  onClose: () => void;
}

const isNativeApp = () => !!(window as any).Capacitor?.isNativePlatform?.();
const getRedirectUrl = () => isNativeApp() ? 'com.pinfo.app://login-callback' : window.location.origin;

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getRedirectUrl() },
    });
    if (error) {
      alert(error.message);
      setGoogleLoading(false);
    }
    // 성공 시 페이지가 리디렉션되므로 loading 해제 불필요
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Supabase 매직 링크 로그인 (비밀번호 없이 이메일로 로그인)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getRedirectUrl(),
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-[#F2F0E9] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative">
        
        <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 bg-black/5 rounded-full hover:bg-black/10 transition-colors"
        >
            <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex flex-col items-center text-center mb-8 mt-2">
            <Logo className="h-8 mb-6" />
            <h2 className="text-2xl font-black text-[#1A1918] mb-2">
                {sent ? '메일함을 확인하세요!' : '로그인 / 회원가입'}
            </h2>
            <p className="text-gray-500 font-medium text-sm">
                {sent 
                  ? `${email}로 로그인 링크를 보냈습니다.\n링크를 클릭하면 앱으로 돌아옵니다.` 
                  : '이메일 주소만 있으면\n3초 만에 시작할 수 있습니다.'}
            </p>
        </div>

        {!sent ? (
            <div className="space-y-4">
                {/* Google OAuth */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full py-4 bg-white border border-[#EAE6DF] rounded-2xl font-bold text-[#1A1918] text-base shadow-sm active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                >
                    {googleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                    )}
                    Google로 계속하기
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#EAE6DF]" />
                    <span className="text-xs text-gray-400 font-medium">또는 이메일로</span>
                    <div className="flex-1 h-px bg-[#EAE6DF]" />
                </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일 주소" 
                        className="w-full bg-white border border-[#EAE6DF] rounded-2xl py-4 pl-12 pr-4 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#1A1918] text-white rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>로그인 링크 받기</span>}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
                <p className="text-center text-[10px] text-gray-400 font-medium mt-4">
                    계정이 없으면 자동으로 회원가입 됩니다.
                </p>
            </form>
            </div>
        ) : (
            <button 
                onClick={onClose}
                className="w-full py-4 bg-white border border-[#EAE6DF] text-[#1A1918] rounded-2xl font-bold text-lg shadow-sm active:scale-95 transition-all"
            >
                닫기
            </button>
        )}
      </div>
    </div>
  );
};