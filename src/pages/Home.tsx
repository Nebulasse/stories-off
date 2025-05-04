import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  Link,
  Badge,
  IconButton
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { MessageStyle } from '../types';
import { generateResponses } from '../services/ai';
import { recognizeText } from '../services/ocr';
import { useAuth } from '../contexts/AuthContext';
import { saveMessage } from '../services/history';
import Payment from './Payment';
import { getUserLimits, checkGenerationLimit } from '../services/ai';
import { SelectChangeEvent } from '@mui/material';
import { submitData } from '../services/api';
import MessageIcon from '@mui/icons-material/Message';

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
  const [showLimits, setShowLimits] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Загрузка лимитов при монтировании компонента и каждую минуту
  useEffect(() => {
    if (user) {
      loadLimits();
      const interval = setInterval(loadLimits, 60000); // Обновляем каждую минуту
      return () => clearInterval(interval);
    }
  }, [user]);

  // Для отображения лимита используем только getUserLimits
  const loadLimits = async () => {
    if (!user) return;
    try {
      const limits = await getUserLimits(user.id);
      setLimits({
        remaining: limits.remaining,
        total: limits.total,
        resetTime: limits.resetTime,
        canGenerate: limits.remaining > 0 || limits.total === 999999
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

    // Проверяем лимит и уменьшаем только при генерации!
    const limitCheck = await checkGenerationLimit(user.id);
    if (!limitCheck.canGenerate) {
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
      display: 'flex',
      maxWidth: 1200,
      mx: 'auto',
      p: isMobile ? 1 : 2,
      gap: 2,
      position: 'relative'
    }}>
      {/* Основной контент */}
      <Box sx={{ 
        flex: 1,
        maxWidth: 800,
        mx: 'auto'
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

        {user && limits && showLimits && (
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

      {/* Панель лимитов */}
      {user && limits && (
        <Paper 
          elevation={3} 
          sx={{ 
            position: isMobile ? 'fixed' : 'sticky',
            top: isMobile ? 'auto' : 20,
            bottom: isMobile ? 20 : 'auto',
            right: isMobile ? 20 : 'auto',
            left: isMobile ? 'auto' : 'auto',
            p: 1,
            width: isMobile ? 'auto' : 250,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.2,
            backgroundColor: 'background.paper',
            boxShadow: 3,
            borderRadius: 2,
            minHeight: '80px',
            maxHeight: '110px',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: 1 }}>
              Лимиты
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            p: 0.3,
            borderRadius: 1,
            backgroundColor: limits.remaining > 0 ? 'rgba(33, 150, 243, 0.1)' : 'rgba(244, 67, 54, 0.1)',
            mb: 0.2
          }}>
            <MessageIcon color={limits.remaining > 0 ? 'primary' : 'error'} fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '0.95rem', lineHeight: 1 }}>
              {limits.remaining}/{limits.total}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.2, fontSize: '0.8rem', lineHeight: 1 }}>
            Обновление в 00:00 МСК
          </Typography>
          {limits.remaining === 0 && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => navigate('/payment')}
              sx={{ 
                mt: 0.3,
                fontWeight: 'bold',
                fontSize: '0.9rem',
                py: 0.5,
                minHeight: '24px',
                lineHeight: 1
              }}
            >
              Получить
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default React.memo(Home); 