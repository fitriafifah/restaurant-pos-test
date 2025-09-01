import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

type Table = {
  id: number;
  number: number;
  status: "available" | "occupied";
  order_id?: number;
};

export default function PublicTablesPage() {
  const nav = useNavigate();

  const { data: tables, isLoading, error } = useQuery<Table[]>({
    queryKey: ["tables"],
    queryFn: async () => (await api.get("/tables")).data,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Gagal memuat daftar meja</Alert>;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 2,
        flex: 1,
      }}
    >
      {tables?.map((t) => (
        <Card key={t.id} variant="outlined">
          <CardContent>
            <Typography variant="h6">Meja #{t.number}</Typography>
            <Typography>Status: {t.status}</Typography>
            {t.status === "available" ? (
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 1 }}
                onClick={async () => {
                  const res = await api.post("/orders", { table_id: t.id });
                  nav(`/orders/${res.data.id}`);
                }}
              >
                Buka Order
              </Button>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => nav(`/orders/${t.order_id}`)}
              >
                Lihat Order
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
