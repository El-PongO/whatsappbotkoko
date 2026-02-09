# WhatsApp Bot Koko 🏠

Bot WhatsApp untuk pengelolaan rumah kost Indonesia yang membantu mengingatkan penghuni tentang informasi masa tinggal dan pembayaran.

## Fitur

### 🔔 Pengingat Otomatis Harian
Bot akan mengirim pengingat otomatis setiap hari pukul 09:00 yang berisi:
- Tanggal mulai dan akhir masa tinggal
- Durasi tinggal (sudah berapa hari)
- Sisa waktu tinggal
- Tanggal dan jumlah pembayaran berikutnya
- Peringatan jika pembayaran atau masa tinggal akan berakhir

### 💬 Perintah Bot

- **!info** - Menampilkan informasi lengkap masa tinggal dan pembayaran
- **!pay** - Menampilkan QR code dan informasi untuk pembayaran
- **!complain [pesan]** - Mengirim keluhan kepada pengelola kost
- **!help** - Menampilkan daftar perintah yang tersedia

## Instalasi

### Prasyarat
- Node.js (versi 14 atau lebih baru)
- npm atau yarn
- Akun WhatsApp yang akan digunakan untuk bot

### Langkah Instalasi

1. Clone repository ini:
```bash
git clone https://github.com/El-PongO/whatsappbotkoko.git
cd whatsappbotkoko
```

2. Install dependencies:
```bash
npm install
```

3. Konfigurasi data penghuni di file `tenants.json` (lihat bagian Konfigurasi)

4. Jalankan bot:
```bash
npm start
```

5. Scan QR code yang muncul di terminal menggunakan WhatsApp

## Konfigurasi

### File `tenants.json`

File ini berisi data penghuni kost. Format nomor WhatsApp menggunakan format internasional dengan `@c.us`.

Contoh format:
```json
{
  "6281234567890@c.us": {
    "name": "Budi Santoso",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "nextPaymentDate": "2024-03-01",
    "monthlyRent": 1500000,
    "roomNumber": "101"
  }
}
```

**Penjelasan Field:**
- `6281234567890@c.us`: Nomor WhatsApp dalam format internasional (62 untuk Indonesia)
- `name`: Nama penghuni
- `startDate`: Tanggal mulai tinggal (format: YYYY-MM-DD)
- `endDate`: Tanggal akhir masa tinggal (format: YYYY-MM-DD)
- `nextPaymentDate`: Tanggal pembayaran berikutnya (format: YYYY-MM-DD)
- `monthlyRent`: Biaya sewa bulanan dalam Rupiah
- `roomNumber`: Nomor kamar (opsional)

### Informasi Pembayaran

Edit informasi pembayaran di file `index.js` pada baris berikut:
```javascript
const paymentInfo = `BANK: BCA\nNomor Rekening: 1234567890\nAtas Nama: Kost Koko`;
```

## Penggunaan

### Untuk Pengelola Kost

1. Tambahkan data penghuni baru ke `tenants.json`
2. Update tanggal pembayaran setelah penghuni melakukan pembayaran
3. Lihat keluhan penghuni di file `complaints.json`

### Untuk Penghuni Kost

Kirim pesan ke bot WhatsApp dengan perintah berikut:

- **Lihat informasi lengkap:**
  ```
  !info
  ```

- **Melihat cara pembayaran:**
  ```
  !pay
  ```

- **Mengirim keluhan:**
  ```
  !complain AC kamar saya rusak
  ```

- **Melihat bantuan:**
  ```
  !help
  ```

## Jadwal Pengingat

Bot akan mengirim pengingat otomatis setiap hari pukul 09:00 WIB. Untuk mengubah jadwal, edit bagian berikut di `index.js`:

```javascript
// Ubah '0 9 * * *' sesuai kebutuhan
// Format: menit jam hari bulan hari-dalam-minggu
cron.schedule('0 9 * * *', () => {
    sendDailyReminders();
});
```

Contoh jadwal lain:
- `0 8 * * *` - Setiap hari pukul 08:00
- `0 20 * * *` - Setiap hari pukul 20:00
- `0 9 * * 1` - Setiap Senin pukul 09:00

## File Output

- **complaints.json**: File yang berisi semua keluhan dari penghuni
- **tenants.json**: File konfigurasi data penghuni
- **.wwebjs_auth/**: Folder yang berisi data autentikasi WhatsApp (jangan dihapus)

## Troubleshooting

### Bot tidak bisa login
- Pastikan WhatsApp Anda aktif dan terhubung internet
- Hapus folder `.wwebjs_auth` dan scan QR code lagi
- Pastikan nomor WhatsApp tidak sedang digunakan di WhatsApp Web lain

### Pengingat tidak terkirim
- Cek apakah bot masih aktif dan terhubung
- Pastikan format nomor WhatsApp di `tenants.json` benar
- Lihat log error di console

### QR Code tidak muncul saat pembayaran
- Pastikan package `qrcode` sudah terinstall
- Cek log error untuk informasi lebih detail

## Teknologi yang Digunakan

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - Library WhatsApp Web API
- [qrcode](https://www.npmjs.com/package/qrcode) - Generator QR Code
- [node-cron](https://www.npmjs.com/package/node-cron) - Task scheduler untuk pengingat otomatis

## Lisensi

MIT License

## Kontribusi

Pull requests are welcome! Silakan buat issue terlebih dahulu untuk perubahan besar.

## Catatan Keamanan

- Jangan share file `tenants.json` karena berisi data pribadi penghuni
- Folder `.wwebjs_auth` berisi sesi WhatsApp, jaga kerahasiaannya
- Backup data secara berkala