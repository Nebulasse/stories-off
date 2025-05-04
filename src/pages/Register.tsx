import { useState, ChangeEvent, FormEvent } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: {
            email_confirm: true
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        setVerificationSent(true);
        setShowVerification(true);
        
        // Отправляем код подтверждения
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/app`
          }
        });
        
        if (otpError) throw otpError;
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при регистрации');
    }
  };

  const handleVerification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'email'
      });
      
      if (error) throw error;
      
      if (data.user) {
        navigate('/app');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при проверке кода');
    }
  };

  const handleResendCode = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/app`
        }
      });
      
      if (error) throw error;
      
      setVerificationSent(true);
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке кода');
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
          {showVerification ? 'Подтверждение email' : 'Регистрация'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {verificationSent && !showVerification && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Код подтверждения отправлен на ваш email.
          </Alert>
        )}

        {showVerification ? (
          <form onSubmit={handleVerification}>
            <TextField
              fullWidth
              label="Код подтверждения"
              value={verificationCode}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
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
              Подтвердить
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={handleResendCode}
              size={isMobile ? "small" : "medium"}
              sx={{ mt: 1 }}
            >
              Отправить код повторно
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              margin="normal"
              size={isMobile ? "small" : "medium"}
            />

            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              margin="normal"
              size={isMobile ? "small" : "medium"}
              helperText="Минимум 6 символов"
            />

            <TextField
              fullWidth
              label="Подтвердите пароль"
              type="password"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
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
              Зарегистрироваться
            </Button>
          </form>
        )}

        <Button
          fullWidth
          variant="text"
          onClick={() => navigate('/login')}
          size={isMobile ? "small" : "medium"}
        >
          Уже есть аккаунт? Войти
        </Button>
      </Paper>
    </Box>
  );
};

export default Register; 