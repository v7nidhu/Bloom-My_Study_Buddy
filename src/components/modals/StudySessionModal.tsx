import React, { useState } from 'react';
import { X, Flame, Clock } from 'lucide-react';
import { StudySession, Subject } from '../../types';

interface StudySessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: Omit<StudySession, 'id'>) => void;
  subjects: Subject[];
}

export const StudySessionModal: React.FC<StudySessionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  subjects
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [subject, setSubject] = useState(subjects[0]?.name || 'General');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [date, setDate] = useState(todayStr);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;

    onSave({
      subject,
      durationMinutes: Number(durationMinutes),
      date,
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] border border-pink-100 shadow-2xl shadow-pink-200/50 w-full max-w-md p-6">
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">Log Study Session</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-pink-50 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
            >
              <option value="General">General Study</option>
              {subjects.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (Minutes)</label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <Clock className="w-4 h-4 absolute right-3 text-pink-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-2">
            {[25, 45, 60, 90, 120].map((mins) => (
              <button
                type="button"
                key={mins}
                onClick={() => setDurationMinutes(mins)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  durationMinutes === mins
                    ? 'bg-pink-500 text-white'
                    : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Session Summary / Topics Covered</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you study or accomplish during this session?"
              className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
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
              Log Study Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
