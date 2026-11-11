# Go Suite — Landing Page Site

## Repository
- **Remote**: https://github.com/fajarassaad/Go-Suite.git
- **Branch**: main
- **Push command**: `git push origin main`

## Tech Stack
- HTML statis (tanpa framework/build tools)
- CSS custom di `css/style.css` (design system sendiri, mobile-first max 430px)
- JavaScript vanilla di `js/main.js`
- Tidak ada bundler/npm — semua file langsung serve

## Struktur File
```
index.html          → Linktree KOPIGO (homepage www.kopigo.id, CSS inline sendiri)
suite.html          → Homepage Go Suite (landing page utama produk)
pesan.html          → Halaman pesan KOPIGO (menu, keranjang, checkout ke WhatsApp; pakai css/pesan.css + js/pesan.js, bukan style.css)
pesan-terkirim.html → Ringkasan setelah pesanan dikirim ke WhatsApp (js/pesan-terkirim.js); kunjungannya = jumlah pesanan terkirim
titik.html          → Halaman Titik Jualan KOPIGO (rekrutmen mitra lokasi; css/pesan.css + css/titik.css + js/titik.js; kalkulator komisi per cup dan form pengajuan ke WhatsApp)
titik-terkirim.html → Ringkasan setelah pengajuan lokasi dikirim ke WhatsApp (js/titik-terkirim.js); kunjungannya = jumlah pengajuan
harga.html          → Halaman harga + promo wheel + kemitraan KOPIGO
kasir.html          → Fitur: Kasir & Penjualan
logistik.html       → Fitur: Sales Keliling
katering.html       → Fitur: Katering/Event
form-publik.html    → Fitur: Form Publik
dapur.html          → Fitur: Dapur Produksi
stok.html           → Fitur: Stok & Gudang
pembelian.html      → Fitur: Pembelian Supplier
waste-log.html      → Fitur: Pencatatan Rusak
buku-besar.html     → Fitur: Buku Besar & Kas
rekening-bank.html  → Fitur: Rekening Bank
laporan.html        → Fitur: Laporan Laba Rugi
resep-hpp.html      → Fitur: Resep & HPP
investor.html       → Fitur: Laporan Investor
payroll.html        → Fitur: Gaji & Komisi
jadwal-kerja.html   → Fitur: Jadwal Kerja
riderhub.html       → Fitur: RiderHub
staff-role.html     → Fitur: Akses & Peran
log-hapus.html      → Fitur: Log Hapus
multi-cabang.html   → Fitur: Multi-Cabang
order-mitra.html    → Fitur: Order Mitra B2B
mobile-rider.html   → Fitur: Mobile Rider
css/style.css       → Design system (variabel, komponen, layout)
js/main.js          → Interaksi global (nav, FAQ accordion, animasi)
assets/             → Gambar & media
data/instagram.json → Statistik IG untuk index.html (diperbarui oleh .github/workflows/update-instagram-stats.yml)
robots.txt, sitemap.xml → SEO; tambahkan halaman baru ke sitemap.xml
```

## Navigasi
- **Top nav**: Logo + CTA WhatsApp
- **Bottom nav** (fixed): Home, Fitur (bottom-sheet modal), Harga, Kontak, Kemitraan
- **Footer links**: Tersedia di setiap halaman
- **Fitur modal**: Bottom-sheet dengan grid 20 modul, masing-masing link ke halaman fitur

## Konvensi
- Semua halaman menggunakan `css/style.css` dan `js/main.js` yang sama
- Animasi via class `fade-in`, `stagger-1` s/d `stagger-6`
- CSS variables didefinisikan di `:root` dalam `style.css`
- Mobile-first design, max-width 430px centered
- WhatsApp CTA: nomor 6282187164364
- Link kemitraan: https://kemitraan.kopigo.id
- Skema mitra Titik Jualan (titik.html): komisi per gelas Rp1.000 (<30 gelas/hari), Rp1.500 (30-49), Rp2.000 (>=50); bagi hasil 30% dari laba bersih titik; perjanjian awal 3 bulan. HPP tidak ditampilkan di web; kalkulator hanya memakai perkiraan laba kotor Rp6.000 per gelas (keputusan pemilik). Sumber kunjungan: `titik.html?dari=<nama>` ikut tertulis di pesan WhatsApp.
- Lokasi KOPIGO di pesan.html (radio "Pesan dari mana?"): Outlet Grab n Go Galesong Utara, Central Kitchen Panaikang, Titik Racing Center, Titik Jalan Malino Gowa

## Aturan Edit
0. Setiap mengubah `css/pesan.css`, `css/titik.css`, `js/pesan.js`, `js/pesan-terkirim.js`, `js/titik.js`, `js/titik-terkirim.js`, atau `assets/kopigo-logo.svg`, naikkan angka `?v=` di `pesan.html`, `pesan-terkirim.html`, `titik.html`, `titik-terkirim.html`, dan `index.html`. Tanpa itu HP pelanggan memakai file lama dari cache (Cloudflare) dan halaman tampil berantakan.
1. Jangan ubah design system (`css/style.css`) tanpa cek dampak ke semua halaman
2. Pastikan bottom nav & footer konsisten di semua halaman
3. Setiap halaman harus include bottom-sheet modal fitur (copy dari template)
4. Gunakan class yang sudah ada di style.css, hindari inline style berlebihan
