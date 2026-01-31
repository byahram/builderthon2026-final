import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import type { UserData } from '../types';
import { durations } from '../constants/data';

interface DurationViewProps {
  setStep: (step: string) => void;
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export const DurationView: React.FC<DurationViewProps> = ({ setStep, userData, setUserData }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-purple-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => setStep('motivation')}
          className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          뒤로
        </button>
        
        <div className="mb-12">
          <h2 className="text-4xl font-black mb-3" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
            완수 기간
          </h2>
          <p className="text-purple-300">얼마나 집중할까요?</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {durations.map((dur) => {
            const isSelected = userData.duration === dur.days;
            
            return (
              <button
                key={dur.days}
                onClick={() => setUserData({...userData, duration: dur.days})}
                className={`p-6 rounded-2xl transition-all duration-300 ${
                  isSelected 
                    ? 'bg-linear-to-br from-pink-500/20 to-purple-600/20 ring-2 ring-pink-500 scale-105' 
                    : 'bg-white/5 hover:bg-white/10 hover:scale-102'
                }`}>
                <div className="text-center">
                  <div className="text-5xl font-black mb-2 bg-linear-to-br from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {dur.days}
                  </div>
                  <div className="text-lg font-bold mb-1">{dur.label}</div>
                  <div className="text-xs text-purple-300">{dur.subtitle}</div>
                </div>
                
                {isSelected && (
                  <div className="mt-4">
                    <Check className="w-6 h-6 text-green-400 mx-auto" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        <button 
          onClick={() => setStep('persona')}
          className="w-full py-4 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-102 active:scale-98">
          다음
        </button>
      </div>
    </div>
  );
};
