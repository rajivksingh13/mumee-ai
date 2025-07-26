// Service for AI Training
// All database logic for trainings goes here
// Swap out db import to change backend

// import db from '../config/database';
// All db usage is disabled for titliAI

// Example structure for a training
// { id: string, title: string, description: string, date: string }

export const getTrainings = async (data: any) => {
  return Object.entries(data).map(([id, value]) =>
    typeof value === 'object' && value !== null ? { id, ...value } : { id, value }
  );
};

export const addTraining = async (training: any) => {
  // const newRef = db.ref('trainings').push();
  // await newRef.set(training);
  // return { id: newRef.key, ...training };
  return { id: 'placeholder_id', ...training };
};

export const getTrainingById = async (): Promise<any> => {
  // const snapshot = await db.ref(`trainings/${id}`).once('value');
  // return snapshot.exists() ? { id, ...snapshot.val() } : null;
  return null;
}; 