import { Student, Contact, InteractionReason, Interaction, CounselorStats } from '../types';

// Generate random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Mock Students
export const students: Student[] = [
  {
    id: generateId(),
    firstName: 'Emma',
    lastName: 'Johnson',
    grade: '9',
    notes: 'Interested in art programs and college counseling.'
  },
  {
    id: generateId(),
    firstName: 'Noah',
    lastName: 'Williams',
    grade: '10',
    notes: 'Struggling with math. Considering tutoring options.'
  },
  {
    id: generateId(),
    firstName: 'Olivia',
    lastName: 'Smith',
    grade: '11',
    notes: 'Excellent academic performance. Looking into scholarship opportunities.'
  },
  {
    id: generateId(),
    firstName: 'Liam',
    lastName: 'Brown',
    grade: '12',
    notes: 'College applications in progress. Needs support with essays.'
  },
  {
    id: generateId(),
    firstName: 'Sophia',
    lastName: 'Davis',
    grade: '9',
    notes: 'Recently transferred. Adjusting well to new environment.'
  }
];

// Mock Contacts
export const contacts: Contact[] = [
  {
    id: generateId(),
    type: 'Parent',
    firstName: 'Robert',
    lastName: 'Johnson',
    relation: 'Father of Emma Johnson',
    phone: '555-123-4567',
    email: 'robert.johnson@example.com',
    notes: 'Prefers to be contacted via email.'
  },
  {
    id: generateId(),
    type: 'Teacher',
    firstName: 'Patricia',
    lastName: 'Miller',
    relation: 'Math Teacher',
    phone: '555-987-6543',
    email: 'patricia.miller@example.com',
    notes: 'Available for meetings after 3 PM.'
  },
  {
    id: generateId(),
    type: 'DCFS',
    firstName: 'Michael',
    lastName: 'Clark',
    relation: 'Case Worker',
    phone: '555-789-0123',
    email: 'michael.clark@dcfs.example.com',
    notes: 'Handling case for Brown family.'
  }
];

// Mock Interaction Reasons
export const interactionReasons: InteractionReason[] = [
  { id: generateId(), category: 'Academic', subcategory: 'Course Selection' },
  { id: generateId(), category: 'Academic', subcategory: 'Grade Concerns' },
  { id: generateId(), category: 'Academic', subcategory: 'College Planning' },
  { id: generateId(), category: 'Social/Emotional', subcategory: 'Peer Relationships' },
  { id: generateId(), category: 'Social/Emotional', subcategory: 'Mental Health' },
  { id: generateId(), category: 'Social/Emotional', subcategory: 'Family Issues' },
  { id: generateId(), category: 'Behavioral', subcategory: 'Classroom Behavior' },
  { id: generateId(), category: 'Behavioral', subcategory: 'Attendance' },
  { id: generateId(), category: 'Behavioral', subcategory: 'Conflict Resolution' },
  { id: generateId(), category: 'Career', subcategory: 'Career Exploration' },
  { id: generateId(), category: 'Career', subcategory: 'Job Applications' },
  { id: generateId(), category: 'Administrative', subcategory: 'Scheduling' },
  { id: generateId(), category: 'Administrative', subcategory: 'Paperwork' },
  { id: generateId(), category: 'Crisis', subcategory: 'Emergency Response' },
  { id: generateId(), category: 'Crisis', subcategory: 'Safety Concerns' }
];

// Generate random dates within the last 30 days
const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString().split('T')[0];
};

// Generate random time
const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 8) + 8; // 8 AM to 4 PM
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45 minutes
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Calculate end time based on start time and duration
const calculateEndTime = (startTime: string, durationMinutes: number) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
};

// Mock Interactions
export const generateMockInteractions = (): Interaction[] => {
  const interactions: Interaction[] = [];
  
  // Generate student interactions
  students.forEach(student => {
    const numInteractions = Math.floor(Math.random() * 3) + 1; // 1-3 interactions per student
    
    for (let i = 0; i < numInteractions; i++) {
      const date = getRandomDate();
      const startTime = getRandomTime();
      const duration = [15, 30, 45, 60][Math.floor(Math.random() * 4)]; // Random duration
      const endTime = calculateEndTime(startTime, duration);
      
      // Random selection of 1-3 reasons
      const numReasons = Math.floor(Math.random() * 3) + 1;
      const reasonIds: string[] = [];
      for (let j = 0; j < numReasons; j++) {
        const randomIndex = Math.floor(Math.random() * interactionReasons.length);
        if (!reasonIds.includes(interactionReasons[randomIndex].id)) {
          reasonIds.push(interactionReasons[randomIndex].id);
        }
      }
      
      interactions.push({
        id: generateId(),
        date,
        startTime,
        endTime,
        duration,
        type: 'Student',
        personId: student.id,
        personName: `${student.firstName} ${student.lastName}`,
        reasonIds,
        notes: `Meeting with ${student.firstName} regarding ${
          interactionReasons.find(reason => reason.id === reasonIds[0])?.subcategory || 'various topics'
        }.`,
        followUpNeeded: Math.random() > 0.7, // 30% chance of needing follow-up
        followUpDate: Math.random() > 0.7 ? getRandomDate() : undefined
      });
    }
  });
  
  // Generate contact interactions
  contacts.forEach(contact => {
    if (Math.random() > 0.3) { // 70% chance of having an interaction
      const date = getRandomDate();
      const startTime = getRandomTime();
      const duration = [15, 30, 45][Math.floor(Math.random() * 3)]; // Random duration
      const endTime = calculateEndTime(startTime, duration);
      
      // Random selection of 1-2 reasons
      const numReasons = Math.floor(Math.random() * 2) + 1;
      const reasonIds: string[] = [];
      for (let j = 0; j < numReasons; j++) {
        const randomIndex = Math.floor(Math.random() * interactionReasons.length);
        if (!reasonIds.includes(interactionReasons[randomIndex].id)) {
          reasonIds.push(interactionReasons[randomIndex].id);
        }
      }
      
      interactions.push({
        id: generateId(),
        date,
        startTime,
        endTime,
        duration,
        type: 'Contact',
        personId: contact.id,
        personName: `${contact.firstName} ${contact.lastName}`,
        reasonIds,
        notes: `Discussion with ${contact.firstName} regarding ${
          interactionReasons.find(reason => reason.id === reasonIds[0])?.subcategory || 'various topics'
        }.`,
        followUpNeeded: Math.random() > 0.6, // 40% chance of needing follow-up
        followUpDate: Math.random() > 0.6 ? getRandomDate() : undefined
      });
    }
  });
  
  // Sort interactions by date and time (most recent first)
  return interactions.sort((a, b) => {
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    return b.startTime.localeCompare(a.startTime);
  });
};

export const interactions = generateMockInteractions();

// Calculate statistics
export const calculateStats = (): CounselorStats => {
  const totalInteractions = interactions.length;
  const totalTimeSpent = interactions.reduce((total, interaction) => total + interaction.duration, 0);
  const studentInteractions = interactions.filter(interaction => interaction.type === 'Student').length;
  const contactInteractions = interactions.filter(interaction => interaction.type === 'Contact').length;
  const followUpsNeeded = interactions.filter(interaction => interaction.followUpNeeded).length;
  
  return {
    totalInteractions,
    totalTimeSpent,
    studentInteractions,
    contactInteractions,
    followUpsNeeded
  };
};

export const counselorStats = calculateStats();