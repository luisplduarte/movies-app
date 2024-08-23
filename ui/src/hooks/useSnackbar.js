import { useState } from 'react';

/**
 * Custom hook with the logic of the snackbar (pop up) that is shown to the user with info
 * regarding the request sent to the API.
 */
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
