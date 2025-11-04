import React from 'react';
import type { ChecklistItem } from '../types';

interface DiaryRegionProps {
  regionName: string;
  tiers: ChecklistItem[];
  completedItems: Set<string>;
  onDiaryTiersUpdate: (idsToAdd: string[], idsToRemove: string[]) => void;
}

const tierMap: { [key: string]: string } = {
  Easy: 'E',
  Medium: 'M',
  Hard: 'H',
  Elite: 'El',
};

const tierOrder = ['Easy', 'Medium', 'Hard', 'Elite'];

const CheckboxWithLabel: React.FC<{ tier: ChecklistItem; isChecked: boolean; onToggle: (id: string) => void; }> = ({ tier, isChecked, onToggle }) => {
  const tierName = tier.label.match(/\(([^)]+)\)/)?.[1] || '';
  return (
    <label key={tier.id} title={tierName} className="flex items-center space-x-2 cursor-pointer group">
       <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggle(tier.id)}
          className="appearance-none h-5 w-5 rounded bg-slate-600 border border-slate-500 checked:bg-green-500 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition-all"
        />
        {isChecked && (
          <svg className="absolute left-0.5 top-0.5 h-4 w-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`font-bold text-sm w-4 text-center ${isChecked ? 'text-green-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
        {tierMap[tierName] || tierName.charAt(0)}
      </span>
    </label>
  );
}


export const DiaryRegionComponent: React.FC<DiaryRegionProps> = ({ regionName, tiers, completedItems, onDiaryTiersUpdate }) => {
  const handleToggle = (toggledTierId: string) => {
    const isCurrentlyChecked = completedItems.has(toggledTierId);
    const toggledTier = tiers.find(t => t.id === toggledTierId);

    if (!toggledTier) return;
    
    const tierNameMatch = toggledTier.label.match(/\(([^)]+)\)/);
    if (!tierNameMatch) return;

    const tierName = tierNameMatch[1];
    const tierIndex = tierOrder.indexOf(tierName);

    if (tierIndex === -1) return;

    if (!isCurrentlyChecked) { // Toggling ON
      const tiersToComplete = tierOrder.slice(0, tierIndex + 1);
      const idsToAdd = tiers
        .filter(t => {
          const tNameMatch = t.label.match(/\(([^)]+)\)/);
          return tNameMatch && tiersToComplete.includes(tNameMatch[1]);
        })
        .map(t => t.id);
      onDiaryTiersUpdate(idsToAdd, []);
    } else { // Toggling OFF
      const tiersToUncomplete = tierOrder.slice(tierIndex);
      const idsToRemove = tiers
        .filter(t => {
          const tNameMatch = t.label.match(/\(([^)]+)\)/);
          return tNameMatch && tiersToUncomplete.includes(tNameMatch[1]);
        })
        .map(t => t.id);
      onDiaryTiersUpdate([], idsToRemove);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors duration-200">
      <span className="text-base text-slate-100">{regionName}</span>
      <div className="flex items-center space-x-2 sm:space-x-3">
        {tiers.map(tier => (
          <CheckboxWithLabel
            key={tier.id}
            tier={tier}
            isChecked={completedItems.has(tier.id)}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
};