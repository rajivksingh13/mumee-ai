import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL
};

const verifyWorkshopMigration = async () => {
  try {
    console.log('🔍 Verifying Workshop Data Migration...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    console.log('✅ Firebase initialized');
    
    // Get all workshops
    const workshopsSnapshot = await getDocs(collection(firestore, 'workshops'));
    const workshops = workshopsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`📚 Found ${workshops.length} workshops in Firestore:`);
    
    for (const workshop of workshops) {
      console.log(`\n🎯 Workshop: ${workshop.title}`);
      console.log(`   Level: ${workshop.level}`);
      console.log(`   Price: ₹${workshop.price}`);
      console.log(`   Duration: ${workshop.duration} hours`);
      console.log(`   Status: ${workshop.status}`);
      console.log(`   Slug: ${workshop.slug}`);
      
      // Get modules for this workshop
      const modulesSnapshot = await getDocs(collection(firestore, 'modules'));
      const allModules = modulesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const modules = allModules.filter(module => module.workshopId === workshop.id);
      
      console.log(`   📖 Modules: ${modules.length}`);
      
      modules.forEach((module, index) => {
        console.log(`     ${index + 1}. ${module.title} (${module.duration} min)`);
      });
      
      // Display curriculum
      if (workshop.curriculum) {
        console.log(`   📋 Curriculum:`);
        workshop.curriculum.forEach((topic, index) => {
          console.log(`     ${index + 1}. ${topic.topic} (${topic.hours} hours)`);
          if (topic.subTopics) {
            topic.subTopics.forEach(subTopic => {
              console.log(`        - ${subTopic}`);
            });
          }
        });
      }
    }
    
    // Check for specific workshops by slug
    const beginnerWorkshop = workshops.find(w => w.slug === 'beginner');
    const foundationWorkshop = workshops.find(w => w.slug === 'foundation');
    const advancedWorkshop = workshops.find(w => w.slug === 'advanced');
    
    console.log('\n✅ Verification Results:');
    console.log(`   Beginner Workshop: ${beginnerWorkshop ? '✅ Found' : '❌ Missing'}`);
    console.log(`   Foundation Workshop: ${foundationWorkshop ? '✅ Found' : '❌ Missing'}`);
    console.log(`   Advanced Workshop: ${advancedWorkshop ? '✅ Found' : '❌ Missing'}`);
    
    if (beginnerWorkshop && foundationWorkshop && advancedWorkshop) {
      console.log('\n🎉 All workshops successfully migrated!');
      console.log('💡 You can now test the workshop enrollment flow.');
    } else {
      console.log('\n⚠️ Some workshops are missing. Please run the migration script again.');
    }
    
    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`   - Total workshops: ${workshops.length}`);
    console.log(`   - Total modules: ${allModules.length}`);
    console.log(`   - Beginner workshop: ${beginnerWorkshop ? '✅' : '❌'}`);
    console.log(`   - Foundation workshop: ${foundationWorkshop ? '✅' : '❌'}`);
    console.log(`   - Advanced workshop: ${advancedWorkshop ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
    throw error;
  }
};

// Run verification if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyWorkshopMigration()
    .then(() => {
      console.log('✅ Verification completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

export { verifyWorkshopMigration }; 