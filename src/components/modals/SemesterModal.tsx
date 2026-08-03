import React, { useState } from 'react';
import { X, GraduationCap, Plus, Trash2, Sparkles, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { SemesterResult, CourseGrade } from '../../types';

interface SemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sem: Omit<SemesterResult, 'id'> | SemesterResult) => void;
  initialData?: SemesterResult | null;
}

export const SemesterModal: React.FC<SemesterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  if (!isOpen) return null;

  const [semesterName, setSemesterName] = useState(initialData?.semesterName || 'Semester 1 - Fall 2025');
  const [courses, setCourses] = useState<CourseGrade[]>(initialData?.courses || []);
  const [startMonth, setStartMonth] = useState<number | undefined>(initialData?.startMonth);
  const [endMonth, setEndMonth] = useState<number | undefined>(initialData?.endMonth);
  const [startYear, setStartYear] = useState<number | undefined>(initialData?.startYear);
  const [endYear, setEndYear] = useState<number | undefined>(initialData?.endYear);
  const [status, setStatus] = useState<'current' | 'past' | undefined>(initialData?.status);
  const [isLocked, setIsLocked] = useState<boolean>(initialData?.isLocked || false);
  
  // AI Image parser state
  const [showSmartParser, setShowSmartParser] = useState(false);
  const [isParsingImage, setIsParsingImage] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isParsingText, setIsParsingText] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const handlePasteTableParse = async () => {
    if (!pastedText.trim()) return;
    setIsParsingText(true);
    setParseError(null);

    try {
      const res = await fetch('/api/parse-mark-sheet-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textContent: pastedText.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse pasted table');

      if (data.courses && Array.isArray(data.courses)) {
        const formattedCourses: CourseGrade[] = data.courses.map((c: any, idx: number) => {
          const finalMarks = Number(c.marks) >= 0 ? Number(c.marks) : 75;
          const { grade, gradePoint } = calculateGradeFromMarks(finalMarks);
          return {
            id: `c-pasted-${Date.now()}-${idx}`,
            courseCode: c.courseCode || `CRS${idx + 1}`,
            courseName: c.courseName || `Course ${idx + 1}`,
            credits: Number(c.credits) > 0 ? Number(c.credits) : 3,
            courseType: c.courseType === 'Lab' ? 'Lab' : 'Theory',
            mst1: c.mst1 ?? 15,
            mst2: c.mst2 ?? 15,
            teacherAssessment: 15,
            theory: c.theory ?? 45,
            marks: finalMarks,
            grade,
            gradePoint,
            mstMarks: 15
          };
        });
        setCourses(prev => [...prev, ...formattedCourses]);
        setPastedText('');
        setShowSmartParser(false);
      }
    } catch (err: any) {
      console.error(err);
      setParseError(err.message || 'Error extracting mark sheet from pasted text/table.');
    } finally {
      setIsParsingText(false);
    }
  };

  const calculateGradeFromMarks = (marks: number): { grade: string; gradePoint: number } => {
    if (marks >= 90) return { grade: 'O', gradePoint: 10.0 };
    if (marks >= 80) return { grade: 'A+', gradePoint: 9.0 };
    if (marks >= 70) return { grade: 'A', gradePoint: 8.0 };
    if (marks >= 60) return { grade: 'B+', gradePoint: 7.0 };
    if (marks >= 50) return { grade: 'B', gradePoint: 6.0 };
    if (marks >= 45) return { grade: 'C', gradePoint: 5.0 };
    if (marks >= 40) return { grade: 'P', gradePoint: 4.0 };
    return { grade: 'F', gradePoint: 0.0 };
  };

  const addCourse = () => {
    setCourses(prev => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        courseCode: '',
        courseName: '',
        credits: 3,
        courseType: 'Theory',
        mst1: 15,
        mst2: 15,
        teacherAssessment: 15,
        theory: 45,
        marks: 75,
        grade: 'A',
        gradePoint: 8.0,
        mstMarks: 15
      }
    ]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingImage(true);
    setParseError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const resultStr = reader.result as string;
        setUploadedImagePreview(resultStr);
        const base64String = resultStr.split(',')[1];
        const res = await fetch('/api/parse-mark-sheet-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64String,
            mimeType: file.type || 'image/jpeg'
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to parse mark sheet image');
        }

        if (data.courses && Array.isArray(data.courses)) {
          const formattedCourses: CourseGrade[] = data.courses.map((c: any, idx: number) => {
            const finalMarks = Number(c.marks) >= 0 ? Number(c.marks) : 75;
            const { grade, gradePoint } = calculateGradeFromMarks(finalMarks);
            return {
              id: `c-img-${Date.now()}-${idx}`,
              courseCode: c.courseCode || `CRS${idx + 1}`,
              courseName: c.courseName || `Course ${idx + 1}`,
              credits: Number(c.credits) > 0 ? Number(c.credits) : 3,
              courseType: c.courseType === 'Lab' ? 'Lab' : 'Theory',
              mst1: c.mst1 ?? 15,
              mst2: c.mst2 ?? 15,
              teacherAssessment: 15,
              theory: c.theory ?? 45,
              marks: finalMarks,
              grade,
              gradePoint,
              mstMarks: 15
            };
          });

          setCourses(prev => [...prev, ...formattedCourses]);
          setShowSmartParser(false);
        }
      } catch (err: any) {
        console.error(err);
        setParseError(err.message || 'Error extracting mark sheet from image.');
      } finally {
        setIsParsingImage(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.onerror = () => {
      setIsParsingImage(false);
      setParseError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseGrade, value: any) => {
    setCourses(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };

        // Handle isPending toggle
        if (field === 'isPending') {
          if (value) {
            updated.grade = 'Pending';
            updated.gradePoint = 0.0;
            updated.mst1 = undefined;
            updated.mst2 = undefined;
            updated.theory = undefined;
            updated.teacherAssessment = undefined;
            updated.marks = undefined;
            updated.mstMarks = undefined;
          } else {
            updated.grade = 'A';
            updated.gradePoint = 8.0;
            updated.marks = 75;
            if (updated.courseType !== 'Lab') {
              updated.mst1 = 15;
              updated.mst2 = 15;
              updated.theory = 45;
              updated.teacherAssessment = 15;
              updated.mstMarks = 15;
            }
          }
        }

        // Handle type switch to Lab
        if (field === 'courseType' && value === 'Lab') {
          updated.mst1 = undefined;
          updated.mst2 = undefined;
          updated.theory = undefined;
          updated.teacherAssessment = undefined;
        }

        // Auto-calculate internal assessment (teacher assessment) based on final marks, theory, and MST average
        if (!updated.isPending && updated.courseType !== 'Lab' && (field === 'mst1' || field === 'mst2' || field === 'theory' || field === 'marks')) {
          const m1 = updated.mst1 !== undefined ? Number(updated.mst1) : 0;
          const m2 = updated.mst2 !== undefined ? Number(updated.mst2) : 0;
          const th = updated.theory !== undefined ? Number(updated.theory) : 0;
          const finalMarks = updated.marks !== undefined ? Number(updated.marks) : 0;
          
          const mstAvg = (m1 + m2) / 2;
          updated.teacherAssessment = updated.marks !== undefined ? Math.max(0, Math.min(20, Math.round((finalMarks - th - mstAvg) * 2) / 2)) : undefined;
        }

        if (!updated.isPending && (field === 'mst1' || field === 'mst2' || field === 'teacherAssessment' || field === 'theory' || field === 'marks' || field === 'courseType')) {
          const finalMarks = Number(updated.marks || 0);
          const { grade, gradePoint } = calculateGradeFromMarks(finalMarks);
          updated.grade = grade;
          updated.gradePoint = gradePoint;
          
          if (updated.courseType === 'Lab') {
            updated.mstMarks = undefined;
          } else {
            // Also set legacy mstMarks to average of MST 1 and MST 2 for backward compatibility
            const m1 = updated.mst1 !== undefined ? Number(updated.mst1) : 0;
            const m2 = updated.mst2 !== undefined ? Number(updated.mst2) : 0;
            updated.mstMarks = Math.round((m1 + m2) / 2);
          }
        }

        // Keep manual fallback in case
        if (field === 'grade' && !updated.isPending) {
          const g = String(value).toUpperCase().trim();
          if (g === 'O' || g.startsWith('O')) updated.gradePoint = 10.0;
          else if (g === 'A+' || g.startsWith('A+')) updated.gradePoint = 9.0;
          else if (g === 'A' || g.startsWith('A')) updated.gradePoint = 8.0;
          else if (g === 'B+' || g.startsWith('B+')) updated.gradePoint = 7.0;
          else if (g === 'B' || g.startsWith('B')) updated.gradePoint = 6.0;
          else if (g === 'C' || g.startsWith('C')) updated.gradePoint = 5.0;
          else if (g === 'P' || g.startsWith('P')) updated.gradePoint = 4.0;
          else updated.gradePoint = 0.0;
        }
        return updated;
      }
      return c;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!semesterName.trim() || courses.length === 0) return;

    let totalPoints = 0;
    let completedCredits = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      totalCredits += Number(c.credits);
      if (!c.isPending && c.grade !== 'Pending') {
        totalPoints += (c.gradePoint * Number(c.credits));
        completedCredits += Number(c.credits);
      }
    });
    const calculatedSgpa = completedCredits > 0 ? Number((totalPoints / completedCredits).toFixed(2)) : 0.0;

    const cleanUndefined = (obj: any): any => {
      if (obj === undefined) return null;
      if (obj === null || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) {
        return obj.map(cleanUndefined);
      }
      const cleaned: any = {};
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (val !== undefined) {
          cleaned[key] = cleanUndefined(val);
        }
      }
      return cleaned;
    };

    const payload = cleanUndefined({
      ...(initialData || {}),
      semesterName: semesterName.trim(),
      sgpa: calculatedSgpa,
      totalCredits,
      courses,
      startMonth: startMonth !== undefined ? startMonth : null,
      endMonth: endMonth !== undefined ? endMonth : null,
      startYear: startYear !== undefined ? startYear : null,
      endYear: endYear !== undefined ? endYear : null,
      status: status !== undefined ? status : null,
      isLocked
    });

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] border border-pink-100 shadow-2xl shadow-pink-200/50 w-full max-w-6xl p-6 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-pink-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">
              {initialData ? 'Edit Semester Marks & SGPA' : 'Record Semester Marks'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-pink-50 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Semester Name *</label>
              <input
                type="text"
                required
                value={semesterName}
                onChange={(e) => setSemesterName(e.target.value)}
                placeholder="e.g. Semester 3 - Fall 2025"
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Start Month & Year</label>
              <div className="flex gap-1.5">
                <select
                  value={startMonth || ''}
                  onChange={(e) => setStartMonth(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-2/3 px-2 py-2.5 bg-white hover:bg-pink-50/20 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium cursor-pointer"
                >
                  <option value="">-- Month --</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <select
                  value={startYear || ''}
                  onChange={(e) => setStartYear(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-1/3 px-2 py-2.5 bg-white hover:bg-pink-50/20 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium cursor-pointer text-center"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 15 }, (_, i) => {
                    const year = new Date().getFullYear() - 5 + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">End Month & Year</label>
              <div className="flex gap-1.5">
                <select
                  value={endMonth || ''}
                  onChange={(e) => setEndMonth(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-2/3 px-2 py-2.5 bg-white hover:bg-pink-50/20 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium cursor-pointer"
                >
                  <option value="">-- Month --</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <select
                  value={endYear || ''}
                  onChange={(e) => setEndYear(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-1/3 px-2 py-2.5 bg-white hover:bg-pink-50/20 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium cursor-pointer text-center"
                >
                  <option value="">Year</option>
                  {Array.from({ length: 15 }, (_, i) => {
                    const year = new Date().getFullYear() - 5 + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Semester Status</label>
              <select
                value={status || ''}
                onChange={(e) => setStatus(e.target.value ? e.target.value as 'current' | 'past' : undefined)}
                className="w-full px-3 py-2.5 bg-white hover:bg-pink-50/20 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium cursor-pointer"
              >
                <option value="">Auto (Calculate from Date)</option>
                <option value="current">Current (Active Now)</option>
                <option value="past">Past Semester</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Protection</label>
              <label className="flex items-center gap-2 px-3 py-2.5 bg-pink-50/60 border border-pink-200 rounded-[14px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLocked}
                  onChange={(e) => setIsLocked(e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded focus:ring-pink-400"
                />
                <span className="text-xs font-bold text-gray-700">🔒 Lock Mark Sheet</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <label className="block text-xs font-semibold text-gray-700">Course Grades, MST Marks & End Sem</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSmartParser(!showSmartParser)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showSmartParser ? 'Hide Image Parser' : '✨ Upload Mark Sheet Image (AI)'}</span>
                </button>
                <button
                  type="button"
                  onClick={addCourse}
                  className="flex items-center gap-1 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Course</span>
                </button>
              </div>
            </div>

            {/* AI Image Upload & Table Paste Parser Box */}
            {showSmartParser && (
              <div className="mb-4 p-5 bg-gradient-to-br from-purple-50/60 to-indigo-50/60 rounded-2xl border border-purple-200 shadow-inner space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    <span>Upload Mark Sheet Image or Paste Table Data</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setShowSmartParser(false); setParseError(null); }}
                    className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>

                <p className="text-[11px] text-gray-600">
                  Upload or change a mark sheet image (PNG, JPG), or paste your marks table/text directly to automatically fetch numbers and all values.
                </p>

                {parseError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                    {parseError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Upload / Change Image */}
                  <div className="p-4 bg-white rounded-xl border border-purple-100 space-y-3">
                    <span className="text-xs font-bold text-gray-700 block">1. Upload or Change Mark Sheet Image</span>
                    {uploadedImagePreview && (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-purple-200 bg-gray-50 flex items-center justify-center">
                        <img src={uploadedImagePreview} alt="Mark Sheet Preview" className="h-full object-contain" />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded font-mono">Uploaded</span>
                      </div>
                    )}
                    <label className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all ${isParsingImage ? 'opacity-70 pointer-events-none' : ''}`}>
                      {isParsingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Scanning Image with AI...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>{uploadedImagePreview ? 'Change / Re-upload Image' : 'Choose Mark Sheet Image'}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isParsingImage}
                      />
                    </label>
                  </div>

                  {/* Option 2: Paste Table / Text */}
                  <div className="p-4 bg-white rounded-xl border border-purple-100 space-y-2">
                    <span className="text-xs font-bold text-gray-700 block">2. Or Paste Table Data / Text</span>
                    <textarea
                      rows={3}
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Paste copied table rows, course codes, credits, marks here..."
                      className="w-full p-2.5 bg-gray-50 border border-purple-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <button
                      type="button"
                      onClick={handlePasteTableParse}
                      disabled={isParsingText || !pastedText.trim()}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {isParsingText ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Fetching Values...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Fetch Values from Pasted Table</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Header labels */}
            <div className="hidden sm:grid sm:grid-cols-[7%_6%_7%_1fr_4%_5%_5%_5%_6%_6%_11%_32px] gap-2 items-center text-[10px] font-bold text-gray-500 uppercase p-3 border border-transparent mb-1">
              <span className="text-center">Type</span>
              <span className="text-center" title="Result Pending (leaves fields blank/uneditable)">RP?</span>
              <span className="text-center">Code</span>
              <span className="text-left">Course Title</span>
              <span className="text-center">Cred</span>
              <span className="text-center">MST 1</span>
              <span className="text-center">MST 2</span>
              <span className="text-center">MST Avg</span>
              <span className="text-center">Int /20</span>
              <span className="text-center">Th /60</span>
              <span className="text-center">Final (/100)</span>
              <span className="w-8"></span>
            </div>

            <div className="space-y-2.5">
              {courses.length === 0 ? (
                <div className="p-6 bg-pink-50/20 border border-dashed border-pink-200 rounded-2xl text-center text-xs font-semibold text-gray-500">
                  No courses added yet. Click <span className="text-pink-600 font-bold cursor-pointer" onClick={addCourse}>Add Course</span> to start recording.
                </div>
              ) : (
                courses.map((course) => (
                  <div key={course.id} className="p-3 bg-pink-50/30 rounded-[16px] border border-pink-100 flex flex-wrap sm:grid sm:grid-cols-[7%_6%_7%_1fr_4%_5%_5%_5%_6%_6%_11%_32px] items-center gap-2">
                    {/* Course Type (Theory vs Lab) */}
                    <div className="w-full">
                      <select
                        value={course.courseType || 'Theory'}
                        onChange={(e) => updateCourse(course.id, 'courseType', e.target.value as 'Theory' | 'Lab')}
                        className="w-full px-1 py-1.5 bg-white border border-pink-200 rounded-xl text-[11px] font-bold text-pink-600 text-center cursor-pointer focus:outline-none focus:ring-1 focus:ring-pink-300"
                        title="Course Delivery Type"
                      >
                        <option value="Theory">Theory</option>
                        <option value="Lab">Lab</option>
                      </select>
                    </div>
                    {/* Result Pending Checkbox */}
                    <div className="w-full flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={!!course.isPending}
                        onChange={(e) => updateCourse(course.id, 'isPending', e.target.checked)}
                        className="w-4 h-4 text-pink-600 border-pink-300 rounded-md focus:ring-pink-500 focus:ring-opacity-25 accent-pink-500 cursor-pointer"
                        title="Mark result as pending"
                      />
                    </div>
                    {/* Code */}
                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="Code"
                        value={course.courseCode}
                        onChange={(e) => updateCourse(course.id, 'courseCode', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-pink-200 rounded-xl text-xs font-medium text-gray-800 text-center"
                      />
                    </div>
                    {/* Course Title */}
                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="Course Title"
                        value={course.courseName}
                        onChange={(e) => updateCourse(course.id, 'courseName', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-pink-200 rounded-xl text-xs font-medium text-gray-800"
                      />
                    </div>
                    {/* Credits */}
                    <div className="w-full">
                      <input
                        type="number"
                        placeholder="Cred"
                        value={course.credits}
                        onChange={(e) => updateCourse(course.id, 'credits', Number(e.target.value))}
                        className="w-full px-1.5 py-1.5 bg-white border border-pink-200 rounded-xl text-xs font-medium text-gray-800 text-center"
                      />
                    </div>
                    {/* MST 1 */}
                    <div className="w-full">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        placeholder={course.isPending ? 'Pend' : (course.courseType === 'Lab' ? 'N/A' : 'MST 1')}
                        disabled={course.isPending || course.courseType === 'Lab'}
                        value={course.isPending ? '' : (course.courseType === 'Lab' ? '' : (course.mst1 ?? ''))}
                        onChange={(e) => updateCourse(course.id, 'mst1', e.target.value === '' ? undefined : Number(e.target.value))}
                        className={`w-full px-1 py-1.5 border rounded-xl text-xs font-medium text-center ${
                          course.isPending || course.courseType === 'Lab'
                            ? 'bg-gray-100/75 border-pink-100/40 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-pink-200 text-gray-800'
                        }`}
                        title={course.courseType === 'Lab' ? 'Labs have no MST marks' : 'Mid-Semester Test 1 Marks (out of 20)'}
                      />
                    </div>
                    {/* MST 2 */}
                    <div className="w-full">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        placeholder={course.isPending ? 'Pend' : (course.courseType === 'Lab' ? 'N/A' : 'MST 2')}
                        disabled={course.isPending || course.courseType === 'Lab'}
                        value={course.isPending ? '' : (course.courseType === 'Lab' ? '' : (course.mst2 ?? ''))}
                        onChange={(e) => updateCourse(course.id, 'mst2', e.target.value === '' ? undefined : Number(e.target.value))}
                        className={`w-full px-1 py-1.5 border rounded-xl text-xs font-medium text-center ${
                          course.isPending || course.courseType === 'Lab'
                            ? 'bg-gray-100/75 border-pink-100/40 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-pink-200 text-gray-800'
                        }`}
                        title={course.courseType === 'Lab' ? 'Labs have no MST marks' : 'Mid-Semester Test 2 Marks (out of 20)'}
                      />
                    </div>
                    {/* MST Avg */}
                    <div className="w-full">
                      <input
                        type="text"
                        disabled
                        value={course.isPending ? 'Pend' : (course.courseType === 'Lab' ? 'N/A' : (((course.mst1 ?? 0) + (course.mst2 ?? 0)) / 2).toFixed(1).replace(/\.0$/, ''))}
                        className="w-full px-1 py-1.5 bg-gray-50 border border-pink-100 rounded-xl text-xs font-bold text-center text-gray-400 cursor-not-allowed"
                        title="MST Average (out of 20)"
                      />
                    </div>
                    {/* Teacher Internal Assessment */}
                    <div className="w-full">
                      <input
                        type="text"
                        disabled
                        placeholder={course.isPending ? 'Pend' : (course.courseType === 'Lab' ? 'N/A' : 'Int /20')}
                        value={course.isPending ? 'Pend' : (course.courseType === 'Lab' ? 'N/A' : (course.teacherAssessment !== undefined ? course.teacherAssessment.toFixed(1).replace(/\.0$/, '') : ''))}
                        className="w-full px-1 py-1.5 bg-gray-50 border border-pink-100 rounded-xl text-xs font-bold text-center text-gray-400 cursor-not-allowed"
                        title={course.courseType === 'Lab' ? 'Labs have no Teacher Internal Assessment' : 'Autofilled Internal Assessment (Final - Theory - MST Avg)'}
                      />
                    </div>
                    {/* Theory */}
                    <div className="w-full">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="60"
                        placeholder={course.isPending ? 'Pend' : (course.courseType === 'Lab' ? 'N/A' : 'Th /60')}
                        disabled={course.isPending || course.courseType === 'Lab'}
                        value={course.isPending ? '' : (course.courseType === 'Lab' ? '' : (course.theory ?? ''))}
                        onChange={(e) => updateCourse(course.id, 'theory', e.target.value === '' ? undefined : Number(e.target.value))}
                        className={`w-full px-1 py-1.5 border rounded-xl text-xs font-medium text-center ${
                          course.isPending || course.courseType === 'Lab'
                            ? 'bg-gray-100/75 border-pink-100/40 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-pink-200 text-gray-800'
                        }`}
                        title={course.courseType === 'Lab' ? 'Labs have no theory marks' : 'Theory Marks (out of 60)'}
                      />
                    </div>
                    {/* Final Marks & Auto Grade Badge */}
                    <div className="w-full flex items-center gap-1">
                      <input
                        type="number"
                        placeholder={course.isPending ? 'Pend' : 'Final'}
                        disabled={course.isPending}
                        value={course.isPending ? '' : (course.marks ?? '')}
                        onChange={(e) => updateCourse(course.id, 'marks', e.target.value === '' ? undefined : Number(e.target.value))}
                        className={`w-full px-1 py-1 border-2 rounded-xl text-xs font-bold text-center shadow-3xs ${
                          course.isPending
                            ? 'bg-gray-100 border-pink-200 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-pink-300 text-pink-700 animate-pulse-once'
                        }`}
                        title="Final Total Marks out of 100"
                      />
                      <span className="px-1.5 py-1 bg-pink-100 text-pink-700 rounded-lg text-[10px] font-black border border-pink-200 block shrink-0 select-none" title={`Auto Grade: ${course.grade}`}>
                        {course.grade}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCourse(course.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer w-8 h-8 flex items-center justify-center shrink-0 ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-[14px] text-xs font-semibold hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-[14px] text-xs font-semibold shadow-md shadow-pink-200 cursor-pointer"
            >
              Calculate & Save Results
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
