import React from "react";
import {
    Grid,
    CardMedia,
    Typography,
    Card,
    CardContent,
    ListItem,
    CardActionArea,
    useTheme
} from "@mui/material";

const courses = [
    { id: 1, title: "Python for Beginners", description: "Learn Python from scratch. Learn Python from scratch." },
    { id: 2, title: "Advanced PySpark", description: "Deep dive into PySpark architecture and tuning." },
    { id: 3, title: "React + MUI", description: "Build professional UIs using React and Material UI." },
    { id: 4, title: "React + MUI", description: "Build professional UIs using React and Material UI." },
    { id: 5, title: "React + MUI", description: "Build professional UIs using React and Material UI." },
    { id: 6, title: "React + MUI", description: "Build professional UIs using React and Material UI." },
    { id: 7, title: "React + MUI", description: "Build professional UIs using React and Material UI." },
    { id: 8, title: "React + MUI", description: "Build professional UIs using React and Material UI." },
];

const getRandomThemeColor = (mode) => {
    const base = mode === "dark" ? 30 : 200;
    const range = mode === "dark" ? 100 : 55;
    const r = Math.floor(base + Math.random() * range);
    const g = Math.floor(base + Math.random() * range);
    const b = Math.floor(base + Math.random() * range);
    return `rgb(${r}, ${g}, ${b}, 0.5)`;
};


export default function BrowseCourses() {
    const theme = useTheme();

    return (
        <Grid container justifyContent="center" sx={{ mt: 2 }} spacing={2}>
            {courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <ListItem disablePadding sx={{ mb: 3 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                backgroundColor: getRandomThemeColor(theme.palette.mode),
                                color: theme.palette.getContrastText(
                                    getRandomThemeColor(theme.palette.mode)
                                ),
                                borderRadius: 3,
                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.25)',
                                },
                                overflow: 'hidden',
                            }}
                        >
                            <CardActionArea>
                                <CardMedia
                                    sx={{ height: 180, objectFit: 'cover' }}
                                    image={`https://picsum.photos/400/200?random=${course.id}`}
                                    title={course.title}
                                />
                                <CardContent sx={{ p: 3, minHeight: 140, display: 'flex', flexDirection: 'column' }}>
                                    <Typography
                                        variant="h5"
                                        component="div"
                                        gutterBottom
                                        sx={{
                                            fontWeight: 600,
                                            lineHeight: 1.3,
                                            mb: 2,
                                        }}
                                    >
                                        {course.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            lineHeight: 1.7,
                                            flexGrow: 1,
                                        }}
                                    >
                                        {course.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </ListItem>
                </Grid>
            ))}
        </Grid>

    );
}
