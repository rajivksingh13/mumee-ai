import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CourseDetail from './components/CourseDetail';
import { auth } from './config/firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from './contexts/AuthContext';
import CreateCourse from './components/admin/CreateCourse';
import ManageUsers from './components/admin/ManageUsers';
import Analytics from './components/admin/Analytics';
import EditCourse from './components/admin/EditCourse';
import { ref, get } from 'firebase/database';
import { database } from './config/firebase';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useAuth();

  useEffect(() => {
    console.log('App component mounted');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser);
      
      try {
        if (firebaseUser) {
          // Fetch user data from database to get accountType
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          const userData = snapshot.exists() ? snapshot.val() : null;
          
          const extendedUser = {
            ...firebaseUser,
            accountType: userData?.accountType || 'individual'
          };
          
          setUser(extendedUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error handling auth state:', err);
        setError('Authentication error occurred');
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Welcome /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/admin" element={user?.accountType === 'admin' ? <Dashboard /> : <Navigate to="/dashboard" />} />
        <Route path="/admin/create-course" element={user?.accountType === 'admin' ? <CreateCourse /> : <Navigate to="/dashboard" />} />
        <Route path="/admin/edit-course/:courseId" element={user?.accountType === 'admin' ? <EditCourse /> : <Navigate to="/dashboard" />} />
        <Route path="/admin/users" element={user?.accountType === 'admin' ? <ManageUsers /> : <Navigate to="/dashboard" />} />
        <Route path="/admin/analytics" element={user?.accountType === 'admin' ? <Analytics /> : <Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App; 