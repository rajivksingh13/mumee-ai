// Service for AI Workshops
// All database logic for workshops goes here
// Swap out db import to change backend

// import db from '../config/database';
// All db usage is disabled for titliAI

// Example structure for a workshop
// { id: string, title: string, description: string, date: string }

export const getWorkshops = async (data: any) => {
  return Object.entries(data).map(([id, value]) =>
    typeof value === 'object' && value !== null ? { id, ...value } : { id, value }
  );
};

export const addWorkshop = async (workshop: any) => {
  // Firebase example: add a new workshop
  // const newRef = db.ref('workshops').push();
  // await newRef.set(workshop);
  // return { id: newRef.key, ...workshop };
  return { id: 'temp-id', ...workshop }; // Placeholder for db.ref
};

export const getWorkshopById = async (): Promise<any> => {
  return null; // Placeholder for db.ref
}; 