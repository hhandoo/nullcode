import { useState } from "react";
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
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

export default function Profile() {
    const [profilePic, setProfilePic] = useState(null);
    const [firstName, setFirstName] = useState("John");
    const [lastName, setLastName] = useState("Doe");

    const [email, setEmail] = useState("john@example.com");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [tabIndex, setTabIndex] = useState(0);

    const handleImageChange = (event) => {
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
        setTabIndex(newValue);
    };

    const handlePersonalInfoSubmit = (e) => {
        e.preventDefault();
        console.log({ firstName, lastName });
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        console.log({ email });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        console.log({ password });
    };

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 5 } }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
                    <Box position="relative">
                        <Avatar
                            src={profilePic}
                            sx={{ width: 120, height: 120 }}
                        />
                        <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="upload-photo"
                            type="file"
                            onChange={handleImageChange}
                        />
                        <label htmlFor="upload-photo">
                            <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="span"
                                sx={{ position: "absolute", bottom: 0, right: 0 }}
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
                >
                    <Tab sx={{ fontWeight: 'bold', textTransform: 'none' }} label="Personal Info" />
                    <Tab sx={{ fontWeight: 'bold', textTransform: 'none' }} label="Email" />
                    <Tab sx={{ fontWeight: 'bold', textTransform: 'none' }} label="Password" />
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
                            />
                            <TextField
                                fullWidth
                                size="small"
                                label="Last Name"
                                margin="normal"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <Button size="small" variant="contained" type="submit" sx={{ mt: 2, fontWeight: 'bold', textTransform: 'none' }}>
                                Update Info
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
                            />
                            <Button size="small" variant="contained" type="submit" sx={{ mt: 2, fontWeight: 'bold', textTransform: 'none' }}>
                                Update Email
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
                            />
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                size="small"
                                margin="normal"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button size="small" variant="contained" type="submit" sx={{ mt: 2, fontWeight: 'bold', textTransform: 'none' }}>
                                Update Password
                            </Button>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}