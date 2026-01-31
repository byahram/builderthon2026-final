import React, { useState, useEffect } from 'react';
import type { Mission, UserData, UploadedFileObj } from './types';
import { WelcomeView } from './components/WelcomeView';
import { RoadmapPreview } from './components/RoadmapPreview';
import { RoadmapView } from './components/RoadmapView';
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
  const [showDifficultyAdjustment, setShowDifficultyAdjustment] = useState<boolean>(false);
  const [celebrationStep, setCelebrationStep] = useState<number>(0); // 0: none, 1: confetti+streak, 2: progress
  const [isLoading, setIsLoading] = useState<boolean>(false); // Added isLoading state
  const [ragComparison, setRagComparison] = useState<any>(null); // Store RAG Debug Info

  useEffect(() => {
    if (userData.category && userData.goal && userData.duration && userData.experience && userData.motivation && userData.persona) {
      handleGenerateRoadmap();
    }
  }, [userData.category, userData.goal, userData.duration, userData.experience, userData.motivation, userData.persona]);

  const handleStepChange = (newStep: string) => {
    setStep(newStep);
  };

  const handleGenerateRoadmap = async () => {
    setIsLoading(true);
    // setStep('roadmap-preview'); // Preview removed by user request
    setStep('roadmap');

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      console.log('Sending userData:', userData); // Debug payload
      const response = await fetch(`${backendUrl}/api/talk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setRoadmap(data.roadmap);
      if (data.rag_comparison) {
          setRagComparison(data.rag_comparison);
      }
      
    } catch (error: any) {
      console.error('Error generating roadmap details:', error);
      alert(`오류가 발생했습니다: ${error.message}`);
      setStep('summary');
    } finally {
      setIsLoading(false);
    }
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
             isLoading={isLoading} // Pass loading state
           />
           /* Preview removed
        ) : step === 'roadmap-preview' ? (
           <RoadmapPreview 
             setStep={setStep} 
             userData={userData} 
             roadmap={roadmap} 
           />
           */
        ) : (
           <RoadmapPlaceholder />
        )}
      </div>

      {/* Right Panel (Configuration & Chat) */}
      <div className="w-[45%] h-full flex flex-col bg-slate-900/50 backdrop-blur-md relative">
        {step === 'welcome' && (
           <WelcomeView setStep={setStep} />
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
              ragComparison={ragComparison}
            />
        )}
      </div>

      <Confetti show={showConfetti} />
    </div>
  );
};

export default App;
