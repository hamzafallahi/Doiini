export interface Task {
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  completed: boolean;
  pinned: boolean;
  createdAt: string;
}

export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  alarmSound: 'beep' | 'bell' | 'digital' | 'notification';
  alarmVolume: number;
  darkMode: boolean;
}