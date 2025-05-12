import React, { useState } from 'react';
import { Typography, Button, Box, TextField, Paper, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BrowseCourses from './BrowseCourses';
import CustomPagination from '../component/CustomPagination';
import Filters from '../component/Filters';
import QuickLinks from '../component/QuickLinks';

export default function CoursesMaster() {
    const [query, setQuery] = useState('');
    const handleSearch = () => {
    };
    const handleFilterChange = ({ filters, sort }) => {
        console.log('Filters applied:', filters, 'Sort:', sort);
        // Apply filters and sort to your search logic here
    };
    const sortOptions = {
        defaultOption: 'Default Sort',
        options: [
            { value: 'asc', label: 'Price: Low to High' },
            { value: 'desc', label: 'Price: High to Low' },
        ],
    };

    const filterOptions = [
        {
            key: 'category',
            label: 'Category',
            defaultOption: 'All Categories',
            options: [
                { value: 'electronics', label: 'Electronics' },
                { value: 'clothing', label: 'Clothing' },
                { value: 'books', label: 'Books' },
            ],
        },
        {
            key: 'brand',
            label: 'Brand',
            defaultOption: 'All Brands',
            options: [
                { value: 'apple', label: 'Apple' },
                { value: 'nike', label: 'Nike' },
                { value: 'penguin', label: 'Penguin' },
            ],
        },
    ];

    const quickLinks = [
        { label: 'Recommended', value: 'recommended' },
        { label: 'Featured', value: 'featured' },
        { label: 'Coding', value: 'coding' },
        { label: 'Web Development', value: 'web_development' },
        { label: 'Coding', value: 'coding' },
        { label: 'Web Development', value: 'web_development' },
        { label: 'Coding', value: 'coding' },
        { label: 'Web Development', value: 'web_development' },
        { label: 'Coding', value: 'coding' },
        { label: 'Web Development', value: 'web_development' },
        { label: 'Coding', value: 'coding' },
        { label: 'Web Development', value: 'web_development' },
    ];
    const handleLinkClick = (linkValue) => {
        console.log('Quick link clicked:', linkValue);
        // Update search or filters based on link
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
                        size='large'
                        variant="outlined"
                        label="Search Courses Here"
                        placeholder="Start Typing, Ex. Apache Spark Fundamentals, Python Basics"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}

                    />
                    <Filters
                        filterOptions={filterOptions}
                        sortOptions={sortOptions}
                        onFilterChange={handleFilterChange}
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

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }} textAlign='center'>
                Quick Links
            </Typography>
            <Divider />
            <QuickLinks links={quickLinks} onLinkClick={handleLinkClick} />
            <Divider />
            <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mt: 4 }}>
                Recommended
            </Typography>
            <BrowseCourses />

            <CustomPagination />
        </Box>
    );
}
