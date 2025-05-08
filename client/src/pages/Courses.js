import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    CardActions,
    Button,
    Box,
} from '@mui/material';

const courses = [
    {
        title: 'Learn Python from Scratch',
        description: 'Beginner-friendly Python course covering basics to OOP.',
        category: 'Programming',
    },
    {
        title: 'Master SQL for Data Analysis',
        description: 'Practical SQL course with real datasets and queries.',
        category: 'Data Engineering',
    },
    {
        title: 'Web Development with React',
        description: 'Build dynamic UIs and SPAs with modern React.',
        category: 'Frontend',
    },
    {
        title: 'Big Data with Apache Spark',
        description: 'Learn PySpark, Spark SQL, and performance tuning.',
        category: 'Big Data',
    },
    {
        title: 'JavaScript Essentials',
        description: 'Core concepts of JS for web developers and backend engineers.',
        category: 'Programming',
    },
    {
        title: 'Cloud Fundamentals with AWS',
        description: 'Start your cloud journey with AWS basics and services.',
        category: 'Cloud',
    },
];

export default function Courses() {
    return (
        <Box sx={{ py: 8, px: 3, minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
                Browse Courses
            </Typography>

            <Grid container spacing={4}>
                {courses.map((course, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Card sx={{ height: '100%', }} variant='outlined'>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {course.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {course.description}
                                </Typography>
                                <Chip label={course.category} color="primary" />
                            </CardContent>
                            <CardActions sx={{ mt: 'auto', p: 2 }}>
                                <Button variant="contained" fullWidth>
                                    Enroll Now
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
