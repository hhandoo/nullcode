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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successAlert, setSuccessAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
        // Fake delay to simulate backend
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const response = await api.publicPost(REACT_APP_REGISTER_USER, formData, {
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

        window.location = "/email-verification-sent";
    } catch (err) {
        setError(err.response?.data?.message || "Registration failed.");
    } finally {
        setIsSubmitting(false);
    }
    };


  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 5, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Register
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

        <form onSubmit={handleSubmit}>
          <TextField
            name="first_name"
            label="First Name"
            value={formData.first_name}
            onChange={handleChange}
            fullWidth
            size="small"
            margin="normal"
            required
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
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} />}
            >
            {isSubmitting ? "Registering..." : "Register"}
            </Button>

        </form>
      </CardContent>
    </Card>
  );
}
