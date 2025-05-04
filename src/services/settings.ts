import { supabase } from '../config/supabase';

export const updatePassword = async (
  _userId: string,
  newPassword: string
): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteAccount = async (
  userId: string
): Promise<{ error: string | null }> => {
  try {
    // Сначала удаляем все сообщения пользователя
    const { error: messagesError } = await supabase
      .from('messages')
      .delete()
      .eq('user_id', userId);

    if (messagesError) throw messagesError;

    // Затем удаляем сам аккаунт
    const { error: userError } = await supabase.auth.admin.deleteUser(userId);

    if (userError) throw userError;

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}; 