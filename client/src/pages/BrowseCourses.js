import React from "react";
import {
    Grid,
    ButtonGroup,
    Button,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

const courses = [
    { id: 1, title: "Python for Beginners", description: "Learn Python from scratch." },
    { id: 2, title: "Advanced PySpark", description: "Deep dive into PySpark architecture and tuning." },
    { id: 3, title: "React + MUI", description: "Build professional UIs using React and Material UI." },
];

export default function BrowseCourses() {
    return (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Grid item xs={12} sm={12} md={4} justifyContent="center">
                <Grid justifyContent="center">
                    <Typography variant="h6" gutterBottom>Categories</Typography>
                    <ButtonGroup variant="outlined"
                        fullWidth
                        orientation="vertical"
                        aria-label="Basic button group"
                        sx={{ width: '100%' }}>
                        <Button size="large" sx={{ textTransform: 'none', fontWeight: 'bold' }} variant="contained">One</Button>
                        <Button size="small" sx={{ textTransform: 'none', fontWeight: 'bold' }}>Two</Button>
                        <Button size="small" sx={{ textTransform: 'none', fontWeight: 'bold' }}>Three</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>

            <Grid item xs={12} sm={12} md={8}>
                <List>
                    {courses.map((course) => (
                        <ListItem key={course.id} disablePadding sx={{ mb: 2 }}>
                            <Card variant="outlined" sx={{ width: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6">{course.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {course.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>

    );
}
