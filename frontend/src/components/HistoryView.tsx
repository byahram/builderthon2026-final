import React from 'react';
import { ChevronLeft, Calendar, Flame, Trophy, Target } from 'lucide-react';
import type { ProjectHistory } from '../types';
import { categories } from '../constants/data';

interface HistoryViewProps {
  setStep: (step: string) => void;
  projectHistory: ProjectHistory[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ setStep, projectHistory }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-purple-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => setStep('welcome')}
          className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          뒤로
        </button>
        
        <div className="mb-8">
          <h2 className="text-4xl font-black mb-3" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
            완료한 프로젝트
          </h2>
          <p className="text-purple-300">지금까지 완성한 One Thing들</p>
        </div>
        
        <div className="space-y-4">
          {projectHistory.map((project) => {
            const category = categories.find(c => c.id === project.category);
            const Icon = category?.icon || Target;
            
            return (
              <div 
                key={project.id}
                className="bg-linear-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${category?.gradient || 'from-purple-500 to-pink-500'} flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{project.goal}</h3>
                    <div className="flex items-center gap-4 text-sm text-purple-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {project.duration}일 목표
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-400" />
                        {project.streak}일 연속
                      </span>
                    </div>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
                
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="text-xs text-purple-400 mb-1">완료일</div>
                  <div className="font-medium">{project.endDate}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
