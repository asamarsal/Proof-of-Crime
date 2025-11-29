# Vercel Deployment Guide

## Environment Variables (PENTING!)

Sebelum deploy, pastikan Anda sudah mengatur environment variables di Vercel Dashboard:

1. Buka project di Vercel Dashboard
2. Pergi ke **Settings** → **Environment Variables**
3. Tambahkan variable berikut:

```
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
```

**Ganti dengan connection string Supabase Anda!**

Untuk mendapatkan connection string Supabase:
1. Buka Supabase Dashboard
2. Pilih project Anda
3. Pergi ke **Settings** → **Database**
4. Copy **Connection String** (mode: URI)
5. Ganti `[YOUR-PASSWORD]` dengan password database Anda

## Cara Deploy

1. Push semua perubahan ke GitHub
2. Vercel akan otomatis trigger deployment
3. Tunggu hingga build selesai
4. Test API dengan mengakses: `https://your-project.vercel.app/health`

## Test Endpoints

Setelah deploy berhasil, test endpoints berikut:

- Health check: `https://your-project.vercel.app/health`
- Cron endpoint: `https://your-project.vercel.app/api/cron`
- API root: `https://your-project.vercel.app/`

## Troubleshooting

### Build berhasil tapi runtime crash:
- Pastikan `DATABASE_URL` sudah di-set di Vercel
- Check Vercel logs: Pergi ke deployment → **Function Logs**
- Pastikan Supabase database bisa diakses dari luar (tidak ada IP whitelist)

### Database connection error:
- Vercel menggunakan serverless, pastikan Supabase connection pooling enabled
- Gunakan connection string dengan `?pgbouncer=true` jika perlu
