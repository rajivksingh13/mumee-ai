import { DatabaseConfig, DatabaseFactory, IDatabaseService } from '../services/database/IDatabaseService';

// Database configuration - change this to switch databases
export const DATABASE_CONFIG: DatabaseConfig = {
  // Choose your database type
  type: 'firestore', // 'firestore' | 'mongodb'

  // Firestore configuration (current)
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,

  // MongoDB configuration (for future migration)
  // connectionString: 'mongodb://localhost:27017/titliai',
  // database: 'titliai',
};

// Database service instance
let databaseService: IDatabaseService | null = null;

// Initialize database service
export async function initializeDatabase(): Promise<IDatabaseService> {
  if (!databaseService) {
    try {
      databaseService = await DatabaseFactory.createDatabase(DATABASE_CONFIG);
      await databaseService.connect();
      console.log(`✅ Database initialized: ${DATABASE_CONFIG.type}`);
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }
  return databaseService;
}

// Get database service instance
export async function getDatabaseService(): Promise<IDatabaseService> {
  if (!databaseService) {
    return await initializeDatabase();
  }
  return databaseService;
}

// Switch database type (for migration)
export async function switchDatabase(newConfig: DatabaseConfig): Promise<void> {
  // Disconnect current database
  if (databaseService) {
    await databaseService.disconnect();
  }

  // Update configuration
  Object.assign(DATABASE_CONFIG, newConfig);

  // Initialize new database
  databaseService = await DatabaseFactory.createDatabase(DATABASE_CONFIG);
  await databaseService.connect();
  
  console.log(`🔄 Switched to database: ${newConfig.type}`);
}

// Migration helpers
export const MIGRATION_CONFIGS = {
  firestore: {
    type: 'firestore' as const,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  },

  mongodb: {
    type: 'mongodb' as const,
    connectionString: import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/titliai',
    database: 'titliai',
  },
};

// Quick migration functions
export async function migrateToMongoDB(): Promise<void> {
  await switchDatabase(MIGRATION_CONFIGS.mongodb);
}

export async function migrateToFirestore(): Promise<void> {
  await switchDatabase(MIGRATION_CONFIGS.firestore);
}

// Health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const db = await getDatabaseService();
    return await db.healthCheck();
  } catch {
    return false;
  }
}

// Export current database type for components
export const getCurrentDatabaseType = () => DATABASE_CONFIG.type; 