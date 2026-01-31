import React from 'react';
import { CategoryView } from './CategoryView';
import { ExperienceView } from './ExperienceView';
import { MotivationView } from './MotivationView';
import { DurationView } from './DurationView';
import { PersonaView } from './PersonaView';
import type { UserData } from '../types';

interface ConfigurationWizardProps {
  step: string;
  setStep: (step: string) => void;
  userData: UserData;
  setUserData: (data: UserData) => void; 
}

export const ConfigurationWizard: React.FC<ConfigurationWizardProps> = ({ step, setStep, userData, setUserData }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
        {step === 'category' && <CategoryView setStep={setStep} userData={userData} setUserData={setUserData} />}
        {step === 'experience' && <ExperienceView setStep={setStep} userData={userData} setUserData={setUserData} />}
        {step === 'motivation' && <MotivationView setStep={setStep} userData={userData} setUserData={setUserData} />}
        {step === 'duration' && <DurationView setStep={setStep} userData={userData} setUserData={setUserData} />}
        {step === 'persona' && <PersonaView setStep={setStep} userData={userData} setUserData={setUserData} />}
      </div>
    </div>
  );
};
