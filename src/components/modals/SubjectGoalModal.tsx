import React, { useState, useEffect } from 'react';
import { X, Target, Sparkles } from 'lucide-react';
import { SubjectGoal } from '../../types';

interface SubjectGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectName?: string;
  onSave: (goal: Omit<SubjectGoal, 'id'> | SubjectGoal) => void;
  initialData?: SubjectGoal | null;
}

const PRESET_GOALS = [
  { title: 'Complete Chapter 5', targetValue: 5, unit: 'chapters' },
  { title: 'Score 90% on next test', targetValue: 90, unit: '%' },
  { title: 'Solve 30 practice problems', targetValue: 30, unit: 'problems' },
  { title: 'Complete all lab assignments', targetValue: 100, unit: '%' },
];

export const SubjectGoalModal: React.FC<SubjectGoalModalProps> = ({
  isOpen,
  onClose,
  subjectName,
  onSave,
  initialData
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState(5);
  const [currentValue, setCurrentValue] = useState(0);
  const [unit, setUnit] = useState('chapters');
  const [deadline, setDeadline] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setTargetValue(initialData.targetValue || 5);
      setCurrentValue(initialData.currentValue || 0);
      setUnit(initialData.unit || 'chapters');
      setDeadline(initialData.deadline || '');
      setCompleted(initialData.completed || false);
    } else {
      setTitle('');
      setTargetValue(5);
      setCurrentValue(0);
      setUnit('chapters');
      setDeadline('');
      setCompleted(false);
    }
  }, [initialData, isOpen]);

  const handleApplyPreset = (preset: typeof PRESET_GOALS[0]) => {
    setTitle(preset.title);
    setTargetValue(preset.targetValue);
    setUnit(preset.unit);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetNum = Number(targetValue) || 1;
    const currentNum = Number(currentValue) || 0;
    const isDone = completed || currentNum >= targetNum;

    if (initialData) {
      onSave({
        ...initialData,
        title: title.trim(),
        targetValue: targetNum,
        currentValue: currentNum,
        unit: unit.trim() || 'units',
        deadline: deadline || undefined,
        completed: isDone,
      });
    } else {
      onSave({
        title: title.trim(),
        targetValue: targetNum,
        currentValue: currentNum,
        unit: unit.trim() || 'units',
        deadline: deadline || undefined,
        completed: isDone,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] border border-[#F8BBD0] shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#FCE4EC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FCE4EC] text-[#F06292] flex items-center justify-center font-bold">
              <Target className="w-5 h-5 text-[#F06292]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-base">
                {initialData ? 'Edit Subject Goal' : 'Add Subject Goal'}
              </h2>
              {subjectName && (
                <p className="text-xs text-[#F06292] font-semibold">{subjectName}</p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-[#FCE4EC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset suggestions for quick selection */}
        {!initialData && (
          <div className="mt-3 bg-[#FFF0F5] p-3 rounded-[16px] border border-[#F8BBD0]/50">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F06292] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Goal Ideas</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_GOALS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 bg-white hover:bg-[#FCE4EC] text-gray-700 hover:text-[#F06292] border border-[#F8BBD0] rounded-full text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  + {preset.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Goal Objective *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Chapter 5, Score 90% on next test"
              className="w-full px-3.5 py-2.5 bg-white border border-[#F8BBD0] rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Target Value *
              </label>
              <input
                type="number"
                min="1"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                placeholder="e.g. 5, 90, 100"
                className="w-full px-3.5 py-2.5 bg-white border border-[#F8BBD0] rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F8BBD0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Current Progress
              </label>
              <input
                type="number"
                min="0"
                value={currentValue}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
                placeholder="e.g. 0, 3, 85"
                className="w-full px-3.5 py-2.5 bg-white border border-[#F8BBD0] rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F8BBD0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Unit / Measurement
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#F8BBD0] rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] cursor-pointer"
              >
                <option value="chapters">chapters</option>
                <option value="%">% (score / percentage)</option>
                <option value="topics">topics</option>
                <option value="problems">problems</option>
                <option value="tests">tests / quizzes</option>
                <option value="hours">hours</option>
                <option value="assignments">assignments</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Target Deadline (Optional)
              </label>
              <input
                type="date"
                min={todayStr}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#F8BBD0] rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F8BBD0] cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="goalCompleted"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-4 h-4 text-[#F06292] rounded focus:ring-[#F8BBD0] cursor-pointer"
            />
            <label htmlFor="goalCompleted" className="text-xs font-medium text-gray-700 cursor-pointer">
              Mark goal as completed
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#FCE4EC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-[14px] text-xs font-bold hover:bg-gray-200 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#F8BBD0] hover:bg-[#F06292] text-white rounded-[14px] text-xs font-bold shadow-xs cursor-pointer transition-all"
            >
              {initialData ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
