import React, { useState } from 'react';
import { X, CheckSquare } from 'lucide-react';
import { Task, Subject } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'> | Task) => void;
  initialData?: Task | null;
  subjects: Subject[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  subjects
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState(initialData?.title || '');
  const [subject, setSubject] = useState(initialData?.subject || (subjects[0]?.name || 'General'));
  const [dueDate, setDueDate] = useState(initialData?.dueDate || todayStr);
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>(initialData?.priority || 'Medium');
  const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Done'>(initialData?.status || 'To Do');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialData) {
      onSave({
        ...initialData,
        title: title.trim(),
        subject,
        dueDate,
        priority,
        status,
        description: description.trim()
      });
    } else {
      onSave({
        title: title.trim(),
        subject,
        dueDate,
        priority,
        status,
        description: description.trim()
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] border border-pink-100 shadow-2xl shadow-pink-200/50 w-full max-w-md p-6">
        <div className="flex items-center justify-between pb-4 border-b border-pink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">
              {initialData ? 'Edit Task / Assignment' : 'New Task / Assignment'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-pink-50 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete BST rotation assignment"
              className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
              >
                <option value="General">General / Other</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
              >
                <option value="High">🔥 High</option>
                <option value="Medium">⚡ Medium</option>
                <option value="Low">🌱 Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description / Guidelines</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key requirements or submission details..."
              className="w-full px-3.5 py-2.5 bg-pink-50/40 border border-pink-200 rounded-[14px] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-100">
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
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
