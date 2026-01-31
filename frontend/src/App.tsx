import React, { useState, useEffect } from 'react';
import type { Mission, UserData, ProjectHistory, UploadedFileObj } from './types';
import { WelcomeView } from './components/WelcomeView';
import { HistoryView } from './components/HistoryView';
import { CategoryView } from './components/CategoryView';
import { GoalView } from './components/GoalView';
import { ExperienceView } from './components/ExperienceView';
import { MotivationView } from './components/MotivationView';
import { DurationView } from './components/DurationView';
import { RoadmapPreview } from './components/RoadmapPreview';
import { RoadmapView } from './components/RoadmapView';
import { UploadView } from './components/UploadView';
import { CompletionView } from './components/CompletionView';
import { RestView } from './components/RestView';

export default function App() {
  const [step, setStep] = useState<string>('welcome');
  const [userData, setUserData] = useState<UserData>({
    category: '',
    goal: '',
    experience: '',
    motivation: '',
    duration: 14,
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

  const generateRoadmap = () => {
    const missions = [];
    const { category, experience, duration } = userData;
    
    // Base missions defined in logic, could be moved to separate file but kept here for now as it contains logic
    const baseMissions: Record<string, string[]> = {
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
    
    const intensityMap: Record<string, number> = {
      beginner: 0.7,
      intermediate: 1.0,
      advanced: 1.3
    };
    
    // Unused intensity calculation kept for future use or logic
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

  return (
    <>
      {step === 'welcome' && <WelcomeView setStep={setStep} projectHistory={projectHistory} />}
      {step === 'history' && <HistoryView setStep={setStep} projectHistory={projectHistory} />}
      {step === 'category' && <CategoryView setStep={setStep} userData={userData} setUserData={setUserData} />}
      {step === 'goal' && <GoalView setStep={setStep} userData={userData} setUserData={setUserData} />}
      {step === 'experience' && <ExperienceView setStep={setStep} userData={userData} setUserData={setUserData} />}
      {step === 'motivation' && <MotivationView setStep={setStep} userData={userData} setUserData={setUserData} />}
      {step === 'duration' && <DurationView setStep={setStep} userData={userData} setUserData={setUserData} />}
      {step === 'roadmap-preview' && <RoadmapPreview setStep={setStep} userData={userData} roadmap={roadmap} />}
      {step === 'roadmap' && (
        <RoadmapView 
          setStep={setStep} 
          userData={userData} 
          roadmap={roadmap} 
          currentDay={currentDay} 
          completedDays={completedDays} 
          streak={streak} 
          showDifficultyAdjustment={showDifficultyAdjustment} 
        />
      )}
      {step === 'upload' && (
        <UploadView 
          setStep={setStep} 
          roadmap={roadmap} 
          currentDay={currentDay} 
          completedDays={completedDays} 
          streak={streak} 
          uploadedFile={uploadedFile} 
          setUploadedFile={setUploadedFile} 
          handleFileUpload={handleFileUpload} 
          completeDay={completeDay} 
          showConfetti={showConfetti} 
          celebrationStep={celebrationStep} 
        />
      )}
      {step === 'complete' && <CompletionView userData={userData} roadmap={roadmap} streak={streak} saveToHistory={saveToHistory} />}
      {step === 'rest' && <RestView setStep={setStep} />}
    </>
  );
}
