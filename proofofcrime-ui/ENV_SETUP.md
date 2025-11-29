# Environment Variables untuk CRUD Bounties

Buat file `.env.local` di root folder `proofofcrime-ui`:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:uuaauaua123@db.xqyctxbjlagjpoozoaxi.supabase.co:5432/postgres"
```

## ⚠️ PENTING

1. **Database name harus `postgres`** (bukan `postgre`)
2. **Ganti password** dengan password Supabase Anda yang benar
3. **Connection string format:**
   ```
   postgresql://[user]:[password]@[host]:[port]/[database]
   ```

## 📝 Optional Environment Variables

Jika diperlukan, Anda bisa tambahkan:

```env
# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Vercel (auto-filled when deployed)
# VERCEL_URL (auto)
# VERCEL_ENV (auto)
```

## 🚀 After Setting .env.local

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Push schema to database (optional, jika belum ada tables)
npx prisma db push

# 3. Run development server
npm run dev
```

## ✅ Test API

```bash
# Test GET bounties
curl http://localhost:3000/api/bounties

# Test GET specific category
curl http://localhost:3000/api/bounties?category=SMART_CONTRACT_AUDIT
```

Selesai! CRUD akan berfungsi setelah `.env.local` diatur dengan benar.
