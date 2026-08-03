import React, { useState } from 'react';
import { X, Calendar, Sparkles } from 'lucide-react';
import { CalendarEvent, Subject, ExamCategory } from '../../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'> | CalendarEvent) => void;
  initialData?: CalendarEvent | null;
  subjects: Subject[];
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  subjects
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date || todayStr);
  const [type, setType] = useState<'Exam' | 'Assignment' | 'Quiz' | 'Project' | 'Important'>(initialData?.type || 'Exam');
  const [examCategory, setExamCategory] = useState<ExamCategory>(initialData?.examCategory || 'MST (20 Marks)');
  const [totalMarks, setTotalMarks] = useState<number>(initialData?.totalMarks || 20);
  const [subject, setSubject] = useState(initialData?.subject || (subjects[0]?.name || 'General'));
  const [description, setDescription] = useState(initialData?.description || '');

  const handleCategoryChange = (cat: ExamCategory) => {
    setExamCategory(cat);
    if (cat === 'MST (20 Marks)') setTotalMarks(20);
    else if (cat === 'Final (100 Marks)') setTotalMarks(100);
    else if (cat === 'Quiz / Minor (10-30 Marks)') setTotalMarks(20);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const eventPayload = {
      title: title.trim(),
      date,
      type,
      examCategory: type === 'Exam' ? examCategory : undefined,
      totalMarks: type === 'Exam' ? totalMarks : undefined,
      subject,
      description: description.trim()
    };

    if (initialData) {
      onSave({
        ...initialData,
        ...eventPayload
      });
    } else {
      onSave(eventPayload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] border border-pink-100 shadow-2xl shadow-pink-200/50 w-full max-w-md p-6">
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">
              {initialData ? 'Edit Exam / Event' : 'Add Exam or Calendar Event'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-pink-50 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Event / Exam Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midterm Examination"
              className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Event Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer font-medium text-pink-600"
              >
                <option value="Exam">📝 Exam</option>
                <option value="Quiz">⚡ Quiz</option>
                <option value="Assignment">📂 Assignment</option>
                <option value="Project">🚀 Project Pitch</option>
                <option value="Important">⭐ Important Date</option>
              </select>
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

          {/* Exam Category & Weighting Selector */}
          {type === 'Exam' && (
            <div className="p-3 bg-pink-50/80 border border-pink-200/80 rounded-[16px] space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-900">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>Exam Weighting Category *</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('MST (20 Marks)')}
                  className={`p-2.5 rounded-[12px] border text-left text-xs transition-all cursor-pointer ${
                    examCategory === 'MST (20 Marks)'
                      ? 'bg-pink-600 text-white border-pink-600 font-extrabold shadow-sm'
                      : 'bg-white text-gray-700 border-pink-200 hover:bg-pink-100/50'
                  }`}
                >
                  <div className="font-bold">🎯 MST</div>
                  <div className={`text-[10px] mt-0.5 ${examCategory === 'MST (20 Marks)' ? 'text-pink-100' : 'text-gray-500'}`}>
                    20 Marks (Internal Midterm)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('Final (100 Marks)')}
                  className={`p-2.5 rounded-[12px] border text-left text-xs transition-all cursor-pointer ${
                    examCategory === 'Final (100 Marks)'
                      ? 'bg-pink-600 text-white border-pink-600 font-extrabold shadow-sm'
                      : 'bg-white text-gray-700 border-pink-200 hover:bg-pink-100/50'
                  }`}
                >
                  <div className="font-bold">🎓 Final Exam</div>
                  <div className={`text-[10px] mt-0.5 ${examCategory === 'Final (100 Marks)' ? 'text-pink-100' : 'text-gray-500'}`}>
                    100 Marks (End Semester)
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-pink-800 mb-0.5">Category</label>
                  <select
                    value={examCategory}
                    onChange={(e) => handleCategoryChange(e.target.value as ExamCategory)}
                    className="w-full px-2.5 py-1.5 bg-white border border-pink-200 rounded-lg text-xs font-semibold text-gray-800"
                  >
                    <option value="MST (20 Marks)">MST (20 Marks)</option>
                    <option value="Final (100 Marks)">Final (100 Marks)</option>
                    <option value="Quiz / Minor (10-30 Marks)">Quiz / Minor (10-30 Marks)</option>
                    <option value="Other Exam">Other Exam</option>
                  </select>
                </div>

                <div className="w-24">
                  <label className="block text-[10px] font-bold text-pink-800 mb-0.5">Total Marks</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-pink-200 rounded-lg text-xs font-bold text-gray-800"
                  />
                </div>
              </div>

              <p className="text-[10px] text-pink-700 font-medium leading-tight">
                💡 <em>An adaptive study plan & daily countdown tips will automatically adjust to this exam category!</em>
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Related Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
            >
              <option value="General">General / Academic</option>
              {subjects.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Syllabus / Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Chapters 1 to 5, bring scientific calculator..."
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
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
