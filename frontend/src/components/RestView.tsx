import React from 'react';
import { Coffee } from 'lucide-react';

interface RestViewProps {
  setStep: (step: string) => void;
}

export const RestView: React.FC<RestViewProps> = ({ setStep }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <Coffee className="w-24 h-24 text-blue-400 mx-auto mb-8" />
        
        <h1 className="text-4xl font-black mb-4">좋은 휴식이에요</h1>
        <p className="text-xl text-purple-200 mb-8">
          3일 후에 다시 만나요!
        </p>
        
        <button 
          onClick={() => setStep('welcome')}
          className="px-10 py-4 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95">
          홈으로
        </button>
      </div>
    </div>
  );
};
