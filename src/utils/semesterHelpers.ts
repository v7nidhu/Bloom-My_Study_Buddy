import { SemesterResult } from '../types';

export const isSemActiveNow = (sem: SemesterResult): boolean => {
  if (sem.status === 'current') return true;
  if (sem.status === 'past') return false;

  if (sem.startMonth === undefined || sem.endMonth === undefined) return false;
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();

  // If years are specified, verify using both month and year
  if (sem.startYear !== undefined && sem.endYear !== undefined) {
    const startVal = sem.startYear * 12 + (sem.startMonth - 1);
    const endVal = sem.endYear * 12 + (sem.endMonth - 1);
    const curVal = currentYear * 12 + (currentMonth - 1);
    return curVal >= startVal && curVal <= endVal;
  }

  const start = sem.startMonth;
  const end = sem.endMonth;
  if (start <= end) {
    return currentMonth >= start && currentMonth <= end;
  } else {
    return currentMonth >= start || currentMonth <= end;
  }
};

export const getLatestOrActiveSemester = (semesters: SemesterResult[], targetId?: string): SemesterResult | null => {
  if (!semesters || semesters.length === 0) return null;

  if (targetId) {
    const found = semesters.find(s => s.id === targetId);
    if (found) return found;
  }

  // 1. Explicitly marked 'current'
  const currentStatusSems = semesters.filter(s => s.status === 'current');
  if (currentStatusSems.length > 0) {
    return currentStatusSems[currentStatusSems.length - 1];
  }

  // 2. Active by date range
  const activeSems = semesters.filter(s => isSemActiveNow(s));
  if (activeSems.length > 0) {
    return activeSems[activeSems.length - 1];
  }

  // 3. Exclude 'past' marked semesters if possible, or sort by latest semester number
  const nonPast = semesters.filter(s => s.status !== 'past');
  const pool = nonPast.length > 0 ? nonPast : semesters;

  // Sort by semester number (e.g., "Semester 4" > "Semester 1") or endYear/created order
  const sorted = [...pool].sort((a, b) => {
    const numA = parseInt(a.semesterName.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.semesterName.replace(/\D/g, ''), 10) || 0;
    if (numA !== numB) return numA - numB;
    return (a.endYear || 0) - (b.endYear || 0);
  });

  return sorted[sorted.length - 1];
};
