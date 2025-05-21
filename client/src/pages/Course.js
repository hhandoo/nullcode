import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Container,
    List,
    ListItemButton,
    ListItemText,
    Collapse,
    IconButton,
    ListItemIcon,
} from "@mui/material";
import { ExpandLess, ExpandMore, CheckCircle } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import BookIcon from '@mui/icons-material/Book';
import TopicIcon from '@mui/icons-material/Topic';
import Skeleton from '@mui/material/Skeleton';

const courseData = {
    course_name: 'Python Programming',
    all_lessons: [
        {
            id: 'lesson1',
            lesson: "Introduction to Python",
            topics: [
                { id: 'topic1', title: "What is Python?", content: "Python is a popular programming language..." },
                { id: 'topic2', title: "Installing Python", content: "You can install Python from python.org..." },
            ],
        },
        {
            id: 'lesson2',
            lesson: "Data Structures",
            topics: [
                { id: 'topic3', title: "Lists", content: "Lists are ordered collections..." },
                { id: 'topic4', title: "Dictionaries", content: "Dictionaries store key-value pairs..." },
            ],
        },
    ]
};

const STORAGE_KEY = "courseProgressLocal";

export default function CoursePage() {
    const theme = useTheme();

    const [expandedLessonIndex, setExpandedLessonIndex] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const [completed, setCompleted] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : { lessons: {}, topics: {} };
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    }, [completed]);
    useEffect(() => {
        for (let i = 0; i < courseData.all_lessons.length; i++) {
            const lesson = courseData.all_lessons[i];
            for (let topic of lesson.topics) {
                if (!completed.topics[topic.id]) {
                    setSelectedTopic(topic);
                    setExpandedLessonIndex(i);
                    return;
                }
            }
        }
        if (courseData.all_lessons.length > 0 && courseData.all_lessons[0].topics.length > 0) {
            setSelectedTopic(courseData.all_lessons[0].topics[0]);
            setExpandedLessonIndex(0);
        }
    }, [completed]);

    const toggleTopicCompleted = (topicId, lessonId) => {
        setCompleted(prev => {
            const newTopics = { ...prev.topics };
            if (newTopics[topicId]) {
                delete newTopics[topicId];
            } else {
                newTopics[topicId] = true;
            }

            const lesson = courseData.all_lessons.find(l => l.id === lessonId);
            const allCompleted = lesson.topics.every(t => newTopics[t.id]);
            const newLessons = { ...prev.lessons, [lessonId]: allCompleted };

            return { lessons: newLessons, topics: newTopics };
        });
    };

    const isTopicCompleted = (topicId) => !!completed.topics[topicId];
    const isLessonCompleted = (lessonId) => !!completed.lessons[lessonId];

    const handleLessonClick = (index) => {
        setExpandedLessonIndex(index === expandedLessonIndex ? null : index);
    };

    const handleTopicClick = (topic) => {
        setSelectedTopic(topic);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 5 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ mb: 6 }}>
                {courseData.course_name}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                <Box
                    sx={{
                        width: { xs: "100%", md: 320 },
                        maxHeight: { md: 600 },
                        overflowY: "auto",
                        borderRight: { md: `2px solid ${theme.palette.primary.main}`, xs: "none" },
                    }}
                >
                    <List disablePadding>
                        {courseData.all_lessons.map((lesson, lessonIndex) => (
                            <Box key={lesson.id}>
                                <ListItemButton onClick={() => handleLessonClick(lessonIndex)}>
                                    <ListItemIcon>
                                        <BookIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={lesson.lesson}
                                        slotProps={{
                                            primary: {
                                                sx: { fontWeight: 'bold' }
                                            }
                                        }}
                                    />
                                    {isLessonCompleted(lesson.id) && (
                                        <CheckCircle
                                            sx={{ color: theme.palette.success.main, mr: 1 }}
                                            fontSize="small"
                                        />
                                    )}
                                    {expandedLessonIndex === lessonIndex ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={expandedLessonIndex === lessonIndex} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {lesson.topics.map((topic) => (
                                            <ListItemButton
                                                key={topic.id}
                                                sx={{
                                                    pl: 4,
                                                    borderLeft: selectedTopic?.id === topic.id
                                                        ? `4px solid ${theme.palette.primary.main}`
                                                        : "4px solid transparent",
                                                    bgcolor: selectedTopic?.id === topic.id ? "action.selected" : "inherit",
                                                }}
                                                selected={selectedTopic?.id === topic.id}
                                                onClick={() => handleTopicClick(topic)}
                                            >
                                                <ListItemIcon>
                                                    <TopicIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={topic.title} />
                                                {isTopicCompleted(topic.id) && (
                                                    <CheckCircle
                                                        sx={{ color: theme.palette.success.main, mr: 1 }}
                                                        fontSize="small"
                                                    />
                                                )}
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                            </Box>
                        ))}
                    </List>
                </Box>
                <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                    <Box sx={{ width: '100%' }}>
                        <Skeleton animation="wave" width='100%' height={100} />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                    </Box>
                    {selectedTopic ? (
                        <>
                            <Typography color="primary" variant="h4" fontWeight="bold">
                                {selectedTopic.title}
                                <IconButton
                                    onClick={() => {
                                        const lesson = courseData.all_lessons.find(l =>
                                            l.topics.some(t => t.id === selectedTopic.id)
                                        );
                                        toggleTopicCompleted(selectedTopic.id, lesson.id);
                                    }}
                                    color={isTopicCompleted(selectedTopic.id) ? "success" : "default"}
                                    aria-label={isTopicCompleted(selectedTopic.id) ? "Completed" : "Mark as completed"}
                                >
                                    <CheckCircle />
                                </IconButton>
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
                                {selectedTopic.content}
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Please select a topic to see the content.
                        </Typography>
                    )}
                </Box>
            </Box>
        </Container>
    );
}
