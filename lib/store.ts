import { Task, PomodoroSettings } from './types';

export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const getPomodoroSettings = (): PomodoroSettings => {
  if (typeof window === 'undefined') return {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    alarmSound: 'notification',
    alarmVolume: 0.7,
    darkMode: true
  };
  
  const settings = localStorage.getItem('pomodoroSettings');
  return settings ? JSON.parse(settings) : {
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    alarmSound: 'notification',
    alarmVolume: 0.7,
    darkMode: true
  };
};

export const savePomodoroSettings = (settings: PomodoroSettings) => {
  localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
};