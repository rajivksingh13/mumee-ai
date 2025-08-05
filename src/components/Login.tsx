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
    <div className="min-h-screen bg-gradient-to-br from-[#e3e7ef] via-[#d1e3f8] to-[#b6c6e3] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-gradient-to-br from-white/70 to-blue-100/60 border border-blue-100 border-t border-white/40 p-10 rounded-2xl shadow-2xl backdrop-blur-2xl"
      >
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">titliAI</h2>
          </Link>
          <h3 className="text-xl font-medium text-gray-700">Sign in to your account</h3>
          <p className="mt-2 text-sm text-gray-500">
            Or{' '}
            <Link to={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-t-lg relative block w-full px-3 py-2 border border-blue-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:z-10 sm:text-sm font-medium shadow"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-lg relative block w-full px-3 py-2 border border-blue-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:z-10 sm:text-sm font-medium shadow"
                placeholder="Password"
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 via-purple-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed shadow"
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
              <div className="w-full border-t border-blue-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-blue-600 font-semibold shadow-sm">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-blue-400 rounded-lg shadow-md text-sm font-semibold text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 