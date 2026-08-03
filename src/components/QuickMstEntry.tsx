import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  BarChart2, 
  BookOpen, 
  Zap, 
  Target 
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { CourseGrade, SemesterResult } from '../types';

export const QuickMstEntry: React.FC = () => {
  const { semesters, addSemester, updateSemester, subjects, isReadOnly } = useStudy();

  const [subjectName, setSubjectName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [semesterName, setSemesterName] = useState(
    semesters[0]?.semesterName || 'Semester 1 - Fall 2025'
  );
  const [mstMarks, setMstMarks] = useState<number | ''>('');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick select existing subject
  const handleSelectSubject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    if (!selectedCode) return;
    const sub = subjects.find(s => s.code === selectedCode);
    if (sub) {
      setSubjectName(sub.name);
      setCourseCode(sub.code);
    }
  };

  const computeGradeAndPoint = (mst: number) => {
    if (mst >= 18) return { grade: 'O', point: 10.0 };
    if (mst >= 16) return { grade: 'A+', point: 9.0 };
    if (mst >= 14) return { grade: 'A', point: 8.0 };
    if (mst >= 12) return { grade: 'B+', point: 7.0 };
    if (mst >= 11) return { grade: 'B', point: 6.0 };
    if (mst >= 10) return { grade: 'C', point: 5.0 };
    if (mst >= 8) return { grade: 'P', point: 4.0 };
    return { grade: 'F', point: 0.0 };
  };

  const handleSaveMst = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || mstMarks === '') return;

    const numericMst = Math.min(20, Math.max(0, Number(mstMarks)));
    const trimmedSemName = semesterName.trim() || 'Semester 1 - Fall 2025';

    const { grade: computedGrade, point: computedPoint } = computeGradeAndPoint(numericMst);

    // Find if semester exists
    let targetSem = semesters.find(
      s => s.semesterName.toLowerCase() === trimmedSemName.toLowerCase()
    );

    if (targetSem) {
      // Check if course already exists in this semester
      const existingCourseIdx = targetSem.courses.findIndex(
        c => (courseCode && c.courseCode.toLowerCase() === courseCode.toLowerCase()) ||
             c.courseName.toLowerCase() === subjectName.toLowerCase()
      );

      let updatedCourses: CourseGrade[];
      if (existingCourseIdx >= 0) {
        updatedCourses = targetSem.courses.map((c, idx) => 
          idx === existingCourseIdx ? { ...c, mstMarks: numericMst, courseName: subjectName.trim(), courseCode: courseCode.trim() || c.courseCode } : c
        );
      } else {
        const newCourse: CourseGrade = {
          id: `c-${Date.now()}`,
          courseCode: courseCode.trim() || 'SUB101',
          courseName: subjectName.trim(),
          credits: 4,
          grade: computedGrade,
          gradePoint: computedPoint,
          marks: numericMst * 5, // Default raw marks out of 100
          mstMarks: numericMst
        };
        updatedCourses = [...targetSem.courses, newCourse];
      }

      await updateSemester({
        ...targetSem,
        courses: updatedCourses
      });
    } else {
      // Create new semester
      const newCourse: CourseGrade = {
        id: `c-${Date.now()}`,
        courseCode: courseCode.trim() || 'SUB101',
        courseName: subjectName.trim(),
        credits: 4,
        grade: computedGrade,
        gradePoint: computedPoint,
        marks: numericMst * 5,
        mstMarks: numericMst
      };

      const newSem: Omit<SemesterResult, 'id'> = {
        semesterName: trimmedSemName,
        sgpa: computedPoint,
        totalCredits: 4,
        courses: [newCourse]
      };

      await addSemester(newSem);
    }

    setSuccessMsg(`Saved MST score (${numericMst}/20) for ${subjectName}!`);
    setTimeout(() => setSuccessMsg(null), 3000);

    // Reset form
    setSubjectName('');
    setCourseCode('');
    setMstMarks('');
    setEditingCourseId(null);
  };

  // Flatten courses with MST marks for display (exclude labs as they have no MST)
  const allMstCourses = semesters.flatMap(sem => 
    sem.courses
      .filter(c => c.courseType !== 'Lab')
      .map(c => ({
        ...c,
        semesterName: sem.semesterName,
        semesterId: sem.id
      }))
  );

  return (
    <div className="space-y-6">
      {/* QUICK MST ENTRY FORM */}
      <div className="bg-gradient-to-br from-pink-50 via-white to-pink-50/30 rounded-[24px] border-2 border-pink-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-pink-500" />
              <span>Quick Mid-Semester Test (MST) Marks Entry</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter subject name, code, semester and MST score (out of 20) for rapid internal assessment logging.
            </p>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 bg-pink-100 text-pink-700 text-xs font-black rounded-full border border-pink-200">
            Out of 20 Marks
          </span>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveMst} className="space-y-4">
          {/* Preset subject chooser */}
          {subjects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Choose Existing Subject:</span>
              <select
                onChange={handleSelectSubject}
                className="px-3 py-1.5 bg-white border border-pink-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-pink-500"
              >
                <option value="">-- Select from My Subjects --</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.code}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Subject Name *</label>
              <input
                type="text"
                placeholder="e.g. Operating Systems"
                required
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Subject / Course Code</label>
              <input
                type="text"
                placeholder="e.g. CS201"
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Semester Name *</label>
              <input
                type="text"
                placeholder="e.g. Semester 2 - Spring 2025"
                required
                list="semester-suggestions"
                value={semesterName}
                onChange={e => setSemesterName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
              <datalist id="semester-suggestions">
                {semesters.map(s => (
                  <option key={s.id} value={s.semesterName} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-pink-600 mb-1">MST Marks (out of 20) *</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="20"
                placeholder="e.g. 18.5"
                required
                value={mstMarks}
                onChange={e => setMstMarks(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border-2 border-pink-300 rounded-xl text-xs font-black text-pink-700 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 shadow-2xs"
              />
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-pink-400 text-white font-bold text-xs rounded-xl shadow-md shadow-pink-200 hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save MST Marks</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* RECORDED MST PAPERS DISPLAY */}
      <div className="bg-white rounded-[24px] border border-pink-100 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-500" />
            <h3 className="font-extrabold text-gray-800 text-sm">All Mid-Semester Test (MST) Records</h3>
          </div>
          <span className="text-xs font-bold text-gray-500">
            {allMstCourses.filter(c => c.mstMarks !== undefined).length} Subjects Logged
          </span>
        </div>

        {allMstCourses.length === 0 ? (
          <div className="p-8 text-center bg-pink-50/30 rounded-[20px] border border-dashed border-pink-200">
            <p className="text-xs font-bold text-gray-600">No MST marks logged yet.</p>
            <p className="text-[11px] text-gray-400 mt-1">Use the quick form above to add MST marks out of 20.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allMstCourses.map((c) => {
              const score = c.mstMarks ?? 0;
              const pct = (score / 20) * 100;
              const isHigh = score >= 17.5;
              const isAvg = score >= 15 && score < 17.5;

              return (
                <div 
                  key={`${c.semesterId}-${c.id}`} 
                  className="bg-white rounded-[20px] border border-pink-100 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider block">
                        {c.semesterName}
                      </span>
                      <h4 className="text-sm font-extrabold text-gray-800 leading-tight mt-0.5">
                        {c.courseName}
                      </h4>
                      <p className="text-[11px] font-bold text-gray-400 mt-0.5">
                        Code: {c.courseCode || 'N/A'} • Credits: {c.credits}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-3 py-1.5 rounded-2xl text-xs font-black block border ${
                        isHigh 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : isAvg 
                            ? 'bg-pink-50 text-pink-700 border-pink-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {score} / 20
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 mt-0.5 block">
                        {(score * 5).toFixed(0)} / 100 Marks
                      </span>
                    </div>
                  </div>

                  {/* MST Progress Bar */}
                  <div>
                    <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          isHigh ? 'bg-emerald-500' : isAvg ? 'bg-pink-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* MST Impact Insights */}
                  <div className="p-2.5 bg-pink-50/50 rounded-[14px] text-[11px] font-semibold text-gray-700 flex items-start gap-2">
                    <Target className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                    <span>
                      {isHigh 
                        ? '🔥 Excellent internal cushion! Keep consistent for Grade O / A+ in finals.' 
                        : isAvg 
                          ? '⚡ Solid foundation. Aim for 65+ marks in final exam to lock Grade A+.' 
                          : '⚠️ Focus on end-sem finals! Aim for 70+ marks in finals to balance internal score.'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
