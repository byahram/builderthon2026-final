import { 
  Code, Palette, BookOpen, Video, Rocket, Heart, // Category Icons
  Zap, Brain, // Persona Icons
  Pen, Camera, Lightbulb // Legacy/Fallback Icons
} from 'lucide-react';

export const categories = [
  { id: 'dev', name: '개발', subtitle: '웹/앱/게임', icon: Code, gradient: 'from-blue-500 via-indigo-500 to-violet-500' },
  { id: 'design', name: '디자인', subtitle: 'UI/UX/일러스트', icon: Palette, gradient: 'from-pink-400 via-rose-500 to-red-500' },
  { id: 'writing', name: '글쓰기', subtitle: '블로그/에세이', icon: BookOpen, gradient: 'from-amber-400 via-orange-500 to-yellow-500' },
  { id: 'video', name: '영상', subtitle: '유튜브/숏폼', icon: Video, gradient: 'from-red-500 via-red-600 to-rose-600' },
  { id: 'business', name: '창업', subtitle: '스토어/전자책', icon: Rocket, gradient: 'from-emerald-400 via-teal-500 to-cyan-500' },
  { id: 'lifestyle', name: '자기관리', subtitle: '운동/습관', icon: Heart, gradient: 'from-green-400 via-emerald-500 to-lime-500' },
];

export const experienceLevels = [
  { id: 'novice', label: '입문', desc: '처음 시작해요', emoji: '🐣' },
  { id: 'intermediate', label: '중급', desc: '경험이 있어요', emoji: '🦅' },
  { id: 'expert', label: '고급', desc: '더 잘하고 싶어요', emoji: '🚀' },
];

export const motivations = [
  { id: 'growth', label: '자기계발', emoji: '🌱' },
  { id: 'portfolio', label: '포트폴리오', emoji: '📁' },
  { id: 'fun', label: '재미/취미', emoji: '🎨' },
  { id: 'money', label: '수익화', emoji: '💰' },
];

export const durations = [
  { days: 3, label: '3일', subtitle: '가볍게 시작' },
  { days: 7, label: '7일', subtitle: '일주일 도전' },
  { days: 14, label: '14일', subtitle: '습관 형성' },
  { days: 30, label: '30일', subtitle: '마스터' },
];

export const personas = [
  { 
    id: 'sparta', 
    name: '스파르타 교관', 
    desc: '강력하고 단호한 동기부여', 
    quote: '"포기란 없다! 오늘 안 하면 내일은 없어!"',
    icon: Zap,
    gradient: 'from-red-500 to-orange-600',
    voiceId: 'ODq5zmih8GrVes37Dizd', // Patrick (Shouty)
    sampleText: '정신 차리세요! 오늘 할 일을 내일로 미루면, 성공도 내일로 미뤄집니다!'
  },
  { 
    id: 'gentle', 
    name: '감성 멘토', 
    desc: '따뜻한 위로와 격려', 
    quote: '"오늘도 수고했어요. 천천히 가도 괜찮아요."',
    icon: Heart,
    gradient: 'from-emerald-400 to-teal-500',
    voiceId: 'LcfcDJNUP1GQjkzn1xUU', // Emily (Calm)
    sampleText: '오늘 하루도 정말 고생 많았어요. 당신의 속도대로 천천히, 하지만 꾸준히 나아가면 돼요.'
  },
  { 
    id: 'expert', 
    name: 'AI 분석가', 
    desc: '냉철한 데이터 기반 코칭', 
    quote: '"현재 달성률 40%. 효율적인 전략이 필요합니다."',
    icon: Brain,
    gradient: 'from-blue-500 to-indigo-600',
    voiceId: 'onwK4e9ZLuTAKqWW03F9', // Daniel (Deep/News)
    sampleText: '현재 데이터를 분석한 결과, 목표 달성 확률은 85%입니다. 지금 바로 시작하는 것이 최적의 전략입니다.'
  }
];
