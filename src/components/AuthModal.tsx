import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Mail, UserCircle, X, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Callback when authenticated so the caller can trigger state
  onAuthenticated?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticated }) => {
  const { loginUser, signupUser } = useShop();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorText('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setErrorText('');

    try {
      if (isSignUp) {
        if (!fullName) {
          setErrorText('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        const success = await signupUser(email, fullName);
        if (success) {
          onClose();
          if (onAuthenticated) onAuthenticated();
        }
      } else {
        const success = await loginUser(email);
        if (success) {
          onClose();
          if (onAuthenticated) onAuthenticated();
        }
      }
    } catch (err) {
      setErrorText('Authentication request failed. Please check your data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="auth-modal-overlay">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-gray-100 flex flex-col gap-5" id="auth-modal-card">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-50"
          id="btn-close-auth-modal"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-1">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-gray-900" id="auth-modal-headline">
            {isSignUp ? 'Create your Account' : 'Welcome to ShopEase'}
          </h3>
          <p className="text-xs text-gray-500">
            {isSignUp ? 'Sign up to lock in orders and checkout faster' : 'Sign in using your email to view order history'}
          </p>
        </div>

        {errorText && (
          <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl border border-rose-100 font-medium" id="auth-error-badge">
            {errorText}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5" id="field-fullname-grp">
              <label className="text-xs font-semibold text-gray-600 block pl-1">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <UserCircle className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow bg-gray-50/50"
                  id="input-auth-name"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5" id="field-email-grp">
            <label className="text-xs font-semibold text-gray-600 block pl-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow bg-gray-50/50"
                id="input-auth-email"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 cursor-pointer shadow-indigo-200/50 shadow-md"
            id="btn-auth-submit"
          >
            {isLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Continue'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorText('');
              }}
              className="text-indigo-600 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
              id="btn-auth-switch"
            >
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
