import React from 'react';
import type { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {

  if (!isOpen) {
    return null;
  }

  const handleToggleThirdAge = () => {
    onSettingsChange({ ...settings, countThirdAge: !settings.countThirdAge });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-lg ring-1 ring-slate-700/60 w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 id="settings-title" className="text-2xl font-bold text-white">Settings</h2>
            <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="Close settings modal"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div>
                <p className="font-semibold text-slate-100">Count 3rd Age Items</p>
                <p className="text-sm text-slate-400">Include 3rd age items in completion totals.</p>
            </div>
            <label htmlFor="third-age-toggle" className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="third-age-toggle"
                className="sr-only peer" 
                checked={settings.countThirdAge}
                onChange={handleToggleThirdAge}
              />
              <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-md font-semibold text-sm bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
