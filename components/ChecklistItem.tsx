import React from 'react';
import type { ChecklistItem } from '../types';

interface ChecklistItemProps {
  item: ChecklistItem;
  isChecked: boolean;
  onToggle: (itemId: string) => void;
}

export const ChecklistItemComponent: React.FC<ChecklistItemProps> = ({ item, isChecked, onToggle }) => {
  return (
    <label className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
      isChecked 
        ? 'bg-green-500/10 hover:bg-green-500/20' 
        : 'bg-slate-700/50 hover:bg-slate-700'
    }`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggle(item.id)}
          className="appearance-none h-5 w-5 rounded bg-slate-600 border border-slate-500 checked:bg-green-500 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition-all"
        />
        {isChecked && (
          <svg className="absolute left-0.5 top-0.5 h-4 w-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="ml-3 flex-grow flex flex-col items-start sm:flex-row sm:justify-between sm:items-center">
        <span className={`text-sm md:text-base ${isChecked ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
          {item.label}
        </span>
        {(item.rate || item.source) && (
           <div className="mt-1 sm:mt-0 sm:ml-4 flex-shrink-0 text-left sm:text-right">
             {item.rate && <span className="block text-sm font-semibold text-sky-400">{item.rate}</span>}
             {item.source && <span className="block text-xs text-slate-400">{item.source}</span>}
           </div>
         )}
      </div>
    </label>
  );
};