# 🚀 Deploy Steps - Vercel Fix

## Masalah yang Terjadi
```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" 
because pnpm-lock.yaml is not up to date with package.json
```

## ✅ Solusi (Sedang Berjalan)

### 1. Update Lockfile (In Progress)
```bash
pnpm install
```
Ini akan:
- Install `prisma@^7.0.1` yang baru ditambahkan
- Update `pnpm-lock.yaml`
- Run `postinstall` script → `prisma generate`

### 2. Commit & Push (Setelah Install Selesai)
```bash
git add package.json pnpm-lock.yaml
git commit -m "Fix: Add Prisma for Vercel deployment"
git push
```

### 3. Vercel Auto-Redeploy
Vercel akan:
- ✅ Detect push baru
- ✅ Install dengan lockfile yang sudah update
- ✅ Run postinstall → generate Prisma client
- ✅ Build Next.js
- ✅ Deploy SUCCESS!

## 📌 Checklist Before Deploy

- [ ] `pnpm install` selesai
- [ ] `pnpm-lock.yaml` updated
- [ ] Commit & push
- [ ] Environment variable `DATABASE_URL` sudah di-set di Vercel
- [ ] Redeploy

## 🔑 Environment Variable

**PENTING!** Set di Vercel Dashboard:
```
DATABASE_URL = postgresql://postgres:uuaauaua123@db.xqyctxbjlagjpoozoaxi.supabase.co:5432/postgres
```

Tunggu `pnpm install` selesai, lalu commit & push!
