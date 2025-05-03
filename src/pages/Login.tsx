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
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../config/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { signIn, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('reset_password')) {
      setShowResetPassword(true);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await signIn(email, password);
      if (result.error) throw new Error(result.error);
      
      // Проверяем, что пользователь действительно вошел
      const { user: currentUser } = await getCurrentUser();
      if (!currentUser) {
        throw new Error('Ошибка входа в систему');
      }
      
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Ошибка при входе');
    }
  };

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password?type=recovery`
      });
      if (error) throw new Error(error.message);
      setResetEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке письма для сброса пароля');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
      navigate('/login');
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
          {showResetPassword ? 'Сброс пароля' : 'Вход'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {resetEmailSent && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Письмо для сброса пароля отправлено на ваш email.
          </Alert>
        )}

        {showResetPassword ? (
          <form onSubmit={handleUpdatePassword}>
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
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              size={isMobile ? "small" : "medium"}
            />

            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Войти
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={handleResetPassword}
              size={isMobile ? "small" : "medium"}
              sx={{ mt: 1 }}
            >
              Забыл пароль?
            </Button>
          </form>
        )}

        <Button
          fullWidth
          variant="text"
          onClick={() => navigate('/register')}
          size={isMobile ? "small" : "medium"}
        >
          Нет аккаунта? Зарегистрироваться
        </Button>
      </Paper>
    </Box>
  );
};

export default Login; 