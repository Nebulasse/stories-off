import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const ContactsPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Контакты
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Реквизиты для пополнения счета
          </Typography>
          
          <Box sx={{ mt: 2, mb: 4 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Получатель:</strong><br />
              Станишевский Константин Сергеевич
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>Номер счета:</strong><br />
              40817810100113545191
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>Назначение платежа:</strong><br />
              Перевод средств по договору № 5461772694 Станишевский Константин Сергеевич НДС не облагается
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>БИК:</strong><br />
              044525974
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>Банк-получатель:</strong><br />
              АО "ТБанк"
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>Корр. счет:</strong><br />
              30101810145250000974
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>ИНН при необходимости:</strong><br />
              7710140679
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>КПП при необходимости:</strong><br />
              771301001
            </Typography>
          </Box>
          
          <Typography variant="body1" gutterBottom>
            <strong>Электронная почта для связи:</strong><br />
            <Link href="mailto:stor1es.offica@gmail.com">
              stor1es.offica@gmail.com
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ContactsPage; 