📌 Restaurant POS Test
Proyek ini adalah implementasi dari Developer Test untuk sistem Restaurant POS (Point of Sale) dengan backend Laravel dan frontend React + Vite + TypeScript.

🚀 Tech Stack
Backend: Laravel 10, Sanctum, DomPDF
Frontend: React 18, Vite, TypeScript, React Query, React Hook Form + Zod, Material UI
Database: MySQL (bisa pakai MariaDB / SQLite untuk testing)

📂 Struktur Project
restaurant-pos-test/
 ├─ backend/   → API (Laravel)
 ├─ frontend/  → Web App (React + Vite)
 └─ README.md  → Dokumentasi

⚙️ Requirements
PHP >= 8.1 (disarankan 8.2 jika ingin Laravel 12)
Composer
Node.js >= 18
MySQL / MariaDB

🔧 Setup Backend (Laravel)
cd backend
composer install //install dependencies
cp .env.example .env //copy env 
php artisan key:generate //generate key

#atur koneksi database di .env
DB_DATABASE=restaurant_db
DB_USERNAME=root
DB_PASSWORD=

php artisan migrate --seed //migrate & seed
php artisan serve
API akan tersedia di http://127.0.0.1:8000.

💻 Setup Frontend (React + Vite)
cd frontend
npm install
cp .env.example .env //copy env
#isi VITE_API_URL dengan URL backend, contoh:
VITE_API_URL=http://127.0.0.1:8000/api

npm run dev //jalankan

Frontend akan jalan di http://localhost:5173.

👤 Roles & Fitur

Pelayan
1. Login
2. Kelola Master Menu (CRUD)
3. Buat & update order (tambah item, edit qty, hapus item)
4. Tutup Order

Kasir
1. Lihat daftar order (filter open/closed)
2. Tutup order
3. Menyelesaikan order -> Download struk (PDF)

📄 Catatan tentang Laravel 10 vs 12

Soal developer test meminta penggunaan Laravel 12, namun pada saat pengembangan, upgrade ke Laravel 12 menyebabkan konflik dependency (terutama dengan package pihak ketiga dan requirement PHP). Untuk menjaga stabilitas, project ini menggunakan Laravel 10 ("laravel/framework": "^10.10", "php": "^8.1").

Semua fitur yang diminta sudah diimplementasikan (auth, menu CRUD, orders, close order, receipt PDF, validasi, error handling, loader).

🧪 Testing
1. Login sebagai pelayan → tambahkan menu → buat order baru.
2. Login sebagai kasir → lihat daftar order open → tutup order → download struk (PDF).

✅ Status
 Backend (Laravel 10, Sanctum, DomPDF)
 Frontend (React + Vite + MUI, CRUD, Orders, Receipt PDF)
 Error handling & Loader
 Dokumentasi (README)

⚡ Project ini siap dijalankan dan dites sesuai kebutuhan Developer Test.
