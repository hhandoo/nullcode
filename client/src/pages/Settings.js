import React, { useContext } from 'react';
import { ThemeContext } from '../interface/ThemeContext';
import {
  Box, Typography, FormControl,
  Select, MenuItem, ToggleButtonGroup, ToggleButton, Divider
} from '@mui/material';


import CodeBlock from '../component/CodeBlock';

const Settings = () => {
  const { settings, updateSettings } = useContext(ThemeContext);


  return (
    <Box sx={{ p: 2, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h2" gutterBottom>Site Settings</Typography>
      <Divider sx={{ mb: 6 }} />

      <Typography variant="h6">Theme Mode</Typography>
      <Divider sx={{ mb: 2 }} />

      <ToggleButtonGroup
        color="primary"
        value={settings.mode}
        exclusive
        sx={{ mb: 6 }}
        onChange={(e, val) => val && updateSettings({ mode: val })}
        size='small'
      >
        <ToggleButton sx={{ textTransform: 'none', fontWeight: 'bold' }} value="light">Light</ToggleButton>
        <ToggleButton sx={{ textTransform: 'none', fontWeight: 'bold' }} value="dark">Dark</ToggleButton>
        <ToggleButton sx={{ textTransform: 'none', fontWeight: 'bold' }} value="system">System</ToggleButton>
      </ToggleButtonGroup>



      <Typography variant="h6">Color Palette</Typography>

      <Divider sx={{ mb: 2 }} />
      <FormControl sx={{ minWidth: 120 }} size="small" fullWidth>
        <Select
          variant='standard'
          labelId="color-select-label"
          value={settings.color}
          label="Color"
          sx={{ mb: 6 }}
          onChange={(e) => updateSettings({ color: e.target.value })}
        >
          <MenuItem value="blue">Blue</MenuItem>
          <MenuItem value="red">Red</MenuItem>
          <MenuItem value="green">Green</MenuItem>
          <MenuItem value="purple">Purple</MenuItem>
          <MenuItem value="orange">Orange</MenuItem>
          <MenuItem value="lightBlue">Light Blue</MenuItem>
          <MenuItem value="lightGreen">Light Green</MenuItem>
          <MenuItem value="lightPurple">Light Purple</MenuItem>
        </Select>
      </FormControl>


      <Typography variant="h6">Font Family</Typography>
      <Divider sx={{ mb: 2 }} />
      <FormControl fullWidth sx={{ mb: 6 }}>
        <Select
          size='small'
          variant='standard'
          value={settings.font}
          label="Font"
          onChange={(e) => updateSettings({ font: e.target.value })}
        >
          <MenuItem value="Courier New">Courier New</MenuItem>
          <MenuItem value="Georgia, serif">Georgia, serif</MenuItem>
          <MenuItem value="Arial, sans-serif">Arial, sans-serif</MenuItem>
          <MenuItem value="Consolas, monospace">Consolas, monospace</MenuItem>
        </Select>
      </FormControl>



      <Typography variant="h6">Your Local Storage</Typography>

      <CodeBlock code={localStorage.getItem('app-settings') ?? '// No data found'} language="json" />
      <CodeBlock code={localStorage.getItem('courseProgressLocal') ?? '// No data found'} language="json" />

    </Box>
  );
};

export default Settings;
