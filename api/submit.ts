import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../src/config/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        user_id: req.body.userId,
        input_text: req.body.inputText,
        style: req.body.style,
        responses: req.body.responses,
        is_favorite: false
      }])
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ data });
  } catch (error: any) {
    console.error('Error submitting data:', error);
    return res.status(500).json({ error: error.message });
  }
} 