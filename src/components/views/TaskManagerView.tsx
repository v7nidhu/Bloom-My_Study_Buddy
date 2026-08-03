import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Edit2, Calendar, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Task } from '../../types';
import { ThreeDCard } from '../ThreeDBackground';
import { CuteCatBooks, CuteCoffeeMug, CuteMagicStar, CuteGoalBullseye, CutePencilHappy } from '../CuteImages';

interface TaskManagerViewProps {
  onOpenModal: (type: 'task', initialData?: Task) => void;
}

export const TaskManagerView: React.FC<TaskManagerViewProps> = ({ onOpenModal }) => {
  const { tasks, deleteTask, toggleTaskStatus, isReadOnly } = useStudy();
  const [filterStatus, setFilterStatus] = useState<'All' | 'To Do' | 'In Progress' | 'Done'>('All');
  const [filterSubject, setFilterSubject] = useState<string>('All');

  const subjectsList = Array.from(new Set(tasks.map(t => t.subject)));

  const filteredTasks = tasks.filter(t => {
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    if (filterSubject !== 'All' && t.subject !== filterSubject) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/50">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-pink-500" />
            <h1 className="text-xl font-bold text-gray-800">Assignment & Task Manager</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Track homework assignments, lab reports, and study deadlines.
          </p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => onOpenModal('task')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-[16px] text-xs font-semibold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-500 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Assignment / Task</span>
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-[20px] border border-pink-100 shadow-sm shadow-pink-100/30">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-pink-400" /> Status:
          </span>
          {(['All', 'To Do', 'In Progress', 'Done'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                filterStatus === st
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {subjectsList.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">Subject:</span>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-1.5 bg-pink-50/50 border border-pink-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Subjects</option>
              {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-[22px] border border-dashed border-pink-200 p-12 text-center">
            <CheckSquare className="w-10 h-10 text-pink-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700">No tasks found</h3>
            <p className="text-xs text-gray-400 mt-1">Try clearing filters or add a new task assignment.</p>
            {!isReadOnly && (
              <button
                onClick={() => onOpenModal('task')}
                className="mt-4 px-4 py-2 bg-pink-50 text-pink-600 rounded-[14px] text-xs font-bold hover:bg-pink-100 cursor-pointer"
              >
                + Create New Task
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((t) => {
            const getTaskSticker = () => {
              if (t.status === 'Done') return <CuteMagicStar size={44} />;
              if (t.priority === 'High') return <CuteGoalBullseye size={44} />;
              if (t.priority === 'Medium') return <CutePencilHappy size={44} />;
              return <CuteCoffeeMug size={44} />;
            };

            return (
              <ThreeDCard
                key={t.id}
                disabledHoverScale={true}
                className={`bg-white rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all w-full ${
                  t.status === 'Done' ? 'opacity-70 bg-gray-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={t.status === 'Done'}
                    disabled={isReadOnly}
                    onChange={() => { if (!isReadOnly) toggleTaskStatus(t.id); }}
                    className={`w-5 h-5 mt-0.5 rounded-lg border-2 border-pink-300 text-pink-500 focus:ring-pink-300 ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-sm sm:text-base font-bold text-gray-800 ${t.status === 'Done' ? 'line-through text-gray-400' : ''}`}>
                        {t.title}
                      </h3>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        t.priority === 'High' 
                          ? 'bg-red-100 text-red-600' 
                          : t.priority === 'Medium' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {t.priority} Priority
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
                        {t.status}
                      </span>
                    </div>

                    {t.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed pr-6">
                        {t.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-medium text-gray-500">
                      <span className="text-pink-600 font-bold bg-pink-50 px-2.5 py-0.5 rounded-lg border border-pink-100">
                        {t.subject}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" />
                        <span>Due Date: {t.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto shrink-0 z-10">
                  <div className="hidden sm:block select-none pointer-events-none">
                    {getTaskSticker()}
                  </div>
                  {!isReadOnly && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenModal('task', t)}
                        className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors cursor-pointer"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </ThreeDCard>
            );
          })
        )}
      </div>
    </div>
  );
};
