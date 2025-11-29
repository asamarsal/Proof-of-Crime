# Next.js API Backend - Deployment Guide

## ✅ Apa yang Sudah Dibuat

###  Backend API (Next.js API Routes)
- ✅ `/app/api/bounties/route.ts` - GET & POST bounties
- ✅ `/app/api/bounties/[id]/route.ts` - GET, PUT, DELETE single bounty
- ✅ Prisma Client integration
- ✅ Schema dari backend dicopy ke frontend

### Frontend Integration
- ✅ `smart-contract-audit/page.tsx` fetch dari API
- ⏳ `submit-case/page.tsx` needs API integration for CREATE
- ⏳ `web3-website-hacking/page.tsx` needs API integration
- ⏳ `people-bounty/page.tsx` needs API integration

## 🚀 Cara Deploy

### 1. Set Environment Variable

Tambahkan `DATABASE_URL` di file `.env.local` di folder `proofofcrime-ui`:

```bash
# .env.local
DATABASE_URL="postgresql://postgres:uuaauaua123@db.xqyctxbjlagjpoozoaxi.supabase.co:5432/postgres"
```

**PENTING:** Pastikan database name `postgres` (bukan `postgre`)!

### 2. Generate Prisma Client

```bash
cd proofofcrime-ui
npx prisma generate
```

### 3. Jalankan Development Server

```bash
npm run dev
```

### 4. Test API Endpoints

```bash
# Get all bounties
curl http://localhost:3000/api/bounties

# Get smart contract bounties only
curl http://localhost:3000/api/bounties?category=SMART_CONTRACT_AUDIT

# Create bounty (example)
curl -X POST http://localhost:3000/api/bounties \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Test Bounty",
    "description": "Test description",
    "category": "SMART_CONTRACT_AUDIT",
    "companyName": "Test Company",
    "totalReward": 10000,
    "severity": "HIGH",
    "deadline": "2025-12-31",
    "scope": "Smart Contracts",
    "inScope": ["Audit", "Review"],
    "outOfScope": ["Frontend"],
    "techStack": ["Solidity"]
  }'
```

### 5. Deploy ke Vercel

1. Push ke GitHub
2. Connect repository di Vercel
3. Set environment variable di Vercel:
   - `DATABASE_URL` = your Supabase connection string
4. Deploy!

**Vercel akan otomatis:**
- Install dependencies
- Run `npx prisma generate`
- Build Next.js app
- Deploy!

## ✨ Keuntungan Next.js API vs Express

✅ **No separate backend** - Semua dalam satu app
✅ **Easy deployment** - Vercel native support  
✅ **Serverless by default** - No server management
✅ **Type-safe** - Full TypeScript integration
✅ **Auto-scaling** - Handle traffic spikes
✅ **No CORS issues** - Same origin

## 📝 Next Steps

1. Integrate API POST ke submit-case page
2. Update web3-website-hacking & people-bounty pages  
3. Test end-to-end flow
4. Deploy to production!
