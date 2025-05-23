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
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import LockIcon from '@mui/icons-material/Lock';
import api from '../services/api';
import { setAccessToken } from '../util/tokenUtils';


const {REACT_APP_API_URL,REACT_APP_LOGIN_USER} = process.env;


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
            const res = await api.publicPost(
                REACT_APP_LOGIN_USER, 
                { email, password },  
                {withCredentials: true}
            );
            const { access } = res.data;
            setAccessToken(access, rememberMe);
            navigate('/profile');
        } catch (err) {
            setError(JSON.stringify(err.response.data));
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
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, pl: 2, pr: 2 }}>

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
