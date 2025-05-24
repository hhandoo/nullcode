import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
  Paper,
  Divider,
  Tabs,
  Tab,
  Stack,
  Container,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useAuth } from "../util/AuthContext";

export default function Profile() {
  const { currentUser } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  // Loading states for each form
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Combined loading state: true if any loading is active
  const isLoading = loadingPersonal || loadingEmail || loadingPassword;

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || "");
      setLastName(currentUser.last_name || "");
      setEmail(currentUser.email || "");
      setProfilePic(currentUser.avatar || null); // Adjust key as per your data
    }
  }, [currentUser]);

  const handleImageChange = (event) => {
    if (isLoading) return; // Prevent change while loading

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTabChange = (event, newValue) => {
    if (isLoading) return; // Disable tab change while loading
    setTabIndex(newValue);
  };

  // Simulate async update with timeout
  const fakeAsyncUpdate = () =>
    new Promise((resolve) => setTimeout(resolve, 1500));

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoadingPersonal(true);
    try {
      // Add real update logic here
      console.log({ firstName, lastName });
      await fakeAsyncUpdate();
    } finally {
      setLoadingPersonal(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoadingEmail(true);
    try {
      // Add real update logic here
      console.log({ email });
      await fakeAsyncUpdate();
    } finally {
      setLoadingEmail(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setLoadingPassword(true);
    try {
      // Add real update logic here
      console.log({ password });
      await fakeAsyncUpdate();
      setPassword("");
      setConfirmPassword("");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 5 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems="center"
        >
          <Box position="relative">
            <Avatar
              src={profilePic}
              sx={{
                width: 120,
                height: 120,
                fontSize: 60,
                fontWeight: "bold",
              }}
            >
              {!profilePic && firstName && lastName
                ? `${firstName[0]}${lastName[0]}`.toUpperCase()
                : null}
            </Avatar>

            <input
              accept="image/*"
              style={{ display: "none" }}
              id="upload-photo"
              type="file"
              onChange={handleImageChange}
              disabled={isLoading} // disable input while loading
            />
            <label htmlFor="upload-photo">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                sx={{ position: "absolute", bottom: 0, right: 0 }}
                disabled={isLoading} // disable button while loading
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          // Disable tab clicks visually & functionally if loading
          sx={{
            pointerEvents: isLoading ? "none" : "auto",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          <Tab
            sx={{ fontWeight: "bold", textTransform: "none" }}
            label="Personal Info"
          />
          <Tab
            sx={{ fontWeight: "bold", textTransform: "none" }}
            label="Email"
          />
          <Tab
            sx={{ fontWeight: "bold", textTransform: "none" }}
            label="Password"
          />
        </Tabs>

        <Box sx={{ mt: 4 }}>
          {tabIndex === 0 && (
            <Box component="form" onSubmit={handlePersonalInfoSubmit}>
              <TextField
                fullWidth
                size="small"
                label="First Name"
                margin="normal"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
              />
              <TextField
                fullWidth
                size="small"
                label="Last Name"
                margin="normal"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
              />
              <Button
                size="small"
                variant="contained"
                type="submit"
                sx={{ mt: 2, fontWeight: "bold", textTransform: "none" }}
                disabled={loadingPersonal}
                startIcon={
                  loadingPersonal ? (
                    <CircularProgress color="inherit" size={20} thickness={5} />
                  ) : null
                }
              >
                {loadingPersonal ? "Updating..." : "Update Info"}
              </Button>
            </Box>
          )}

          {tabIndex === 1 && (
            <Box component="form" onSubmit={handleEmailSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                size="small"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Button
                size="small"
                variant="contained"
                type="submit"
                sx={{ mt: 2, fontWeight: "bold", textTransform: "none" }}
                disabled={loadingEmail}
                startIcon={
                  loadingEmail ? (
                    <CircularProgress color="inherit" size={20} thickness={5} />
                  ) : null
                }
              >
                {loadingEmail ? "Updating..." : "Update Email"}
              </Button>
            </Box>
          )}

          {tabIndex === 2 && (
            <Box component="form" onSubmit={handlePasswordSubmit}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                size="small"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                size="small"
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <Button
                size="small"
                variant="contained"
                type="submit"
                sx={{ mt: 2, fontWeight: "bold", textTransform: "none" }}
                disabled={loadingPassword}
                startIcon={
                  loadingPassword ? (
                    <CircularProgress color="inherit" size={20} thickness={5} />
                  ) : null
                }
              >
                {loadingPassword ? "Updating..." : "Update Password"}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
