import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

export default function EmailVerificationSent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Card
        elevation={4}
        sx={{
          width: "100%",
          borderRadius: 4,
          textAlign: "center",
          p: isMobile ? 2 : 4,
        }}
      >
        <CardContent>
          <MarkEmailReadRoundedIcon
            color="primary"
            sx={{ fontSize: 60, mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            Check Your Email
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            We've sent a verification link to your registered email address.
            Please check your inbox and click on the link to verify your email.
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            Didn’t receive the email? It may take a few minutes to arrive, or
            check your spam folder. You can also request a new verification
            email from your profile settings.
          </Typography>

          <Button
            variant="contained"
            startIcon={<MailOutlineIcon />}
            size={isMobile ? "medium" : "large"}
            href="/"
            sx={{ mt: 1 }}
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
