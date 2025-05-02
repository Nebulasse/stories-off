import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const Landing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      title: 'Умный диалог',
      description: 'Нейросеть анализирует контекст и генерирует уместные ответы'
    },
    {
      title: 'Три стиля',
      description: 'Выберите подходящий стиль общения: уверенный, романтичный или случайный'
    },
    {
      title: 'История диалогов',
      description: 'Сохраняйте и анализируйте историю ваших разговоров'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 159, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%)`,
        transition: 'background 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: 'center', py: 8 }}
        >
          <Typography variant="h1" sx={{ mb: 4, fontSize: { xs: '2.5rem', md: '4rem' } }}>
            StoriesOff
          </Typography>
          <Typography variant="h2" sx={{ mb: 4, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            AI-ассистент для онлайн-общения
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/app')}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.2rem',
              mb: 8,
            }}
          >
            Начать общение
          </Button>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  component={motion.div}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing; 