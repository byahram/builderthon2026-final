import React from 'react';
import { ChevronLeft } from 'lucide-react';
import type { UserData } from '../types';

interface GoalViewProps {
  setStep: (step: string) => void;
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export const GoalView: React.FC<GoalViewProps> = ({ setStep, userData, setUserData }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-purple-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => setStep('category')}
          className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          뒤로
        </button>
        
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-lg font-bold">1</span>
            </div>
            <h2 className="text-4xl font-black" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
              목표 설정
            </h2>
          </div>
          <p className="text-purple-300">무엇을 완성하고 싶나요?</p>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3 text-purple-200">구체적인 목표를 입력해주세요</label>
          <input 
            type="text"
            value={userData.goal}
            onChange={(e) => setUserData({...userData, goal: e.target.value})}
            placeholder="예: 1분 분량의 여행 릴스, 5000자 에세이"
            className="w-full px-6 py-4 bg-white/10 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
            style={{fontFamily: 'SF Pro Text, -apple-system, sans-serif'}}
          />
        </div>
        
        {userData.goal && (
          <button 
            onClick={() => setStep('experience')}
            className="w-full py-4 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-102 active:scale-98">
            다음
          </button>
        )}
      </div>
    </div>
  );
};
