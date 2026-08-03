import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Clock, 
  CheckSquare, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw,
  Bell,
  GraduationCap,
  Edit3,
  Check,
  Award,
  Trash2,
  Minus,
  ExternalLink,
  CloudCheck,
  Cloud,
  ShieldCheck,
  Link2,
  KeyRound
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { TabType } from '../../types';
import { getSkillCartoonIcon } from '../../utils/cgpaHelpers';
import { ThreeDCard } from '../ThreeDBackground';
import { 
  CuteCatBooks, CutePandaCoding, CuteStudyBear, CuteCoffeeMug, 
  CuteMagicStar, CuteGoalBullseye, CutePencilHappy, CuteOwlSmart 
} from '../CuteImages';

interface DashboardViewProps {
  onOpenModal: (type: 'subject' | 'task' | 'timetable' | 'note' | 'semester' | 'goal' | 'event' | 'reminder' | 'session') => void;
  onOpenSyncModal?: () => void;
}

const MOTIVATIONAL_QUOTES = [
  "Small daily efforts lead to extraordinary academic results.",
  "Focus on progress, not perfection. Every study minute counts!",
  "Your future self will thank you for the effort you put in today.",
  "Consistency is the secret code to mastering any complex topic.",
  "Deep focus now, confidence on exam day!"
];

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenModal, onOpenSyncModal }) => {
  const { 
    setActiveTab, 
    stats, 
    timetable, 
    events, 
    goals,
    userName,
    updateUserName,
    extraSkills,
    addExtraSkill,
    updateExtraSkill,
    deleteExtraSkill,
    syncId,
    isReadOnly
  } = useStudy();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // Dashboard Extra Skills Form State
  const [showDashAddForm, setShowDashAddForm] = useState(false);
  const [dashCourseName, setDashCourseName] = useState('');
  const [dashStatus, setDashStatus] = useState<'Ongoing' | 'Pending' | 'Completed'>('Ongoing');
  const [dashHours, setDashHours] = useState(0);
  const [dashCourseUrl, setDashCourseUrl] = useState('');

  const handleDashAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashCourseName.trim()) return;
    await addExtraSkill({
      courseName: dashCourseName.trim(),
      status: dashStatus,
      hoursGiven: Number(dashHours) || 0,
      courseUrl: dashCourseUrl.trim() || undefined
    });
    setDashCourseName('');
    setDashHours(0);
    setDashCourseUrl('');
    setShowDashAddForm(false);
  };

  // Greeting time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const handleSaveName = async () => {
    if (tempName.trim()) {
      await updateUserName(tempName.trim());
    }
    setIsEditingName(false);
  };

  // Random quote
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  // Today's Day & Formatted Date
  const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayDateFull = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const todayClasses = timetable.filter(t => t.day.toLowerCase() === todayDayName.toLowerCase());

  // Upcoming Exams
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingExams = events
    .filter(e => e.type === 'Exam' && e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  const completedGoalsCount = goals.filter(g => g.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative overflow-hidden bg-gradient-to-r from-pink-100/60 via-pink-50/40 to-indigo-50/50 backdrop-blur-md p-6 sm:p-7 rounded-[28px] border border-pink-200/40 shadow-sm shadow-pink-100/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2"
      >
        {/* Ambient glow backgrounds */}
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-pink-300/10 rounded-full filter blur-2xl pointer-events-none animate-pulse" />
        <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-indigo-300/10 rounded-full filter blur-2xl pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

        {/* Cute Mascot Sticker */}
        <div className="absolute right-48 -bottom-1 opacity-90 pointer-events-none select-none hidden lg:block animate-bounce" style={{ animationDuration: '6s' }}>
          <CuteStudyBear size={68} />
        </div>

        <div className="relative z-10">
          {isEditingName && !isReadOnly ? (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl sm:text-2xl font-bold text-gray-800">{greeting},</span>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); }}
                autoFocus
                placeholder="Enter your name"
                className="px-3 py-1 bg-pink-50/80 border-2 border-[#F06292] rounded-xl text-lg font-bold text-gray-800 focus:outline-none"
              />
              <button
                onClick={handleSaveName}
                className="p-1.5 bg-[#F06292] text-white rounded-xl hover:bg-pink-600 cursor-pointer transition-colors"
                title="Save Name"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              className={`flex items-center gap-2 ${isReadOnly ? '' : 'group cursor-pointer'}`} 
              onClick={() => { if (!isReadOnly) { setTempName(userName); setIsEditingName(true); } }}
            >
              <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">
                {greeting}, {userName}! <span className="inline-block animate-bounce" style={{ animationDuration: '3s' }}>🌸</span>
              </h1>
              {!isReadOnly && (
                <button
                  type="button"
                  className="p-1 rounded-lg text-gray-400 group-hover:text-[#F06292] group-hover:bg-pink-50 transition-colors"
                  title="Click to change your name"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          <p className="text-[#F06292] font-semibold text-xs sm:text-sm mt-1 flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-pink-100/80 text-[10px] font-extrabold text-[#F06292]">{todayDateFull}</span>
            <span className="text-gray-300 font-normal">|</span>
            <span className="italic text-gray-500 font-medium">"{quote}"</span>
          </p>
        </div>

        {!isReadOnly && (
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={() => onOpenModal('session')}
              className="bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white px-5 py-3 rounded-[18px] text-xs font-bold transition-all shadow-md shadow-pink-200/50 cursor-pointer flex items-center gap-2"
            >
              <Flame className="w-4 h-4 fill-white text-white animate-pulse" />
              <span>Log Study Hours</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <ThreeDCard className="bg-white p-5 rounded-[20px] shadow-xs border border-[#FCE4EC] relative overflow-hidden group">
          <div className="flex justify-between items-center w-full">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Study Hours Today</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.floor(stats.totalStudyMinutesToday / 60)}h {stats.totalStudyMinutesToday % 60}m
              </p>
              <p className="text-[10px] text-emerald-500 font-bold mt-1">+20% from yesterday</p>
            </div>
            <CuteCatBooks size={68} className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0" />
          </div>
        </ThreeDCard>

        <ThreeDCard className="bg-white p-5 rounded-[20px] shadow-xs border border-[#FCE4EC] relative overflow-hidden group">
          <div className="flex justify-between items-center w-full">
            <div className="flex-1 mr-4">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Study Goals Progress</p>
              <p className="text-2xl font-bold text-gray-800">
                {completedGoalsCount}/{goals.length}
              </p>
              <div className="w-full bg-[#FFF0F5] h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-[#F8BBD0] h-full rounded-full transition-all duration-300" 
                  style={{ width: `${goals.length > 0 ? (completedGoalsCount / goals.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            <CuteGoalBullseye size={68} className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0" />
          </div>
        </ThreeDCard>
      </div>

      {/* TWO COLUMN CONTENT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Timetable Schedule */}
          <ThreeDCard className="bg-white rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/50 p-5 relative overflow-hidden group">
            <div className="absolute -right-3 -bottom-3 opacity-20 pointer-events-none select-none transition-transform duration-300 group-hover:scale-110 z-0">
              <CuteCatBooks size={74} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-500" />
                <h2 className="font-bold text-gray-800 text-sm">Today's Schedule ({todayDayName})</h2>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative z-10">
              {todayClasses.length === 0 ? (
                <div className="py-8 text-center bg-pink-50/30 rounded-[18px] border border-dashed border-pink-200">
                  <p className="text-xs font-medium text-gray-500">No scheduled classes today! Free time for study or review.</p>
                  {!isReadOnly && (
                    <button
                      onClick={() => onOpenModal('timetable')}
                      className="mt-2 text-xs font-bold text-pink-600 hover:underline cursor-pointer"
                    >
                      + Add class to schedule
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {todayClasses.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-[16px] border border-pink-100 flex items-center justify-between gap-3 hover:shadow-sm transition-all"
                      style={{ backgroundColor: `${item.subjectColor}20` }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-2.5 h-10 rounded-full" 
                          style={{ backgroundColor: item.subjectColor }} 
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-800">{item.subjectName}</p>
                          <p className="text-[11px] text-gray-500 font-medium">
                            {item.startTime} - {item.endTime} ({item.type || 'Lecture'})
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-gray-700 shadow-xs border border-pink-100">
                        {item.type || 'Class'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ThreeDCard>
        </div>

        {/* RIGHT COLUMN: Upcoming Exams & Daily Adaptive Tips */}
        <div className="space-y-6">
          <ThreeDCard className="bg-white rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/50 p-5 space-y-4 relative overflow-hidden group">
            <div className="absolute -right-3 -bottom-3 opacity-20 pointer-events-none select-none transition-transform duration-300 group-hover:scale-110 z-0">
              <CuteOwlSmart size={72} />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <h2 className="font-bold text-gray-800 text-sm">Exams & Adaptive Tips</h2>
              </div>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs font-bold text-pink-500 hover:text-pink-600 cursor-pointer"
              >
                View Plans
              </button>
            </div>

            <div className="relative z-10">
              {upcomingExams.length === 0 ? (
                <div className="py-6 text-center bg-pink-50/30 rounded-[16px] border border-dashed border-pink-200">
                  <p className="text-xs text-gray-500">No upcoming exams scheduled.</p>
                  {!isReadOnly && (
                    <button
                      onClick={() => onOpenModal('event')}
                      className="mt-2 text-xs font-bold text-pink-600 hover:underline cursor-pointer"
                    >
                      + Schedule Exam
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingExams.slice(0, 3).map((ev) => {
                    const isMST = ev.examCategory === 'MST (20 Marks)' || ev.totalMarks === 20;

                    return (
                      <div key={ev.id} className="p-3.5 bg-pink-50/40 rounded-[18px] border border-pink-100 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs font-extrabold text-gray-800 truncate">{ev.title}</p>
                            <p className="text-[10px] text-pink-700 font-semibold">{ev.subject} • Date: {ev.date}</p>
                          </div>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                            isMST ? 'bg-amber-100 text-amber-800' : 'bg-pink-100 text-pink-800'
                          }`}>
                            {ev.examCategory || (isMST ? 'MST (20M)' : 'Final (100M)')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ThreeDCard>

          {/* DASHBOARD EXTRA SKILLS & CERTIFICATIONS WIDGET */}
          <ThreeDCard className="bg-white rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/50 p-5 space-y-4 relative overflow-hidden group">
            <div className="absolute -right-3 -bottom-3 opacity-20 pointer-events-none select-none transition-transform duration-300 group-hover:scale-110 z-0">
              <CutePandaCoding size={72} />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F06292]" />
                <h2 className="font-bold text-gray-800 text-sm">Extra Skills & Certifications</h2>
              </div>
              {!isReadOnly && (
                <button
                  onClick={() => setShowDashAddForm(!showDashAddForm)}
                  className="p-1.5 rounded-xl hover:bg-pink-50 text-pink-500 hover:text-pink-600 transition-colors cursor-pointer flex items-center justify-center"
                  title="Add course certification"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {showDashAddForm && (
              <form onSubmit={handleDashAddSkill} className="p-3.5 bg-pink-50/40 rounded-[18px] border border-pink-100 space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Course / Certification Name</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS Cloud Practitioner"
                    value={dashCourseName}
                    onChange={(e) => setDashCourseName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400 font-medium text-gray-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Course URL / Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://www.coursera.org/learn/your-course"
                    value={dashCourseUrl}
                    onChange={(e) => setDashCourseUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400 font-medium text-gray-700 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                    <select
                      value={dashStatus}
                      onChange={(e) => setDashStatus(e.target.value as 'Ongoing' | 'Pending' | 'Completed')}
                      className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400 font-medium text-gray-700 text-xs"
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Hours Logged</label>
                    <input
                      type="number"
                      min="0"
                      value={dashHours}
                      onChange={(e) => setDashHours(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400 font-medium text-gray-700 text-xs"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#F06292] hover:bg-pink-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Add Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDashAddForm(false)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {extraSkills.length === 0 ? (
                <div className="py-6 text-center bg-pink-50/30 rounded-[18px] border border-dashed border-pink-200">
                  <p className="text-xs text-gray-500">No extra skills or certification courses entered.</p>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => setShowDashAddForm(true)}
                      className="mt-2 text-xs font-bold text-pink-600 hover:underline cursor-pointer"
                    >
                      + Add a Course
                    </button>
                  )}
                </div>
              ) : (
                extraSkills.map((skill) => {
                  const iconInfo = getSkillCartoonIcon(skill.courseName);
                  return (
                    <div key={skill.id} className="p-3.5 bg-pink-50/40 rounded-[18px] border border-pink-100 flex flex-col gap-2.5 group/dash-skill hover:bg-pink-50/60 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-2.5 items-start min-w-0 flex-1">
                          <div className={`w-8 h-8 ${iconInfo.bgColor} ${iconInfo.borderColor} border rounded-lg flex items-center justify-center text-sm select-none shadow-3xs shrink-0 mt-0.5`}>
                            {iconInfo.emoji}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-extrabold text-gray-800 truncate">{skill.courseName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {isReadOnly ? (
                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                  skill.status === 'Ongoing'
                                    ? 'bg-pink-100 text-pink-800'
                                    : skill.status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/50'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {skill.status}
                                </span>
                              ) : (
                                <button
                                  onClick={() => updateExtraSkill({
                                    ...skill,
                                    status: skill.status === 'Ongoing' ? 'Completed' : skill.status === 'Completed' ? 'Pending' : 'Ongoing'
                                  })}
                                  title="Click to toggle status"
                                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider cursor-pointer ${
                                    skill.status === 'Ongoing'
                                      ? 'bg-pink-100 text-pink-800'
                                      : skill.status === 'Completed'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/50'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {skill.status}
                                </button>
                              )}
                              <span className="text-[10px] text-gray-400 font-bold">•</span>
                              <span className="text-[11px] text-gray-500 font-extrabold">{skill.hoursGiven} hours given</span>
                            </div>
                          </div>
                        </div>

                        {!isReadOnly && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Hours counter */}
                            <div className="flex items-center gap-1 bg-white border border-pink-100 rounded-lg p-0.5 shadow-3xs">
                              <button
                                onClick={() => updateExtraSkill({
                                  ...skill,
                                  hoursGiven: Math.max(0, skill.hoursGiven - 1)
                                })}
                                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-[#F06292] hover:bg-pink-50 rounded-md font-extrabold transition-colors"
                                title="Minus 1 hour"
                              >
                                -
                              </button>
                              <span className="font-extrabold text-gray-700 text-xs min-w-[28px] text-center">{skill.hoursGiven}h</span>
                              <button
                                onClick={() => updateExtraSkill({
                                  ...skill,
                                  hoursGiven: skill.hoursGiven + 1
                                })}
                                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-[#F06292] hover:bg-pink-50 rounded-md font-extrabold transition-colors"
                                title="Plus 1 hour"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => deleteExtraSkill(skill.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#F06292] hover:bg-pink-100/50 transition-colors cursor-pointer opacity-0 group-hover/dash-skill:opacity-100 shrink-0"
                              title="Delete course"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Compact Direct Link Paste Row */}
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="url"
                          placeholder="Paste course link here..."
                          value={skill.courseUrl || ''}
                          disabled={isReadOnly}
                          onChange={(e) => {
                            if (!isReadOnly) {
                              updateExtraSkill({
                                ...skill,
                                courseUrl: e.target.value
                              });
                            }
                          }}
                          className={`flex-1 min-w-0 px-2.5 py-1.5 bg-white border border-pink-100/60 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-pink-400 text-gray-700 font-medium ${isReadOnly ? 'cursor-not-allowed opacity-75' : ''}`}
                        />
                        {skill.courseUrl && skill.courseUrl.trim().length > 0 && (
                          <a
                            href={skill.courseUrl.trim().startsWith('http') ? skill.courseUrl.trim() : `https://${skill.courseUrl.trim()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-pink-100/50 hover:bg-pink-100 text-[#F06292] rounded-xl cursor-pointer transition-all shrink-0 hover:scale-105"
                            title="Go to Course"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ThreeDCard>
        </div>
      </div>
    </div>
  );
};
