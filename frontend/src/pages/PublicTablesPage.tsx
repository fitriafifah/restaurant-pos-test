import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

type Table = {
  id: number;
  number: number;
  status: 'available' | 'occupied';
};

export default function PublicTablesPage() {
  const nav = useNavigate();

  const { data: tables, isLoading, error } = useQuery<Table[]>({
    queryKey: ['tables'],
    queryFn: async () => (await api.get('/tables')).data,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Gagal memuat daftar meja</Alert>;

  return (
    <div>
      <Typography variant="h5" mb={2}>Daftar Meja</Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 2,
        }}
      >
        {tables?.map((t) => (
          <Card key={t.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">Meja #{t.number}</Typography>
              <Typography>Status: {t.status}</Typography>
              <Button
                fullWidth
                disabled={t.status !== 'available'}
                onClick={async () => {
                  const res = await api.post('/orders', { table_id: t.id });
                  nav(`/orders/${res.data.id}`);
                }}
                sx={{ mt: 1 }}
              >
                {t.status === 'available' ? 'Buka Order' : 'Sedang Dipakai'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}
