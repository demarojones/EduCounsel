export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  notes: string;
}

export interface Contact {
  id: string;
  type: 'Parent' | 'DCFS' | 'Teacher' | 'Administrator' | 'Other';
  firstName: string;
  lastName: string;
  relation?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface InteractionReason {
  id: string;
  category: string;
  subcategory: string;
}

export type InteractionType = 'Student' | 'Contact';

export interface Interaction {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type: InteractionType;
  personId: string;
  personName: string;
  reasonIds: string[];
  notes: string;
  followUpNeeded: boolean;
  followUpDate?: string;
}

export interface CounselorStats {
  totalInteractions: number;
  totalTimeSpent: number; // in minutes
  studentInteractions: number;
  contactInteractions: number;
  followUpsNeeded: number;
}