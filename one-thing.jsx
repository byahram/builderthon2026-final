import React, { useState, useEffect } from 'react';
import { Camera, Pen, Video, Lightbulb, ChevronRight, ChevronLeft, Check, X, Flame, Trophy, Calendar, Target, Sparkles, Star, TrendingUp, Clock, Edit3, Upload, Image, FileText, Film, Award, Coffee } from 'lucide-react';

// CSS animations
const styles = `
  @keyframes confetti {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  
  @keyframes scale-in {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes slide-up {
    0% { transform: translateY(50px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slide-down {
    0% { transform: translate(-50%, -100px); opacity: 0; }
    100% { transform: translate(-50%, 0); opacity: 1; }
  }
  
  .animate-confetti {
    animation: confetti linear forwards;
  }
  
  .animate-scale-in {
    animation: scale-in 0.5s ease-out;
  }
  
  .animate-slide-up {
    animation: slide-up 0.5s ease-out;
  }
  
  .animate-slide-down {
    animation: slide-down 0.5s ease-out;
  }
`;

export default function OneThing() {
  const [step, setStep] = useState('welcome');
  const [userData, setUserData] = useState({
    category: '',
    goal: '',
    experience: '',
    motivation: '',
    duration: 14,
    startDate: new Date().toISOString().split('T')[0]
  });
  const [roadmap, setRoadmap] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState([]);
  const [streak, setStreak] = useState(0);
  const [difficultyFeedback, setDifficultyFeedback] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [projectHistory, setProjectHistory] = useState([]);
  const [showDifficultyAdjustment, setShowDifficultyAdjustment] = useState(false);
  const [celebrationStep, setCelebrationStep] = useState(0); // 0: none, 1: confetti+streak, 2: progress

  useEffect(() => {
    if (userData.category && userData.goal && userData.duration) {
      generateRoadmap();
    }
  }, [userData.category, userData.goal, userData.duration]);

  // 로컬 스토리지에서 히스토리 로드
  useEffect(() => {
    const saved = localStorage.getItem('oneThingHistory');
    if (saved) {
      setProjectHistory(JSON.parse(saved));
    }
  }, []);

  const categories = [
    { id: 'writing', name: '글', subtitle: '에세이/소설', icon: Pen, gradient: 'from-amber-400 via-orange-500 to-red-500' },
    { id: 'art', name: '그림', subtitle: '인스타툰/일러스트', icon: Camera, gradient: 'from-purple-400 via-pink-500 to-rose-500' },
    { id: 'video', name: '영상', subtitle: '숏폼/Vlog', icon: Video, gradient: 'from-cyan-400 via-blue-500 to-indigo-500' },
    { id: 'planning', name: '기획', subtitle: '비즈니스/프로젝트', icon: Lightbulb, gradient: 'from-green-400 via-emerald-500 to-teal-500' },
  ];

  const experienceLevels = [
    { id: 'beginner', label: '처음이에요', emoji: '🌱' },
    { id: 'intermediate', label: '조금 알아요', emoji: '🌿' },
    { id: 'advanced', label: '익숙해요', emoji: '🌳' }
  ];

  const motivations = [
    { id: 'self', label: '자기만족', emoji: '💝', color: 'bg-pink-500' },
    { id: 'portfolio', label: '포트폴리오', emoji: '📁', color: 'bg-blue-500' },
    { id: 'monetize', label: '수익화', emoji: '💰', color: 'bg-green-500' }
  ];

  const durations = [
    { days: 3, label: '스프린트', subtitle: '빠른 실험' },
    { days: 7, label: '1주일', subtitle: '집중 완성' },
    { days: 14, label: '2주일', subtitle: '균형잡힌 완성' },
    { days: 30, label: '1개월', subtitle: '습관 형성' }
  ];

  const generateRoadmap = () => {
    const missions = [];
    const { category, experience, duration } = userData;
    
    const baseMissions = {
      writing: [
        '주제 브레인스토밍 (5가지 아이디어)',
        '아웃라인 작성',
        '도입부 초안 (300자)',
        '중간부 작성 (500자)',
        '결말 구성',
        '전체 초고 완성',
        '1차 퇴고',
        '2차 다듬기',
        '최종 완성본'
      ],
      art: [
        '레퍼런스 수집 (10장)',
        '러프 스케치 3종',
        '최종 스케치 선택',
        '밑그림 작업',
        '기본 채색',
        '디테일 추가',
        '배경 작업',
        '최종 보정',
        '작품 완성'
      ],
      video: [
        '콘셉트 & 스토리보드',
        '장소 섭외 & 소품 준비',
        'A-Roll 촬영',
        'B-Roll 촬영',
        '러프 편집',
        '자막 & 효과',
        '음악 & 사운드',
        '컬러 그레이딩',
        '최종 익스포트'
      ],
      planning: [
        '문제 정의 & 목표 설정',
        '시장 조사',
        '타겟 분석',
        '솔루션 아이디어 5가지',
        '실행 계획 수립',
        '예산 & 리소스',
        '위험 요소 분석',
        '최종 제안서 작성',
        '프레젠테이션 준비'
      ]
    };

    let missionList = baseMissions[category] || baseMissions.writing;
    
    const intensityMap = {
      beginner: 0.7,
      intermediate: 1.0,
      advanced: 1.3
    };
    
    const intensity = intensityMap[experience];
    const missionsPerDay = duration / missionList.length;

    for (let day = 1; day <= duration; day++) {
      const missionIndex = Math.floor((day - 1) / missionsPerDay);
      const mission = missionList[Math.min(missionIndex, missionList.length - 1)];
      
      missions.push({
        day,
        title: mission,
        difficulty: experience,
        completed: false,
        feedback: null,
        uploadedFile: null
      });
    }

    setRoadmap(missions);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const completeDay = (day, difficulty) => {
    if (!completedDays.includes(day) && uploadedFile) {
      // Step 1: 폭죽 + Streak 증가
      setCelebrationStep(1);
      setShowConfetti(true);
      setStreak(streak + 1);
      
      setTimeout(() => {
        // Step 2: Progress 바 증가
        setCelebrationStep(2);
        setCompletedDays([...completedDays, day]);
        setDifficultyFeedback({ ...difficultyFeedback, [day]: difficulty });
        
        // 로드맵 업데이트
        const updatedRoadmap = [...roadmap];
        updatedRoadmap[day - 1].completed = true;
        updatedRoadmap[day - 1].feedback = difficulty;
        updatedRoadmap[day - 1].uploadedFile = uploadedFile.name || uploadedFile.url;
        setRoadmap(updatedRoadmap);
        
        // 3일 주기 난이도 조정
        if (day % 3 === 0) {
          adjustDifficulty();
        }
      }, 2000);
      
      setTimeout(() => {
        setShowConfetti(false);
        setCelebrationStep(0);
        setUploadedFile(null);
        
        if (day < roadmap.length) {
          setCurrentDay(day + 1);
          setStep('roadmap');
        } else {
          setStep('complete');
        }
      }, 4000);
    }
  };

  const adjustDifficulty = () => {
    const recentFeedback = Object.values(difficultyFeedback).slice(-3);
    const hardCount = recentFeedback.filter(f => f === 'hard').length;
    const easyCount = recentFeedback.filter(f => f === 'easy').length;
    
    if (hardCount >= 2) {
      setShowDifficultyAdjustment(true);
      setTimeout(() => setShowDifficultyAdjustment(false), 5000);
      // 실제로는 다음 미션들의 난이도를 조정
    } else if (easyCount >= 2) {
      setShowDifficultyAdjustment(true);
      setTimeout(() => setShowDifficultyAdjustment(false), 5000);
    }
  };

  const saveToHistory = (choice) => {
    const completedProject = {
      id: Date.now(),
      goal: userData.goal,
      category: userData.category,
      duration: userData.duration,
      completedDays: completedDays.length,
      streak: streak,
      startDate: userData.startDate,
      endDate: new Date().toISOString().split('T')[0],
      result: roadmap[roadmap.length - 1]?.uploadedFile || 'Completed'
    };
    
    const newHistory = [...projectHistory, completedProject];
    setProjectHistory(newHistory);
    localStorage.setItem('oneThingHistory', JSON.stringify(newHistory));
    
    if (choice === 'new') {
      // 새 프로젝트 시작
      setStep('welcome');
      setUserData({category: '', goal: '', experience: '', motivation: '', duration: 14, startDate: new Date().toISOString().split('T')[0]});
      setCompletedDays([]);
      setStreak(0);
      setCurrentDay(1);
      setRoadmap([]);
    } else {
      // 3일 휴식
      setStep('rest');
    }
  };

  // Confetti Component
  const Confetti = () => {
    if (!showConfetti) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10%',
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}>
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#3B82F6'][Math.floor(Math.random() * 5)],
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  // Welcome Screen
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
        <style>{styles}</style>
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="relative z-10 text-center max-w-md">
            <div className="mb-8 inline-block">
              <div className="relative">
                <div className="text-9xl font-black bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent" 
                style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif', letterSpacing: '-0.02em'}}>
              One Thing
            </h1>
            
            <p className="text-xl text-purple-200 mb-2" style={{fontFamily: 'SF Pro Text, -apple-system, sans-serif'}}>
              단 하나에 집중해서 완성물을
            </p>
            
            <p className="text-sm text-purple-300/80 mb-12">
              작심삼일을 넘어, 진짜 완성까지
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={() => setStep('category')}
                className="group relative w-full px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
                style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  새 프로젝트 시작하기
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              </button>
              
              {projectHistory.length > 0 && (
                <button 
                  onClick={() => setStep('history')}
                  className="w-full px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold transition-all hover:scale-102"
                  style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
                  <span className="flex items-center justify-center gap-2">
                    <Award className="w-5 h-5" />
                    완료한 프로젝트 보기 ({projectHistory.length})
                  </span>
                </button>
              )}
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-8 text-purple-300/60 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>하나만</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4" />
                <span>매일</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>완성까지</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // History Screen
  if (step === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white p-6">
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
                  className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category?.gradient || 'from-purple-500 to-pink-500'} flex items-center justify-center`}>
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
  }

  // Category Selection
  if (step === 'category') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setStep('welcome')}
            className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            뒤로
          </button>
          
          <div className="mb-12">
            <h2 className="text-4xl font-black mb-3" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
              무엇을 만들고 싶나요?
            </h2>
            <p className="text-purple-300">창작 분야를 선택해주세요</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = userData.category === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setUserData({...userData, category: cat.id})}
                  className={`relative group p-6 rounded-3xl transition-all duration-300 ${
                    isSelected 
                      ? 'bg-white/10 ring-2 ring-white scale-105' 
                      : 'bg-white/5 hover:bg-white/10 hover:scale-102'
                  }`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity`}></div>
                  
                  <div className="relative z-10">
                    <Icon className={`w-12 h-12 mb-4 ${isSelected ? 'text-white' : 'text-purple-300'}`} />
                    <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                    <p className="text-sm text-purple-300">{cat.subtitle}</p>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          {userData.category && (
            <button 
              onClick={() => setStep('goal')}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-102 active:scale-98">
              다음
            </button>
          )}
        </div>
      </div>
    );
  }

  // Goal Setting
  if (step === 'goal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setStep('category')}
            className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            뒤로
          </button>
          
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-lg font-bold">1</span>
              </div>
              <h2 className="text-4xl font-black" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
                목표 설정
              </h2>
            </div>
            <p className="text-purple-300">무엇을 완성하고 싶나요?</p>
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium mb-3 text-purple-200">구체적인 목표를 입력해주세요</label>
            <input 
              type="text"
              value={userData.goal}
              onChange={(e) => setUserData({...userData, goal: e.target.value})}
              placeholder="예: 1분 분량의 여행 릴스, 5000자 에세이"
              className="w-full px-6 py-4 bg-white/10 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all"
              style={{fontFamily: 'SF Pro Text, -apple-system, sans-serif'}}
            />
          </div>
          
          {userData.goal && (
            <button 
              onClick={() => setStep('experience')}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-102 active:scale-98">
              다음
            </button>
          )}
        </div>
      </div>
    );
  }

  // Experience Level
  if (step === 'experience') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setStep('goal')}
            className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            뒤로
          </button>
          
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-lg font-bold">2</span>
              </div>
              <h2 className="text-4xl font-black" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
                현재 상태
              </h2>
            </div>
            <p className="text-purple-300">이 작업을 해본 적이 있나요?</p>
          </div>
          
          <div className="space-y-4 mb-8">
            {experienceLevels.map((level) => {
              const isSelected = userData.experience === level.id;
              
              return (
                <button
                  key={level.id}
                  onClick={() => setUserData({...userData, experience: level.id})}
                  className={`w-full p-6 rounded-2xl transition-all duration-300 flex items-center justify-between ${
                    isSelected 
                      ? 'bg-white/10 ring-2 ring-white scale-102' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{level.emoji}</span>
                    <span className="text-xl font-bold">{level.label}</span>
                  </div>
                  
                  {isSelected && <Check className="w-6 h-6 text-green-400" />}
                </button>
              );
            })}
          </div>
          
          {userData.experience && (
            <button 
              onClick={() => setStep('motivation')}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-102 active:scale-98">
              다음
            </button>
          )}
        </div>
      </div>
    );
  }

  // Motivation
  if (step === 'motivation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setStep('experience')}
            className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            뒤로
          </button>
          
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-lg font-bold">3</span>
              </div>
              <h2 className="text-4xl font-black" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
                동기 부여
              </h2>
            </div>
            <p className="text-purple-300">왜 이것을 완성하고 싶나요?</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mb-8">
            {motivations.map((mot) => {
              const isSelected = userData.motivation === mot.id;
              
              return (
                <button
                  key={mot.id}
                  onClick={() => setUserData({...userData, motivation: mot.id})}
                  className={`p-6 rounded-2xl transition-all duration-300 flex items-center justify-between ${
                    isSelected 
                      ? 'bg-white/10 ring-2 ring-white scale-102' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{mot.emoji}</span>
                    <span className="text-xl font-bold">{mot.label}</span>
                  </div>
                  
                  {isSelected && <Check className="w-6 h-6 text-green-400" />}
                </button>
              );
            })}
          </div>
          
          {userData.motivation && (
            <button 
              onClick={() => setStep('duration')}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-102 active:scale-98">
              다음
            </button>
          )}
        </div>
      </div>
    );
  }

  // Duration Selection
  if (step === 'duration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setStep('motivation')}
            className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            뒤로
          </button>
          
          <div className="mb-12">
            <h2 className="text-4xl font-black mb-3" style={{fontFamily: 'SF Pro Display, -apple-system, sans-serif'}}>
              완수 기간
            </h2>
            <p className="text-purple-300">얼마나 집중할까요?</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {durations.map((dur) => {
              const isSelected = userData.duration === dur.days;
              
              return (
                <button
                  key={dur.days}
                  onClick={() => setUserData({...userData, duration: dur.days})}
                  className={`p-6 rounded-2xl transition-all duration-300 ${
                    isSelected 
                      ? 'bg-white/10 ring-2 ring-white scale-105' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}>
                  <div className="text-center">
                    <div className="text-5xl font-black mb-2 bg-gradient-to-br from-pink-400 to-purple-400 bg-clip-text text-transparent">
                      {dur.days}
                    </div>
                    <div className="text-lg font-bold mb-1">{dur.label}</div>
                    <div className="text-xs text-purple-300">{dur.subtitle}</div>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-4">
                      <Check className="w-6 h-6 text-green-400 mx-auto" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => setStep('roadmap-preview')}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-102 active:scale-98">
            로드맵 미리보기
          </button>
        </div>
      </div>
    );
  }

  // Roadmap Preview
  if (step === 'roadmap-preview') {
    const milestones = [];
    const totalDays = roadmap.length;
    const milestoneDays = [
      Math.floor(totalDays * 0.25),
      Math.floor(totalDays * 0.5),
      Math.floor(totalDays * 0.75),
      totalDays
    ];
    
    milestoneDays.forEach((day, index) => {
      if (roadmap[day - 1]) {
        milestones.push({
          day,
          title: roadmap[day - 1].title,
          percentage: ((day / totalDays) * 100).toFixed(0)
        });
      }
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setStep('duration')}
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
                    <div className="absolute left-3 top-10 w-0.5 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
                  )}
                  
                  <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
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
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
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
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-102 active:scale-98">
            시작하기! 🚀
          </button>
        </div>
      </div>
    );
  }

  // Daily Mission Upload
  if (step === 'upload') {
    const todayMission = roadmap[currentDay - 1];
    const prevProgress = ((completedDays.length) / roadmap.length) * 100;
    const newProgress = ((completedDays.length + 1) / roadmap.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white p-6">
        <Confetti />
        
        {/* Celebration Overlay */}
        {celebrationStep > 0 && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="text-center">
              {celebrationStep === 1 && (
                <div className="animate-scale-in">
                  <Flame className="w-32 h-32 text-orange-500 mx-auto mb-6 animate-bounce drop-shadow-2xl" />
                  <div className="text-8xl font-black mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                    {streak}
                  </div>
                  <p className="text-3xl font-bold text-white">연속 달성! 🔥</p>
                </div>
              )}
              
              {celebrationStep === 2 && (
                <div className="animate-slide-up max-w-md w-full px-6">
                  <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/20">
                    <TrendingUp className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-2xl font-bold mb-6">목표에 가까워졌어요!</p>
                    
                    {/* Animated Progress Bar */}
                    <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-3">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-1000 ease-out rounded-full"
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
              value={uploadedFile?.url || ''}
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
  }

  // Roadmap View
  if (step === 'roadmap') {
    const todayMission = roadmap[currentDay - 1];
    const progress = (completedDays.length / roadmap.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 text-white">
        {/* Difficulty Adjustment Notification */}
        {showDifficultyAdjustment && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 animate-slide-down">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl px-6 py-4 shadow-2xl border border-white/20">
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
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 rounded-full"
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
                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
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
                      className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2">
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
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
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
  }

  // Completion Screen
  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-8 animate-bounce" />
            
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              축하합니다! 🎉
            </h1>
            
            <p className="text-2xl text-purple-200 mb-8">
              {userData.goal}을 완성했어요!
            </p>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl font-black text-pink-400">{roadmap.length}</div>
                  <div className="text-sm text-purple-300">일간 미션</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-purple-400">{streak}</div>
                  <div className="text-sm text-purple-300">연속 달성</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-blue-400">100%</div>
                  <div className="text-sm text-purple-300">완료율</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 mb-6">
              <Flame className="w-10 h-10 text-orange-400 mx-auto mb-3" />
              <p className="text-lg font-bold mb-2">연속 학습일을 잃지 마세요!</p>
              <p className="text-sm text-purple-300">다음 선택을 해주세요</p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => saveToHistory('new')}
                className="w-full px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 active:scale-95">
                다음 One Thing 시작하기
              </button>
              
              <button 
                onClick={() => saveToHistory('rest')}
                className="w-full px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold transition-all hover:scale-102 flex items-center justify-center gap-2">
                <Coffee className="w-5 h-5" />
                3일간 휴식하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rest Screen
  if (step === 'rest') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Coffee className="w-24 h-24 text-blue-400 mx-auto mb-8" />
          
          <h1 className="text-4xl font-black mb-4">좋은 휴식이에요</h1>
          <p className="text-xl text-purple-200 mb-8">
            3일 후에 다시 만나요!
          </p>
          
          <button 
            onClick={() => setStep('welcome')}
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95">
            홈으로
          </button>
        </div>
      </div>
    );
  }

  return null;
}
