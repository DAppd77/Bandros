# Bandros (Bandung Tour On Bus) - Multi-Step Web App

Aplikasi web tiket online Bandros yang memisahkan secara jelas antara **Tahap Pemesanan (Langkah 1)** dan **Tahap Pembayaran (Langkah 2)**, baik untuk tampilan **Desktop** maupun **Mobile**.

---

## 🔀 Pemisahan Alur: Pemesanan vs Pembayaran

### 1. Tahap 1: Pemesanan Tiket (`#desktop-step-pemesanan` / `#screen-jadwal`)
- **Fokus Pengguna**: Memilih rute wisata, mengecek tanggal keberangkatan, dan memilih jam bus Bandros.
- **Komponen Utama**:
  - Stepper indicator: `[1] Pemesanan Tiket (Aktif)` ── `[2] Pembayaran`
  - Hero banner & badge kategori wisata
  - Banner promo tiket
  - Pemilihan tanggal (26 Nov – 30 Nov)
  - Pencarian & filter jam keberangkatan
  - Kartu pilihan bus (07.00 vs 08.30) dengan status terpilih interaktif
  - **Bilah Aksi Pemesanan**: Menampilkan rincian tiket terpilih dan tombol utama **"Lanjut ke Pembayaran ➔"** (*Desktop*) atau **"PILIH BUS (LANJUT KE PEMBAYARAN)"** (*Mobile*).

---

### 2. Tahap 2: Pembayaran Tiket (`#desktop-step-pembayaran` / `#screen-pembayaran`)
- **Fokus Pengguna**: Memeriksa ringkasan pesanan, batas waktu pembayaran, dan menyelesaikan transaksi.
- **Komponen Utama**:
  - Stepper indicator: `[1] Pemesanan (Selesai ✓)` ── `[2] Pembayaran (Aktif)`
  - Tombol **"← Kembali Ubah Jadwal"** untuk kembali ke Tahap 1 kapan saja tanpa kehilangan data
  - **Timer Hitung Mundur (Countdown)**: Waktu pembayaran aktif (*06 : 55*)
  - **E-Tiket Berlubang (Perforated Ticket)**: Kartu rute dengan efek gerigi sobekan tiket asli sesuai desain Figma
  - **Rincian Pembayaran**: Harga tiket (Rp20.000) + Biaya layanan (Rp4.000) = **Total Rp24.000**
  - **Pilihan Metode**: QRIS (scan barcode terpadu) vs DANA (e-wallet)
  - Tombol **"BAYAR SEKARANG"**: Membuka simulasi pop-up scan QRIS / DANA dan e-tiket tanda terima berhasil

---

## 🖥️📱 Perbedaan Desktop vs Mobile
- **Desktop**: Tampilan lebar yang lega dengan Stepper Bar di atas, bilah aksi booking bawah yang lebar, dan tata letak pembayaran 2 kolom (Kiri: Tiket & Rincian; Kanan: Metode Bayar & Tombol Bayar).
- **Mobile**: Tampilan berbingkai smartphone 390px 1:1 sesuai spesifikasi frame Figma dengan navigasi layar penuh bertahap.
- Terdapat tombol **Switcher** di kanan atas untuk berpindah pratinjau antara **Tampilan Desktop** dan **Tampilan Mobile**.

---

## 📁 Struktur Berkas
```
c:\File DaO\WebDev\Bandros\
├── index.html            # Markup semantik multi-step (Pemesanan & Pembayaran)
├── styles.css            # Styling responsif, tema warna Figma, efek sobekan tiket
├── app.js                # State terpusat, navigasi multi-step, timer, modal bayar
├── assets/               # 19 aset vektor SVG resmi Figma
└── README.md
```

## 🚀 Cara Menjalankan
Buka berkas `index.html` langsung di browser Anda, atau gunakan server lokal:
```powershell
python -m http.server 8000
```
Lalu akses `http://localhost:8000`.
