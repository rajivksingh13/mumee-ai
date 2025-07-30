// Browser console script to check Firestore data
// Copy and paste this into your browser console on your app

console.log('🔍 Checking Firestore Data...');

// Check if Firebase is available
if (typeof firebase === 'undefined') {
  console.log('❌ Firebase not available. Make sure you are on your app page.');
  return;
}

// Get Firestore instance
const firestore = firebase.firestore();

// Function to check workshops
const checkWorkshops = async () => {
  try {
    console.log('📚 Checking workshops...');
    const workshopsSnapshot = await firestore.collection('workshops').get();
    
    if (workshopsSnapshot.empty) {
      console.log('❌ No workshops found in Firestore');
      return;
    }
    
    console.log(`✅ Found ${workshopsSnapshot.size} workshops:`);
    
    workshopsSnapshot.forEach(doc => {
      const workshop = doc.data();
      console.log(`\n🎯 Workshop: ${workshop.title}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Level: ${workshop.level}`);
      console.log(`   Price: ₹${workshop.price}`);
      console.log(`   Duration: ${workshop.duration} hours`);
      console.log(`   Status: ${workshop.status}`);
      console.log(`   Slug: ${workshop.slug}`);
      
      if (workshop.curriculum) {
        console.log(`   📋 Curriculum: ${workshop.curriculum.length} topics`);
        workshop.curriculum.forEach((topic, index) => {
          console.log(`     ${index + 1}. ${topic.topic} (${topic.hours} hours)`);
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking workshops:', error);
  }
};

// Function to check modules
const checkModules = async () => {
  try {
    console.log('\n📖 Checking modules...');
    const modulesSnapshot = await firestore.collection('modules').get();
    
    if (modulesSnapshot.empty) {
      console.log('❌ No modules found in Firestore');
      return;
    }
    
    console.log(`✅ Found ${modulesSnapshot.size} modules:`);
    
    modulesSnapshot.forEach(doc => {
      const module = doc.data();
      console.log(`\n📚 Module: ${module.title}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Workshop ID: ${module.workshopId}`);
      console.log(`   Duration: ${module.duration} minutes`);
      console.log(`   Type: ${module.type}`);
      console.log(`   Status: ${module.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking modules:', error);
  }
};

// Function to check specific workshop by slug
const checkWorkshopBySlug = async (slug) => {
  try {
    console.log(`\n🔍 Checking workshop with slug: ${slug}`);
    const workshopsSnapshot = await firestore.collection('workshops')
      .where('slug', '==', slug)
      .get();
    
    if (workshopsSnapshot.empty) {
      console.log(`❌ No workshop found with slug: ${slug}`);
      return;
    }
    
    const workshop = workshopsSnapshot.docs[0].data();
    console.log(`✅ Found workshop: ${workshop.title}`);
    console.log(`   ID: ${workshopsSnapshot.docs[0].id}`);
    console.log(`   Level: ${workshop.level}`);
    console.log(`   Price: ₹${workshop.price}`);
    console.log(`   Duration: ${workshop.duration} hours`);
    
    // Get modules for this workshop
    const modulesSnapshot = await firestore.collection('modules')
      .where('workshopId', '==', workshopsSnapshot.docs[0].id)
      .get();
    
    console.log(`   📖 Modules: ${modulesSnapshot.size}`);
    modulesSnapshot.forEach(doc => {
      const module = doc.data();
      console.log(`     - ${module.title} (${module.duration} min)`);
    });
    
  } catch (error) {
    console.error(`❌ Error checking workshop ${slug}:`, error);
  }
};

// Run all checks
const runAllChecks = async () => {
  console.log('🚀 Starting Firestore Data Check...\n');
  
  await checkWorkshops();
  await checkModules();
  
  // Check specific workshops
  await checkWorkshopBySlug('beginner');
  await checkWorkshopBySlug('foundation');
  await checkWorkshopBySlug('advanced');
  
  console.log('\n✅ Firestore data check completed!');
};

// Execute the checks
runAllChecks(); 