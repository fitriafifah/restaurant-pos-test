import { Snackbar, Alert } from '@mui/material';
import { useNotify } from '../stores/notify';

export default function Notifier() {
  const { open, message, severity, close } = useNotify();
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={close}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={close}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
