import React, { useState } from 'react';
import { Send, Loader2, Edit2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import type { UserData } from '../types';
import { categories, experienceLevels, motivations, durations, personas } from '../constants/data';

interface SummaryChatViewProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isRoadmapActive?: boolean;
}

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  timestamp?: string;
}

export const SummaryChatView: React.FC<SummaryChatViewProps> = ({ userData, setUserData, onGenerate, isLoading, isRoadmapActive }) => {
  const [goalInput, setGoalInput] = useState('');
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  // Auto-collapse summary when roadmap is active
  React.useEffect(() => {
    if (isRoadmapActive) {
        setIsSummaryExpanded(false);
    }
  }, [isRoadmapActive]);

  const getLabel = (list: any[], id: string | number) => list.find(item => item.id === id || item.days === id)?.label || list.find(item => item.id === id)?.name || id;
  const getEmoji = (list: any[], id: string) => list.find(item => item.id === id)?.emoji || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    
    // Collapse summary when chat starts/submits
    setIsSummaryExpanded(false); 
    
    const now = new Date();
    const timestamp = now.toLocaleString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    const newUserMsg: Message = {
        id: Date.now(),
        role: 'user',
        text: goalInput,
        timestamp: timestamp
    };

    const newAiMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        text: `로드맵이 생성되었습니다. (${timestamp})`,
        timestamp: timestamp
    };

    setMessages([...messages, newUserMsg, newAiMsg]);
    setUserData({ ...userData, goal: goalInput });
    setGoalInput(''); // Clear input
    // onGenerate() removed to prevent race condition. useEffect in App.tsx will trigger it.
  };

  const SummaryItem = ({ label, value, emoji, icon: Icon }: any) => (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xl shrink-0">
        {Icon ? <Icon className="w-5 h-5 text-indigo-300" /> : emoji}
      </div>
      <div className="overflow-hidden">
        <div className="text-xs text-indigo-200 mb-0.5">{label}</div>
        <div className="font-bold text-white truncate">{value}</div>
      </div>
    </div>
  );

  const selectedCategory = categories.find(c => c.id === userData.category);
  const selectedPersona = personas.find(c => c.id === userData.persona);

  return (
    <div className="w-full h-full flex flex-col p-6 relative">
      <div className="flex items-center justify-between mb-6 cursor-pointer sticky top-0 z-10 py-2" onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
        <div>
           <h2 className="text-2xl font-bold mb-1">
             {isRoadmapActive ? 'AI 코치와 대화중' : (userData.goal ? '목표 설정 완료! 🚀' : '준비 완료! 🎉')}
           </h2>
           <p className="text-purple-200 text-sm">
             {isRoadmapActive ? '로드맵이 생성되었습니다. 언제든 수정이 가능합니다.' : (userData.goal ? 'AI가 로드맵을 생성하고 있습니다.' : '마지막으로 구체적인 목표를 알려주세요.')}
           </p>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          {isSummaryExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 space-y-4">
        {isSummaryExpanded && (
            <div className="animate-fade-in-down mb-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
                <SummaryItem label="분야" value={selectedCategory?.name} icon={selectedCategory?.icon} />
                <SummaryItem label="경험" value={getLabel(experienceLevels, userData.experience)} emoji={getEmoji(experienceLevels, userData.experience)} />
                <SummaryItem label="동기" value={getLabel(motivations, userData.motivation)} emoji={getEmoji(motivations, userData.motivation)} />
                <SummaryItem label="기간" value={`${userData.duration}일`} emoji="🗓️" />
            </div>

            <div className="mb-6 p-4 bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                    {selectedPersona?.icon && <selectedPersona.icon className="w-5 h-5 text-purple-300" />}
                    <span className="font-bold text-purple-200">{selectedPersona?.name}</span>
                </div>
                <p className="text-sm text-purple-100 italic">
                "{selectedPersona?.quote}"
                </p>
            </div>
            </div>
        )}

        {/* Chat History */}
        {messages.length === 0 ? (
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs font-bold text-green-300">AI CO-PILOT ONLINE</span>
                </div>
                <p className="text-sm text-white">
                {selectedPersona?.name}입니다. 구체적으로 어떤 목표를 달성하고 싶으신가요?
                <br/>ex) "3일 안에 기초 체력 기르기", "부모님께 드릴 용돈 벌기"
                </p>
            </div>
        ) : (
            <div className="space-y-4 pb-20">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                            msg.role === 'user' 
                            ? 'bg-purple-500 text-white rounded-tr-none' 
                            : 'bg-white/10 text-white rounded-tl-none border border-white/10'
                        }`}>
                            <p className="text-sm">{msg.text}</p>
                            {msg.timestamp && <p className="text-[10px] opacity-50 mt-1 text-right">{msg.timestamp}</p>}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      <div className="mt-auto pt-4 sticky bottom-0">
        <form onSubmit={handleSubmit} className="relative">
            <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder={isRoadmapActive ? "예: 오늘 미션을 못했어, 다시 짜줘" : "목표를 입력하세요..."}
                className="w-full bg-black/20 text-white placeholder-white/30 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/10"
                disabled={isLoading}
            />
            <button 
                type="submit"
                disabled={isLoading || !goalInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
        </form>
      </div>
    </div>
  );
};
