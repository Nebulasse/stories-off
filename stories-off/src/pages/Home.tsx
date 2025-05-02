import { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { generateResponses, Style } from '../services/ai';

type Response = {
  text: string;
  style: Style;
};

const Home = () => {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<Style>('bold');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStyleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newStyle: Style | null,
  ) => {
    if (newStyle !== null) {
      setStyle(newStyle);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const generatedResponses = await generateResponses(input, style);
      const newResponses = generatedResponses.map(text => ({
        text,
        style,
      }));
      
      setResponses([...responses, ...newResponses]);
      setInput('');
    } catch (error) {
      console.error('Error generating responses:', error);
      setError('Произошла ошибка при генерации ответов. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Общение
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Введите сообщение от девушки..."
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <ToggleButtonGroup
                  value={style}
                  exclusive
                  onChange={handleStyleChange}
                  aria-label="стиль ответа"
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="bold">
                    Уверенный
                  </ToggleButton>
                  <ToggleButton value="romantic">
                    Романтичный
                  </ToggleButton>
                  <ToggleButton value="random">
                    Случайный
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !input.trim()}
                >
                  {loading ? <CircularProgress size={24} /> : 'Получить ответы'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {responses.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Варианты ответов
          </Typography>
          <Grid container spacing={2}>
            {responses.map((response, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CardContent>
                    <Typography variant="body1">
                      {response.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Стиль: {response.style}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Home; 