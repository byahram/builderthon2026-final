import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import type { UserData } from '../types';
import { motivations } from '../constants/data';

interface MotivationViewProps {
  setStep: (step: string) => void;
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export const MotivationView: React.FC<MotivationViewProps> = ({ setStep, userData, setUserData }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-purple-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => setStep('experience')}
          className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          뒤로
        </button>
        
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-lg font-bold">3</span>
            </div>
            <h2 className="text-4xl font-black" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
              동기 부여
            </h2>
          </div>
          <p className="text-purple-300">왜 이것을 완성하고 싶나요?</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-8">
          {motivations.map((mot) => {
            const isSelected = userData.motivation === mot.id;
            
            return (
              <button
                key={mot.id}
                onClick={() => setUserData({...userData, motivation: mot.id})}
                className={`p-6 rounded-2xl transition-all duration-300 flex items-center justify-between ${
                  isSelected 
                    ? 'bg-white/10 ring-2 ring-white scale-102' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{mot.emoji}</span>
                  <span className="text-xl font-bold">{mot.label}</span>
                </div>
                
                {isSelected && <Check className="w-6 h-6 text-green-400" />}
              </button>
            );
          })}
        </div>
        
        {userData.motivation && (
          <button 
            onClick={() => setStep('duration')}
            className="w-full py-4 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-102 active:scale-98">
            다음
          </button>
        )}
      </div>
    </div>
  );
};
