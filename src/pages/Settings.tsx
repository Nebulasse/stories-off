import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { updatePassword, updateEmail, deleteAccount } from '../services/settings';

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { themeMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Состояния для форм
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await updatePassword(user.id, newPassword);
      if (error) throw error;

      setSuccess('Пароль успешно изменен');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await updateEmail(user.id, newEmail);
      if (error) throw error;

      setSuccess('Email успешно изменен');
      setNewEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await deleteAccount(user.id);
      if (error) throw error;

      await signOut();
      navigate('/auth');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Настройки
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Внешний вид
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={themeMode === 'dark'}
              onChange={toggleTheme}
              color="primary"
            />
          }
          label={themeMode === 'dark' ? 'Темная тема' : 'Светлая тема'}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Изменить пароль
        </Typography>
        <form onSubmit={handlePasswordChange}>
          <TextField
            fullWidth
            type="password"
            label="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            fullWidth
            type="password"
            label="Подтвердите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !newPassword || !confirmPassword}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Изменить пароль'}
          </Button>
        </form>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Изменить email
        </Typography>
        <form onSubmit={handleEmailChange}>
          <TextField
            fullWidth
            type="email"
            label="Новый email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !newEmail}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Изменить email'}
          </Button>
        </form>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="error">
          Опасная зона
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Удаление аккаунта приведет к безвозвратной потере всех данных.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setShowDeleteDialog(true)}
          disabled={loading}
        >
          Удалить аккаунт
        </Button>
      </Paper>

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Удалить аккаунт?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Это действие нельзя отменить. Все ваши данные будут удалены безвозвратно.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 