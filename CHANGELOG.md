# Changelog

Semua perubahan penting pada proyek **Go Suite Landing Page** akan didokumentasikan di file ini.

## [v2.0.0] - Februari 2026
**Major Overhaul & Redesign Fase 2**

### Ditambahkan
- **Modular Feature Pages:** Pembuatan 16+ halaman HTML individual untuk setiap modul Go Suite (Penjualan, Keuangan, Operasional, Admin), direferensikan via komponen "Bottom Sheet".
- **Advanced Gamification:** Menambahkan Modul "Wheel of Fortune" (`harga.html`) dengan algoritma Jackpot Subsidi Rp 999.000 untuk konversi lead via WhatsApp otomatis. Termasuk *Micro-survey* (Nama, Jenis Usaha, Peran, Masalah).
- **SEO & Open Graph:** Injeksi dinamis Meta Tags dan OG Tags (`og:title`, `og:description`, `og:image`) ke seluruh struktur HTML untuk previu cantik saat link dibagikan di media sosial.
- **Global Bottom Nav:** Menambahkan komponen navigasi bawah persisten bergaya aplikasi ke seluruh file untuk mencegah pengguna tersesat akibat halaman jalan buntu (*dead ends*).

### Diubah
- **Copywriting Strategy:** Menghapus istilah teknis/jargon seperti "P&L", "Cloud POS", "HPP" dari `index.html` menjadi padanan istilah UMKM seperti "Laporan Laba Rugi", "Kasir Keliling", "Resep & Modal".
- **Home Page Redesign:** Mengubah struktur "Daftar Fitur" di `index.html` menjadi UI berbasis "Tab" interaktif (Keuangan, Operasional, Penjualan, Admin & Tim). Mengalihkan fokus pada "Penyelesaian Masalah" ketimbang spesifikasi fitur semata.
- **Harga (Pricing) Flow:** Menghapus klaim "Bayar sekali pakai selamanya" menjadi penjelasan pricing logis "Biaya Setup 1.5Jt + Biaya Perpanjangan Rp 300rb/tahun".
- **Visual Contrast Fix:** Mengoreksi *gradient masking* di setiap file HTML untuk memastikan teks pahlawan (hero text) putih dapat terbaca jelas tanpa benturan warna latar kuning/terang. Menambahkan `--text-shadow` dinamis.

### Diperbaiki
- Sinkronisasi teks, penjelasan kasus penggunaan (use cases) riil, dan matriks keunggulan dengan puluhan file PANDUAN fungsional yang aktual.
- Menghidupkan kembali unicode emojis (seperti 🧼, 🧱) yang sebelumnya korup/tampil acak.

## [v1.0.0] - Arsip Rilis Awal
- **Initial Commit:** Kerangka kerja statis awal dan desain kasar.
