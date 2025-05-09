import React, { useState } from 'react';
import { Typography, Button, Box, TextField, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BrowseCourses from './BrowseCourses';


export default function CoursesMaster() {
    const [query, setQuery] = useState('');
    const handleSearch = () => {
    };
    return (
        <Box>
            <Box
                sx={{
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
            {/* <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 2, mt: 2 }}>
                Browse Courses
            </Typography> */}
            <BrowseCourses />
        </Box>
    );
}
