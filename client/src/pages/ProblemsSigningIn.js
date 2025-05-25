import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Alert,
} from "@mui/material";
import { LockOutlined, EmailOutlined, HelpOutline } from "@mui/icons-material";

const ProblemsSigningIn = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loadingForgot, setLoadingForgot] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);

  const isValidEmail = (email) => {
    // Simple email regex validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleFakeDelay = (setLoadingFn, action) => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(""); // Clear previous error

    console.log(`${action} clicked for email:`, email);
    setLoadingFn(true);
    setTimeout(() => {
      setLoadingFn(false);
    }, 2000);
  };

  const handleForgotPassword = () => {
    handleFakeDelay(setLoadingForgot, "Forgot Password");
  };

  const handleResendVerification = () => {
    handleFakeDelay(setLoadingResend, "Resend Verification");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card variant="outlined" sx={{ p: 6 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={2}>
            <HelpOutline color="primary" sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h4" align="center" gutterBottom>
            Problems Signing In?
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" mb={4}>
            Enter your email address and choose an option below to recover access to your account.
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Email Address"
              variant="outlined"
              type="email"
              fullWidth
              size="small"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // Clear error while typing
              }}
              disabled={loadingForgot || loadingResend}
            />

            <Button
              variant="contained"
              color="primary"
              startIcon={
                loadingForgot ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <LockOutlined />
                )
              }
              onClick={handleForgotPassword}
              fullWidth
              size="small"
              disabled={
                loadingForgot || loadingResend || email.trim() === ""
              }
              sx={{ fontWeight: 'bold', textTransform: 'none' }}
            >
              {loadingForgot ? "Processing..." : "Forgot Password"}
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={
                loadingResend ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <EmailOutlined />
                )
              }
              onClick={handleResendVerification}
              fullWidth
              size="small"
              disabled={
                loadingForgot || loadingResend || email.trim() === ""
              }
              sx={{ fontWeight: 'bold', textTransform: 'none' }}
            >
              {loadingResend ? "Sending..." : "Resend Verification Email"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProblemsSigningIn;
