export interface ProfileBlock {
  id: string;
  category: string;
  title: string;
  content: string;
  icon: string;
  preview?: string;
}

export interface AISuggestion {
  id: string;
  type: 'add' | 'edit' | 'emphasize' | 'quantify';
  title: string;
  reason: string;
  details: string;
  blockId?: string;
  field?: string;
  suggestedValue?: string;
}

export interface Job {
  id: string;
  company: string;
  title: string;
  posting: string;
  keywords: string[];
  matchScore: number;
  strongMatches: string[];
  gaps: string[];
}

export interface Application {
  id: string;
  jobId: string;
  company: string;
  position: string;
  status: 'Submitted' | 'Viewed' | 'Interview' | 'Rejected' | 'No Response';
  appliedDate: string;
  blocksUsed: string[];
  lastUpdate?: string;
}

export type Screen = 'dashboard' | 'profile' | 'application-builder' | 'privacy' | 'tracker' | 'extension';
