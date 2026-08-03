import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, Edit2, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, Clock, Flame, BookOpen, Star, Smile } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { CalendarEvent, DailyReflection } from '../../types';
import { getExamAdaptivePlan } from '../../utils/examPlan';
import { 
  CuteCatBooks, CutePandaCoding, CuteStudyBear, CuteCoffeeMug, 
  CuteMagicStar, CuteGoalBullseye, CutePencilHappy, CuteOwlSmart 
} from '../CuteImages';

interface CalendarViewProps {
  onOpenModal: (type: 'event', initialData?: CalendarEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onOpenModal }) => {
  const { events, deleteEvent, setActiveTab, dailyReflections, saveDailyReflection, isReadOnly } = useStudy();
  const [currentDate, setCurrentDate] = useState(new Date());

  const todayStr = new Date().toISOString().split('T')[0];
  const [reflectionDate, setReflectionDate] = useState<string>(todayStr);
  const [reflectionNotes, setReflectionNotes] = useState<string>('');
  const [reflectionRating, setReflectionRating] = useState<number>(5);
  const [reflectionMood, setReflectionMood] = useState<'Productive' | 'Focused' | 'Tired' | 'Stressed' | 'Confident'>('Productive');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    const existing = dailyReflections[reflectionDate];
    if (existing) {
      setReflectionNotes(existing.notes || '');
      setReflectionRating(existing.rating || 5);
      setReflectionMood(existing.mood || 'Productive');
    } else {
      setReflectionNotes('');
      setReflectionRating(5);
      setReflectionMood('Productive');
    }
  }, [reflectionDate, dailyReflections]);

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveDailyReflection({
      date: reflectionDate,
      notes: reflectionNotes,
      rating: reflectionRating,
      mood: reflectionMood
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Filter exams specifically for adaptive planning
  const examEvents = events.filter(e => e.type === 'Exam');

  // Build calendar matrix
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarDays.push({
      dayNumber: day,
      dateStr: formattedDate,
      dayEvents: events.filter(e => e.date === formattedDate)
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/50 relative overflow-hidden group">
        {/* Cute Mascot Sticker */}
        <div className="absolute right-48 -bottom-1 opacity-90 pointer-events-none select-none hidden lg:block animate-bounce" style={{ animationDuration: '7s' }}>
          <CuteMagicStar size={64} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-pink-500" />
            <h1 className="text-xl font-bold text-gray-800">Exams & Calendar</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Keep track of midterm exams, assignment deadlines, and quiz dates.
          </p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => onOpenModal('event')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-[16px] text-xs font-semibold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-500 cursor-pointer self-start sm:self-auto relative z-10"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exam / Event</span>
          </button>
        )}
      </div>

      {/* Calendar Navigation Header */}
      <div className="bg-white rounded-[24px] border border-pink-100 shadow-sm shadow-pink-100/40 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-gray-800">{monthName}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 rounded-xl bg-pink-100 text-pink-700 text-xs font-bold hover:bg-pink-200 transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Row */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-pink-500 uppercase tracking-wider">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((cell, idx) => {
            if (!cell) {
              return <div key={`empty-${idx}`} className="h-24 sm:h-28 bg-gray-50/30 rounded-[16px]" />;
            }

            const isToday = cell.dateStr === new Date().toISOString().split('T')[0];
            const hasReflection = dailyReflections[cell.dateStr];

            return (
              <div
                key={cell.dateStr}
                onClick={() => setReflectionDate(cell.dateStr)}
                className={`h-24 sm:h-28 p-1.5 sm:p-2 rounded-[16px] border transition-all flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isToday 
                    ? 'bg-pink-50/70 border-pink-300 ring-2 ring-pink-300/50' 
                    : 'bg-white border-pink-100/80 hover:bg-pink-50/30'
                }`}
                title="Click to view/edit reflection for this date"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-pink-500 text-white' : 'text-gray-700'
                  }`}>
                    {cell.dayNumber}
                  </span>
                  <div className="flex items-center gap-1">
                    {hasReflection && (
                      <span className="text-[9px] font-bold px-1 py-0.2 bg-amber-100 text-amber-700 rounded-full" title={`Reflection: ${hasReflection.mood} (${hasReflection.rating}★)`}>
                        ✨
                      </span>
                    )}
                    {cell.dayEvents.length > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-pink-100 text-pink-600 rounded-full">
                        {cell.dayEvents.length}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1 mt-1 scrollbar-none">
                  {cell.dayEvents.map(ev => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenModal('event', ev);
                      }}
                      className={`p-1 rounded-md text-[9px] font-bold truncate cursor-pointer hover:opacity-90 ${
                        ev.type === 'Exam' ? 'bg-red-100 text-red-700' : 'bg-pink-100 text-pink-700'
                      }`}
                      title={`${ev.title} (${ev.type})`}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DAILY PROGRESS REFLECTION CARD */}
      <div className="bg-white rounded-[24px] border border-pink-100 p-6 shadow-sm shadow-pink-100/40 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-800">Daily Progress Reflection & Mood Tracker</h2>
              <p className="text-xs text-gray-500">Record your daily study reflection, energy mood, and focus rating.</p>
            </div>
          </div>
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full animate-fade-in">
              ✓ Reflection Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveReflection} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                value={reflectionDate}
                onChange={(e) => setReflectionDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Daily Mood</label>
              <select
                value={reflectionMood}
                onChange={(e) => setReflectionMood(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer font-medium"
              >
                <option value="Productive">🚀 Productive</option>
                <option value="Focused">🎯 Focused</option>
                <option value="Tired">🔋 Tired</option>
                <option value="Stressed">🌧️ Stressed</option>
                <option value="Confident">⭐ Confident</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Productivity Rating (1-5)</label>
              <div className="flex items-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReflectionRating(star)}
                    className="p-1 cursor-pointer focus:outline-none"
                  >
                    <Star className={`w-5 h-5 ${star <= reflectionRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                  </button>
                ))}
                <span className="text-xs font-extrabold text-gray-700 ml-2">{reflectionRating}/5</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Daily Reflection Notes & Takeaways</label>
            <textarea
              rows={3}
              value={reflectionNotes}
              onChange={(e) => setReflectionNotes(e.target.value)}
              placeholder="What did you learn today? Any challenges overcome or goals achieved?"
              className="w-full px-3.5 py-2.5 bg-white border border-pink-200 rounded-[16px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium placeholder-gray-400"
            />
          </div>

          {!isReadOnly && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-[14px] text-xs font-bold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-500 cursor-pointer"
              >
                Save Daily Reflection
              </button>
            </div>
          )}
        </form>

        {/* Existing reflections preview strip */}
        {Object.keys(dailyReflections).length > 0 && (
          <div className="pt-4 border-t border-pink-100">
            <h3 className="text-xs font-bold text-gray-700 mb-2">Recent Logged Reflections</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {(Object.entries(dailyReflections) as [string, DailyReflection][]).sort().reverse().slice(0, 5).map(([d, refData]) => (
                <div key={d} className="p-3 bg-pink-50/60 border border-pink-200 rounded-xl min-w-[200px] shrink-0">
                  <div className="flex items-center justify-between text-[11px] font-bold text-pink-700 mb-1">
                    <span>{d}</span>
                    <span>{refData.rating} ⭐</span>
                  </div>
                  <p className="text-[11px] font-bold text-gray-800">{refData.mood}</p>
                  <p className="text-[11px] text-gray-600 truncate mt-0.5">{refData.notes || 'No notes'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ADAPTIVE EXAM STUDY PLANS & TIPS */}
      <div className="bg-white rounded-[24px] border border-pink-100 p-6 shadow-sm shadow-pink-100/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-800">Adaptive Exam Study Plans & Daily Strategy</h2>
              <p className="text-xs text-gray-500">
                Dynamically adjusts tips, daily targets & roadmaps based on MST (20 Marks) vs Final (100 Marks) as exam day approaches.
              </p>
            </div>
          </div>
          {examEvents.length > 0 && (
            <span className="text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200 self-start sm:self-auto">
              {examEvents.length} Active Exam(s)
            </span>
          )}
        </div>

        {examEvents.length === 0 ? (
          <div className="py-8 text-center bg-pink-50/30 rounded-[20px] border border-dashed border-pink-200">
            <BookOpen className="w-8 h-8 text-pink-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-700">No Exams Scheduled Yet</p>
            <p className="text-[11px] text-gray-500 max-w-xs mx-auto mt-1">
              Add your MST (20 Marks) or Final (100 Marks) exam to unlock personalized daily study roadmaps!
            </p>
            {!isReadOnly && (
              <button
                onClick={() => onOpenModal('event')}
                className="mt-3 px-4 py-2 bg-pink-500 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-pink-600 transition-all cursor-pointer"
              >
                + Add Exam Now
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {examEvents.map((exam) => {
              const plan = getExamAdaptivePlan(exam);
              const isMST = exam.examCategory === 'MST (20 Marks)' || exam.totalMarks === 20;

              return (
                <div 
                  key={exam.id} 
                  className={`p-5 rounded-[22px] border transition-all ${plan.urgencyBorder} bg-gradient-to-br from-white to-pink-50/20 shadow-sm`}
                >
                  {/* Exam Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-pink-100">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          isMST ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-pink-100 text-pink-800 border border-pink-200'
                        }`}>
                          {exam.examCategory || (isMST ? 'MST (20 Marks)' : 'Final (100 Marks)')}
                        </span>
                        <h3 className="text-sm font-extrabold text-gray-900">{exam.title}</h3>
                        <span className="text-xs text-gray-500 font-semibold">• {exam.subject}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                        <span>📅 Date: <strong className="text-gray-900">{exam.date}</strong></span>
                        <span>🎯 Marks: <strong className="text-pink-600">{exam.totalMarks || (isMST ? 20 : 100)} Marks</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${plan.urgencyBg} ${plan.urgencyText}`}>
                        {plan.stageBadge} ({plan.daysLeft < 0 ? 'Passed' : plan.daysLeft === 0 ? 'Today!' : `${plan.daysLeft} days left`})
                      </span>
                      {!isReadOnly && (
                        <button
                          onClick={() => onOpenModal('event', exam)}
                          className="p-1.5 text-gray-400 hover:text-pink-600 cursor-pointer"
                          title="Edit Exam Category or Date"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Adaptive Stage Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                    <div className="p-3.5 bg-white rounded-[16px] border border-pink-100 shadow-2xs">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Prep Phase</p>
                      <p className="text-xs font-extrabold text-pink-900 mt-1">{plan.stageTitle}</p>
                    </div>
                    <div className="p-3.5 bg-white rounded-[16px] border border-pink-100 shadow-2xs">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recommended Target</p>
                      <p className="text-xs font-extrabold text-pink-600 mt-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-pink-500" />
                        <span>{plan.targetHoursPerDay}</span>
                      </p>
                    </div>
                    <div className="p-3.5 bg-white rounded-[16px] border border-pink-100 shadow-2xs">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Primary Strategic Focus</p>
                      <p className="text-xs font-bold text-gray-800 mt-1 truncate" title={plan.primaryFocus}>
                        {plan.primaryFocus}
                      </p>
                    </div>
                  </div>

                  {/* Specific Actionable Tips */}
                  <div className="bg-white/80 p-4 rounded-[18px] border border-pink-100/80 mb-4">
                    <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                      <span>{isMST ? 'MST (20 Marks) Action Tips:' : 'Final Exam (100 Marks) Action Tips:'}</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {plan.studyTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dynamic Countdown Roadmap */}
                  {plan.countdownRoadmap.length > 0 && (
                    <div className="bg-pink-50/50 p-3.5 rounded-[18px] border border-pink-200/60">
                      <p className="text-[11px] font-bold text-pink-900 mb-2 uppercase tracking-wider">
                        📅 Adaptive Countdown Roadmap (Modifies Daily):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {plan.countdownRoadmap.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`p-2.5 rounded-xl border text-xs ${
                              item.isToday 
                                ? 'bg-pink-600 text-white border-pink-600 font-bold shadow-xs' 
                                : 'bg-white text-gray-800 border-pink-200'
                            }`}
                          >
                            <span className={`text-[10px] font-extrabold uppercase block mb-0.5 ${item.isToday ? 'text-pink-100' : 'text-pink-600'}`}>
                              {item.dayLabel}
                            </span>
                            <span className="text-xs">{item.task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end gap-3 pt-3 mt-3 border-t border-pink-100">
                    <button
                      onClick={() => setActiveTab('productivity')}
                      className="px-3.5 py-2 bg-pink-100 hover:bg-pink-200 text-pink-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Flame className="w-3.5 h-3.5 text-pink-600" />
                      <span>Start Pomodoro for this Exam</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Events List Breakdown */}
      <div className="bg-white rounded-[24px] border border-pink-100 p-6 shadow-sm shadow-pink-100/40">
        <h3 className="text-sm font-extrabold text-gray-800 mb-4">All Scheduled Events & Exams</h3>
        {events.length === 0 ? (
          <p className="text-xs text-gray-400">No events or exams recorded.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {events.map((ev) => (
              <div key={ev.id} className="p-3.5 bg-pink-50/40 rounded-[18px] border border-pink-100 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">{ev.title}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      ev.type === 'Exam' ? 'bg-red-100 text-red-600' : 'bg-pink-100 text-pink-600'
                    }`}>
                      {ev.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    {ev.subject} • Date: <strong className="text-pink-600">{ev.date}</strong>
                  </p>
                </div>

                {!isReadOnly && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenModal('event', ev)}
                      className="p-1.5 text-gray-400 hover:text-pink-600 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
