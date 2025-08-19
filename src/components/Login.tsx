import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login, signInWithGoogle } from '../services/authService';
import { buildApiUrl, API_CONFIG } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';
  const { setUser } = useAuth();

  // Helper function to send welcome email
  const sendWelcomeEmail = async (userEmail: string, userName: string, accountType: string = 'individual') => {
    try {
      const emailUrl = buildApiUrl(API_CONFIG.ENDPOINTS.EMAIL.WELCOME);
      console.log('📧 Sending welcome email to:', emailUrl);
      
      const response = await fetch(emailUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          userName: userName,
          accountType: accountType,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send welcome email:', errorText);
        throw new Error(`Email service error: ${errorText}`);
      } else {
        console.log('✅ Welcome email sent successfully');
        return true;
      }
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      throw emailError;
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      
      // Set user in context
      setUser(user);
      
      // Add fromRedirect parameter if redirecting to beginner workshop
      if (redirectTo === '/workshops/beginner') {
        navigate('/workshops/beginner?fromRedirect=true');
      } else if (redirectTo === '/workshops/foundation') {
        navigate('/workshops/foundation?fromRedirect=true');
      } else if (redirectTo === '/workshops/advance') {
        navigate('/workshops/advance?fromRedirect=true');
      } else {
        navigate(redirectTo);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'Failed to login. Please check your credentials.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const user = await signInWithGoogle();
      
      // Set user in context
      setUser(user);
      
      // Check if user is new (first login) and send welcome email
      if (user && user.metadata && user.metadata.creationTime === user.metadata.lastSignInTime) {
        try {
          await sendWelcomeEmail(user.email!, user.displayName || 'Google User');
        } catch (emailError) {
          console.error('Email sending failed for new Google user, but login succeeded:', emailError);
          // Don't fail the login if email fails, but log it
        }
      }
      
      // Add fromRedirect parameter if redirecting to specific workshops
      if (redirectTo === '/workshops/beginner') {
        navigate('/workshops/beginner?fromRedirect=true');
      } else if (redirectTo === '/workshops/foundation') {
        navigate('/workshops/foundation?fromRedirect=true');
      } else if (redirectTo === '/workshops/advance') {
        navigate('/workshops/advance?fromRedirect=true');
      } else {
        navigate(redirectTo);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      let errorMessage = 'Failed to login with Google';
      
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google sign-in was cancelled.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Google sign-in was blocked by your browser. Please allow popups and try again.';
      } else if (err.message) {
        errorMessage = err.message;
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl border border-gray-200 p-10"
        >
          <div className="text-center">
            <Link to="/" className="inline-block">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  titliAI
                </span>
              </h2>
            </Link>
            <h3 className="text-xl font-medium text-gray-700">Sign in to your account</h3>
            <p className="mt-2 text-sm text-gray-500">
              Or{' '}
              <Link to={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="font-medium text-blue-600 hover:text-blue-500">
                Join for Free
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium rounded-lg shadow-sm"
                  placeholder="Enter your email"
                />
              </div>
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
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-400 border-blue-100 rounded bg-white/60 backdrop-blur"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
              >
                {loading ? (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : null}
                Sign in
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
                onClick={handleGoogleLogin}
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
              Don't have an account?{' '}
              <Link to={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Join for Free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 