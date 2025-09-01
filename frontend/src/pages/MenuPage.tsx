import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getErrorMessage } from '../lib/api';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form'; // ⬅️ pakai type import
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, TextField, Typography, CircularProgress
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { useNotify } from '../stores/notify';

// ====== Type ======
type MenuItem = { id:number; name:string; price:number };

// ====== Validasi Zod ======
// Pake z.number() + transform biar selalu jadi number
const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 huruf"),
  price: z.union([
    z.string().regex(/^\d+$/, "Harga harus angka").transform(val => Number(val)),
    z.number().positive("Harga harus lebih dari 0")
  ])
});
type FormValues = z.infer<typeof schema>;

export default function MenuPage(){
  const queryClient = useQueryClient();
  const notify = useNotify();

  // ====== STATE ======
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem|null>(null);

  // ====== QUERY: List ======
  const { data: items, isLoading } = useQuery<MenuItem[]>({
    queryKey: ['menu-items'],
    queryFn: async () => (await api.get('/menu-items')).data
  });

  // ====== FORM ======
  const { register, handleSubmit, reset, formState:{ 
    errors, isSubmitting } } = 
    useForm<FormValues>({ resolver: 
    zodResolver(schema) as any, defaultValues: { name: "", price: 0 } });

  // ====== MUTATIONS ======
  const addMutation = useMutation({
    mutationFn: (payload: FormValues) => api.post('/menu-items', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['menu-items'] });
      setOpen(false);
      notify.show("Menu berhasil ditambahkan", "success");
    },
    onError: (e) => notify.show(getErrorMessage(e), "error")
  });

  const updateMutation = useMutation({
    mutationFn: (payload: {id:number} & FormValues) =>
      api.put(`/menu-items/${payload.id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['menu-items'] });
      setOpen(false);
      notify.show("Menu berhasil diperbarui", "success");
    },
    onError: (e) => notify.show(getErrorMessage(e), "error")
  });

  const deleteMutation = useMutation({
    mutationFn: (id:number) => api.delete(`/menu-items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['menu-items'] });
      notify.show("Menu berhasil dihapus", "success");
    },
    onError: (e) => notify.show(getErrorMessage(e), "error")
  });

  // ====== HANDLERS ======
  const onSubmit: SubmitHandler<FormValues> = (values) => {
    if (editItem) {
      updateMutation.mutate({ id: editItem.id, ...values });
    } else {
      addMutation.mutate(values);
    }
    reset();
  };

  const handleOpenAdd = () => {
    setEditItem(null);
    reset({ name: "", price: 0 });
    setOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditItem(item);
    reset(item);
    setOpen(true);
  };

  // ====== RENDER ======
  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>Master Menu</Typography>

      <Button variant="contained" onClick={handleOpenAdd} sx={{ mb: 2 }}>
        + Tambah Menu
      </Button>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 2,
          }}
        >
          {items?.map(item => (
            <Box
              key={item.id}
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Rp {item.price.toLocaleString()}
              </Typography>
              <Box mt={1} display="flex" gap={1}>
                <IconButton onClick={()=>handleOpenEdit(item)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={()=>{
                  if (confirm("Hapus menu ini?")) deleteMutation.mutate(item.id);
                }}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Dialog Tambah/Edit */}
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogTitle>{editItem ? "Edit Menu" : "Tambah Menu"}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth margin="normal" label="Nama"
              {...register('name')}
              error={!!errors.name} helperText={errors.name?.message}
            />
            <TextField
              fullWidth margin="normal" label="Harga" type="number"
              {...register('price')}
              error={!!errors.price} helperText={errors.price?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setOpen(false)}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>
              {editItem ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
