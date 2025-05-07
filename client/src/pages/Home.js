import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Featured from '../component/Featured';

// Custom styled component for the hero section
const HeroSection = styled(Box)(() => {
  const theme = useTheme(); // Access the current theme

  return ({
    // Apply theme colors
    background: `linear-gradient(45deg, ${theme.palette.primary.light} 10%, ${theme.palette.secondary.main} 90%)`,
    color: theme.palette.primary.contrastText, // Use contrasting text color from the primary palette
    padding: theme.spacing(8, 0),
    textAlign: 'center',
    borderRadius: 24, // Use the theme's border radius
    marginTop: theme.spacing(8),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 0), // Reduced padding for smaller screens
      marginTop: theme.spacing(4),
    },
  });
});

const HomePageHero = () => {
  const theme = useTheme();
  return (
    <div>
      <HeroSection>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: {
                xs: '2rem',  // Smaller font size on extra-small screens (mobile)
                sm: '2.5rem', // Slightly larger on small screens
                md: '3rem',  // Original size on medium and larger screens
              },
            }}
          >
            Unlock Your Coding Potential with f"{"{"}'NULL C0d3'{"}"}"
          </Typography>
          <Typography variant="subtitle1"
            sx={{
              fontSize: {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '1rem'
              }
            }}
          >
            Master in-demand technologies like Spark, Kafka, and more through our comprehensive and practical courses.
          </Typography>
          <Button
            href="/courses"
            variant="contained"
            color="primary"
            size="large"
            sx={{ textTransform: 'none', mt: 4, fontWeight: 'bold' }}
          >
            Explore Courses
          </Button>
        </Container>
      </HeroSection>

      <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
        Featured Courses
      </Typography>

      <Featured />
    </div>
  );
};

export default HomePageHero;
