import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Divider,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloseIcon from "@mui/icons-material/Close";
import { red } from "@mui/material/colors";
import api from "../services/api";
import { useAuth } from "../util/AuthContext";

const { REACT_APP_DELETE_ACCOUNT } = process.env;

export default function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successAlert, setSuccessAlert] = useState(false);
  const { logout } = useAuth();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!isDeleting) {
      setOpen(false);
      setError(null);
    }
  };

  const fakeAsyncUpdate = () =>
    new Promise((resolve) => setTimeout(resolve, 1500));

 const handleDelete = async () => {
  setIsDeleting(true);
  setError(null);

  try {
    const response = await api.delete(REACT_APP_DELETE_ACCOUNT, {
      responseType: "blob",
      withCredentials: true,
    });

    // Create a blob and download
    const blob = new Blob([response.data], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const uniqueFilename = `user_data_backup_${timestamp}.zip`;
    link.setAttribute("download", uniqueFilename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    await logout();
    setOpen(false); // Close dialog
    setSuccessAlert(true); // Show success alert

    // Delay before redirect
    setTimeout(() => {
      window.location.href = "/";
    }, 3000); // 3 seconds
  } catch (err) {
    setError(err.message || "Something went wrong.");
  } finally {
    setIsDeleting(false);
  }
};


  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: red[500],
        mt: 5,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" color="error" gutterBottom>
          Danger Zone
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Collapse in={successAlert}>
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setSuccessAlert(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            Your account has been permanently deleted and your data has been downloaded.
          </Alert>
        </Collapse>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Deleting your account is <strong>permanent</strong> and cannot be undone. All your data will be erased. Please proceed with caution.
        </Typography>

        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteForeverIcon />}
          onClick={handleOpen}
          sx={{ fontWeight: "bold" }}
        >
          Delete My Account
        </Button>
      </CardContent>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: red[600] }}>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you absolutely sure? This action <strong>cannot</strong> be undone. Your account and all data will be permanently deleted.
          </DialogContentText>

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={
              isDeleting ? <CircularProgress size={18} /> : <DeleteForeverIcon />
            }
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
