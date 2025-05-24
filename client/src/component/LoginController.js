import { useState } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    Avatar,
    Typography,
    ButtonGroup,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useAuth } from '../util/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { REACT_APP_LOGOUT_USER } = process.env;

const LoginController = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { isAuthenticated, logout, currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => navigate('/login');
    const handleRegister = () => navigate('/register');
    const handleProfile = () => navigate('/profile');

    const handleLogout = async () => {
        try {
            await api.post(REACT_APP_LOGOUT_USER);
        } catch (err) {
            console.error(JSON.stringify(err.response?.data || err.message));
        } finally {
            logout();
            setAnchorEl(null);
        }
    };

    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    // If user is not authenticated or user info not loaded, show login/register buttons
    if (!isAuthenticated || !currentUser) {
        return (
            <ButtonGroup sx={{ my: 2, mx: 1, display: 'block', textTransform: 'none', textAlign: 'center' }}>
                <Button size="small" sx={{ textTransform: 'none', fontWeight: 'bold' }} variant="outlined" color="primary" onClick={handleLogin}>
                    Login
                </Button>
                <Button size="small" sx={{ textTransform: 'none', fontWeight: 'bold' }} variant="contained" onClick={handleRegister}>
                    Register
                </Button>
            </ButtonGroup>
        );
    }

    // Safe defaults if avatar or name missing
    const avatarContent = currentUser.avatar
        ? <Avatar src={currentUser.avatar} sx={{ width: 36, height: 36 }} />
        : <Avatar sx={{ width: 36, height: 36 }}>
            {(currentUser.first_name?.[0] || '') + (currentUser.last_name?.[0] || '')}
          </Avatar>;

    return (
        <>
            <Button
                variant="outlined"
                sx={{ my: 1, mx: 1, textTransform: 'none' }}
                color="primary"
                startIcon={avatarContent}
                endIcon={<ArrowDropDownIcon />}
                onClick={handleMenuClick}
            >
                <Typography variant="subtitle2" noWrap>
                    {currentUser.first_name} {currentUser.last_name}
                </Typography>
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem
                    onClick={() => {
                        handleProfile();
                        handleClose();
                    }}
                >
                    Profile
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleLogout();
                    }}
                >
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default LoginController;
