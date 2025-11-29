# How to Deploy ElizaOS Sniper Bot to Railway

This guide explains how to deploy your ElizaOS backend (located in `proofofcrime-be/eliza-agent`) to Railway.

## 1. Prerequisites

- A GitHub account
- A Railway account (railway.app)
- OpenAI API Key (or other model provider key)

## 2. Prepare the Repository

1.  **Push your code to GitHub:**
    Ensure the `proofofcrime-be/eliza-agent` folder is pushed to your GitHub repository.

## 3. Deploy on Railway

1.  **New Project:**
    - Go to [Railway Dashboard](https://railway.app/dashboard).
    - Click **"New Project"** -> **"Deploy from GitHub repo"**.
    - Select your repository.

2.  **Configure Service:**
    - Click on the newly created service card.
    - Go to **"Settings"**.
    - **Root Directory:** Set this to `proofofcrime-be/eliza-agent` (Important! This tells Railway where the app lives).
    - **Build Command:** Leave default (usually `pnpm build` or auto-detected).
    - **Start Command:** 
      ```bash
      pnpm start --character="characters/sniper.character.json"
      ```

3.  **Environment Variables:**
    - Go to the **"Variables"** tab.
    - Add the following variables (copy from `.env.example` inside `eliza-agent`):
      - `OPENAI_API_KEY`: sk-... (Your OpenAI Key)
      - `SERVER_PORT`: 3000
      - Any other keys required by your plugins (e.g., `EVM_PROVIDER_URL` for Lisk Sepolia).

4.  **Public Networking:**
    - Go to **"Settings"** -> **"Networking"**.
    - Click **"Generate Domain"**.
    - You will get a URL like `https://web-production-xxxx.up.railway.app`.

## 4. Get Agent ID

Once deployed:
1.  Go to the **"Logs"** tab in Railway.
2.  Wait for the "Success: Agent loaded" message.
3.  Copy the UUID (Agent ID).

## 5. Connect Frontend

1.  Open `proofofcrime-ui/app/analytics/page.tsx`.
2.  Update `API_URL` with your Railway URL:
    ```typescript
    const API_URL = "https://web-production-xxxx.up.railway.app/YOUR-AGENT-UUID/message"
    ```
3.  Set `USE_REAL_API = true`.
4.  Redeploy your frontend to Vercel.

## Troubleshooting

- **Build Fails?** Ensure `pnpm-lock.yaml` is present in `proofofcrime-be/eliza-agent`.
- **Agent not loading?** Check logs for "Character not found". Ensure `sniper.character.json` is in the correct path relative to the start command.

---

## Alternative: Deploy on Render

Render is another great option with a free tier (though paid is recommended for AI bots).

1.  **New Web Service:**
    - Go to [Render Dashboard](https://dashboard.render.com).
    - Click **"New +"** -> **"Web Service"**.
    - Connect your GitHub repository.

2.  **Configure:**
    - **Root Directory:** `proofofcrime-be/eliza-agent`
    - **Environment:** `Node`
    - **Build Command:** `pnpm install && pnpm build`
    - **Start Command:** `pnpm start --character="characters/sniper.character.json"`

3.  **Environment Variables:**
    - Add `OPENAI_API_KEY` and other secrets in the "Environment" tab.

---

## Alternative: Deploy on VPS (DigitalOcean, AWS, GCP)

For full control and lower cost at scale, use a VPS.

1.  **Connect to VPS:**
    ```bash
    ssh root@your-vps-ip
    ```

2.  **Install Dependencies:**
    - Install Node.js (v23+), Pnpm, and Git.

3.  **Clone & Setup:**
    ```bash
    git clone https://github.com/your-username/proofofcrime.git
    cd proofofcrime/proofofcrime-be/eliza-agent
    pnpm install
    pnpm build
    ```

4.  **Run with PM2 (Process Manager):**
    ```bash
    npm install -g pm2
    pm2 start "pnpm start --character='characters/sniper.character.json'" --name eliza-sniper
    pm2 save
    ```

5.  **Expose Port:**
    - Ensure port 3000 is open in your firewall.
    - You can access via `http://your-vps-ip:3000`.

