import React from 'react';
import { Trophy, Flame, Coffee } from 'lucide-react';
import type { UserData, Mission } from '../types';

interface CompletionViewProps {
  userData: UserData;
  roadmap: Mission[];
  streak: number;
  saveToHistory: (choice: string) => void;
}

export const CompletionView: React.FC<CompletionViewProps> = ({ userData, roadmap, streak, saveToHistory }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10">
          <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-8 animate-bounce" />
          
          <h1 className="text-5xl font-black mb-4 bg-linear-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            축하합니다! 🎉
          </h1>
          
          <p className="text-2xl text-purple-200 mb-8">
            {userData.goal}을 완성했어요!
          </p>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-4xl font-black text-pink-400">{roadmap.length}</div>
                <div className="text-sm text-purple-300">일간 미션</div>
              </div>
              <div>
                <div className="text-4xl font-black text-purple-400">{streak}</div>
                <div className="text-sm text-purple-300">연속 달성</div>
              </div>
              <div>
                <div className="text-4xl font-black text-blue-400">100%</div>
                <div className="text-sm text-purple-300">완료율</div>
              </div>
            </div>
          </div>
          
          <div className="bg-linear-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 mb-6">
            <Flame className="w-10 h-10 text-orange-400 mx-auto mb-3" />
            <p className="text-lg font-bold mb-2">연속 학습일을 잃지 마세요!</p>
            <p className="text-sm text-purple-300">다음 선택을 해주세요</p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => saveToHistory('new')}
              className="w-full px-10 py-5 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 active:scale-95">
              다음 One Thing 시작하기
            </button>
            
            <button 
              onClick={() => saveToHistory('rest')}
              className="w-full px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold transition-all hover:scale-102 flex items-center justify-center gap-2">
              <Coffee className="w-5 h-5" />
              3일간 휴식하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
