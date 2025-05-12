import React, { useContext } from 'react';
import { ThemeContext } from '../interface/ThemeContext';
import {
  Box, Typography, FormControl,
  Select, MenuItem, ToggleButtonGroup, ToggleButton, Divider,
} from '@mui/material';


import CodeBlock from '../component/CodeBlock';

const Settings = () => {
  const { settings, updateSettings } = useContext(ThemeContext);


  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h3" gutterBottom>Settings</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Theme Mode</Typography>
      <ToggleButtonGroup
        color="primary"
        value={settings.mode}
        exclusive
        onChange={(e, val) => val && updateSettings({ mode: val })}
        sx={{ my: 1 }}
        size='small'
      >
        <ToggleButton sx={{ textTransform: 'none' }} value="light">Light</ToggleButton>
        <ToggleButton sx={{ textTransform: 'none' }} value="dark">Dark</ToggleButton>
        <ToggleButton sx={{ textTransform: 'none' }} value="system">System</ToggleButton>
      </ToggleButtonGroup>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Color Palette</Typography>
      <ToggleButtonGroup
        color="primary"
        value={settings.color}
        exclusive
        onChange={(e, val) => val && updateSettings({ color: val })}
        sx={{ my: 1 }}
        size='small'
      >
        <ToggleButton sx={{ textTransform: 'none' }} value="blue">Blue</ToggleButton>
        <ToggleButton sx={{ textTransform: 'none' }} value="red">Red</ToggleButton>
        <ToggleButton sx={{ textTransform: 'none' }} value="green">Green</ToggleButton>
        <ToggleButton sx={{ textTransform: 'none' }} value="purple">Purple</ToggleButton>
        <ToggleButton sx={{ textTransform: 'none' }} value="orange">Orange</ToggleButton>
      </ToggleButtonGroup>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Font Family</Typography>
      <FormControl fullWidth sx={{ my: 1 }}>
        <Select
          size='small'
          variant='standard'
          value={settings.font}
          label="Font"
          onChange={(e) => updateSettings({ font: e.target.value })}
        >
          <MenuItem value="Courier New">Courier New</MenuItem>
          <MenuItem value="Arial">Arial</MenuItem>
        </Select>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      <Typography sx={{ my: 1 }} variant="h6">Your Local Storage</Typography>

      <CodeBlock code={JSON.stringify(settings)} language="json" />
    </Box>
  );
};

export default Settings;
