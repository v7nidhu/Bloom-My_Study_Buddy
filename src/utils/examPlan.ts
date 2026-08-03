import { CalendarEvent } from '../types';

export interface ExamAdaptivePlan {
  daysLeft: number;
  stageTitle: string;
  stageBadge: string;
  urgencyBg: string;
  urgencyText: string;
  urgencyBorder: string;
  targetHoursPerDay: string;
  primaryFocus: string;
  studyTips: string[];
  countdownRoadmap: { dayLabel: string; task: string; isToday?: boolean }[];
}

export function getExamAdaptivePlan(event: CalendarEvent): ExamAdaptivePlan {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const examDate = new Date(event.date);
  examDate.setHours(0, 0, 0, 0);

  const diffTime = examDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isMST = event.examCategory === 'MST (20 Marks)' || event.totalMarks === 20 || event.title.toLowerCase().includes('mst') || event.title.toLowerCase().includes('midterm');
  const isFinal = event.examCategory === 'Final (100 Marks)' || event.totalMarks === 100 || event.title.toLowerCase().includes('final') || event.title.toLowerCase().includes('end sem');

  // Past exam
  if (daysLeft < 0) {
    return {
      daysLeft,
      stageTitle: 'Exam Completed',
      stageBadge: 'Finished',
      urgencyBg: 'bg-gray-100',
      urgencyText: 'text-gray-600',
      urgencyBorder: 'border-gray-200',
      targetHoursPerDay: '0 hrs',
      primaryFocus: 'Review performance and log results in Semester Results section.',
      studyTips: [
        'Record your obtained marks in Results & GPA when available.',
        'Reflect on which study techniques worked best during prep.'
      ],
      countdownRoadmap: []
    };
  }

  // Today (0 days left)
  if (daysLeft === 0) {
    return {
      daysLeft: 0,
      stageTitle: 'EXAM DAY TODAY! 🔥',
      stageBadge: 'TODAY!',
      urgencyBg: 'bg-rose-500',
      urgencyText: 'text-white',
      urgencyBorder: 'border-rose-600',
      targetHoursPerDay: '30 mins (Quick Review)',
      primaryFocus: 'Peak focus, mental calm, and strategic time allocation during the test.',
      studyTips: isMST ? [
        '20 Marks Strategy: Solve short 2-mark questions first (10 mins max).',
        'Spend 15 mins each on long 5-mark conceptual/numerical questions.',
        'Keep formulas & key definitions crisp in mind.',
        'Stay calm and double check your numerical calculations.'
      ] : [
        '100 Marks Strategy: Read entire paper in first 5 minutes.',
        'Answer questions with highest marks and confidence first.',
        'Pace yourself: 3 hours = ~1.8 mins per mark. Leave 15 mins for review.',
        'Write clean headers, diagrams, and step-by-step working.'
      ],
      countdownRoadmap: [
        { dayLabel: 'Morning', task: '30-min formula card scan + healthy breakfast' },
        { dayLabel: '30m Before', task: 'Deep breathing, review key diagrams, arrive early' },
        { dayLabel: 'Exam Time', task: 'Execute test strategy and allocate time per mark' }
      ]
    };
  }

  // 1 to 2 days left
  if (daysLeft <= 2) {
    return {
      daysLeft,
      stageTitle: 'Final Rush & High-Yield Review (1-2 Days Left)',
      stageBadge: '🔥 URGENT',
      urgencyBg: 'bg-red-50',
      urgencyText: 'text-red-700',
      urgencyBorder: 'border-red-300',
      targetHoursPerDay: isMST ? '1.5 - 2 hrs/day' : '3 - 4 hrs/day',
      primaryFocus: isMST ? 'Memorizing key 20-mark formulas, definitions & past 3-year questions.' : 'Comprehensive formula cheatsheets, high-weightage diagrams & 100-mark mock practice.',
      studyTips: isMST ? [
        'Review 20-mark expected questions & key definitions.',
        'Practice drawing key diagrams & derivations on scratch paper.',
        'Do NOT start new complex topics now—solidify existing knowledge.',
        'Ensure 7-8 hours of sleep tonight for sharp focus.'
      ] : [
        'Scan condensed formula sheets for all 5-8 units.',
        'Review mistakes from recent 100-mark mock papers.',
        'Practice timed diagram drawing and 10-mark long answer structure.',
        'Prepare exam kit: Admit card, stationary, calculator, water bottle.'
      ],
      countdownRoadmap: [
        { dayLabel: 'Today', task: isMST ? 'Formula & definition rapid fire review' : 'Full formula sheet review + past error correction', isToday: true },
        { dayLabel: `In ${daysLeft} Day(s)`, task: 'Exam Day Execution' }
      ]
    };
  }

  // 3 to 6 days left
  if (daysLeft <= 6) {
    return {
      daysLeft,
      stageTitle: 'Targeted Revision & Practice (3-6 Days Left)',
      stageBadge: '⚡ HIGH FOCUS',
      urgencyBg: 'bg-amber-50',
      urgencyText: 'text-amber-800',
      urgencyBorder: 'border-amber-300',
      targetHoursPerDay: isMST ? '1.5 - 2 hrs/day' : '2.5 - 3.5 hrs/day',
      primaryFocus: isMST ? 'Solving 20-mark sample questions under 45-min time limits.' : 'Solving past 5 years 100-mark question papers & strengthening weak chapters.',
      studyTips: isMST ? [
        'Solve 3 sets of 20-mark MST sample papers.',
        'Focus on short answer accuracy (2-mark questions build quick scores).',
        'Timer-based Pomodoro sessions: 25 mins study, 5 mins break.'
      ] : [
        'Attempt a full 3-hour timed 100-mark mock exam in exam conditions.',
        'Focus 70% study time on high-weightage units (Units 1, 3 & 5).',
        'Refine step-by-step problem-solving methods.'
      ],
      countdownRoadmap: [
        { dayLabel: 'Day -3', task: isMST ? 'Solve 20-mark past papers' : 'Full 3-hour 100-mark mock test', isToday: true },
        { dayLabel: 'Day -2', task: 'Weak topic patch-up & diagram practice' },
        { dayLabel: 'Day -1', task: 'High-yield formula cheatsheet scan' }
      ]
    };
  }

  // 7 to 13 days left
  if (daysLeft <= 13) {
    return {
      daysLeft,
      stageTitle: 'Deep Study & Active Recall (7-13 Days Left)',
      stageBadge: '📈 ACTIVE PREP',
      urgencyBg: 'bg-pink-50',
      urgencyText: 'text-pink-800',
      urgencyBorder: 'border-pink-300',
      targetHoursPerDay: isMST ? '1 hr/day' : '2 - 3 hrs/day',
      primaryFocus: isMST ? 'Covering 2 syllabus units thoroughly + creating 1-page summary notes.' : 'Mastering all 5-8 units + active recall for complex theories and mathematical derivations.',
      studyTips: isMST ? [
        'Break MST syllabus into 2 main modules.',
        'Summarize each topic into a 1-page formula & key points sheet.',
        'Discuss difficult concepts with peers or generate AI summary notes.'
      ] : [
        'Allocate 1.5 days per unit for full coverage.',
        'Use flashcards and active recall for heavy theory units.',
        'Solve textbook exercise problems and numerical examples.'
      ],
      countdownRoadmap: [
        { dayLabel: `Day -${daysLeft}`, task: isMST ? 'Module 1 thorough study + notes' : 'Unit 1 & 2 deep revision + numericals', isToday: true },
        { dayLabel: 'Day -7', task: 'Past paper problem solving' },
        { dayLabel: 'Day -3', task: 'Mock exam & targeted revision' }
      ]
    };
  }

  // > 14 days left
  return {
    daysLeft,
    stageTitle: 'Foundation & Early Roadmap (14+ Days Left)',
    stageBadge: '🌱 EARLY PREP',
    urgencyBg: 'bg-emerald-50',
    urgencyText: 'text-emerald-800',
    urgencyBorder: 'border-emerald-300',
    targetHoursPerDay: isMST ? '45 mins/day' : '1.5 hrs/day',
    primaryFocus: isMST ? 'Organizing MST syllabus notes and establishing a relaxed daily study routine.' : 'Creating a master 14-day study schedule and collecting past papers & lecture slides.',
    studyTips: isMST ? [
      'Confirm MST syllabus coverage (usually 2-3 units).',
      'Collect all lecture slides, class notes, and assignment solutions.',
      'Log 45-minute daily study sessions in the Pomodoro Timer.'
    ] : [
      'Create a balanced daily schedule covering 1 unit every 2 days.',
      'Gather all 100-mark previous year question papers.',
      'Identify your strongest and weakest topics early.'
    ],
    countdownRoadmap: [
      { dayLabel: 'Phase 1 (>14d)', task: 'Syllabus mapping & notes collection', isToday: true },
      { dayLabel: 'Phase 2 (14d-7d)', task: 'Core unit revision & active recall' },
      { dayLabel: 'Phase 3 (7d-1d)', task: 'Past papers, mock exams & final rush' }
    ]
  };
}
