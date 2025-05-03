import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  keyframes
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Анимации
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px #00ff9d, 0 0 10px #00ff9d, 0 0 15px #00ff9d; }
  50% { box-shadow: 0 0 10px #00ff9d, 0 0 20px #00ff9d, 0 0 30px #00ff9d; }
  100% { box-shadow: 0 0 5px #00ff9d, 0 0 10px #00ff9d, 0 0 15px #00ff9d; }
`;

const Landing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      title: 'Умные ответы',
      description: 'AI-ассистент генерирует персонализированные ответы с учетом контекста и стиля общения'
    },
    {
      title: 'Разные стили',
      description: 'Выбирайте из трех стилей общения: наглый, романтичный или случайный'
    },
    {
      title: 'Анализ контекста',
      description: 'Система анализирует тон и ключевые фразы в сообщениях для более точных ответов'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Фоновые элементы */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(0,255,157,0.1) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`
        }}
      />

      {/* Фоновое изображение */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/landing-bg.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          opacity: 0.18,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero секция */}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            py: 8
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                mb: 2,
                fontSize: isMobile ? '2.5rem' : '4rem',
                fontWeight: 700
              }}
            >
              StoriesOff
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h2"
              sx={{
                mb: 4,
                fontSize: isMobile ? '1.5rem' : '2rem',
                maxWidth: '800px'
              }}
            >
              AI-ассистент для создания идеальных ответов в переписке
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.2rem',
                animation: `${glow} 2s infinite`
              }}
            >
              Начать бесплатно
            </Button>
          </motion.div>
        </Box>

        {/* Секция с особенностями */}
        <Box sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      animation: `${float} 6s infinite`,
                      animationDelay: `${index * 2}s`
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{
                          mb: 2,
                          background: theme.palette.primary.main,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing; 