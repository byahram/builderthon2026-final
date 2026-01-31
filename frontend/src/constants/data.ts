import { Pen, Camera, Video, Lightbulb } from 'lucide-react';

export const categories = [
  { id: 'writing', name: '글', subtitle: '에세이/소설', icon: Pen, gradient: 'from-amber-400 via-orange-500 to-red-500' },
  { id: 'art', name: '그림', subtitle: '인스타툰/일러스트', icon: Camera, gradient: 'from-purple-400 via-pink-500 to-rose-500' },
  { id: 'video', name: '영상', subtitle: '숏폼/Vlog', icon: Video, gradient: 'from-cyan-400 via-blue-500 to-indigo-500' },
  { id: 'planning', name: '기획', subtitle: '비즈니스/프로젝트', icon: Lightbulb, gradient: 'from-green-400 via-emerald-500 to-teal-500' },
];

export const experienceLevels = [
  { id: 'beginner', label: '처음이에요', emoji: '🌱' },
  { id: 'intermediate', label: '조금 알아요', emoji: '🌿' },
  { id: 'advanced', label: '익숙해요', emoji: '🌳' }
];

export const motivations = [
  { id: 'self', label: '자기만족', emoji: '💝', color: 'bg-pink-500' },
  { id: 'portfolio', label: '포트폴리오', emoji: '📁', color: 'bg-blue-500' },
  { id: 'monetize', label: '수익화', emoji: '💰', color: 'bg-green-500' }
];

export const durations = [
  { days: 3, label: '스프린트', subtitle: '빠른 실험' },
  { days: 7, label: '1주일', subtitle: '집중 완성' },
  { days: 14, label: '2주일', subtitle: '균형잡힌 완성' },
  { days: 30, label: '1개월', subtitle: '습관 형성' }
];
