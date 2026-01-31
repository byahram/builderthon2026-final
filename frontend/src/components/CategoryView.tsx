import React from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import type { UserData } from '../types';
import { categories } from '../constants/data';

interface CategoryViewProps {
  setStep: (step: string) => void;
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ setStep, userData, setUserData }) => {
  return (
    <div className="w-full h-full text-white p-8">
      <div className="w-full">
        <button 
          onClick={() => setStep('welcome')}
          className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          뒤로
        </button>
        
        <div className="mb-12">
          <h2 className="text-4xl font-black mb-3" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
            무엇을 만들고 싶나요?
          </h2>
          <p className="text-purple-300">창작 분야를 선택해주세요</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = userData.category === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setUserData({...userData, category: cat.id});
                  setStep('experience'); // Auto-advance
                }}
                className={`relative group p-6 rounded-3xl transition-all duration-300 ${
                  isSelected 
                    ? 'bg-white/10 ring-2 ring-white scale-105' 
                    : 'bg-white/5 hover:bg-white/10 hover:scale-102'
                }`}>
                <div className={`absolute inset-0 bg-linear-to-br ${cat.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity`}></div>
                
                <div className="relative z-10">
                  <Icon className={`w-12 h-12 mb-4 ${isSelected ? 'text-white' : 'text-purple-300'}`} />
                  <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-sm text-purple-300">{cat.subtitle}</p>
                </div>
                
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <Check className="w-6 h-6 text-green-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        

      </div>
    </div>
  );
};
