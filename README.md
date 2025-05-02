# StoriesOff

AI-ассистент для онлайн-общения, помогающий создавать персонализированные и уместные ответы через анализ контекста.

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/stories-off.git
cd stories-off
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корневой директории и добавьте следующие переменные:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OCR_SPACE_API_KEY=your-ocr-space-api-key
VITE_DEEPSEEK_API_KEY=your-deepseek-api-key
```

4. Запустите проект в режиме разработки:
```bash
npm run dev
```

## Технологии

- React + TypeScript
- Vite
- Material-UI
- Supabase
- Tesseract
- DeepSeek API

## Функциональность

- Регистрация и авторизация пользователей
- Загрузка скриншотов переписки
- Анализ контекста сообщений
- Генерация ответов в разных стилях
- История сообщений
- Настройки профиля

## Разработка

### Структура проекта

```
src/
  ├── components/     # Переиспользуемые компоненты
  ├── pages/         # Страницы приложения
  ├── config/        # Конфигурационные файлы
  ├── types/         # TypeScript типы
  ├── App.tsx        # Главный компонент
  └── main.tsx       # Точка входа
```

### Команды

- `npm run dev` - Запуск в режиме разработки
- `npm run build` - Сборка проекта
- `npm run preview` - Предпросмотр собранного проекта
- `npm run lint` - Проверка кода

## Лицензия

MIT 