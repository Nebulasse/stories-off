import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useAuth } from '../contexts/AuthContext';
import { getMessages, deleteMessage, toggleFavorite } from '../services/history';
import { Message } from '../types';

type MessageWithDefaults = Message & {
  generated_response: string;
  is_favorite: boolean;
};

const History = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageWithDefaults[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageWithDefaults | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    if (!user) return;

    try {
      const { data: messages, error } = await getMessages(user.id);
      if (error) throw error;
      setMessages(messages?.map(msg => ({
        ...msg,
        generated_response: (msg as unknown as MessageWithDefaults).generated_response || '',
        is_favorite: (msg as unknown as MessageWithDefaults).is_favorite || false
      })) || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      const { error } = await deleteMessage(messageId);
      if (error) throw error;
      setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
  };

  const handleToggleFavorite = async (messageId: string) => {
    try {
      const { error } = await toggleFavorite(messageId);
      if (error) throw error;
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, is_favorite: !msg.is_favorite } : msg
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: isMobile ? 2 : 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        История сообщений
      </Typography>

      {messages.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            История пуста
          </Typography>
        </Paper>
      ) : (
        <List>
          {messages.map((message) => (
            <Paper 
              key={message.id} 
              sx={{ 
                mb: 2,
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <ListItem 
                button 
                onClick={() => setSelectedMessage(message)}
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {new Date(message.created_at).toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle2" color="primary">
                    {message.style}
                  </Typography>
                </Box>
                <ListItemText 
                  primary={message.generated_response.substring(0, 100) + '...'} 
                  sx={{ mt: 1 }}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="В избранное">
                    <IconButton 
                      edge="end" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(message.id);
                      }}
                    >
                      {message.is_favorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Копировать">
                    <IconButton 
                      edge="end" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(message.generated_response);
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton 
                      edge="end" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      <Dialog 
        open={Boolean(selectedMessage)} 
        onClose={() => setSelectedMessage(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedMessage && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Сообщение от {new Date(selectedMessage.created_at).toLocaleString()}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  {selectedMessage.style}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
                {selectedMessage.generated_response}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleCopy(selectedMessage.generated_response)}>
                Копировать
              </Button>
              <Button onClick={() => setSelectedMessage(null)}>
                Закрыть
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={showCopied}
        autoHideDuration={2000}
        onClose={() => setShowCopied(false)}
      >
        <Alert severity="success" onClose={() => setShowCopied(false)}>
          Текст скопирован
        </Alert>
      </Snackbar>

      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default History; 