// Service for AI Consultant
// All database logic for consultants goes here
// Swap out db import to change backend

// import db from '../config/database';
// All db usage is disabled for titliAI

// Example structure for a consultant
// { id: string, name: string, expertise: string, description: string }

export const getConsultants = async (data: any) => {
  return Object.entries(data).map(([id, value]) =>
    typeof value === 'object' && value !== null ? { id, ...value } : { id, value }
  );
};

export const addConsultant = async (consultant: any) => {
  // const newRef = db.ref('consultants').push();
  // await newRef.set(consultant);
  return { id: 'placeholder_id', ...consultant };
};

export const getConsultantById = async (): Promise<any> => {
  // const snapshot = await db.ref(`consultants/${id}`).once('value');
  return null;
}; 