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

const LoginController = ({ user, onLogin, onRegister, onLogout, onProfile }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!user) {
        return (
            <ButtonGroup sx={{
                my: 2, mx: 1, display: 'block',
                textTransform: 'none',
                textAlign: 'center',
            }}>
                <Button size='small' sx={{ textTransform: 'none', fontWeight: 'bold' }} variant='outlined' color="primary" onClick={onLogin}>Login</Button>
                <Button size='small' sx={{ textTransform: 'none', fontWeight: 'bold' }} variant='contained' onClick={onRegister}>Register</Button>
            </ButtonGroup>
        );
    }

    return (
        <>
            <Button
                variant='outlined'
                sx={{
                    my: 1, mx: 1,
                    textTransform: 'none',
                }}
                color="primary"
                startIcon={<Avatar sx={{ width: 28, height: 28 }}>{user.firstName[0]}</Avatar>}
                endIcon={<ArrowDropDownIcon />}
                onClick={handleMenuClick}
            >
                <Typography variant="subtitle2" noWrap>
                    {user.firstName} {user.lastName}
                </Typography>
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem
                    onClick={() => {
                        onProfile();
                        handleClose();
                    }}
                >
                    Profile
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onLogout();
                        handleClose();
                    }}
                >
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default LoginController;
