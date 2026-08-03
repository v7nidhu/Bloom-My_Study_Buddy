import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { Subject } from '../../types';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subject: Omit<Subject, 'id'> | Subject) => void;
  initialData?: Subject | null;
}

const PASTEL_COLORS = [
  '#F8BBD0', // Pastel Pink
  '#F48FB1', // Rose Pink
  '#F8C8DC', // Soft Pink
  '#FFCDD2', // Soft Coral Pink
  '#E1BEE7', // Soft Lavender Pink
  '#FFE0B2', // Soft Peach
  '#C8E6C9', // Soft Mint
  '#B3E5FC', // Soft Powder Blue
];

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(initialData?.name || '');
  const [code, setCode] = useState(initialData?.code || '');
  const [color, setColor] = useState(initialData?.color || PASTEL_COLORS[0]);
  const [totalTopics, setTotalTopics] = useState(initialData?.totalTopics || 10);
  const [completedTopics, setCompletedTopics] = useState(initialData?.completedTopics || 0);
  const [targetGrade, setTargetGrade] = useState(initialData?.targetGrade || 'O');
  const [credits, setCredits] = useState(initialData?.credits || 3);
  const [instructor, setInstructor] = useState(initialData?.instructor || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (initialData) {
      onSave({
        ...initialData,
        name: name.trim(),
        code: code.trim(),
        color,
        totalTopics: Number(totalTopics),
        completedTopics: Number(completedTopics),
        targetGrade,
        credits: Number(credits),
        instructor: instructor.trim()
      });
    } else {
      onSave({
        name: name.trim(),
        code: code.trim(),
        color,
        totalTopics: Number(totalTopics),
        completedTopics: Number(completedTopics),
        targetGrade,
        credits: Number(credits),
        instructor: instructor.trim()
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] border border-pink-100 shadow-2xl shadow-pink-200/50 w-full max-w-md p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">
              {initialData ? 'Edit Subject' : 'Add New Subject'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-pink-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Subject Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Data Structures & Algorithms"
              className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Course Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS201"
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Credits</label>
              <input
                type="number"
                min="1"
                max="10"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Total Topics</label>
              <input
                type="number"
                min="1"
                value={totalTopics}
                onChange={(e) => setTotalTopics(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Completed Topics</label>
              <input
                type="number"
                min="0"
                max={totalTopics}
                value={completedTopics}
                onChange={(e) => setCompletedTopics(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Target Grade</label>
            <select
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
            >
              {['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Instructor / Professor</label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="e.g. Dr. Sarah Lin"
              className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pastel Theme Color</label>
            <div className="flex items-center gap-2">
              {PASTEL_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                    color === c ? 'border-pink-600 scale-110 shadow-sm' : 'border-white'
                  }`}
                />
              ))}
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
              className="px-5 py-2 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white rounded-[14px] text-xs font-semibold shadow-md shadow-pink-200 cursor-pointer"
            >
              Save Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
