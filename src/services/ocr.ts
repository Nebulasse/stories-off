import { createWorker } from 'tesseract.js';
import { cacheService } from './cache';

const generateCacheKey = async (file: File): Promise<string> => {
  // Создаем уникальный ключ на основе содержимого файла
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Функция очистки текста после OCR
function cleanOcrText(text: string): string {
  return text
    .split('\n')
    .map(line => line
      .replace(/[®©™•·•—–""«»…\[\]\(\)\{\}<>|^_+=*#@%$&~`]/g, '') // убрать мусорные символы
      .replace(/[^а-яА-Яa-zA-Z0-9 .,!?-]/g, '') // оставить только буквы, цифры и знаки препинания
      .replace(/\s{2,}/g, ' ') // убрать лишние пробелы
      .trim()
    )
    // Убираем строки, где только 1-2 буквы или мало букв вообще
    .filter(line => {
      if (line.length < 3) return false;
      if (/^[а-яА-Яa-zA-Z]{1,2}$/.test(line)) return false;
      if (!/[а-яА-Яa-zA-Z]{3,}/.test(line)) return false;
      const letters = (line.match(/[а-яА-Яa-zA-Z]/g) || []).length;
      if (letters / line.length < 0.4) return false;
      return true;
    })
    .join('\n');
}

export const recognizeText = async (file: File): Promise<string> => {
  try {
    // Генерируем ключ кэша
    const cacheKey = await generateCacheKey(file);

    // Проверяем кэш
    const cachedResult = cacheService.get<string>(cacheKey);
    if (cachedResult) {
      console.log('Using cached OCR result');
      return cachedResult;
    }

    const worker = await createWorker('rus');

    // Создаем URL из файла для Tesseract
    const imageUrl = URL.createObjectURL(file);

    // Распознаем текст
    const { data: { text } } = await worker.recognize(imageUrl);

    // Освобождаем ресурсы
    URL.revokeObjectURL(imageUrl);
    await worker.terminate();

    if (!text.trim()) {
      throw new Error('Текст не распознан');
    }

    // Очищаем текст после OCR
    const result = cleanOcrText(text.trim());

    // Сохраняем результат в кэш
    cacheService.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Ошибка при распознавании текста');
  }
}; 