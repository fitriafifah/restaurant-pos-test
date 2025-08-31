// src/components/AppLayout.tsx
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../stores/auth';
import Notifier from './Notifier'; // snackbar global

export default function AppLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();   // panggil API logout + clear token
    nav('/login');    // redirect ke halaman login
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => nav('/')}
          >
            Restaurant POS
          </Typography>

          {/* Menu navigasi */}
          {user ? (
            <>
              {/* Khusus pelayan */}
              {user.role === 'pelayan' && (
                <Button color="inherit" onClick={() => nav('/menu')}>
                  Master Menu
                </Button>
              )}

              {/* Semua role yang login */}
              <Button color="inherit" onClick={() => nav('/orders')}>
                Orders
              </Button>

              {/* Tombol logout */}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            // Kalau belum login
            <Button color="inherit" onClick={() => nav('/login')}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Halaman isi */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Outlet /> {/* semua page akan render di sini */}
      </Box>

      {/* Snackbar global untuk error/success */}
      <Notifier />
    </Box>
  );
}
