import { useState } from 'react';
import {
  Typography,
  Collapse,
  Button,
  Card,
  CardContent,
  IconButton,
  Box,
  Divider,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const DangerZone = () => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="error">
            Danger Zone
          </Typography>
          <IconButton onClick={handleToggle}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" gutterBottom color="text.secondary">
            Deleting your account is permanent and cannot be undone. The following will happen:
          </Typography>

          <ul>
            <li>
              <ListItemText primary="Any active subscriptions will be cancelled immediately." />
            </li>
            <li>
              <ListItemText primary="Access to the discussion forum will be revoked." />
            </li>
            <li>
              <ListItemText primary="All your profile data and settings will be erased." />
            </li>
            <li>
              <ListItemText primary="You will not be able to recover this account." />
            </li>
            <li>
              <ListItemText primary="Deleting account will trigger a *.zip file download which will consist of all your data with us." />
            </li>
          </ul>

          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="error" size='large' href='/delete-account'>
              Delete Account
            </Button>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default DangerZone;
