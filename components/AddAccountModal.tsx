import React, { useState, useEffect } from 'react';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, membership: 'members' | 'f2p', gameMode: 'main' | 'ironman' | 'hardcore' | 'group') => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [membership, setMembership] = useState<'members' | 'f2p'>('members');
  const [gameMode, setGameMode] = useState<'main' | 'ironman' | 'hardcore' | 'group'>('main');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setMembership('members');
      setGameMode('main');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  
  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), membership, gameMode);
    }
  };

  const isNameValid = name.trim().length > 0;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-account-title"
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-lg ring-1 ring-slate-700/60 w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="add-account-title" className="text-2xl font-bold text-white mb-6">Create New Account</h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="account-name" className="block text-sm font-medium text-slate-300 mb-1">
              Account Name
            </label>
            <input
              type="text"
              id="account-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Main, Group Ironman"
              className="block w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>

          <div className="space-y-4">
            <div>
              <span className="block text-sm font-medium text-slate-300 mb-2">Membership Type</span>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${membership === 'members' ? 'bg-blue-600/50 ring-2 ring-blue-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
                  <input 
                    type="radio" 
                    name="membership-type" 
                    value="members"
                    checked={membership === 'members'}
                    onChange={() => setMembership('members')}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-white">Members</span>
                </label>
                <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${membership === 'f2p' ? 'bg-blue-600/50 ring-2 ring-blue-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
                  <input 
                    type="radio" 
                    name="membership-type" 
                    value="f2p"
                    checked={membership === 'f2p'}
                    onChange={() => setMembership('f2p')}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-white">Free to Play</span>
                </label>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-slate-300 mb-2">Account Type</span>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${gameMode === 'main' ? 'bg-blue-600/50 ring-2 ring-blue-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
                  <input 
                    type="radio" 
                    name="account-type" 
                    value="main"
                    checked={gameMode === 'main'}
                    onChange={() => setGameMode('main')}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-white">Main</span>
                </label>
                <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${gameMode === 'ironman' ? 'bg-blue-600/50 ring-2 ring-blue-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
                  <input 
                    type="radio" 
                    name="account-type" 
                    value="ironman"
                    checked={gameMode === 'ironman'}
                    onChange={() => setGameMode('ironman')}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-white">Ironman</span>
                </label>
                <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${gameMode === 'hardcore' ? 'bg-blue-600/50 ring-2 ring-blue-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
                  <input 
                    type="radio" 
                    name="account-type" 
                    value="hardcore"
                    checked={gameMode === 'hardcore'}
                    onChange={() => setGameMode('hardcore')}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-white">Hardcore Ironman</span>
                </label>
                <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${gameMode === 'group' ? 'bg-blue-600/50 ring-2 ring-blue-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
                  <input 
                    type="radio" 
                    name="account-type" 
                    value="group"
                    checked={gameMode === 'group'}
                    onChange={() => setGameMode('group')}
                    className="sr-only"
                  />
                  <span className="text-sm font-semibold text-white">Group Ironman</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md font-semibold text-sm bg-slate-600 text-slate-200 hover:bg-slate-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!isNameValid}
            className="px-4 py-2 rounded-md font-semibold text-sm bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 disabled:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};