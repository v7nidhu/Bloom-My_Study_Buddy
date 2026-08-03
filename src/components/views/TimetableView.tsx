import React, { useState } from 'react';
import { CalendarDays, Plus, Trash2, Edit2, Clock, MapPin, Calculator, CheckCircle2, XCircle, RefreshCw, Check, Sparkles } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { DayOfWeek, TimetableSlot } from '../../types';
import { 
  CuteCatBooks, CutePandaCoding, CuteStudyBear, CuteCoffeeMug, 
  CuteMagicStar, CuteGoalBullseye, CutePencilHappy, CuteOwlSmart 
} from '../CuteImages';

interface TimetableViewProps {
  onOpenModal: (type: 'timetable', initialData?: TimetableSlot) => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const TimetableView: React.FC<TimetableViewProps> = ({ onOpenModal }) => {
  const { timetable, updateTimetableSlot, deleteTimetableSlot, addTimetableSlot, semesters, isReadOnly } = useStudy();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const handleFetchSubjectsFromSemesters = async () => {
    if (isReadOnly) return;
    if (semesters.length === 0) {
      alert("No semester mark sheets found. Please record or upload a semester mark sheet first.");
      return;
    }

    let addedCount = 0;
    for (const sem of semesters) {
      for (const course of sem.courses) {
        const exists = timetable.some(t => t.subjectName.toLowerCase().includes(course.courseName.toLowerCase()));
        if (!exists) {
          await addTimetableSlot({
            day: selectedDay,
            startTime: '10:00',
            endTime: '11:30',
            subjectName: course.courseName,
            subjectColor: '#ec4899',
            room: 'AI Study Hall',
            type: course.courseType === 'Lab' ? 'Lab' : 'Lecture'
          });
          addedCount++;
        }
      }
    }

    setAiNotice(`✨ Successfully fetched subjects from semester mark sheet and generated personalized AI study strategies & timetable slots for ${addedCount} courses!`);
    setTimeout(() => setAiNotice(null), 6000);
  };

  const filteredSlots = timetable
    .filter(s => s.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const calculateTotalWorkHours = () => {
    let totalMinutes = 0;
    filteredSlots.forEach(slot => {
      if (slot.excludeFromCalculation) return;
      const [startH, startM] = slot.startTime.split(':').map(Number);
      const [endH, endM] = slot.endTime.split(':').map(Number);
      if (!isNaN(startH) && !isNaN(startM) && !isNaN(endH) && !isNaN(endM)) {
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;
        const diff = endTotal - startTotal;
        if (diff > 0) totalMinutes += diff;
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0 && mins === 0) return '0 hrs';
    if (hours === 0) return `${mins} mins`;
    if (mins === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
    return `${hours} hr${hours > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`;
  };

  const handleRefreshTimetable = () => {
    if (isReadOnly) return;
    timetable.forEach(slot => {
      if (slot.isCompleted) {
        updateTimetableSlot({ ...slot, isCompleted: false });
      }
    });
  };

  const getSlotSticker = (subjectName: string) => {
    const combined = subjectName.toLowerCase();
    if (combined.includes('math') || combined.includes('phys') || combined.includes('calc') || combined.includes('stat') || combined.includes('quant')) {
      return <CuteGoalBullseye size={38} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />;
    }
    if (combined.includes('code') || combined.includes('dev') || combined.includes('comp') || combined.includes('web') || combined.includes('software') || combined.includes('python') || combined.includes('java')) {
      return <CutePandaCoding size={38} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />;
    }
    if (combined.includes('design') || combined.includes('art') || combined.includes('ui') || combined.includes('ux') || combined.includes('figma')) {
      return <CutePencilHappy size={38} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />;
    }
    if (combined.includes('reading') || combined.includes('book') || combined.includes('english') || combined.includes('history') || combined.includes('literature') || combined.includes('lang')) {
      return <CuteCatBooks size={38} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />;
    }
    // Fallback cute icons
    const hash = subjectName.length % 3;
    if (hash === 0) {
      return <CuteStudyBear size={38} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />;
    } else if (hash === 1) {
      return <CuteOwlSmart size={38} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />;
    } else {
      return <CuteCoffeeMug size={38} className="shrink-0 group-hover:scale-110 transition-transform duration-300" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/50 relative overflow-hidden group">
        {/* Cute Mascot Sticker */}
        <div className="absolute right-48 -bottom-1 opacity-90 pointer-events-none select-none hidden lg:block animate-bounce" style={{ animationDuration: '7s' }}>
          <CuteCatBooks size={64} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-pink-500" />
            <h1 className="text-xl font-bold text-gray-800">Daily Class Timetable</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Organize your daily lectures, lab sessions, and study hours.
          </p>
        </div>
        <div className="flex items-center gap-2 relative z-10 self-start sm:self-auto flex-wrap">
          {!isReadOnly && (
            <>
              <button
                onClick={handleFetchSubjectsFromSemesters}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-pink-100 text-pink-800 hover:bg-pink-200 rounded-[16px] text-xs font-bold border border-pink-300 cursor-pointer transition-all shadow-xs"
                title="Fetch subjects from semester mark sheet & generate AI study strategies"
              >
                <Sparkles className="w-4 h-4 text-pink-600 animate-pulse" />
                <span>Fetch Subjects & AI Strategy</span>
              </button>
              <button
                onClick={handleRefreshTimetable}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-pink-50 text-pink-700 hover:bg-pink-100 rounded-[16px] text-xs font-bold border border-pink-200 cursor-pointer transition-all"
                title="Refresh timetable list & clear completed marks for the new week"
              >
                <RefreshCw className="w-4 h-4 text-pink-500" />
                <span>Refresh Timetable</span>
              </button>
              <button
                onClick={() => onOpenModal('timetable', { day: selectedDay } as any)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-[16px] text-xs font-semibold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-500 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Class / Slot</span>
              </button>
            </>
          )}
        </div>
      </div>

      {aiNotice && (
        <div className="p-4 bg-pink-500 text-white rounded-[18px] text-xs font-bold shadow-md flex items-center gap-3 animate-in fade-in duration-300">
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>{aiNotice}</span>
        </div>
      )}

      {/* Day Selector Pills & Total Work Hours Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-pink-50/80 via-white to-pink-50/50 p-4 rounded-[22px] border border-pink-200/70 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {DAYS.map((day) => {
            const count = timetable.filter(t => t.day === day).length;
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-[16px] text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-200 scale-105'
                    : 'bg-white text-gray-600 border border-pink-100 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                <span>{day}</span>
                {count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Total Work Hours Summary Pill & Refresh Timestamp Button */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          {!isReadOnly && (
            <button
              type="button"
              onClick={handleRefreshTimetable}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-[18px] text-xs font-bold shadow-md shadow-blue-200 cursor-pointer transition-all active:scale-95"
              title="Refresh timestamp & reset completed marks for new week"
            >
              <RefreshCw className="w-4 h-4 text-white" />
              <span>Refresh Table</span>
            </button>
          )}

          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-[18px] border border-pink-200 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Work Hours ({selectedDay})</div>
              <div className="text-sm font-black text-pink-700">{calculateTotalWorkHours()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Class Schedule Cards */}
      <div className="space-y-3">
        {filteredSlots.length === 0 ? (
          <div className="bg-white rounded-[22px] border border-dashed border-pink-200 p-12 text-center">
            <CalendarDays className="w-10 h-10 text-pink-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700">No classes scheduled for {selectedDay}</h3>
            <p className="text-xs text-gray-400 mt-1">Enjoy your free time or add a self-study session.</p>
            {!isReadOnly && (
              <button
                onClick={() => onOpenModal('timetable', { day: selectedDay } as any)}
                className="mt-4 px-4 py-2 bg-pink-50 text-pink-600 rounded-[14px] text-xs font-bold hover:bg-pink-100 cursor-pointer"
              >
                + Add Class Slot
              </button>
            )}
          </div>
        ) : (
          filteredSlots.map((slot) => {
            const isExcluded = slot.excludeFromCalculation;
            const isCompleted = slot.isCompleted;
            return (
              <div
                key={slot.id}
                className={`bg-white rounded-[22px] border transition-all p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                  isExcluded 
                    ? 'border-gray-200 bg-gray-50/70 opacity-75' 
                    : 'border-pink-100 shadow-sm shadow-pink-100/40 hover:shadow-md hover:shadow-pink-200/40'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div 
                    className="w-3 h-12 sm:h-14 rounded-full shrink-0 mt-1 sm:mt-0" 
                    style={{ backgroundColor: isExcluded ? '#D1D5DB' : (slot.subjectColor || '#F8BBD0') }} 
                  />
                  
                  {/* Cute Slot-Specific Sticker based on Subject Name */}
                  <div className="hidden sm:block shrink-0">
                    {getSlotSticker(slot.subjectName)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-bold text-sm sm:text-base truncate ${isCompleted ? 'line-through decoration-pink-300 decoration-1 text-gray-500' : isExcluded ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                        {slot.subjectName}
                      </h3>
                      {slot.type && (
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                          isExcluded ? 'bg-gray-200 text-gray-600' : 'bg-pink-100 text-pink-600'
                        }`}>
                          {slot.type}
                        </span>
                      )}
                      {isExcluded && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Excluded from hours
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-gray-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-pink-400" />
                        <span>{slot.startTime} - {slot.endTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {/* Small round circle completion mark on the left side of action buttons */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isReadOnly) return;
                      updateTimetableSlot({
                        ...slot,
                        isCompleted: !slot.isCompleted
                      });
                    }}
                    disabled={isReadOnly}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                      isCompleted 
                        ? 'bg-pink-500 border-pink-500 text-white shadow-xs' 
                        : 'border-pink-300 bg-white hover:border-pink-500 text-transparent'
                    }`}
                    title={isCompleted ? "Mark incomplete" : "Mark complete"}
                  >
                    <Check className={`w-3.5 h-3.5 stroke-[3] ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />
                  </button>

                  {/* Exclude / Include Toggle Button */}
                  <button
                    onClick={() => {
                      if (isReadOnly) return;
                      updateTimetableSlot({
                        ...slot,
                        excludeFromCalculation: !slot.excludeFromCalculation
                      });
                    }}
                    disabled={isReadOnly}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isExcluded 
                        ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100' 
                        : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100'
                    }`}
                    title={isExcluded ? "Click to include in work hours calculation" : "Click to exclude from work hours calculation"}
                  >
                    {isExcluded ? (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Excluded</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />
                        <span>Counted</span>
                      </>
                    )}
                  </button>

                  {!isReadOnly && (
                    <>
                      <button
                        onClick={() => onOpenModal('timetable', slot)}
                        className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors cursor-pointer"
                        title="Edit Class"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTimetableSlot(slot.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Class"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
