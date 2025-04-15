
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Auth = () => {
  const { user, loading, signInWithEmailAndPassword, signUpWithEmailAndPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setAuthError(null);
  }, []);

  if (!loading && user) {
    return <Navigate to="/explore" replace />;
  }

  const handleEmailLogin = async (email: string, password: string) => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      setIsLoading(true);
      setAuthError(null);
      await signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      if (error.code === 'auth/password-login-disabled' || error.code === 'auth/operation-not-allowed') {
        setAuthError("Email/password login is not enabled. Please contact the administrator.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }
    
    try {
      setIsLoading(true);
      setAuthError(null);
      await signUpWithEmailAndPassword(email, password, name);
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        setAuthError("Email/password sign-up is not enabled. Please contact the administrator.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout error={authError}>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm onSubmit={handleEmailLogin} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="register">
          <RegisterForm onSubmit={handleSignUp} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default Auth;
