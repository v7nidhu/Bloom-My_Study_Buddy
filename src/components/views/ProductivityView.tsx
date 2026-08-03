import React from 'react';
import { 
  Flame, 
  Clock, 
  CheckSquare, 
  TrendingUp, 
  Plus, 
  Trash2
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { PomodoroTimer } from '../PomodoroTimer';
import { ThreeDCard } from '../ThreeDBackground';
import { 
  CuteCatBooks, CutePandaCoding, CuteStudyBear, CuteCoffeeMug, 
  CuteMagicStar, CuteGoalBullseye, CutePencilHappy, CuteOwlSmart 
} from '../CuteImages';

interface ProductivityViewProps {
  onOpenModal: (type: 'session') => void;
}

export const ProductivityView: React.FC<ProductivityViewProps> = ({ onOpenModal }) => {
  const { stats, studySessions, deleteStudySession, isReadOnly } = useStudy();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/50 relative overflow-hidden group">
        {/* Cute Mascot Sticker */}
        <div className="absolute right-48 -bottom-1 opacity-90 pointer-events-none select-none hidden lg:block animate-bounce" style={{ animationDuration: '7s' }}>
          <CuteCoffeeMug size={64} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-pink-500 fill-pink-500" />
            <h1 className="text-xl font-bold text-gray-800">Productivity & Study Analytics</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Monitor focus timer, study hours summary, and completed assignments.
          </p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => onOpenModal('session')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-[16px] text-xs font-semibold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-500 cursor-pointer self-start sm:self-auto relative z-10"
          >
            <Plus className="w-4 h-4" />
            <span>Log Study Hours</span>
          </button>
        )}
      </div>

      {/* METRICS SUMMARY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Study Hours Today */}
        <ThreeDCard className="bg-gradient-to-br from-pink-500 to-pink-400 text-white p-5 rounded-[22px] shadow-lg shadow-pink-200/50 space-y-1 h-full">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-100">Today's Focus</span>
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black">
            {Math.floor(stats.totalStudyMinutesToday / 60)}h {stats.totalStudyMinutesToday % 60}m
          </p>
          <p className="text-[11px] text-pink-50 font-medium">Logged today</p>
        </ThreeDCard>

        {/* Weekly Focus */}
        <ThreeDCard className="bg-gradient-to-br from-purple-500 to-purple-400 text-white p-5 rounded-[22px] shadow-lg shadow-purple-200/50 space-y-1 h-full">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-100">Weekly Total</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black">
            {Math.floor(stats.totalStudyMinutesWeek / 60)}h {stats.totalStudyMinutesWeek % 60}m
          </p>
          <p className="text-[11px] text-purple-50 font-medium">This week's study time</p>
        </ThreeDCard>
      </div>

      {/* TWO COLUMNS: Pomodoro Timer & Study Logs History */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* POMODORO TIMER PANEL */}
        <ThreeDCard className="lg:col-span-3 h-full">
          <PomodoroTimer />
        </ThreeDCard>

        {/* RECENT STUDY SESSIONS LOG HISTORY */}
        <ThreeDCard className="lg:col-span-2 bg-white rounded-[28px] border border-pink-100 p-6 shadow-sm shadow-pink-100/40 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-gray-800 text-sm sm:text-base">Study Session Logs</h3>
            {!isReadOnly && (
              <button
                onClick={() => onOpenModal('session')}
                className="text-xs font-bold text-pink-600 hover:underline cursor-pointer"
              >
                + Log Session
              </button>
            )}
          </div>

          {studySessions.length === 0 ? (
            <p className="text-xs text-gray-400 py-8 text-center">No study sessions logged yet.</p>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {studySessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3.5 bg-pink-50/30 rounded-[18px] border border-pink-100 flex items-center justify-between gap-3 hover:bg-pink-50/70 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-gray-800">{session.subject}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                        {session.durationMinutes} mins
                      </span>
                    </div>
                    {session.notes && (
                      <p className="text-[11px] text-gray-600 font-medium mt-1">
                        "{session.notes}"
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">
                      Date: {session.date}
                    </p>
                  </div>

                  {!isReadOnly && (
                    <button
                      onClick={() => deleteStudySession(session.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete Log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ThreeDCard>
      </div>
    </div>
  );
};
