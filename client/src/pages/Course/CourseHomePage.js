import React, { useState } from 'react';
import {
  Box,
  Typography,
  CardMedia,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Rating,
  LinearProgress,
  Button,
  Avatar,
  IconButton,
  ListItemAvatar,
  Stack
} from '@mui/material';
import { LinkedIn, Twitter, Instagram } from '@mui/icons-material';

import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import TopicIcon from '@mui/icons-material/Topic';
import AddCommentIcon from '@mui/icons-material/AddComment';

import CommentSection from './CommentSection';
const CourseHomePage = () => {
  const course = {
    title: 'Learn React with MUI',
    description:'Dive into modern frontend development with "Learn React with MUI", a hands-on course designed to take your React skills to the next level. Whether youre building sleek dashboards or interactive user interfaces, this course teaches you how to harness the full power of Material-UI (MUI) — the most popular UI component library for React. Youll start with the fundamentals of React and quickly move on to crafting elegant, responsive, and accessible interfaces using MUI’s powerful component system. Along the way, youll learn how to build reusable layouts, implement dark/light themes, create dynamic forms, and integrate with APIs — all with clean, maintainable code. By the end of this course, youll not only understand how React and MUI work together, but also gain the confidence to build production-ready applications with a polished user experience.',
    image: 'https://picsum.photos/1920/800',
    author: 'John Doe',
    created: '2024-01-15',
    modified: '2025-05-01',
    views: 1245,
    rating: 4.2,
    ratingBreakdown: { 5: 40, 4: 30, 3: 20, 2: 5, 1: 5 },
    lessons: [
      {
        title: 'Intro to React',
        topics: ['What is React?', 'Setting up the environment']
      },
      {
        title: 'JSX & Components',
        topics: ['JSX Syntax', 'Functional Components', 'Class Components']
      },
      {
        title: 'State & Props',
        topics: ['Understanding State', 'Using Props']
      },
      {
        title: 'Hooks',
        topics: ['useState', 'useEffect', 'Custom Hooks']
      }
    ]
  };

  const [expandedLesson, setExpandedLesson] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [showRatingBreakdown, setShowRatingBreakdown] = useState(true);

  const handleLessonClick = (index) => {
    setExpandedLesson((prev) => (prev === index ? null : index));
  };

  const handleRatingChange = (event, newValue) => {
    setUserRating(newValue);
    // Submit rating logic here
  };

  const totalRatings = Object.values(course.ratingBreakdown).reduce((a, b) => a + b, 0);

  return (
    <Box p={2}>
      {/* Hero Section */}
      <CardMedia
        component="img"
        height="300"
        image={course.image}
        alt={course.title}
        sx={{ borderRadius: 2, mb: 2 }}
      />

      <Box mb={2}>
        <Typography variant="h4" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="body2" color='text.secondary' gutterBottom>
          {course.description}
        </Typography>
        <Box display="flex" alignItems="center" mb={1} mt={4}>
          <Avatar sx={{ width: 48, height: 48, mr: 2 }}>{course.author[0]}</Avatar>
          <Box>
            <Stack direction='row' spacing={2} sx={{
            justifyContent: "flex-start",
            alignItems: "center",
            }}>
                  <Typography variant="subtitle1">{course.author}</Typography>
                  <Box>
                        <IconButton size="small" href="https://linkedin.com" target="_blank"><LinkedIn /></IconButton>
                        <IconButton size="small" href="https://twitter.com" target="_blank"><Twitter /></IconButton>
                        <IconButton size="small" href="https://instagram.com" target="_blank"><Instagram /></IconButton>
                  </Box>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Created: {course.created} | Modified: {course.modified} | Views: {course.views}
            </Typography>
          </Box>
          
        </Box>

        <Box mt={1} display="flex" alignItems="center">
          <Rating value={course.rating} precision={0.1} readOnly />
          <Typography variant="body2" ml={1}>({course.rating.toFixed(1)})</Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="body1">Your Rating:</Typography>
          <Rating value={userRating} onChange={handleRatingChange} />
        </Box>

        <Button sx={{ mt: 2 }} onClick={() => setShowRatingBreakdown(p => !p)}>
          {showRatingBreakdown ? 'Hide' : 'Show'} Rating Breakdown
        </Button>

        <Collapse in={showRatingBreakdown}>
          <Box mt={2} sx={{ maxWidth: 400, width: '100%' }}>
            {[5, 4, 3, 2, 1].map((star) => (
            <Box
                  key={star}
                  display="flex"
                  mb={1}
                  sx={{
                  width: '100%',
                  flexWrap: 'wrap',
                  }}
            >
                  <Typography sx={{ width: 40, minWidth: 40 }}>{star} ★</Typography>
                  <LinearProgress
                  variant="determinate"
                  value={(course.ratingBreakdown[star] / totalRatings) * 100}
                  sx={{
                  flexGrow: 1,
                  mx: 1,
                  height: 10,
                  borderRadius: 5,
                  minWidth: 0,
                  }}
                  />
                  <Typography sx={{ minWidth: 24 }}>{course.ratingBreakdown[star]}</Typography>
            </Box>
            ))}
            </Box>

        </Collapse>
      </Box>

      {/* Lessons and Topics */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Course Content
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
            {course.lessons.map((lesson, index) => (
            <Box key={index}>
                  <ListItemButton
                  onClick={() => handleLessonClick(index)}
                  sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' }
                  }}
                  >
                  <ListItemAvatar>
                  <PlayLessonIcon/>
                  </ListItemAvatar>
                  <ListItemText primary={lesson.title} />
                  </ListItemButton>

                  <Collapse in={expandedLesson === index} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 4 }}>
                  {lesson.topics.map((topic, i) => (
                        <ListItemButton
                        key={i}
                        sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        '&:hover': { bgcolor: 'action.hover' }
                        }}
                        >
                        <ListItemAvatar>
                        <TopicIcon/>
                        </ListItemAvatar>
                        <ListItemText primary={topic} />
                        </ListItemButton>
                  ))}
                  </List>
                  </Collapse>
            </Box>
            ))}
            </List>
      </Box>

      {/* Comments Section */}
      <Box mt={5}>
        <CommentSection />
      </Box>
    </Box>
  );
};

export default CourseHomePage;