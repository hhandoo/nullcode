import { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    CardActions,
    Box,
    Alert,
    Link,
    CircularProgress,
    Grid,
    IconButton
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../services/api';
import { useAuth } from '../util/AuthContext';

const { REACT_APP_LOGIN_USER } = process.env;

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        let isValid = true;

        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Enter a valid email');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validate()) return;

        setLoading(true);
        try {
            const res = await api.publicPost(
                REACT_APP_LOGIN_USER,
                { email, password },
                { withCredentials: true }
            );
            const { access } = res.data;
            login(access, true);
            navigate('/profile');
        } catch (err) {
            const msg = err?.response?.data?.detail || 'Login failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Card variant='outlined'>
                <CardContent>
                    <Grid container justifyContent="center" sx={{ mt: 2 }}>
                        <LockIcon color="primary" sx={{ width: 50, height: 50 }} />
                    </Grid>
                    <Typography variant="h3" gutterBottom align="center" sx={{ mt: 2 }}>
                        Login
                    </Typography>
                    <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 2 }}>
                        Welcome back! Please enter your credentials to access your account.
                    </Typography>

                    {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, pl: 2, pr: 2 }} noValidate>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                            size='small'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
                        />
                        <Box position="relative">
                            <TextField
                                label="Password"
                                variant="outlined"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                required
                                size='small'
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!passwordError}
                                helperText={passwordError}
                            />
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: 8,
                                    transform: 'translateY(-50%)'
                                }}
                                aria-label="toggle password visibility"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </Box>
                        <CardActions sx={{ flexDirection: 'column', alignItems: 'center', px: 0 }}>
                            <Button
                                fullWidth
                                sx={{ textTransform: 'none', fontWeight: 'bold', mt: 2 }}
                                variant="contained"
                                color="primary"
                                size='small'
                                type="submit"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </CardActions>
                    </Box>
                </CardContent>
                <CardActions sx={{ flexDirection: 'column', alignItems: 'center', mb: 2, px: 6 }}>
                    <Typography variant="body2" sx={{ mt: 4 }}>
                        Don’t have an account?{' '}
                        <Link component={RouterLink} to="/register">
                            Register
                        </Link>
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 4 }}>
                        <Link component={RouterLink} to="/login/problems-signing-in">
                            Problems Signing In ?
                        </Link>
                    </Typography>
                </CardActions>
            </Card>
        </Container>
    );
};

export default LoginPage;
