import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export type Style = 'bold' | 'romantic' | 'random';

const stylePrompts = {
  bold: {
    description: 'Уверенный и харизматичный мужчина',
    characteristics: [
      'Проявляет лидерские качества',
      'Говорит прямо и по делу',
      'Использует юмор и легкую иронию',
      'Демонстрирует уверенность в себе'
    ],
    examples: [
      'Твое сообщение заинтриговало меня. Давай встретимся и обсудим это лично?',
      'Мне нравится твой подход. Я знаю отличное место, где мы могли бы продолжить общение.',
      'Ты явно разбираешься в этом. Расскажи мне больше за чашкой кофе?'
    ]
  },
  romantic: {
    description: 'Чувственный и внимательный мужчина',
    characteristics: [
      'Проявляет искренний интерес',
      'Использует метафоры и поэтичные выражения',
      'Внимателен к деталям',
      'Выражает эмоции открыто'
    ],
    examples: [
      'Твои слова тронули моё сердце. Я бы хотел узнать тебя лучше...',
      'В твоих сообщениях чувствуется особенная теплота. Это очень привлекает ❤️',
      'Ты умеешь находить нужные слова. Это редкий и ценный дар 🌹'
    ]
  },
  random: {
    description: 'Спонтанный и интересный мужчина',
    characteristics: [
      'Непредсказуемый и оригинальный',
      'Использует креативные подходы',
      'Создает легкую и веселую атмосферу',
      'Предлагает неожиданные идеи'
    ],
    examples: [
      'Хей! А что если нам устроить спонтанное приключение? 🎲',
      'Знаешь, что общего между твоим сообщением и хорошим кофе? Оба бодрят и поднимают настроение! ☕',
      'Вау! Ты только что вдохновила меня на безумную идею... 🎯'
    ]
  }
};

export const generateResponses = async (
  text: string,
  style: Style
): Promise<string[]> => {
  try {
    const response = await axios.post(
      `${API_URL}/chat/completions`,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `Ты - ${stylePrompts[style].description}. 
            Характеристики твоего стиля общения:
            ${stylePrompts[style].characteristics.join(', ')}.
            
            Примеры ответов в твоем стиле:
            ${stylePrompts[style].examples.join('\n')}
            
            Сгенерируй 3 уникальных варианта ответа на сообщение от девушки, сохраняя заданный стиль общения.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        n: 3
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices.map((choice: any) => choice.message.content);
  } catch (error) {
    console.error('Error generating responses:', error);
    throw error;
  }
}; 