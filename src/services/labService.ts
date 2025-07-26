// Service for AI Labs
// All database logic for labs goes here
// Swap out db import to change backend

// import db from '../config/database';
// All db usage is disabled for titliAI

// Example structure for a lab
// { id: string, name: string, description: string, tools: string[] }

export const getLabs = async (data: any) => {
  return Object.entries(data).map(([id, value]) =>
    typeof value === 'object' && value !== null ? { id, ...value } : { id, value }
  );
};

export const addLab = async (lab: any) => {
  // const newRef = db.ref('labs').push();
  // await newRef.set(lab);
  // return { id: newRef.key, ...lab };
  return { id: 'placeholder', ...lab };
};

export const getLabById = async (): Promise<any> => {
  return null;
}; 