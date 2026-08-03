
import React, { useState } from 'react';
import { Award, Plus, Trash2, Clock, CheckCircle, HelpCircle, Flame, ArrowUpRight, Minus, ExternalLink, Lock } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { getSkillCartoonIcon } from '../../utils/cgpaHelpers';
import { ThreeDCard } from '../ThreeDBackground';
import { 
  CuteCatBooks, CutePandaCoding, CuteStudyBear, CuteCoffeeMug, 
  CuteMagicStar, CuteGoalBullseye, CutePencilHappy, CuteOwlSmart 
} from '../CuteImages';

export const ExtraSkillsView: React.FC = () => {
  const { 
    extraSkills, 
    addExtraSkill, 
    updateExtraSkill, 
    deleteExtraSkill,
    isReadOnly 
  } = useStudy();

  const [showForm, setShowForm] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [status, setStatus] = useState<'Ongoing' | 'Pending' | 'Completed'>('Ongoing');
  const [hoursGiven, setHoursGiven] = useState(0);
  const [courseUrl, setCourseUrl] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;
    await addExtraSkill({
      courseName: courseName.trim(),
      status,
      hoursGiven: Number(hoursGiven) || 0,
      courseUrl: courseUrl.trim() || undefined,
      isLocked
    });
    setCourseName('');
    setHoursGiven(0);
    setStatus('Ongoing');
    setCourseUrl('');
    setIsLocked(false);
    setShowForm(false);
  };

  const totalCourses = extraSkills.length;
  const ongoingCourses = extraSkills.filter(s => s.status === 'Ongoing').length;
  const completedCourses = extraSkills.filter(s => s.status === 'Completed').length;
  const totalHours = extraSkills.reduce((sum, s) => sum + s.hoursGiven, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/50 relative overflow-hidden group">
        {/* Cute Mascot Sticker */}
        <div className="absolute right-48 -bottom-1 opacity-90 pointer-events-none select-none hidden lg:block animate-bounce" style={{ animationDuration: '7s' }}>
          <CutePandaCoding size={64} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-pink-500" />
            <h1 className="text-xl font-bold text-gray-800">Extra Skills & Certifications</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Track external certification courses, professional exams, skills bootcamps, and hours invested.
          </p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-[16px] text-xs font-semibold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-500 transition-all cursor-pointer self-start sm:self-auto relative z-10"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'Close Form' : 'Add Course'}</span>
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-[20px] border border-pink-100/80 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Skills</span>
            <span className="text-xl font-black text-gray-800">{totalCourses}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[20px] border border-pink-100/80 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Hours Logged</span>
            <span className="text-xl font-black text-gray-800">{totalHours} hrs</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[20px] border border-pink-100/80 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ongoing</span>
            <span className="text-xl font-black text-gray-800">{ongoingCourses} Active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[20px] border border-pink-100/80 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Completed</span>
            <span className="text-xl font-black text-emerald-600">{completedCourses} Done</span>
          </div>
        </div>
      </div>

      {/* Add Course Form (Expandable) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[22px] border border-pink-100 shadow-sm space-y-4 max-w-xl animate-in slide-in-from-top duration-200">
          <h2 className="text-sm font-bold text-gray-800">Record New Course / Certification</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">
                Course or certification title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AWS Certified Cloud Practitioner"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-3 py-2 bg-pink-50/20 border border-pink-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-400 font-medium text-gray-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">
                Course URL / Link (Optional)
              </label>
              <input
                type="url"
                placeholder="e.g. https://www.coursera.org/learn/your-course"
                value={courseUrl}
                onChange={(e) => setCourseUrl(e.target.value)}
                className="w-full px-3 py-2 bg-pink-50/20 border border-pink-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-400 font-medium text-gray-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Ongoing' | 'Pending' | 'Completed')}
                  className="w-full px-3 py-2 bg-white border border-pink-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-400 font-medium text-gray-700"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">
                  Hours Logged so far
                </label>
                <input
                  type="number"
                  min="0"
                  value={hoursGiven}
                  onChange={(e) => setHoursGiven(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-pink-50/20 border border-pink-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-400 font-medium text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 px-3 py-2.5 bg-pink-50/60 border border-pink-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLocked}
                  onChange={(e) => setIsLocked(e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded focus:ring-pink-400"
                />
                <span className="text-xs font-bold text-gray-700">🔒 Lock Certification Entry (prevent deletion)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#F06292] hover:bg-pink-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Save Course
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Main Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {extraSkills.length === 0 ? (
          <div className="col-span-full bg-white rounded-[22px] border border-dashed border-pink-200 p-12 text-center">
            <Award className="w-10 h-10 text-pink-300 mx-auto mb-3 animate-pulse" />
            <h3 className="text-sm font-bold text-gray-700">No external certifications tracked yet</h3>
            <p className="text-xs text-gray-400 mt-1">Record self-paced courses, workshops, or skills-building modules to monitor your extra hours.</p>
            {!isReadOnly && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 bg-pink-50 text-pink-600 rounded-[14px] text-xs font-bold hover:bg-pink-100 cursor-pointer"
              >
                + Add a Course
              </button>
            )}
          </div>
        ) : (
          extraSkills.map((skill) => {
            const iconInfo = getSkillCartoonIcon(skill.courseName);
            const getSkillSticker = () => {
              const emoji = iconInfo.emoji;
              if (emoji === '👾' || emoji === '🤖') return <CutePandaCoding size={38} />;
              if (emoji === '🎨') return <CutePencilHappy size={38} />;
              if (emoji === '☁️') return <CuteOwlSmart size={38} />;
              if (emoji === '🦁') return <CuteStudyBear size={38} />;
              return <CuteCoffeeMug size={38} />;
            };

            return (
              <ThreeDCard
                key={skill.id}
                className="bg-white rounded-[24px] border border-pink-100 shadow-xs p-5 flex flex-col justify-between group relative h-full"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        {getSkillSticker()}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                        skill.status === 'Ongoing'
                          ? 'bg-pink-100 text-[#F06292]'
                          : skill.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200/50'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {skill.status}
                      </span>
                    </div>

                    {!isReadOnly && (
                      <div className="flex items-center gap-1.5">
                        {skill.isLocked && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <Lock className="w-3 h-3 text-purple-600" />
                            <span>Locked</span>
                          </span>
                        )}
                        <button
                          onClick={() => {
                            if (skill.isLocked) {
                              alert("This extra skill certification is locked! Edit its lock setting to enable deletion.");
                              return;
                            }
                            deleteExtraSkill(skill.id);
                          }}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${skill.isLocked ? 'text-gray-300 hover:text-gray-400 bg-gray-50' : 'text-gray-400 hover:text-[#F06292] hover:bg-pink-50'}`}
                          title={skill.isLocked ? "Certification is locked against deletion" : "Delete Course"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-gray-800 text-sm leading-tight group-hover:text-pink-600 transition-colors">
                      {skill.courseName}
                    </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    <span>Total Hours Dedicated: <strong className="text-gray-700 font-bold">{skill.hoursGiven} hours</strong></span>
                  </div>

                  {/* Course Link Direct Paste Box */}
                  <div className="mt-3.5 pt-3 border-t border-dashed border-pink-100/60">
                    <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                      Course Link
                    </label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="url"
                        placeholder="Paste course link here..."
                        value={skill.courseUrl || ''}
                        disabled={isReadOnly}
                        onChange={(e) => {
                          if (!isReadOnly) {
                            updateExtraSkill({
                              ...skill,
                              courseUrl: e.target.value
                            });
                          }
                        }}
                        className={`flex-1 min-w-0 px-2.5 py-1.5 bg-pink-50/20 border border-pink-100/60 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-pink-400 text-gray-700 font-medium ${isReadOnly ? 'cursor-not-allowed opacity-75' : ''}`}
                      />
                      {skill.courseUrl && skill.courseUrl.trim().length > 0 && (
                        <a
                          href={skill.courseUrl.trim().startsWith('http') ? skill.courseUrl.trim() : `https://${skill.courseUrl.trim()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-pink-50 hover:bg-pink-100 text-[#F06292] rounded-xl cursor-pointer transition-all shrink-0 hover:scale-105"
                          title="Go to Course"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Actions Footer */}
              {!isReadOnly && (
                <div className="mt-5 pt-3 border-t border-pink-50/50 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => updateExtraSkill({
                      ...skill,
                      status: skill.status === 'Ongoing' ? 'Completed' : skill.status === 'Completed' ? 'Pending' : 'Ongoing'
                    })}
                    className="text-[10px] font-bold text-pink-500 hover:text-pink-600 cursor-pointer flex items-center gap-1"
                  >
                    <span>Toggle Status</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>

                  {/* Quick hour logger */}
                  <div className="flex items-center gap-1 bg-[#FAF1F3] rounded-lg p-0.5 border border-pink-100/40">
                    <button
                      onClick={() => updateExtraSkill({
                        ...skill,
                        hoursGiven: Math.max(0, skill.hoursGiven - 1)
                      })}
                      className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-pink-600 hover:bg-white rounded-md font-extrabold transition-all"
                      title="Minus 1 hour"
                    >
                      -
                    </button>
                    <span className="font-black text-gray-700 text-[10px] min-w-[28px] text-center">{skill.hoursGiven}h</span>
                    <button
                      onClick={() => updateExtraSkill({
                        ...skill,
                        hoursGiven: skill.hoursGiven + 1
                      })}
                      className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-pink-600 hover:bg-white rounded-md font-extrabold transition-all"
                      title="Plus 1 hour"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </ThreeDCard>
          );
        }))}
      </div>
  </div>
);
};
