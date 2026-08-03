import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Calendar as CalendarIcon, 
  Sparkles, 
  BookOpen, 
  CheckSquare, 
  Bell, 
  Flame, 
  GraduationCap,
  X,
  User as UserIcon,
  CloudCheck,
  RefreshCw,
  Palette,
  Link2,
  KeyRound,
  Eye,
  RotateCcw
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { TabType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onOpenModal: (type: 'subject' | 'task' | 'timetable' | 'semester' | 'goal' | 'event' | 'reminder' | 'session') => void;
  onOpenThemeModal?: () => void;
  onOpenSyncModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenModal, onOpenThemeModal, onOpenSyncModal }) => {
  const { 
    searchQuery, setSearchQuery, searchResults, setActiveTab, isSyncing, themeColor, syncId, 
    isReadOnly, activeCode, myOwnCode, switchToMyAccount 
  } = useStudy();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const quickAddRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setIsQuickAddOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleSearchResultClick = (tab: TabType) => {
    setActiveTab(tab);
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFF0F5]/90 backdrop-blur-md px-4 sm:px-8 py-4 border-b border-[#F8BBD0] flex items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-lg" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-[#F06292] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search subjects, tasks, exams..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-pink-200 rounded-[18px] text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-pink-500 hover:text-pink-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        <AnimatePresence>
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[20px] border border-pink-200 shadow-xl p-3 max-h-96 overflow-y-auto z-50 origin-top"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-pink-100">
                <span className="text-xs font-bold text-pink-500 uppercase tracking-wider">
                  Search Results ({searchResults.length})
                </span>
                <button 
                  onClick={() => setIsSearchFocused(false)} 
                  className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {searchResults.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">
                  No matching subjects, tasks, or exams found for "{searchQuery}"
                </p>
              ) : (
                <div className="space-y-1.5">
                  {searchResults.map((item) => (
                    <motion.button
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSearchResultClick(item.tab)}
                      whileHover={{ x: 3, backgroundColor: 'var(--theme-bg-light)' }}
                      className="w-full text-left p-2.5 hover:bg-pink-100 rounded-[14px] transition-colors flex items-start gap-2.5 cursor-pointer text-gray-800"
                    >
                      <span 
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0" 
                        style={{ backgroundColor: item.color || 'var(--theme-300)' }} 
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-gray-800 truncate">{item.title}</p>
                          <span className="text-[10px] font-semibold bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full shrink-0">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.subtitle}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Header Utilities: Date, Theme Picker, Quick Add, Mobile Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Switch Back to My Account */}
        {isReadOnly && (
          <button
            onClick={switchToMyAccount}
            className="px-2.5 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-[14px] text-xs font-black shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95 shrink-0"
            title={`Return to your default account (${myOwnCode})`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Back to My Acc</span>
          </button>
        )}

        {/* Date Display Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-white rounded-[18px] px-4 py-2 border border-pink-200 text-sm font-bold text-gray-800 shadow-xs">
          <CalendarIcon className="w-4 h-4 text-pink-500" />
          <span>{todayDateStr}</span>
        </div>

        {/* Theme Color Picker Button */}
        {onOpenThemeModal && (
          <motion.button
            onClick={onOpenThemeModal}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-pink-200 hover:border-pink-300 rounded-[18px] text-xs font-bold text-gray-700 shadow-xs transition-all cursor-pointer group"
            title="Change Theme Color"
          >
            <div
              className="w-4 h-4 rounded-full border border-white shadow-xs group-hover:scale-110 transition-transform"
              style={{ backgroundColor: themeColor || 'var(--theme-500)' }}
            />
            <Palette className="w-3.5 h-3.5 text-pink-500" />
            <span className="hidden md:inline">Theme</span>
          </motion.button>
        )}

        {/* Quick Add Dropdown */}
        <div className="relative" ref={quickAddRef}>
          {isReadOnly ? (
            <motion.button
              onClick={onOpenSyncModal}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-100 border border-amber-300 text-amber-900 rounded-[18px] text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Editing locked in View-Only Mode. Click to switch code."
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">🔒 View-Only</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-[18px] text-xs font-bold shadow-sm transition-colors cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Add</span>
            </motion.button>
          )}

          <AnimatePresence>
            {isQuickAddOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                className="absolute right-0 mt-2 w-52 bg-white rounded-[20px] border border-pink-200 shadow-xl p-2 z-50 space-y-1 origin-top-right"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-pink-500 uppercase tracking-wider">
                  Create New
                </div>
                {[
                  { type: 'subject' as const, label: 'New Subject', icon: BookOpen },
                  { type: 'timetable' as const, label: 'Timetable Slot', icon: CalendarIcon },
                  { type: 'event' as const, label: 'Exam / Calendar Event', icon: Sparkles },
                  { type: 'session' as const, label: 'Log Study Hours', icon: Flame },
                  { type: 'goal' as const, label: 'Study Goal', icon: Sparkles },
                  { type: 'semester' as const, label: 'Semester Result', icon: GraduationCap },
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.type}
                      onClick={() => {
                        setIsQuickAddOpen(false);
                        onOpenModal(opt.type);
                      }}
                      whileHover={{ x: 2, backgroundColor: 'var(--theme-bg-light)' }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:text-pink-600 rounded-[14px] transition-colors text-left cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-pink-500" />
                      <span>{opt.label}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Share & Sync Code Button */}
        <motion.button
          onClick={onOpenSyncModal}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-[18px] text-xs font-black shadow-xs shadow-pink-200 hover:brightness-105 transition-all cursor-pointer"
          title="Share Sync Code to bring all your data to another phone"
        >
          <KeyRound className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">Sync Code ({syncId})</span>
        </motion.button>
      </div>
    </header>
  );
};
