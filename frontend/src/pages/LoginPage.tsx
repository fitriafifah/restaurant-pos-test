import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../lib/api';
import { useAuth } from '../stores/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Card, CardContent } from '@mui/material';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as any;

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Form) => {
    const res = await api.post('/login', values); // { token, user:{id,name,role} }
    login({
      user: res.data.user,
      access_token: res.data.access_token,
    });
    if (loc.state?.openForTable) {
      nav(`/orders/new?table=${loc.state.openForTable}`);
    } else {
      nav('/dashboard');
    }
  };

  return (
    <Box
    sx={{
      flex: 1, // isi semua ruang kosong yang disediakan AppLayout
      display: "flex",
      alignItems: "center", // center secara vertikal
      justifyContent: "center", // center secara horizontal
    }}
  >
    <Paper elevation={3} sx={{ p: 4, width: 360, borderRadius: 3 }}>
      <Typography variant="h5" mb={2} textAlign="center">
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          Masuk
        </Button>
      </form>
    </Paper>
  </Box>
  );
}
