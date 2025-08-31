import { Card, CardContent, Typography, Button } from '@mui/material';

type Props = {
  number: number;
  status: 'available' | 'occupied';
  onClick?: () => void;
};

export default function TableCard({ number, status, onClick }: Props) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">Meja #{number}</Typography>
        <Typography>Status: {status}</Typography>
        <Button
          fullWidth
          disabled={status !== 'available'}
          onClick={onClick}
        >
          {status === 'available' ? 'Buka Order' : 'Sedang Dipakai'}
        </Button>
      </CardContent>
    </Card>
  );
}
