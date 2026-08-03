import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Play, 
  Pause, 
  Square,
  RotateCcw, 
  Settings, 
  Coffee, 
  Sparkles, 
  Check, 
  Volume2, 
  VolumeX,
  X,
  Lock
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export const PomodoroTimer: React.FC = () => {
  const { addStudySession, subjects, goals, updateGoal, isReadOnly } = useStudy();

  // Mode settings (durations in minutes)
  const [modeSettings, setModeSettings] = useState<{
    focus: number;
    shortBreak: number;
    longBreak: number;
  }>({
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  });

  const [currentMode, setCurrentMode] = useState<TimerMode>('focus');
  const [timerMins, setTimerMins] = useState<number>(25);
  const [timerSecs, setTimerSecs] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('Pomodoro Focus');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Custom Settings Modal
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [customFocusInput, setCustomFocusInput] = useState<number>(25);
  const [customShortBreakInput, setCustomShortBreakInput] = useState<number>(5);
  const [customLongBreakInput, setCustomLongBreakInput] = useState<number>(15);

  // Full Screen Mode
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const timerContainerRef = useRef<HTMLDivElement>(null);

  const enterFullScreen = async () => {
    if (timerContainerRef.current?.requestFullscreen) {
      try {
        await timerContainerRef.current.requestFullscreen();
      } catch (e) {
        // Fallback
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);



  // Handle mode switches
  const switchMode = (mode: TimerMode) => {
    setIsTimerRunning(false);
    setCurrentMode(mode);
    setTimerMins(modeSettings[mode]);
    setTimerSecs(0);
  };

  // Sync mode duration when settings update
  const applyCustomDurations = (newFocus: number, newShort: number, newLong: number) => {
    const updated = {
      focus: Math.max(1, Math.min(180, newFocus)),
      shortBreak: Math.max(1, Math.min(60, newShort)),
      longBreak: Math.max(1, Math.min(90, newLong))
    };
    setModeSettings(updated);
    setIsTimerRunning(false);
    setTimerMins(updated[currentMode]);
    setTimerSecs(0);
    setShowSettings(false);
  };

  // Sound chime helper using Web Audio API
  const playCompletionChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio playback prevented or unsupported');
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSecs > 0) {
          setTimerSecs((prev) => prev - 1);
        } else if (timerMins > 0) {
          setTimerMins((prev) => prev - 1);
          setTimerSecs(59);
        } else {
          setIsTimerRunning(false);
          playCompletionChime();

          if (currentMode === 'focus') {
            const completedDuration = modeSettings.focus;
            const sessionTag = selectedSubject || 'Pomodoro Focus';

            if (!isReadOnly) {
              addStudySession({
                subject: sessionTag,
                durationMinutes: completedDuration,
                date: new Date().toISOString().split('T')[0],
                notes: `Completed ${completedDuration}-minute Pomodoro focus session`
              });

              // Check if a Study Goal was tagged to update its progress hours
              const targetGoal = goals.find(g => 
                sessionTag === `Goal: ${g.title}` || sessionTag === g.title
              );

              if (targetGoal) {
                const hoursEarned = Math.round((completedDuration / 60) * 100) / 100;
                const updatedHours = Math.round((targetGoal.currentHours + hoursEarned) * 100) / 100;
                const isCompletedNow = updatedHours >= targetGoal.targetHours;

                updateGoal({
                  ...targetGoal,
                  currentHours: updatedHours,
                  completed: isCompletedNow
                });

                alert(`🎉 Focus Session Finished! Logged ${completedDuration} mins & updated goal "${targetGoal.title}" (+${hoursEarned}h! Progress: ${updatedHours}/${targetGoal.targetHours}h)`);
              } else {
                alert(`🎉 Focus Session Finished! Logged ${completedDuration} study minutes.`);
              }
            } else {
              alert(`🎉 Focus Session Finished! (${completedDuration} mins - View-only mode)`);
            }
          } else {
            alert('☕ Break time is over! Ready to focus again?');
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMins, timerSecs, currentMode, modeSettings, selectedSubject, addStudySession, goals, updateGoal, soundEnabled]);



  const totalModeSeconds = modeSettings[currentMode] * 60;
  const currentRemainingSeconds = timerMins * 60 + timerSecs;
  const progressPercent = Math.max(0, Math.min(100, ((totalModeSeconds - currentRemainingSeconds) / totalModeSeconds) * 100));

  return (
    <div
      ref={timerContainerRef}
      className="w-full rounded-[28px] p-6 shadow-md shadow-pink-100/60 border border-pink-200/80 relative transition-all duration-300"
      style={{
        backgroundColor: 'var(--theme-100)',
        backgroundImage: `
          radial-gradient(circle at 10% 20%, var(--theme-200) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, var(--theme-300) 0%, transparent 45%),
          linear-gradient(135deg, var(--theme-100) 0%, var(--theme-200) 40%, var(--theme-50) 100%)
        `
      }}
    >
      {/* Theme SVG Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-50 overflow-hidden rounded-[28px]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="theme-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="2.5" fill="var(--theme-500)" fillOpacity="0.18" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#theme-dots)" />
        </svg>
      </div>

      {isTimerRunning ? (
        /* MINIMALIST ACTIVE RUNNING TIMER STATE */
        <div className="relative z-10 w-full max-w-xl mx-auto py-8 sm:py-12 flex flex-col items-center justify-center text-center space-y-6">

          {/* TIMER DIGIT DISPLAY - Solid Black Color */}
          <div className="py-4">
            <span
              className="text-7xl sm:text-8xl lg:text-9xl font-black text-black tracking-tight inline-block select-none"
              style={{
                color: '#000000',
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontVariantNumeric: 'normal',
                fontFeatureSettings: '"zero" 0'
              }}
            >
              {String(timerMins).padStart(2, '0')}:{String(timerSecs).padStart(2, '0')}
            </span>
            <p className="text-xs font-bold text-pink-800 mt-2">
              Focusing on: <span className="font-extrabold text-pink-950">{selectedSubject}</span>
            </p>
          </div>

          {/* SMALL CONTROL BUTTONS: Pause, Stop, Reset - WHITE COLOR ONLY */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {/* Small Pause Button - White */}
            <button
              onClick={() => setIsTimerRunning(false)}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 border border-pink-200/80 rounded-xl text-xs font-extrabold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
              title="Pause Timer"
            >
              <Pause className="w-3.5 h-3.5 text-pink-600" />
              <span>Pause</span>
            </button>

            {/* Small Stop Button - White */}
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerMins(modeSettings[currentMode]);
                setTimerSecs(0);
              }}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 border border-pink-200/80 rounded-xl text-xs font-extrabold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
              title="Stop Session"
            >
              <Square className="w-3.5 h-3.5 text-pink-600" />
              <span>Stop</span>
            </button>

            {/* Small Reset Button - White */}
            <button
              onClick={() => {
                setTimerMins(modeSettings[currentMode]);
                setTimerSecs(0);
              }}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 border border-pink-200/80 rounded-xl text-xs font-extrabold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
              title="Reset Duration"
            >
              <RotateCcw className="w-3.5 h-3.5 text-pink-600" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      ) : (
        /* SETUP / PAUSED / CONFIGURATION TIMER STATE */
        <div className="relative z-10 w-full">
          {/* TOP BAR CONTROLS */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-pink-500 text-white rounded-2xl shadow-xs">
                <Flame className="w-5 h-5 fill-white" />
              </span>
              <div>
                <h2 className="text-base font-black text-pink-950 tracking-tight">Pomodoro Timer</h2>
                <p className="text-[11px] font-semibold text-pink-800">Customizable focus durations & sessions</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 bg-white/80 hover:bg-white text-pink-700 rounded-xl transition-all shadow-xs cursor-pointer"
                title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-pink-400" />}
              </button>

              {/* Custom Settings Modal Toggle */}
              {!isReadOnly && (
                <button
                  onClick={() => {
                    setCustomFocusInput(modeSettings.focus);
                    setCustomShortBreakInput(modeSettings.shortBreak);
                    setCustomLongBreakInput(modeSettings.longBreak);
                    setShowSettings(true);
                  }}
                  className="p-2 bg-white/80 hover:bg-white text-pink-800 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-extrabold border border-pink-200/60"
                  title="Configure Timer Durations"
                >
                  <Settings className="w-4 h-4 text-pink-600" />
                  <span className="hidden sm:inline">Customize</span>
                </button>
              )}

              {!isFullScreen && (
                <button
                  onClick={enterFullScreen}
                  className="px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-all shadow-md cursor-pointer text-xs font-extrabold"
                  title="Full Screen Focus Mode"
                >
                  <span>Full Screen</span>
                </button>
              )}
            </div>
          </div>

          {/* MODE SELECTOR TABS */}
          <div className="flex items-center justify-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-pink-200/80 shadow-xs mb-6 max-w-md mx-auto">
            <button
              onClick={() => switchMode('focus')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                currentMode === 'focus'
                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-300'
                  : 'text-pink-900 hover:bg-pink-100/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Focus ({modeSettings.focus}m)</span>
            </button>

            <button
              onClick={() => switchMode('shortBreak')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                currentMode === 'shortBreak'
                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-300'
                  : 'text-pink-900 hover:bg-pink-100/60'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Short Break ({modeSettings.shortBreak}m)</span>
            </button>

            <button
              onClick={() => switchMode('longBreak')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                currentMode === 'longBreak'
                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-300'
                  : 'text-pink-900 hover:bg-pink-100/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Long Break ({modeSettings.longBreak}m)</span>
            </button>
          </div>

          {/* MAIN TIMER DISPLAY BOX */}
          <div className="relative bg-white/95 backdrop-blur-md rounded-[24px] border-2 border-pink-200/90 p-8 sm:p-12 shadow-lg text-center overflow-hidden my-4">
            {/* Top Progress bar line */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-pink-100">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* TIMER DIGIT DISPLAY - Solid Black Color */}
            <div className="py-2">
              <span
                className="text-6xl sm:text-7xl lg:text-8xl font-black text-black tracking-tight inline-block select-none"
                style={{
                  color: '#000000',
                  fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontVariantNumeric: 'normal',
                  fontFeatureSettings: '"zero" 0'
                }}
              >
                {String(timerMins).padStart(2, '0')}:{String(timerSecs).padStart(2, '0')}
              </span>
            </div>

            {/* Subject / Study Goal tag selector for logging */}
            {currentMode === 'focus' && (
              <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 bg-pink-50 rounded-xl border border-pink-200/70 text-xs font-semibold text-pink-900">
                <span className="text-pink-500 font-bold">Course / Goal Tag:</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-transparent font-bold text-pink-950 outline-none cursor-pointer max-w-xs truncate"
                >
                  <option value="Pomodoro Focus">General Focus</option>
                  <optgroup label="Subjects">
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.code} - {sub.name}
                      </option>
                    ))}
                  </optgroup>
                  {goals.length > 0 && (
                    <optgroup label="Study Goals">
                      {goals.map((goal) => (
                        <option key={`goal-${goal.id}`} value={`Goal: ${goal.title}`}>
                          🎯 {goal.title} ({goal.currentHours}/{goal.targetHours}h)
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            )}

            {/* PRESET DURATION BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider mr-1">Quick Presets:</span>
              {[10, 15, 25, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  disabled={isReadOnly}
                  onClick={() => {
                    if (isReadOnly) return;
                    setIsTimerRunning(false);
                    setModeSettings((prev) => ({ ...prev, [currentMode]: mins }));
                    setTimerMins(mins);
                    setTimerSecs(0);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                    isReadOnly
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : timerMins === mins && timerSecs === 0 && !isTimerRunning
                      ? 'bg-pink-600 text-white shadow-xs scale-105 cursor-pointer'
                      : 'bg-pink-100/70 text-pink-900 hover:bg-pink-200/80 cursor-pointer'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* TIMER ACTION BUTTONS */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {isReadOnly ? (
              <div className="flex items-center gap-2 px-5 py-3.5 bg-amber-100/90 text-amber-950 border border-amber-300 rounded-2xl text-xs font-extrabold shadow-xs">
                <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Focus Session & Timer Controls Locked (View-Only Mode)</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsTimerRunning(true)}
                  className="flex-1 max-w-xs py-3.5 px-6 rounded-2xl text-sm font-black text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-200"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Focus Session</span>
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerMins(modeSettings[currentMode]);
                    setTimerSecs(0);
                  }}
                  className="p-3.5 bg-white/80 hover:bg-white text-pink-700 rounded-2xl transition-all shadow-xs cursor-pointer border border-pink-200/80"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CUSTOM DURATION SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-pink-200 p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-pink-500" />
                <h3 className="text-base font-extrabold text-gray-900">Customize Timer Durations</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Enter your desired focus and break durations in minutes:
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">
                  Focus Mode Duration (Minutes):
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={customFocusInput}
                  onChange={(e) => setCustomFocusInput(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-sm font-bold text-gray-800 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">
                  Short Break Duration (Minutes):
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customShortBreakInput}
                  onChange={(e) => setCustomShortBreakInput(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-sm font-bold text-gray-800 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">
                  Long Break Duration (Minutes):
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={customLongBreakInput}
                  onChange={(e) => setCustomLongBreakInput(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-sm font-bold text-gray-800 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-pink-100">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => applyCustomDurations(customFocusInput, customShortBreakInput, customLongBreakInput)}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Durations</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
