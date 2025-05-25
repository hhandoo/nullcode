import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Alert,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import api from "../services/api"; // Your axios instance

export default function EmailVerificationPage() {
  const { uid, token } = useParams();
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(
          `/api/users/verify-email/${uid}/${token}/`
        );
        setStatus("success");
        setMessage("Your email has been successfully verified!");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Verification link is invalid or expired."
        );
      }
    };

    verifyEmail();
  }, [uid, token]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center">
          {status === "loading" && <CircularProgress size={50} />}

          {status === "success" && (
            <>
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Email Verified
              </Typography>
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
              <Button variant="contained" onClick={handleGoHome}>
                Go to Home
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Verification Failed
              </Typography>
              <Alert severity="error" sx={{ mb: 2 }}>
                {message}
              </Alert>
              <Button variant="outlined" onClick={handleGoHome}>
                Return Home
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
