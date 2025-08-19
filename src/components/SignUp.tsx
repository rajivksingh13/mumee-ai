import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
import { register, signInWithGoogle } from '../services/authService';
import { auth } from '../config/firebase';
import { buildApiUrl, API_CONFIG } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  // const [userType, setUserType] = useState('individual');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();

  React.useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate(redirectTo);
      }
    });
    return () => unsubscribe();
  }, [navigate, redirectTo]);

  // Helper function to send welcome email
  const sendWelcomeEmail = async (userEmail: string, userName: string, accountType: string) => {
    try {
      const emailUrl = buildApiUrl(API_CONFIG.ENDPOINTS.EMAIL.WELCOME);
      console.log('📧 Sending welcome email to:', emailUrl);
      console.log('📧 Email data:', { email: userEmail, userName, accountType });
      
      const response = await fetch(emailUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          userName: userName,
          accountType: accountType
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send welcome email:', errorText);
        throw new Error(`Email service error: ${errorText}`);
      } else {
        const result = await response.json();
        console.log('✅ Welcome email sent successfully:', result);
        return true;
      }
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      throw emailError;
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);



    try {
      if (!termsAccepted) {
        setError('Please accept the terms and conditions');
        setLoading(false);
        return;
      }

      console.log('🚀 Starting registration process...');
      console.log('📝 Registration data:', { email, displayName, userType: 'individual' });

      // Register user (this will create user in both Auth and Firestore)
      const user = await register(email, password, displayName, 'individual'); // Default to individual for now
      
      if (user) {
        console.log('✅ User registered successfully:', user.uid);
        
        // Set user in context
        setUser(user);
        
        // Send welcome email and wait for it to complete
        try {
          console.log('📧 Attempting to send welcome email...');
          await sendWelcomeEmail(email, displayName, 'individual');
          console.log('✅ Email sent successfully, redirecting...');
        } catch (emailError) {
          console.error('Email sending failed, but user was created:', emailError);
          // Don't fail the signup if email fails, but log it
        }
        
        // Redirect to the intended page
        navigate(redirectTo);
      } else {
        setError('Failed to create account');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Failed to create account';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use. Please try logging in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);

    try {
      const user = await signInWithGoogle();
      
      // Set user in context
      setUser(user);
      
      // Send welcome email for Google signup and wait for it to complete
      try {
        await sendWelcomeEmail(user.email!, user.displayName || 'Google User', 'individual');
      } catch (emailError) {
        console.error('Email sending failed for Google signup, but user was created:', emailError);
        // Don't fail the signup if email fails, but log it
      }
      
      // Redirect to the intended page
      navigate(redirectTo);
    } catch (error: any) {
      console.error('Google signup error:', error);
      let errorMessage = 'Failed to sign up with Google';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google sign-in was cancelled.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Google sign-in was blocked by your browser. Please allow popups and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl border border-gray-200 p-10">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  titliAI
                </span>
              </h2>
            </Link>
            <h3 className="text-xl font-medium text-gray-700">Create your account</h3>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleEmailSignUp(e);
          }} className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium rounded-lg shadow-sm"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium rounded-lg shadow-sm"
                placeholder="Enter your email"
              />
            </div>
            {/* Account Type field - commented out for future use
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <select
                id="userType"
                name="userType"
                required
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium rounded-lg shadow-sm"
              >
                <option value="individual">Individual</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
            */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium rounded-lg shadow-sm"
                placeholder="Create a password"
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
              >
                {loading ? 'Creating account...' : 'Join for Free'}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;