# Bandros (Bandung Tour On Bus) - Web App

A responsive, interactive web application built directly from the Figma design specification (`Pemesanan tiket bus` & `Pembayaran tiket Bandros`).

## 📁 Struktur Proyek
```
c:\File DaO\WebDev\Bandros\
├── index.html            # Markup semantik (layar Jadwal & Pembayaran + modal)
├── styles.css            # Styling responsif, tema warna Figma, efek tiket sobek
├── app.js                # Interaktivitas, countdown timer, alur pembayaran, filter
├── assets/               # 19 aset vektor SVG asli dari Figma
│   ├── bus-illustration.svg
│   ├── bus-icon.svg
│   ├── promo-ticket.svg
│   ├── qris-icon.svg
│   ├── dana-wallet.svg
│   └── ...
└── README.md
```

## ✨ Fitur & Interaktivitas
1. **Layar 1: Jadwal Bandros (`3:4827`)**
   - **Header & Promo**: Banner kuning *"PESAN SEKARANG, AMANKAN KURSIMU!"*.
   - **Kartu Rute**: Ilustrasi bus Bandros, info rute *"BANDUNG TOUR"*, rating 4,8 (2.450 ulasan).
   - **Simpan Rute (Favorit)**: Tombol interaktif untuk menyimpan rute perjalanan.
   - **Pemilih Tanggal**: Scrollable tanggal (26 Nov - 30 Nov) dengan status tanggal aktif.
   - **Pencarian & Filter**: Filter berdasarkan jam (Pagi/Siang) dan tipe bus, pencarian langsung dengan text input.
   - **Pilihan Bus**: Pilihan jadwal bus (07.00 vs 08.30) dengan update otomatis ke ringkasan harga di footer.
   - **Tombol "PILIH BUS"**: Membawa pengguna ke layar Ringkasan Pesanan / Pembayaran.

2. **Layar 2: Ringkasan Pesanan / Pembayaran (`5:2`)**
   - **Timer Countdown**: Tampilan sisa waktu pembayaran interaktif (*06 : 55*).
   - **Tiket Wisata dengan Efek Sobekan**: Desain tepi berlubang (*perforated ticket tear*) yang presisi sesuai desain Figma.
   - **Rincian Transaksi**: Perhitungan otomatis harga tiket (`Rp20.000`) + biaya layanan (`Rp4.000`) = `Rp24.000`.
   - **Pilihan Metode Pembayaran**: Toggle antara **QRIS** dan **DANA** dengan update status radio button.
   - **Simulasi Pembayaran ("BAYAR SEKARANG")**: Menampilkan pop-up barcode QRIS atau login DANA interaktif, diikuti dengan e-tiket & tanda terima pembayaran berhasil.

3. **Mode Tampilan Responsif (Dual Mode)**:
   - **Mobile (1:1)**: Tampilan viewport ponsel 390px berbingkai rapi yang mencerminkan tampilan Figma secara pixel-perfect.
   - **Desktop Dual-Pane**: Tampilan layar lebar di mana daftar jadwal dan ringkasan pembayaran/checkout tersaji berdampingan secara responsif.
   - Dapat dialihkan melalui tombol di navbar kanan atas (*"Mobile (1:1)"* vs *"Desktop Dual-Pane"*).

## 🚀 Cara Menjalankan
Cukup buka file `index.html` langsung di browser Anda (klik ganda file `index.html`), atau jalankan server lokal sederhana:
```powershell
python -m http.server 8000
```
Lalu buka `http://localhost:8000` di peramban Anda.
