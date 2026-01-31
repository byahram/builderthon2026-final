import React from 'react';
import { ChevronLeft, TrendingUp, Star } from 'lucide-react';
import type { UserData, Mission } from '../types';
import { categories } from '../constants/data';

interface RoadmapPreviewProps {
  setStep: (step: string) => void;
  userData: UserData;
  roadmap: Mission[];
}

export const RoadmapPreview: React.FC<RoadmapPreviewProps> = ({ setStep, userData, roadmap }) => {
  // Get category data for styling
  const categoryItem = categories.find(c => c.id === userData.category);
  const gradient = categoryItem?.gradient || 'from-purple-500 to-pink-500';

  const milestones = [
    { day: Math.floor(userData.duration * 0.2), title: '시작 및 기초', percentage: 20 },
    { day: Math.floor(userData.duration * 0.5), title: '중간 점검', percentage: 50 },
    { day: Math.floor(userData.duration * 0.8), title: '마무리 단계', percentage: 80 },
    { day: userData.duration, title: '최종 완성', percentage: 100 }
  ].filter((m, i, arr) => {
    // Filter duplicates if duration is short
    if (i > 0 && m.day === arr[i-1].day) return false;
    return m.day > 0;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-purple-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => setStep('persona')}
          className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          뒤로
        </button>
        
        <div className="mb-8">
          <h2 className="text-4xl font-black mb-3" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
            로드맵 미리보기
          </h2>
          <p className="text-purple-300">{userData.duration}일간의 여정</p>
        </div>

        {/* 난이도 조정 설명 */}
        <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-lg border border-blue-500/30 rounded-3xl p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold mb-2">🎯 스마트 난이도 조정</h3>
              <p className="text-sm text-blue-200 leading-relaxed">
                매일 미션 완료 후 난이도를 선택하면, 3일마다 자동으로 로드맵이 조정됩니다.
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-400">😊 쉬움</span>
              <span className="text-purple-300">→ 2번 이상 선택 시 난이도 상승</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">👍 적당함</span>
              <span className="text-purple-300">→ 현재 난이도 유지</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400">😰 어려움</span>
              <span className="text-purple-300">→ 2번 이상 선택 시 난이도 하락</span>
            </div>
          </div>
        </div>

        {/* 마일스톤 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            주요 마일스톤
          </h3>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className="relative pl-8">
                {/* Timeline line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-3 top-10 w-0.5 h-full bg-linear-to-b from-purple-500 to-pink-500"></div>
                )}
                
                <div className={`absolute left-0 top-2 w-6 h-6 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-purple-300">Day {milestone.day}</span>
                    <span className="text-xs bg-purple-500/20 px-3 py-1 rounded-full">{milestone.percentage}%</span>
                  </div>
                  <p className="font-medium">{milestone.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 전체 미션 목록 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">전체 미션</h3>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {roadmap.map((mission) => (
                <div 
                  key={mission.day}
                  className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                    <span className="text-xs font-bold">{mission.day}</span>
                  </div>
                  <span className="text-sm">{mission.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <button 
            onClick={() => setStep('roadmap')}
            className="w-full py-4 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-102 active:scale-98 animate-pulse">
            이 로드맵으로 시작하기
          </button>
      </div>
    </div>
  );
};
