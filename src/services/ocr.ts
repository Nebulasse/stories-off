import { createWorker } from 'tesseract.js';
import { cacheService } from './cache';

const generateCacheKey = async (file: File): Promise<string> => {
  // Создаем уникальный ключ на основе содержимого файла
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

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

    const result = text.trim();

    // Сохраняем результат в кэш
    cacheService.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Ошибка при распознавании текста');
  }
}; 