import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { StudyGoal } from '../../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<StudyGoal, 'id'> | StudyGoal) => void;
  initialData?: StudyGoal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState(initialData?.title || '');
  const [targetHours, setTargetHours] = useState(initialData?.targetHours || 10);
  const [currentHours, setCurrentHours] = useState(initialData?.currentHours || 0);
  const [deadline, setDeadline] = useState(initialData?.deadline || todayStr);
  const [category, setCategory] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Exam Prep'>(initialData?.category || 'Weekly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialData) {
      onSave({
        ...initialData,
        title: title.trim(),
        targetHours: Number(targetHours),
        currentHours: Number(currentHours),
        deadline,
        category,
        completed: Number(currentHours) >= Number(targetHours)
      });
    } else {
      onSave({
        title: title.trim(),
        targetHours: Number(targetHours),
        currentHours: Number(currentHours),
        deadline,
        category,
        completed: Number(currentHours) >= Number(targetHours)
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] border border-pink-100 shadow-2xl shadow-pink-200/50 w-full max-w-md p-6">
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">
              {initialData ? 'Edit Study Goal' : 'Set New Study Goal'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-pink-50 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Goal Objective *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Graph Algorithms & Trees"
              className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Goal Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
              >
                <option value="Daily">Daily Goal</option>
                <option value="Weekly">Weekly Goal</option>
                <option value="Monthly">Monthly Goal</option>
                <option value="Exam Prep">Exam Prep Goal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Hours</label>
              <input
                type="number"
                min="1"
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Completed Hours</label>
              <input
                type="number"
                min="0"
                value={currentHours}
                onChange={(e) => setCurrentHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-[14px] text-xs font-semibold hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-[14px] text-xs font-semibold shadow-md shadow-pink-200 cursor-pointer"
            >
              Save Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
