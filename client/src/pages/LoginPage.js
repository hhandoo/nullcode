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
    Avatar,
    Grid
} from '@mui/material';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import LockIcon from '@mui/icons-material/Lock';

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('https://your-api.com/api/login', {
                email,
                password,
            });

            const { access_token, refresh_token } = response.data;

            if (rememberMe) {
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
            } else {
                sessionStorage.setItem('access_token', access_token);
                sessionStorage.setItem('refresh_token', refresh_token);
            }

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
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
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                            size='small'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            required
                            size='small'
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                            }
                            label="Remember me"
                        />
                    </Box>
                </CardContent>
                <CardActions sx={{ flexDirection: 'column', alignItems: 'center', mb: 2, px: 6 }}>
                    <Button
                        fullWidth
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        variant="contained"
                        color="primary"
                        size='small'
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                    <Typography variant="body2" sx={{ mt: 4 }}>
                        Don’t have an account?{' '}
                        <Link component={RouterLink} to="/register">
                            Register
                        </Link>
                    </Typography>
                </CardActions>
            </Card>
        </Container>
    );
};

export default LoginPage;
