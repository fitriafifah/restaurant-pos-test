import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import PublicTablesPage from "./PublicTablesPage"; // ganti nama impor

export default function TablesWithDetailPage() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)", // minus AppBar
        overflow: "hidden",
      }}
    >
      {/* Kolom daftar meja */}
      <Box
        sx={{
          width: 300,
          minWidth: 250,
          maxWidth: 350,
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <PublicTablesPage /> {/* ganti di sini */}
      </Box>

      {/* Kolom detail order */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          backgroundColor: "#fafafa",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
