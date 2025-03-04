
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (isLogin) {
      // Login
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMessage(`Login failed: ${error.message}`);
      } else {
        navigate('/');
      }
    } else {
      // Sign up
      const { error } = await signUp(email, password);
      if (error) {
        setErrorMessage(`Signup failed: ${error.message}`);
      } else {
        setSuccessMessage('Signup successful! Please check your email to verify your account before logging in.');
        // Reset form and switch to login mode
        setEmail('');
        setPassword('');
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center p-4">
      <div className="glass-card rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? 'Login to Running PR Tracker' : 'Create an Account'}
        </h2>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-destructive/20 border border-destructive text-destructive rounded-md">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-600/20 border border-green-600 text-green-600 rounded-md">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none input-transition"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none input-transition"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary/80 transition-colors text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
