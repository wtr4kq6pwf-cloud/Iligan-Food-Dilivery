// components/auth/AuthPage.jsx
import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { ORANGE } from '../../config/constants';
import { FoodButton } from '../common/FoodButton';
import { StyledInput } from '../common/StyledInput';
import { useOfflineAuth } from '../../hooks/useOfflineAuth';
import { useOfflineDetection } from '../../hooks/useOfflineDetection';

export const AuthPage = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { isOnline } = useOfflineDetection();
  const { offlineLogin } = useOfflineAuth();

  const handleOnlineAuth = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    
    setAuthLoading(true);
    
    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      if (result.data.user) {
        onSuccess();
      } else if (result.data.session === null && !isLogin) {
        setError('Account created. Please check your email to confirm your account before logging in.');
        setIsLogin(true); 
      }

    } catch (e) {
      console.error(e);
      setError(e.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOfflineLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setAuthLoading(true);
    const result = await offlineLogin(email, password);
    
    if (result.success) {
      setAuthLoading(false);
      onSuccess(); // Navigate to homepage
    } else {
      setError(result.error || 'Login failed');
      setAuthLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center h-full w-full py-10"> 
      <div className="p-6 md:p-10 bg-white rounded-2xl shadow-2xl mx-4 w-full max-w-md">
        
        {/* Offline Mode Banner */}
        {!isOnline && (
          <div className="mb-6 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg animate-pulse">
            <p className="text-yellow-800 font-bold text-center">
              🔴 Offline Mode Detected
            </p>
            <p className="text-yellow-700 text-sm text-center mt-1">
              Use any email & 6+ character password to login locally
            </p>
          </div>
        )}
        
        <h2 className="text-3xl font-extrabold mb-8 text-center" style={{ color: ORANGE }}>
          {isLogin ? 'Welcome Back!' : 'Join Iligan Food'}
        </h2>
        
        {/* Online/Offline Status Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm font-semibold text-gray-700">
            {isOnline ? '✅ Online' : '🔴 Offline'}
          </span>
        </div>
        
        <div className='space-y-4'>
          <StyledInput
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={authLoading}
          />
          <StyledInput
            type="password"
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={authLoading}
          />
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}
        
        <div className='mt-8'>
          <FoodButton 
            onClick={isOnline ? handleOnlineAuth : handleOfflineLogin} 
            disabled={authLoading}
          >
            {authLoading ? (
              <span>⏳ Authenticating...</span>
            ) : isOnline ? (
              isLogin ? '🔒 Login Securely' : '✍️ Sign Up Now'
            ) : (
              isLogin ? '🚀 Login (Offline)' : '⚠️ Offline (Login Only)'
            )}
          </FoodButton>
        </div>
        
        {/* Test Credentials Info - Only show offline */}
        {!isOnline && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 font-semibold text-sm mb-2">💡 Test Credentials:</p>
            <p className="text-blue-800 text-xs font-mono mb-1">Email: test@example.com</p>
            <p className="text-blue-800 text-xs font-mono">Password: password123</p>
          </div>
        )}
        
        {/* Toggle between Login and Sign Up */}
        {isOnline && (
          <p className="mt-6 text-center text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="ml-2 font-bold hover:underline"
              style={{ color: ORANGE }}
              disabled={authLoading}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        )}
        
        {!isOnline && (
          <p className="mt-6 text-center text-gray-500 text-xs">
            ℹ️ Offline mode - Only login available. Connect to internet to sign up.
          </p>
        )}
      </div>
    </div>
  );
};