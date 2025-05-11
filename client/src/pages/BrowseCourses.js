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
    { id: 1, title: "Python for Beginners", description: "Learn Python from scratch." },
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
        <Grid container justifyContent="center" sx={{ mt: 4 }} spacing={2}>

            {courses.map((course) => (
                <Grid item xs={12} sm={12} md={3} key={course.id}>
                    <ListItem disablePadding sx={{ mb: 2 }}>
                        <Card
                            variant="outlined"
                            sx={{
                                backgroundColor: getRandomThemeColor(theme.palette.mode),
                                width: "100%",
                                maxWidth: 345,

                                color: theme.palette.getContrastText(
                                    getRandomThemeColor(theme.palette.mode)
                                ),
                            }}
                        >

                            <CardActionArea>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image="https://picsum.photos/400/200"
                                    title="green iguana"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {course.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
