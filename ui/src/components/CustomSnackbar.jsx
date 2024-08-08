/* eslint-disable react/prop-types */
import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

/**
 * Custom Snackbar component
 * @param {boolean} open - Controls if Snackbar is open or closed
 * @param {string} message - The message to be shown
 * @param {string} severity - Success, error, etc.
 * @param {function} onClose - Function callback when Snackbar is closed
 */
function CustomSnackbar({ open, message, severity, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ backgroundColor: '#b164ff', color: 'white' }}
        iconMapping={{
          success: <CheckIcon sx={{ color: '#5dc65f' }} />,
          error: <PriorityHighIcon sx={{ color: 'red' }} />,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackbar;
