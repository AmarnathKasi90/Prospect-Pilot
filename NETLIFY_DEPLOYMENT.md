# ProspectPilot — Netlify Deployment Guide

This guide provides step-by-step instructions for deploying **ProspectPilot** to [Netlify](https://www.netlify.com/).

---

## 🔑 Required Environment Secrets & Variables

Before deploying, make sure you have the following API keys ready:

| Secret / Environment Variable Name | Required? | Description & How to Obtain |
| :--- | :---: | :--- |
| `GEMINI_API_KEY` | **YES** | **Google Gemini API Key** — Required for AI website auditing (Gemini Vision) and generating personalized cold emails. <br>👉 Get it free at [Google AI Studio](https://aistudio.google.com/app/apikey). |
| `GEOAPIFY_API_KEY` | **RECOMMENDED** | **Geoapify Places API Key** — Used for real-time local business scraping across US cities. If omitted, ProspectPilot automatically uses its built-in realistic fallback generator. <br>👉 Get a free key at [Geoapify MyProjects](https://myprojects.geoapify.com/). |
| `NODE_VERSION` | **YES** | Set to `20.x` (Configured automatically in `netlify.toml`). |

---

## 🛠️ Step-by-Step Deployment Instructions

### Method 1: Deploy via GitHub (Recommended)

1. **Push Code to GitHub**:
   Push this repository to your GitHub account.

2. **Log in to Netlify**:
   Go to [Netlify App](https://app.netlify.com/) and click **Add new site** > **Import an existing project**.

3. **Select GitHub Repository**:
   Choose your `ProspectPilot` repository.

4. **Build Settings**:
   Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

5. **Set Environment Variables (Secrets)**:
   - Click **Environment variables** (or go to **Site Configuration** > **Environment variables**).
   - Click **Add a variable** and add:
     - Key: `GEMINI_API_KEY`
     - Value: `your_actual_gemini_api_key_here`
   - Click **Add another variable** (Optional but recommended):
     - Key: `GEOAPIFY_API_KEY`
     - Value: `your_actual_geoapify_api_key_here`

6. **Deploy Site**:
   Click **Deploy ProspectPilot**. Netlify will build the frontend Vite app and deploy the backend API as a Netlify serverless function.

---

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Log in to Netlify**:
   ```bash
   netlify login
   ```

3. **Set Environment Variables**:
   ```bash
   netlify env:set GEMINI_API_KEY "your_gemini_api_key_here"
   netlify env:set GEOAPIFY_API_KEY "your_geoapify_api_key_here"
   ```

4. **Deploy to Production**:
   ```bash
   netlify deploy --build --prod
   ```

---

## 📁 Pre-configured Files Included in Repository

- **`netlify.toml`**: Configures Vite build settings, serverless function routing (`/api/*`), and SPA page fallback.
- **`netlify/functions/api.ts`**: Serverless function entry point wrapping the Express backend server using `serverless-http`.

---

## 💡 Troubleshooting Checklist

- **503 / High Demand Error**: Gemini API occasionally experiences high traffic spikes. ProspectPilot includes automatic retries and intelligent fallback audits so your pipeline never fails.
- **API Key Missing Warning**: Ensure `GEMINI_API_KEY` is added under **Site Configuration > Environment variables** in your Netlify dashboard and trigger a re-deploy after saving.
