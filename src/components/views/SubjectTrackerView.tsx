import React, { useState } from 'react';
import { 
  BookOpenCheck, Plus, Trash2, Edit2, CheckCircle2, User, MapPin, 
  Award, Target, Calendar, Minus, Sparkles, Check, ChevronDown, ChevronUp, DownloadCloud 
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Subject, SubjectGoal } from '../../types';
import { getLatestOrActiveSemester } from '../../utils/semesterHelpers';
import { SubjectGoalModal } from '../modals/SubjectGoalModal';
import { ThreeDCard } from '../ThreeDBackground';
import { 
  CuteCatBooks, CutePandaCoding, CuteStudyBear, CuteCoffeeMug, 
  CuteMagicStar, CuteGoalBullseye, CutePencilHappy, CuteOwlSmart 
} from '../CuteImages';

interface SubjectTrackerViewProps {
  onOpenModal: (type: 'subject', initialData?: Subject) => void;
}

export const SubjectTrackerView: React.FC<SubjectTrackerViewProps> = ({ onOpenModal }) => {
  const { 
    subjects, addSubject, deleteSubject, updateSubject, 
    semesters,
    addSubjectGoal, updateSubjectGoal, deleteSubjectGoal, 
    toggleSubjectGoalCompleted, updateSubjectGoalProgress, isReadOnly
  } = useStudy();

  // Notification / Toast state for importing subjects
  const [importNotification, setImportNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // State for Subject Goal Modal
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedSubjectForGoal, setSelectedSubjectForGoal] = useState<Subject | null>(null);
  const [editingSubjectGoal, setEditingSubjectGoal] = useState<SubjectGoal | null>(null);

  // State for inline numeric progress editing (goalId -> string input)
  const [editingProgressValue, setEditingProgressValue] = useState<{ [goalId: string]: string }>({});

  // Collapsible state for goals per subject (default expanded)
  const [collapsedSubjects, setCollapsedSubjects] = useState<{ [subjectId: string]: boolean }>({});

  const toggleSubjectCollapsed = (subjectId: string) => {
    setCollapsedSubjects(prev => ({ ...prev, [subjectId]: !prev[subjectId] }));
  };

  // State for selected semester ID when fetching subjects
  const [selectedSemesterForFetch, setSelectedSemesterForFetch] = useState<string>('');

  const handleFetchSemesterSubjects = async (overrideSemId?: string) => {
    setImportNotification(null);

    const targetId = overrideSemId || selectedSemesterForFetch || undefined;
    // Get current/latest active semester
    const activeSem = getLatestOrActiveSemester(semesters, targetId);

    if (!activeSem || !activeSem.courses || activeSem.courses.length === 0) {
      setImportNotification({
        type: 'error',
        message: activeSem 
          ? `No courses found in "${activeSem.semesterName}". Add courses in Semester Marksheets first.`
          : 'No current semester found! Add a semester in Semester Marksheets first.'
      });
      setTimeout(() => setImportNotification(null), 5000);
      return;
    }

    const pastelColors = [
      '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9', '#BBDEFB', 
      '#B2EBF2', '#C8E6C9', '#DCEDC8', '#FFF9C4', '#FFE0B2'
    ];

    let importedCount = 0;
    for (let i = 0; i < activeSem.courses.length; i++) {
      const course = activeSem.courses[i];
      const exists = subjects.some(
        s => s.name.trim().toLowerCase() === course.courseName.trim().toLowerCase() ||
             (course.courseCode && s.code && s.code.trim().toLowerCase() === course.courseCode.trim().toLowerCase())
      );

      if (!exists) {
        const color = pastelColors[(subjects.length + importedCount) % pastelColors.length];
        await addSubject({
          name: course.courseName,
          code: course.courseCode || '',
          credits: course.credits || 3,
          color: color,
          totalTopics: 10,
          completedTopics: 0,
          targetGrade: (course.grade && course.grade !== 'Pending') ? course.grade : 'A+',
          goals: []
        });
        importedCount++;
      }
    }

    if (importedCount > 0) {
      setImportNotification({
        type: 'success',
        message: `Successfully imported ${importedCount} subject(s) from "${activeSem.semesterName}"!`
      });
    } else {
      setImportNotification({
        type: 'info',
        message: `All ${activeSem.courses.length} subject(s) from "${activeSem.semesterName}" are already in your Subject Tracker.`
      });
    }
    setTimeout(() => setImportNotification(null), 5000);
  };

  const handleOpenAddGoal = (subject: Subject) => {
    if (isReadOnly) return;
    setSelectedSubjectForGoal(subject);
    setEditingSubjectGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (subject: Subject, goal: SubjectGoal) => {
    if (isReadOnly) return;
    setSelectedSubjectForGoal(subject);
    setEditingSubjectGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (goalData: Omit<SubjectGoal, 'id'> | SubjectGoal) => {
    if (isReadOnly || !selectedSubjectForGoal) return;

    if ('id' in goalData) {
      updateSubjectGoal(selectedSubjectForGoal.id, goalData as SubjectGoal);
    } else {
      addSubjectGoal(selectedSubjectForGoal.id, goalData);
    }
  };

  // Progress manual change helpers
  const handleGoalStepChange = (subjectId: string, goal: SubjectGoal, step: number) => {
    if (isReadOnly) return;
    const newVal = Math.max(0, goal.currentValue + step);
    updateSubjectGoalProgress(subjectId, goal.id, newVal);
  };

  const handleDirectProgressSubmit = (subjectId: string, goal: SubjectGoal) => {
    if (isReadOnly) return;
    const rawVal = editingProgressValue[goal.id];
    if (rawVal !== undefined && rawVal !== '') {
      const parsed = parseInt(rawVal, 10);
      if (!isNaN(parsed)) {
        updateSubjectGoalProgress(subjectId, goal.id, Math.max(0, parsed));
      }
    }
    // Clear editing state for this goal
    setEditingProgressValue(prev => {
      const copy = { ...prev };
      delete copy[goal.id];
      return copy;
    });
  };

  // Calculate overall summary metrics
  const totalGoals = subjects.reduce((acc, s) => acc + (s.goals?.length || 0), 0);
  const completedGoals = subjects.reduce((acc, s) => acc + (s.goals?.filter(g => g.completed).length || 0), 0);
  const overallGoalPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/50 relative overflow-hidden group">
        {/* Cute Mascot Sticker */}
        <div className="absolute right-48 -bottom-1 opacity-90 pointer-events-none select-none hidden lg:block animate-bounce" style={{ animationDuration: '7s' }}>
          <CuteOwlSmart size={64} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-pink-500" />
            <h1 className="text-xl font-bold text-gray-800">Subject Tracker & Goals</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Track syllabus completion, manage target grades, and define subject-wise study goals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto relative z-10">
          {totalGoals > 0 && (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-pink-50/70 border border-pink-200/60 rounded-[16px] text-xs font-bold text-pink-700">
              <Target className="w-4 h-4 text-pink-500" />
              <span>Goals: {completedGoals}/{totalGoals} ({overallGoalPercentage}%)</span>
            </div>
          )}

          {(() => {
            const targetSemesterToFetch = getLatestOrActiveSemester(semesters, selectedSemesterForFetch);
            return (
              <div className="flex items-center gap-1 bg-pink-50 border border-pink-200 rounded-[16px] p-1 shadow-2xs">
                {semesters.length > 1 && (
                  <select
                    value={targetSemesterToFetch?.id || ''}
                    onChange={(e) => setSelectedSemesterForFetch(e.target.value)}
                    className="px-2 py-1 bg-white text-xs font-bold text-pink-900 border border-pink-200 rounded-[12px] outline-none cursor-pointer max-w-[140px] truncate"
                    title="Select semester to fetch subjects from"
                  >
                    {semesters.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.semesterName} {s.status === 'current' ? '⭐ (Current)' : ''}
                      </option>
                    ))}
                  </select>
                )}
                {!isReadOnly && (
                  <button
                    onClick={() => handleFetchSemesterSubjects()}
                    className="flex items-center gap-2 px-3 py-1.5 text-pink-700 hover:bg-pink-100 rounded-[12px] text-xs font-bold cursor-pointer transition-all active:scale-95"
                    title={`Fetch subjects listed in ${targetSemesterToFetch?.semesterName || 'current semester'}`}
                  >
                    <DownloadCloud className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>Fetch {targetSemesterToFetch ? targetSemesterToFetch.semesterName : 'Current Semester'} Subjects</span>
                  </button>
                )}
              </div>
            );
          })()}

          {!isReadOnly && (
            <button
              onClick={() => onOpenModal('subject')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-[16px] text-xs font-semibold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-500 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Subject</span>
            </button>
          )}
        </div>
      </div>

      {/* Import Notification Banner */}
      {importNotification && (
        <div className={`p-4 rounded-[18px] border text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          importNotification.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
            : importNotification.type === 'info'
            ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-sm'
            : 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{importNotification.message}</span>
          </div>
          <button
            onClick={() => setImportNotification(null)}
            className="p-1 hover:bg-black/5 rounded-lg text-gray-500 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {subjects.length === 0 ? (
          <div className="col-span-full bg-white rounded-[22px] border border-dashed border-pink-200 p-12 text-center">
            <BookOpenCheck className="w-10 h-10 text-pink-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700">No subjects added yet</h3>
            <p className="text-xs text-gray-400 mt-1">Start tracking your syllabus and goals by adding your subjects.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button
                onClick={() => handleFetchSemesterSubjects()}
                className="px-4 py-2 bg-pink-500 text-white rounded-[14px] text-xs font-bold hover:bg-pink-600 shadow-md shadow-pink-200 cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Fetch {getLatestOrActiveSemester(semesters)?.semesterName || 'Current Semester'} Subjects</span>
              </button>
              <button
                onClick={() => onOpenModal('subject')}
                className="px-4 py-2 bg-pink-50 text-pink-600 border border-pink-200 rounded-[14px] text-xs font-bold hover:bg-pink-100 cursor-pointer transition-colors"
              >
                + Add Custom Subject
              </button>
            </div>
          </div>
        ) : (
          subjects.map((s) => {
            const subjectGoals = s.goals || [];
            const finishedGoalsCount = subjectGoals.filter(g => g.completed).length;
            const isCollapsed = collapsedSubjects[s.id] || false;

            const getSubjectSticker = () => {
              const combined = (s.name + ' ' + (s.code || '')).toLowerCase();
              if (combined.includes('math') || combined.includes('phys') || combined.includes('calc') || combined.includes('stat') || combined.includes('quant')) {
                return <CuteGoalBullseye size={52} className="absolute right-3.5 top-14 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />;
              }
              if (combined.includes('code') || combined.includes('dev') || combined.includes('comp') || combined.includes('web') || combined.includes('software') || combined.includes('python') || combined.includes('java')) {
                return <CutePandaCoding size={52} className="absolute right-3.5 top-14 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />;
              }
              if (combined.includes('design') || combined.includes('art') || combined.includes('ui') || combined.includes('ux') || combined.includes('figma')) {
                return <CutePencilHappy size={52} className="absolute right-3.5 top-14 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />;
              }
              if (combined.includes('reading') || combined.includes('book') || combined.includes('english') || combined.includes('history') || combined.includes('literature') || combined.includes('lang')) {
                return <CuteCatBooks size={52} className="absolute right-3.5 top-14 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />;
              }
              // Fallbacks based on ID length
              const hash = s.id.length % 3;
              if (hash === 0) {
                return <CuteStudyBear size={52} className="absolute right-3.5 top-14 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />;
              } else if (hash === 1) {
                return <CuteOwlSmart size={52} className="absolute right-3.5 top-14 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />;
              } else {
                return <CuteCoffeeMug size={52} className="absolute right-3.5 top-14 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />;
              }
            };

            return (
              <ThreeDCard
                key={s.id}
                className="bg-white rounded-[24px] border border-pink-100 shadow-sm shadow-pink-100/40 p-5 flex flex-col justify-between h-full group relative"
              >
                <div>
                  {/* Subject Header Badge & Options */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold shadow-2xs z-10" 
                      style={{ backgroundColor: `${s.color}40`, color: '#880E4F' }}
                    >
                      {s.code} • {s.credits} Credits
                    </span>

                    {!isReadOnly && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={() => onOpenModal('subject', s)}
                          className="p-1.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg cursor-pointer"
                          title="Edit Subject Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSubject(s.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {getSubjectSticker()}

                  {/* Subject Title */}
                  <h3 className="text-base font-extrabold text-gray-800 leading-snug mb-2 pr-14">
                    {s.name}
                  </h3>

                  {/* Instructor & Target Grade */}
                  <div className="space-y-1 text-xs text-gray-500 font-medium mb-4 pr-14">
                    {s.instructor && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                        <span className="truncate">{s.instructor}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>Target Grade: <strong className="text-pink-600 font-bold">{s.targetGrade}</strong></span>
                    </div>
                  </div>

                  {/* ================= SUBJECT STUDY GOALS SECTION ================= */}
                  <div className="pt-3 border-t border-pink-100">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => toggleSubjectCollapsed(s.id)}
                        className="flex items-center gap-1.5 text-xs font-extrabold text-gray-800 hover:text-pink-600 transition-colors cursor-pointer"
                      >
                        <Target className="w-4 h-4 text-pink-500" />
                        <span>Study Goals</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-600 border border-pink-200/50">
                          {finishedGoalsCount}/{subjectGoals.length}
                        </span>
                        {isCollapsed ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronUp className="w-3.5 h-3.5 text-gray-400" />}
                      </button>

                      {!isReadOnly && (
                        <button
                          onClick={() => handleOpenAddGoal(s)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                          title="Set new study goal for this subject"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Goal</span>
                        </button>
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="space-y-3">
                        {subjectGoals.length === 0 ? (
                          <div className="bg-pink-50/40 rounded-[16px] border border-dashed border-pink-200 p-3 text-center">
                            <p className="text-[11px] text-gray-500 font-medium mb-2">
                              No study goals defined for {s.code}.
                            </p>
                            <button
                              onClick={() => handleOpenAddGoal(s)}
                              className="px-3 py-1 bg-white hover:bg-pink-50 text-pink-600 border border-pink-200 rounded-full text-[11px] font-bold cursor-pointer transition-all shadow-2xs"
                            >
                              + Set Goal (e.g. 'Complete Ch. 5')
                            </button>
                          </div>
                        ) : (
                          subjectGoals.map((g) => {
                            const goalPercent = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100)) || 0;
                            const isEditingVal = editingProgressValue[g.id] !== undefined;

                            return (
                              <div
                                key={g.id}
                                className={`p-3 rounded-[16px] border transition-all ${
                                  g.completed 
                                    ? 'bg-pink-50/30 border-pink-200/60' 
                                    : 'bg-white border-pink-100 hover:border-pink-200 shadow-2xs'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <div className="flex items-start gap-2 min-w-0">
                                    <button
                                      onClick={() => { if (!isReadOnly) toggleSubjectGoalCompleted(s.id, g.id); }}
                                      disabled={isReadOnly}
                                      className={`mt-0.5 text-pink-500 shrink-0 ${isReadOnly ? 'cursor-not-allowed opacity-70' : 'hover:text-pink-600 cursor-pointer'}`}
                                      title={g.completed ? "Mark incomplete" : "Mark completed"}
                                    >
                                      <CheckCircle2 className={`w-4 h-4 ${g.completed ? 'fill-pink-500 text-white' : 'text-pink-300'}`} />
                                    </button>
                                    <span className={`text-xs font-bold leading-tight text-gray-800 break-words ${g.completed ? 'line-through text-gray-400' : ''}`}>
                                      {g.title}
                                    </span>
                                  </div>

                                  {!isReadOnly && (
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        onClick={() => handleOpenEditGoal(s, g)}
                                        className="p-1 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded cursor-pointer"
                                        title="Edit Goal"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => deleteSubjectGoal(s.id, g.id)}
                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                        title="Delete Goal"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Progress Info & Manual Controls */}
                                <div className="space-y-1.5 mt-2">
                                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600">
                                    {/* Manual Value Input or Text */}
                                    <div className="flex items-center gap-1.5">
                                      {isEditingVal ? (
                                        <div className="flex items-center gap-1">
                                          <input
                                            type="number"
                                            autoFocus
                                            value={editingProgressValue[g.id]}
                                            onChange={(e) => setEditingProgressValue(prev => ({ ...prev, [g.id]: e.target.value }))}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') handleDirectProgressSubmit(s.id, g);
                                            }}
                                            className="w-14 px-1.5 py-0.5 text-xs bg-white border border-pink-300 rounded font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                          />
                                          <button
                                            onClick={() => handleDirectProgressSubmit(s.id, g)}
                                            className="p-1 bg-pink-500 text-white rounded text-[10px] font-bold hover:bg-pink-600 cursor-pointer"
                                            title="Save"
                                          >
                                            <Check className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => setEditingProgressValue(prev => ({ ...prev, [g.id]: String(g.currentValue) }))}
                                          className="text-gray-700 hover:text-pink-600 font-bold hover:underline cursor-pointer"
                                          title="Click to manually update exact progress number"
                                        >
                                          {g.currentValue} / {g.targetValue} {g.unit}
                                        </button>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span className="text-pink-600 font-bold">{goalPercent}%</span>

                                      {/* Manual Step +/- buttons */}
                                      <div className="flex items-center gap-0.5">
                                        <button
                                          onClick={() => handleGoalStepChange(s.id, g, -1)}
                                          disabled={g.currentValue === 0}
                                          className="w-5 h-5 rounded bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold text-[10px] disabled:opacity-40 cursor-pointer flex items-center justify-center"
                                          title="Subtract 1 from progress"
                                        >
                                          -
                                        </button>
                                        <button
                                          onClick={() => handleGoalStepChange(s.id, g, 1)}
                                          className="w-5 h-5 rounded bg-pink-500 hover:bg-pink-600 text-white font-bold text-[10px] cursor-pointer flex items-center justify-center shadow-2xs"
                                          title="Add 1 to progress"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Progress Bar */}
                                  <div className="w-full h-1.5 bg-pink-100/70 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-300 ${
                                        g.completed ? 'bg-green-500' : 'bg-gradient-to-r from-pink-500 to-pink-400'
                                      }`}
                                      style={{ width: `${goalPercent}%` }}
                                    />
                                  </div>

                                  {/* Optional Deadline */}
                                  {g.deadline && (
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium pt-0.5">
                                      <Calendar className="w-3 h-3 text-pink-400 shrink-0" />
                                      <span>Target: {g.deadline}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </ThreeDCard>
            );
          })
        )}
      </div>

      {/* Subject Goal Modal */}
      <SubjectGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setSelectedSubjectForGoal(null);
          setEditingSubjectGoal(null);
        }}
        subjectName={selectedSubjectForGoal ? `${selectedSubjectForGoal.code} - ${selectedSubjectForGoal.name}` : undefined}
        initialData={editingSubjectGoal}
        onSave={handleSaveGoal}
      />
    </div>
  );
};
