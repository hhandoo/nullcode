import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    Card,
    CardContent,
    CardActions,
    Box,
    Alert,
    Link,
    CircularProgress,
    Grid
} from '@mui/material';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HowToRegIcon from '@mui/icons-material/HowToReg';
const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!agreeToTerms) {
            setError('You must agree to the terms and conditions');
            return;
        }

        setLoading(true);
        try {
            await axios.post('https://your-api.com/api/register', {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
            });

            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Card variant="outlined">
                <CardContent>
                    <Grid container justifyContent="center" sx={{ mt: 2 }}>
                        <HowToRegIcon color="primary" sx={{ width: 50, height: 50 }} />
                    </Grid>
                    <Typography variant="h3" align="center" gutterBottom sx={{ mt: 2 }}>
                        Register
                    </Typography>
                    <Typography variant="body1" align="center" color="text.secondary">
                        Join us by creating your account below.
                    </Typography>

                    {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, pl: 2, pr: 2 }}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                            size="small"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                            size="small"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                            size="small"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            required
                            margin="normal"
                            size="small"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            label="Confirm Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            required
                            margin="normal"
                            size="small"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                />
                            }
                            label="I agree to the terms and conditions"
                        />
                    </Box>
                </CardContent>
                <CardActions sx={{ flexDirection: 'column', alignItems: 'center', mb: 2, px: 6 }}>
                    <Button
                        fullWidth
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        variant="contained"
                        color="primary"
                        size="small"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                    <Typography variant="body2" sx={{ mt: 4 }}>
                        Already have an account?{' '}
                        <Link component={RouterLink} to="/login">
                            Login
                        </Link>
                    </Typography>
                </CardActions>
            </Card>
        </Container>
    );
};

export default RegisterPage;
