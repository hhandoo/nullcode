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
import api from "../services/api";

const {
  REACT_APP_RESEND_VERIFICATION_MAIL,
  REACT_APP_REQUEST_PASSWORD_RESET
} = process.env;



const ProblemsSigningIn = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [severity, setSeverity] = useState("success");
  const [loadingForgot, setLoadingForgot] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };


  const fakeAsyncUpdate = () =>
    new Promise((resolve) => setTimeout(resolve, 1500));
 

  const handleResendVerification = async (e) => {
    e.preventDefault();
    setLoadingForgot(false);
    setLoadingResend(false);
    setLoadingResend(true)


    if (!isValidEmail(email)){
      await fakeAsyncUpdate();
      setLoadingResend(false)
      setError('Invalid Email')
      return;
    }
    else{
      try{
        const res = await api.publicPost(
          REACT_APP_RESEND_VERIFICATION_MAIL,
          { email: email.trim() }
        );
        await fakeAsyncUpdate();
        setSeverity('success');
        setError(JSON.stringify(res.data));
      }
      catch(error){
        setSeverity('error');
        setError(JSON.stringify(error.response.data));
      }
      finally{
        setLoadingResend(false)
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoadingForgot(false);
    setLoadingResend(false);
    setLoadingForgot(true)

    if (!isValidEmail(email)){
      await fakeAsyncUpdate();
      setLoadingForgot(false)
      setError('Invalid Email')
      return;
    }
    else{
      try{
        const res = await api.publicPost(
          REACT_APP_REQUEST_PASSWORD_RESET,
          { email: email.trim() }
        );
        await fakeAsyncUpdate();
        setSeverity('success');
        setError(JSON.stringify(res.data));
      }
      catch(error){
        setSeverity('error');
        setError(JSON.stringify(error.response.data));
      }
      finally{
        setLoadingForgot(false)
      }
    }
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
            {error && <Alert severity={severity}>{error}</Alert>}

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
