import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import { useAuth } from './contexts/AuthContext';
import { auth } from './config/firebase';
import Workshops from './components/Workshops';
import FoundationWorkshop from './components/FoundationWorkshop';
import BeginnerWorkshop from './components/BeginnerWorkshop';
import SearchPage from './components/SearchPage';
import AccountPage, { PaymentDetailsPage } from './components/AccountPage';
import ProfilePage from './components/ProfilePage';

import AdvanceWorkshop from './components/AdvanceWorkshop';

// Placeholder components for each page
const Home = () => (
  <div className="bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] min-h-screen text-gray-900 font-sans">
    {/* Hero Section */}
    <section className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Empowering Your Future with <span className="text-blue-600">AI Solutions</span></h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">Workshops, Consulting, Training, and a Marketplace for AI Agents. Unlock the power of AI for your business, students, or personal growth.</p>
        <a href="#offerings" className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-semibold px-6 py-3 rounded-lg shadow transition">Explore Offerings</a>
      </div>
      <div className="flex-1 flex justify-center relative">
        {/* Enhanced glassmorphic shine behind the AI illustration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-br from-blue-200 via-purple-200 to-teal-100 opacity-60 blur-3xl z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-2xl bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 shadow-2xl backdrop-blur-2xl z-0" />
        <img src="/ai-illustration.svg" alt="AI Agency" className="w-80 h-80 object-contain relative z-10 drop-shadow-2xl" />
      </div>
    </section>
    {/* Offerings Grid */}
    <section id="offerings" className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">Our AI Offerings</h2>
      <div className="flex justify-center">
        {/* Workshops - Only enabled card */}
        <a href="/workshops" className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl hover:shadow-blue-300/40 hover:scale-105 p-8 flex flex-col items-center text-center transition backdrop-blur-2xl relative group max-w-sm w-full">
          <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-blue-200/40 transition" />
          <div className="text-5xl mb-4 text-blue-500">🎓</div>
          <div className="font-semibold text-xl text-blue-600 mb-2">Workshops</div>
          <div className="text-gray-700 text-base mb-4">Hands-on AI workshops for all levels.</div>
          <span className="inline-block mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 text-white px-6 py-3 rounded-lg font-semibold text-lg">Explore Workshops</span>
        </a>
        {/* Consultant - Coming Soon */}
        <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transition opacity-60 cursor-not-allowed relative backdrop-blur-2xl group hidden">
          <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-purple-200/40 transition" />
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow">Coming Soon</span>
          </div>
          <div className="text-4xl mb-3 text-purple-400">💡</div>
          <div className="font-semibold text-lg text-blue-600 mb-1">Consultant</div>
          <div className="text-gray-700 text-sm">Expert AI consulting for your business.</div>
        </div>
        {/* Library - Coming Soon */}
        <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transition opacity-60 cursor-not-allowed relative backdrop-blur-2xl group hidden">
          <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-purple-200/40 transition" />
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow">Coming Soon</span>
          </div>
          <div className="text-4xl mb-3 text-purple-400">📚</div>
          <div className="font-semibold text-lg text-blue-600 mb-1">Library</div>
          <div className="text-gray-700 text-sm">GenAI books & AI-generated comics.</div>
        </div>
        {/* Labs - Coming Soon */}
        <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transition opacity-60 cursor-not-allowed relative backdrop-blur-2xl group hidden">
          <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-purple-200/40 transition" />
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow">Coming Soon</span>
          </div>
          <div className="text-4xl mb-3 text-purple-400">🧪</div>
          <div className="font-semibold text-lg text-blue-600 mb-1">Labs</div>
          <div className="text-gray-700 text-sm">Experiment with the latest AI tools.</div>
        </div>
        {/* Marketplace - Coming Soon */}
        <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transition opacity-60 cursor-not-allowed relative backdrop-blur-2xl group hidden">
          <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-purple-200/40 transition" />
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow">Coming Soon</span>
          </div>
          <div className="text-4xl mb-3 text-purple-400">🤖</div>
          <div className="font-semibold text-lg text-blue-600 mb-1">Marketplace</div>
          <div className="text-gray-700 text-sm">Discover and deploy AI agents.</div>
        </div>
        {/* Training - Coming Soon */}
        <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transition opacity-60 cursor-not-allowed relative backdrop-blur-2xl group hidden">
          <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-purple-200/40 transition" />
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow">Coming Soon</span>
          </div>
          <div className="text-4xl mb-3 text-purple-400">🏆</div>
          <div className="font-semibold text-lg text-blue-600 mb-1">Training</div>
          <div className="text-gray-700 text-sm">AI training programs for upskilling.</div>
        </div>
        {/* Certifications - Coming Soon */}
        <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transition opacity-60 cursor-not-allowed relative backdrop-blur-2xl group hidden">
          <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-purple-200/40 transition" />
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow">Coming Soon</span>
          </div>
          <div className="text-4xl mb-3 text-purple-400">📜</div>
          <div className="font-semibold text-lg text-blue-600 mb-1">Certifications</div>
          <div className="text-gray-700 text-sm">Get certified in AI technologies.</div>
        </div>
        {/* Blogs - Coming Soon */}
        <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transition opacity-60 cursor-not-allowed relative backdrop-blur-2xl group hidden">
          <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-purple-200/40 transition" />
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow">Coming Soon</span>
          </div>
          <div className="text-4xl mb-3 text-purple-400">📰</div>
          <div className="font-semibold text-lg text-blue-600 mb-1">Blogs</div>
          <div className="text-gray-700 text-sm">Stay updated with AI trends.</div>
        </div>
        {/* Pricing/Plan - Coming Soon */}
        <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transition opacity-60 cursor-not-allowed relative backdrop-blur-2xl group hidden">
          <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-purple-200/40 transition" />
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow">Coming Soon</span>
          </div>
          <div className="text-4xl mb-3 text-purple-400">💳</div>
          <div className="font-semibold text-lg text-blue-600 mb-1">Pricing/Plan</div>
          <div className="text-gray-700 text-sm">Flexible plans for every need.</div>
        </div>
        {/* Resources - Coming Soon */}
        <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transition opacity-60 cursor-not-allowed relative backdrop-blur-2xl group hidden">
          <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-purple-200/40 transition" />
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow">Coming Soon</span>
          </div>
          <div className="text-4xl mb-3 text-purple-400">🔗</div>
          <div className="font-semibold text-lg text-blue-600 mb-1">Resources</div>
          <div className="text-gray-700 text-sm">Guides for corporates, students, individuals.</div>
        </div>
        {/* Student Corner - Coming Soon */}
        <div className="bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 rounded-xl shadow-2xl p-6 flex flex-col items-center text-center transition opacity-60 cursor-not-allowed relative backdrop-blur-2xl group hidden">
          <div className="absolute inset-0 rounded-xl pointer-events-none group-hover:ring-4 group-hover:ring-purple-200/40 transition" />
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold shadow">Coming Soon</span>
          </div>
          <div className="text-4xl mb-3 text-purple-400">🎒</div>
          <div className="font-semibold text-lg text-blue-600 mb-1">Student Corner</div>
          <div className="text-gray-700 text-sm">Special resources for students.</div>
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">Why Choose titliAI?</h3>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <li className="bg-white/60 border border-blue-100 border-t border-white/40 rounded-lg shadow-2xl p-6 backdrop-blur-2xl relative group">
          <div className="absolute inset-0 rounded-lg pointer-events-none group-hover:ring-4 group-hover:ring-blue-200/40 transition" />
          <div className="text-3xl mb-2 text-blue-500">🚀</div>
          <div className="font-semibold mb-1 text-blue-600">Cutting-Edge AI</div>
          <div className="text-gray-700 text-sm">Stay ahead with the latest in GenAI, ML, and automation.</div>
        </li>
        <li className="bg-white/60 border border-blue-100 border-t border-white/40 rounded-lg shadow-2xl p-6 backdrop-blur-2xl relative group">
          <div className="absolute inset-0 rounded-lg pointer-events-none group-hover:ring-4 group-hover:ring-blue-200/40 transition" />
          <div className="text-3xl mb-2 text-blue-500">🤝</div>
          <div className="font-semibold mb-1 text-blue-600">For All Audiences</div>
          <div className="text-gray-700 text-sm">Corporate, students, and individuals—everyone can benefit.</div>
        </li>
        <li className="bg-white/60 border border-blue-100 border-t border-white/40 rounded-lg shadow-2xl p-6 backdrop-blur-2xl relative group">
          <div className="absolute inset-0 rounded-lg pointer-events-none group-hover:ring-4 group-hover:ring-blue-200/40 transition" />
          <div className="text-3xl mb-2 text-blue-500">💬</div>
          <div className="font-semibold mb-1 text-blue-600">Expert Support</div>
          <div className="text-gray-700 text-sm">Get guidance from experienced AI professionals.</div>
        </li>
      </ul>
    </section>

    {/* Success Stories Carousel - Hidden for now, will be shown once we have customers onboarded */}
    {/* 
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-8 text-center">Success Stories</h3>
      <p className="text-gray-300 text-center mb-10 text-lg">See how organizations and individuals are transforming with titliAI</p>
      <SuccessStoriesCarousel />
    </section>
    */}
  </div>
);
const Consultant = () => <div className="p-8">AI Consultant - Coming Soon</div>;
const Library = () => <div className="p-8">AI Library - Coming Soon</div>;
const Labs = () => <div className="p-8">AI Labs - Coming Soon</div>;
const Marketplace = () => <div className="p-8">AI Agents Marketplace - Coming Soon</div>;
const Training = () => <div className="p-8">AI Training - Coming Soon</div>;
const Certifications = () => <div className="p-8">AI Certifications - Coming Soon</div>;
const Blogs = () => <div className="p-8">AI Blogs - Coming Soon</div>;
const Pricing = () => <div className="p-8">Pricing/Plan - Coming Soon</div>;
const Resources = () => <div className="p-8">Resources - Coming Soon</div>;
const StudentCorner = () => <div className="p-8">Student Corner - Coming Soon</div>;

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App: React.FC = () => {
  const { setUser } = useAuth();

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/workshops/beginner" element={<BeginnerWorkshop />} />
        <Route path="/workshops/foundation" element={<FoundationWorkshop />} />
        <Route path="/workshops/advance" element={<AdvanceWorkshop />} />
        <Route path="/consultant" element={<Consultant />} />
        <Route path="/library" element={<Library />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/training" element={<Training />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/student-corner" element={<StudentCorner />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/payments" element={<PaymentDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/enrollment-dashboard" element={<Navigate to="/account" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App; 