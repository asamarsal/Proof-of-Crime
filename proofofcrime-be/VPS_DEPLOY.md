# VPS Deployment Guide for Proof of Crime Backend

This guide explains how to deploy the `proofofcrime-be` Express application to a Virtual Private Server (VPS) like DigitalOcean, AWS EC2, or Google Compute Engine.

## Prerequisites

- A VPS running Ubuntu 20.04 or later.
- SSH access to your VPS.
- A domain name (optional, but recommended for SSL).
- A PostgreSQL database (can be hosted on the same VPS or external like Supabase).

## Step 1: Server Setup

1.  **Update System:**
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

2.  **Install Node.js (v18+):**
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

3.  **Install PM2 (Process Manager):**
    ```bash
    sudo npm install -g pm2
    ```

4.  **Install Git:**
    ```bash
    sudo apt install git -y
    ```

## Step 2: Clone and Configure

1.  **Clone Repository:**
    ```bash
    git clone <your-repo-url>
    cd Proof-of-Crime/proofofcrime-be
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file:
    ```bash
    nano .env
    ```
    Paste your configuration:
    ```env
    PORT=5000
    DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
    JWT_SECRET="your-super-secret-key"
    FRONTEND_URL="https://your-frontend-domain.com"
    NODE_ENV="production"
    ```

## Step 3: Database Setup

1.  **Generate Prisma Client:**
    ```bash
    npx prisma generate
    ```

2.  **Run Migrations:**
    ```bash
    npx prisma migrate deploy
    ```

## Step 4: Build and Start

1.  **Build the Project:**
    ```bash
    npm run build
    ```

2.  **Start with PM2:**
    ```bash
    pm2 start dist/index.js --name "proofofcrime-be"
    ```
    *Note: If your entry point is different (check `package.json`), adjust the path. Based on `src/index.ts`, it usually compiles to `dist/index.js`.*

3.  **Save PM2 List:**
    ```bash
    pm2 save
    pm2 startup
    ```

## Step 5: Nginx Reverse Proxy (Optional but Recommended)

1.  **Install Nginx:**
    ```bash
    sudo apt install nginx -y
    ```

2.  **Configure Nginx:**
    ```bash
    sudo nano /etc/nginx/sites-available/proofofcrime
    ```
    Add:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com;

        location / {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **Enable Site:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/proofofcrime /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

4.  **SSL with Certbot:**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d your-domain.com
    ```

## API Endpoints

- **Health Check:** `GET /health`
- **Cases:** `GET /api/cases`, `POST /api/cases`, `GET /api/cases/:id`
- **Bounties:** `GET /api/bounties`, `POST /api/bounties`
- **Users:** `GET /api/users/profile`
- **Statistics:** `GET /api/statistics/dashboard`
