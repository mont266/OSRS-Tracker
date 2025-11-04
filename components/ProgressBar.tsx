import React from 'react';

interface ProgressBarProps {
  progress: number;
  completed: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, completed, total }) => {
  const progressPercent = progress.toFixed(2);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-2xl font-bold text-white">Overall Progress</h2>
        <span className="text-sm font-medium text-slate-400">{completed} / {total} Tasks</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-5 relative overflow-hidden ring-1 ring-slate-600/50">
        <div
          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
         <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-lighten">
          {progressPercent}%
        </span>
      </div>
    </div>
  );
};