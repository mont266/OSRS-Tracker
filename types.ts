export interface Account {
  id: string;
  name: string;
  membership: 'members' | 'f2p';
  gameMode: 'main' | 'ironman' | 'hardcore' | 'group';
}

export interface AppSettings {
  countThirdAge: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  rate?: string;
  source?: string;
  isHeader?: boolean;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  iconUrl?: string;
  items: ChecklistItem[];
}

export type ChecklistData = ChecklistCategory[];