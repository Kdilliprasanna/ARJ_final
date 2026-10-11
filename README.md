# ARJ Career AI - Final Web Platform

> An AI-powered, full-suite career acceleration and intelligence platform.

## 📁 Repository Architecture

This repository contains the complete web application deployed and organized under the `web` directory:

```
ARJ_final/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD Deployment
├── web/                        # Complete Web Application Source & Build
│   ├── src/                    # React components, pages, styles & offline sync
│   │   ├── OfflineCareerApp.jsx# Core Application Engine
│   │   ├── offlineCareerApp.css# Responsive Dark Theme Styling (#090d16)
│   │   └── ...
│   ├── public/                 # Static assets, logos & resume templates
│   ├── dist/                   # Production build distribution
│   ├── package.json            # Dependencies & scripts
│   ├── vite.config.js          # Vite build & proxy configuration
│   └── index.html              # HTML entry point
├── .gitignore                  # Git ignore rules
└── README.md                   # Platform documentation
```

---

## 🚀 Quick Start (Running the Web App Locally)

### 1. Install Dependencies
```bash
cd web
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```
The app will run locally at `http://localhost:5176`.

### 3. Build for Production
```bash
npm run build
```

---

## 🌐 Live GitHub Pages Deployment

The repository includes automated GitHub Actions CI/CD (`.github/workflows/deploy.yml`).
To activate GitHub Pages:
1. Go to **Settings** > **Pages** in this GitHub repository.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Every push to the `main` branch automatically builds and publishes the web application.

---

## 🔒 Data & Security

* **MongoDB Atlas Cloud:** Connected and synchronized for real-time authentication and profile persistence.
* **Pixel-Perfect Dark Theme:** Edge-to-edge `#090d16` styling with high-contrast accessibility.
* **Resume Builder & ATS Scanner:** Integrated template engine and keyword optimization.
