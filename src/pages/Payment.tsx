import { Box, Typography, Paper, Button, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Payment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    'Неограниченное количество генераций',
    'Доступ ко всем стилям общения',
    'Приоритетная поддержка',
    'Расширенная история сообщений',
    'Дополнительные функции анализа'
  ];

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: isMobile ? 2 : 4,
      width: '100%'
    }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: isMobile ? 3 : 4,
          borderRadius: 2,
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          align="center" 
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            fontWeight: 'bold',
            mb: 3
          }}
        >
          Разблокировать все функции
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
            299₽
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            в месяц
          </Typography>
        </Box>

        <List sx={{ mb: 4 }}>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CheckCircleIcon sx={{ color: '#2196F3' }} />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
              }
            }}
          >
            Оплатить картой
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              borderColor: '#2196F3',
              color: '#2196F3',
              '&:hover': {
                borderColor: '#1976D2',
                backgroundColor: 'rgba(33, 150, 243, 0.04)'
              }
            }}
          >
            Оплатить через ЮMoney
          </Button>
        </Box>

        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 3 
          }}
        >
          Подписка продлевается автоматически. Отменить можно в любой момент.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Payment; 