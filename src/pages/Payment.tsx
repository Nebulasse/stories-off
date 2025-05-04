import { Box, Typography, Paper, Button, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Payment = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    'Неограниченное количество генераций',
    'Доступ к тестовым стилям общения',
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
          background: '#140100',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff'
        }}
      >
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          align="center" 
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            fontWeight: 'bold',
            mb: 3
          }}
        >
          Разблокировать все функции
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
            299₽
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            в месяц
          </Typography>
        </Box>

        <List sx={{ mb: 4 }}>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CheckCircleIcon sx={{ color: '#FFD700' }} />
              </ListItemIcon>
              <ListItemText primary={feature} sx={{ color: '#ffffff' }} />
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
              background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
              color: '#000000',
              '&:hover': {
                background: 'linear-gradient(45deg, #FFA500 30%, #FF8C00 90%)',
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
              borderColor: '#FFD700',
              color: '#FFD700',
              '&:hover': {
                borderColor: '#FFA500',
                backgroundColor: 'rgba(255, 215, 0, 0.1)'
              }
            }}
          >
            Оплатить через ЮMoney
          </Button>
        </Box>

        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 3,
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          Подписка продлевается автоматически. Отменить можно в любой момент.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Payment; 