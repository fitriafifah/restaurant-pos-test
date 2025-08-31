import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getErrorMessage } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/auth';
import { useNotify } from '../stores/notify';
import {
  Box, Card, CardContent, Typography, Button, CircularProgress,
  Alert, ToggleButton, ToggleButtonGroup, Stack
} from '@mui/material';

type Order = {
  id: number;
  table_id: number;
  status: 'open' | 'closed';
  total: number;
  created_at: string;
};

export default function OrdersListPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const notify = useNotify();
  const qc = useQueryClient();

  const [status, setStatus] = React.useState<'open' | 'closed'>('open');

  // ===== Query daftar orders =====
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ['orders', status],
    queryFn: async () => (await api.get(`/orders?status=${status}`)).data,
  });

  // ===== Mutation close order =====
  const closeOrder = useMutation({
    mutationFn: (id: number) => api.patch(`/orders/${id}/close`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders', status] });
      notify.show('Order ditutup', 'success');
    },
    onError: (e) => notify.show(getErrorMessage(e), 'error'),
  });

  // ===== Loader & Error =====
  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Gagal memuat daftar pesanan</Alert>;

  // ===== Render =====
  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Daftar Pesanan</Typography>
        <ToggleButtonGroup
          value={status}
          exclusive
          onChange={(_, v) => v && setStatus(v)}
        >
          <ToggleButton value="open">Open</ToggleButton>
          <ToggleButton value="closed">Closed</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {(!orders || orders.length === 0) && (
        <Typography>Tidak ada order {status}</Typography>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 2,
        }}
      >
        {orders?.map((o) => (
          <Card key={o.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">Order #{o.id}</Typography>
              <Typography>Meja: {o.table_id}</Typography>
              <Typography>
                Total: Rp {o.total?.toLocaleString?.() ?? o.total}
              </Typography>
              <Typography>Status: {o.status}</Typography>

              <Stack direction="row" gap={1} mt={1}>
                <Button fullWidth onClick={() => nav(`/orders/${o.id}`)}>
                  Detail
                </Button>
                {user?.role === 'kasir' && o.status === 'open' && (
                  <Button
                    fullWidth
                    color="error"
                    variant="contained"
                    onClick={() => closeOrder.mutate(o.id)}
                  >
                    Close
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
