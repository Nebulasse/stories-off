import { supabase } from '../config/supabase';
import { User } from '../types';

export const signUp = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return {
      user: data.user as User,
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message
    };
  }
};

export const signIn = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      user: data.user as User,
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message
    };
  }
};

export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getCurrentUser = async (): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;

    return {
      user: user as User,
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      error: error.message
    };
  }
};

export const resetPassword = async (email: string): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}; 