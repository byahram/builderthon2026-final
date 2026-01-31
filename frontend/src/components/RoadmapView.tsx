import React from 'react';
import { Award, Flame, TrendingUp, Target, Upload, Check, Clock } from 'lucide-react';
import type { UserData, Mission } from '../types';

interface RoadmapViewProps {
  setStep: (step: string) => void;
  userData: UserData;
  roadmap: Mission[];
  currentDay: number;
  completedDays: number[];
  streak: number;
  showDifficultyAdjustment: boolean;
  isLoading?: boolean;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ 
  setStep, 
  userData, 
  roadmap, 
  currentDay, 
  completedDays, 
  streak,
  showDifficultyAdjustment,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-purple-900 text-white p-6">
        {/* Loading Skeleton */}
        <div className="max-w-2xl mx-auto space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-4">
                <div className="h-8 bg-white/10 rounded-lg w-3/4"></div>
                <div className="h-4 bg-white/10 rounded-lg w-1/4"></div>
            </div>

            {/* Progress Bar Skeleton */}
            <div className="h-3 bg-white/10 rounded-full w-full"></div>

            {/* Main Card Skeleton */}
            <div className="bg-white/5 rounded-3xl p-8 border border-white/5 space-y-6">
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full shrink-0"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-white/10 rounded w-20"></div>
                        <div className="h-8 bg-white/10 rounded w-full"></div>
                        <div className="h-4 bg-white/10 rounded w-5/6"></div>
                    </div>
                </div>
                <div className="h-14 bg-white/10 rounded-2xl w-full"></div>
            </div>

            {/* List Skeleton */}
            <div className="space-y-3">
                {[1,2,3].map(i => (
                    <div key={i} className="h-16 bg-white/5 rounded-2xl border border-white/5"></div>
                ))}
            </div>
            
            <div className="text-center text-purple-300 mt-8 animate-bounce">
                AI가 맞춤형 로드맵을 설계중입니다... 🚀
            </div>
        </div>
      </div>
    );
  }

  const todayMission = roadmap[currentDay - 1];
  const progress = (completedDays.length / roadmap.length) * 100;
  
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-purple-900 text-white">
      {/* Difficulty Adjustment Notification */}
      {showDifficultyAdjustment && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 animate-slide-down">
          <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl px-6 py-4 shadow-2xl border border-white/20">
            <p className="font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              다음 미션 난이도가 조정되었습니다!
            </p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
                {userData.goal}
              </h1>
              <p className="text-sm text-purple-300">Day {currentDay} / {roadmap.length}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep('history')}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                title="나의 One Things">
                <Award className="w-6 h-6 text-yellow-400" />
              </button>
              <div className="text-center">
                <Flame className="w-8 h-8 text-orange-500 mx-auto mb-1 drop-shadow-lg" />
                <div className="text-2xl font-black">{streak}</div>
                <div className="text-xs text-purple-300">연속</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-linear-to-r from-pink-500 to-purple-600 transition-all duration-500 rounded-full"
              style={{width: `${progress}%`}}
            ></div>
          </div>
          <div className="text-right text-sm text-purple-300 mt-2">
            {Math.round(progress)}% 완료
          </div>
        </div>
      </div>
      
      {/* Today's Mission */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-purple-300 mb-4">오늘의 미션</h2>
            
            {todayMission && (
              <div className="bg-linear-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-purple-300 mb-2">Day {todayMission.day}</div>
                    <h3 className="text-2xl font-black mb-2">{todayMission.title}</h3>
                    <p className="text-purple-200 text-sm mb-4">
                      이 단계를 완료하면 목표에 한 걸음 더 가까워집니다!
                    </p>
                  </div>
                </div>
                
                {!completedDays.includes(currentDay) ? (
                  <button
                    onClick={() => setStep('upload')}
                    className="w-full py-4 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" />
                    결과물 업로드하기
                  </button>
                ) : (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 flex items-center justify-center gap-3">
                    <Check className="w-6 h-6 text-green-400" />
                    <span className="font-bold text-green-400">완료!</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Upcoming Missions */}
          <div>
            <h2 className="text-xl font-bold text-purple-300 mb-4">다가오는 미션</h2>
            <div className="space-y-3">
              {roadmap.slice(currentDay, currentDay + 4).map((mission) => (
                <div 
                  key={mission.day}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold">{mission.day}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{mission.title}</div>
                  </div>
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
