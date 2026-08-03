export type TabType = 
  | 'dashboard'
  | 'timetable'
  | 'subjects'
  | 'tasks'
  | 'semesters'
  | 'goals'
  | 'calendar'
  | 'reminders'
  | 'productivity'
  | 'extra-skills';

export interface SubjectGoal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  totalTopics: number;
  completedTopics: number;
  targetGrade: string;
  credits: number;
  instructor?: string;
  room?: string;
  goals?: SubjectGoal[];
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  subjectName: string;
  subjectColor: string;
  room?: string;
  type?: 'Lecture' | 'Lab' | 'Tutorial' | 'Self Study';
  excludeFromCalculation?: boolean;
  isCompleted?: boolean;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Done';
  description?: string;
}

export interface CourseGrade {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string; // e.g. "A+", "A", "B+", etc.
  gradePoint: number; // e.g. 4.0, 3.7
  marks?: number; // percentage or marks out of 100
  mstMarks?: number; // Mid-Semester Test / Internal Assessment Marks out of 20
  mst1?: number; // Mid-Semester Test 1 Marks
  mst2?: number; // Mid-Semester Test 2 Marks
  theory?: number; // Theory marks out of 60
  teacherAssessment?: number; // Teacher's internal assessment marks out of 20
  courseType?: 'Theory' | 'Lab'; // Course delivery type
  isPending?: boolean; // Whether the result is pending
}

export interface SemesterResult {
  id: string;
  semesterName: string; // e.g. "Fall 2025 - Semester 3"
  sgpa: number;
  totalCredits: number;
  courses: CourseGrade[];
  startMonth?: number; // 1 - 12 (January - December)
  endMonth?: number;   // 1 - 12 (January - December)
  startYear?: number;
  endYear?: number;
  status?: 'current' | 'past';
  isLocked?: boolean;
}

export interface StudyGoal {
  id: string;
  title: string;
  targetHours: number;
  currentHours: number;
  deadline: string; // YYYY-MM-DD
  category: 'Daily' | 'Weekly' | 'Monthly' | 'Exam Prep';
  completed: boolean;
}

export type ExamCategory = 'MST (20 Marks)' | 'Final (100 Marks)' | 'Quiz / Minor (10-30 Marks)' | 'Other Exam';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'Exam' | 'Assignment' | 'Quiz' | 'Project' | 'Important';
  examCategory?: ExamCategory;
  totalMarks?: number; // e.g., 20 or 100
  subject: string;
  description?: string;
}

export interface Reminder {
  id: string;
  title: string;
  dateTime: string; // ISO string or YYYY-MM-DDTHH:mm
  type: 'Assignment' | 'Exam' | 'Study Session' | 'General';
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface StudySession {
  id: string;
  subject: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface DailyReflection {
  date: string; // YYYY-MM-DD
  notes: string;
  rating: number; // 1 to 5
  mood: 'Productive' | 'Focused' | 'Tired' | 'Stressed' | 'Confident';
}

export interface SearchResultItem {
  id: string;
  type: 'subject' | 'task' | 'event' | 'timetable';
  title: string;
  subtitle: string;
  tag?: string;
  color?: string;
  tab: TabType;
}

export interface ExtraSkill {
  id: string;
  courseName: string;
  status: 'Ongoing' | 'Pending' | 'Completed';
  hoursGiven: number;
  courseUrl?: string;
  isLocked?: boolean;
}

