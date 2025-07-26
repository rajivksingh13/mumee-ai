import React from 'react';
import { Link } from 'react-router-dom';

const workshops = [
  {
    title: 'Gen AI Workshop - Absolute Beginner',
    description:
      'Start your AI journey from scratch! Perfect for complete beginners with zero technical background. Learn the fundamentals of Generative AI, how to use AI tools effectively, and understand the AI revolution happening around us.',
    cta: 'Explore Beginner Workshop',
    level: 'beginner',
    link: '/workshops/beginner',
  },
  {
    title: 'Gen AI Workshop - Foundation Level',
    description:
      'Kickstart your AI journey! Learn the basics of Artificial Intelligence, Machine Learning, and Data Science. No prior experience required. Perfect for students, beginners, and professionals looking to build a strong foundation.',
    cta: 'Explore Foundation Workshop',
    level: 'foundation',
    link: '/workshops/foundation',
  },
  {
    title: 'Gen AI Workshop - Advance',
    description:
      'Take your AI skills to the next level! Dive deep into advanced machine learning, neural networks, GenAI, and real-world AI projects. Ideal for those with prior experience or who have completed the foundation workshop.',
    cta: 'Explore Advance Workshop',
    level: 'advance',
    link: '/workshops/advance',
  },
];

const Workshops: React.FC = () => (
  <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">Gen-AI Workshops</h1>
      <p className="text-gray-700 text-center mb-12 text-lg max-w-2xl mx-auto">
        Join our hands-on Gen-AI workshops designed for all levels. Whether you’re just starting or looking to master advanced AI concepts, we have the right workshop for you.
      </p>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {workshops.map((ws) => (
           <div
             key={ws.level}
             className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center transition backdrop-blur-2xl relative group hover:shadow-blue-300/40 hover:scale-105"
           >
             <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:ring-4 group-hover:ring-blue-200/40 transition" />
             <h2 className="text-2xl font-bold text-blue-600 mb-4 z-10 relative">{ws.title}</h2>
             <p className="text-gray-700 mb-6 z-10 relative">{ws.description}</p>
             <Link
               to={ws.link}
               className="mt-auto bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-semibold px-6 py-3 rounded-lg shadow transition z-10 relative"
             >
               {ws.cta}
             </Link>
           </div>
         ))}
       </div>
    </div>
  </div>
);

export default Workshops; 