# Proof-of-Crime

Membangun masa depan keadilan global secara on-chain. Proof-of-Crime adalah platform pelaporan, verifikasi, dan insentif bounty untuk kasus kejahatan, memanfaatkan teknologi blockchain dan web modern.

![Presentation](https://github.com/asamarsal/Proof-of-Crime/blob/main/monaddappspresentation.png?raw=true)

---

## Daftar Isi

- Deskripsi Proyek
- Struktur Monorepo
- Fitur Utama
- Smart Contract
- Cara Menjalankan
- Deployment
- Kontribusi
- Lisensi

---

## Deskripsi Proyek

Proof-of-Crime adalah ekosistem pelaporan kejahatan dengan insentif bounty, menghubungkan pelapor, perusahaan, dan auditor melalui sistem transparan berbasis blockchain. Platform ini terdiri dari backend API, smart contract, dan frontend web.

---

## Struktur Monorepo

- **proofofcrime-be/**  
  Backend API (Node.js/TypeScript, Prisma, Express)  
  - Manajemen kasus, bounty, user, statistik, dsb.
  - Integrasi database via Prisma ORM.
  - Folder khusus: `eliza-agent` (AI agent backend).

- **proofofcrime-sc/**  
  Smart contract Solidity  
  - `peoplebounty.sol`, `smartcontractbounty.sol`, `usdcrime.sol`
  - Mengelola bounty, reward, dan transaksi blockchain.

- **proofofcrime-ui/**  
  Frontend Next.js (React)  
  - Halaman dashboard, analitik, pelaporan, audit, dsb.
  - Integrasi Web3 & ABI smart contract.
  - Komponen UI modular.

---

## Fitur Utama

- Pelaporan kasus kejahatan dengan insentif bounty.
- Audit smart contract dan web3 bug bounty.
- Dashboard statistik dan analitik.
- Integrasi blockchain (Lisk Sepolia, USDCRIME token).
- AI agent (Eliza) untuk analisis otomatis.
- Deployment mudah ke Railway (backend) & Vercel (frontend).

---

## Smart Contract

- **USDCRIME Token:**  
  [Lisk Sepolia Blockscout](https://sepolia-blockscout.lisk.com/token/0x7898de8bB562B6e31C7A10FA3AE84AB036B1e9Cd)

- **Contoh Input Smart Contract Bounty:**  
  - `usdcrimeAddress`: 0x7898de8bB562B6e31C7A10FA3AE84AB036B1e9Cd
  - `_approvers`: array address approver
  - `_requiredApprovals`: jumlah minimal approval

---

## Cara Menjalankan

### Backend (proofofcrime-be)
1. Install dependencies:
   ```bash
   cd proofofcrime-be
   npm install
   ```
2. Konfigurasi environment & database (lihat file `.env.example`).
3. Jalankan server:
   ```bash
   npm run dev
   ```

### Smart Contract (proofofcrime-sc)
- Deploy dan test smart contract menggunakan tools seperti Hardhat/Remix.

### Frontend (proofofcrime-ui)
1. Install dependencies:
   ```bash
   cd proofofcrime-ui
   npm install
   ```
2. Konfigurasi `.env.local` (DATABASE_URL, dsb).
3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```

---

## Deployment

- **Backend:**  
  Deploy ke Railway. Lihat README_DEPLOY.md untuk panduan lengkap.

- **Frontend:**  
  Deploy ke Vercel. Lihat DEPLOY_STEPS.md dan NEXTJS_API_GUIDE.md.

---

## Kontribusi

Kontribusi sangat terbuka! Silakan fork, buat branch, dan ajukan pull request.

---

## Lisensi

Lihat file LICENSE untuk detail lisensi.

---