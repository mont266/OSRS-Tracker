import React, { useMemo, useCallback, useState } from 'react';
import type { ChecklistData, ChecklistItem, AppSettings } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ProgressBar } from './ProgressBar';
import { ChecklistItemComponent } from './ChecklistItem';
import { DiaryRegionComponent } from './DiaryRegion';

interface ChecklistProps {
  characterName: string;
  checklistData: ChecklistData;
  storageKey: string;
  settings: AppSettings;
}

type SortByType = 'default' | 'az' | 'za';

const isThirdAge = (item: ChecklistItem) => item.label.toLowerCase().includes('3rd age');

const groupDiariesByRegion = (items: ChecklistItem[]) => {
  const regions = new Map<string, ChecklistItem[]>();
  const tierOrder = ['Easy', 'Medium', 'Hard', 'Elite'];

  items.forEach(item => {
    const match = item.label.match(/^(.*) \((Easy|Medium|Hard|Elite)\)$/);
    if (match) {
      const regionName = match[1];
      if (!regions.has(regionName)) {
        regions.set(regionName, []);
      }
      regions.get(regionName)!.push(item);
    }
  });

  regions.forEach(tiers => {
    tiers.sort((a, b) => {
      const tierA = a.label.match(/\(([^)]+)\)/)![1];
      const tierB = b.label.match(/\(([^)]+)\)/)![1];
      return tierOrder.indexOf(tierA) - tierOrder.indexOf(tierB);
    });
  });

  return Array.from(regions.entries());
};

export const Checklist: React.FC<ChecklistProps> = ({ characterName, checklistData, storageKey, settings }) => {
  const [completedIdsArray, setCompletedIdsArray] = useLocalStorage<string[]>(storageKey, []);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(checklistData[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortByType>('default');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['clog_header_clues_beginner']));

  const completedItems = useMemo(() => new Set(completedIdsArray), [completedIdsArray]);

  const totalItems = useMemo(() =>
    checklistData.reduce((sum, category) => {
      let categoryItems = category.items.filter(item => !item.isHeader);
      if (category.id === 'mem_collection_log' && !settings.countThirdAge) {
          categoryItems = categoryItems.filter(item => !isThirdAge(item));
      }
      return sum + categoryItems.length;
    }, 0),
    [checklistData, settings.countThirdAge]
  );
  
  const completedItemsCount = useMemo(() => {
    if (settings.countThirdAge) {
      return completedItems.size;
    }
    // Create a map of all items for efficient lookup.
    const allItemsMap = new Map<string, ChecklistItem>();
    checklistData.forEach(category => {
        category.items.forEach(item => {
            if (!item.isHeader) {
                allItemsMap.set(item.id, item);
            }
        });
    });

    // When countThirdAge is false, we filter out 3rd age items from the completed set.
    const completedIds = Array.from(completedItems);
    // FIX: The type of `id` can be `unknown` if the data from localStorage is not a string array.
    // Cast `id` to `string` to use it as a key for `allItemsMap`.
    // The redundant counting loop has been removed.
    const filteredCompletedIds = completedIds.filter(id => {
        const item = allItemsMap.get(id as string);
        return item && !isThirdAge(item);
    });

    return filteredCompletedIds.length;
  }, [completedItems, checklistData, settings.countThirdAge]);

  const progress = totalItems > 0 ? (completedItemsCount / totalItems) * 100 : 0;

  const handleTabClick = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setSearchQuery('');
    setSortBy('default');
    if(categoryId === 'mem_collection_log') {
        setExpandedSections(new Set(['clog_header_clues_beginner']));
    } else {
        setExpandedSections(new Set());
    }
  };

  const handleToggleItem = useCallback((itemId: string) => {
    setCompletedIdsArray(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(itemId)) {
        newIds.delete(itemId);
      } else {
        newIds.add(itemId);
      }
      return Array.from(newIds);
    });
  }, [setCompletedIdsArray]);
  
  const activeCategory = useMemo(() => checklistData.find(c => c.id === activeCategoryId), [checklistData, activeCategoryId]);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  const handleToggleCategory = useCallback((items: ChecklistItem[]) => {
    setCompletedIdsArray(prevIds => {
      const categoryItemIds = new Set(items.filter(item => !item.isHeader).map(item => item.id));
      const currentCompletedInCategory = prevIds.filter(id => categoryItemIds.has(id));
      
      const areAllCompleted = currentCompletedInCategory.length === categoryItemIds.size;
      const currentCompletedSet = new Set(prevIds);

      if (areAllCompleted) {
        categoryItemIds.forEach(id => currentCompletedSet.delete(id));
      } else {
        categoryItemIds.forEach(id => currentCompletedSet.add(id));
      }
      
      return Array.from(currentCompletedSet);
    });
  }, [setCompletedIdsArray]);

  const handleDiaryTiersUpdate = useCallback((idsToAdd: string[], idsToRemove: string[]) => {
    setCompletedIdsArray(prevIds => {
        const newIdSet = new Set(prevIds);
        idsToAdd.forEach(id => newIdSet.add(id));
        idsToRemove.forEach(id => newIdSet.delete(id));
        return Array.from(newIdSet);
    });
  }, [setCompletedIdsArray]);

  const processedItems = useMemo(() => {
    if (!activeCategory) return [];
    
    let itemsToProcess = activeCategory.items;
    if (activeCategory.id === 'mem_collection_log' && !settings.countThirdAge) {
      itemsToProcess = itemsToProcess.filter(item => !isThirdAge(item));
    }
    
    const hasHeaders = itemsToProcess.some(item => item.isHeader);

    if (hasHeaders) {
      const filteredList: ChecklistItem[] = [];
      let currentHeader: ChecklistItem | null = null;
      let itemsUnderHeader: ChecklistItem[] = [];

      const processSection = () => {
        if (itemsUnderHeader.length > 0) {
            if(currentHeader) filteredList.push(currentHeader);
            filteredList.push(...itemsUnderHeader);
        } else if (searchQuery && currentHeader && currentHeader.label.toLowerCase().includes(searchQuery.toLowerCase())) {
            // Include header if it matches search, even if its items don't
            filteredList.push(currentHeader);
        }
      }

      for (const item of itemsToProcess) {
        if (item.isHeader) {
          processSection();
          currentHeader = item;
          itemsUnderHeader = [];
        } else {
          const searchMatch = !searchQuery || 
              item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
              (currentHeader && currentHeader.label.toLowerCase().includes(searchQuery.toLowerCase()));
          const hideMatch = !hideCompleted || !completedItems.has(item.id);

          if (searchMatch && hideMatch) {
            itemsUnderHeader.push(item);
          }
        }
      }
      processSection();

      return filteredList;
    }

    const items = itemsToProcess
      .filter(item => !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(item => !hideCompleted || !completedItems.has(item.id));
    
    if (sortBy === 'az') return [...items].sort((a, b) => a.label.localeCompare(b.label));
    if (sortBy === 'za') return [...items].sort((a, b) => b.label.localeCompare(a.label));
    return items;
  }, [activeCategory, searchQuery, hideCompleted, completedItems, sortBy, settings.countThirdAge]);

  const allDiaryRegions = useMemo(() => {
    if (activeCategory?.id === 'mem_diaries') {
      return groupDiariesByRegion(activeCategory.items);
    }
    return null;
  }, [activeCategory]);

  const processedDiaryRegions = useMemo(() => {
    if (!allDiaryRegions) return null;

    const regions = allDiaryRegions
      .filter(([regionName]) => !searchQuery || regionName.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(([, tiers]) => !hideCompleted || !tiers.every(t => completedItems.has(t.id)));
      
    if (sortBy === 'az') return [...regions].sort(([a], [b]) => a.localeCompare(b));
    if (sortBy === 'za') return [...regions].sort(([a], [b]) => b.localeCompare(a));
    
    return regions;
  }, [allDiaryRegions, searchQuery, hideCompleted, completedItems, sortBy]);

  const getCategoryProgress = useCallback((categoryItems: ChecklistItem[]) => {
    let actualItems = categoryItems.filter(item => !item.isHeader);
     if (activeCategory?.id === 'mem_collection_log' && !settings.countThirdAge) {
      actualItems = actualItems.filter(item => !isThirdAge(item));
    }
    const completed = actualItems.filter(item => completedItems.has(item.id)).length;
    return { completed, total: actualItems.length };
  }, [completedItems, settings.countThirdAge, activeCategory]);

  const { completed: completedInCategory, total: totalInCategory } = activeCategory ? getCategoryProgress(activeCategory.items) : { completed: 0, total: 0 };
  const areAllInCategoryCompleted = totalInCategory > 0 && completedInCategory === totalInCategory;

  const searchResultsCount = processedDiaryRegions ? processedDiaryRegions.length : processedItems.filter(i => !i.isHeader).length;
  
  const isCategoryCompleteAndHidden = hideCompleted && areAllInCategoryCompleted && !searchQuery;

  const hasHeaders = useMemo(() => activeCategory?.items.some(i => i.isHeader) ?? false, [activeCategory]);
  
  const sections = useMemo(() => {
    if (!hasHeaders) return null;

    const sectionList: { header: ChecklistItem; items: ChecklistItem[] }[] = [];
    
    processedItems.forEach(item => {
        if (item.isHeader) {
            sectionList.push({ header: item, items: [] });
        } else if (sectionList.length > 0) {
            sectionList[sectionList.length - 1].items.push(item);
        }
    });
    return sectionList.filter(section => section.items.length > 0 || (searchQuery && section.header.label.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [hasHeaders, processedItems, searchQuery]);

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg ring-1 ring-slate-700/60 overflow-hidden">
      <div className="p-6 space-y-6">
        <ProgressBar progress={progress} completed={completedItemsCount} total={totalItems} />

        <nav className="flex space-x-3 overflow-x-auto py-2 -mx-6 px-6" aria-label="Tabs">
          {checklistData.map(category => {
            const { completed, total } = getCategoryProgress(category.items);
            return (
              <button
                key={category.id}
                onClick={() => handleTabClick(category.id)}
                className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500
                  ${category.id === activeCategoryId
                    ? 'bg-slate-700 ring-2 ring-blue-500'
                    : 'bg-slate-900/70 hover:bg-slate-700'
                  }`
                }
                role="tab"
                aria-selected={category.id === activeCategoryId}
                data-tooltip={`${category.title} (${completed}/${total})`}
              >
                {category.iconUrl && <img src={category.iconUrl} alt={category.title} className="w-9 h-9 object-contain" />}
                {total > 0 && completed === total && (
                   <span className="absolute -top-1 -right-1 flex h-4 w-4">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                     </span>
                   </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="space-y-4">
           {activeCategory && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-xl font-bold text-white tracking-wide">{activeCategory.title}</h3>
                {totalInCategory > 0 && activeCategory.id !== 'mem_diaries' && !hasHeaders && (
                  <label className="flex items-center space-x-2 cursor-pointer text-sm text-slate-300 hover:text-white">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={areAllInCategoryCompleted}
                        onChange={() => handleToggleCategory(activeCategory.items)}
                        className="appearance-none h-5 w-5 rounded bg-slate-600 border-slate-500 checked:bg-green-500 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition-all"
                      />
                      {areAllInCategoryCompleted && (
                        <svg className="absolute left-0.5 top-0.5 h-4 w-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span>Mark all as complete</span>
                  </label>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:flex-grow">
                  <input
                    type="text"
                    placeholder={`Search in ${activeCategory.title}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-700/60 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto flex-shrink-0">
                  <div className="relative">
                     <select
                        id="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortByType)}
                        className="appearance-none w-full md:w-auto bg-slate-700/60 border border-slate-600 rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Sort items"
                     >
                        <option value="default">Default Order</option>
                        <option value="az">A-Z</option>
                        <option value="za">Z-A</option>
                     </select>
                     <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                     </svg>
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer text-sm text-slate-300 hover:text-white whitespace-nowrap">
                      <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={hideCompleted}
                            onChange={(e) => setHideCompleted(e.target.checked)}
                            className="appearance-none h-5 w-5 rounded bg-slate-600 border-slate-500 checked:bg-green-500 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition-all"
                        />
                        {hideCompleted && (
                          <svg className="absolute left-0.5 top-0.5 h-4 w-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span>Hide Completed</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="max-h-[calc(100vh-26rem)] sm:max-h-[calc(100vh-24rem)] overflow-y-auto pr-2 space-y-2">
            {processedDiaryRegions ? (
              processedDiaryRegions.map(([regionName, tiers]) => (
                <DiaryRegionComponent 
                    key={regionName}
                    regionName={regionName}
                    tiers={tiers}
                    completedItems={completedItems}
                    onDiaryTiersUpdate={handleDiaryTiersUpdate}
                />
              ))
            ) : hasHeaders && sections ? (
                sections.map(({ header, items }) => {
                    const isExpanded = expandedSections.has(header.id);
                    return (
                        <div key={header.id}>
                            <button
                                onClick={() => toggleSection(header.id)}
                                className="w-full flex items-center justify-between pt-4 pb-1 px-1 first:pt-0"
                                aria-expanded={isExpanded}
                            >
                                <h4 className="text-md font-bold text-slate-300 tracking-wide border-b-2 border-slate-700 pb-2 flex-grow text-left">
                                    {header.label}
                                </h4>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isExpanded && (
                                <div className="pt-2 space-y-2">
                                    {items.map(item => (
                                        <ChecklistItemComponent
                                            key={item.id}
                                            item={item}
                                            isChecked={completedItems.has(item.id)}
                                            onToggle={handleToggleItem}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
              processedItems.map(item => (
                <ChecklistItemComponent
                  key={item.id}
                  item={item}
                  isChecked={completedItems.has(item.id)}
                  onToggle={handleToggleItem}
                />
              ))
            )}
            {searchResultsCount === 0 && (
                <div className="text-center py-8 flex flex-col items-center justify-center space-y-2">
                    {isCategoryCompleteAndHidden ? (
                      <>
                        <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h4 className="text-lg font-semibold text-white">Category Complete!</h4>
                      </>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <p className="text-slate-400">{searchQuery ? `No results for "${searchQuery}".` : `Nothing to show.`}</p>
                      </>
                    )}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
