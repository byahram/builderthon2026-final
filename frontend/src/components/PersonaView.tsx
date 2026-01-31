import { ChevronLeft, Check, Volume2, Loader2, AlertCircle } from 'lucide-react';
import type { UserData } from '../types';
import { personas } from '../constants/data';
import { playVoicePreview } from '../api/elevenlabs';
import { useState } from 'react';

interface PersonaViewProps {
  setStep: (step: string) => void;
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export const PersonaView: React.FC<PersonaViewProps> = ({ setStep, userData, setUserData }) => {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePreview = async (e: React.MouseEvent, persona: typeof personas[0]) => {
    e.stopPropagation();
    
    if (playingVoiceId) return; // Prevent multiple plays
    
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      setError('API 키가 설정되지 않았습니다 (.env 파일을 확인해주세요)');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setPlayingVoiceId(persona.id);
      await playVoicePreview(persona.voiceId, persona.sampleText, apiKey);
    } catch (err) {
      console.error(err);
      setError('음성 재생 중 오류가 발생했습니다');
      setTimeout(() => setError(null), 3000);
    } finally {
      setPlayingVoiceId(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-purple-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => setStep('duration')}
          className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          뒤로
        </button>
        
        <div className="mb-12">
          <h2 className="text-4xl font-black mb-3" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
            AI 코치 선택
          </h2>
          <p className="text-purple-300">당신의 여정을 함께할 페르소나를 선택하세요.</p>
        </div>
        
        <div className="grid gap-4 mb-4">
          {personas.map((persona) => {
            const isSelected = userData.persona === persona.id;
            const Icon = persona.icon;
            
            return (
              <button
                key={persona.id}
                onClick={() => setUserData({...userData, persona: persona.id})}
                className={`text-left p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group w-full ${
                  isSelected 
                    ? 'ring-2 ring-white scale-102' 
                    : 'bg-white/5 hover:bg-white/10 hover:scale-101'
                }`}>
                {/* Background Gradient for Selected State */}
                {isSelected && (
                  <div className={`absolute inset-0 bg-linear-to-r ${persona.gradient} opacity-20`}></div>
                )}
                
                <div className="relative z-10 flex items-start gap-4">
                  <div className={`p-4 rounded-xl bg-linear-to-br ${persona.gradient} shadow-lg shrink-0`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-bold">{persona.name}</h3>
                      {isSelected && <Check className="w-6 h-6 text-white" />}
                    </div>
                    <p className="text-purple-200 mb-3">{persona.desc}</p>
                    <div className="bg-black/20 rounded-lg p-3 text-sm italic text-purple-100 border-l-2 border-white/30">
                      {persona.quote}
                    </div>
                  </div>
                </div>
                
                {/* Voice Preview Button */}
                <div className="absolute top-4 right-4 transition-opacity cursor-pointer z-20"
                     onClick={(e) => handlePreview(e, persona)}>
                  <div className={`p-2 rounded-full transition-all ${
                    playingVoiceId === persona.id 
                      ? 'bg-purple-500 text-white animate-pulse' 
                      : 'bg-white/10 hover:bg-white/20 text-purple-200'
                  }`}>
                    {playingVoiceId === persona.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-200 text-sm animate-shake">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        {userData.persona && (
          <button 
            onClick={() => setStep('roadmap-preview')}
            className="w-full mt-4 py-4 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-102 active:scale-98 animate-slide-up">
            로드맵 생성하기
          </button>
        )}
      </div>
    </div>
  );
};
