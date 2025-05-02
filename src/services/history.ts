import { supabase } from '../config/supabase';
import { MessageStyle } from '../types';

interface Message {
  id: string;
  user_id: string;
  input_text: string;
  style: MessageStyle;
  responses: string[];
  created_at: string;
}

export const saveMessage = async (
  userId: string,
  inputText: string,
  style: MessageStyle,
  responses: string[]
): Promise<{ data: Message | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          user_id: userId,
          input_text: inputText,
          style,
          responses,
          is_favorite: false
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error saving message:', error);
    return { data: null, error: error as Error };
  }
};

export const getMessages = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ data: Message[]; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { data: [], error: error as Error };
  }
};

export const deleteMessage = async (
  messageId: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { error: error as Error };
  }
};

export const searchMessages = async (
  userId: string,
  query: string
): Promise<{ data: Message[]; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .textSearch('input_text', query)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error searching messages:', error);
    return { data: [], error: error as Error };
  }
};

export const toggleFavorite = async (messageId: string) => {
  try {
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('is_favorite')
      .eq('id', messageId)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('messages')
      .update({ is_favorite: !message.is_favorite })
      .eq('id', messageId);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}; 