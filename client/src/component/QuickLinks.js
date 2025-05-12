import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

const QuickLinks = ({ links, onLinkClick }) => {
    const [activeLink, setActiveLink] = useState(null);

    const handleLinkClick = (value) => {
        setActiveLink(value); // Set the clicked link as active
        onLinkClick(value); // Call the parent's callback
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                my: 2,
                borderRadius: 1,
                justifyContent: 'center',
            }}
        >
            {links.map((link) => (
                <Button
                    key={link.value}
                    onClick={() => handleLinkClick(link.value)}
                    variant={activeLink === link.value ? 'contained' : 'outlined'}
                    color="primary"
                    size="small"
                    sx={{ textTransform: 'capitalize', fontWeight: 'bold', }}
                >
                    {link.label}
                </Button>
            ))}
        </Box>
    );
};

export default QuickLinks;