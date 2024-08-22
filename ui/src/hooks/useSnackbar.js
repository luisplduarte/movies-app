import { useState } from 'react';

function useSnackbar() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const openSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    openSnackbar,
    closeSnackbar,
  };
}

export default useSnackbar;
