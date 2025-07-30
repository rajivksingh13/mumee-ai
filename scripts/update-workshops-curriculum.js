import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Workshop Curriculum Update...');

// Manually load .env file
const loadEnvFile = () => {
  const envPath = join(__dirname, '..', '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key] = value;
        }
      }
    });
    
    console.log('✅ .env file loaded successfully');
  } else {
    console.log('❌ .env file not found at:', envPath);
    process.exit(1);
  }
};

// Load environment variables
loadEnvFile();

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

// Curriculum data for each workshop - using actual titliAI content
const curriculumData = {
  'beginner-workshop': {
    overview: 'Start your AI journey with our comprehensive beginner workshop covering fundamental concepts, practical applications, and hands-on projects.',
    modules: [
      {
        id: 'module-1',
        title: 'Welcome to AI - Your First Steps',
        description: 'Introduction to AI and your learning journey',
        duration: 0.5,
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'What is Artificial Intelligence?',
            description: 'Understanding AI basics and concepts',
            duration: 15,
            content: 'Learn about the fundamentals of artificial intelligence and its applications',
            videoUrl: 'https://example.com/video-1-1',
            resources: ['AI_Introduction.pdf', 'AI_Glossary.pdf']
          },
          {
            id: 'lesson-1-2',
            title: 'Why AI Matters in Today\'s World',
            description: 'The importance of AI in modern society',
            duration: 10,
            content: 'Explore why AI is crucial in today\'s technological landscape',
            videoUrl: 'https://example.com/video-1-2',
            resources: ['AI_Impact.pdf', 'Case_Studies.pdf']
          },
          {
            id: 'lesson-1-3',
            title: 'Your AI Learning Journey',
            description: 'Mapping your path to AI mastery',
            duration: 10,
            content: 'Plan your personalized AI learning journey',
            videoUrl: 'https://example.com/video-1-3',
            resources: ['Learning_Path.pdf', 'Study_Plan.pdf']
          },
          {
            id: 'lesson-1-4',
            title: 'What You\'ll Learn in This Workshop',
            description: 'Workshop overview and objectives',
            duration: 15,
            content: 'Get an overview of what you\'ll learn in this comprehensive workshop',
            videoUrl: 'https://example.com/video-1-4',
            resources: ['Workshop_Overview.pdf', 'Learning_Objectives.pdf']
          }
        ]
      },
      {
        id: 'module-2',
        title: 'Understanding AI Basics',
        description: 'Core AI concepts and machine learning fundamentals',
        duration: 1.0,
        lessons: [
          {
            id: 'lesson-2-1',
            title: 'What is Machine Learning?',
            description: 'Understanding ML fundamentals',
            duration: 15,
            content: 'Learn the basics of machine learning and how it differs from traditional programming',
            videoUrl: 'https://example.com/video-2-1',
            resources: ['ML_Basics.pdf', 'ML_Examples.pdf']
          },
          {
            id: 'lesson-2-2',
            title: 'What is Deep Learning?',
            description: 'Introduction to neural networks',
            duration: 15,
            content: 'Explore deep learning and neural network concepts',
            videoUrl: 'https://example.com/video-2-2',
            resources: ['Deep_Learning.pdf', 'Neural_Networks.pdf']
          },
          {
            id: 'lesson-2-3',
            title: 'What is Generative AI?',
            description: 'Understanding generative AI models',
            duration: 15,
            content: 'Learn about generative AI and its applications',
            videoUrl: 'https://example.com/video-2-3',
            resources: ['Generative_AI.pdf', 'GenAI_Examples.pdf']
          },
          {
            id: 'lesson-2-4',
            title: 'How AI Learns from Data',
            description: 'The learning process in AI systems',
            duration: 10,
            content: 'Understand how AI systems learn and improve from data',
            videoUrl: 'https://example.com/video-2-4',
            resources: ['AI_Learning.pdf', 'Data_Process.pdf']
          },
          {
            id: 'lesson-2-5',
            title: 'Real-World AI Examples',
            description: 'AI applications in everyday life',
            duration: 5,
            content: 'Explore real-world examples of AI in action',
            videoUrl: 'https://example.com/video-2-5',
            resources: ['Real_World_AI.pdf', 'AI_Applications.pdf']
          }
        ]
      },
      {
        id: 'module-3',
        title: 'Your First AI Tools',
        description: 'Hands-on experience with AI tools and platforms',
        duration: 1.0,
        lessons: [
          {
            id: 'lesson-3-1',
            title: 'Introduction to ChatGPT',
            description: 'Getting started with ChatGPT',
            duration: 15,
            content: 'Learn how to use ChatGPT effectively for various tasks',
            videoUrl: 'https://example.com/video-3-1',
            resources: ['ChatGPT_Guide.pdf', 'ChatGPT_Tips.pdf']
          },
          {
            id: 'lesson-3-2',
            title: 'How to Use AI Chatbots',
            description: 'Working with different AI chatbots',
            duration: 15,
            content: 'Explore various AI chatbots and their capabilities',
            videoUrl: 'https://example.com/video-3-2',
            resources: ['AI_Chatbots.pdf', 'Chatbot_Comparison.pdf']
          },
          {
            id: 'lesson-3-3',
            title: 'Writing Better Prompts',
            description: 'Prompt engineering basics',
            duration: 15,
            content: 'Master the art of writing effective prompts for AI tools',
            videoUrl: 'https://example.com/video-3-3',
            resources: ['Prompt_Engineering.pdf', 'Prompt_Examples.pdf']
          },
          {
            id: 'lesson-3-4',
            title: 'AI for Everyday Tasks',
            description: 'Practical AI applications',
            duration: 10,
            content: 'Learn how to use AI for daily tasks and productivity',
            videoUrl: 'https://example.com/video-3-4',
            resources: ['AI_Productivity.pdf', 'Daily_Tasks.pdf']
          },
          {
            id: 'lesson-3-5',
            title: 'Safety and Best Practices',
            description: 'AI safety and ethical considerations',
            duration: 5,
            content: 'Understand AI safety and best practices for responsible use',
            videoUrl: 'https://example.com/video-3-5',
            resources: ['AI_Safety.pdf', 'Best_Practices.pdf']
          }
        ]
      },
      {
        id: 'module-4',
        title: 'AI in Your Daily Life',
        description: 'Exploring AI applications in everyday life',
        duration: 0.75,
        lessons: [
          {
            id: 'lesson-4-1',
            title: 'AI in Your Phone',
            description: 'AI features in smartphones',
            duration: 10,
            content: 'Discover AI features in your smartphone and mobile apps',
            videoUrl: 'https://example.com/video-4-1',
            resources: ['Mobile_AI.pdf', 'Phone_Features.pdf']
          },
          {
            id: 'lesson-4-2',
            title: 'AI in Social Media',
            description: 'AI algorithms in social platforms',
            duration: 10,
            content: 'Understand how AI powers social media platforms',
            videoUrl: 'https://example.com/video-4-2',
            resources: ['Social_Media_AI.pdf', 'AI_Algorithms.pdf']
          },
          {
            id: 'lesson-4-3',
            title: 'AI in Shopping',
            description: 'AI in e-commerce and retail',
            duration: 10,
            content: 'Explore AI applications in shopping and retail',
            videoUrl: 'https://example.com/video-4-3',
            resources: ['Ecommerce_AI.pdf', 'Retail_AI.pdf']
          },
          {
            id: 'lesson-4-4',
            title: 'AI in Entertainment',
            description: 'AI in gaming and entertainment',
            duration: 10,
            content: 'Learn about AI in gaming, movies, and entertainment',
            videoUrl: 'https://example.com/video-4-4',
            resources: ['Entertainment_AI.pdf', 'Gaming_AI.pdf']
          },
          {
            id: 'lesson-4-5',
            title: 'Future of AI in Daily Life',
            description: 'Predicting AI\'s future impact',
            duration: 5,
            content: 'Explore the future of AI in everyday life',
            videoUrl: 'https://example.com/video-4-5',
            resources: ['AI_Future.pdf', 'Future_Predictions.pdf']
          }
        ]
      },
      {
        id: 'module-5',
        title: 'Getting Started with AI Projects',
        description: 'Practical AI projects and next steps',
        duration: 0.75,
        lessons: [
          {
            id: 'lesson-5-1',
            title: 'Simple AI Projects You Can Try',
            description: 'Hands-on AI projects for beginners',
            duration: 20,
            content: 'Start with simple AI projects to build your skills',
            videoUrl: 'https://example.com/video-5-1',
            resources: ['Simple_Projects.pdf', 'Project_Guides.pdf']
          },
          {
            id: 'lesson-5-2',
            title: 'Free AI Tools and Resources',
            description: 'Accessible AI tools and learning resources',
            duration: 15,
            content: 'Discover free AI tools and learning resources',
            videoUrl: 'https://example.com/video-5-2',
            resources: ['Free_Tools.pdf', 'Learning_Resources.pdf']
          },
          {
            id: 'lesson-5-3',
            title: 'Building Your AI Portfolio',
            description: 'Creating a portfolio of AI projects',
            duration: 15,
            content: 'Learn how to build an impressive AI portfolio',
            videoUrl: 'https://example.com/video-5-3',
            resources: ['Portfolio_Guide.pdf', 'Portfolio_Examples.pdf']
          },
          {
            id: 'lesson-5-4',
            title: 'Next Steps After This Workshop',
            description: 'Continuing your AI learning journey',
            duration: 5,
            content: 'Plan your next steps in AI learning and development',
            videoUrl: 'https://example.com/video-5-4',
            resources: ['Next_Steps.pdf', 'Learning_Path.pdf']
          }
        ]
      }
    ]
  },
  'foundation-workshop': {
    overview: 'Deep dive into generative AI, prompt engineering, and practical AI applications for intermediate learners.',
    modules: [
      {
        id: 'module-1',
        title: 'Workshop - Welcome & Intro',
        description: 'Workshop introduction and setup',
        duration: 0.5,
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'Why this Workshop?',
            description: 'Understanding the workshop objectives',
            duration: 10,
            content: 'Learn about the goals and benefits of this foundation workshop',
            videoUrl: 'https://example.com/video-1-1',
            resources: ['Workshop_Objectives.pdf', 'Benefits_Guide.pdf']
          },
          {
            id: 'lesson-1-2',
            title: 'Prerequisites',
            description: 'What you need to know before starting',
            duration: 10,
            content: 'Understand the prerequisites and required knowledge',
            videoUrl: 'https://example.com/video-1-2',
            resources: ['Prerequisites.pdf', 'Required_Knowledge.pdf']
          },
          {
            id: 'lesson-1-3',
            title: 'Workshop Format & Timelines',
            description: 'Workshop structure and schedule',
            duration: 15,
            content: 'Learn about the workshop format and timeline',
            videoUrl: 'https://example.com/video-1-3',
            resources: ['Workshop_Format.pdf', 'Timeline.pdf']
          },
          {
            id: 'lesson-1-4',
            title: 'Resource Downloads',
            description: 'Accessing workshop materials',
            duration: 15,
            content: 'Download and access all workshop resources and materials',
            videoUrl: 'https://example.com/video-1-4',
            resources: ['Resource_List.pdf', 'Download_Guide.pdf']
          }
        ]
      },
      {
        id: 'module-2',
        title: 'Your Journey into the World of GenAI',
        description: 'Comprehensive introduction to generative AI',
        duration: 1.0,
        lessons: [
          {
            id: 'lesson-2-1',
            title: 'The Spark for GenAI',
            description: 'What makes GenAI special',
            duration: 10,
            content: 'Understand what makes generative AI unique and powerful',
            videoUrl: 'https://example.com/video-2-1',
            resources: ['GenAI_Spark.pdf', 'GenAI_Uniqueness.pdf']
          },
          {
            id: 'lesson-2-2',
            title: 'Why is GenAI Capturing so much Attention Right Now?',
            description: 'Current GenAI landscape',
            duration: 15,
            content: 'Explore why GenAI is gaining so much attention currently',
            videoUrl: 'https://example.com/video-2-2',
            resources: ['GenAI_Attention.pdf', 'Current_Landscape.pdf']
          },
          {
            id: 'lesson-2-3',
            title: 'What is the Relationship Between AI, ML, Deep Learning & GenAI?',
            description: 'Understanding AI relationships',
            duration: 15,
            content: 'Learn the relationships between different AI technologies',
            videoUrl: 'https://example.com/video-2-3',
            resources: ['AI_Relationships.pdf', 'Technology_Map.pdf']
          },
          {
            id: 'lesson-2-4',
            title: 'Inside the AI\'s Mind: How GenAI Works',
            description: 'Understanding GenAI mechanics',
            duration: 15,
            content: 'Dive deep into how generative AI works internally',
            videoUrl: 'https://example.com/video-2-4',
            resources: ['GenAI_Mechanics.pdf', 'AI_Mind.pdf']
          },
          {
            id: 'lesson-2-5',
            title: 'Advancements in AI: Key Milestones',
            description: 'Important AI breakthroughs',
            duration: 10,
            content: 'Review key milestones in AI development',
            videoUrl: 'https://example.com/video-2-5',
            resources: ['AI_Milestones.pdf', 'Breakthroughs.pdf']
          },
          {
            id: 'lesson-2-6',
            title: 'Understanding "Modality"',
            description: 'Different types of AI modalities',
            duration: 10,
            content: 'Learn about different AI modalities and their applications',
            videoUrl: 'https://example.com/video-2-6',
            resources: ['Modality_Guide.pdf', 'AI_Modalities.pdf']
          },
          {
            id: 'lesson-2-7',
            title: 'Jargon Buster',
            description: 'Common AI terminology explained',
            duration: 5,
            content: 'Understand common AI jargon and terminology',
            videoUrl: 'https://example.com/video-2-7',
            resources: ['Jargon_Buster.pdf', 'AI_Terms.pdf']
          }
        ]
      },
      {
        id: 'module-3',
        title: 'Prompt Engineering - The Art of Talking to AI',
        description: 'Mastering prompt engineering techniques',
        duration: 1.0,
        lessons: [
          {
            id: 'lesson-3-1',
            title: 'What is Prompt Engineering?',
            description: 'Introduction to prompt engineering',
            duration: 15,
            content: 'Learn the fundamentals of prompt engineering',
            videoUrl: 'https://example.com/video-3-1',
            resources: ['Prompt_Engineering_Basics.pdf', 'PE_Introduction.pdf']
          },
          {
            id: 'lesson-3-2',
            title: 'Why Prompt Engineering Matters?',
            description: 'Importance of effective prompting',
            duration: 10,
            content: 'Understand why prompt engineering is crucial for AI success',
            videoUrl: 'https://example.com/video-3-2',
            resources: ['PE_Importance.pdf', 'Effective_Prompting.pdf']
          },
          {
            id: 'lesson-3-3',
            title: 'Elements of a Well Crafted Prompt',
            description: 'Building effective prompts',
            duration: 15,
            content: 'Learn the key elements that make prompts effective',
            videoUrl: 'https://example.com/video-3-3',
            resources: ['Prompt_Elements.pdf', 'Well_Crafted_Prompts.pdf']
          },
          {
            id: 'lesson-3-4',
            title: 'Type of Prompts',
            description: 'Different prompt categories',
            duration: 15,
            content: 'Explore different types of prompts and their use cases',
            videoUrl: 'https://example.com/video-3-4',
            resources: ['Prompt_Types.pdf', 'Prompt_Categories.pdf']
          },
          {
            id: 'lesson-3-5',
            title: 'High-Impact Prompt Engineering Tactics',
            description: 'Advanced prompt engineering strategies',
            duration: 5,
            content: 'Master high-impact prompt engineering tactics',
            videoUrl: 'https://example.com/video-3-5',
            resources: ['PE_Tactics.pdf', 'Advanced_Prompts.pdf']
          }
        ]
      },
      {
        id: 'module-4',
        title: 'Playing with Images, Videos and Music',
        description: 'Multimodal AI applications',
        duration: 1.0,
        lessons: [
          {
            id: 'lesson-4-1',
            title: 'Introduction to Multimodal AI',
            description: 'Understanding multimodal AI',
            duration: 10,
            content: 'Learn about multimodal AI and its capabilities',
            videoUrl: 'https://example.com/video-4-1',
            resources: ['Multimodal_AI.pdf', 'MM_Introduction.pdf']
          },
          {
            id: 'lesson-4-2',
            title: 'Behind the Scene - How Image Generation Works',
            description: 'Image generation mechanics',
            duration: 15,
            content: 'Understand how AI generates images',
            videoUrl: 'https://example.com/video-4-2',
            resources: ['Image_Generation.pdf', 'IG_Mechanics.pdf']
          },
          {
            id: 'lesson-4-3',
            title: 'Working with Images',
            description: 'Practical image AI applications',
            duration: 15,
            content: 'Learn to work with AI image generation and editing',
            videoUrl: 'https://example.com/video-4-3',
            resources: ['Image_AI.pdf', 'Image_Work.pdf']
          },
          {
            id: 'lesson-4-4',
            title: 'Playing with Videos',
            description: 'AI video generation and editing',
            duration: 10,
            content: 'Explore AI video generation and editing capabilities',
            videoUrl: 'https://example.com/video-4-4',
            resources: ['Video_AI.pdf', 'Video_Generation.pdf']
          },
          {
            id: 'lesson-4-5',
            title: 'What are Avatars / Digital Twins',
            description: 'Digital identity and avatars',
            duration: 10,
            content: 'Learn about digital avatars and twins',
            videoUrl: 'https://example.com/video-4-5',
            resources: ['Avatars.pdf', 'Digital_Twins.pdf']
          },
          {
            id: 'lesson-4-6',
            title: 'Exploring Music and Audio',
            description: 'AI music and audio generation',
            duration: 10,
            content: 'Explore AI music and audio generation',
            videoUrl: 'https://example.com/video-4-6',
            resources: ['Music_AI.pdf', 'Audio_Generation.pdf']
          },
          {
            id: 'lesson-4-7',
            title: 'Creative Use Cases and Tools',
            description: 'Creative AI applications',
            duration: 10,
            content: 'Discover creative AI use cases and tools',
            videoUrl: 'https://example.com/video-4-7',
            resources: ['Creative_AI.pdf', 'Creative_Tools.pdf']
          }
        ]
      },
      {
        id: 'module-5',
        title: 'Responsible AI',
        description: 'Ethical AI practices and considerations',
        duration: 0.75,
        lessons: [
          {
            id: 'lesson-5-1',
            title: 'What is Responsible AI?',
            description: 'Introduction to responsible AI',
            duration: 10,
            content: 'Learn about responsible AI principles',
            videoUrl: 'https://example.com/video-5-1',
            resources: ['Responsible_AI.pdf', 'RA_Principles.pdf']
          },
          {
            id: 'lesson-5-2',
            title: 'Understanding AI Limitations',
            description: 'AI system limitations',
            duration: 10,
            content: 'Understand the limitations of AI systems',
            videoUrl: 'https://example.com/video-5-2',
            resources: ['AI_Limitations.pdf', 'Limitations_Guide.pdf']
          },
          {
            id: 'lesson-5-3',
            title: 'Avoiding AI Hallucinations',
            description: 'Preventing AI misinformation',
            duration: 10,
            content: 'Learn how to avoid and detect AI hallucinations',
            videoUrl: 'https://example.com/video-5-3',
            resources: ['AI_Hallucinations.pdf', 'Hallucination_Prevention.pdf']
          },
          {
            id: 'lesson-5-4',
            title: 'Mitigating Bias',
            description: 'Addressing AI bias',
            duration: 10,
            content: 'Learn about AI bias and how to mitigate it',
            videoUrl: 'https://example.com/video-5-4',
            resources: ['AI_Bias.pdf', 'Bias_Mitigation.pdf']
          },
          {
            id: 'lesson-5-5',
            title: 'Protecting Privacy',
            description: 'AI privacy considerations',
            duration: 10,
            content: 'Understand privacy concerns in AI applications',
            videoUrl: 'https://example.com/video-5-5',
            resources: ['AI_Privacy.pdf', 'Privacy_Guide.pdf']
          },
          {
            id: 'lesson-5-6',
            title: 'Ensuring Transparency',
            description: 'AI transparency and explainability',
            duration: 10,
            content: 'Learn about AI transparency and explainability',
            videoUrl: 'https://example.com/video-5-6',
            resources: ['AI_Transparency.pdf', 'Explainability.pdf']
          },
          {
            id: 'lesson-5-7',
            title: 'Ethical Content Creation',
            description: 'Ethical AI content generation',
            duration: 10,
            content: 'Learn about ethical content creation with AI',
            videoUrl: 'https://example.com/video-5-7',
            resources: ['Ethical_Content.pdf', 'Content_Ethics.pdf']
          },
          {
            id: 'lesson-5-8',
            title: 'Environmental Impact',
            description: 'AI environmental considerations',
            duration: 5,
            content: 'Understand the environmental impact of AI systems',
            videoUrl: 'https://example.com/video-5-8',
            resources: ['AI_Environment.pdf', 'Environmental_Impact.pdf']
          }
        ]
      },
      {
        id: 'module-6',
        title: 'AI Tools - Make Yourself 10X Productive',
        description: 'Productivity tools and AI applications',
        duration: 0.75,
        lessons: [
          {
            id: 'lesson-6-1',
            title: 'NotebookLM',
            description: 'Google\'s AI notebook tool',
            duration: 15,
            content: 'Learn to use NotebookLM for enhanced productivity',
            videoUrl: 'https://example.com/video-6-1',
            resources: ['NotebookLM_Guide.pdf', 'NotebookLM_Tutorial.pdf']
          },
          {
            id: 'lesson-6-2',
            title: 'ChatGPT / Gemini / Grok / Anthropic Claude',
            description: 'Major AI chatbot platforms',
            duration: 20,
            content: 'Compare and use major AI chatbot platforms',
            videoUrl: 'https://example.com/video-6-2',
            resources: ['ChatGPT_Guide.pdf', 'Gemini_Guide.pdf', 'Grok_Guide.pdf', 'Claude_Guide.pdf']
          },
          {
            id: 'lesson-6-3',
            title: 'Google AI Studio Walkthrough',
            description: 'Google AI Studio tutorial',
            duration: 15,
            content: 'Walkthrough of Google AI Studio features',
            videoUrl: 'https://example.com/video-6-3',
            resources: ['Google_AI_Studio.pdf', 'GAIS_Tutorial.pdf']
          },
          {
            id: 'lesson-6-4',
            title: 'Perplexity Labs',
            description: 'Perplexity AI platform',
            duration: 10,
            content: 'Learn to use Perplexity Labs for research and analysis',
            videoUrl: 'https://example.com/video-6-4',
            resources: ['Perplexity_Guide.pdf', 'Perplexity_Tutorial.pdf']
          },
          {
            id: 'lesson-6-5',
            title: 'Popular AI Tools (No code, Vibe Coding, Deptt. wise)',
            description: 'Department-specific AI tools',
            duration: 15,
            content: 'Explore popular AI tools for different departments and use cases',
            videoUrl: 'https://example.com/video-6-5',
            resources: ['Popular_Tools.pdf', 'Department_Tools.pdf']
          }
        ]
      },
      {
        id: 'module-7',
        title: 'Making Money with AI: A Few Pointers',
        description: 'AI monetization strategies',
        duration: 0.25,
        lessons: [
          {
            id: 'lesson-7-1',
            title: 'Optional',
            description: 'AI monetization opportunities',
            duration: 15,
            content: 'Explore ways to monetize AI skills and knowledge',
            videoUrl: 'https://example.com/video-7-1',
            resources: ['AI_Monetization.pdf', 'Money_AI.pdf']
          }
        ]
      }
    ]
  },
  'advanced-workshop': {
    overview: 'Advanced AI techniques including RAG, vector databases, model customization, and production deployment.',
    modules: [
      {
        id: 'module-1',
        title: 'GenAI Fundamentals Refresher',
        description: 'Review of core GenAI concepts',
        duration: 0.5,
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'AI, ML, Deep Learning, GenAI Recap',
            description: 'Comprehensive AI technology review',
            duration: 20,
            content: 'Review core AI concepts and their relationships',
            videoUrl: 'https://example.com/video-1-1',
            resources: ['AI_Recap.pdf', 'Technology_Review.pdf']
          },
          {
            id: 'lesson-1-2',
            title: 'Prompt Engineering (Advanced)',
            description: 'Advanced prompt engineering techniques',
            duration: 15,
            content: 'Master advanced prompt engineering strategies',
            videoUrl: 'https://example.com/video-1-2',
            resources: ['Advanced_PE.pdf', 'PE_Advanced.pdf']
          },
          {
            id: 'lesson-1-3',
            title: 'Responsible AI & Ethics',
            description: 'Advanced AI ethics and responsibility',
            duration: 15,
            content: 'Deep dive into AI ethics and responsible practices',
            videoUrl: 'https://example.com/video-1-3',
            resources: ['Advanced_Ethics.pdf', 'AI_Responsibility.pdf']
          }
        ]
      },
      {
        id: 'module-2',
        title: 'Retrieval Augmented Generation (RAG)',
        description: 'Understanding and implementing RAG systems',
        duration: 1.0,
        lessons: [
          {
            id: 'lesson-2-1',
            title: 'What is RAG?',
            description: 'Introduction to RAG concepts',
            duration: 15,
            content: 'Learn the fundamentals of Retrieval Augmented Generation',
            videoUrl: 'https://example.com/video-2-1',
            resources: ['RAG_Basics.pdf', 'RAG_Introduction.pdf']
          },
          {
            id: 'lesson-2-2',
            title: 'RAG Architecture & Flow',
            description: 'RAG system architecture',
            duration: 20,
            content: 'Understand RAG architecture and data flow',
            videoUrl: 'https://example.com/video-2-2',
            resources: ['RAG_Architecture.pdf', 'RAG_Flow.pdf']
          },
          {
            id: 'lesson-2-3',
            title: 'Applications of RAG',
            description: 'Real-world RAG applications',
            duration: 15,
            content: 'Explore practical applications of RAG systems',
            videoUrl: 'https://example.com/video-2-3',
            resources: ['RAG_Applications.pdf', 'RAG_Use_Cases.pdf']
          },
          {
            id: 'lesson-2-4',
            title: 'Building RAG Pipelines',
            description: 'Implementing RAG systems',
            duration: 10,
            content: 'Learn to build and implement RAG pipelines',
            videoUrl: 'https://example.com/video-2-4',
            resources: ['RAG_Pipelines.pdf', 'RAG_Implementation.pdf']
          }
        ]
      },
      {
        id: 'module-3',
        title: 'Vector Databases & Embeddings',
        description: 'Working with vector databases and embeddings',
        duration: 1.0,
        lessons: [
          {
            id: 'lesson-3-1',
            title: 'What are Embeddings?',
            description: 'Understanding embeddings',
            duration: 15,
            content: 'Learn about embeddings and their importance in AI',
            videoUrl: 'https://example.com/video-3-1',
            resources: ['Embeddings_Guide.pdf', 'Embeddings_Basics.pdf']
          },
          {
            id: 'lesson-3-2',
            title: 'Popular Vector DBs (Pinecone, Weaviate, FAISS, Chroma)',
            description: 'Vector database comparison',
            duration: 20,
            content: 'Compare and understand popular vector databases',
            videoUrl: 'https://example.com/video-3-2',
            resources: ['Vector_DBs.pdf', 'DB_Comparison.pdf']
          },
          {
            id: 'lesson-3-3',
            title: 'Storing & Querying Vectors',
            description: 'Vector database operations',
            duration: 15,
            content: 'Learn to store and query vectors effectively',
            videoUrl: 'https://example.com/video-3-3',
            resources: ['Vector_Operations.pdf', 'Vector_Querying.pdf']
          },
          {
            id: 'lesson-3-4',
            title: 'Semantic Search',
            description: 'Implementing semantic search',
            duration: 10,
            content: 'Build semantic search capabilities with vectors',
            videoUrl: 'https://example.com/video-3-4',
            resources: ['Semantic_Search.pdf', 'Search_Implementation.pdf']
          }
        ]
      },
      {
        id: 'module-4',
        title: 'Model Customization & Fine-Tuning',
        description: 'Customizing and fine-tuning AI models',
        duration: 1.0,
        lessons: [
          {
            id: 'lesson-4-1',
            title: 'Fine-Tuning vs Prompt Engineering',
            description: 'Comparing fine-tuning approaches',
            duration: 15,
            content: 'Understand when to use fine-tuning vs prompt engineering',
            videoUrl: 'https://example.com/video-4-1',
            resources: ['Fine_Tuning_vs_PE.pdf', 'Approach_Comparison.pdf']
          },
          {
            id: 'lesson-4-2',
            title: 'Fine-Tuning LLMs (OpenAI, HuggingFace, Google, etc.)',
            description: 'Fine-tuning large language models',
            duration: 20,
            content: 'Learn to fine-tune LLMs from different providers',
            videoUrl: 'https://example.com/video-4-2',
            resources: ['LLM_Fine_Tuning.pdf', 'Provider_Guide.pdf']
          },
          {
            id: 'lesson-4-3',
            title: 'LoRA, QLoRA, PEFT',
            description: 'Parameter-efficient fine-tuning',
            duration: 15,
            content: 'Master parameter-efficient fine-tuning techniques',
            videoUrl: 'https://example.com/video-4-3',
            resources: ['LoRA_QLoRA_PEFT.pdf', 'PEFT_Guide.pdf']
          },
          {
            id: 'lesson-4-4',
            title: 'Data Preparation for Fine-Tuning',
            description: 'Preparing data for model training',
            duration: 10,
            content: 'Learn to prepare data for fine-tuning models',
            videoUrl: 'https://example.com/video-4-4',
            resources: ['Data_Preparation.pdf', 'Training_Data.pdf']
          }
        ]
      },
      {
        id: 'module-5',
        title: 'Model Training & Evaluation',
        description: 'Training and evaluating AI models',
        duration: 1.0,
        lessons: [
          {
            id: 'lesson-5-1',
            title: 'Training Custom Models',
            description: 'Building custom AI models',
            duration: 20,
            content: 'Learn to train custom AI models from scratch',
            videoUrl: 'https://example.com/video-5-1',
            resources: ['Custom_Models.pdf', 'Model_Training.pdf']
          },
          {
            id: 'lesson-5-2',
            title: 'Transfer Learning',
            description: 'Leveraging pre-trained models',
            duration: 15,
            content: 'Master transfer learning techniques',
            videoUrl: 'https://example.com/video-5-2',
            resources: ['Transfer_Learning.pdf', 'Pre_trained_Models.pdf']
          },
          {
            id: 'lesson-5-3',
            title: 'Evaluation Metrics',
            description: 'Measuring model performance',
            duration: 15,
            content: 'Learn to evaluate model performance effectively',
            videoUrl: 'https://example.com/video-5-3',
            resources: ['Evaluation_Metrics.pdf', 'Model_Evaluation.pdf']
          },
          {
            id: 'lesson-5-4',
            title: 'Experiment Tracking',
            description: 'Tracking model experiments',
            duration: 10,
            content: 'Implement experiment tracking for model development',
            videoUrl: 'https://example.com/video-5-4',
            resources: ['Experiment_Tracking.pdf', 'Tracking_Tools.pdf']
          }
        ]
      },
      {
        id: 'module-6',
        title: 'Advanced GenAI Applications',
        description: 'Advanced AI applications and techniques',
        duration: 1.0,
        lessons: [
          {
            id: 'lesson-6-1',
            title: 'A2A (Agent-to-Agent) Workflows',
            description: 'Multi-agent AI systems',
            duration: 20,
            content: 'Build agent-to-agent workflows and systems',
            videoUrl: 'https://example.com/video-6-1',
            resources: ['A2A_Workflows.pdf', 'Multi_Agent_Systems.pdf']
          },
          {
            id: 'lesson-6-2',
            title: 'OCR (Optical Character Recognition) with AI',
            description: 'AI-powered text recognition',
            duration: 15,
            content: 'Implement OCR using AI techniques',
            videoUrl: 'https://example.com/video-6-2',
            resources: ['OCR_AI.pdf', 'Text_Recognition.pdf']
          },
          {
            id: 'lesson-6-3',
            title: 'Foundation Models (FM)',
            description: 'Working with foundation models',
            duration: 15,
            content: 'Learn about foundation models and their applications',
            videoUrl: 'https://example.com/video-6-3',
            resources: ['Foundation_Models.pdf', 'FM_Guide.pdf']
          },
          {
            id: 'lesson-6-4',
            title: 'Custom Model Deployment',
            description: 'Deploying custom AI models',
            duration: 10,
            content: 'Deploy custom AI models in production',
            videoUrl: 'https://example.com/video-6-4',
            resources: ['Model_Deployment.pdf', 'Deployment_Guide.pdf']
          }
        ]
      },
      {
        id: 'module-7',
        title: 'Capstone Project & Real-World Use Cases',
        description: 'End-to-end AI project development',
        duration: 1.0,
        lessons: [
          {
            id: 'lesson-7-1',
            title: 'Capstone Project: End-to-End GenAI Solution',
            description: 'Complete AI project development',
            duration: 30,
            content: 'Build a complete end-to-end GenAI solution',
            videoUrl: 'https://example.com/video-7-1',
            resources: ['Capstone_Project.pdf', 'E2E_Solution.pdf']
          },
          {
            id: 'lesson-7-2',
            title: 'Department-wise Use Cases (HR, Finance, Marketing, etc.)',
            description: 'Industry-specific AI applications',
            duration: 15,
            content: 'Explore AI use cases across different departments',
            videoUrl: 'https://example.com/video-7-2',
            resources: ['Department_Use_Cases.pdf', 'Industry_Applications.pdf']
          },
          {
            id: 'lesson-7-3',
            title: 'Best Practices for Production',
            description: 'Production-ready AI systems',
            duration: 10,
            content: 'Learn best practices for production AI systems',
            videoUrl: 'https://example.com/video-7-3',
            resources: ['Production_Best_Practices.pdf', 'Production_Guide.pdf']
          },
          {
            id: 'lesson-7-4',
            title: 'Scaling & Monitoring',
            description: 'Scaling and monitoring AI systems',
            duration: 5,
            content: 'Scale and monitor AI systems effectively',
            videoUrl: 'https://example.com/video-7-4',
            resources: ['Scaling_Monitoring.pdf', 'Scale_Guide.pdf']
          }
        ]
      }
    ]
  }
};

const updateWorkshopsCurriculum = async () => {
  try {
    console.log('🚀 Starting Workshop Curriculum Update...');
    
    // Check environment variables
    console.log('\n📋 Environment Variables:');
    console.log(`   API Key: ${process.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   Project ID: ${process.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}`);
    
    if (!process.env.VITE_FIREBASE_API_KEY || !process.env.VITE_FIREBASE_PROJECT_ID) {
      console.log('\n❌ Missing required environment variables!');
      return;
    }
    
    // Initialize Firebase
    console.log('\n🚀 Initializing Firebase...');
    try {
      const { initializeApp } = await import('firebase/app');
      const { getFirestore, doc, updateDoc, collection, getDocs } = await import('firebase/firestore');
      
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      console.log('✅ Firebase initialized');
      
      // Get existing workshops
      console.log('\n🔍 Fetching existing workshops...');
      const workshopsSnapshot = await getDocs(collection(firestore, 'workshops'));
      
      if (workshopsSnapshot.empty) {
        console.log('❌ No workshops found in Firestore. Please run the migration script first.');
        return;
      }
      
      console.log(`📊 Found ${workshopsSnapshot.size} workshops`);
      
      // Update each workshop with curriculum
      console.log('\n📚 Updating workshops with curriculum...');
      for (const workshopDoc of workshopsSnapshot.docs) {
        const workshopId = workshopDoc.id;
        const workshopData = workshopDoc.data();
        
        console.log(`🔄 Updating workshop: ${workshopData.title} (ID: ${workshopId})`);
        
        if (curriculumData[workshopId]) {
          try {
            const workshopRef = doc(firestore, 'workshops', workshopId);
            await updateDoc(workshopRef, {
              curriculum: curriculumData[workshopId],
              updatedAt: new Date()
            });
            
            console.log(`✅ Updated ${workshopData.title} with curriculum`);
            console.log(`📖 Added ${curriculumData[workshopId].modules.length} modules`);
            
            // Log curriculum details
            curriculumData[workshopId].modules.forEach((module, index) => {
              console.log(`   📚 Module ${index + 1}: ${module.title} (${module.lessons.length} lessons)`);
            });
            
          } catch (error) {
            console.error(`❌ Error updating workshop ${workshopData.title}:`, error.message);
          }
        } else {
          console.log(`⚠️ No curriculum data found for workshop: ${workshopId}`);
        }
      }
      
      // Verify updates
      console.log('\n🔍 Verifying updates...');
      const updatedWorkshopsSnapshot = await getDocs(collection(firestore, 'workshops'));
      const updatedWorkshops = updatedWorkshopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`✅ Successfully updated ${updatedWorkshops.length} workshops`);
      
      for (const workshop of updatedWorkshops) {
        console.log(`📊 ${workshop.title}: ${workshop.level} level, ₹${workshop.price}`);
        if (workshop.curriculum) {
          console.log(`   📖 Curriculum: ${workshop.curriculum.modules.length} modules`);
          const totalLessons = workshop.curriculum.modules.reduce((total, module) => total + module.lessons.length, 0);
          console.log(`   📚 Total lessons: ${totalLessons}`);
        } else {
          console.log(`   ⚠️ No curriculum data`);
        }
      }
      
      console.log('\n🎉 Workshop Curriculum Update completed successfully!');
      console.log('📋 Summary:');
      console.log(`   - Updated ${workshopsSnapshot.size} workshops with curriculum`);
      console.log('   - Complete module and lesson data added');
      console.log('💡 You can now view workshops with full curriculum in your application!');
      
    } catch (firebaseError) {
      console.error('❌ Error with Firebase operations:', firebaseError.message);
      throw firebaseError;
    }
    
  } catch (error) {
    console.error('❌ Error during curriculum update:', error.message);
    throw error;
  }
};

// Run update directly
console.log('🔄 Starting curriculum update process...');
updateWorkshopsCurriculum()
  .then(() => {
    console.log('\n✅ Curriculum update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Curriculum update failed:', error.message);
    process.exit(1);
  });

export { updateWorkshopsCurriculum }; 