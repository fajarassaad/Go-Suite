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

## Aturan Edit
1. Jangan ubah design system (`css/style.css`) tanpa cek dampak ke semua halaman
2. Pastikan bottom nav & footer konsisten di semua halaman
3. Setiap halaman harus include bottom-sheet modal fitur (copy dari template)
4. Gunakan class yang sudah ada di style.css, hindari inline style berlebihan
