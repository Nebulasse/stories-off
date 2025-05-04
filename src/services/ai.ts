import { MessageStyle } from '../types';
import { supabase } from '../config/supabase';

const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL;
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

// Кэш для хранения последних сгенерированных ответов
const responseCache = new Map<string, {
  responses: string[];
  timestamp: number;
}>();
const CACHE_SIZE = 50;
const CACHE_TTL = 1000 * 60 * 60; // 1 час

// Оптимизированные промпты для каждого стиля
const stylePrompts = {
  bold: `Ты - самоуверенный и циничный мужчина. Твой стиль общения:
- Проявляй легкую степень нарциссизма
- Создавай интригу в разговоре
- Сохраняй спокойствие и невозмутимость
- Используй короткие, четкие предложения
- Говори прямо, но с изюминкой
- Добавляй немного провокационности
Пример тона: "Ты пишешь так, будто хочешь, чтобы я тобой заинтересовался. Ну что ж, у тебя почти получилось."`,

  romantic: `Ты - романтичный и чувственный парень, который общается с девушкой. Твой стиль общения:
- Используй уместные эмодзи (1-2 на сообщение)
- Создавай легкую, игривую атмосферу
- Говори красиво, но просто
- Обращай внимание на детали в её сообщениях
- Используй комплименты, но не перебарщивай
- Добавляй элементы флирта
Пример тона: "Если бы твои сообщения были духами, их аромат сводил бы с ума — смесь остроумия, тепла и капельки шалости 🌹✨… Это твой фирменный рецепт?"`,

  random: `Ты - непредсказуемый и интересный парень, который общается с девушкой. Твой стиль общения:
- Импровизируй и будь спонтанным
- Будь креативным, но уместным
- Адаптируйся под её стиль общения
- Удивляй неожиданными поворотами
- Смешивай разные стили
- Добавляй элементы юмора
Пример тона: "Твоя аватарка излучает "я могу объяснить квантовую физику, но теряюсь, когда нужно открыть консервную банку". Кстати, ты за пингвинов, которые тайно правят миром, или это только моя теория? 🐧🔍"`,
};

const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      responseCache.delete(key);
    }
  }
};

export const generateResponses = async (
  text: string,
  style: MessageStyle
): Promise<string[]> => {
  try {
    cleanupCache();

    // Проверяем кэш
    const cacheKey = `${text}-${style}`;
    const cached = responseCache.get(cacheKey);
    if (cached) {
      return cached.responses;
    }

    // Очищаем старые записи, если кэш переполнен
    if (responseCache.size >= CACHE_SIZE) {
      const oldestKey = Array.from(responseCache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
      responseCache.delete(oldestKey);
    }

    if (!DEEPSEEK_API_URL || !DEEPSEEK_API_KEY) {
      throw new Error('API configuration is missing');
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `${stylePrompts[style]}\n\nГенерируй 3 варианта ответа. Нумеруй как "1.", "2.", "3."`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.8,
        max_tokens: 500, // Уменьшаем для ускорения
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    const variants = content
      .split(/\d+\.\s+/)
      .filter(Boolean)
      .map((text: string) => text.trim());

    if (variants.length) {
      responseCache.set(cacheKey, {
        responses: variants,
        timestamp: Date.now()
      });
      return variants;
    }

    throw new Error('No valid responses generated');
  } catch (error) {
    console.error('Error generating responses:', error);
    return [
      'Произошла ошибка при генерации ответов.',
      'Пожалуйста, попробуйте позже.',
      'Если ошибка повторяется, обратитесь в поддержку.'
    ];
  }
};

// Функция для получения лимитов пользователя
export const getUserLimits = async (userId: string): Promise<{
  remaining: number;
  total: number;
  resetTime: string;
}> => {
  try {
    // Проверяем существование записи лимитов
    const { data: existingLimit } = await supabase
      .from('user_limits')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Если записи нет, создаем её
    if (!existingLimit) {
      const { error: insertError } = await supabase
        .from('user_limits')
        .insert([{
          user_id: userId,
          daily_generations: 5,
          premium: false,
          last_reset: new Date().toISOString()
        }]);

      if (insertError) throw insertError;

      return {
        remaining: 5,
        total: 5,
        resetTime: new Date().toISOString()
      };
    }

    // Для премиум-пользователей всегда возвращаем безлимитные генерации
    if (existingLimit.premium) {
      return {
        remaining: 999999,
        total: 999999,
        resetTime: existingLimit.last_reset
      };
    }

    // Проверяем, нужно ли сбросить лимиты (по московскому времени)
    const lastReset = new Date(existingLimit.last_reset);
    const now = new Date();
    
    // Конвертируем в московское время
    const lastResetMoscow = new Date(lastReset.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
    const nowMoscow = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
    
    const isNewDay = lastResetMoscow.getDate() !== nowMoscow.getDate() || 
                     lastResetMoscow.getMonth() !== nowMoscow.getMonth() || 
                     lastResetMoscow.getFullYear() !== nowMoscow.getFullYear();

    if (isNewDay) {
      // Сбрасываем лимиты
      const { error: updateError } = await supabase
        .from('user_limits')
        .update({
          daily_generations: 5,
          last_reset: now.toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      return {
        remaining: 5,
        total: 5,
        resetTime: now.toISOString()
      };
    }

    return {
      remaining: existingLimit.daily_generations,
      total: 5,
      resetTime: existingLimit.last_reset
    };
  } catch (error) {
    console.error('Error getting user limits:', error);
    throw error;
  }
};

// Функция для проверки и обновления лимитов
export const checkGenerationLimit = async (userId: string): Promise<{
  canGenerate: boolean;
  remaining: number;
  total: number;
  resetTime: string;
}> => {
  try {
    const limits = await getUserLimits(userId);
    
    // Для премиум-пользователей всегда разрешаем генерацию
    if (limits.total === 999999) {
      return {
        canGenerate: true,
        ...limits
      };
    }
    
    if (limits.remaining <= 0) {
      return {
        canGenerate: false,
        ...limits
      };
    }

    // Уменьшаем количество оставшихся генераций только для обычных пользователей
    const { error } = await supabase
      .from('user_limits')
      .update({
        daily_generations: limits.remaining - 1
      })
      .eq('user_id', userId);

    if (error) throw error;

    return {
      canGenerate: true,
      remaining: limits.remaining - 1,
      total: limits.total,
      resetTime: limits.resetTime
    };
  } catch (error) {
    console.error('Error checking generation limit:', error);
    throw error;
  }
};

// Функция для установки премиум-статуса
export const setPremiumStatus = async (email: string): Promise<void> => {
  try {
    // Получаем ID пользователя по email из auth.users
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) throw userError;

    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    // Проверяем существование записи лимитов
    const { data: existingLimit, error: checkError } = await supabase
      .from('user_limits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 - not found
      throw checkError;
    }

    if (!existingLimit) {
      // Создаем новую запись с премиум-статусом
      const { error: insertError } = await supabase
        .from('user_limits')
        .insert([{
          user_id: user.id,
          daily_generations: 999999,
          premium: true,
          last_reset: new Date().toISOString()
        }]);

      if (insertError) throw insertError;
    } else {
      // Обновляем существующую запись
      const { error: updateError } = await supabase
        .from('user_limits')
        .update({ 
          premium: true,
          daily_generations: 999999
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    }

    console.log(`Premium status set for user ${email}`);
  } catch (error) {
    console.error('Error setting premium status:', error);
    throw error;
  }
};

// Устанавливаем премиум для указанного пользователя
setPremiumStatus('stor1es.offica@gmail.com')
  .then(() => console.log('Premium status set successfully'))
  .catch(error => console.error('Failed to set premium status:', error)); 