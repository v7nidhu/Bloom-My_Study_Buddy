import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Copy, Check, Sparkles, X, CloudCheck, RefreshCw, Plus, ArrowRight, Smartphone, Eye, Edit3, ShieldAlert, Lock, Unlock, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

interface SyncCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyncCodeModal: React.FC<SyncCodeModalProps> = ({ isOpen, onClose }) => {
  const { 
    fullAccessCode, viewOnlyCode, activeCode, isReadOnly, 
    fullAccessEnabled, viewOnlyEnabled, toggleFullAccessCodeStatus, toggleViewOnlyCodeStatus,
    switchSyncId, createNewSyncSpace, isSyncing 
  } = useStudy();

  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedView, setCopiedView] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [switchMessage, setSwitchMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleCopyFull = () => {
    navigator.clipboard.writeText(fullAccessCode);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2500);
  };

  const handleCopyView = () => {
    navigator.clipboard.writeText(viewOnlyCode);
    setCopiedView(true);
    setTimeout(() => setCopiedView(false), 2500);
  };

  const handleJoinCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const clean = inputCode.trim().replaceAll(/[^a-zA-Z0-9_-]/g, '');
    if (!clean) {
      setErrorMessage('Please enter a valid Sync Code.');
      return;
    }

    switchSyncId(clean);
    const isViewCode = clean.toUpperCase().endsWith('-VIEW') || clean.toUpperCase().endsWith('-READONLY') || clean.toUpperCase().startsWith('VIEW-');
    setSwitchMessage(
      isViewCode 
        ? `Loaded in View-Only mode for code "${clean.toUpperCase()}"! (Read-Only)`
        : `Loaded with Full Access for code "${clean.toUpperCase()}"!`
    );
    setInputCode('');
    setTimeout(() => setSwitchMessage(''), 5000);
  };

  const handleCreateNew = () => {
    if (window.confirm('Generate a new fresh Sync Code? You can always return to your current data by re-entering its Sync Code.')) {
      createNewSyncSpace();
      setSwitchMessage('Generated a new Sync Code!');
      setTimeout(() => setSwitchMessage(''), 3000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-[28px] max-w-lg w-full p-6 shadow-2xl border border-pink-100 overflow-hidden relative max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-pink-200">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 leading-tight flex items-center gap-2">
                  Share & Sync Codes 🔑
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Share Full Access to collaborate, or View-Only code to show your live progress!
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Mode Banner */}
          <div className={`mb-4 p-3 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 ${
            isReadOnly 
              ? 'bg-amber-50 border-amber-200 text-amber-900' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center gap-2">
              {isReadOnly ? <Eye className="w-4 h-4 text-amber-600 shrink-0" /> : <Edit3 className="w-4 h-4 text-emerald-600 shrink-0" />}
              <span>Current Status: <strong className="underline">{isReadOnly ? 'View-Only Mode (Read-Only)' : 'Full Access Mode (Edit & Sync)'}</strong></span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-black/5 shrink-0">
              Active: {activeCode}
            </span>
          </div>

          {switchMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-pink-50 border border-pink-200 text-pink-900 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <CloudCheck className="w-4 h-4 text-pink-600 shrink-0" />
              <span>{switchMessage}</span>
            </motion.div>
          )}

          {/* 1. Full Access Code Card */}
          <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border border-pink-200/90 rounded-2xl p-4 mb-3 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-extrabold text-pink-950 flex items-center gap-1.5 uppercase tracking-wider">
                <Edit3 className="w-3.5 h-3.5 text-pink-600" />
                1. Full Access Code (Can Edit & Update)
              </span>
              <div className="flex items-center gap-1.5">
                {!isReadOnly ? (
                  <button
                    type="button"
                    onClick={() => toggleFullAccessCodeStatus(!fullAccessEnabled)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
                      fullAccessEnabled 
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300' 
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                    }`}
                    title="Owner Toggle: Enable or Disable Full Access Code"
                  >
                    {fullAccessEnabled ? (
                      <>
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Code Active</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-rose-600" />
                        <span>Code Disabled</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    fullAccessEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {fullAccessEnabled ? 'Active' : 'Disabled'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 bg-white border-2 border-pink-200 rounded-2xl p-2.5 shadow-xs mb-1.5">
              <div className={`font-mono text-lg sm:text-xl font-black tracking-wider ${
                fullAccessEnabled ? 'text-pink-700' : 'text-gray-400 line-through'
              }`}>
                {fullAccessCode}
              </div>
              <button
                onClick={handleCopyFull}
                disabled={!fullAccessEnabled}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 ${
                  fullAccessEnabled 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {copiedFull ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
              <p className="text-[11px] text-pink-900/80 font-medium flex-1">
                ⚡ Anyone using this code can view, edit, add subjects, update marks, and manage timetable across devices.
              </p>
            </div>
          </div>

          {/* 2. View-Only Code Card */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200/90 rounded-2xl p-4 mb-5 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-extrabold text-purple-950 flex items-center gap-1.5 uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5 text-purple-600" />
                2. View-Only Code (Read-Only)
              </span>
              <div className="flex items-center gap-1.5">
                {!isReadOnly ? (
                  <button
                    type="button"
                    onClick={() => toggleViewOnlyCodeStatus(!viewOnlyEnabled)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
                      viewOnlyEnabled 
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300' 
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                    }`}
                    title="Owner Toggle: Enable or Disable View-Only Code"
                  >
                    {viewOnlyEnabled ? (
                      <>
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Code Active</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-rose-600" />
                        <span>Code Disabled</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    viewOnlyEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {viewOnlyEnabled ? 'Active' : 'Disabled'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 bg-white border-2 border-purple-200 rounded-2xl p-2.5 shadow-xs mb-1.5">
              <div className={`font-mono text-lg sm:text-xl font-black tracking-wider ${
                viewOnlyEnabled ? 'text-purple-700' : 'text-gray-400 line-through'
              }`}>
                {viewOnlyCode}
              </div>
              <button
                onClick={handleCopyView}
                disabled={!viewOnlyEnabled}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 ${
                  viewOnlyEnabled 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {copiedView ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy View Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 mt-1">
              <p className="text-[11px] text-purple-900/80 font-medium flex-1">
                👁️ Share this code with friends or parents. They can view all your live progress & timetable in real time, but cannot change or delete anything.
              </p>
            </div>
          </div>

          {/* Enter Sync Code From Another Device */}
          <form onSubmit={handleJoinCode} className="space-y-2 mb-5">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-pink-500" />
              <span>Load Data from Code (Full Access or View-Only):</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="e.g. STUDY-8942 or STUDY-8942-VIEW"
                className="flex-1 px-4 py-2.5 bg-gray-50 border-2 border-gray-200 focus:border-pink-500 focus:bg-white rounded-xl text-xs font-mono font-bold outline-none transition-all uppercase tracking-wider"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <span>Load Data</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {errorMessage && (
              <p className="text-xs text-rose-500 font-bold mt-1">{errorMessage}</p>
            )}
          </form>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
            <button
              onClick={handleCreateNew}
              className="text-gray-500 hover:text-pink-600 font-bold flex items-center gap-1 hover:underline cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Fresh Space</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const SyncLinkModal = SyncCodeModal;
