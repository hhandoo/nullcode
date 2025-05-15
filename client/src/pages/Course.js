import React, { useState } from "react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Paper,
    useMediaQuery,
    useTheme,
    Card,
    CardActionArea
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const data = [
    {
        lesson: "Lesson 1: Introduction",
        topics: [
            {
                title: "Topic 1.1: Welcome",
                content: "Welcome to the course! This is an overview of what you’ll learn."
            },
            {
                title: "Topic 1.2: Course Overview",
                content: "In this topic, we’ll explore the structure of the course."
            }
        ]
    },
    {
        lesson: "Lesson 2: Basics",
        topics: [
            {
                title: "Topic 2.1: Syntax",
                content: "Learn the basic syntax used in this language."
            },
            {
                title: "Topic 2.2: Variables",
                content: "Understand how to declare and use variables."
            }
        ]
    }
];

const getRandomThemeColor = (mode) => {
    const base = mode === "dark" ? 30 : 200;
    const range = mode === "dark" ? 100 : 55;
    const r = Math.floor(base + Math.random() * range);
    const g = Math.floor(base + Math.random() * range);
    const b = Math.floor(base + Math.random() * range);
    return `rgb(${r}, ${g}, ${b}, 0.5)`;
};

export default function CourseContent() {
    const [selectedLesson, setSelectedLesson] = useState(0);
    const [selectedTopic, setSelectedTopic] = useState(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const lessonSidebar = (
        <Box sx={{ width: "100%" }}>
            {data.map((lesson, lessonIndex) => (
                <Accordion
                    key={lesson.lesson}
                    expanded={lessonIndex === selectedLesson}
                    onChange={() => {
                        setSelectedLesson(lessonIndex);
                        setSelectedTopic(0);
                    }}
                    sx={{ width: '100%' }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">{lesson.lesson}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={1}>
                            {lesson.topics.map((topic, topicIndex) => (
                                <Grid item xs={12} key={topic.title}>
                                    <Card
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
                                        onClick={() => setSelectedTopic(topicIndex)}
                                    >
                                        <CardActionArea>
                                            <Box sx={{ p: 1 }}>
                                                <Typography>{topic.title}</Typography>
                                            </Box>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );

    return (
        <Box sx={{ display: "flex", p: 0, width: "100%" }}>
            {isMobile ? (
                <Grid container spacing={0} sx={{ width: '100%', m: 0 }}>
                    <Grid item xs={12} sx={{ p: 2 }}>{lessonSidebar}</Grid>
                    <Grid item xs={12} sx={{ p: 2 }}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6">
                                {data[selectedLesson].topics[selectedTopic].title}
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                {data[selectedLesson].topics[selectedTopic].content}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            ) : (
                <>
                    <Box sx={{ width: 320, pr: 2 }}>{lessonSidebar}</Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6">
                                {data[selectedLesson].topics[selectedTopic].title}
                            </Typography>
                            <Typography sx={{ mt: 1 }}>
                                {data[selectedLesson].topics[selectedTopic].content}
                            </Typography>
                        </Paper>
                    </Box>
                </>
            )}
        </Box>
    );
}
