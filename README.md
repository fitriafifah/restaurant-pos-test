# 📌 Restaurant POS Test

Proyek ini adalah implementasi dari **Developer Test** untuk sistem **Restaurant POS (Point of Sale)** dengan backend **Laravel** dan frontend **React + Vite + TypeScript**.

---

## 🚀 Tech Stack
- **Backend:** Laravel 10, Sanctum, DomPDF  
- **Frontend:** React 18, Vite, TypeScript, React Query, React Hook Form + Zod, Material UI  
- **Database:** MySQL (bisa pakai MariaDB / SQLite untuk testing)

---

## 📂 Struktur Project
```
restaurant-pos-test/
 ├─ backend/   → API (Laravel)
 ├─ frontend/  → Web App (React + Vite)
 └─ README.md  → Dokumentasi
```

---

## ⚙️ Requirements
- PHP >= 8.1 (disarankan 8.2 jika ingin Laravel 12)  
- Composer  
- Node.js >= 18  
- MySQL / MariaDB  

---

## 🔧 Setup Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` sesuai koneksi database:
```env
DB_DATABASE=restaurant_db
DB_USERNAME=root
DB_PASSWORD=
```

Lalu jalankan:
```bash
php artisan migrate --seed
php artisan serve
```

API tersedia di: **http://127.0.0.1:8000**

---

## 💻 Setup Frontend (React + Vite)
```bash
cd frontend
npm install
cp .env.example .env
```

Isi `.env` dengan:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Lalu jalankan:
```bash
npm run dev
```

Frontend tersedia di: **http://localhost:5173**

---

## 👤 Roles & Fitur

### Pelayan
1. Login  
2. Kelola Master Menu (CRUD)  
3. Buat & update order (tambah item, edit qty, hapus item)  
4. Tutup Order  

### Kasir
1. Lihat daftar order (filter open/closed)  
2. Tutup order  
3. Menyelesaikan order → Download struk (PDF)  

---

## 📄 Catatan Laravel 10 vs 12
Developer test meminta **Laravel 12**, namun saat pengembangan upgrade ke Laravel 12 menimbulkan konflik dependency (terutama dengan package pihak ketiga dan requirement PHP).  

Untuk stabilitas, project ini menggunakan **Laravel 10**:
```json
"laravel/framework": "^10.10",
"php": "^8.1"
```

Semua fitur tetap diimplementasikan:
- Auth (Sanctum)  
- Menu CRUD  
- Orders (open/close)  
- Receipt PDF (DomPDF)  
- Validasi, error handling, loader  

---

## 🧪 Testing
1. Login sebagai **pelayan** → tambahkan menu → buat order baru.  
2. Login sebagai **kasir** → lihat daftar order open → tutup order → download struk (PDF).  

---

## ✅ Status
- [x] Backend (Laravel 10, Sanctum, DomPDF)  
- [x] Frontend (React + Vite + MUI, CRUD, Orders, Receipt PDF)  
- [x] Error handling & Loader  
- [x] Dokumentasi (README)  

---

⚡ Project ini siap dijalankan dan dites sesuai kebutuhan **Developer Test**.


## 🖼️ Screenshots

### Login Page
![Login Page](assets/screenshot_1.png)

### Dashboard
![Dashboard](assets/screenshot_3.png)

### Daftar Meja & Detail Order
![Daftar Meja & Detail Order](assets/screenshot_6.png)

### List Pesanan/Orders
![List Pesanan/Orders](assets/screenshot_8.png)

### Master Menu
![Master Menu](assets/screenshot_11.png)
