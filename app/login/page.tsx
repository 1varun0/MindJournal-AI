'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signIn, signOut } from 'aws-amplify/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Brain, Sparkles, Eye, EyeOff, ArrowRight, AlertCircle, Lock, Mail, LogOut } from "lucide-react";
import '../../lib/amplify';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAlreadyAuthenticated, setIsAlreadyAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user.username);
        setIsAlreadyAuthenticated(true);
        // Don't auto-redirect, let the user choose
      } catch (error) {
        // No user signed in
        setIsAlreadyAuthenticated(false);
        setCurrentUser(null);
      }
    };
    checkUser();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If already authenticated, just redirect
    if (isAlreadyAuthenticated) {
      router.push('/dashboard');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const { isSignedIn } = await signIn({ 
        username: formData.email, 
        password: formData.password 
      });
      
      if (isSignedIn) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Error signing in:', err);
      
      // User-friendly error messages
      switch (err.name) {
        case 'UserNotFoundException':
          setError('No account found with this email address.');
          break;
        case 'NotAuthorizedException':
          setError('Incorrect password. Please try again.');
          break;
        case 'UserNotConfirmedException':
          setError('Please verify your email address before signing in.');
          break;
        case 'UserAlreadyAuthenticatedException':
          setError('You are already signed in. Redirecting...');
          setTimeout(() => router.push('/dashboard'), 1000);
          break;
        default:
          setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAlreadyAuthenticated(false);
      setCurrentUser(null);
      setFormData({ email: '', password: '' });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  // If already authenticated, show different UI
  if (isAlreadyAuthenticated) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MindTracker
                </span>
                <div className="text-xs text-gray-500">AI-Powered CBT Tracker</div>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Welcome Back!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You're already signed in as <strong>{currentUser}</strong>
            </p>
          </div>

          <div className="rounded-3xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 shadow-2xl text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Ready to continue your journey?
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="w-full h-12 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Sign Out
                <LogOut className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original login form for unauthenticated users
  return (
    <div className="min-h-dvh bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindTracker
              </span>
              <div className="text-xs text-gray-500">AI-Powered CBT Tracker</div>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue your mental wellness journey
          </p>
        </div>

        <div className="rounded-3xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSignIn}>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="h-11 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 transition-colors pl-10"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="h-11 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 transition-colors pl-10 pr-10"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link 
                href="/forgot-password" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link 
                href="/signup" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
