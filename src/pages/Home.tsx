import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Snackbar,
  Tooltip,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Link
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { MessageStyle } from '../types';
import { generateResponses } from '../services/ai';
import { recognizeText } from '../services/ocr';
import { useAuth } from '../contexts/AuthContext';
import { saveMessage } from '../services/history';
import Payment from './Payment';
import { checkGenerationLimit } from '../services/ai';
import { SelectChangeEvent } from '@mui/material';
import { submitData } from '../services/api';

interface Limits {
  remaining: number;
  total: number;
  resetTime: string;
  canGenerate: boolean;
}

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [style, setStyle] = useState<MessageStyle>('random');
  const [responses, setResponses] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const [remainingRequests] = useState(5);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [limits, setLimits] = useState<Limits | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Загрузка лимитов при монтировании компонента
  React.useEffect(() => {
    if (user) {
      loadLimits();
    }
  }, [user]);

  const loadLimits = async () => {
    if (!user) return;
    try {
      const limits = await checkGenerationLimit(user.id);
      setLimits({
        remaining: limits.remaining,
        total: limits.total,
        resetTime: limits.resetTime,
        canGenerate: limits.canGenerate
      });
    } catch (error) {
      console.error('Error loading limits:', error);
    }
  };

  // Мемоизируем обработчики для оптимизации
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  const handleStyleChange = (event: SelectChangeEvent<MessageStyle>) => {
    setStyle(event.target.value as MessageStyle);
  };

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
  }, []);

  const handleGenerate = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!limits?.canGenerate) {
      setError('Достигнут дневной лимит генераций. Обновите лимиты в 00:00 или приобретите премиум.');
      return;
    }

    if (!text.trim()) {
      setError('Пожалуйста, введите текст для генерации');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const newResponses = await generateResponses(text, style);
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setResponses(newResponses);
      
      // Отправляем данные на сервер
      if (user) {
        await submitData({
          userId: user.id,
          inputText: text,
          style,
          responses: newResponses
        });

        // Обновляем лимиты после генерации
        await loadLimits();

        await saveMessage(user.id, text, style, newResponses);
      }
    } catch (error) {
      setError('Произошла ошибка при генерации ответов');
    } finally {
      setIsGenerating(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const recognizedText = await recognizeText(file);
      setText(recognizedText);
      // Автоматически запускаем генерацию после распознавания
      handleGenerate();
    } catch (err) {
      setError('Ошибка при распознавании текста. Попробуйте другое изображение.');
    } finally {
      setIsProcessing(false);
    }
  }, [handleGenerate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1
  });

  // Мемоизируем рендер ответов
  const renderResponses = useMemo(() => (
    responses.map((response, index) => (
      <Paper 
        key={index} 
        sx={{ 
          p: isMobile ? 1.5 : 2, 
          mb: isMobile ? 1.5 : 2,
          borderRadius: isMobile ? 1 : 2,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3
          }
        }}
      >
        <Typography sx={{ fontSize: isMobile ? '14px' : '16px' }}>
          {response}
        </Typography>
        <Button
          size="small"
          onClick={() => handleCopy(response)}
          sx={{ 
            mt: 1,
            fontSize: isMobile ? '12px' : '14px'
          }}
        >
          Копировать
        </Button>
      </Paper>
    ))
  ), [responses, isMobile, handleCopy]);

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: isMobile ? 1 : 2,
      width: '100%'
    }}>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        gutterBottom 
        sx={{ 
          textAlign: 'center',
          mb: isMobile ? 2 : 3
        }}
      >
        StoriesOff
      </Typography>
      
      {!user && (
        <>
          <Alert severity="info" sx={{ mb: isMobile ? 2 : 3 }}>
            Доступно {remainingRequests} из 10 запросов в час. Авторизуйтесь для снятия ограничений.
          </Alert>
          <Payment />
        </>
      )}

      {user && limits && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Осталось генераций: {limits.remaining}/{limits.total}
          </Typography>
          <Link
            href="/payment"
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
            sx={{ 
              ml: 1,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Обновление генераций в 00:00
          </Link>
        </Box>
      )}

      <Paper
        {...getRootProps()}
        sx={{
          p: isMobile ? 2 : 3,
          mb: isMobile ? 2 : 3,
          minHeight: isMobile ? 100 : 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          borderRadius: isMobile ? 1 : 2
        }}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <CircularProgress size={isMobile ? 24 : 32} />
        ) : (
          <Typography 
            color="text.secondary" 
            align="center"
            variant={isMobile ? "body2" : "body1"}
            sx={{ px: isMobile ? 1 : 2 }}
          >
            {isDragActive
              ? 'Отпустите файл здесь...'
              : 'Перетащите изображение сюда или кликните для выбора'}
          </Typography>
        )}
      </Paper>

      <FormControl fullWidth sx={{ mb: isMobile ? 2 : 3 }}>
        <InputLabel sx={{ mt: -1 }}>Стиль общения</InputLabel>
        <Select
          value={style}
          onChange={handleStyleChange}
          disabled={isProcessing}
          sx={{
            '& .MuiSelect-select': {
              fontSize: isMobile ? '14px' : '16px'
            },
            '& .Mui-selected': {
              backgroundColor: 'rgba(33, 150, 243, 0.15) !important',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.25) !important'
              }
            }
          }}
        >
          <MenuItem value="bold">Наглый</MenuItem>
          <MenuItem value="romantic">Романтик</MenuItem>
          <MenuItem value="random">Случайный</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        rows={isMobile ? 3 : 4}
        value={text}
        onChange={handleTextChange}
        placeholder="Введите текст сообщения от девушки..."
        disabled={isProcessing}
        sx={{ 
          mb: isMobile ? 2 : 3,
          '& .MuiInputBase-root': {
            fontSize: isMobile ? '14px' : '16px'
          }
        }}
      />

      <Tooltip title={!user && remainingRequests === 0 ? 'Лимит запросов исчерпан' : ''}>
        <span>
          <Button
            fullWidth
            variant="contained"
            onClick={handleGenerate}
            disabled={isProcessing || !text.trim() || (!user && remainingRequests === 0)}
            sx={{ 
              mb: isMobile ? 2 : 3,
              py: isMobile ? 1 : 1.5,
              fontSize: isMobile ? '14px' : '16px'
            }}
          >
            {isProcessing ? <CircularProgress size={isMobile ? 20 : 24} /> : 'Сгенерировать ответы'}
          </Button>
        </span>
      </Tooltip>

      {isGenerating && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={generationProgress} 
            sx={{ 
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: 'primary.main',
                transition: 'transform 0.3s ease'
              }
            }}
          />
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ mt: 1, display: 'block', textAlign: 'center' }}
          >
            Генерация ответов... {generationProgress}%
          </Typography>
        </Box>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: isMobile ? 2 : 3,
            fontSize: isMobile ? '14px' : '16px'
          }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {renderResponses}

      <Snackbar
        open={showCopied}
        autoHideDuration={2000}
        onClose={() => setShowCopied(false)}
        message="Текст скопирован"
        sx={{
          bottom: isMobile ? 16 : 24
        }}
      />
    </Box>
  );
};

export default React.memo(Home); 