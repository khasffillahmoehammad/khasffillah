# PL-DIOS v2.0 — Cara Menjalankan

## Syarat
- Node.js v18+ → https://nodejs.org

## Cara Jalankan
```bash
node server.js
```
Buka: http://localhost:3000

## Akun Default

| Role | Email | Password |
|---|---|---|
| Master | master@pldios.local | password123 |
| Admin Pertamina | admin@pldios.local | password123 |
| SAM Retail | samretail@pldios.local | password123 |
| SAM Industri | samindustri@pldios.local | password123 |
| Distributor (Pola Raya) | polarayajayasakti@pldios.local | password123 |
| Distributor (Sutan Kasim) | sutankasim@pldios.local | password123 |

## Alur Kerja

1. **Master** → Stock In → Alokasi Stok → (opsional) Stock Adjustment
2. **Admin Pertamina** → Alokasi Stok → Kelola PO (upload QT, verifikasi bayar) → Stock Adjustment
3. **Distributor** → Create Order → Confirm Order → Upload Bukti Bayar
4. **SAM Retail/Industri** → Lihat Dashboard & Sisa Alokasi

## Troubleshooting
Port 3000 sudah dipakai? → `PORT=4000 node server.js`
