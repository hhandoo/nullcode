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
  InputAdornment,
  Alert,
  Grid,
  useMediaQuery, 
  useTheme
} from "@mui/material";
import { PhotoCamera, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../util/AuthContext";
import api from "../services/api";

const {
  REACT_APP_UPDATE_USER_PROFILE,
  REACT_APP_UPDATE_USER_USERNAME,
  REACT_APP_UPDATE_USER_AVATAR,
  REACT_APP_UPDATE_USER_PASSWORD,
  REACT_APP_UPDATE_USER_EMAIL
} = process.env;

export default function Profile() {
  const { currentUser, refreshUser, logout } = useAuth();
  const theme = useTheme();

  // Profile info states
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  // Password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Username update states
  const [newUsername, setNewUsername] = useState("");
  const [loadingUsername, setLoadingUsername] = useState(false);

  // Tabs & UI state
  const [tabIndex, setTabIndex] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("warning");
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // true if screen width <= 600px

  // Password visibility toggles
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Loading states for other actions
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const isLoading =
    loadingPersonal || loadingEmail || loadingPassword || loadingUsername;

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || "");
      setLastName(currentUser.last_name || "");
      setEmail(currentUser.email || "");
      setUsername(currentUser.username || "");
      setNewUsername(currentUser.username || "");
      setProfilePic(currentUser.avatar || null);
    }
  }, [currentUser]);

  const handleImageChange = async (event) => {
  if (isLoading) return;

  const file = event.target.files[0];
  if (!file) return;

  // Compress image function using canvas
  const compressImage = (file, maxSizeKB = 100) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Resize image maintaining aspect ratio
          const MAX_WIDTH = 800; // max width for resizing
          const MAX_HEIGHT = 800; // max height for resizing
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          // Quality for JPEG compression (1 is max, lower reduces size)
          let quality = 0.9;

          const compress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) return reject(new Error('Compression failed'));

                // If blob size > maxSizeKB, reduce quality and try again
                if (blob.size / 1024 > maxSizeKB && quality > 0.1) {
                  quality -= 0.1;
                  compress();
                } else {
                  resolve(blob);
                }
              },
              'image/jpeg',
              quality
            );
          };

          compress();
        };

        img.onerror = (err) => reject(err);
      };

      reader.onerror = (err) => reject(err);
    });
  };

  try {
    setLoadingAvatar(true);
    const compressedBlob = await compressImage(file, 100); // compress to ~100 KB

    // Create a new File from blob for upload (keeping original filename)
    const compressedFile = new File([compressedBlob], file.name, {
      type: 'image/jpeg',
    });

    // Preview the compressed image locally
    const previewUrl = URL.createObjectURL(compressedFile);
    setProfilePic(previewUrl);

    // Upload the compressed file (adjust your API URL & fieldName here)
    const response = await api.upload(REACT_APP_UPDATE_USER_AVATAR, compressedFile, 'avatar');
    await fakeAsyncUpdate();
    await refreshUser();
    await fakeAsyncUpdate();
  } catch (error) {
    console.error('Error compressing or uploading image', error);
  } finally {
      setLoadingAvatar(false);
    }
};


  const handleTabChange = (event, newValue) => {
    if (isLoading) return;
    setAlertMessage("");
    setAlertSeverity("warning");
    setTabIndex(newValue);
  };

  const fakeAsyncUpdate = () =>
    new Promise((resolve) => setTimeout(resolve, 1500));

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    if (
      firstName === currentUser.first_name &&
      lastName === currentUser.last_name
    ) {
      setAlertMessage("No changes detected in personal information.");
      setAlertSeverity("info");
      return;
    }

    setAlertMessage("");
    setLoadingPersonal(true);
    try {
      await api.put(
        REACT_APP_UPDATE_USER_PROFILE,
        { first_name: firstName, last_name: lastName },
        { withCredentials: true }
      );
      await fakeAsyncUpdate();
      await refreshUser();
      setAlertMessage("Personal information updated successfully.");
      setAlertSeverity("success");
    } catch {
      setAlertMessage("Failed to update personal information.");
      setAlertSeverity("error");
    } finally {
      setLoadingPersonal(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (email === currentUser.email) {
      setAlertMessage("No changes detected in email.");
      setAlertSeverity("info");
      return;
    }

    setAlertMessage("");
    setLoadingEmail(true);
    try {

      await api.post(
        REACT_APP_UPDATE_USER_EMAIL,
        { new_email: email.trim() },
        { withCredentials: true }
      );
      await fakeAsyncUpdate(); // Replace with real API call
      setAlertMessage("Email update request sent successfully.");
      setAlertSeverity("success");
      await logout();
      await fakeAsyncUpdate();
    } catch {
      setAlertMessage("Failed to update email.");
      setAlertSeverity("error");
    } finally {
      setLoadingEmail(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage("");

    if (newPassword !== confirmNewPassword) {
      setAlertMessage("New passwords do not match.");
      setAlertSeverity("error");
      return;
    }
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setAlertMessage("Please fill in all password fields.");
      setAlertSeverity("error");
      return;
    }

    setLoadingPassword(true);
    try {
      await api.put(
        REACT_APP_UPDATE_USER_PASSWORD,
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        },
        { withCredentials: true }
      );
      await fakeAsyncUpdate();
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setAlertMessage("Password changed successfully. You will be logged out.");
      setAlertSeverity("success");
      
      await logout();
      await fakeAsyncUpdate();
    } catch {
      setAlertMessage("Error changing password.");
      setAlertSeverity("error");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage("");
    
    if (!newUsername.trim()) {
      setAlertMessage("Username cannot be empty.");
      setAlertSeverity("error");
      return;
    }
    if (newUsername === username) {
      setAlertMessage("No changes detected in username.");
      setAlertSeverity("info");
      return;
    }
    
    setLoadingUsername(true);
    await fakeAsyncUpdate();
    try {
      await api.put(
        REACT_APP_UPDATE_USER_USERNAME,
        { username: newUsername.trim() },
        { withCredentials: true }
      );
      
      setUsername(newUsername.trim());
      setAlertMessage("Username updated successfully.");
      setAlertSeverity("success");
      await refreshUser();
    } catch (error) {
      setAlertMessage(
        error.response?.data?.username?.[0] ||
          "Failed to update username. Try another one."
      );
      setAlertSeverity("error");
    } finally {
      setLoadingUsername(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 5 } }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          <Grid
            item
            xs={12}
            sm={"auto"}
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Avatar
              src={profilePic}
              sx={{ width: 120, height: 120, fontSize: 60, fontWeight: "bold" }}
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
              disabled={isLoading}
            />
            <label htmlFor="upload-photo">
              {loadingAvatar ? (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "background.paper",
                    borderRadius: "50%",
                    p: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  sx={{ position: "absolute", bottom: 0, right: 0 }}
                  disabled={isLoading}
                >
                  <PhotoCamera />
                </IconButton>
              )}
            </label>
          </Grid>

          <Grid
            item
            xs={12}
            sm
            sx={{ textAlign: { xs: "center", sm: "left" }, mt: { xs: 1, sm: 0 } }}
          >
            <Typography variant="h5" fontWeight="bold" noWrap>
              {firstName} {lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {email}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              @{username}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {alertMessage && (
          <Alert severity={alertSeverity} sx={{ mb: 2 }}>
            {alertMessage}
          </Alert>
        )}

        <Tabs
      value={tabIndex}
      onChange={handleTabChange}
      variant={isMobile ? "scrollable" : "fullWidth"}
      scrollButtons={isMobile ? "auto" : false}
      textColor="primary"
      indicatorColor="primary"
      sx={{
        pointerEvents: isLoading ? "none" : "auto",
        opacity: isLoading ? 0.6 : 1,
        mb: 3,
      }}
    >
      {["Personal Info", "Username", "Email", "Password"].map((label) => (
        <Tab
          key={label}
          label={label}
          sx={{
            fontWeight: "bold",
            textTransform: "none",
            fontSize: isMobile ? "0.85rem" : "1rem",
            paddingY: isMobile ? 1.5 : 1,
          }}
        />
      ))}
    </Tabs>

        {/* Personal Info Form */}
        {tabIndex === 0 && (
          <Box
            component="form"
            onSubmit={handlePersonalInfoSubmit}
            noValidate
            autoComplete="off"
          >
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  size="small"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  size="small"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>


            <Stack
              direction="row"
              justifyContent="center"
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{textTransform:'none', fontWeight:'bold'}}
                disabled={loadingPersonal || isLoading}
                startIcon={loadingPersonal && <CircularProgress size={18} />}
              >
                Update
              </Button>
            </Stack>
          </Box>
        )}

        {/* Username Form */}
        {tabIndex === 1 && (
          <Box component="form" onSubmit={handleUsernameSubmit} noValidate>
            <TextField
              label="New Username"
              fullWidth
              size="small"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              disabled={loadingUsername || isLoading}
              autoComplete="username"
            />

            <Stack
              direction="row"
              justifyContent="center"
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{textTransform:'none', fontWeight:'bold'}}
                disabled={loadingUsername || isLoading}
                startIcon={loadingUsername && <CircularProgress size={18} />}
              >
                Change Username
              </Button>
            </Stack>
          </Box>
        )}

        {/* Email Form */}
        {tabIndex === 2 && (
          <Box component="form" onSubmit={handleEmailSubmit} noValidate>
            <TextField
              label="Email"
              fullWidth
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loadingEmail || isLoading}
              type="email"
              autoComplete="email"
            />

            <Stack
              direction="row"
              justifyContent="center"
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{textTransform:'none', fontWeight:'bold'}}
                disabled={loadingEmail || isLoading}
                startIcon={loadingEmail && <CircularProgress size={18} />}
              >
                Update Email
              </Button>
            </Stack>
          </Box>
        )}

        {/* Password Form */}
        {tabIndex === 3 && (
          <Box component="form" onSubmit={handlePasswordSubmit} noValidate>
            <TextField
              label="Old Password"
              type={showOldPassword ? "text" : "password"}
              fullWidth
              size="small"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={loadingPassword || isLoading}
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        edge="end"
                        disabled={loadingPassword || isLoading}
                        aria-label={showOldPassword ? "Hide password" : "Show password"}
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box mt={2} />
            <TextField
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              size="small"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loadingPassword || isLoading}
              autoComplete="new-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                        disabled={loadingPassword || isLoading}
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box mt={2} />
            <TextField
              label="Confirm New Password"
              type={showConfirmNewPassword ? "text" : "password"}
              fullWidth
              size="small"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              disabled={loadingPassword || isLoading}
              autoComplete="new-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmNewPassword(!showConfirmNewPassword)
                        }
                        edge="end"
                        disabled={loadingPassword || isLoading}
                        aria-label={
                          showConfirmNewPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Stack
              direction="row"
              justifyContent="center"
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{textTransform:'none', fontWeight:'bold'}}
                disabled={loadingPassword || isLoading}
                startIcon={loadingPassword && <CircularProgress size={18} />}
              >
                Change Password
              </Button>
            </Stack>
          </Box>
        )}

        <Divider  sx={{mt:4}}/>
      </Paper>
    </Container>
  );
}
