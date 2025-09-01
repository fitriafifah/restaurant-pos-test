// src/components/AppLayout.tsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useAuth } from "../stores/auth";
import Notifier from "./Notifier";

const drawerWidth = 240;

export default function AppLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    nav("/login");
  };

  const menuItems = [
    { label: "Daftar Meja", path: "/", icon: <TableRestaurantIcon /> },
    { label: "Orders", path: "/orders", icon: <ReceiptLongIcon /> },
    ...(user?.role === "pelayan"
      ? [{ label: "Master Menu", path: "/menu", icon: <RestaurantMenuIcon /> }]
      : []),
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* HEADER */}
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => nav("/")}
          >
            🍽️ Restaurant POS
          </Typography>
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={() => nav("/login")}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      {user && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              mt: 8, // biar ga ketiban AppBar
            },
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => nav(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}

      {/* KONTEN */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${user ? drawerWidth : 0}px)`,
          mt: 8, // offset AppBar
          bgcolor: "#f9f9f9",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          p: 3,
        }}
      >
        <Outlet />
      </Box>

      <Notifier />
    </Box>
  );
}
