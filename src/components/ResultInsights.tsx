import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  BrainCircuit, 
  Target, 
  Lightbulb, 
  Zap, 
  BarChart3, 
  PieChart as PieChartIcon,
  Compass, 
  Flame, 
  BookOpen, 
  RefreshCw,
  Calculator,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Layers,
  Quote
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell,
  Legend 
} from 'recharts';
import { SemesterResult, CourseGrade } from '../types';
import { getCoolCGPATag, getRandomMotivationalQuote } from '../utils/cgpaHelpers';
import { 
  CuteCatBooks, CutePandaCoding, CuteStudyBear, CuteCoffeeMug, 
  CuteMagicStar, CuteGoalBullseye, CutePencilHappy, CuteOwlSmart 
} from './CuteImages';

interface ResultInsightsProps {
  semesters: SemesterResult[];
  overallCGPA: number | 'N/A';
}

const getSubjectSticker = (name: string) => {
  const lowercase = name.toLowerCase();
  if (lowercase.includes('math') || lowercase.includes('calc') || lowercase.includes('algebra') || lowercase.includes('stat') || lowercase.includes('quant')) {
    return <CuteOwlSmart size={44} className="animate-bounce" style={{ animationDuration: '6s' }} />;
  }
  if (lowercase.includes('cod') || lowercase.includes('comput') || lowercase.includes('program') || lowercase.includes('software') || lowercase.includes('web') || lowercase.includes('tech') || lowercase.includes('databas') || lowercase.includes('sql') || lowercase.includes('python') || lowercase.includes('java') || lowercase.includes('c++') || lowercase.includes('js')) {
    return <CutePandaCoding size={44} className="animate-bounce" style={{ animationDuration: '5s' }} />;
  }
  if (lowercase.includes('english') || lowercase.includes('read') || lowercase.includes('write') || lowercase.includes('lit') || lowercase.includes('histor') || lowercase.includes('lang') || lowercase.includes('social') || lowercase.includes('communicat') || lowercase.includes('management') || lowercase.includes('business')) {
    return <CuteCatBooks size={44} className="animate-bounce" style={{ animationDuration: '7s' }} />;
  }
  if (lowercase.includes('scienc') || lowercase.includes('physic') || lowercase.includes('chemist') || lowercase.includes('biolog') || lowercase.includes('lab') || lowercase.includes('experi') || lowercase.includes('circuit') || lowercase.includes('electronic') || lowercase.includes('electri')) {
    return <CutePencilHappy size={44} className="animate-bounce" style={{ animationDuration: '6.5s' }} />;
  }
  // Default cute sticker
  return <CuteStudyBear size={44} className="animate-bounce" style={{ animationDuration: '5.5s' }} />;
};

type InsightTab = 'calculator' | 'sem_insights' | 'charts' | 'matrix' | 'strengths' | 'ai_advisor';

export const ResultInsights: React.FC<ResultInsightsProps> = ({ semesters, overallCGPA }) => {
  const [activeTab, setActiveTab] = useState<InsightTab>('calculator');
  const [selectedSemId, setSelectedSemId] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Month range helpers
  const getMonthLabel = (m?: number): string => {
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (m === undefined) return '';
    return MONTH_NAMES[m - 1] || '';
  };

  const isSemActiveNow = (sem: SemesterResult): boolean => {
    if (sem.startMonth === undefined || sem.endMonth === undefined) return false;
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const start = sem.startMonth;
    const end = sem.endMonth;
    if (start <= end) {
      return currentMonth >= start && currentMonth <= end;
    } else {
      return currentMonth >= start || currentMonth <= end;
    }
  };

  // Sync selectedSemId when semesters change or load
  useEffect(() => {
    if (semesters.length > 0) {
      const exists = semesters.some(s => s.id === selectedSemId);
      if (!selectedSemId || !exists) {
        // Find semester that matches the current date's month
        const detected = semesters.find(isSemActiveNow);
        if (detected) {
          setSelectedSemId(detected.id);
        } else {
          setSelectedSemId(semesters[semesters.length - 1].id);
        }
      }
    } else {
      setSelectedSemId('');
    }
  }, [semesters, selectedSemId]);
  
  // Dynamic Motivational Quote state
  const [currentQuote, setCurrentQuote] = useState<string>(() => getRandomMotivationalQuote());
  
  // Calculate Cool CGPA Tag
  const cgpaTagInfo = getCoolCGPATag(overallCGPA);

  const handleRefreshQuote = () => {
    setCurrentQuote(getRandomMotivationalQuote());
  };

  // Target Calculator state
  const [calcSubjectType, setCalcSubjectType] = useState<'theory' | 'lab'>('theory');
  const [mst1Score, setMst1Score] = useState<number>(16);
  const [mst2Score, setMst2Score] = useState<number>(16);
  const [internalScore, setInternalScore] = useState<number>(16);
  const [labInternalScore, setLabInternalScore] = useState<number>(50);
  const [calcTargetGrade, setCalcTargetGrade] = useState<'O' | 'A+' | 'A' | 'B+'>('O');

  // Collect all courses across all semesters
  const allCourses: CourseGrade[] = semesters.flatMap(s => s.courses);

  // MST Analytics
  const coursesWithMst = allCourses.filter(c => !c.isPending && c.grade !== 'Pending' && c.mstMarks !== undefined && c.mstMarks !== null);
  const totalMstMarks = coursesWithMst.reduce((acc, c) => acc + (c.mstMarks || 0), 0);
  const avgMstScore = coursesWithMst.length > 0 ? (totalMstMarks / coursesWithMst.length) : 0;
  const avgMstPercentage = (avgMstScore / 20) * 100;

  // Highest and lowest MST
  const highestMstCourse = [...coursesWithMst].sort((a, b) => (b.mstMarks || 0) - (a.mstMarks || 0))[0];
  const lowestMstCourse = [...coursesWithMst].sort((a, b) => (a.mstMarks || 0) - (b.mstMarks || 0))[0];

  // Identify Strengths & Weaknesses for 10-point scale
  const strengths = allCourses.filter(c => !c.isPending && c.grade !== 'Pending' && ((c.gradePoint >= 8.0) || ((c.mstMarks || 0) >= 17.5) || ((c.marks || 0) >= 85)));
  const focusAreas = allCourses.filter(c => !c.isPending && c.grade !== 'Pending' && ((c.gradePoint < 8.0) || ((c.mstMarks || 0) < 17) || ((c.marks || 0) < 80)));

  // Prepare data for SGPA trend line chart
  const sgpaTrendData = semesters
    .filter(s => !(s.courses.length > 0 && s.courses.every(c => c.isPending || c.grade === 'Pending')))
    .map(s => ({
      name: s.semesterName.split('-')[0].trim(),
      SGPA: s.sgpa,
      Credits: s.totalCredits
    }));

  // Vibrant color palette for Pie Charts
  const PIE_COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4', '#f43f5e', '#a855f7', '#14b8a6', '#6366f1'];

  // Prepare data for MST Marks Contribution Pie Chart
  const mstPieData = allCourses
    .filter(c => !c.isPending && c.grade !== 'Pending')
    .map(c => ({
      name: c.courseCode || c.courseName.slice(0, 8),
      fullName: c.courseName,
      value: c.mstMarks ?? 0,
    })).filter(d => d.value > 0);

  // Prepare data for Final Marks Breakdown Pie Chart
  const finalPieData = allCourses
    .filter(c => !c.isPending && c.grade !== 'Pending')
    .map(c => ({
      name: c.courseCode || c.courseName.slice(0, 8),
      fullName: c.courseName,
      value: c.marks ?? 0,
    })).filter(d => d.value > 0);

  // Target Final Exam Score Calculator Logic
  // Formula:
  // - Theory Subjects: 100 Marks overall = MST Avg (20 marks) + Teacher Internal Assessment (estimated to be equal to MST Avg, 20 marks) + Theory Paper External Exam (60 marks)
  // - Lab Subjects: 100 Marks overall = Continuous Internal Evaluation (60 marks) + External Lab Exam / Viva / Practical (40 marks)
  // Target thresholds: Target O = 90 marks overall, Target A+ = 80 marks, Target A = 70 marks, Target B+ = 60 marks
  const targetThreshold = calcTargetGrade === 'O' ? 90 : calcTargetGrade === 'A+' ? 80 : calcTargetGrade === 'A' ? 70 : 60;

  // Theory calculations
  const calcMstAvg = (mst1Score + mst2Score) / 2;
  const estimatedTeacherAssessment = calcMstAvg; // Estimated teacher assessment is equal to MST average when unknown
  const currentTheoryInternalContribution = calcMstAvg + estimatedTeacherAssessment; // max 40 points (20 MST average + 20 estimated teacher internal assessment)
  const requiredTheoryScore = Math.max(0, targetThreshold - currentTheoryInternalContribution);

  // Lab calculations
  const requiredLabExternalScore = Math.max(0, targetThreshold - labInternalScore);

  // Generate local AI guidance function
  const handleGenerateAiCounsel = async () => {
    setIsGenerating(true);
    setAiAnalysis(null);

    setTimeout(() => {
      const topStr = strengths.map(s => s.courseName).slice(0, 2).join(', ');
      const weakStr = focusAreas.map(f => f.courseName).slice(0, 2).join(', ');

      const cgpaText = overallCGPA === 'N/A' 
        ? 'is currently **N/A** (No grades entered yet)' 
        : `is sitting strong at **${overallCGPA} / 10.0**`;

      const summary = `
🎯 **Academic Trajectory & MST Assessment Report (10.0 GPA Scale)**:
Your CGPA ${cgpaText} with an average Mid-Semester Test (MST) internal score of **${avgMstScore.toFixed(1)} / 20 (${avgMstPercentage.toFixed(1)}%)**.

🌟 **Key Dominance Areas**:
You show exceptional mastery in **${topStr || 'core analytical modules'}**. Your high MST internal papers in these courses demonstrate strong early-semester concept retention.

💡 **Targeted Final Exam Improvement Vectors**:
In courses like **${weakStr || 'newer electives'}**, internal assessment papers show slight scoring leakage. Since MST accounts for 20-30% of total internal grade weightage, improving your MST average to **18.5/20** in remaining subjects will directly safeguard your final SGPA.

🚀 **Subject-Wise Final Exam Recommendations**:
1. **High Buffer Subjects (MST ≥ 18/20)**: Focus 70% of exam prep on complex application questions and previous year end-term papers to maintain Grade O / A+.
2. **Moderate Buffer Subjects (MST 15-17.5/20)**: Aim for at least **65 / 80** in final exams to convert these subjects into solid A+ / A grades.
3. **Recovery Focus Subjects (MST < 15/20)**: Allocate dedicated 45-minute daily active recall sessions specifically addressing internal test error patterns.
      `.trim();

      setAiAnalysis(summary);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* HORIZONTAL INSIGHTS NAVIGATION BAR */}
      <div className="bg-white/95 backdrop-blur-md rounded-[22px] border border-pink-100 p-2 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar sticky top-2 z-20">
        {[
          { id: 'calculator' as InsightTab, label: '🧮 Exam Calculator', icon: Calculator },
          { id: 'sem_insights' as InsightTab, label: '📅 Semester Marksheets', icon: BookOpen, badge: semesters.length },
          { id: 'charts' as InsightTab, label: '📊 Trends & Charts', icon: TrendingUp },
          { id: 'matrix' as InsightTab, label: '🎯 Subject Strategy', icon: ShieldCheck, badge: allCourses.length },
          { id: 'strengths' as InsightTab, label: '🌟 Strengths & Growth', icon: CheckCircle2 },
          { id: 'ai_advisor' as InsightTab, label: '🧠 AI Strategy & Plan', icon: BrainCircuit },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-200/60 scale-[1.02]'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-pink-500'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SEMESTER-WISE INSIGHTS & ANALYSIS */}
      {activeTab === 'sem_insights' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {semesters.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-dashed border-pink-200 p-12 text-center">
              <BookOpen className="w-10 h-10 text-pink-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-gray-700">No semesters recorded yet</h3>
              <p className="text-xs text-gray-400 mt-1">Add semester marks to view semester-wise analysis and current term action plans.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Semester Selector Pills */}
              <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-[20px] border border-pink-100 shadow-xs">
                <span className="text-xs font-bold text-gray-700 mr-2">Select Semester:</span>
                {semesters.map((sem, idx) => {
                  const isActive = isSemActiveNow(sem);
                  const isLastIdx = idx === semesters.length - 1;
                  const isSelected = selectedSemId === sem.id;
                  const monthRangeStr = sem.startMonth && sem.endMonth ? ` (${getMonthLabel(sem.startMonth)} - ${getMonthLabel(sem.endMonth)})` : '';
                  return (
                    <button
                      key={sem.id}
                      onClick={() => setSelectedSemId(sem.id)}
                      className={`px-4 py-2 rounded-[14px] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-200'
                          : 'bg-pink-50/50 text-gray-700 hover:bg-pink-100'
                      }`}
                    >
                      <span>{sem.semesterName}{monthRangeStr}</span>
                      {isActive ? (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${isSelected ? 'bg-white/30 text-white animate-pulse' : 'bg-emerald-100 text-emerald-700 border border-emerald-250'}`}>
                          ⚡ Active
                        </span>
                      ) : isLastIdx ? (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${isSelected ? 'bg-white/20 text-white' : 'bg-pink-200 text-pink-800'}`}>
                          Latest
                        </span>
                      ) : (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          Past
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {(() => {
                const activeSem = semesters.find(s => s.id === selectedSemId) || semesters[semesters.length - 1];
                if (!activeSem) return null;
                const isActiveSemester = isSemActiveNow(activeSem);
                const isLatestSem = semesters[semesters.length - 1].id === activeSem.id;
                const isCurrentSem = isActiveSemester || isLatestSem;

                return (
                  <div className="bg-white rounded-[24px] border border-pink-100 p-6 shadow-sm shadow-pink-100/40 space-y-6 relative overflow-hidden group">
                    {/* Cute Mascot Sticker */}
                    <div className="absolute right-48 -bottom-1 opacity-95 pointer-events-none select-none hidden lg:block animate-bounce" style={{ animationDuration: '6.5s' }}>
                      <CuteCatBooks size={64} />
                    </div>

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100 relative z-10">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg font-extrabold text-gray-800">{activeSem.semesterName} Analysis</h2>
                          {isActiveSemester ? (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 animate-pulse">
                              <span>⚡ Current Active Semester</span>
                              <span className="text-[10px] font-normal opacity-85">(Based on present date)</span>
                            </span>
                          ) : isLatestSem ? (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-pink-100 text-pink-700 border border-pink-200">
                              🌟 Latest Semester (Active Action Plan & Suggestions)
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-gray-100 text-gray-700 border border-gray-200">
                              📚 Past Semester Record (Result Analysis Only)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Total Credits Registered: <strong className="text-gray-700">{activeSem.totalCredits}</strong> • SGPA Achieved: <strong className="text-pink-600">{activeSem.sgpa}</strong>
                        </p>
                      </div>

                      <div className="bg-pink-50 border border-pink-200 px-5 py-2.5 rounded-[18px] text-center shrink-0">
                        <span className="text-[10px] font-bold text-pink-500 uppercase block">Semester SGPA</span>
                        <span className="text-xl font-black text-pink-700">
                          {activeSem.courses.length > 0 && activeSem.courses.every(c => c.isPending || c.grade === 'Pending') ? 'Pending' : `${activeSem.sgpa} / 10.0`}
                        </span>
                      </div>
                    </div>

                    {/* Course Breakdown Table */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Course Performance & MST Internal Breakdown</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-pink-100 text-pink-500 font-bold uppercase tracking-wider text-[10px]">
                              <th className="py-2.5 px-3">Course Code</th>
                              <th className="py-2.5 px-3">Course Title</th>
                              <th className="py-2.5 px-3 text-center">Credits</th>
                              <th className="py-2.5 px-3 text-center">MST 1</th>
                              <th className="py-2.5 px-3 text-center">MST 2</th>
                              <th className="py-2.5 px-3 text-center">Int /20</th>
                              <th className="py-2.5 px-3 text-center">Theory (/60)</th>
                              <th className="py-2.5 px-3 text-center">Final (/100)</th>
                              <th className="py-2.5 px-3 text-center">Grade</th>
                              <th className="py-2.5 px-3 text-center">GP</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-pink-50 font-medium text-gray-700">
                            {activeSem.courses.map((c) => (
                              <tr key={c.id} className="hover:bg-pink-50/40 transition-colors">
                                <td className="py-2.5 px-3 font-bold text-pink-600">{c.courseCode || 'N/A'}</td>
                                <td className="py-2.5 px-3 font-semibold text-gray-800">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                                    <span>{c.courseName}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border inline-block w-fit ${
                                      c.courseType === 'Lab'
                                        ? 'bg-purple-50 text-purple-600 border-purple-150'
                                        : 'bg-blue-50 text-blue-600 border-blue-150'
                                    }`}>
                                      {c.courseType || 'Theory'}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-center">{c.credits}</td>
                                <td className="py-2.5 px-3 text-center font-bold text-gray-600">
                                  {c.courseType === 'Lab' ? (
                                    <span className="text-gray-400 font-normal italic">N/A</span>
                                  ) : (
                                    c.mst1 !== undefined ? c.mst1 : (c.mstMarks !== undefined ? c.mstMarks : '-')
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold text-gray-600">
                                  {c.courseType === 'Lab' ? (
                                    <span className="text-gray-400 font-normal italic">N/A</span>
                                  ) : (
                                    c.mst2 !== undefined ? c.mst2 : (c.mstMarks !== undefined ? c.mstMarks : '-')
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold text-gray-600">
                                  {c.courseType === 'Lab' ? (
                                    <span className="text-gray-400 font-normal italic">N/A</span>
                                  ) : (
                                    c.teacherAssessment !== undefined ? c.teacherAssessment : '-'
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold text-gray-600">
                                  {c.courseType === 'Lab' ? (
                                    <span className="text-gray-400 font-normal italic">N/A</span>
                                  ) : (
                                    c.theory !== undefined ? `${c.theory} / 60` : '-'
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-extrabold text-pink-700">
                                  {c.isPending || c.grade === 'Pending' ? (
                                    <span className="text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200 animate-pulse text-[10px]">Pending</span>
                                  ) : (
                                    c.marks !== undefined ? `${c.marks} / 100` : '-'
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-extrabold text-pink-600">
                                  <span className={`px-2 py-0.5 rounded-lg text-[11px] font-black border ${
                                    c.isPending || c.grade === 'Pending'
                                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse'
                                      : 'bg-pink-100 text-pink-700 border-pink-200'
                                  }`}>
                                    {c.grade}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold text-gray-500">
                                  {c.isPending || c.grade === 'Pending' ? (
                                    <span className="text-gray-400 italic">Pending</span>
                                  ) : (
                                    c.gradePoint
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* CONDITIONAL SUGGESTIONS & TIPS */}
                    {isCurrentSem ? (
                      <div className="bg-gradient-to-r from-pink-50 via-white to-pink-50 rounded-[20px] border-2 border-pink-200 p-5 space-y-4">
                        <div className="flex items-center gap-2 text-pink-700 font-extrabold text-sm">
                          <Sparkles className="w-5 h-5 text-pink-500" />
                          <span>Current Semester Strategic Suggestions & Action Plan</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Tailored recommendations to maximize your final grade outcomes for this active semester:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3.5 bg-white rounded-xl border border-pink-100 shadow-2xs space-y-1">
                            <div className="text-xs font-bold text-pink-600">🎯 MST Internal Optimization</div>
                            <p className="text-[11px] text-gray-600">
                              Target 18+/20 in upcoming internal tests to secure a comfortable buffer for end-sem exams.
                            </p>
                          </div>
                          <div className="p-3.5 bg-white rounded-xl border border-pink-100 shadow-2xs space-y-1">
                            <div className="text-xs font-bold text-pink-600">📚 High-Credit Priority</div>
                            <p className="text-[11px] text-gray-600">
                              Allocate 60% of daily study blocks to courses with 4+ credits to maximize SGPA impact.
                            </p>
                          </div>
                          <div className="p-3.5 bg-white rounded-xl border border-pink-100 shadow-2xs space-y-1">
                            <div className="text-xs font-bold text-pink-600">⏱️ Active Recall Sessions</div>
                            <p className="text-[11px] text-gray-600">
                              Practice timed 45-minute past exam paper sessions weekly to build strong exam stamina.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-[20px] border border-gray-200 p-4 text-center">
                        <p className="text-xs font-bold text-gray-600">✓ Past Semester Archived Record</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Result analysis complete. No active suggestions or tips needed for archived past semesters.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* 1. TARGET GRADE CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-gradient-to-r from-pink-50 via-white to-pink-50 rounded-[24px] border-2 border-pink-200 p-6 shadow-xs animate-in fade-in duration-200 space-y-6 relative overflow-hidden group">
          {/* Cute Mascot Sticker */}
          <div className="absolute right-64 -bottom-1 opacity-90 pointer-events-none select-none hidden lg:block animate-bounce" style={{ animationDuration: '8s' }}>
            <CuteOwlSmart size={64} />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-pink-500" />
                <span>Smart Multi-Component Exam Grade Calculator</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Calculate necessary target marks across Internal components and External exam papers to hit your desired letter grades.
              </p>
            </div>
            
            {/* Subject Type Toggle */}
            <div className="flex items-center bg-pink-100/50 p-1 rounded-xl border border-pink-200 self-stretch md:self-auto">
              <button
                type="button"
                onClick={() => setCalcSubjectType('theory')}
                className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  calcSubjectType === 'theory'
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                📖 Theory Subject
              </button>
              <button
                type="button"
                onClick={() => setCalcSubjectType('lab')}
                className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  calcSubjectType === 'lab'
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                🧪 Lab Subject
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* INPUTS COLUMN */}
            <div className="lg:col-span-8 space-y-4 bg-white p-5 rounded-[20px] border border-pink-100 shadow-2xs">
              <div className="flex items-center justify-between border-b border-pink-50 pb-2 mb-3">
                <span className="text-xs font-bold text-gray-700">Enter Your Current Performance Marks</span>
                <span className="text-[10px] font-black uppercase text-pink-500 px-2.5 py-0.5 bg-pink-50 rounded-full">
                  {calcSubjectType === 'theory' ? 'Theory Scheme (40% Int / 60% Ext)' : 'Lab Scheme (60% Int / 40% Ext)'}
                </span>
              </div>

              {calcSubjectType === 'theory' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* MST 1 */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-600">MST 1 Marks (/20)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="20"
                      value={mst1Score}
                      onChange={e => setMst1Score(Math.min(20, Math.max(0, Number(e.target.value))))}
                      className="w-full px-3 py-2 bg-pink-50/20 border-2 border-pink-100 hover:border-pink-200 focus:border-pink-500 focus:outline-none rounded-xl text-xs font-bold text-gray-800"
                    />
                    <span className="text-[10px] text-gray-400 block">First internal mid-sem test</span>
                  </div>

                  {/* MST 2 */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-600">MST 2 Marks (/20)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="20"
                      value={mst2Score}
                      onChange={e => setMst2Score(Math.min(20, Math.max(0, Number(e.target.value))))}
                      className="w-full px-3 py-2 bg-pink-50/20 border-2 border-pink-100 hover:border-pink-200 focus:border-pink-500 focus:outline-none rounded-xl text-xs font-bold text-gray-800"
                    />
                    <span className="text-[10px] text-gray-400 block">Second internal mid-sem test</span>
                  </div>

                  {/* Internal Assessment (Teacher Assessment) */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-pink-600">Teacher Assessment (/20)</label>
                    <div className="w-full px-3 py-2 bg-pink-50/50 border-2 border-pink-100 rounded-xl text-xs font-extrabold text-pink-700 flex items-center justify-between">
                      <span>{calcMstAvg.toFixed(1)} / 20</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-pink-100 rounded text-pink-600 font-bold uppercase">Estimated</span>
                    </div>
                    <span className="text-[10px] text-gray-400 block">Automatically estimated as equal to your MST Average since it is unknown before results!</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-gray-600">Continuous Internal Evaluation (/60)</label>
                    <span className="text-xs font-bold text-pink-600">{labInternalScore} / 60</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="1"
                    value={labInternalScore}
                    onChange={e => setLabInternalScore(Number(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="0"
                      max="60"
                      step="0.5"
                      value={labInternalScore}
                      onChange={e => setLabInternalScore(Math.min(60, Math.max(0, Number(e.target.value))))}
                      className="w-24 px-2 py-1 bg-pink-50/20 border border-pink-100 focus:border-pink-500 focus:outline-none rounded-lg text-xs font-bold text-gray-800"
                    />
                    <span className="text-[10px] text-gray-400 self-center">Lab journals, attendance, weekly experiments, vivas</span>
                  </div>
                </div>
              )}

              {/* Target Grade Selector */}
              <div className="pt-3 border-t border-pink-50">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Desired Target Letter Grade</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['O', 'A+', 'A', 'B+'] as const).map(grade => {
                    const threshold = grade === 'O' ? 90 : grade === 'A+' ? 80 : grade === 'A' ? 70 : 60;
                    const isSelected = calcTargetGrade === grade;
                    return (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setCalcTargetGrade(grade)}
                        className={`py-2 px-3 rounded-xl border text-xs font-extrabold text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-transparent shadow-xs'
                            : 'bg-white text-gray-700 border-pink-100 hover:bg-pink-50/50'
                        }`}
                      >
                        <div className="text-sm">{grade}</div>
                        <div className={`text-[9px] font-medium mt-0.5 ${isSelected ? 'text-pink-100' : 'text-gray-400'}`}>
                          {threshold}+ Marks
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* OUTPUT COMPONENT */}
            <div className="lg:col-span-4 bg-white rounded-[20px] border border-pink-200 p-5 flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden group">
              {/* Cute Mascot Sticker overlay */}
              <div className="absolute -right-3 -bottom-3 opacity-20 pointer-events-none select-none transition-transform duration-300 group-hover:scale-110 z-0">
                <CuteGoalBullseye size={56} />
              </div>

              <div className="space-y-3 relative z-10">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Required Exam Score</div>
                
                {calcSubjectType === 'theory' ? (
                  <div className="space-y-4">
                    {/* Theory results */}
                    <div className="text-center p-4 bg-pink-50/40 rounded-xl border border-pink-100">
                      <span className="text-[10px] font-bold text-pink-500 block uppercase mb-1">Theory Paper Needed</span>
                      <div className="text-3xl font-black text-pink-700">
                        {requiredTheoryScore.toFixed(1)} <span className="text-xs font-bold text-gray-500">/ 60</span>
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500 block mt-1">
                        ({((requiredTheoryScore / 60) * 100).toFixed(1)}% needed in external exam)
                      </span>
                    </div>

                    {/* Component breakdown list */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>MST Average (20%):</span>
                        <strong className="text-gray-800">{calcMstAvg.toFixed(1)} / 20</strong>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Est. Teacher Assessment (20%):</span>
                        <strong className="text-gray-800">{estimatedTeacherAssessment.toFixed(1)} / 20</strong>
                      </div>
                      <div className="flex justify-between text-pink-600 font-bold border-t border-dashed border-pink-100 pt-1.5">
                        <span>Total Internals Contribution:</span>
                        <span>{currentTheoryInternalContribution.toFixed(1)} / 40</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Lab results */}
                    <div className="text-center p-4 bg-pink-50/40 rounded-xl border border-pink-100">
                      <span className="text-[10px] font-bold text-pink-500 block uppercase mb-1">External Lab Viva / Exam Needed</span>
                      <div className="text-3xl font-black text-pink-700">
                        {requiredLabExternalScore.toFixed(1)} <span className="text-xs font-bold text-gray-500">/ 40</span>
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500 block mt-1">
                        ({((requiredLabExternalScore / 40) * 100).toFixed(1)}% needed in viva/practical)
                      </span>
                    </div>

                    {/* Component breakdown list */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>Continuous Evaluation:</span>
                        <strong className="text-gray-800">{labInternalScore} / 60</strong>
                      </div>
                      <div className="flex justify-between text-pink-600 font-bold border-t border-dashed border-pink-100 pt-1.5">
                        <span>Total Internals (60%):</span>
                        <span>{labInternalScore} / 60</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status / Feasibility Badge */}
              {(() => {
                const requiredExternal = calcSubjectType === 'theory' ? requiredTheoryScore : requiredLabExternalScore;
                const maxExternal = calcSubjectType === 'theory' ? 60 : 40;
                const isPossible = requiredExternal <= maxExternal;

                return (
                  <div className={`p-3 rounded-xl border text-xs ${
                    isPossible 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    <div className="font-extrabold flex items-center gap-1.5 mb-0.5">
                      <span className={`w-2 h-2 rounded-full ${isPossible ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {isPossible ? 'Feasible Target!' : 'Unfeasible Target'}
                    </div>
                    <p className="text-[11px] leading-relaxed text-opacity-90">
                      {isPossible 
                        ? `A total mark of ${targetThreshold} is fully achievable. Maintain focus on the external exam paper to hit Grade ${calcTargetGrade}!`
                        : `To get Grade ${calcTargetGrade}, you would need ${requiredExternal.toFixed(1)} marks in external components, which exceeds the max limits of ${maxExternal} marks. Consider picking a different target.`
                      }
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 2. CHARTS SECTION */}
      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Chart 1: SGPA Progression Line Chart */}
          <div className="bg-white rounded-[24px] border border-pink-100 shadow-xs p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-pink-500" />
                  <span>Semester SGPA Trend</span>
                </h3>
                <p className="text-[11px] text-gray-500">GPA progression across completed semesters</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-pink-50 text-pink-600 rounded-full border border-pink-100">
                CGPA: {overallCGPA}
              </span>
            </div>

            <div className="h-56 w-full">
              {sgpaTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sgpaTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fce4ec" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                    <YAxis domain={[5.0, 10.0]} stroke="#888888" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#f8bbd0', fontSize: '12px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="SGPA" 
                      stroke="#f06292" 
                      strokeWidth={3} 
                      dot={{ fill: '#f06292', r: 5 }} 
                      activeDot={{ r: 7 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                  No semester data to plot trend line.
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Pie Chart for MST Marks Contribution */}
          <div className="bg-white rounded-[24px] border border-pink-100 shadow-xs p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-pink-500" />
                  <span>MST Marks Analysis</span>
                </h3>
                <p className="text-[11px] text-gray-500">Subject-wise share in total MST marks</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-pink-50 text-pink-600 rounded-full border border-pink-100">
                /20 Marks
              </span>
            </div>

            <div className="h-56 w-full">
              {mstPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mstPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={35}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {mstPieData.map((entry, index) => (
                        <Cell key={`mst-cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any, name: any, item: any) => [`${val} / 20 MST Marks`, item.payload.fullName]}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#f8bbd0', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                  No MST marks available to generate pie chart.
                </div>
              )}
            </div>
          </div>

          {/* Chart 3: Pie Chart for Final Marks Analysis */}
          <div className="bg-white rounded-[24px] border border-pink-100 shadow-xs p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-purple-500" />
                  <span>Final Marks Analysis</span>
                </h3>
                <p className="text-[11px] text-gray-500">Subject-wise share in total final marks</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100">
                /100 Marks
              </span>
            </div>

            <div className="h-56 w-full">
              {finalPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={finalPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={35}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {finalPieData.map((entry, index) => (
                        <Cell key={`final-cell-${index}`} fill={PIE_COLORS[(index + 3) % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any, name: any, item: any) => [`${val} / 100 Marks`, item.payload.fullName]}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e9d5ff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                  No Final marks available to generate pie chart.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. DETAILED SUBJECT-BY-SUBJECT INSIGHTS MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-[24px] border border-pink-100 p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-pink-500" />
                <span>Subject-Wise MST Scores & Focus Targets</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Detailed breakdown of internal MST scores, current grade, and required final exam target per subject.
              </p>
            </div>
            <span className="text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
              {allCourses.length} Subjects Evaluated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allCourses.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-xs text-gray-400">Add subject marks to view subject-wise targets.</p>
              </div>
            ) : (
              allCourses.map((c) => {
                const isLab = c.courseType === 'Lab';
                const m1 = c.mst1 ?? 0;
                const m2 = c.mst2 ?? 0;
                const mstAvg = Math.round((m1 + m2) / 2);
                const teacher = c.teacherAssessment ?? 0;
                const currentInternal = mstAvg + teacher; // out of 40 (MST avg + internal assessment)
                
                const reqTheoryForO = isLab ? 90 : Math.min(60, Math.max(0, 90 - currentInternal));

                return (
                  <div 
                    key={c.id} 
                    className="p-6 bg-gradient-to-br from-pink-50/30 via-white to-pink-50/10 rounded-[22px] border border-pink-100 hover:border-pink-300 hover:shadow-md hover:shadow-pink-100/40 transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
                  >
                    {/* Cute Subject Specific Sticker */}
                    <div className="absolute right-4 top-4 opacity-80 pointer-events-none select-none">
                      {getSubjectSticker(c.courseName)}
                    </div>

                    <div className="space-y-3 relative z-10 pr-12">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black text-pink-600 bg-pink-100 px-2 py-0.5 rounded-md">
                            {c.courseCode || 'SUB'}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider ${
                            isLab
                              ? 'bg-purple-50 text-purple-600 border-purple-150'
                              : 'bg-blue-50 text-blue-600 border-blue-150'
                          }`}>
                            {c.courseType || 'Theory'}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-gray-800 mt-1.5 leading-snug">{c.courseName}</h4>
                        <p className="text-[11px] text-gray-500 font-medium mt-1">
                          Credits: <strong className="text-pink-600">{c.credits}</strong> • Current Grade: <strong className="text-pink-600">{c.grade || 'Not Set'}</strong> ({c.gradePoint || 0} GP)
                        </p>
                      </div>

                      {/* Subject-Wise MST & Final Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <div className="bg-pink-50/70 px-3 py-1.5 rounded-xl border border-pink-100 text-center shrink-0">
                          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-0.5">MST Internal</span>
                          <span className="text-[11px] font-black text-pink-700">
                            {isLab ? (
                              <span className="text-purple-600 font-bold">N/A (Lab)</span>
                            ) : (
                              c.mst1 !== undefined || c.mst2 !== undefined ? (
                                `M1: ${c.mst1 ?? 0} | M2: ${c.mst2 ?? 0}`
                              ) : c.mstMarks !== undefined ? (
                                `${c.mstMarks} / 20`
                              ) : 'Not Set'
                            )}
                          </span>
                        </div>

                        {!isLab && c.teacherAssessment !== undefined && (
                          <div className="bg-pink-50/70 px-3 py-1.5 rounded-xl border border-pink-100 text-center shrink-0">
                            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-0.5">Int /20</span>
                            <span className="text-[11px] font-black text-pink-700">
                              {c.teacherAssessment} / 20
                            </span>
                          </div>
                        )}

                        <div className="bg-emerald-50/70 px-3 py-1.5 rounded-xl border border-emerald-100 text-center shrink-0">
                          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-0.5">Final Marks</span>
                          <span className="text-[11px] font-black text-emerald-700">
                            {c.marks !== undefined ? `${c.marks} / 100` : '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subject Focus Target & Strategy Bar */}
                    <div className="space-y-2 pt-3 border-t border-pink-50 relative z-10">
                      <div className="flex items-start gap-2 text-xs text-gray-700 bg-white p-3 rounded-xl border border-pink-100/80 shadow-3xs">
                        <Target className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold text-pink-600 block text-[10px] uppercase tracking-wider mb-0.5">Subject Focus Target</span>
                          {isLab ? (
                            <span className="text-[11px]">Lab course evaluated out of 100. Target score of <strong className="text-pink-700">90+</strong> for <strong className="text-pink-700">Grade O</strong>.</span>
                          ) : (
                            <span className="text-[11px]">Need <strong className="text-pink-700">{reqTheoryForO} / 60</strong> in theory exam for <strong className="text-pink-700">Grade O (90+)</strong></span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-gray-700 bg-white p-3 rounded-xl border border-pink-100/80 shadow-3xs">
                        <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold text-amber-600 block text-[10px] uppercase tracking-wider mb-0.5">Strategy Note</span>
                          <span className="text-[11px] leading-relaxed block text-gray-600">
                            {isLab ? (
                              '🧪 Lab subjects are continuous evaluation. Optimize records and viva sessions.'
                            ) : (
                              currentInternal >= 35 
                                ? '🔥 Excellent MST internal score! Maintain momentum with mock papers.' 
                                : currentInternal >= 28 
                                  ? '⚡ Solid MST base! Target 45+ marks in final end-sem paper.' 
                                  : '⚠️ Spend 30 mins/day reviewing core weak areas before final.'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 4. STRENGTHS & WEAKNESSES IDENTIFICATION */}
      {activeTab === 'strengths' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-[22px] border border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Semester-Wise Strengths & Focus Areas</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Analyze your performance achievements and areas needing support for each semester individually.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-150">
              {semesters.length} Semesters Logged
            </span>
          </div>

          {semesters.length === 0 ? (
            <div className="bg-white rounded-[22px] border border-dashed border-pink-200 p-12 text-center">
              <p className="text-xs text-gray-400">Please record semester marks first to visualize your semester-wise academic strengths & growth.</p>
            </div>
          ) : (
            semesters.map((sem) => {
              // Extract strengths and focus areas for this specific semester
              const semCourses = sem.courses || [];
              const semStrengths = semCourses.filter(c => {
                const finalMarks = c.marks ?? 0;
                const mst = c.mstMarks ?? Math.max(c.mst1 ?? 0, c.mst2 ?? 0);
                return (c.grade && ['O', 'A+', 'A'].includes(c.grade)) || finalMarks >= 75 || mst >= 17;
              });
              const semFocusAreas = semCourses.filter(c => {
                const finalMarks = c.marks ?? 0;
                // Needs improvement if final marks < 75 or grade is below A, or MST is low
                return !semStrengths.some(s => s.id === c.id);
              });

              return (
                <div key={sem.id} className="bg-white rounded-[24px] border border-pink-100 shadow-sm p-6 space-y-6">
                  {/* Semester Header */}
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-pink-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-50 rounded-xl">
                        <Award className="w-5 h-5 text-pink-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-gray-800">{sem.semesterName}</h4>
                        <p className="text-[11px] text-gray-500">
                          {semCourses.length} Subjects • GPA: <strong>{sem.gpa || 'N/A'}</strong>
                        </p>
                      </div>
                    </div>
                    {/* Cute dynamic sticker for this semester */}
                    <div className="shrink-0">
                      <CuteStudyBear size={40} className="animate-pulse" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Strengths Column */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs">
                        <CheckCircle2 className="w-4.5 h-4.5" />
                        <span>Achievements & Core Strengths</span>
                      </div>
                      
                      <div className="space-y-3">
                        {semStrengths.length === 0 ? (
                          <p className="text-xs text-gray-400 py-3 italic">No subjects matching strengths criteria in this semester yet.</p>
                        ) : (
                          semStrengths.map(c => (
                            <div key={c.id} className="p-4 bg-emerald-50/40 rounded-[20px] border border-emerald-100/80 flex items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                    {c.courseCode || 'SUB'}
                                  </span>
                                  <p className="text-xs font-bold text-gray-800">{c.courseName}</p>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">
                                  Grade: <strong className="text-emerald-700">{c.grade || '-'}</strong> • Marks: <strong>{c.marks !== undefined ? `${c.marks}/100` : '-'}</strong>
                                </p>
                              </div>
                              
                              <div className="text-right shrink-0">
                                <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-250">
                                  MST Avg: {c.mstMarks !== undefined ? `${c.mstMarks}/20` : `${Math.max(c.mst1 ?? 0, c.mst2 ?? 0)}/20`}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Focus Areas Column */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-amber-600 font-extrabold text-xs">
                        <AlertTriangle className="w-4.5 h-4.5" />
                        <span>Opportunities for Growth & Buffer Boosting</span>
                      </div>
                      
                      <div className="space-y-3">
                        {semFocusAreas.length === 0 ? (
                          <div className="p-4 bg-pink-50/30 rounded-[20px] border border-dashed border-pink-100 text-center">
                            <p className="text-xs font-bold text-pink-600">🎉 Flawless Semester Run!</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">Every course is in outstanding standing!</p>
                          </div>
                        ) : (
                          semFocusAreas.map(c => (
                            <div key={c.id} className="p-4 bg-amber-50/40 rounded-[20px] border border-amber-100 flex items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                                    {c.courseCode || 'SUB'}
                                  </span>
                                  <p className="text-xs font-bold text-gray-800">{c.courseName}</p>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">
                                  Grade: <strong className="text-amber-750">{c.grade || '-'}</strong> • Focus on internal mid-sem revisions
                                </p>
                              </div>
                              
                              <div className="text-right shrink-0">
                                <span className="text-[10px] font-black text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-250">
                                  MST Avg: {c.mstMarks !== undefined ? `${c.mstMarks}/20` : `${Math.max(c.mst1 ?? 0, c.mst2 ?? 0)}/20`}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 5. DYNAMIC MOTIVATIONAL QUOTE & ACADEMIC STATUS + AI ADVISOR */}
      {activeTab === 'ai_advisor' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Dynamic Motivational Quote & CGPA Tag Banner - Redesigned to be MINIMAL & ORGANIZED */}
          <div className="bg-white rounded-[24px] border border-pink-100 p-6 shadow-sm space-y-4 relative overflow-hidden group">
            {/* Cute Mascot Sticker overlay - subtle floating */}
            <div className="absolute right-4 bottom-4 opacity-15 pointer-events-none select-none hidden md:block">
              <CutePandaCoding size={72} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-50 pb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-pink-50 rounded-xl text-pink-500">
                  <Quote className="w-5 h-5 rotate-180" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold tracking-wide text-gray-800">Daily Academic Motivation</h2>
                  <p className="text-[10px] text-gray-400 font-medium">Inspirational thoughts to power your revision sessions</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* CGPA Badge */}
                <div className={`px-3 py-1 rounded-full text-[11px] ${cgpaTagInfo.badgeBg} ${cgpaTagInfo.badgeTextColor} shadow-2xs font-bold border border-pink-100 flex items-center gap-1.5`}>
                  <span>{cgpaTagInfo.emoji}</span>
                  <span>{cgpaTagInfo.tag}</span>
                </div>

                {/* Refresh Quote Button */}
                <button
                  onClick={handleRefreshQuote}
                  className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-pink-50 active:scale-95 text-pink-600 rounded-xl text-[11px] font-bold transition-all cursor-pointer border border-pink-200"
                  title="Click for a new motivational quote!"
                >
                  <RefreshCw className="w-3 h-3 text-pink-500" />
                  <span>New Quote</span>
                </button>
              </div>
            </div>

            {/* Dynamic Quote Box - Refined */}
            <div className="p-4 bg-pink-50/20 rounded-[18px] border border-pink-100/50 shadow-2xs relative z-10">
              <p className="text-xs sm:text-sm font-bold italic text-pink-700 leading-relaxed text-center">
                "{currentQuote}"
              </p>
            </div>

            {/* Habit Pillars - Minimal and Organized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 relative z-10">
              <div className="bg-white p-3.5 rounded-[16px] border border-pink-50 shadow-2xs">
                <div className="text-[11px] font-black text-pink-600 uppercase tracking-wider mb-1">1. MST Focus</div>
                <p className="text-[11px] font-medium text-gray-600">Target ≥ 18/20 internal marks across all course modules.</p>
              </div>
              <div className="bg-white p-3.5 rounded-[16px] border border-pink-50 shadow-2xs">
                <div className="text-[11px] font-black text-pink-600 uppercase tracking-wider mb-1">2. Credit Priority</div>
                <p className="text-[11px] font-medium text-gray-600">Allocate study hours weighted by course credits.</p>
              </div>
              <div className="bg-white p-3.5 rounded-[16px] border border-pink-50 shadow-2xs">
                <div className="text-[11px] font-black text-pink-600 uppercase tracking-wider mb-1">3. Timed Revision</div>
                <p className="text-[11px] font-medium text-gray-600">Solve past papers under timed 45-minute constraints.</p>
              </div>
              <div className="bg-white p-3.5 rounded-[16px] border border-pink-50 shadow-2xs">
                <div className="text-[11px] font-black text-pink-600 uppercase tracking-wider mb-1">4. Spaced Practice</div>
                <p className="text-[11px] font-medium text-gray-600">Review key formulas within 48h of lecture notes.</p>
              </div>
            </div>
          </div>

          {/* AI Academic Advisor Counsel Block */}
          <div className="bg-white rounded-[24px] border border-pink-100 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-pink-500" />
                <h3 className="font-extrabold text-gray-800 text-sm">AI Academic Counselor & Actionable Tips</h3>
              </div>
              <button
                onClick={handleGenerateAiCounsel}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isGenerating ? 'Analyzing Performance...' : 'Generate AI Strategy Report'}</span>
              </button>
            </div>

            {aiAnalysis ? (
              <div className="p-5 bg-pink-50/30 rounded-[18px] border border-pink-150 text-xs text-gray-700 leading-relaxed whitespace-pre-line font-medium animate-in fade-in duration-300">
                {aiAnalysis}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="p-4 bg-pink-50/25 rounded-[18px] border border-pink-100 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600">
                    <Lightbulb className="w-4 h-4 text-pink-500" />
                    <span>20-Min MST Paper Formula</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    In 20-mark MST tests, start with high-value 5-mark conceptual questions first to guarantee 70% marks in the first 20 minutes.
                  </p>
                </div>

                <div className="p-4 bg-pink-50/25 rounded-[18px] border border-pink-100 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600">
                    <Target className="w-4 h-4 text-pink-500" />
                    <span>Internal Assessment Buffer</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Securing 18+/20 in MST internal papers gives you a safety cushion for end-term final exams, reducing final exam pressure.
                  </p>
                </div>

                <div className="p-4 bg-pink-50/25 rounded-[18px] border border-pink-100 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600">
                    <Compass className="w-4 h-4 text-pink-500" />
                    <span>Semester Goal Tracking</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Log subject assignment deadlines in the Tasks view to prevent last-minute submissions from hurting your internal grade.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
