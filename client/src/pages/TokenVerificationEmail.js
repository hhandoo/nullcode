import  { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api"; // your custom API wrapper

const { REACT_APP_VERIFY_USER } = process.env;

const VerifyEmail = () => {
  const { uidb64, token } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await api.publicGet(
          `${REACT_APP_VERIFY_USER}${uidb64}/${token}/`
        );
        setMessage(JSON.stringify(res.data));
        setSuccess(true);
      } catch (err) {
        setMessage(
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Verification failed. The link may be invalid or expired."
        );
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [uidb64, token]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 5000); // redirect after 3 seconds

      return () => clearTimeout(timer); // cleanup
    }
  }, [success, navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card variant="outlined" sx={{ p: 6 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={2}>
            {loading ? (
              <CircularProgress size={40} />
            ) : success ? (
              <CheckCircleOutline color="success" sx={{ fontSize: 48 }} />
            ) : (
              <ErrorOutline color="error" sx={{ fontSize: 48 }} />
            )}
          </Box>

          <Typography variant="h4" align="center" gutterBottom>
            {loading
              ? "Verifying..."
              : success
              ? "Verification Successful"
              : "Verification Failed"}
          </Typography>


          <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
            This page will auto navigate to the login page on successful verification in 5 seconds.
          </Typography>

          {!loading && (
            <>
              <Alert severity={success ? "success" : "error"} sx={{ mt: 2 }}>
                {message}
              </Alert>

              <Box mt={4} textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: "bold", textTransform: "none" }}
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default VerifyEmail;
