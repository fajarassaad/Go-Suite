# Dokumentasi Teknis Go Suite Landing Page

Dokumen ini menjelaskan struktur internal, konvensi teknis, dan komponen UI utama di dalam proyek Landing Page Go Suite.

## 1. Arsitektur File

Proyek dibangun tanpa compiler. Semua kode adalah HTML murni yang mengimpor _satu_ file CSS global.

### Direktori `/` (Root)
- `index.html`: Beranda utama. Menjelaskan nilai jual utama (masalah vs solusi) dan menampilkan tabulasi 20 modul fitur via bottom-sheet.
- `harga.html`: Halaman konversi utama. Berisi struktur harga transparan UMKM dan fitur **Gamifikasi Subsidi (Roda Keberuntungan)**.
- `[nama-modul].html` (Contoh: `kasir.html`, `waste-log.html`): Halaman pendaratan mikro yang merinci satu fitur spesifik, disertai studi kasus lapangan.

### File `css/style.css`
File ini adalah inti tata letak visual. File ini menangani CSS Reset, Variabel Warna (`:root`), tipografi global (Satoshi/Inter), tata letak Grid/Flexbox, dan class utility responsif.
Ketiadaan framework pihak ketiga (Tailwind/Bootstrap) murni disengaja untuk meminimalkan beban rendering di perangkat target klien UMKM skala bawah.

## 2. Komponen UI Global

Beberapa elemen antarmuka dirancang konsisten dan harus di *copy-paste* persis saat membuat halaman HTML baru:

### A. Global Bottom Navigation (`.bottom-nav`)
Komponen menu persisten (mirip tampilan aplikasi mobile) di tepi bawah layar. Terdiri dari 4 ikon navigasi berformat `<svg> inline`. Posisinya `fixed` dan memiliki transisi bayangan (shadow) jika layar di-scroll. Halaman fitur individu umumnya akan meng-highlight icon relevan atau menetapkan transisi warna `active`.

### B. Pull-up Modal / Bottom Sheet (`.bottom-sheet`)
Ini adalah laci navigasi besar berisi 20 *card link* rute ke halaman-halaman fungsional aplikasi. Komponen ini digunakan sebagai pengganti "Menu Hamburger" tradisional (yang konversinya rendah pada ibu jari).
- **Trigger:** Tombol "Fitur" pada elemen `.bottom-nav`.
- **Background:** `.modal-backdrop` (blur background hitam saat aktif).
- **Interaksi:** JavaScript secara statik (tanpa state-manager) menetapkan toggle class `active` di DOM tree.

### C. Floating Call to Action
Pada halaman detail fitur dan harga, sering terdapat `.floating-button` yang mengajak pengguna menghubungi tim sales (WhatsApp link). Target formasi URL WA harus dilengkapi parameter `?text=` pre-filled (sudah dikodekan URI) sesuai modul yang sedang diakses.

## 3. Fitur Gamifikasi Subsidi (harga.html)

Sistem Roda Keberuntungan dibangun menggunakan JavaScript vanilla murni.
- **Trigger:** Tombol lebar "CEK SUBSIDI PELUNCURAN".
- **Wheel DOM:** Rotasi CSS `transform: rotate` menggunakan animasi transisi easing bezier selama beberapa detik (`conic-gradient` di CSS rendering).
- **State Management:** Logika `localStorage.setItem('gosuite_promotion_v2', 'true')` digunakan sebagai "flag/bendera" untuk menetapkan state kemenangan. Jika halaman dimuat ulang dan variabel ini true, antarmuka pengguna otomatis berubah menonjolkan fitur *survey form* atau lencana *Subsidi Aktif* pada kartu harga utama.
- **Post-Win Action (WhatsApp Push):** Modal *micro-survey* muncul menanyakan Profil, Posisi, dan Kendala Utama. JavaScript mengambil nilai parameter `<select>` dan merekayasa struktur _string_ ke URL WhatsApp terenkripsi otomatis sebagai konfirmasi pendaftaran.

## 4. Konvensi SEO Mandiri
Ketiadaan Next.js atau SSR generator mengharuskan Anda memanipulasi meta tag manual per file if modifying.
Pastikan 3 komponen dipertahankan ketika mereplikasi file HTML baru:
1. `<title>`: Panjang ideal 50-60 karakter ("Nama Fitur X - Go Suite").
2. `<meta name="description">`: Teks rangkuman nilai jual 150 kata (bukan cuma daftar fitur teknis).
3. `<meta property="og:...">`: Struktur minimal untuk optimasi Open Graph (Social Title, Desc, Graph Image Banner).

## 5. Menambahkan Halaman Fitur Baru

Jika Go Suite merilis modul baru, prosedurnya:
1. Clone file `dapur.html` atau template serupa yang sudah terstruktur.
2. Ganti blok `<header class="page-header" style="--theme-color: #XXX">`. Sesuaikan Hex variabel dengan karakter warna modul terkait (contoh: Merah muda untuk Katering, Oranye untuk Stok).
3. Update Meta Tag perihal informasi.
4. Ganti daftar "Studi Kasus/Masalah" dengan paragraf relevan dengan fitur.
5. Injeksi entry fitur baru (`<a>` link dengan SVG) tersebut di modul "Bottom Sheet" pada SEMUA file `.html` lain agar peta situs saling terhubung secara sinkron.
