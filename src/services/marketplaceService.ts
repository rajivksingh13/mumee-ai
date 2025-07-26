// Service for AI Agents Marketplace
// All database logic for agents goes here
// Swap out db import to change backend

// import db from '../config/database';
// All db usage is disabled for titliAI

// Example structure for an agent
// { id: string, name: string, category: string, description: string }

export const getAgents = async (data: any) => {
  return Object.entries(data).map(([id, value]) =>
    typeof value === 'object' && value !== null ? { id, ...value } : { id, value }
  );
};

export const addAgent = async (agent: any) => {
  // const newRef = db.ref('agents').push();
  // await newRef.set(agent);
  return { id: 'placeholder_id', ...agent };
};

export const getAgentById = async (): Promise<any> => {
  return null;
}; 