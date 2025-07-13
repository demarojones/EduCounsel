import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Student,
  Contact,
  Interaction,
  InteractionReason,
  CounselorStats,
  Profile,
} from '../types';
import {
  profiles as initialProfiles,
  students as initialStudents,
  contacts as initialContacts,
  interactions as initialInteractions,
  interactionReasons as initialReasons,
  counselorStats as initialStats,
} from '../services/mockData';

interface AppContextType {
  profiles: Profile[]; // Placeholder for profiles, can be replaced with actual type
  students: Student[];
  contacts: Contact[];
  interactions: Interaction[];
  interactionReasons: InteractionReason[];
  stats: CounselorStats;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
  addInteraction: (interaction: Omit<Interaction, 'id'>) => void;
  updateInteraction: (interaction: Interaction) => void;
  deleteInteraction: (id: string) => void;
  addReason: (reason: Omit<InteractionReason, 'id'>) => void;
  updateReason: (reason: InteractionReason) => void;
  deleteReason: (id: string) => void;
  calculateInteractionDuration: (startTime: string, endTime: string) => number;
  getReasonById: (id: string) => InteractionReason | undefined;
  updateStats: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  // Profiles can be fetched from an API or a mock data source
  // For now, we are using mock data
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [interactions, setInteractions] = useState<Interaction[]>(initialInteractions);
  const [interactionReasons, setInteractionReasons] = useState<InteractionReason[]>(initialReasons);
  const [stats, setStats] = useState<CounselorStats>(initialStats);

  const addProfile = (profileData: Omit<Profile, 'id'>) => {
    const newProfile = { ...profileData, id: generateId() };
    setProfiles([...profiles, newProfile]);
  };

  const updateProfile = (updatedProfile: Profile) => {
    setProfiles(
      profiles.map((profile) => (profile.id === updatedProfile.id ? updatedProfile : profile))
    );
  };

  const deleteProfile = (id: string) => {
    setProfiles(profiles.filter((profile) => profile.id !== id));
    // Option: Could also delete associated students, contacts, and interactions
  };

  const getProfileById = (id: string) => {
    return profiles.find((profile) => profile.id === id);
  };

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent = { ...studentData, id: generateId() };
    setStudents([...students, newStudent]);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(
      students.map((student) => (student.id === updatedStudent.id ? updatedStudent : student))
    );

    // Update interaction person names if student name changed
    const studentFullName = `${updatedStudent.firstName} ${updatedStudent.lastName}`;
    setInteractions(
      interactions.map((interaction) =>
        interaction.personId === updatedStudent.id
          ? { ...interaction, personName: studentFullName }
          : interaction
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter((student) => student.id !== id));
    // Option: Could also delete associated interactions
  };

  const addContact = (contactData: Omit<Contact, 'id'>) => {
    const newContact = { ...contactData, id: generateId() };
    setContacts([...contacts, newContact]);
  };

  const updateContact = (updatedContact: Contact) => {
    setContacts(
      contacts.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact))
    );

    // Update interaction person names if contact name changed
    const contactFullName = `${updatedContact.firstName} ${updatedContact.lastName}`;
    setInteractions(
      interactions.map((interaction) =>
        interaction.personId === updatedContact.id
          ? { ...interaction, personName: contactFullName }
          : interaction
      )
    );
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    // Option: Could also delete associated interactions
  };

  const calculateInteractionDuration = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return endTotalMinutes - startTotalMinutes;
  };

  const addInteraction = (interactionData: Omit<Interaction, 'id'>) => {
    const newInteraction = {
      ...interactionData,
      id: generateId(),
      duration: calculateInteractionDuration(interactionData.startTime, interactionData.endTime),
    };

    const updatedInteractions = [newInteraction, ...interactions];
    setInteractions(updatedInteractions);
    updateStatsFromInteractions(updatedInteractions);
  };

  const updateInteraction = (updatedInteraction: Interaction) => {
    // Ensure duration is correct based on times
    const duration = calculateInteractionDuration(
      updatedInteraction.startTime,
      updatedInteraction.endTime
    );

    const interactionWithDuration = {
      ...updatedInteraction,
      duration,
    };

    const updatedInteractions = interactions.map((interaction) =>
      interaction.id === updatedInteraction.id ? interactionWithDuration : interaction
    );

    setInteractions(updatedInteractions);
    updateStatsFromInteractions(updatedInteractions);
  };

  const deleteInteraction = (id: string) => {
    const updatedInteractions = interactions.filter((interaction) => interaction.id !== id);
    setInteractions(updatedInteractions);
    updateStatsFromInteractions(updatedInteractions);
  };

  const addReason = (reasonData: Omit<InteractionReason, 'id'>) => {
    const newReason = { ...reasonData, id: generateId() };
    setInteractionReasons([...interactionReasons, newReason]);
  };

  const updateReason = (updatedReason: InteractionReason) => {
    setInteractionReasons(
      interactionReasons.map((reason) => (reason.id === updatedReason.id ? updatedReason : reason))
    );
  };

  const deleteReason = (id: string) => {
    setInteractionReasons(interactionReasons.filter((reason) => reason.id !== id));
  };

  const getReasonById = (id: string) => {
    return interactionReasons.find((reason) => reason.id === id);
  };

  const updateStatsFromInteractions = (currentInteractions: Interaction[]) => {
    const totalInteractions = currentInteractions.length;
    const totalTimeSpent = currentInteractions.reduce(
      (total, interaction) => total + interaction.duration,
      0
    );
    const studentInteractions = currentInteractions.filter(
      (interaction) => interaction.type === 'Student'
    ).length;
    const contactInteractions = currentInteractions.filter(
      (interaction) => interaction.type === 'Contact'
    ).length;
    const followUpsNeeded = currentInteractions.filter(
      (interaction) => interaction.followUpNeeded
    ).length;

    setStats({
      totalInteractions,
      totalTimeSpent,
      studentInteractions,
      contactInteractions,
      followUpsNeeded,
    });
  };

  const updateStats = () => {
    updateStatsFromInteractions(interactions);
  };

  const value = {
    profiles, // Placeholder for profiles, can be replaced with actual data
    students,
    contacts,
    interactions,
    interactionReasons,
    stats,
    addProfile,
    updateProfile,
    deleteProfile,
    getProfileById,
    addStudent,
    updateStudent,
    deleteStudent,
    addContact,
    updateContact,
    deleteContact,
    addInteraction,
    updateInteraction,
    deleteInteraction,
    addReason,
    updateReason,
    deleteReason,
    calculateInteractionDuration,
    getReasonById,
    updateStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
