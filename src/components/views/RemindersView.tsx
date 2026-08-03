import React from 'react';
import { Bell, Plus, Trash2, Edit2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Reminder } from '../../types';

interface RemindersViewProps {
  onOpenModal: (type: 'reminder', initialData?: Reminder) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({ onOpenModal }) => {
  const { reminders, deleteReminder, toggleReminderCompleted, isReadOnly } = useStudy();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[22px] border border-pink-100 shadow-sm shadow-pink-100/50">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-pink-500" />
            <h1 className="text-xl font-bold text-gray-800">Reminders</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Timely notifications for assignment submissions, study blocks, and upcoming exams.
          </p>
        </div>
        {!isReadOnly && (
          <button
            onClick={() => onOpenModal('reminder')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-[16px] text-xs font-semibold shadow-md shadow-pink-200 hover:from-pink-600 hover:to-pink-500 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Set Reminder</span>
          </button>
        )}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="bg-white rounded-[22px] border border-dashed border-pink-200 p-12 text-center">
            <Bell className="w-10 h-10 text-pink-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700">No reminders set</h3>
            <p className="text-xs text-gray-400 mt-1">Set reminders for study sessions or assignment deadlines.</p>
            {!isReadOnly && (
              <button
                onClick={() => onOpenModal('reminder')}
                className="mt-4 px-4 py-2 bg-pink-50 text-pink-600 rounded-[14px] text-xs font-bold hover:bg-pink-100 cursor-pointer"
              >
                + Create Reminder
              </button>
            )}
          </div>
        ) : (
          reminders.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-[22px] border border-pink-100 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                r.completed ? 'opacity-60 bg-gray-50/50' : 'hover:shadow-md hover:shadow-pink-200/40'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  onClick={() => { if (!isReadOnly) toggleReminderCompleted(r.id); }}
                  disabled={isReadOnly}
                  className={`mt-0.5 text-pink-500 shrink-0 ${isReadOnly ? 'cursor-not-allowed opacity-60' : 'hover:text-pink-600 cursor-pointer'}`}
                >
                  <CheckCircle2 className={`w-5 h-5 ${r.completed ? 'fill-pink-500 text-white' : 'text-pink-300'}`} />
                </button>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm font-bold text-gray-800 ${r.completed ? 'line-through text-gray-400' : ''}`}>
                      {r.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      r.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-pink-100 text-pink-600'
                    }`}>
                      {r.priority} Priority
                    </span>
                    <span className="text-[10px] font-semibold bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                      {r.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-pink-600 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    <span>{r.dateTime.replace('T', ' ')}</span>
                  </div>
                </div>
              </div>

              {!isReadOnly && (
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => onOpenModal('reminder', r)}
                    className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors cursor-pointer"
                    title="Edit Reminder"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteReminder(r.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete Reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
