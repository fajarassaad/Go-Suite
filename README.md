# Go Suite Landing Page

Website profil dan landing page resmi untuk **Go Suite**, Sistem POS & ERP modern yang dirancang khusus untuk UMKM di Indonesia.

## 🚀 Gambaran Umum

Proyek ini adalah situs web statis (HTML/CSS/JS) yang bertugas sebagai garda terdepan pemasaran produk Go Suite. Situs ini mengedepankan:
- **Performa Tinggi:** Tidak ada dependensi berat, murni HTML5, Vanilla CSS, dan Vanilla JavaScript.
- **Responsif:** Desain mobile-first yang otomatis beradaptasi dengan layar tablet dan desktop.
- **Konversi Tinggi:** Copywriting yang langsung menjawab *pain points* (masalah) UMKM tanpa jargon teknis yang membingungkan.
- **Struktur Modular:** Terdiri dari 1 homepage utama dan 20+ halaman fitur spesifik pendukung.

## 📂 Struktur Direktori Utama

- `/` (Root): File HTML utama (`index.html`, `harga.html`) dan semua halaman modul/fitur (e.g. `kasir.html`, `stok.html`, dll).
- `/css/`: File stylesheet utama (`style.css`).
- `/images/`: Aset gambar dan ilustrasi (jika dikonfigurasi).

## 🛠️ Panduan Pengembangan (Development)

Situs ini dibangun murni menggunakan teknologi web standar. Tidak diperlukan proses build seperti Webpack atau Vite jika Anda hanya ingin membuka halamannya.

**Cara Menjalankan Lokal:**
1. Clone / copy folder proyek `SITE` ke komputer Anda.
2. Anda bisa langsung membuka file `index.html` di browser apa saja, ATAU
3. (Disarankan) Gunakan ekstensi seperti **Live Server** di VS Code atau jalankan local server sederhana via Python (`python -m http.server`) untuk menghindari masalah CORS jika ke depan menggunakan fetch API/local asset.

## 🎨 Modifikasi Tema & Warna

Konfigurasi warna dan variabel utama diatur menggunakan CSS Custom Properties di file `css/style.css` pada block `:root`:

```css
:root {
    --primary: #4f46e5;      /* Warna Utama */
    --primary-dark: #4338ca; /* Varian Gelap */
    --secondary: #10b981;    /* Warna Tombol / Call to action sekunder */
    --bg-page: #f8fafc;      /* Background Halaman */
    /* ... variabel lain */
}
```

## 🌐 Link Penting
- **URL Produksi:** (Akan diisi URL domain sebenarnya)
- **Kontak Support:** https://wa.me/6282187164364
