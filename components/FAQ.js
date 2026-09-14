import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ = () => {
  const faqItems = [
    {
      question: 'What is the Irish MAI Endowment Limited?',
      answer: 'Irish MAI Endowment Limited, also known as MAI and Tallaght Mosque, is an Islamic association based in Ireland. It is dedicated to supporting Muslims in Ireland and promoting the noble values of Islam. The association also contributes to the civilizational development of Irish society and is registered as a non-profit company limited by guarantee.'
    },
    {
      question: 'Where are you located?',
      answer: 'We are based at: Unit 1 & 2, Greenhills Business Centre, Greenhills Road, Tallaght, Dublin 24, Ireland.'
    },
    {
      question: 'What are your office and prayer hours?',
      answer: 'Office Hours: 10:00 AM – 2:00 PM daily. The mosque is open for all prayers.'
    },
    {
      question: 'What are your core values and goals?',
      answer: '• Promote Islam and its values.\n• Provide educational, intellectual, and cultural development.\n• Activate the role of Muslims in Irish society.\n• Support and enlighten Muslims in preserving their identity.\n• Foster brotherhood, love, and tolerance among Muslims.\n• Protect freedoms and human rights.\n• Collaborate with Islamic and civil society organizations to serve Irish societal interests.\n• Operate through all legitimate and legal means.'
    },
    {
      question: 'Are you a non-profit organisation?',
      answer: 'Yes, we are a registered non-profit organisation but we don\'t have a charity number.'
    },
    {
      question: 'How can I contact you?',
      answer: 'You can reach us at info@mai.ie for general inquiries, feedback, or complaints.'
    },
    {
      question: 'How can I stay updated or get involved?',
      answer: 'To receive updates about our news, events, or to volunteer with us, email info@mai.ie and ask to join our mailing list.'
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            mb: { xs: 4, md: 6 },
            color: 'text.primary',
          }}
        >
          Frequently Asked Questions
        </Typography>

        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          {faqItems.map((item, index) => (
            <Accordion
              key={index}
              sx={{
                mb: 2,
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.08)',
                '&:first-of-type': {
                  borderRadius: '12px !important',
                },
                '&:last-of-type': {
                  borderRadius: '12px !important',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{
                  '&.Mui-expanded': {
                    minHeight: 64,
                  },
                  padding: '0 24px',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  padding: '0 24px 24px',
                  '& > p': {
                    margin: 0,
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.7,
                  }}
                >
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ; 