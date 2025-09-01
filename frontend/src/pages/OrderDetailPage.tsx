// src/pages/OrderDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { downloadPdf, getErrorMessage } from '../lib/api';
import {
  Box, Button, IconButton, Table, TableBody, TableCell,
  TableHead, TableRow, Typography, TextField, MenuItem as MuiMenuItem,
  Select, CircularProgress, Card, CardContent, Stack, Divider
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useAuth } from '../stores/auth';
import { useNotify } from '../stores/notify';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ==== Types ====
type Item = { id:number; menu_item_id:number; name:string; price:number; qty:number; subtotal:number; };
type Order = {
  id:number;
  table_number:number;
  status:'open'|'closed';
  items:Item[];
  subtotal:number;
  tax:number;
  total:number;
};
type MenuItem = { id:number; name:string; price:number };

// ==== Zod schema ====
const addItemSchema = z.object({
  menuId: z.coerce.number().int().positive({ message: 'Pilih menu' }),
  qty: z.coerce.number().int().min(1, { message: 'Qty minimal 1' }),
});
type AddItemForm = z.infer<typeof addItemSchema>;

export default function OrderDetailPage() {
  const { id } = useParams();
  const orderId = Number(id);
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const notify = useNotify();

  // ==== Query order detail ====
  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => (await api.get(`/orders/${orderId}`)).data
  });

  // ==== Query menu items ====
  const { data: menus } = useQuery<MenuItem[]>({
    queryKey: ['menu-items'],
    queryFn: async () => (await api.get('/menu-items')).data
  });

  // ==== Mutations ====
  const addItem = useMutation({
    mutationFn: (payload:{menu_item_id:number; qty:number}) =>
      api.post(`/orders/${orderId}/items`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['order', orderId] });
      notify.show('Item ditambahkan', 'success');
    },
    onError: (e) => notify.show(getErrorMessage(e), 'error'),
  });

  const updateQty = useMutation({
    mutationFn: (payload:{itemId:number; qty:number}) =>
      api.put(`/orders/${orderId}/items/${payload.itemId}`, { qty: payload.qty }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey:['order', orderId] }),
    onError: (e) => notify.show(getErrorMessage(e), 'error'),
  });

  const deleteItem = useMutation({
    mutationFn: (itemId:number) => api.delete(`/orders/${orderId}/items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['order', orderId] });
      notify.show('Item dihapus', 'success');
    },
    onError: (e) => notify.show(getErrorMessage(e), 'error'),
  });

  const closeOrder = useMutation({
    mutationFn: () => api.patch(`/orders/${orderId}/close`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['orders'] });
      queryClient.invalidateQueries({ queryKey:['order', orderId] });
      notify.show('Order ditutup', 'success');
      nav('/orders');
    },
    onError: (e) => notify.show(getErrorMessage(e), 'error'),
  });

  const reopenOrder = useMutation({
    mutationFn: () => api.patch(`/orders/${orderId}/reopen`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['orders'] });
      queryClient.invalidateQueries({ queryKey:['order', orderId] });
      notify.show('Order dibuka kembali', 'success');
      nav(`/orders/${orderId}`);
    },
    onError: (e) => notify.show(getErrorMessage(e), 'error'),
  });

  // ==== react-hook-form + zod ====
 const { handleSubmit, register, formState:{ errors, isSubmitting }, reset } = 
    useForm<AddItemForm>({ resolver: 
    zodResolver(addItemSchema) as any, defaultValues: { menuId: 0, qty: 1 }, }
  );

  const onAddItem: SubmitHandler<AddItemForm> = async (v) => {
    await addItem.mutateAsync({ menu_item_id: v.menuId, qty: v.qty });
    reset({ menuId: 0, qty: 1 });
  };

  // ==== Loader & Not Found ====
  if (isLoading) return <CircularProgress />;
  if (!order) return <Typography>Order tidak ditemukan</Typography>;

  return (
    <Box>
      {/* Header */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Order Meja #{order.table_number}
      </Typography>

      {/* Ringkasan Order */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Status: 
              <Typography component="span" ml={1} color={order.status==='open' ? 'success.main' : 'error.main'}>
                {order.status.toUpperCase()}
              </Typography>
            </Typography>
            <Typography variant="h6">Total: Rp {order.total.toLocaleString()}</Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography>Subtotal: Rp {order.subtotal.toLocaleString()}</Typography>
          <Typography>PPN 10%: Rp {order.tax.toLocaleString()}</Typography>
        </CardContent>
      </Card>

      {/* Daftar Items */}
      <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Menu</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map(i => (
                <TableRow key={i.id}>
                  <TableCell>{i.name}</TableCell>
                  <TableCell>Rp {i.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <TextField
                      type="number" size="small" value={i.qty}
                      onChange={e=>updateQty.mutate({ itemId: i.id, qty: Number(e.target.value) })}
                      sx={{ width: 80 }} disabled={order.status==='closed'}
                    />
                  </TableCell>
                  <TableCell>Rp {i.subtotal.toLocaleString()}</TableCell>
                  <TableCell>
                    {order.status==='open' && (
                      <IconButton
                        onClick={()=>{ if (confirm('Hapus item ini?')) deleteItem.mutate(i.id); }}
                        color="error"
                      >
                        <Delete/>
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Tambah Item */}
      {order.status==='open' && user?.role==='pelayan' && (
        <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" mb={2}>Tambah Item</Typography>
            <Box component="form" onSubmit={handleSubmit(onAddItem)}>
              <Stack direction="row" gap={2} alignItems="center">
                <Select
                  defaultValue={0}
                  {...register('menuId', { valueAsNumber: true } as any)}
                  displayEmpty size="small" sx={{ minWidth: 240 }}
                  error={!!errors.menuId}
                >
                  <MuiMenuItem value={0} disabled>Pilih Menu</MuiMenuItem>
                  {menus?.map(m => (
                    <MuiMenuItem key={m.id} value={m.id}>
                      {m.name} — Rp {m.price.toLocaleString()}
                    </MuiMenuItem>
                  ))}
                </Select>
                <TextField
                  type="number" label="Qty" size="small" sx={{ width: 120 }}
                  {...register('qty', { valueAsNumber: true })}
                  error={!!errors.qty} helperText={errors.qty?.message}
                />
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Tambah Item
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Stack direction="row" spacing={2} mt={3}>
        {order.status==='open' && (user?.role==='pelayan' || user?.role==='kasir') && (
          <Button color="error" variant="contained"
            onClick={()=>closeOrder.mutate()} disabled={closeOrder.isPending}>
            Tutup Order
          </Button>
        )}
        {order.status==='closed' && user?.role==='kasir' && (
          <>
            <Button variant="contained"
              onClick={()=>reopenOrder.mutate()} disabled={reopenOrder.isPending}>
              Buka Lagi Order
            </Button>
            <Button variant="outlined"
              onClick={()=>downloadPdf(`/orders/${order.id}/receipt`, `receipt-${order.id}.pdf`)}>
              Lihat Struk (PDF)
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
