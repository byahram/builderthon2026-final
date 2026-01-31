import React from 'react';
import { ChevronRight, Award, Target, Flame, TrendingUp } from 'lucide-react';

interface WelcomeViewProps {
  setStep: (step: string) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ setStep }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8 inline-block">
            <div className="relative">
              <div className="text-9xl font-black bg-linear-to-br from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                1
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-black mb-4 bg-linear-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent" 
              style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif', letterSpacing: '-0.02em'}}>
            One Thing
          </h1>
          
          <p className="text-xl text-purple-200 mb-2" style={{fontFamily: 'SF Pro Text, -apple-system, sans-serif'}}>
            단 하나에 집중해서 완성물을
          </p>
          
          <p className="text-sm text-purple-300/80 mb-12">
            작심삼일을 넘어, 진짜 완성까지
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={() => setStep('category')}
              className="group relative w-full px-10 py-5 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
              style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
              <span className="relative z-10 flex items-center justify-center gap-3">
                새 프로젝트 시작하기
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            </button>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-8 text-purple-300/60 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>하나만</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              <span>매일</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>완성까지</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
