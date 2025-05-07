import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
            </Box>
            <Typography variant="h3" color="text.primary" gutterBottom>
                404 - Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Oops! The page you're looking for doesn't exist or has been moved.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
                sx={{ textTransform: 'none' }}
            >
                Back to Home
            </Button>
        </Container>
    );
};

export default NotFoundPage;