import React, { useState } from 'react';
import {
    Grid,
    Typography,
    Button,
    Box,
    TextField,
    Paper,
    ButtonGroup
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


export default function CoursesMaster() {
    const [query, setQuery] = useState('');
    const handleSearch = () => {
    };
    return (
        <Box >

            <Box
                sx={{
                    my: 2,
                    mx: 'auto',
                    width: '100%',
                    maxWidth: { xs: '90%', sm: '1000px' },
                }}
            >

                <Paper sx={{ borderRadius: 2, px: 4, py: 8 }} variant='outlined' >
                    <Typography variant="h2" fontWeight="bold" textAlign="center">
                        Search Courses
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        textAlign="center"
                        mb={8}
                    >
                        Explore free tutorials on Python, Spark, Data Warehousing, and more — all in one place.
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Search Courses Here"
                        placeholder="Start Typing, Ex. Apache Spark Fundamentals, Python Basics"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        sx={{
                            bgcolor: 'background.paper',
                        }}
                    />
                    <Box mt={3} display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSearch}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 'bold',
                                px: 16,
                            }}
                            startIcon={<SearchIcon />}
                        >
                            Search
                        </Button>
                    </Box>

                </Paper>

            </Box>
            <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ my: 4 }}>
                Browse Courses
            </Typography>
            <Grid container spacing={2} justifyContent='center'>

                <Grid item xs={12} sm={12} md={4}>
                    <ButtonGroup
                        variant="outlined"
                        color="primary"
                        orientation="vertical"
                        fullWidth
                        sx={{ height: '100%' }}
                    >
                        <Button fullWidth variant="contained" sx={{ textTransform: 'none', fontWeight: 'bold' }}>One</Button>
                        <Button fullWidth sx={{ textTransform: 'none', fontWeight: 'bold' }}>Two</Button>
                        <Button fullWidth sx={{ textTransform: 'none', fontWeight: 'bold' }}>Three</Button>
                    </ButtonGroup>
                </Grid>

                <Grid item xs={12} sm={12} md={8}>
                    <Paper variant='outlined'>
                        <Typography >
                            asdaasdasdadadadas;lkfhaskl;fhjajkl;sfhajkl;shfjkl;ash;jshajkshjfjkasfasfsd
                        </Typography>
                    </Paper>
                </Grid>

                {/* {courses.map((course, idx) => (
                    <Grid item xs={12} sm={12} md={4} key={idx}>
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
                ))} */}
            </Grid>
        </Box>
    );
}
