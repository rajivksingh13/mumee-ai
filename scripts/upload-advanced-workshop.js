const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Advanced workshop data structure
const advancedWorkshopData = {
  certificate: true,
  createdAt: admin.firestore.Timestamp.now(),
  currency: "INR",
  curriculum: {
    modules: [
      {
        description: "Review of core GenAI concepts",
        duration: 0.5,
        id: "module-1",
        lessons: [
          {
            content: "Review core AI concepts and their relationships",
            description: "Comprehensive AI technology review",
            duration: 20,
            id: "lesson-1-1",
            resources: ["AI_Recap.pdf", "Technology_Review.pdf"],
            title: "AI, ML, Deep Learning, GenAI Recap",
            videoUrl: "https://example.com/video-1-1"
          },
          {
            content: "Master advanced prompt engineering strategies",
            description: "Advanced prompt engineering techniques",
            duration: 15,
            id: "lesson-1-2",
            resources: ["Advanced_PE.pdf", "PE_Advanced.pdf"],
            title: "Prompt Engineering (Advanced)",
            videoUrl: "https://example.com/video-1-2"
          },
          {
            content: "Deep dive into AI ethics and responsible practices",
            description: "Advanced AI ethics and responsibility",
            duration: 15,
            id: "lesson-1-3",
            resources: ["Advanced_Ethics.pdf", "AI_Responsibility.pdf"],
            title: "Responsible AI & Ethics",
            videoUrl: "https://example.com/video-1-3"
          }
        ],
        title: "GenAI Fundamentals Refresher"
      },
      {
        description: "Understanding and implementing RAG systems",
        duration: 1,
        id: "module-2",
        lessons: [
          {
            content: "Learn the fundamentals of Retrieval Augmented Generation",
            description: "Introduction to RAG concepts",
            duration: 15,
            id: "lesson-2-1",
            resources: ["RAG_Basics.pdf", "RAG_Introduction.pdf"],
            title: "What is RAG?",
            videoUrl: "https://example.com/video-2-1"
          },
          {
            content: "Understand RAG architecture and data flow",
            description: "RAG system architecture",
            duration: 20,
            id: "lesson-2-2",
            resources: ["RAG_Architecture.pdf", "RAG_Flow.pdf"],
            title: "RAG Architecture & Flow",
            videoUrl: "https://example.com/video-2-2"
          },
          {
            content: "Explore practical applications of RAG systems",
            description: "Real-world RAG applications",
            duration: 15,
            id: "lesson-2-3",
            resources: ["RAG_Applications.pdf", "RAG_Use_Cases.pdf"],
            title: "Applications of RAG",
            videoUrl: "https://example.com/video-2-3"
          },
          {
            content: "Learn to build and implement RAG pipelines",
            description: "Implementing RAG systems",
            duration: 10,
            id: "lesson-2-4",
            resources: ["RAG_Pipelines.pdf", "RAG_Implementation.pdf"],
            title: "Building RAG Pipelines",
            videoUrl: "https://example.com/video-2-4"
          }
        ],
        title: "Retrieval Augmented Generation (RAG)"
      },
      {
        description: "Working with vector databases and embeddings",
        duration: 1,
        id: "module-3",
        lessons: [
          {
            content: "Learn about embeddings and their importance in AI",
            description: "Understanding embeddings",
            duration: 15,
            id: "lesson-3-1",
            resources: ["Embeddings_Guide.pdf", "Embeddings_Basics.pdf"],
            title: "What are Embeddings?",
            videoUrl: "https://example.com/video-3-1"
          },
          {
            content: "Compare and understand popular vector databases",
            description: "Vector database comparison",
            duration: 20,
            id: "lesson-3-2",
            resources: ["Vector_DBs.pdf", "DB_Comparison.pdf"],
            title: "Popular Vector DBs (Pinecone, Weaviate, FAISS, Chroma)",
            videoUrl: "https://example.com/video-3-2"
          },
          {
            content: "Learn to store and query vectors effectively",
            description: "Vector database operations",
            duration: 15,
            id: "lesson-3-3",
            resources: ["Vector_Operations.pdf", "Vector_Querying.pdf"],
            title: "Storing & Querying Vectors",
            videoUrl: "https://example.com/video-3-3"
          },
          {
            content: "Build semantic search capabilities with vectors",
            description: "Implementing semantic search",
            duration: 10,
            id: "lesson-3-4",
            resources: ["Semantic_Search.pdf", "Search_Implementation.pdf"],
            title: "Semantic Search",
            videoUrl: "https://example.com/video-3-4"
          }
        ],
        title: "Vector Databases & Embeddings"
      },
      {
        description: "Customizing and fine-tuning AI models",
        duration: 1,
        id: "module-4",
        lessons: [
          {
            content: "Understand when to use fine-tuning vs prompt engineering",
            description: "Comparing fine-tuning approaches",
            duration: 15,
            id: "lesson-4-1",
            resources: ["Fine_Tuning_vs_PE.pdf", "Approach_Comparison.pdf"],
            title: "Fine-Tuning vs Prompt Engineering",
            videoUrl: "https://example.com/video-4-1"
          },
          {
            content: "Learn to fine-tune LLMs from different providers",
            description: "Fine-tuning large language models",
            duration: 20,
            id: "lesson-4-2",
            resources: ["LLM_Fine_Tuning.pdf", "Provider_Guide.pdf"],
            title: "Fine-Tuning LLMs (OpenAI, HuggingFace, Google, etc.)",
            videoUrl: "https://example.com/video-4-2"
          },
          {
            content: "Master parameter-efficient fine-tuning techniques",
            description: "Parameter-efficient fine-tuning",
            duration: 15,
            id: "lesson-4-3",
            resources: ["LoRA_QLoRA_PEFT.pdf", "PEFT_Guide.pdf"],
            title: "LoRA, QLoRA, PEFT",
            videoUrl: "https://example.com/video-4-3"
          },
          {
            content: "Learn to prepare data for fine-tuning models",
            description: "Preparing data for model training",
            duration: 10,
            id: "lesson-4-4",
            resources: ["Data_Preparation.pdf", "Training_Data.pdf"],
            title: "Data Preparation for Fine-Tuning",
            videoUrl: "https://example.com/video-4-4"
          }
        ],
        title: "Model Customization & Fine-Tuning"
      },
      {
        description: "Training and evaluating AI models",
        duration: 1,
        id: "module-5",
        lessons: [
          {
            content: "Learn to train custom AI models from scratch",
            description: "Building custom AI models",
            duration: 20,
            id: "lesson-5-1",
            resources: ["Custom_Models.pdf", "Model_Training.pdf"],
            title: "Training Custom Models",
            videoUrl: "https://example.com/video-5-1"
          },
          {
            content: "Master transfer learning techniques",
            description: "Leveraging pre-trained models",
            duration: 15,
            id: "lesson-5-2",
            resources: ["Transfer_Learning.pdf", "Pre_trained_Models.pdf"],
            title: "Transfer Learning",
            videoUrl: "https://example.com/video-5-2"
          },
          {
            content: "Learn to evaluate model performance effectively",
            description: "Measuring model performance",
            duration: 15,
            id: "lesson-5-3",
            resources: ["Evaluation_Metrics.pdf", "Model_Evaluation.pdf"],
            title: "Evaluation Metrics",
            videoUrl: "https://example.com/video-5-3"
          },
          {
            content: "Implement experiment tracking for model development",
            description: "Tracking model experiments",
            duration: 10,
            id: "lesson-5-4",
            resources: ["Experiment_Tracking.pdf", "Tracking_Tools.pdf"],
            title: "Experiment Tracking",
            videoUrl: "https://example.com/video-5-4"
          }
        ],
        title: "Model Training & Evaluation"
      },
      {
        description: "Advanced AI applications and techniques",
        duration: 1,
        id: "module-6",
        lessons: [
          {
            content: "Build agent-to-agent workflows and systems",
            description: "Multi-agent AI systems",
            duration: 20,
            id: "lesson-6-1",
            resources: ["A2A_Workflows.pdf", "Multi_Agent_Systems.pdf"],
            title: "A2A (Agent-to-Agent) Workflows",
            videoUrl: "https://example.com/video-6-1"
          },
          {
            content: "Implement OCR using AI techniques",
            description: "AI-powered text recognition",
            duration: 15,
            id: "lesson-6-2",
            resources: ["OCR_AI.pdf", "Text_Recognition.pdf"],
            title: "OCR (Optical Character Recognition) with AI",
            videoUrl: "https://example.com/video-6-2"
          },
          {
            content: "Learn about foundation models and their applications",
            description: "Working with foundation models",
            duration: 15,
            id: "lesson-6-3",
            resources: ["Foundation_Models.pdf", "FM_Guide.pdf"],
            title: "Foundation Models (FM)",
            videoUrl: "https://example.com/video-6-3"
          },
          {
            content: "Deploy custom AI models in production",
            description: "Deploying custom AI models",
            duration: 10,
            id: "lesson-6-4",
            resources: ["Model_Deployment.pdf", "Deployment_Guide.pdf"],
            title: "Custom Model Deployment",
            videoUrl: "https://example.com/video-6-4"
          }
        ],
        title: "Advanced GenAI Applications"
      },
      {
        description: "End-to-end AI project development",
        duration: 1,
        id: "module-7",
        lessons: [
          {
            content: "Build a complete end-to-end GenAI solution",
            description: "Complete AI project development",
            duration: 30,
            id: "lesson-7-1",
            resources: ["Capstone_Project.pdf", "E2E_Solution.pdf"],
            title: "Capstone Project: End-to-End GenAI Solution",
            videoUrl: "https://example.com/video-7-1"
          },
          {
            content: "Explore AI use cases across different departments",
            description: "Industry-specific AI applications",
            duration: 15,
            id: "lesson-7-2",
            resources: ["Department_Use_Cases.pdf", "Industry_Applications.pdf"],
            title: "Department-wise Use Cases (HR, Finance, Marketing, etc.)",
            videoUrl: "https://example.com/video-7-2"
          },
          {
            content: "Learn best practices for production AI systems",
            description: "Production-ready AI systems",
            duration: 10,
            id: "lesson-7-3",
            resources: ["Production_Best_Practices.pdf", "Production_Guide.pdf"],
            title: "Best Practices for Production",
            videoUrl: "https://example.com/video-7-3"
          },
          {
            content: "Scale and monitor AI systems effectively",
            description: "Scaling and monitoring AI systems",
            duration: 5,
            id: "lesson-7-4",
            resources: ["Scaling_Monitoring.pdf", "Scale_Guide.pdf"],
            title: "Scaling & Monitoring",
            videoUrl: "https://example.com/video-7-4"
          }
        ],
        title: "Capstone Project & Real-World Use Cases"
      }
    ]
  },
  overview: "Advanced AI techniques including RAG, vector databases, model customization, and production deployment.",
  description: "Master advanced AI concepts with our expert-level workshop.",
  duration: 16,
  featured: true,
  format: "Online Interactive",
  id: "advanced-workshop",
  isLiveSession: false,
  level: "advanced",
  maxParticipants: 20,
  meetingId: "555666777",
  meetingLink: "https://zoom.us/j/555666777",
  meetingPassword: "titliAI2024",
  price: 5999,
  scheduledDate: "2024-01-30",
  scheduledTime: "16:00",
  sessionDuration: 240,
  slug: "advanced",
  status: "active",
  timezone: "Asia/Kolkata",
  title: "Advanced AI Workshop",
  updatedAt: admin.firestore.Timestamp.now()
};

// Function to upload workshop data
async function uploadWorkshopData() {
  try {
    console.log('🚀 Uploading Advanced Workshop Data...');
    console.log('📝 Workshop Title:', advancedWorkshopData.title);
    console.log('📊 Modules:', advancedWorkshopData.curriculum.modules.length);
    console.log('📚 Total Lessons:', advancedWorkshopData.curriculum.modules.reduce((total, module) => total + module.lessons.length, 0));
    
    // Upload to Firestore
    const workshopRef = db.collection('workshops').doc(advancedWorkshopData.id);
    await workshopRef.set(advancedWorkshopData);
    
    console.log('✅ Successfully uploaded Advanced Workshop to Firestore!');
    console.log('📍 Document ID:', advancedWorkshopData.id);
    console.log('🔗 View in Firebase Console: https://console.firebase.google.com/project/YOUR_PROJECT/firestore/data/~2Fworkshops~2F' + advancedWorkshopData.id);
    
  } catch (error) {
    console.error('❌ Error uploading workshop data:', error.message);
  }
}

// Function to create sample JSON file
function createSampleJsonFile() {
  const samplePath = path.join(__dirname, 'advanced-workshop-sample.json');
  fs.writeFileSync(samplePath, JSON.stringify(advancedWorkshopData, null, 2));
  console.log('✅ Sample JSON file created:', samplePath);
  console.log('📝 You can edit this file and use it as a template for other workshops');
}

// Function to read and upload from JSON file
async function uploadFromJsonFile(filePath) {
  try {
    console.log('📖 Reading JSON file:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.log('❌ File not found. Please check the path.');
      return;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const workshopData = JSON.parse(fileContent);
    
    console.log('📊 Workshop Title:', workshopData.title);
    console.log('📚 Modules:', workshopData.curriculum?.modules?.length || 0);
    
    // Upload to Firestore
    const workshopRef = db.collection('workshops').doc(workshopData.id);
    await workshopRef.set({
      ...workshopData,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    });
    
    console.log('✅ Successfully uploaded workshop from JSON file!');
    console.log('📍 Document ID:', workshopData.id);
    
  } catch (error) {
    console.error('❌ Error uploading from JSON file:', error.message);
  }
}

// Main function
async function main() {
  console.log('🚀 Advanced Workshop Upload Tool');
  console.log('================================\n');
  
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Upload the predefined advanced workshop
    await uploadWorkshopData();
  } else if (args[0] === '--sample') {
    // Create sample JSON file
    createSampleJsonFile();
  } else if (args[0] === '--file' && args[1]) {
    // Upload from JSON file
    await uploadFromJsonFile(args[1]);
  } else {
    console.log('Usage:');
    console.log('  node upload-advanced-workshop.js                    # Upload predefined advanced workshop');
    console.log('  node upload-advanced-workshop.js --sample           # Create sample JSON file');
    console.log('  node upload-advanced-workshop.js --file path.json   # Upload from JSON file');
  }
  
  process.exit(0);
}

// Run the script
main().catch(console.error); 