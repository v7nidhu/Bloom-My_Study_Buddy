import React from 'react';
import { Target, Plus, Trash2, Edit2, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { StudyGoal } from '../../types';
import { ThreeDCard } from '../ThreeDBackground';
import { CuteStudyBear, CuteCoffeeMug, CuteMagicStar, CuteOwlSmart, CuteGoalBullseye } from '../CuteImages';

interface StudyGoalsViewProps {
  onOpenModal: (type: 'goal', initialData?: StudyGoal) => void;
}

export const StudyGoalsView: React.FC<StudyGoalsViewProps> = ({ onOpenModal }) => {
  const { goals, deleteGoal, toggleGoalCompleted, isReadOnly } = useStudy();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/50 relative overflow-hidden group">
        {/* Cute Mascot Sticker */}
        <div className="absolute right-48 -bottom-1 opacity-90 pointer-events-none select-none hidden lg:block animate-bounce" style={{ animationDuration: '7s' }}>
          <CuteGoalBullseye size={64} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-pink-500" />
            <h1 className="text-xl font-bold text-gray-800">Study Goals</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Set daily, weekly, and monthly target hours for revision and exam prep.
          </p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => onOpenModal('goal')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-[16px] text-xs font-semibold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-500 cursor-pointer self-start sm:self-auto relative z-10"
          >
            <Plus className="w-4 h-4" />
            <span>New Study Goal</span>
          </button>
        )}
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full bg-white rounded-[22px] border border-dashed border-pink-200 p-12 text-center">
            <Target className="w-10 h-10 text-pink-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700">No study goals set</h3>
            <p className="text-xs text-gray-400 mt-1">Set target hours for study topics to keep yourself accountable.</p>
            {!isReadOnly && (
              <button
                onClick={() => onOpenModal('goal')}
                className="mt-4 px-4 py-2 bg-pink-50 text-pink-600 rounded-[14px] text-xs font-bold hover:bg-pink-100 cursor-pointer"
              >
                + Create Goal
              </button>
            )}
          </div>
        ) : (
          goals.map((g) => {
            const percentage = Math.min(100, Math.round((g.currentHours / g.targetHours) * 100)) || 0;
            const isFinished = g.completed || g.currentHours >= g.targetHours;

            const getGoalSticker = () => {
              if (isFinished) return <CuteMagicStar size={48} className="absolute right-3.5 top-14 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />;
              if (g.category === 'Daily') return <CuteCoffeeMug size={48} className="absolute right-3.5 top-14 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />;
              if (g.category === 'Weekly') return <CuteStudyBear size={48} className="absolute right-3.5 top-14 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />;
              return <CuteOwlSmart size={48} className="absolute right-3.5 top-14 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />;
            };

            return (
              <ThreeDCard
                key={g.id}
                className={`bg-white rounded-[24px] border border-pink-100 shadow-sm p-5 flex flex-col justify-between h-full relative group ${
                  isFinished ? 'bg-pink-50/10' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700">
                      {g.category} Goal
                    </span>

                    {!isReadOnly && (
                      <div className="flex items-center gap-1 z-10">
                        <button
                          onClick={() => onOpenModal('goal', g)}
                          className="p-1.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg cursor-pointer"
                          title="Edit Goal"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteGoal(g.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                  </div>

                  {getGoalSticker()}

                  <div className="flex items-start gap-2.5 mb-3">
                    <button
                      onClick={() => { if (!isReadOnly) toggleGoalCompleted(g.id); }}
                      disabled={isReadOnly}
                      className={`mt-0.5 text-pink-500 shrink-0 z-10 ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'hover:text-pink-600 cursor-pointer'}`}
                    >
                      <CheckCircle2 className={`w-5 h-5 ${isFinished ? 'fill-pink-500 text-white' : 'text-pink-300'}`} />
                    </button>
                    <h3 className={`text-sm font-bold text-gray-800 pr-12 ${isFinished ? 'line-through text-gray-400' : ''}`}>
                      {g.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mb-4">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <span>Target Date: {g.deadline}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-pink-100/80">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-700">{g.currentHours} / {g.targetHours} Hours</span>
                    <span className="text-pink-600">{percentage}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-pink-100/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </ThreeDCard>
            );
          })
        )}
      </div>
    </div>
  );
};
