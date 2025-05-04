import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, signIn, signUp, signOut } from '../services/auth';
import { supabase } from '../config/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<{ user: User | null; error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkUser();

    // Подписываемся на изменения состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as User);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user as User);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        setUser(data.user as User);
      }
      
      return { user: data.user as User, error: null };
    } catch (err: any) {
      setError(err.message);
      return { user: null, error: err.message };
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        setUser(data.user as User);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getCurrentUser = async (): Promise<{ user: User | null; error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user: data.user as User, error: null };
    } catch (err: any) {
      return { user: null, error: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    getCurrentUser: getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 