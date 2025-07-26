// Service for Resources (Corporate, Student, Individual)
// All database logic for resources goes here
// Swap out db import to change backend

// import db from '../config/database';
// All db usage is disabled for titliAI

export interface Resource {
  id?: string;
  title: string;
  description: string;
  type: 'corporate' | 'student' | 'individual';
}

export const getAllResources = async (): Promise<Resource[]> => {
  // const snapshot = await db.ref('resources').once('value');
  // const data = snapshot.val() || {};
  return []; // Placeholder
};

export const addResource = async (resource: Omit<Resource, 'id'>): Promise<Resource> => {
  // const newRef = db.ref('resources').push();
  // await newRef.set(resource);
  return { id: 'placeholder', ...resource }; // Placeholder
};

export const getResourceById = async (): Promise<Resource | null> => {
  // const snapshot = await db.ref(`resources/${id}`).once('value');
  return null; // Placeholder
}; 