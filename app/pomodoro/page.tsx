"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPomodoroSettings, savePomodoroSettings } from "@/lib/store";
import { PomodoroSettings } from "@/lib/types";
import { Play, Pause, RotateCcw, Settings, Volume2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ALARM_SOUNDS = {
  beep: "Beep",
  bell: "Bell",
  digital: "Digital",
  notification: "Notification",
};

export default function PomodoroPage() {
  const [settings, setSettings] = useState<PomodoroSettings>(getPomodoroSettings());
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isWork) {
        const newSessions = sessions + 1;
        setSessions(newSessions);
        if (newSessions % settings.sessionsBeforeLongBreak === 0) {
          setTimeLeft(settings.longBreakDuration * 60);
          if (settings.autoStartBreaks) setIsRunning(true);
          else setIsRunning(false);
        } else {
          setTimeLeft(settings.breakDuration * 60);
          if (settings.autoStartBreaks) setIsRunning(true);
          else setIsRunning(false);
        }
      } else {
        setTimeLeft(settings.workDuration * 60);
        if (settings.autoStartPomodoros) setIsRunning(true);
        else setIsRunning(false);
      }
      setIsWork(!isWork);
      const audio = new Audio(`/sounds/${settings.alarmSound}.mp3`);
      audio.volume = settings.alarmVolume;
      audio.play().catch(() => {});
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isWork, sessions, settings]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSettingsUpdate = (newSettings: Partial<PomodoroSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    savePomodoroSettings(updatedSettings);
    if (isWork) {
      setTimeLeft(updatedSettings.workDuration * 60);
    } else if (sessions % settings.sessionsBeforeLongBreak === 0) {
      setTimeLeft(updatedSettings.longBreakDuration * 60);
    } else {
      setTimeLeft(updatedSettings.breakDuration * 60);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md space-y-6 p-6 bg-zinc-900/80 border-primary/20 backdrop-blur-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            {isWork ? "Work Time" : sessions % settings.sessionsBeforeLongBreak === 0 ? "Long Break" : "Short Break"}
          </h1>
          <div className="mt-2 text-7xl font-bold text-primary">{formatTime(timeLeft)}</div>
          <div className="mt-2 text-sm text-zinc-400">
            Session {Math.floor(sessions / settings.sessionsBeforeLongBreak) + 1} -{" "}
            {sessions % settings.sessionsBeforeLongBreak + 1}/
            {settings.sessionsBeforeLongBreak}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            size="icon"
            variant={isRunning ? "outline" : "default"}
            onClick={() => setIsRunning(!isRunning)}
            className="w-12 h-12 rounded-full hover:scale-110 transition-all duration-300"
          >
            {isRunning ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setTimeLeft(settings.workDuration * 60);
              setIsWork(true);
              setSessions(0);
              setIsRunning(false);
            }}
            className="w-12 h-12 rounded-full hover:scale-110 transition-all duration-300"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="icon" 
                variant="outline"
                className="w-12 h-12 rounded-full hover:scale-110 transition-all duration-300"
              >
                <Settings className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-primary/20">
              <DialogHeader>
                <DialogTitle className="text-primary">Pomodoro Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Work Duration: {settings.workDuration} minutes</Label>
                  <Slider
                    value={[settings.workDuration]}
                    min={1}
                    max={60}
                    step={1}
                    onValueChange={([value]) =>
                      handleSettingsUpdate({ workDuration: value })
                    }
                    className="[&>span]:bg-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Break Duration: {settings.breakDuration} minutes</Label>
                  <Slider
                    value={[settings.breakDuration]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={([value]) =>
                      handleSettingsUpdate({ breakDuration: value })
                    }
                    className="[&>span]:bg-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Long Break: {settings.longBreakDuration} minutes</Label>
                  <Slider
                    value={[settings.longBreakDuration]}
                    min={1}
                    max={60}
                    step={1}
                    onValueChange={([value]) =>
                      handleSettingsUpdate({ longBreakDuration: value })
                    }
                    className="[&>span]:bg-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sessions before long break: {settings.sessionsBeforeLongBreak}</Label>
                  <Slider
                    value={[settings.sessionsBeforeLongBreak]}
                    min={1}
                    max={8}
                    step={1}
                    onValueChange={([value]) =>
                      handleSettingsUpdate({ sessionsBeforeLongBreak: value })
                    }
                    className="[&>span]:bg-primary"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Auto-start breaks</Label>
                    <Switch
                      checked={settings.autoStartBreaks}
                      onCheckedChange={(checked) =>
                        handleSettingsUpdate({ autoStartBreaks: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Auto-start pomodoros</Label>
                    <Switch
                      checked={settings.autoStartPomodoros}
                      onCheckedChange={(checked) =>
                        handleSettingsUpdate({ autoStartPomodoros: checked })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alarm Sound</Label>
                    <Select
                      value={settings.alarmSound}
                      onValueChange={(value: any) =>
                        handleSettingsUpdate({ alarmSound: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ALARM_SOUNDS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <Label>Volume: {Math.round(settings.alarmVolume * 100)}%</Label>
                    </div>
                    <Slider
                      value={[settings.alarmVolume * 100]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={([value]) =>
                        handleSettingsUpdate({ alarmVolume: value / 100 })
                      }
                      className="[&>span]:bg-primary"
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2 rounded-lg bg-zinc-800/50 p-4 backdrop-blur-sm">
          <h2 className="font-semibold text-primary">Progress</h2>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-700">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000"
              style={{
                width: `${(timeLeft / (isWork ? settings.workDuration : settings.breakDuration) / 60) * 100}%`,
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}