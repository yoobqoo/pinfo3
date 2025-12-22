import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { X, Mail, Loader2, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Supabase 매직 링크 로그인 (비밀번호 없이 이메일로 로그인)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // 실제 배포시에는 배포된 주소로 변경 필요
        emailRedirectTo: window.location.origin, 
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