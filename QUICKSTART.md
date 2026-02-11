# Quick Start Guide

## 🚀 Panduan Cepat Memulai Bot WhatsApp Kost Koko

### Langkah 1: Instalasi

```bash
# Install Node.js dependencies
npm install
```

### Langkah 2: Konfigurasi Penghuni

Edit file `tenants.json` dan tambahkan data penghuni:

```json
{
  "628123456789@c.us": {
    "name": "Nama Penghuni",
    "startDate": "2024-01-15",
    "endDate": "2024-12-15",
    "nextPaymentDate": "2024-03-01",
    "monthlyRent": 1500000,
    "roomNumber": "101"
  }
}
```

**Cara mendapatkan format nomor WhatsApp:**
- Nomor Indonesia: 62 + nomor tanpa 0 + @c.us
- Contoh: 081234567890 → 6281234567890@c.us

### Langkah 3: Konfigurasi Informasi Pembayaran

Edit file `index.js` pada baris 162:

```javascript
const paymentInfo = `BANK: BCA\nNomor Rekening: 1234567890\nAtas Nama: Kost Koko`;
```

Ganti dengan informasi bank Anda.

### Langkah 4: Jalankan Bot

```bash
npm start
```

### Langkah 5: Login WhatsApp

1. QR code akan muncul di terminal
2. Buka WhatsApp di smartphone
3. Pergi ke Settings > Linked Devices > Link a Device
4. Scan QR code yang muncul

### Selesai! ✅

Bot sekarang aktif dan akan:
- Mengirim pengingat otomatis setiap hari pukul 09:00
- Merespon perintah dari penghuni kost

## 📱 Perintah untuk Penghuni

Penghuni bisa kirim pesan ke nomor bot dengan perintah:

- `!info` - Lihat informasi lengkap
- `!pay` - Lihat QR code pembayaran
- `!complain AC rusak` - Kirim keluhan
- `!help` - Bantuan

## ⚙️ Kustomisasi

### Mengubah Jadwal Pengingat

Edit baris 116 di `index.js`:

```javascript
// Format: menit jam hari bulan hari-dalam-minggu
cron.schedule('0 9 * * *', () => {  // 09:00 setiap hari
    sendDailyReminders();
});

// Contoh lain:
// '0 8 * * *'   - 08:00 setiap hari
// '0 20 * * *'  - 20:00 setiap hari
// '0 9 * * 1'   - 09:00 setiap Senin
```

### Melihat Keluhan Penghuni

Buka file `complaints.json` untuk melihat semua keluhan yang masuk.

## 🔧 Troubleshooting

**Bot tidak bisa login?**
```bash
# Hapus folder autentikasi dan coba lagi
rm -rf .wwebjs_auth
npm start
```

**Pengingat tidak terkirim?**
- Pastikan bot tetap berjalan (jangan tutup terminal)
- Periksa format nomor WhatsApp di tenants.json

**Error saat install?**
```bash
# Pastikan Node.js versi 14 atau lebih baru
node --version

# Update npm
npm install -g npm@latest
```

## 📞 Support

Jika ada masalah, buka issue di GitHub repository.
