import React from 'react';
import { Box, Typography, Container, Link, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled(Box)(() => {
    const theme = useTheme();
    return ({
        color: theme.palette.secondary, // Light grey text
        padding: theme.spacing(6, 0),
        textAlign: 'center',
        marginTop: 'auto', // Push footer to bottom,
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(4, 0),
        },
    });
});

const FooterLink = styled(Link)(() => ({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',

    },
}));

const Footer = () => {
    return (
        <FooterWrapper component="footer">
            <Container maxWidth="xl">
                <Typography variant="body2" component="p" gutterBottom>
                    &copy; {new Date().getFullYear()} Null Code. All rights reserved.
                </Typography>
                <Typography variant="body2" component="p">
                    <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                    {' | '}
                    <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
                    {' | '}
                    <FooterLink href="/contact-us">Contact Us</FooterLink>
                </Typography>
                <Typography variant="body2" component="p" sx={{ mt: 2 }}>
                    Created with ❤️ in India 🇮🇳
                </Typography>
            </Container>
        </FooterWrapper>
    );
};

export default Footer;
