import React, { useState, useEffect } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { TimetableSlot, DayOfWeek, Subject } from '../../types';

interface TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slot: Omit<TimetableSlot, 'id'> | TimetableSlot) => void;
  initialData?: TimetableSlot | null;
  subjects: Subject[];
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const TimetableModal: React.FC<TimetableModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  subjects
}) => {
  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [subjectName, setSubjectName] = useState('');
  const [customName, setCustomName] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [type, setType] = useState<'Lecture' | 'Lab' | 'Tutorial' | 'Self Study'>('Lecture');

  useEffect(() => {
    if (isOpen) {
      setDay(initialData?.day || 'Monday');
      setStartTime((initialData && 'startTime' in initialData) ? initialData.startTime : '09:00');
      setEndTime((initialData && 'endTime' in initialData) ? initialData.endTime : '10:30');
      
      const initSubName = (initialData && 'subjectName' in initialData && initialData.subjectName) 
        ? initialData.subjectName 
        : (subjects[0]?.name || 'Study Session');
      setSubjectName(initSubName);

      const isSubCustom = subjects.length === 0 || (
        initialData && 'subjectName' in initialData && initialData.subjectName 
          ? !subjects.some(s => s.name === initialData.subjectName) 
          : false
      );
      setUseCustom(isSubCustom);
      setCustomName(isSubCustom ? (initialData?.subjectName || '') : '');
      setType((initialData && 'type' in initialData) ? initialData.type || 'Lecture' : 'Lecture');
    }
  }, [isOpen, initialData, subjects]);

  if (!isOpen) return null;

  const finalSubjectName = useCustom ? customName : subjectName;
  const selectedSubject = subjects.find(s => s.name === finalSubjectName);
  const subjectColor = selectedSubject ? selectedSubject.color : '#F8BBD0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToSave = finalSubjectName.trim();
    if (!nameToSave) return;

    if (initialData) {
      onSave({
        ...initialData,
        day,
        startTime,
        endTime,
        subjectName: nameToSave,
        subjectColor,
        type
      });
    } else {
      onSave({
        day,
        startTime,
        endTime,
        subjectName: nameToSave,
        subjectColor,
        type
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
              <CalendarDays className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">
              {initialData ? 'Edit Timetable Class' : 'Add Class / Schedule Slot'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-pink-50 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Subject / Class *</label>
            {subjects.length > 0 ? (
              <div className="space-y-2">
                <select
                  value={useCustom ? '__custom__' : subjectName}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setUseCustom(true);
                    } else {
                      setUseCustom(false);
                      setSubjectName(e.target.value);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-pink-200 hover:border-pink-300 focus:border-pink-400 rounded-[14px] text-xs text-pink-700 font-bold focus:outline-none focus:ring-2 focus:ring-pink-100 cursor-pointer shadow-3xs"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.name} className="bg-white text-pink-700 font-semibold">{s.name}</option>
                  ))}
                  <option value="__custom__" className="bg-white text-pink-700 font-semibold">✏️ Custom Session / Other...</option>
                </select>

                {useCustom && (
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter custom session or class name"
                    className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                )}
              </div>
            ) : (
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Data Structures & Algorithms"
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Day of Week</label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
              >
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Session Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
              >
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Self Study">Self Study</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
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
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
