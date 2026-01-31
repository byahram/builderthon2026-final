import React, { useState, useEffect } from 'react';
import type { Mission, UserData, ProjectHistory, UploadedFileObj } from './types';
import { WelcomeView } from './components/WelcomeView';
import { HistoryView } from './components/HistoryView';
import { CategoryView } from './components/CategoryView';
import { GoalView } from './components/GoalView';
import { ExperienceView } from './components/ExperienceView';
import { MotivationView } from './components/MotivationView';
import { DurationView } from './components/DurationView';
import { PersonaView } from './components/PersonaView';
import { RoadmapPreview } from './components/RoadmapPreview';
import { RoadmapView } from './components/RoadmapView';
import { UploadView } from './components/UploadView';
import { CompletionView } from './components/CompletionView';
import { RestView } from './components/RestView';
import { Confetti } from './components/Confetti';
import { ConfigurationWizard } from './components/ConfigurationWizard';
import { RoadmapPlaceholder } from './components/RoadmapPlaceholder';
import { SummaryChatView } from './components/SummaryChatView';

const App: React.FC = () => {
  const [step, setStep] = useState<string>('welcome');
  const [userData, setUserData] = useState<UserData>({
    category: '',
    goal: '',
    experience: '',
    motivation: '',
    duration: 3,
    persona: '',
    startDate: new Date().toISOString().split('T')[0]
  });
  const [roadmap, setRoadmap] = useState<Mission[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [difficultyFeedback, setDifficultyFeedback] = useState<Record<number, string>>({});
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | UploadedFileObj | null>(null);
  const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);
  const [showDifficultyAdjustment, setShowDifficultyAdjustment] = useState<boolean>(false);
  const [celebrationStep, setCelebrationStep] = useState<number>(0); // 0: none, 1: confetti+streak, 2: progress
  const [isLoading, setIsLoading] = useState<boolean>(false); // Added isLoading state

  useEffect(() => {
    if (userData.category && userData.goal && userData.duration) {
      handleGenerateRoadmap();
    }
  }, [userData.category, userData.goal, userData.duration]);

  // 로컬 스토리지에서 히스토리 로드
  useEffect(() => {
    const saved = localStorage.getItem('oneThingHistory');
    if (saved) {
      setProjectHistory(JSON.parse(saved));
    }
  }, []);

  const handleStepChange = (newStep: string) => {
    setStep(newStep);
  };

  const handleGenerateRoadmap = async () => {
    setIsLoading(true);
    
    // Smooth transition to roadmap preview logic
    // Currently just mocking the delay and setting step to roadmap-preview
    setStep('roadmap-preview');
    
    // Simulate API delay/Processing time before actually "creating" the roadmap data
    // In a real app, we might fetch data here or in the preview step.
    // For now, let's generate the data immediately but show it via the preview component.
    
    setTimeout(() => {
        const missions = [];
        const { category, experience, duration } = userData;
        
        // Base missions defined in logic
        const baseMissions: Record<string, string[]> = {
          dev: [
            '기획 및 요구사항 분석',
            '기술 스택 선정',
            '프로젝트 초기 세팅',
            'DB 설계 및 API 명세',
            '핵심 기능 구현 1',
            '핵심 기능 구현 2',
            'UI/UX 디자인 적용',
            '버그 수정 및 테스트',
            '배포 및 회고'
          ],
          design: [
            '레퍼런스 수집 및 무드보드',
            '아이디어 스케치',
            '컬러 팔레트 & 폰트 선정',
            '주요 요소 시안 작업',
            '디테일 작업 1',
            '디테일 작업 2',
            '목업 적용 및 피드백',
            '최종 보정',
            '포트폴리오 업로드'
          ],
          writing: [
            '주제 선정 및 자료 조사',
            '목차 및 개요 작성',
            '서론(도입부) 집필',
            '본론 주요 내용 작성 1',
            '본론 주요 내용 작성 2',
            '결론(마무리) 집필',
            '전체 초고 검토',
            '문장 다듬기 및 퇴고',
            '최종 발행'
          ],
          video: [
            '기획 및 대본 작성',
            '촬영 장소/소품 준비',
            '메인 컷 촬영',
            '인서트 컷 촬영',
            '컷 편집 (가편집)',
            '자막 및 효과 삽입',
            '배경음악 및 사운드 조절',
            '색보정 및 썸네일 제작',
            '최종 렌더링 및 업로드'
          ],
          business: [
            '아이템 정의 및 시장 조사',
            '타겟 고객 페르소나 설정',
            '경쟁사 분석',
            '차별화 포인트 도출',
            'MVP(최소기능제품) 기획',
            '마케팅 채널 확보',
            '초기 상세페이지 기획',
            '가설 검증 및 피드백',
            '사업계획서 초안 완성'
          ],
          lifestyle: [
            '현재 상태 분석 및 목표 설정',
            '식단/루틴 계획 세우기',
            '필요한 도구/환경 세팅',
            '실천 1일차 & 인증',
            '실천 2~3일차 & 기록',
            '중간 점검 및 피드백',
            '강도 높이기',
            '눈바디/성과 측정',
            '지속 가능한 루틴 확립'
          ]
        };
    
        let missionList = baseMissions[category] || baseMissions.writing;
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
        setIsLoading(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const completeDay = (day: number, difficulty: string) => {
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
        
        let fileValue = '';
        if (uploadedFile) {
            if ('url' in uploadedFile && uploadedFile.url) {
                fileValue = uploadedFile.url;
            } else {
                fileValue = uploadedFile.name;
            }
        }
        
        updatedRoadmap[day - 1].uploadedFile = fileValue;
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

  const saveToHistory = (choice: string) => {
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
      setUserData({category: '', goal: '', experience: '', motivation: '', duration: 0, persona: '', startDate: new Date().toISOString().split('T')[0]});
      setCompletedDays([]);
      setStreak(0);
      setCurrentDay(1);
      setRoadmap([]);
    } else {
      // 3일 휴식
      setStep('rest');
    }
  };

   return (
    <div className="flex w-full h-screen bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 overflow-hidden text-white font-sans selection:bg-purple-500/30">
      
      {/* Left Panel (Roadmap Display) */}
      <div className="w-[55%] h-full border-r border-white/10 bg-black/20 overflow-y-auto relative custom-scrollbar">
        {/* Background Ambient Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {step === 'roadmap' ? (
           <RoadmapView 
             setStep={setStep} 
             userData={userData} 
             roadmap={roadmap} 
             currentDay={currentDay}
             completedDays={completedDays}
             streak={streak}
             showDifficultyAdjustment={showDifficultyAdjustment}
           />
        ) : step === 'roadmap-preview' ? (
           <RoadmapPreview 
             setStep={setStep} 
             userData={userData} 
             roadmap={roadmap} 
           />
        ) : (
           <RoadmapPlaceholder />
        )}
      </div>

      {/* Right Panel (Configuration & Chat) */}
      <div className="w-[45%] h-full flex flex-col bg-slate-900/50 backdrop-blur-md relative">
        {step === 'welcome' && (
           <WelcomeView setStep={setStep} projectHistory={projectHistory} />
        )}

        {(['category', 'experience', 'motivation', 'duration', 'persona'].includes(step)) && (
           <ConfigurationWizard 
             step={step} 
             setStep={handleStepChange} 
             userData={userData} 
             setUserData={setUserData} 
           />
        )}

        {(step === 'summary' || step === 'roadmap-preview' || step === 'roadmap') && (
            <SummaryChatView 
              userData={userData} 
              setUserData={setUserData} 
              onGenerate={handleGenerateRoadmap} 
              isLoading={isLoading} 
              isRoadmapActive={step === 'roadmap' || step === 'roadmap-preview'}
            />
        )}
      </div>

      <Confetti show={showConfetti} />
    </div>
  );
};

export default App;
