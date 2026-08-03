import React, { useState } from 'react';
import { Eye, RotateCcw, KeyRound, Lock } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { ThreeDBackground } from './components/ThreeDBackground';
import { motion, AnimatePresence } from 'motion/react';

// Background Images
import cutePinkishBg from './assets/images/cute_pinkish_bg_1784985852179.jpg';
import cuteBluishBg from './assets/images/cute_bluish_bg_1784985866398.jpg';
import cuteDreamyBg from './assets/images/cute_dreamy_bg_1784985883307.jpg';

// Views
import { DashboardView } from './components/views/DashboardView';
import { TimetableView } from './components/views/TimetableView';
import { SemesterResultsView } from './components/views/SemesterResultsView';
import { StudyGoalsView } from './components/views/StudyGoalsView';
import { CalendarView } from './components/views/CalendarView';
import { RemindersView } from './components/views/RemindersView';
import { ProductivityView } from './components/views/ProductivityView';
import { ExtraSkillsView } from './components/views/ExtraSkillsView';

// Modals
import { SubjectModal } from './components/modals/SubjectModal';
import { TaskModal } from './components/modals/TaskModal';
import { TimetableModal } from './components/modals/TimetableModal';
import { SemesterModal } from './components/modals/SemesterModal';
import { GoalModal } from './components/modals/GoalModal';
import { EventModal } from './components/modals/EventModal';
import { ReminderModal } from './components/modals/ReminderModal';
import { StudySessionModal } from './components/modals/StudySessionModal';
import { ThemeModal } from './components/modals/ThemeModal';
import { SyncCodeModal } from './components/modals/SyncLinkModal';

import { 
  Subject, Task, TimetableSlot, SemesterResult, 
  StudyGoal, CalendarEvent, Reminder 
} from './types';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, isReadOnly, activeCode, switchToMyAccount, myOwnCode, isCodeDisabled,
    subjects, addSubject, updateSubject,
    addTask, updateTask,
    addTimetableSlot, updateTimetableSlot,
    addSemester, updateSemester,
    addGoal, updateGoal,
    addEvent, updateEvent,
    addReminder, updateReminder,
    addStudySession
  } = useStudy();

  // Modal active states
  const [modalType, setModalType] = useState<'subject' | 'task' | 'timetable' | 'semester' | 'goal' | 'event' | 'reminder' | 'session' | null>(null);
  const [initialModalData, setInitialModalData] = useState<any>(null);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const handleOpenModal = (type: any, data?: any) => {
    setModalType(type);
    setInitialModalData(data || null);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setInitialModalData(null);
  };

  const getTabBg = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'goals':
      case 'productivity':
        return cuteDreamyBg;
      case 'timetable':
      case 'calendar':
      case 'extra-skills':
        return cuteBluishBg;
      case 'subjects':
      case 'semesters':
        return cutePinkishBg;
      default:
        return cuteDreamyBg;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] font-sans text-gray-800 flex flex-col md:flex-row antialiased selection:bg-pink-200 selection:text-pink-800 relative overflow-x-hidden">
      {/* 3D Animated Interactive Background */}
      <ThreeDBackground />

      {/* Navigation */}
      <Navigation onOpenThemeModal={() => setIsThemeModalOpen(true)} onOpenSyncModal={() => setIsSyncModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 mb-16 md:mb-0 relative z-10">
        <Header onOpenModal={handleOpenModal} onOpenThemeModal={() => setIsThemeModalOpen(true)} onOpenSyncModal={() => setIsSyncModalOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div 
            className="w-full rounded-[32px] border-2 border-pink-200/60 p-5 sm:p-7 shadow-xl bg-cover bg-center overflow-hidden transition-all duration-500 relative min-h-[75vh]"
            style={{ backgroundImage: `url(${getTabBg()})` }}
          >
            {/* Soft semi-translucent glass overlay to guarantee 100% legibility and gorgeous visuals */}
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] pointer-events-none" />
            
            {/* View content container (interactive) */}
            <div className="relative z-10 h-full">
              {isCodeDisabled ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white/95 backdrop-blur-md rounded-[28px] border-2 border-rose-200 shadow-xl max-w-2xl mx-auto my-8">
                  <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-inner">
                    <Lock className="w-8 h-8 text-rose-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-rose-950 mb-2">
                    Access Disabled by Code Owner
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 max-w-md mb-6 leading-relaxed">
                    {isReadOnly ? (
                      <>
                        The owner of this Study Space has disabled <strong>View-Only</strong> access for code <code className="bg-rose-50 text-rose-800 font-mono px-2 py-0.5 rounded border border-rose-200 font-bold">{activeCode}</code>. You cannot view or access this account right now.
                      </>
                    ) : (
                      <>
                        The owner of this Study Space has disabled <strong>Full Access</strong> for code <code className="bg-rose-50 text-rose-800 font-mono px-2 py-0.5 rounded border border-rose-200 font-bold">{activeCode}</code>. Edits and changes are currently locked.
                      </>
                    )}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={switchToMyAccount}
                      className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-xs font-black shadow-md shadow-pink-200 cursor-pointer transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Back to My Account</span>
                    </button>
                    <button
                      onClick={() => setIsSyncModalOpen(true)}
                      className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Switch / Enter Code</span>
                    </button>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15, rotateX: 4, transformPerspective: 1000 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -15, rotateX: -4 }}
                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                    className="h-full"
                  >
                    {activeTab === 'dashboard' && <DashboardView onOpenModal={handleOpenModal} onOpenSyncModal={() => setIsSyncModalOpen(true)} />}
                    {activeTab === 'timetable' && <TimetableView onOpenModal={handleOpenModal} />}
                    {activeTab === 'semesters' && <SemesterResultsView onOpenModal={handleOpenModal} />}
                    {activeTab === 'goals' && <StudyGoalsView onOpenModal={handleOpenModal} />}
                    {activeTab === 'calendar' && <CalendarView onOpenModal={handleOpenModal} />}
                    {activeTab === 'productivity' && <ProductivityView onOpenModal={handleOpenModal} />}
                    {activeTab === 'extra-skills' && <ExtraSkillsView />}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* MODAL DIALOGS */}
      <SubjectModal
        isOpen={modalType === 'subject'}
        onClose={handleCloseModal}
        initialData={initialModalData as Subject}
        onSave={async (data) => {
          if ('id' in data) await updateSubject(data as Subject);
          else await addSubject(data);
        }}
      />

      <TaskModal
        isOpen={modalType === 'task'}
        onClose={handleCloseModal}
        initialData={initialModalData as Task}
        subjects={subjects}
        onSave={async (data) => {
          if ('id' in data) await updateTask(data as Task);
          else await addTask(data);
        }}
      />

      <TimetableModal
        isOpen={modalType === 'timetable'}
        onClose={handleCloseModal}
        initialData={initialModalData as TimetableSlot}
        subjects={subjects}
        onSave={async (data) => {
          if ('id' in data) await updateTimetableSlot(data as TimetableSlot);
          else await addTimetableSlot(data);
        }}
      />

      <SemesterModal
        isOpen={modalType === 'semester'}
        onClose={handleCloseModal}
        initialData={initialModalData as SemesterResult}
        onSave={async (data) => {
          if ('id' in data) await updateSemester(data as SemesterResult);
          else await addSemester(data);
        }}
      />

      <GoalModal
        isOpen={modalType === 'goal'}
        onClose={handleCloseModal}
        initialData={initialModalData as StudyGoal}
        onSave={async (data) => {
          if ('id' in data) await updateGoal(data as StudyGoal);
          else await addGoal(data);
        }}
      />

      <EventModal
        isOpen={modalType === 'event'}
        onClose={handleCloseModal}
        initialData={initialModalData as CalendarEvent}
        subjects={subjects}
        onSave={async (data) => {
          if ('id' in data) await updateEvent(data as CalendarEvent);
          else await addEvent(data);
        }}
      />

      <ReminderModal
        isOpen={modalType === 'reminder'}
        onClose={handleCloseModal}
        initialData={initialModalData as Reminder}
        onSave={async (data) => {
          if ('id' in data) await updateReminder(data as Reminder);
          else await addReminder(data);
        }}
      />

      <StudySessionModal
        isOpen={modalType === 'session'}
        onClose={handleCloseModal}
        subjects={subjects}
        onSave={async (data) => {
          await addStudySession(data);
        }}
      />

      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Share & Sync Code Modal */}
      <SyncCodeModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StudyProvider>
        <MainAppContent />
      </StudyProvider>
    </AuthProvider>
  );
}
