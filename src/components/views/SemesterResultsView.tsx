import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Edit2, 
  Award, 
  TrendingUp, 
  Sparkles, 
  BarChart2, 
  BarChart3, 
  BookOpen, 
  Zap,
  Lock
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { SemesterResult } from '../../types';
import { ResultInsights } from '../ResultInsights';
import { QuickMstEntry } from '../QuickMstEntry';
import { getCoolCGPATag } from '../../utils/cgpaHelpers';
import { isSemActiveNow } from '../../utils/semesterHelpers';
import { 
  CuteCatBooks, CutePandaCoding, CuteStudyBear, CuteCoffeeMug, 
  CuteMagicStar, CuteGoalBullseye, CutePencilHappy, CuteOwlSmart 
} from '../CuteImages';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getMonthLabel = (m?: number): string => {
  if (m === undefined) return '';
  return MONTH_NAMES[m - 1] || '';
};

interface SemesterResultsViewProps {
  onOpenModal: (type: 'semester', initialData?: SemesterResult) => void;
}

export const SemesterResultsView: React.FC<SemesterResultsViewProps> = ({ onOpenModal }) => {
  const { semesters, deleteSemester, stats, updateSemester, isReadOnly } = useStudy();
  const [activeSubTab, setActiveSubTab] = useState<'insights' | 'mst' | 'grades'>('insights');
  const [semesterFilter, setSemesterFilter] = useState<'all' | 'active' | 'past'>('all');
  const [semesterToDelete, setSemesterToDelete] = useState<SemesterResult | null>(null);

  const filteredSemesters = semesters.filter(sem => {
    if (semesterFilter === 'active') return isSemActiveNow(sem);
    if (semesterFilter === 'past') return !isSemActiveNow(sem);
    return true;
  });

  const activeCount = semesters.filter(isSemActiveNow).length;
  const pastCount = semesters.length - activeCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/50 relative overflow-hidden group">
        {/* Cute Mascot Sticker */}
        <div className="absolute right-48 -bottom-1 opacity-90 pointer-events-none select-none hidden lg:block animate-bounce" style={{ animationDuration: '7s' }}>
          <CuteStudyBear size={64} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-pink-500" />
            <h1 className="text-xl font-bold text-gray-800">Semester Results, MST & GPA Insights</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Track semester SGPA, MST internal assessment marks out of 20, strengths, weaknesses & consistency plans.
          </p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => onOpenModal('semester')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-[16px] text-xs font-semibold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-500 cursor-pointer self-start sm:self-auto relative z-10"
          >
            <Plus className="w-4 h-4" />
            <span>Add Semester Marks</span>
          </button>
        )}
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-[18px] border border-pink-100 w-fit shadow-2xs">
        <button
          onClick={() => setActiveSubTab('insights')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[14px] text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'insights'
              ? 'bg-[#F06292] text-white shadow-xs'
              : 'text-gray-600 hover:bg-pink-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Performance & MST Insights</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mst')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[14px] text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'mst'
              ? 'bg-[#F06292] text-white shadow-xs'
              : 'text-gray-600 hover:bg-pink-50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Quick MST Marks Entry</span>
        </button>

        <button
          onClick={() => setActiveSubTab('grades')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[14px] text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'grades'
              ? 'bg-[#F06292] text-white shadow-xs'
              : 'text-gray-600 hover:bg-pink-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Semester Marks Sheet ({semesters.length})</span>
        </button>
      </div>

      {/* CGPA BANNER CARD */}
      {(() => {
        const cgpaTag = getCoolCGPATag(stats.overallCGPA);
        return (
          <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-pink-300 rounded-[24px] p-6 text-white shadow-xl shadow-pink-200/50 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
            {/* Cute Mascot Sticker */}
            <div className="absolute right-48 -bottom-1 opacity-25 pointer-events-none select-none hidden sm:block">
              <CuteMagicStar size={84} />
            </div>

            <div className="space-y-1.5 text-center sm:text-left relative z-10">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold text-pink-100 uppercase tracking-wider">Cumulative Performance</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] ${cgpaTag.badgeBg} ${cgpaTag.badgeTextColor} shadow-xs font-black`}>
                  {cgpaTag.tag}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">
                Overall CGPA: {stats.overallCGPA === 'N/A' ? 'N/A' : `${stats.overallCGPA} / 10.0`}
              </h2>
              <p className="text-xs text-pink-50 font-medium">
                {cgpaTag.description} Across {semesters.length} semesters on a 10.0 GPA scale.
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-[20px] border border-white/30 text-center shrink-0 relative z-10">
              <Award className="w-6 h-6 text-yellow-200 mx-auto mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-100 block">Academic Tier</span>
              <span className="text-sm font-black text-white">
                {cgpaTag.tierLabel}
              </span>
            </div>
          </div>
        );
      })()}

      {/* SUB TAB VIEWS */}
      {activeSubTab === 'insights' && (
        <ResultInsights semesters={semesters} overallCGPA={stats.overallCGPA} />
      )}

      {activeSubTab === 'mst' && (
        <QuickMstEntry />
      )}

      {activeSubTab === 'grades' && (
        /* Semester Breakdown List */
        <div className="space-y-6">
          {semesters.length > 0 && (
            <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-[18px] border border-pink-100 shadow-2xs flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-500 ml-2">Filter View:</span>
                <button
                  onClick={() => setSemesterFilter('all')}
                  className={`px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                    semesterFilter === 'all'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-pink-50'
                  }`}
                >
                  All ({semesters.length})
                </button>
                <button
                  onClick={() => setSemesterFilter('active')}
                  className={`px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    semesterFilter === 'active'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Active / Current ({activeCount})
                </button>
                <button
                  onClick={() => setSemesterFilter('past')}
                  className={`px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                    semesterFilter === 'past'
                      ? 'bg-gray-700 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Past Semesters ({pastCount})
                </button>
              </div>

              <div className="text-[11px] text-gray-400 font-medium mr-2 hidden sm:block">
                💡 Tip: Use the toggle button on any semester card to switch between Active and Past status.
              </div>
            </div>
          )}

          {filteredSemesters.length === 0 ? (
            <div className="bg-white rounded-[22px] border border-dashed border-pink-200 p-12 text-center">
              <GraduationCap className="w-10 h-10 text-pink-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-gray-700">
                {semesters.length === 0 
                  ? 'No semester results recorded yet' 
                  : `No ${semesterFilter === 'active' ? 'active/current' : 'past'} semesters found`}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {semesters.length === 0 
                  ? 'Record your course grades to automatically calculate SGPA & CGPA.' 
                  : 'Try switching filters or toggling a semester status above.'}
              </p>
              {!isReadOnly && (
                <button
                  onClick={() => onOpenModal('semester')}
                  className="mt-4 px-4 py-2 bg-pink-50 text-pink-600 rounded-[14px] text-xs font-bold hover:bg-pink-100 cursor-pointer"
                >
                  + Record Semester Results
                </button>
              )}
            </div>
          ) : (
            filteredSemesters.map((sem) => (
              <div
                key={sem.id}
                className="bg-white rounded-[24px] border border-pink-100 shadow-sm shadow-pink-100/40 p-6 space-y-4"
              >
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-pink-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-gray-800">{sem.semesterName}</h3>
                      {sem.startMonth && sem.endMonth && (
                        <span className="text-[11px] font-semibold text-pink-600 bg-pink-50/70 border border-pink-100 px-2 py-0.5 rounded-lg">
                          📅 {getMonthLabel(sem.startMonth)}{sem.startYear ? ` ${sem.startYear}` : ''} - {getMonthLabel(sem.endMonth)}{sem.endYear ? ` ${sem.endYear}` : ''}
                        </span>
                      )}
                      {isSemActiveNow(sem) ? (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-250 px-2 py-0.5 rounded-lg flex items-center gap-1 animate-pulse shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Active Now</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                          <span>Past Semester</span>
                        </span>
                      )}

                      {!isReadOnly && (
                        <div className="flex items-center gap-1 bg-pink-50/50 p-0.5 rounded-lg border border-pink-100/50 ml-1">
                          <button
                            onClick={() => updateSemester({ ...sem, status: 'current' })}
                            className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase transition-all cursor-pointer ${
                              isSemActiveNow(sem)
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                            }`}
                            title="Mark as Current (Active)"
                          >
                            Current
                          </button>
                          <button
                            onClick={() => updateSemester({ ...sem, status: 'past' })}
                            className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase transition-all cursor-pointer ${
                              !isSemActiveNow(sem)
                                ? 'bg-gray-400 text-white shadow-xs'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-white'
                            }`}
                            title="Mark as Past"
                          >
                            Past
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-500 font-medium">
                        Total Credits: <strong className="text-gray-700">{sem.totalCredits}</strong>
                      </p>
                      {sem.isLocked && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Lock className="w-3 h-3 text-purple-600" />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 px-4 py-2 rounded-[18px] text-center border border-pink-200">
                      <span className="text-[10px] font-bold text-pink-500 uppercase block">Semester SGPA</span>
                      <span className="text-base font-black text-pink-700">
                        {sem.courses.length > 0 && sem.courses.every(c => c.isPending || c.grade === 'Pending') ? 'Pending' : sem.sgpa}
                      </span>
                    </div>

                    {!isReadOnly && (
                      <>
                        <button
                          onClick={() => onOpenModal('semester', sem)}
                          className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors cursor-pointer"
                          title="Edit Semester"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (sem.isLocked) {
                              alert("This semester mark sheet is locked! Unlock it from edit mode before deleting.");
                              return;
                            }
                            setSemesterToDelete(sem);
                          }}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${sem.isLocked ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                          title={sem.isLocked ? "Mark sheet is locked against deletion" : "Delete Semester"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Course Grade Table */}
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
                      {sem.courses.map((c) => (
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
                          <td className="py-2.5 px-3 text-center font-extrabold">
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
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {semesterToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] border border-pink-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl mx-auto">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center">Confirm Permanent Deletion</h3>
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Are you sure you want to permanently delete the semester mark sheet for <strong className="text-gray-800">{semesterToDelete.semesterName}</strong>? This action cannot be undone and will remove all associated course grades.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSemesterToDelete(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-[14px] text-xs font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteSemester(semesterToDelete.id);
                  setSemesterToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-[14px] text-xs font-bold cursor-pointer transition-colors shadow-md shadow-red-200"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
