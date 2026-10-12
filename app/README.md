# ARJ Career AI - Mobile Application (`app/`)

> Cross-platform mobile application for **ARJ Career AI** built with **React Native & Expo SDK 57**, featuring 100% pixel-perfect UI parity, hardware-accelerated WebView rendering, dynamic LAN host auto-detection, single-row floating navigation, and real-time MongoDB Atlas cloud synchronization.

---

## 📱 Mobile Architecture & Highlights

- **Framework**: React Native `0.86.3` + Expo SDK `57.0.27`
- **Native Shell Engine**: Hardware-accelerated `react-native-webview` with unrestricted local storage & cookies
- **Edge-to-Edge Theme**: Custom deep-dark UI (`#090d16`) with native status bar theming
- **Optimized Mobile Dock**: Single-row floating dock navigation with generous bottom clearance (`130px`) preventing content overlaps
- **Dynamic Network Auto-Discovery**: Transparently auto-detects host machine's LAN IP from Metro bundle URL and falls back to live GitHub Pages production endpoint (`https://kdilliprasanna.github.io/ARJ_final/`)
- **Shared Cloud Backend**: Direct authentication and two-way sync with MongoDB Atlas (`arj_career_ai`)

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go App](https://expo.dev/go) installed on Android or iOS device

### 2. Install Dependencies
```bash
cd app
npm install --legacy-peer-deps
```

### 3. Start Development Server
```bash
# LAN mode (recommended for physical devices on same Wi-Fi)
npx expo start --lan

# Or standard start
npx expo start
```

Scan the terminal QR code using **Expo Go** on Android or the Camera app on iOS.

---

## 📦 Standalone APK & Production Builds

The mobile application is pre-configured with `eas.json` for Expo Application Services (EAS Build):

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Build Android APK (preview profile)
eas build -p android --profile preview

# Build Android App Bundle (AAB for Google Play Store)
eas build -p android --profile production
```

---

## 📂 Folder Structure

```
app/
├── App.js               # Root native application shell & API proxy engine
├── app.json             # Expo project configuration, identifiers & permissions
├── assets/              # App launcher icons, splash screens, and tie logos
├── src/                 # Native React Native screens, components, and API client
├── metro.config.js      # Metro bundler configuration with TreeFS resiliency
├── babel.config.js      # Babel preset configuration
├── eas.json             # EAS cloud build profiles (APK & AAB)
├── package.json         # Isolated mobile dependencies & scripts
└── .gitignore           # Ignores node_modules, build outputs, and native artifacts
```
