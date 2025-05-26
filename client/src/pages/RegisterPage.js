import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
  Link,
  Container,
  Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from "../services/api";



const { REACT_APP_REGISTER_USER } = process.env;

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successAlert, setSuccessAlert] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.first_name.trim()) errors.first_name = "First name is required.";
    if (!formData.last_name.trim()) errors.last_name = "Last name is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    else if (!emailRegex.test(formData.email)) errors.email = "Invalid email address.";

    if (!formData.password) errors.password = "Password is required.";
    else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters.";

    if (!formData.confirm_password) errors.confirm_password = "Please confirm your password.";
    else if (formData.confirm_password !== formData.password) errors.confirm_password = "Passwords do not match.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessAlert(false);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate delay

      await api.publicPost(REACT_APP_REGISTER_USER, formData, {
        withCredentials: true,
      });

      setSuccessAlert(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
      });

      navigate("/email-verification-sent");
    } catch (err) {
      setError(JSON.stringify(err.response.data) || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card variant="outlined" sx={{ mt: 2, pl: 2, pr: 2 }}>
        <CardContent>
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <AppRegistrationIcon color="primary" sx={{ width: 50, height: 50 }} />
          </Grid>
          <Typography variant="h3" gutterBottom align="center" sx={{ mt: 2 }}>
            Register
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 2 }}>
            Welcome! Please fill in your details to create an account.
          </Typography>

          <Collapse in={successAlert}>
            <Alert
              severity="success"
              sx={{ mb: 2 }}
              action={
                <IconButton
                  size="small"
                  onClick={() => setSuccessAlert(false)}
                  color="inherit"
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              Registration successful!
            </Alert>
          </Collapse>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              name="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              size="small"
              margin="normal"
              required
              error={!!formErrors.first_name}
              helperText={formErrors.first_name}
            />
            <TextField
              name="last_name"
              label="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
              size="small"
              margin="normal"
              required
              error={!!formErrors.last_name}
              helperText={formErrors.last_name}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              size="small"
              margin="normal"
              required
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              size="small"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
            <TextField
              name="confirm_password"
              label="Confirm Password"
              type="password"
              size="small"
              value={formData.confirm_password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              error={!!formErrors.confirm_password}
              helperText={formErrors.confirm_password}
            />

            <Typography sx={{py:2}} color="text.secondary" variant="body2">* By clicking on the <b>Register</b> button, you <b>ACCEPT</b> the Terms and Conditions and the Privacy Policy.</Typography>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, textTransform: "none", fontWeight: "bold" }}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <AppRegistrationIcon />}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 4 }} textAlign="center">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login">
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
