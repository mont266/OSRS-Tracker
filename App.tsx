import React, { useState, useEffect } from 'react';
import { Checklist } from './components/Checklist';
import { AddAccountModal } from './components/AddAccountModal';
import { SettingsModal } from './components/SettingsModal';
import { membersChecklistData } from './data/membersChecklistData';
import { f2pChecklistData } from './data/f2pChecklistData';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Account, AppSettings } from './types';

const defaultAccounts: Account[] = [
  { id: 'mont26', name: 'Mont26 (Members)', membership: 'members', gameMode: 'main' },
  { id: 'feMont26', name: 'Fe Mont26 (F2P)', membership: 'f2p', gameMode: 'ironman' },
];

const defaultSettings: AppSettings = {
  countThirdAge: true,
};

const getGameModeIcon = (gameMode: Account['gameMode']) => {
  const iconClasses = "w-4 h-4 mr-2 object-contain";
  
  switch (gameMode) {
    case 'ironman':
      return <img src="https://oldschool.runescape.wiki/images/Ironman_chat_badge.png?c54b1" alt="Ironman Icon" className={iconClasses} />;
    case 'hardcore':
      return <img src="https://oldschool.runescape.wiki/images/Hardcore_ironman_chat_badge.png?1b467" alt="Hardcore Ironman Icon" className={iconClasses} />;
    case 'group':
      return <img src="https://oldschool.runescape.wiki/images/Group_ironman_chat_badge.png?1b467" alt="Group Ironman Icon" className={iconClasses} />;
    default:
      return null;
  }
};


const App: React.FC = () => {
  const [accounts, setAccounts] = useLocalStorage<Account[]>('osrs-accounts', defaultAccounts);
  const [activeAccountId, setActiveAccountId] = useState<string>(accounts[0]?.id || '');
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settings, setSettings] = useLocalStorage<AppSettings>('osrs-settings', defaultSettings);
  
  useEffect(() => {
    // One-time migration for users with the old data structure
    if (accounts && accounts.length > 0 && (accounts[0] as any).type) {
        const migratedAccounts: Account[] = (accounts as any[]).map(acc => ({
            id: acc.id,
            name: acc.name,
            membership: acc.type,
            gameMode: acc.name.toLowerCase().includes('ironman') || acc.name.toLowerCase().includes('fe') ? 'ironman' : 'main',
        }));
        setAccounts(migratedAccounts);
    }
  }, []);

  const handleSaveAccount = (name: string, membership: 'members' | 'f2p', gameMode: 'main' | 'ironman' | 'hardcore' | 'group') => {
    const newAccount: Account = {
      id: `custom-${Date.now()}`,
      name,
      membership,
      gameMode,
    };
    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
    setActiveAccountId(newAccount.id);
    setIsAddAccountModalOpen(false);
  };

  const getButtonClass = (accountId: string) => {
    const baseClasses = "flex items-center px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 text-sm sm:text-base";
    if (activeAccountId === accountId) {
      return `${baseClasses} bg-blue-600 text-white`;
    }
    return `${baseClasses} bg-slate-700 text-slate-300 hover:bg-slate-600`;
  };

  const activeAccount = accounts.find(acc => acc.id === activeAccountId);

  return (
    <>
      <div className="min-h-screen font-sans bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wider">OSRS Tracker</h1>
              <p className="text-slate-400">Your Completionist Hub</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0 flex-wrap gap-2">
              {accounts.map(account => (
                <button key={account.id} onClick={() => setActiveAccountId(account.id)} className={getButtonClass(account.id)}>
                  {getGameModeIcon(account.gameMode)}
                  {account.name}
                </button>
              ))}
              <button 
                onClick={() => setIsAddAccountModalOpen(true)} 
                className="flex items-center justify-center h-10 w-10 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                aria-label="Add new account"
                title="Add new account"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center justify-center h-10 w-10 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                aria-label="Open settings"
                title="Open settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main>
            {activeAccount ? (
              <Checklist
                key={activeAccount.id}
                characterName={activeAccount.name}
                checklistData={activeAccount.membership === 'members' ? membersChecklistData : f2pChecklistData}
                storageKey={`osrs-checklist-${activeAccount.id}`}
                settings={settings}
              />
            ) : (
              <div className="text-center py-16 bg-slate-800 rounded-xl">
                <h2 className="text-2xl font-bold text-white">No Account Selected</h2>
                <p className="text-slate-400 mt-2">Please select an account or create a new one to begin.</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <AddAccountModal 
        isOpen={isAddAccountModalOpen} 
        onClose={() => setIsAddAccountModalOpen(false)} 
        onSave={handleSaveAccount}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </>
  );
};

export default App;