import { Container, Typography, Button, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Featured from '../component/Featured';
import Features from '../component/Features';


const HeroSection = styled(Box)(() => {
  const theme = useTheme();
  return ({
    background: `linear-gradient(45deg, ${theme.palette.primary.light} 10%, ${theme.palette.secondary.main} 90%)`,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(8, 0),
    textAlign: 'center',
    borderRadius: 12,
    marginTop: theme.spacing(8),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 0),
      marginTop: theme.spacing(4),
    },
  });
});






const featured_pages = [
  {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Apache_Spark_logo.svg/250px-Apache_Spark_logo.svg.png',
    header: 'Apache Spark Fundamentals',
    footer: 'Learn the core concepts of Apache Spark for big data processing and analysis.',
    path: '/courses'
  }, {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Apache_Spark_logo.svg/250px-Apache_Spark_logo.svg.png',
    header: 'Apache Spark Fundamentals',
    footer: 'Learn the core concepts of Apache Spark for big data processing and analysis.',
    path: '/courses'
  },
  {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Apache_Spark_logo.svg/250px-Apache_Spark_logo.svg.png',
    header: 'Apache Spark Fundamentals',
    footer: 'Learn the core concepts of Apache Spark for big data processing and analysis.',
    path: '/courses'
  },
]

const Home = (props) => {
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
                xs: '2rem',
                sm: '2.5rem',
                md: '3rem',
              },
            }}
          >
            {props.hero_header}
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
            {props.hero_footer}
          </Typography>
          <Button
            href="/courses"
            variant="contained"
            color="primary"
            size="large"
            sx={{ textTransform: 'none', mt: 4, fontWeight: 'bold' }}
          >
            Get Started
          </Button>
        </Container>
      </HeroSection>

      <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4, fontWeight: 'bold' }}>
        Featured Courses
      </Typography>

      <Featured featured_pages={featured_pages} />


      <Features />
    </div>
  );
};

export default Home;
