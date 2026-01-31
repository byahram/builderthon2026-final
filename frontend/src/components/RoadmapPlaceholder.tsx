import React from 'react';
import { Map, Zap, CheckCircle2 } from 'lucide-react';

export const RoadmapPlaceholder: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white/80">
      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 animate-pulse">
        <Map className="w-10 h-10 text-purple-300" />
      </div>
      
      <h1 className="text-3xl font-bold mb-4 text-white">
        나만의 로드맵을 설계해보세요
      </h1>
      
      <p className="text-lg text-purple-200 mb-12 max-w-md">
        오른쪽 패널에서 목표를 설정하면<br/>
        AI가 당신을 위한 최적의 여정을 그려줍니다.
      </p>
      
      <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="p-2 rounded-lg bg-pink-500/20">
            <Zap className="w-5 h-5 text-pink-400" />
          </div>
          <div className="text-left">
            <div className="font-bold text-white">맞춤형 커리큘럼</div>
            <div className="text-xs text-purple-300">내 수준과 목표에 딱 맞는 계획</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="p-2 rounded-lg bg-indigo-500/20">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-left">
            <div className="font-bold text-white">일일 미션 & 피드백</div>
            <div className="text-xs text-purple-300">매일 제공되는 구체적인 실행 가이드</div>
          </div>
        </div>
      </div>
    </div>
  );
};
