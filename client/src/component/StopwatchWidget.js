import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Stack
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import FlagIcon from "@mui/icons-material/Flag";

const formatTime = (time) => {
  const hrs = Math.floor(time / 3600);
  const mins = Math.floor((time % 3600) / 60);
  const secs = time % 60;
  return [
    hrs.toString().padStart(2, "0"),
    mins.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":");
};

const StopwatchWidget = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [running]);

  const handleStop = () => {
    setRunning(false);
    setSeconds(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps((prev) => [...prev, seconds]);
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Stack direction="column" sx={{ mt: 4 }}>
      <Typography variant="h6">Stop Watch</Typography>
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {formatTime(seconds)}
        </Typography>

        <Tooltip title={running ? "Pause" : "Start"}>
          <IconButton
            color="inherit"
            size="small"
            onClick={() => setRunning((prev) => !prev)}
          >
            {running ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Lap">
          <IconButton color="inherit" size="small" onClick={handleLap} disabled={!running}>
            <FlagIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Stop & Reset">
          <IconButton color="inherit" size="small" onClick={handleStop}>
            <StopIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Lap List as Menu */}
        {laps.length > 0 && (
          <>
            <Typography
              variant="body2"
              sx={{ cursor: "pointer", fontWeight: 500 }}
              onClick={handleMenuOpen}
            >
              Laps ({laps.length})
            </Typography>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              slotProps={{
                paper: {
                  sx: {
                    maxHeight: 300,
                    width: 180,
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                  },
                },
              }}
            >
              <Typography sx={{ px: 2, py: 1 }}>Lap Times</Typography>
              <Divider />
              {laps.map((lap, index) => (
                <MenuItem key={index}>
                  Lap {index + 1}: {formatTime(lap)}
                </MenuItem>
              ))}
            </Menu>

          </>
        )}
      </Box>
    </Stack>
  );
};

export default StopwatchWidget;
