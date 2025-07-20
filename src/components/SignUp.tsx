import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
import { registerWithEmail, signInWithGoogle } from '../services/authService';
import { auth } from '../config/firebase';

const SignUp: React.FC = () => {
  console.log('🎯 SignUp component loaded!');
  
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [accountType, setAccountType] = useState<'individual' | 'business' | 'enterprise' | 'admin'>('individual');
  const [adminCode, setAdminCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    console.log('🚀 handleEmailSignUp function called!');
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (!termsAccepted) {
        setError('Please accept the terms and conditions');
        setLoading(false);
        return;
      }

      console.log('Starting signup process...');
      console.log('Form data:', { email, displayName, accountType });
      
      const user = await registerWithEmail(email, password, displayName, accountType);
      console.log('registerWithEmail result:', user);
      
      if (user) {
        console.log('User created successfully, sending email...');
        
        // Send welcome email via backend
        try {
          console.log('Calling email API...');
          const response = await fetch('https://mumee-ai-backend.onrender.com/api/email/welcome', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              userName: displayName,
              accountType: accountType
            }),
          });

          console.log('Email API response status:', response.status);
          
          if (response.ok) {
            const responseData = await response.json();
            console.log('✅ Welcome email sent successfully:', responseData);
          } else {
            const errorData = await response.json();
            console.error('❌ Email API error:', errorData);
          }
        } catch (emailError) {
          console.error('❌ Error sending welcome email:', emailError);
          // Don't block signup if email fails
        }
        
        console.log('Navigating to dashboard...');
        navigate('/dashboard');
      } else {
        console.error('❌ User creation failed or returned null');
        setError('Failed to create account');
      }
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    console.log('🔍 Google signup started');
    setError(null);
    setLoading(true);

    try {
      console.log('Calling signInWithGoogle...');
      const user = await signInWithGoogle();
      console.log('Google signup successful:', user);
      
      // Send welcome email for Google signup too
      try {
        console.log('Sending welcome email for Google signup...');
        const response = await fetch('https://mumee-ai-backend.onrender.com/api/email/welcome', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            userName: user.displayName || 'Google User',
            accountType: 'individual'
          }),
        });

        console.log('Google signup email response status:', response.status);
        
        if (response.ok) {
          const responseData = await response.json();
          console.log('✅ Welcome email sent for Google signup:', responseData);
        } else {
          const errorData = await response.json();
          console.error('❌ Google signup email error:', errorData);
        }
      } catch (emailError) {
        console.error('❌ Error sending welcome email for Google signup:', emailError);
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Google signup error:', err);
      setError(err.message || 'Failed to sign up with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl border border-gray-700">
        {/* DEBUG INDICATOR */}
        <div className="bg-red-500 text-white p-2 text-center font-bold">
          🐛 DEBUG: This is the SignUp component with email functionality
        </div>
        
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h2 className="text-3xl font-extrabold text-white mb-2">MumeeAI</h2>
          </Link>
          <h3 className="text-xl font-medium text-gray-300">Create your account</h3>
        </div>
        
        <form onSubmit={(e) => {
          alert('Form submitted! Check console for details.');
          console.log('📝 Form submitted!');
          console.log('Form validation check:', {
            email: !!email,
            displayName: !!displayName,
            password: !!password,
            confirmPassword: !!confirmPassword,
            passwordsMatch: password === confirmPassword,
            termsAccepted: termsAccepted,
            accountType: accountType
          });
          handleEmailSignUp(e);
        }} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="accountType" className="block text-sm font-medium text-gray-300">
              Account Type
            </label>
            <select
              id="accountType"
              name="accountType"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as 'individual' | 'business' | 'enterprise' | 'admin')}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="individual">Individual</option>
              <option value="business">Business</option>
              <option value="enterprise">Enterprise</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {accountType === 'admin' && (
            <div>
              <label htmlFor="adminCode" className="block text-sm font-medium text-gray-300">
                Admin Code
              </label>
              <input
                id="adminCode"
                name="adminCode"
                type="password"
                required
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter admin code"
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
              I agree to the{' '}
              <Link to="/terms" className="text-indigo-400 hover:text-indigo-300">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              onClick={() => console.log('🔘 Submit button clicked!')}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-white bg-gray-700/50 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Temporary Test Button */}
          <div className="mt-4">
            <button
              onClick={async () => {
                try {
                  console.log('Testing email functionality...');
                  const response = await fetch('https://mumee-ai-backend.onrender.com/api/email/welcome', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: email || 'test@example.com',
                      userName: displayName || 'Test User',
                      accountType: accountType || 'Individual'
                    }),
                  });
                  
                  const data = await response.json();
                  console.log('Test email response:', data);
                  
                  if (response.ok) {
                    alert('✅ Test email sent successfully! Check your email.');
                  } else {
                    alert(`❌ Email failed: ${data.error || 'Unknown error'}`);
                  }
                } catch (error) {
                  console.error('Test email error:', error);
                  alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
              }}
              className="w-full flex items-center justify-center px-4 py-2 border border-yellow-600 rounded-lg shadow-sm text-sm font-medium text-yellow-400 bg-yellow-600/20 hover:bg-yellow-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              🧪 Test Email Functionality
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;