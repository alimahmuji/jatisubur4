# Jati Subur4 Furniture - Firebase

Versi perbaikan: Login Firebase Authentication + CRUD produk Firestore + toko publik.

## Firebase
1. Authentication > Sign-in method > Email/Password: Enable.
2. Authentication > Users: buat akun admin.
3. Firestore Database: buat database.
4. Firestore Rules: gunakan isi `firestore.rules`.
5. `firebase-config.js` sudah berisi konfigurasi Web App.

## Jalankan
Gunakan VS Code Live Server atau web server lokal, bukan `file://`.

## Alur
login.html -> Firebase Authentication -> admin.html -> simpan produk ke collection `products` -> index.html membaca collection `products`.

Tidak memakai PHP dan tidak memakai MySQL.
