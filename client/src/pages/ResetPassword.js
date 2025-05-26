import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Collapse,
  IconButton,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import LockResetIcon from "@mui/icons-material/LockReset";
import api from "../services/api"; // Adjust path as needed
const { REACT_APP_RESET_PASSWORD } = process.env;

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errors = {};
    const { new_password, confirm_password } = formData;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

    if (!new_password) {
      errors.new_password = "New password is required.";
    } else if (!passwordRegex.test(new_password)) {
      errors.new_password =
        "Password must be 8+ characters, include uppercase, lowercase, number, and special character.";
    }

    if (!confirm_password) {
      errors.confirm_password = "Please confirm your password.";
    } else if (new_password !== confirm_password) {
      errors.confirm_password = "Passwords do not match.";
    }

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
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const resetUrl = `${REACT_APP_RESET_PASSWORD}${uid}/${token}/`;
      await api.publicPost(resetUrl, formData);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setServerError(JSON.stringify(err.response.data) || "Reset failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card variant="outlined" sx={{ px: 4 }}>
        <CardContent>
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <LockResetIcon color="primary" sx={{ width: 50, height: 50 }} />
          </Grid>

          <Typography variant="h4" align="center" sx={{ mt: 2 }}>
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Enter and confirm your new password below.
          </Typography>

          <Collapse in={success}>
            <Alert
              severity="success"
              sx={{ mt: 2 }}
              action={
                <IconButton
                  size="small"
                  onClick={() => setSuccess(false)}
                  color="inherit"
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              Password reset successful! Redirecting to login...
            </Alert>
          </Collapse>

          {serverError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {serverError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              name="new_password"
              label="New Password"
              type="password"
              value={formData.new_password}
              onChange={handleChange}
              fullWidth
              size="small"
              margin="normal"
              required
              error={!!formErrors.new_password}
              helperText={formErrors.new_password}
            />

            <TextField
              name="confirm_password"
              label="Confirm Password"
              type="password"
              value={formData.confirm_password}
              onChange={handleChange}
              fullWidth
              size="small"
              margin="normal"
              required
              error={!!formErrors.confirm_password}
              helperText={formErrors.confirm_password}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, textTransform: "none", fontWeight: "bold" }}
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={20} />}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
