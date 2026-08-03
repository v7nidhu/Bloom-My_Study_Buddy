import React, { useState, useMemo } from 'react';
import { Palette, X, Check, RotateCcw, Sparkles } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { PRESET_THEMES, applyThemeColor } from '../../utils/theme';
import { motion } from 'motion/react';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
  const { themeColor, setThemeColor } = useStudy();
  const [selectedHex, setSelectedHex] = useState(themeColor);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(PRESET_THEMES.map(t => t.category)));
    return ['All', ...cats];
  }, []);

  const filteredThemes = useMemo(() => {
    if (activeCategory === 'All') return PRESET_THEMES;
    return PRESET_THEMES.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  if (!isOpen) return null;

  const handleSelectPreset = (hex: string) => {
    setSelectedHex(hex);
    applyThemeColor(hex);
  };

  const handleCustomColorChange = (hex: string) => {
    setSelectedHex(hex);
    applyThemeColor(hex);
  };

  const handleSave = async () => {
    await setThemeColor(selectedHex);
    onClose();
  };

  const handleReset = async () => {
    const defaultPink = '#ec4899';
    setSelectedHex(defaultPink);
    applyThemeColor(defaultPink);
    await setThemeColor(defaultPink);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white w-full max-w-2xl rounded-[28px] shadow-2xl border border-pink-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-pink-50 via-white to-pink-50 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-100 text-pink-600 rounded-2xl">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                Color Palette Theme Studio <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Choose any shade from the full spectrum palette or select a custom hex code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Category Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Color Palette Collection
              </label>
              <span className="text-[11px] font-semibold text-gray-400">
                {filteredThemes.length} colors
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-pink-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Preset Colors Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 max-h-64 overflow-y-auto pr-1">
              {filteredThemes.map((theme) => {
                const isSelected = selectedHex.toLowerCase() === theme.hex.toLowerCase();
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleSelectPreset(theme.hex)}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/60 shadow-xs ring-2 ring-pink-400/40 font-bold'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/80'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-xl border border-white/80 shadow-xs shrink-0 flex items-center justify-center text-white"
                      style={{ backgroundColor: theme.hex }}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-xs">{theme.emoji}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-800 truncate">{theme.name}</div>
                      <div className="text-[10px] text-gray-400 uppercase font-mono">{theme.hex}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Custom Hex Color Picker
            </label>
            <div className="flex items-center gap-3">
              <div
                className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0 cursor-pointer"
                style={{ backgroundColor: selectedHex }}
              >
                <input
                  type="color"
                  value={selectedHex}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">HEX:</span>
                <input
                  type="text"
                  value={selectedHex}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  placeholder="#ec4899"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Live Theme Preview
            </label>
            <div 
              className="p-4 rounded-2xl border space-y-3 transition-colors duration-200"
              style={{
                backgroundColor: 'var(--theme-50)',
                borderColor: 'var(--theme-200)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: 'var(--theme-800)' }}>
                  Active Component Theme
                </span>
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                  style={{
                    backgroundColor: 'var(--theme-100)',
                    color: 'var(--theme-700)',
                    borderColor: 'var(--theme-300)',
                  }}
                >
                  Active Tag
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-200)' }}>
                <div className="h-full w-2/3 rounded-full" style={{ backgroundColor: 'var(--theme-600)' }} />
              </div>
              <button 
                type="button"
                className="w-full py-2 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                style={{ backgroundColor: 'var(--theme-600)' }}
              >
                Primary Theme Action
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200/50 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all cursor-pointer"
              style={{ backgroundColor: 'var(--theme-600)' }}
            >
              Apply Theme
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
