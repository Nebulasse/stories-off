import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../config/supabase';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type !== 'recovery') {
      navigate('/login');
    }
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw new Error(error.message);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении пароля');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        p: isMobile ? 2 : 3,
        mt: isMobile ? 2 : 4
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 2 : 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          align="center"
          gutterBottom
        >
          Сброс пароля
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Пароль успешно обновлен! Сейчас вы будете перенаправлены на страницу входа.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Новый пароль"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            margin="normal"
            size={isMobile ? "small" : "medium"}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size={isMobile ? "medium" : "large"}
            sx={{ mt: 2 }}
          >
            Обновить пароль
          </Button>
        </form>

        <Button
          fullWidth
          variant="text"
          onClick={() => navigate('/login')}
          size={isMobile ? "small" : "medium"}
        >
          Вернуться к входу
        </Button>
      </Paper>
    </Box>
  );
};

export default ResetPassword; 