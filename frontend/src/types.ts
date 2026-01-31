export interface Mission {
  day: number;
  title: string;
  difficulty: string;
  completed: boolean;
  feedback: string | null;
  uploadedFile: string | null;
}

export interface UserData {
  category: string;
  goal: string;
  experience: string;
  motivation: string;
  duration: number;
  persona: string;
  startDate: string;
}

export interface ProjectHistory {
  id: number;
  goal: string;
  category: string;
  duration: number;
  completedDays: number;
  streak: number;
  startDate: string;
  endDate: string;
  result: string;
}

export interface UploadedFileObj {
  name: string;
  url?: string;
}
