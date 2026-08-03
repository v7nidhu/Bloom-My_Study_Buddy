import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc, writeBatch, getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { 
  Subject, SubjectGoal, TimetableSlot, Task, SemesterResult, StudyGoal, 
  CalendarEvent, Reminder, StudySession, DailyReflection, TabType, SearchResultItem,
  ExtraSkill
} from '../types';
import { applyThemeColor } from '../utils/theme';
import { 
  initialSubjects, initialTimetable, initialTasks, initialSemesters, 
  initialGoals, initialCalendarEvents, initialReminders, 
  initialStudySessions 
} from '../data/initialData';

interface StudyContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  syncId: string;
  fullAccessCode: string;
  viewOnlyCode: string;
  activeCode: string;
  isReadOnly: boolean;
  shareableUrl: string;
  myOwnCode: string;
  fullAccessEnabled: boolean;
  viewOnlyEnabled: boolean;
  isCodeDisabled: boolean;
  toggleFullAccessCodeStatus: (enabled: boolean) => Promise<void>;
  toggleViewOnlyCodeStatus: (enabled: boolean) => Promise<void>;
  switchSyncId: (newId: string) => void;
  switchToMyAccount: () => void;
  createNewSyncSpace: () => void;

  subjects: Subject[];
  addSubject: (s: Omit<Subject, 'id'>) => Promise<void>;
  updateSubject: (s: Subject) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  addSubjectGoal: (subjectId: string, goal: Omit<SubjectGoal, 'id'>) => Promise<void>;
  updateSubjectGoal: (subjectId: string, goal: SubjectGoal) => Promise<void>;
  deleteSubjectGoal: (subjectId: string, goalId: string) => Promise<void>;
  toggleSubjectGoalCompleted: (subjectId: string, goalId: string) => Promise<void>;
  updateSubjectGoalProgress: (subjectId: string, goalId: string, newValue: number) => Promise<void>;

  timetable: TimetableSlot[];
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => Promise<void>;
  updateTimetableSlot: (slot: TimetableSlot) => Promise<void>;
  deleteTimetableSlot: (id: string) => Promise<void>;

  tasks: Task[];
  addTask: (t: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (t: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;

  semesters: SemesterResult[];
  addSemester: (sem: Omit<SemesterResult, 'id'>) => Promise<void>;
  updateSemester: (sem: SemesterResult) => Promise<void>;
  deleteSemester: (id: string) => Promise<void>;

  goals: StudyGoal[];
  addGoal: (g: Omit<StudyGoal, 'id'>) => Promise<void>;
  updateGoal: (g: StudyGoal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  toggleGoalCompleted: (id: string) => Promise<void>;

  events: CalendarEvent[];
  addEvent: (e: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (e: CalendarEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  reminders: Reminder[];
  addReminder: (r: Omit<Reminder, 'id'>) => Promise<void>;
  updateReminder: (r: Reminder) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  toggleReminderCompleted: (id: string) => Promise<void>;

  studySessions: StudySession[];
  addStudySession: (session: Omit<StudySession, 'id'>) => Promise<void>;
  deleteStudySession: (id: string) => Promise<void>;

  dailyReflections: Record<string, DailyReflection>;
  saveDailyReflection: (reflection: DailyReflection) => Promise<void>;

  extraSkills: ExtraSkill[];
  addExtraSkill: (s: Omit<ExtraSkill, 'id'>) => Promise<void>;
  updateExtraSkill: (s: ExtraSkill) => Promise<void>;
  deleteExtraSkill: (id: string) => Promise<void>;

  searchResults: SearchResultItem[];
  userName: string;
  updateUserName: (name: string) => Promise<void>;
  themeColor: string;
  setThemeColor: (colorHex: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  stats: {
    totalStudyMinutesToday: number;
    totalStudyMinutesWeek: number;
    currentStreakDays: number;
    completedTasksCount: number;
    pendingTasksCount: number;
    overallCGPA: number | 'N/A';
    upcomingExamsCount: number;
  };
  isSyncing: boolean;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'study_companion_local_v1';

// Helper to parse sync codes into base Firestore space ID and read-only flag
export const parseSyncCode = (rawCode: string) => {
  const clean = rawCode.trim().replaceAll(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
  if (!clean) return { baseId: '', isReadOnly: false, activeCode: '' };

  if (clean.endsWith('-VIEW')) {
    const base = clean.slice(0, -5);
    return { baseId: base || clean, isReadOnly: true, activeCode: clean };
  }
  if (clean.endsWith('-READONLY')) {
    const base = clean.slice(0, -9);
    return { baseId: base || clean, isReadOnly: true, activeCode: clean };
  }
  if (clean.startsWith('VIEW-')) {
    const base = clean.slice(5);
    return { baseId: base || clean, isReadOnly: true, activeCode: clean };
  }
  return { baseId: clean, isReadOnly: false, activeCode: clean };
};

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Helper to generate a clean, memorable 6-digit style sync code
  const generateNiceCode = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `STUDY-${num}`;
  };

  // Active Raw Sync Code State
  const [activeCodeState, setActiveCodeState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSync = params.get('syncId') || params.get('code') || params.get('space');
      if (urlSync && urlSync.trim()) {
        const cleaned = urlSync.trim().replaceAll(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
        localStorage.setItem('study_companion_sync_id', cleaned);
        return cleaned;
      }
    }
    const saved = localStorage.getItem('study_companion_sync_id');
    if (saved && saved.trim()) return saved.trim().toUpperCase();
    const fresh = generateNiceCode();
    localStorage.setItem('study_companion_sync_id', fresh);
    return fresh;
  });

  // Derived sync codes
  const parsedCode = useMemo(() => parseSyncCode(activeCodeState), [activeCodeState]);
  const syncId = parsedCode.baseId || 'STUDY-1001';
  const isReadOnly = parsedCode.isReadOnly;
  const fullAccessCode = syncId;
  const viewOnlyCode = `${syncId}-VIEW`;
  const activeCode = activeCodeState;

  const shareableUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?syncId=${activeCode}`;
  }, [activeCode]);

  // Primary / Default User Account Code
  const [myOwnCode, setMyOwnCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedOwn = localStorage.getItem('study_companion_my_own_code');
      if (savedOwn && savedOwn.trim()) return savedOwn.trim().toUpperCase();
    }
    const initialOwn = isReadOnly ? (fullAccessCode || 'STUDY-1001') : (activeCodeState || 'STUDY-1001');
    if (typeof window !== 'undefined') {
      localStorage.setItem('study_companion_my_own_code', initialOwn);
    }
    return initialOwn;
  });

  useEffect(() => {
    if (!isReadOnly && activeCodeState) {
      const savedOwn = localStorage.getItem('study_companion_my_own_code');
      if (!savedOwn) {
        setMyOwnCode(activeCodeState);
        localStorage.setItem('study_companion_my_own_code', activeCodeState);
      }
    }
  }, [isReadOnly, activeCodeState]);

  const switchSyncId = (newId: string) => {
    const cleaned = newId.trim().replaceAll(/[^a-zA-Z0-9_-]/g, '').toUpperCase() || generateNiceCode();
    setActiveCodeState(cleaned);
    localStorage.setItem('study_companion_sync_id', cleaned);
    if (!cleaned.endsWith('-VIEW') && !cleaned.endsWith('-READONLY') && !cleaned.startsWith('VIEW-')) {
      setMyOwnCode(cleaned);
      localStorage.setItem('study_companion_my_own_code', cleaned);
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('syncId', cleaned);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const switchToMyAccount = () => {
    const own = localStorage.getItem('study_companion_my_own_code') || myOwnCode || fullAccessCode;
    switchSyncId(own);
  };

  const createNewSyncSpace = () => {
    const fresh = generateNiceCode();
    switchSyncId(fresh);
  };

  // Code Access Status State (Owner Controls)
  const [fullAccessEnabled, setFullAccessEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_full_access_enabled_${syncId}`);
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  const [viewOnlyEnabled, setViewOnlyEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_view_only_enabled_${syncId}`);
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  // Derived disabled check
  const isCodeDisabled = useMemo(() => {
    if (isReadOnly) {
      return !viewOnlyEnabled;
    } else {
      return !fullAccessEnabled;
    }
  }, [isReadOnly, viewOnlyEnabled, fullAccessEnabled]);

  const toggleFullAccessCodeStatus = async (enabled: boolean) => {
    setFullAccessEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_full_access_enabled_${syncId}`, String(enabled));
    }
    if (isReadOnly) return;
    try {
      await setDoc(doc(db, 'shared_spaces', syncId, 'profile', 'info'), { fullAccessEnabled: enabled }, { merge: true });
    } catch (err) {
      console.warn('Could not sync full access status to Firestore', err);
    }
  };

  const toggleViewOnlyCodeStatus = async (enabled: boolean) => {
    setViewOnlyEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_view_only_enabled_${syncId}`, String(enabled));
    }
    if (isReadOnly) return;
    try {
      await setDoc(doc(db, 'shared_spaces', syncId, 'profile', 'info'), { viewOnlyEnabled: enabled }, { merge: true });
    } catch (err) {
      console.warn('Could not sync view only status to Firestore', err);
    }
  };

  // User Name state (User enterable)
  const [userName, setUserName] = useState<string>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user_name`);
    return saved || 'Scholar';
  });

  const updateUserName = async (newName: string) => {
    const trimmed = newName.trim() || 'Scholar';
    setUserName(trimmed);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user_name`, trimmed);
    if (isReadOnly) return;
    try {
      await setDoc(doc(db, 'shared_spaces', syncId, 'profile', 'info'), { userName: trimmed }, { merge: true });
    } catch (err) {
      console.warn('Could not sync user name to Firestore', err);
    }
  };

  // Theme color state
  const [themeColor, setThemeColorState] = useState<string>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_theme_color`);
    return saved || '#ec4899';
  });

  useEffect(() => {
    applyThemeColor(themeColor);
  }, [themeColor]);

  const setThemeColor = async (colorHex: string) => {
    setThemeColorState(colorHex);
    applyThemeColor(colorHex);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_theme_color`, colorHex);
    if (isReadOnly) return;
    try {
      await setDoc(doc(db, 'shared_spaces', syncId, 'profile', 'info'), { themeColor: colorHex }, { merge: true });
    } catch (err) {
      console.warn('Could not sync theme color to Firestore', err);
    }
  };

  // States
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_subjects`);
    return saved ? JSON.parse(saved) : initialSubjects;
  });
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_timetable`);
    return saved ? JSON.parse(saved) : initialTimetable;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [semesters, setSemesters] = useState<SemesterResult[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_semesters`);
    return saved ? JSON.parse(saved) : initialSemesters;
  });
  const [goals, setGoals] = useState<StudyGoal[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_goals`);
    return saved ? JSON.parse(saved) : initialGoals;
  });
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reminders`);
    return saved ? JSON.parse(saved) : initialReminders;
  });
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_studySessions`);
    return saved ? JSON.parse(saved) : initialStudySessions;
  });
  const [dailyReflections, setDailyReflections] = useState<Record<string, DailyReflection>>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reflections`);
    return saved ? JSON.parse(saved) : {};
  });
  const [extraSkills, setExtraSkills] = useState<ExtraSkill[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_extra_skills`);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist locally for offline fallback
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_subjects`, JSON.stringify(subjects));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_timetable`, JSON.stringify(timetable));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_tasks`, JSON.stringify(tasks));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_semesters`, JSON.stringify(semesters));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_goals`, JSON.stringify(goals));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_events`, JSON.stringify(events));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_reminders`, JSON.stringify(reminders));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_studySessions`, JSON.stringify(studySessions));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_reflections`, JSON.stringify(dailyReflections));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_extra_skills`, JSON.stringify(extraSkills));
  }, [subjects, timetable, tasks, semesters, goals, events, reminders, studySessions, dailyReflections, extraSkills]);

  // Firestore Realtime Subscription for Shared Space
  useEffect(() => {
    setIsSyncing(true);

    const collectionsList = [
      { name: 'subjects', setter: setSubjects, initial: initialSubjects },
      { name: 'timetable', setter: setTimetable, initial: initialTimetable },
      { name: 'tasks', setter: setTasks, initial: initialTasks },
      { name: 'semesters', setter: setSemesters, initial: initialSemesters },
      { name: 'goals', setter: setGoals, initial: initialGoals },
      { name: 'events', setter: setEvents, initial: initialCalendarEvents },
      { name: 'reminders', setter: setReminders, initial: initialReminders },
      { name: 'studySessions', setter: setStudySessions, initial: initialStudySessions },
      { name: 'reflections', setter: (val: any) => { const obj: Record<string, DailyReflection> = {}; val.forEach((r: any) => { obj[r.date] = r; }); setDailyReflections(obj); }, initial: [] },
      { name: 'extra_skills', setter: setExtraSkills, initial: [] },
    ];

    const unsubscribes: (() => void)[] = [];

    collectionsList.forEach(({ name, setter, initial }) => {
      const colRef = collection(db, 'shared_spaces', syncId, name);
      const unsub = onSnapshot(colRef, async (snapshot) => {
        if (snapshot.empty) {
          if (!isReadOnly) {
            const batch = writeBatch(db);
            initial.forEach((item: any) => {
              const itemRef = doc(db, 'shared_spaces', syncId, name, item.id);
              batch.set(itemRef, item);
            });
            await batch.commit().catch(err => console.error(`Error seeding ${name}:`, err));
          }
        } else {
          const docsData = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setter(docsData as any);
        }
        setIsSyncing(false);
      }, (err) => {
        console.warn(`Firestore listener error on ${name}:`, err);
        setIsSyncing(false);
      });
      unsubscribes.push(unsub);
    });

    // Profile info & settings listener
    const profileRef = doc(db, 'shared_spaces', syncId, 'profile', 'info');
    const profileUnsub = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.userName) setUserName(data.userName);
        if (data.themeColor) setThemeColorState(data.themeColor);
        if (typeof data.fullAccessEnabled === 'boolean') {
          setFullAccessEnabled(data.fullAccessEnabled);
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_full_access_enabled_${syncId}`, String(data.fullAccessEnabled));
        }
        if (typeof data.viewOnlyEnabled === 'boolean') {
          setViewOnlyEnabled(data.viewOnlyEnabled);
          localStorage.setItem(`${LOCAL_STORAGE_KEY}_view_only_enabled_${syncId}`, String(data.viewOnlyEnabled));
        }
      }
    });
    unsubscribes.push(profileUnsub);

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [syncId, isReadOnly]);

  // Helper Firestore writers
  const saveToFirestore = async (colName: string, id: string, data: any) => {
    if (isReadOnly) {
      console.warn('Read-Only mode active. Changes not saved to cloud.');
      return;
    }
    try {
      const docRef = doc(db, 'shared_spaces', syncId, colName, id);
      await setDoc(docRef, data, { merge: true });
    } catch (err) {
      console.error(`Firestore save error (${colName}):`, err);
    }
  };

  const removeFromFirestore = async (colName: string, id: string) => {
    if (isReadOnly) {
      console.warn('Read-Only mode active. Delete operation skipped.');
      return;
    }
    try {
      const docRef = doc(db, 'shared_spaces', syncId, colName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error(`Firestore delete error (${colName}):`, err);
    }
  };

  // Subjects Handlers
  const addSubject = async (s: Omit<Subject, 'id'>) => {
    const id = `sub-${Date.now()}`;
    const newSubject: Subject = { ...s, id };
    setSubjects(prev => [newSubject, ...prev]);
    await saveToFirestore('subjects', id, newSubject);
  };
  const updateSubject = async (s: Subject) => {
    setSubjects(prev => prev.map(item => item.id === s.id ? s : item));
    await saveToFirestore('subjects', s.id, s);
  };
  const deleteSubject = async (id: string) => {
    setSubjects(prev => prev.filter(item => item.id !== id));
    await removeFromFirestore('subjects', id);
  };

  const addSubjectGoal = async (subjectId: string, goalData: Omit<SubjectGoal, 'id'>) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    const newGoal: SubjectGoal = {
      ...goalData,
      id: `sg-${Date.now()}`
    };
    const updatedGoals = [...(subject.goals || []), newGoal];
    const updatedSubject = { ...subject, goals: updatedGoals };
    await updateSubject(updatedSubject);
  };

  const updateSubjectGoal = async (subjectId: string, updatedGoal: SubjectGoal) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    const updatedGoals = (subject.goals || []).map(g => g.id === updatedGoal.id ? updatedGoal : g);
    const updatedSubject = { ...subject, goals: updatedGoals };
    await updateSubject(updatedSubject);
  };

  const deleteSubjectGoal = async (subjectId: string, goalId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    const updatedGoals = (subject.goals || []).filter(g => g.id !== goalId);
    const updatedSubject = { ...subject, goals: updatedGoals };
    await updateSubject(updatedSubject);
  };

  const toggleSubjectGoalCompleted = async (subjectId: string, goalId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    const updatedGoals = (subject.goals || []).map(g => {
      if (g.id === goalId) {
        const nextCompleted = !g.completed;
        return {
          ...g,
          completed: nextCompleted,
          currentValue: nextCompleted ? Math.max(g.currentValue, g.targetValue) : g.currentValue
        };
      }
      return g;
    });
    const updatedSubject = { ...subject, goals: updatedGoals };
    await updateSubject(updatedSubject);
  };

  const updateSubjectGoalProgress = async (subjectId: string, goalId: string, newValue: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    const updatedGoals = (subject.goals || []).map(g => {
      if (g.id === goalId) {
        const val = Math.max(0, newValue);
        return {
          ...g,
          currentValue: val,
          completed: val >= g.targetValue
        };
      }
      return g;
    });
    const updatedSubject = { ...subject, goals: updatedGoals };
    await updateSubject(updatedSubject);
  };

  // Timetable Handlers
  const addTimetableSlot = async (slot: Omit<TimetableSlot, 'id'>) => {
    const id = `tt-${Date.now()}`;
    const newSlot: TimetableSlot = { ...slot, id };
    setTimetable(prev => [...prev, newSlot]);
    await saveToFirestore('timetable', id, newSlot);
  };
  const updateTimetableSlot = async (slot: TimetableSlot) => {
    setTimetable(prev => prev.map(item => item.id === slot.id ? slot : item));
    await saveToFirestore('timetable', slot.id, slot);
  };
  const deleteTimetableSlot = async (id: string) => {
    setTimetable(prev => prev.filter(item => item.id !== id));
    await removeFromFirestore('timetable', id);
  };

  // Tasks Handlers
  const addTask = async (t: Omit<Task, 'id'>) => {
    const id = `task-${Date.now()}`;
    const newTask: Task = { ...t, id };
    setTasks(prev => [newTask, ...prev]);
    await saveToFirestore('tasks', id, newTask);
  };
  const updateTask = async (t: Task) => {
    setTasks(prev => prev.map(item => item.id === t.id ? t : item));
    await saveToFirestore('tasks', t.id, t);
  };
  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(item => item.id !== id));
    await removeFromFirestore('tasks', id);
  };
  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const nextStatus = task.status === 'Done' ? 'To Do' : 'Done';
    const updated = { ...task, status: nextStatus as 'To Do' | 'Done' };
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    await saveToFirestore('tasks', id, updated);
  };

  // Semester Handlers
  const addSemester = async (sem: Omit<SemesterResult, 'id'>) => {
    const id = `sem-${Date.now()}`;
    const newSem: SemesterResult = { ...sem, id };
    setSemesters(prev => [newSem, ...prev]);
    await saveToFirestore('semesters', id, newSem);
  };
  const updateSemester = async (sem: SemesterResult) => {
    setSemesters(prev => prev.map(item => item.id === sem.id ? sem : item));
    await saveToFirestore('semesters', sem.id, sem);
  };
  const deleteSemester = async (id: string) => {
    setSemesters(prev => prev.filter(item => item.id !== id));
    await removeFromFirestore('semesters', id);
  };

  // Goals Handlers
  const addGoal = async (g: Omit<StudyGoal, 'id'>) => {
    const id = `goal-${Date.now()}`;
    const newGoal: StudyGoal = { ...g, id };
    setGoals(prev => [newGoal, ...prev]);
    await saveToFirestore('goals', id, newGoal);
  };
  const updateGoal = async (g: StudyGoal) => {
    setGoals(prev => prev.map(item => item.id === g.id ? g : item));
    await saveToFirestore('goals', g.id, g);
  };
  const deleteGoal = async (id: string) => {
    setGoals(prev => prev.filter(item => item.id !== id));
    await removeFromFirestore('goals', id);
  };
  const toggleGoalCompleted = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const updated = { ...goal, completed: !goal.completed };
    setGoals(prev => prev.map(g => g.id === id ? updated : g));
    await saveToFirestore('goals', id, updated);
  };

  // Events Handlers
  const addEvent = async (e: Omit<CalendarEvent, 'id'>) => {
    const id = `ev-${Date.now()}`;
    const newEv: CalendarEvent = { ...e, id };
    setEvents(prev => [newEv, ...prev]);
    await saveToFirestore('events', id, newEv);
  };
  const updateEvent = async (e: CalendarEvent) => {
    setEvents(prev => prev.map(item => item.id === e.id ? e : item));
    await saveToFirestore('events', e.id, e);
  };
  const deleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(item => item.id !== id));
    await removeFromFirestore('events', id);
  };

  // Reminders Handlers
  const addReminder = async (r: Omit<Reminder, 'id'>) => {
    const id = `rem-${Date.now()}`;
    const newRem: Reminder = { ...r, id };
    setReminders(prev => [newRem, ...prev]);
    await saveToFirestore('reminders', id, newRem);
  };
  const updateReminder = async (r: Reminder) => {
    setReminders(prev => prev.map(item => item.id === r.id ? r : item));
    await saveToFirestore('reminders', r.id, r);
  };
  const deleteReminder = async (id: string) => {
    setReminders(prev => prev.filter(item => item.id !== id));
    await removeFromFirestore('reminders', id);
  };
  const toggleReminderCompleted = async (id: string) => {
    const rem = reminders.find(r => r.id === id);
    if (!rem) return;
    const updated = { ...rem, completed: !rem.completed };
    setReminders(prev => prev.map(r => r.id === id ? updated : r));
    await saveToFirestore('reminders', id, updated);
  };

  // Study Sessions Handlers
  const addStudySession = async (session: Omit<StudySession, 'id'>) => {
    const id = `ss-${Date.now()}`;
    const newSession: StudySession = { ...session, id };
    setStudySessions(prev => [newSession, ...prev]);
    await saveToFirestore('studySessions', id, newSession);
  };
  const deleteStudySession = async (id: string) => {
    setStudySessions(prev => prev.filter(item => item.id !== id));
    await removeFromFirestore('studySessions', id);
  };

  // Daily Reflection Handlers
  const saveDailyReflection = async (reflection: DailyReflection) => {
    setDailyReflections(prev => ({ ...prev, [reflection.date]: reflection }));
    await saveToFirestore('reflections', reflection.date, reflection);
  };

  // Extra Skills Handlers
  const addExtraSkill = async (s: Omit<ExtraSkill, 'id'>) => {
    const id = `skill-${Date.now()}`;
    const newSkill: ExtraSkill = { ...s, id };
    setExtraSkills(prev => [newSkill, ...prev]);
    await saveToFirestore('extra_skills', id, newSkill);
  };

  const updateExtraSkill = async (s: ExtraSkill) => {
    setExtraSkills(prev => prev.map(item => item.id === s.id ? s : item));
    await saveToFirestore('extra_skills', s.id, s);
  };

  const deleteExtraSkill = async (id: string) => {
    setExtraSkills(prev => prev.filter(item => item.id !== id));
    await removeFromFirestore('extra_skills', id);
  };

  const clearAllData = async () => {
    setSubjects([]);
    setTimetable([]);
    setTasks([]);
    setSemesters([]);
    setGoals([]);
    setEvents([]);
    setReminders([]);
    setStudySessions([]);
    setDailyReflections({});
    setExtraSkills([]);

    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_subjects`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_timetable`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_semesters`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_goals`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_events`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_reminders`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_studySessions`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_reflections`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_extra_skills`);

    if (!isReadOnly) {
      const collections = ['subjects', 'timetable', 'tasks', 'semesters', 'goals', 'events', 'reminders', 'studySessions', 'reflections', 'extra_skills'];
      for (const colName of collections) {
        try {
          const colRef = collection(db, 'shared_spaces', syncId, colName);
          const snapshot = await getDocs(colRef);
          const batch = writeBatch(db);
          snapshot.docs.forEach((docSnap) => {
            batch.delete(docSnap.ref);
          });
          await batch.commit();
        } catch (e) {
          console.warn(`Error deleting Firestore collection ${colName}:`, e);
        }
      }
    }
  };

  // Run a one-time automated cleanup on first load to ensure a clean start
  useEffect(() => {
    const hasCleared = localStorage.getItem(`${LOCAL_STORAGE_KEY}_has_cleared_first_time`);
    if (!hasCleared) {
      clearAllData().then(() => {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_has_cleared_first_time`, 'true');
      });
    }
  }, [syncId]);

  // Global Search Engine
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const results: SearchResultItem[] = [];

    subjects.forEach(s => {
      if (s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query) || (s.instructor && s.instructor.toLowerCase().includes(query))) {
        results.push({
          id: s.id,
          type: 'subject',
          title: `${s.code} - ${s.name}`,
          subtitle: `Instructor: ${s.instructor || 'N/A'} • ${s.completedTopics}/${s.totalTopics} Topics Completed`,
          tag: s.code,
          color: s.color,
          tab: 'subjects'
        });
      }
    });

    tasks.forEach(t => {
      if (t.title.toLowerCase().includes(query) || t.subject.toLowerCase().includes(query) || (t.description && t.description.toLowerCase().includes(query))) {
        results.push({
          id: t.id,
          type: 'task',
          title: t.title,
          subtitle: `Due: ${t.dueDate} • Priority: ${t.priority} • Status: ${t.status}`,
          tag: t.subject,
          color: '#F48FB1',
          tab: 'tasks'
        });
      }
    });

    events.forEach(e => {
      if (e.title.toLowerCase().includes(query) || e.subject.toLowerCase().includes(query) || (e.description && e.description.toLowerCase().includes(query))) {
        results.push({
          id: e.id,
          type: 'event',
          title: e.title,
          subtitle: `Date: ${e.date} • Type: ${e.type} (${e.subject})`,
          tag: e.type,
          color: '#FFCDD2',
          tab: 'calendar'
        });
      }
    });

    timetable.forEach(slot => {
      if (slot.subjectName.toLowerCase().includes(query) || slot.day.toLowerCase().includes(query) || (slot.room && slot.room.toLowerCase().includes(query))) {
        results.push({
          id: slot.id,
          type: 'timetable',
          title: `${slot.subjectName} (${slot.day})`,
          subtitle: `${slot.startTime} - ${slot.endTime} • Room: ${slot.room || 'N/A'}`,
          tag: slot.day,
          color: slot.subjectColor,
          tab: 'timetable'
        });
      }
    });

    return results;
  }, [searchQuery, subjects, tasks, events, timetable]);

  // Overall Statistics Computations
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Today study minutes
    const totalStudyMinutesToday = studySessions
      .filter(s => s.date === todayStr)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);

    // Week study minutes
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const totalStudyMinutesWeek = studySessions
      .filter(s => new Date(s.date) >= startOfWeek)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);

    // Streak calculation
    const sessionDates = Array.from(new Set(studySessions.map(s => s.date))).sort().reverse();
    let currentStreakDays = 0;
    let checkDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sessionDates.includes(dateStr)) {
        currentStreakDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        // Check if yesterday had a streak
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    if (currentStreakDays === 0 && sessionDates.length > 0) {
      currentStreakDays = 1; // Friendly minimum baseline
    }

    // Tasks completed vs total
    const completedTasksCount = tasks.filter(t => t.status === 'Done').length;
    const pendingTasksCount = tasks.filter(t => t.status !== 'Done').length;

    // Overall CGPA
    let totalGradePointsCredits = 0;
    let totalCreditsAccumulated = 0;
    semesters.forEach(sem => {
      sem.courses.forEach(c => {
        if (!c.isPending && c.grade !== 'Pending') {
          totalGradePointsCredits += (c.gradePoint * c.credits);
          totalCreditsAccumulated += c.credits;
        }
      });
    });
    const overallCGPA = totalCreditsAccumulated > 0 ? Number((totalGradePointsCredits / totalCreditsAccumulated).toFixed(2)) : 'N/A';

    // Upcoming exams
    const upcomingExamsCount = events.filter(e => e.type === 'Exam' && e.date >= todayStr).length;

    return {
      totalStudyMinutesToday,
      totalStudyMinutesWeek,
      currentStreakDays,
      completedTasksCount,
      pendingTasksCount,
      overallCGPA,
      upcomingExamsCount
    };
  }, [studySessions, tasks, semesters, events]);

  return (
    <StudyContext.Provider value={{
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      syncId,
      fullAccessCode,
      viewOnlyCode,
      activeCode,
      isReadOnly,
      shareableUrl,
      myOwnCode,
      fullAccessEnabled,
      viewOnlyEnabled,
      isCodeDisabled,
      toggleFullAccessCodeStatus,
      toggleViewOnlyCodeStatus,
      switchSyncId,
      switchToMyAccount,
      createNewSyncSpace,
      subjects,
      addSubject,
      updateSubject,
      deleteSubject,
      addSubjectGoal,
      updateSubjectGoal,
      deleteSubjectGoal,
      toggleSubjectGoalCompleted,
      updateSubjectGoalProgress,
      timetable,
      addTimetableSlot,
      updateTimetableSlot,
      deleteTimetableSlot,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      semesters,
      addSemester,
      updateSemester,
      deleteSemester,
      goals,
      addGoal,
      updateGoal,
      deleteGoal,
      toggleGoalCompleted,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      reminders,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleReminderCompleted,
      studySessions,
      addStudySession,
      deleteStudySession,
      dailyReflections,
      saveDailyReflection,
      extraSkills,
      addExtraSkill,
      updateExtraSkill,
      deleteExtraSkill,
      searchResults,
      userName,
      updateUserName,
      themeColor,
      setThemeColor,
      clearAllData,
      stats,
      isSyncing
    }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
