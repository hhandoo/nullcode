// components/CommentSection.js
import  { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  TextField,
  Button,
  Box,
  Typography,
  Pagination
} from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';

const CommentSection = () => {
  const [comments, setComments] = useState([
    { id: 1, user: 'Alice', content: 'Great course!', parentId: null },
    { id: 2, user: 'Bob', content: 'Very helpful lessons.', parentId: null },
    { id: 3, user: 'Charlie', content: 'Thanks Alice!', parentId: 1 },
    { id: 4, user: 'Diana', content: 'Can you explain hooks?', parentId: null },
    { id: 5, user: 'Ethan', content: 'Hooks are tricky at first.', parentId: 4 },
    { id: 6, user: 'Frank', content: 'UseState is a good start!', parentId: 5 }
  ]);

  const [replyText, setReplyText] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
      const [collapsedReplies, setCollapsedReplies] = useState(() => {
      const initialState = {};
      comments.forEach(comment => {
      if (comment.parentId !== null) return;
      initialState[comment.id] = true;
      });
      return initialState;
      });

  const [newComment, setNewComment] = useState('');
  const [page, setPage] = useState(1);

  const commentsPerPage = 2;

  const topLevelComments = comments.filter(c => c.parentId === null);
  const paginatedTopComments = topLevelComments.slice(
    (page - 1) * commentsPerPage,
    page * commentsPerPage
  );

  const handlePageChange = (event, value) => setPage(value);
  const handleReplyToggle = (id) => setShowReplyForm(p => ({ ...p, [id]: !p[id] }));
  const handleCollapseToggle = (id) => setCollapsedReplies(p => ({ ...p, [id]: !p[id] }));
  const handleReplyChange = (id, text) => setReplyText(p => ({ ...p, [id]: text }));

  const handleReplySubmit = (parentId) => {
    const newId = comments.length + 1;
    setComments(p => [...p, {
      id: newId,
      user: 'CurrentUser',
      content: replyText[parentId],
      parentId
    }]);
    setReplyText(p => ({ ...p, [parentId]: '' }));
    setShowReplyForm(p => ({ ...p, [parentId]: false }));
  };

  const handleNewCommentSubmit = () => {
    const newId = comments.length + 1;
    setComments(p => [...p, {
      id: newId,
      user: 'CurrentUser',
      content: newComment,
      parentId: null
    }]);
    setNewComment('');
  };

  const renderReplies = (parentId, level = 1) => {
    const replies = comments.filter(c => c.parentId === parentId);
    if (!replies.length) return null;

    const isCollapsed = collapsedReplies[parentId];

    return (
      <Box ml={level * 4} mt={1}>
        <Button size="small" onClick={() => handleCollapseToggle(parentId)}>
          {isCollapsed ? 'Show Replies' : 'Hide Replies'}
        </Button>

        {!isCollapsed && replies.map(reply => (
          <Box key={reply.id} mb={2}>
            <ListItem alignItems="flex-start">
              <Avatar sx={{ mr: 2 }}>{reply.user[0]}</Avatar>
              <ListItemText primary={reply.user} secondary={reply.content} />
            </ListItem>

            <Button size="small" onClick={() => handleReplyToggle(reply.id)}>
              {showReplyForm[reply.id] ? 'Cancel' : 'Reply'}
            </Button>

            {showReplyForm[reply.id] && (
              <Box mt={1} ml={2}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Write a reply..."
                  value={replyText[reply.id] || ''}
                  onChange={(e) => handleReplyChange(reply.id, e.target.value)}
                />
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => handleReplySubmit(reply.id)}
                >
                  Submit
                </Button>
              </Box>
            )}

            {renderReplies(reply.id, level + 1)}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Discussion</Typography>

      <TextField
            label="Add a comment"
            fullWidth
            multiline
            minRows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
      />
      <Button 
      sx={{ mt: 1 }} 
      variant="contained" 
      onClick={handleNewCommentSubmit}
      startIcon={<AddCommentIcon/>}
      >
      Post Comment
      </Button>

      <List>
        {paginatedTopComments.map(comment => (
          <Box key={comment.id} mb={2}>
            <ListItem alignItems="flex-start">
              <Avatar sx={{ mr: 2 }}>{comment.user[0]}</Avatar>
              <ListItemText primary={comment.user} secondary={comment.content} />
            </ListItem>

            <Button size="small" onClick={() => handleReplyToggle(comment.id)}>
              {showReplyForm[comment.id] ? 'Cancel' : 'Reply'}
            </Button>

            {showReplyForm[comment.id] && (
              <Box mt={1} ml={2}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Write a reply..."
                  value={replyText[comment.id] || ''}
                  onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                />
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => handleReplySubmit(comment.id)}
                >
                  Submit
                </Button>
              </Box>
            )}

            {renderReplies(comment.id)}
          </Box>
        ))}
      </List>

      <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
            count={Math.ceil(topLevelComments.length / commentsPerPage)}
            page={page}
            onChange={handlePageChange}
            />
      </Box>
    </Box>
  );
};

export default CommentSection;
