export type Table = {
  id: number;
  number: number;
  status: 'available' | 'occupied';
};

export type MenuItem = {
  id: number;
  name: string;
  price: number;
};

export type OrderItem = {
  id: number;
  menu_item_id: number;
  name: string;
  price: number;
  qty: number;
  subtotal: number;
};

export type Order = {
  id: number;
  table_number: number;
  status: 'open' | 'closed';
  items: OrderItem[];
  total: number;
};
