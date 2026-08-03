import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BookOpenCheck, 
  CheckSquare, 
  GraduationCap, 
  Target, 
  Calendar, 
  Bell, 
  Flame,
  CloudCheck,
  RefreshCw,
  Plus,
  Minus,
  Trash2,
  Award,
  Palette,
  Link2,
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { TabType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

interface NavigationProps {
  onOpenThemeModal?: () => void;
  onOpenSyncModal?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenThemeModal, onOpenSyncModal }) => {
  const { 
    activeTab, 
    setActiveTab, 
    stats, 
    isSyncing, 
    reminders, 
    tasks, 
    userName, 
    updateUserName, 
    clearAllData,
    extraSkills,
    addExtraSkill,
    updateExtraSkill,
    deleteExtraSkill,
    syncId,
    themeColor
  } = useStudy();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingText, setEditingText] = useState(userName);

  // Extra Skills Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newStatus, setNewStatus] = useState<'Ongoing' | 'Pending'>('Ongoing');
  const [newHours, setNewHours] = useState(0);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    await addExtraSkill({
      courseName: newCourseName.trim(),
      status: newStatus,
      hoursGiven: Number(newHours) || 0
    });
    setNewCourseName('');
    setNewHours(0);
    setShowAddForm(false);
  };

  const handleSaveName = async () => {
    if (editingText.trim()) {
      await updateUserName(editingText.trim());
    }
    setIsEditingName(false);
  };

  const pendingRemindersCount = reminders.filter(r => !r.completed).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'semesters', label: 'Results & GPA', icon: GraduationCap },
    { id: 'extra-skills', label: 'Extra Skills', icon: Award },
    { id: 'goals', label: 'Study Goals', icon: Target },
    { id: 'calendar', label: 'Exams & Calendar', icon: Calendar },
    { id: 'productivity', label: 'Productivity', icon: Flame },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-pink-200 p-6 h-screen sticky top-0 justify-between shrink-0 select-none">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-1 -mr-3 pb-4 space-y-6 scrollbar-thin scrollbar-thumb-pink-100">
          {/* App Header Brand */}
          <div className="flex items-center gap-3 mb-2 shrink-0">
            <div className="w-10 h-10 bg-pink-300 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xs shrink-0">
              🌸
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-gray-800 leading-tight">Bloom 🌻❤️</h1>
              <p className="text-[10px] text-pink-500 font-semibold tracking-wider uppercase mt-0.5">My Study Buddy</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 shrink-0 relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ x: isActive ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[15px] text-sm font-semibold transition-colors cursor-pointer relative overflow-hidden ${
                    isActive ? 'text-pink-600 font-extrabold' : 'text-gray-500 hover:text-pink-500'
                  }`}
                >
                  {/* Sliding Theme Background Backplate */}
                  {isActive && (
                    <motion.span
                      layoutId="activeTabDesktop"
                      className="absolute inset-0 bg-pink-100 rounded-[15px] -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-pink-600' : 'text-gray-400 group-hover:text-pink-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full relative z-10 ${
                      isActive 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-pink-100 text-pink-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Sync & Share Code Widget */}
        <div className="mt-auto pt-4 border-t border-pink-200 space-y-2">
          <motion.button
            onClick={onOpenSyncModal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-white shrink-0" />
            <span>Sync Code: {syncId}</span>
          </motion.button>

          <div className="flex items-center justify-between gap-2 p-2 bg-pink-50/50 rounded-2xl border border-pink-100">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 border-2 border-white text-white font-bold flex items-center justify-center shrink-0 text-base shadow-xs">
                {userName[0]?.toUpperCase() || 'S'}
              </div>
              <div className="min-w-0 flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); }}
                      autoFocus
                      className="w-full px-2 py-0.5 bg-white border border-pink-500 rounded-lg text-xs font-bold text-gray-800"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 bg-pink-500 text-white rounded-lg text-xs"
                      title="Save"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => { setEditingText(userName); setIsEditingName(true); }}>
                    <p className="text-sm font-bold text-gray-800 truncate group-hover:text-pink-600 transition-colors">
                      {userName}
                    </p>
                    <span className="text-[10px] text-gray-400 group-hover:text-pink-500">✏️</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider mt-0.5">
                  {isSyncing ? (
                    <span className="text-pink-500 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Syncing...
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <CloudCheck className="w-3 h-3 text-emerald-500" />
                      Link Sync Active
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onOpenThemeModal && (
                <button
                  onClick={onOpenThemeModal}
                  title="Customize Theme Color"
                  className="p-1.5 rounded-xl hover:bg-pink-100 text-gray-400 hover:text-pink-600 transition-colors cursor-pointer shrink-0"
                >
                  <Palette className="w-4 h-4 text-pink-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100 px-3 py-2 flex items-center gap-3 overflow-x-auto shadow-lg shadow-pink-200/50 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {[
          { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
          { id: 'timetable' as TabType, label: 'Timetable', icon: CalendarDays },
          { id: 'semesters' as TabType, label: 'Results & GPA', icon: GraduationCap },
          { id: 'extra-skills' as TabType, label: 'Extra Skills', icon: Award },
          { id: 'goals' as TabType, label: 'Study Goals', icon: Target },
          { id: 'calendar' as TabType, label: 'Exams & Calendar', icon: Calendar },
          { id: 'productivity' as TabType, label: 'Productivity', icon: Flame },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center py-1 px-3 rounded-xl shrink-0 select-none relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabMobile"
                  className="absolute inset-0 bg-pink-50 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'text-pink-600' : 'text-gray-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] mt-0.5 whitespace-nowrap transition-colors ${isActive ? 'text-pink-600 font-bold' : 'text-gray-400 font-normal'}`}>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </>
  );
};
