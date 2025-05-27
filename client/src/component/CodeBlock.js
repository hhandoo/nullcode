import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, useTheme } from '@mui/material';
import { Highlight, themes } from 'prism-react-renderer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

const CodeBlock = ({ code, language = 'python', prismTheme }) => {
    const [copied, setCopied] = useState(false);
    const muiTheme = useTheme();

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Default to dracula for dark mode, github for light mode, or use provided prismTheme
    const selectedTheme = prismTheme || (muiTheme.palette.mode === 'dark' ? themes.dracula : themes.shadesOfPurple);

    return (
        <Paper
            variant='outlined'
            elevation={3}
            sx={{
                p: 2,
                my:4
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color={muiTheme.palette.mode === 'dark' ? 'grey.400' : 'text.secondary'}>
                    {language.toUpperCase()}
                </Typography>
                <IconButton
                    onClick={handleCopy}
                    size="small"
                    color={copied ? 'success' : 'primary'}
                    title={copied ? 'Copied!' : 'Copy code'}
                >
                    {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
            </Box>
            <Highlight theme={selectedTheme} code={code.trim()} language={language}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <Box
                        component="pre"
                        sx={{
                            overflowX: 'auto',
                            p: 2,
                            borderRadius: 1,
                            backgroundColor: muiTheme.palette.mode === 'dark' ? '#282a36' : '#f5f5f5',
                            fontFamily: 'Consolas, Monaco, monospace',
                            fontSize: '0.875rem',
                            color: muiTheme.palette.mode === 'dark' ? '#f8f8f2' : 'inherit',
                            ...style,
                        }}
                    >
                        <code className={className}>
                            {tokens.map((line, i) => {
                                const { key: lineKey, ...lineProps } = getLineProps({ line, key: i });
                                return (
                                    <div key={i} {...lineProps}>
                                        {line.map((token, key) => {
                                            const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key }); // Destructure key
                                            return <span key={key} {...tokenProps} />;
                                        })}
                                    </div>
                                );
                            })}
                        </code>
                    </Box>
                )}
            </Highlight>
        </Paper>
    );
};

export default CodeBlock;