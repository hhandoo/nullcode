import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';

const features = [
    {
        icon: <SchoolIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
        title: '100% Free Learning',
        description: 'All courses are completely free. No hidden fees or subscriptions.',
    },
    {
        icon: <CodeIcon sx={{ fontSize: 40, color: '#388e3c' }} />,
        title: 'Hands-On Projects',
        description: 'Practice with real-world coding challenges and mini projects.',
    },
    {
        icon: <LanguageIcon sx={{ fontSize: 40, color: '#7b1fa2' }} />,
        title: 'Global Accessibility',
        description: 'Learn from anywhere in the world — anytime, on any device.',
    },
];

export default function Features() {
    return (
        <Box sx={{ py: 8, px: 2 }}>
            <Box textAlign="center" mb={6}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Why Choose Us?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Discover features that make this platform powerful and user-friendly.
                </Typography>
            </Box>
            <Grid container spacing={4} justifyContent="center">
                {features.map((feature, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={idx}>
                        <Card variant='outlined' sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Box mb={2}>{feature.icon}</Box>
                                <Typography variant="h6" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
