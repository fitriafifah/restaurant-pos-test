// src/pages/OrdersListPage.tsx
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { getErrorMessage } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../stores/auth";
import { useNotify } from "../stores/notify";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Divider,
} from "@mui/material";

type Order = {
  id: number;
  table_id: number;
  status: "open" | "closed";
  total: number;
  created_at: string;
};

export default function OrdersListPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const notify = useNotify();
  const qc = useQueryClient();

  const [status, setStatus] = React.useState<"open" | "closed">("open");

  // Query orders
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[]>({
    queryKey: ["orders", status],
    queryFn: async () => (await api.get(`/orders?status=${status}`)).data,
  });

  // Mutation close order
  const closeOrder = useMutation({
    mutationFn: (id: number) => api.patch(`/orders/${id}/close`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders", status] });
      notify.show("Order ditutup", "success");
    },
    onError: (e) => notify.show(getErrorMessage(e), "error"),
  });

  if (isLoading) return <CircularProgress />;
  if (error)
    return <Alert severity="error">Gagal memuat daftar pesanan</Alert>;

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header + filter */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        width="100%"
      >
        <Typography variant="h5" fontWeight="bold" sx={{ flex: 1, textAlign: "center" }}>
          Daftar Pesanan
        </Typography>
        <ToggleButtonGroup
          value={status}
          exclusive
          onChange={(_, v) => v && setStatus(v)}
          size="small"
        >
          <ToggleButton value="open">Open</ToggleButton>
          <ToggleButton value="closed">Closed</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Divider sx={{ mb: 2 }} />

      {/* Empty state */}
      {(!orders || orders.length === 0) && (
        <Typography textAlign="center" color="text.secondary">
          Tidak ada order {status}
        </Typography>
      )}

      {/* Grid orders */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 2,
          flex: 1,
          width: "100%",
        }}
      >
        {orders?.map((o) => (
          <Card
            key={o.id}
            variant="outlined"
            sx={{ borderRadius: 3, boxShadow: 1 }}
          >
            <CardContent>
              <Typography variant="h6">Order #{o.id}</Typography>
              <Typography variant="body2" color="text.secondary">
                Meja: {o.table_id}
              </Typography>
              <Typography mt={1} fontWeight="bold">
                Rp {o.total?.toLocaleString()}
              </Typography>
              <Typography
                variant="caption"
                color={o.status === "open" ? "success.main" : "error.main"}
              >
                {o.status.toUpperCase()}
              </Typography>

              <Stack direction="row" gap={1} mt={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => nav(`/orders/${o.id}`)}
                >
                  Detail
                </Button>
                {user?.role === "kasir" && o.status === "open" && (
                  <Button
                    fullWidth
                    color="error"
                    variant="contained"
                    onClick={() => closeOrder.mutate(o.id)}
                  >
                    Tutup
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
