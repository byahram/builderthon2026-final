import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import type { UserData } from '../types';
import { experienceLevels } from '../constants/data';

interface ExperienceViewProps {
  setStep: (step: string) => void;
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({ setStep, userData, setUserData }) => {
  return (
    <div className="w-full h-full text-white p-8">
      <div className="w-full">
        <button 
          onClick={() => setStep('goal')}
          className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          뒤로
        </button>
        
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-lg font-bold">2</span>
            </div>
            <h2 className="text-4xl font-black" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
              현재 상태
            </h2>
          </div>
          <p className="text-purple-300">이 작업을 해본 적이 있나요?</p>
        </div>
        
        <div className="space-y-4 mb-8">
          {experienceLevels.map((level) => {
            const isSelected = userData.experience === level.id;
            
            return (
              <button
                key={level.id}
                onClick={() => {
                  setUserData({...userData, experience: level.id});
                  setStep('motivation'); // Auto-advance
                }}
                className={`w-full p-6 rounded-2xl transition-all duration-300 flex items-center justify-between ${
                  isSelected 
                    ? 'bg-white/10 ring-2 ring-white scale-102' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{level.emoji}</span>
                  <span className="text-xl font-bold">{level.label}</span>
                </div>
                
                {isSelected && <Check className="w-6 h-6 text-green-400" />}
              </button>
            );
          })}
        </div>
        

      </div>
    </div>
  );
};
