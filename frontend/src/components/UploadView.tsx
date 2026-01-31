import React from 'react';
import { ChevronLeft, Flame, TrendingUp, Check, Upload } from 'lucide-react';
import type { Mission, UploadedFileObj } from '../types';
import { Confetti } from './Confetti';

interface UploadViewProps {
  setStep: (step: string) => void;
  roadmap: Mission[];
  currentDay: number;
  completedDays: number[];
  streak: number;
  uploadedFile: File | UploadedFileObj | null;
  setUploadedFile: (file: File | UploadedFileObj | null) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  completeDay: (day: number, difficulty: string) => void;
  showConfetti: boolean;
  celebrationStep: number;
}

export const UploadView: React.FC<UploadViewProps> = ({
  setStep,
  roadmap,
  currentDay,
  completedDays,
  streak,
  uploadedFile,
  setUploadedFile,
  handleFileUpload,
  completeDay,
  showConfetti,
  celebrationStep
}) => {
  const todayMission = roadmap[currentDay - 1];
  const prevProgress = ((completedDays.length) / roadmap.length) * 100;
  const newProgress = ((completedDays.length + 1) / roadmap.length) * 100;
  
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-purple-900 text-white p-6">
      <Confetti show={showConfetti} />
      
      {/* Celebration Overlay */}
      {celebrationStep > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="text-center">
            {celebrationStep === 1 && (
              <div className="animate-scale-in">
                <Flame className="w-32 h-32 text-orange-500 mx-auto mb-6 animate-bounce drop-shadow-2xl" />
                <div className="text-8xl font-black mb-4 bg-linear-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  {streak}
                </div>
                <p className="text-3xl font-bold text-white">연속 달성! 🔥</p>
              </div>
            )}
            
            {celebrationStep === 2 && (
              <div className="animate-slide-up max-w-md w-full px-6">
                <div className="bg-linear-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/20">
                  <TrendingUp className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <p className="text-2xl font-bold mb-6">목표에 가까워졌어요!</p>
                  
                  {/* Animated Progress Bar */}
                  <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-3">
                    <div 
                      className="absolute top-0 left-0 h-full bg-linear-to-r from-pink-500 to-purple-600 transition-all duration-1000 ease-out rounded-full"
                      style={{width: `${newProgress}%`}}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">{Math.round(prevProgress)}%</span>
                    <span className="text-white font-bold">→ {Math.round(newProgress)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => setStep('roadmap')}
          className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          뒤로
        </button>
        
        <div className="mb-8">
          <h2 className="text-4xl font-black mb-3" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
            오늘의 One Thing to do
          </h2>
          <p className="text-purple-300">Day {currentDay}: {todayMission?.title}</p>
        </div>
        
        {/* Upload Area */}
        <div className="mb-6">
          <label className="block">
            <div className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
              uploadedFile 
                ? 'border-green-500 bg-green-500/10' 
                : 'border-purple-500/50 bg-white/5 hover:bg-white/10 hover:border-purple-500'
            }`}>
              <input 
                type="file" 
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              />
              
              {uploadedFile ? (
                <div>
                  <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <p className="text-xl font-bold text-green-400 mb-2">파일 업로드 완료!</p>
                  <p className="text-sm text-purple-300">{uploadedFile.name}</p>
                </div>
              ) : (
                <div>
                  <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-xl font-bold mb-2">파일 업로드</p>
                  <p className="text-sm text-purple-300">이미지, 영상, PDF, 문서 등</p>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* URL Input */}
        <div className="mb-8">
          <div className="text-center text-sm text-purple-400 mb-4">또는</div>
          <input 
            type="url"
            value={(uploadedFile && 'url' in uploadedFile) ? uploadedFile.url || '' : ''}
            onChange={(e) => {
              if (e.target.value) {
                setUploadedFile({ name: 'URL Link', url: e.target.value });
              } else {
                setUploadedFile(null);
              }
            }}
            placeholder="결과물 URL을 입력하세요 (예: Notion, Figma, YouTube 링크)"
            className="w-full px-6 py-4 bg-white/10 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
            style={{fontFamily: 'SF Pro Text, -apple-system, sans-serif'}}
          />
        </div>
        
        {uploadedFile && (
          <div className="space-y-4">
            <p className="text-center text-lg font-medium text-purple-200 mb-4">
              오늘의 미션은 어땠나요?
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => completeDay(currentDay, 'easy')}
                className="py-6 px-4 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500/30 hover:border-green-500 rounded-2xl transition-all hover:scale-105 active:scale-95">
                <div className="text-4xl mb-2">😊</div>
                <div className="text-sm font-bold">너무 쉬움</div>
              </button>
              <button
                onClick={() => completeDay(currentDay, 'perfect')}
                className="py-6 px-4 bg-blue-500/20 hover:bg-blue-500/30 border-2 border-blue-500/30 hover:border-blue-500 rounded-2xl transition-all hover:scale-105 active:scale-95">
                <div className="text-4xl mb-2">👍</div>
                <div className="text-sm font-bold">적당함</div>
              </button>
              <button
                onClick={() => completeDay(currentDay, 'hard')}
                className="py-6 px-4 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/30 hover:border-red-500 rounded-2xl transition-all hover:scale-105 active:scale-95">
                <div className="text-4xl mb-2">😰</div>
                <div className="text-sm font-bold">너무 어려움</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
