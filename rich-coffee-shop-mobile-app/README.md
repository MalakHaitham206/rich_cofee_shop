# ☕ Rich Coffee Shop — Mobile App

React Native / Expo mobile app for the Rich Coffee Shop mini e-commerce system. Built with **Expo SDK 54**, **Expo Router 6**, **React 19**, and the **New Architecture**.

---

## 🏗️ Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Framework    | Expo SDK 54 (React Native 0.81)        |
| Language     | TypeScript 5                           |
| Routing      | Expo Router 6 (file-based)             |
| UI           | React Native + Expo Image              |
| Animations   | React Native Reanimated 4              |
| Icons        | @expo/vector-icons                     |
| Navigation   | React Navigation 7 (bottom tabs)       |

---

## 📂 Project Structure

```
rich-coffee-shop-mobile-app/
├── app/
│   ├── _layout.tsx          # Root layout (Stack navigator)
│   └── (tabs)/
│       ├── _layout.tsx      # Bottom tab navigator
│       ├── index.tsx        # Home screen
│       └── explore.tsx      # Explore screen
├── components/              # Shared UI components
│   └── ui/
├── constants/
│   └── theme.ts             # Color tokens
├── hooks/                   # Custom hooks (useColorScheme, etc.)
├── assets/                  # Images & icons
├── .env                     # Local env (not committed)
├── .env.example             # Template — copy → .env
├── app.json                 # Expo config
└── package.json
```

---

## ⚙️ Prerequisites — Install These First

### 1. Node.js ≥ 20
Download from [nodejs.org](https://nodejs.org)

### 2. Java JDK 17 (required for Android builds)

Install via Homebrew (recommended):
```bash
brew install --cask temurin@17
```

Or download from [Adoptium](https://adoptium.net/) and install the `.pkg`.

After installing, add to `~/.zshrc`:
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

Verify:
```bash
source ~/.zshrc
java -version   # should show: openjdk version "17.x.x"
```

### 3. Android SDK — Fix Environment Variables

The SDK is already installed on this machine at `~/Library/Android/sdk`.
The environment variables are now added to `~/.zshrc`. Apply them:

```bash
source ~/.zshrc
```

Verify `adb` works:
```bash
adb devices
```

---

## 🚀 Setup & Running

### 1. Install dependencies

```bash
cd rich-coffee-shop-mobile-app
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` — set `EXPO_PUBLIC_API_URL` to your backend address.

### 3. Run the app

#### Option A — Expo Go (easiest, no build needed)

Works with any device/emulator running **Expo Go** from the Play Store.

> ⚠️ This project uses `newArchEnabled: true` and React 19. **Expo Go may not fully support it.** Use Option B for best results.

```bash
npx expo start
```

Scan the QR code with Expo Go on your phone, or press:
- `a` — launch Android emulator
- `i` — launch iOS simulator

#### Option B — Development Build (recommended for this project)

Since the app uses **New Architecture + React 19**, a development build gives full compatibility:

```bash
# Make sure Java 17 is installed first!
npx expo run:android
```

This builds a native APK and installs it on the connected emulator/device.

---

## 📱 Running on Android

### Emulator

Two AVDs are available on this machine:
- `Medium_Phone_API_36.0`
- `flutter_emulator`

Start one:
```bash
# Using Android Studio: AVD Manager → click ▶ on the emulator
# OR from terminal:
$ANDROID_HOME/emulator/emulator -avd Medium_Phone_API_36.0 &
```

Then run the app:
```bash
npx expo start --android
# OR
npx expo run:android
```

### Physical Android Device

1. Enable **Developer Options** on your device:
   - Go to *Settings → About Phone* → tap **Build Number** 7 times
2. Enable **USB Debugging** in Developer Options
3. Connect via USB cable
4. Accept the "Allow USB debugging?" prompt on the device
5. Verify it's detected:
   ```bash
   adb devices
   # Should show:  <serial>  device
   ```
6. Run:
   ```bash
   npx expo start --android
   ```

---

## 🐛 Common Errors & Fixes

### ❌ `ANDROID_HOME is not set` / `adb not found`

**Fix:** The env vars are now in `~/.zshrc`. Apply them in your current terminal:
```bash
source ~/.zshrc
echo $ANDROID_HOME   # should print: /Users/.../Library/Android/sdk
```

> Open a **new terminal window** for the change to be permanent.

---

### ❌ `Unable to locate a Java Runtime` / Java errors

**Fix:** Install Java JDK 17:
```bash
brew install --cask temurin@17
```
Then add to `~/.zshrc`:
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```
Then:
```bash
source ~/.zshrc
java -version
```

---

### ❌ `List of devices attached` (empty — no device found)

Possible causes:
- Emulator is not started → start it from Android Studio AVD Manager or via terminal (see above)
- Physical device: USB Debugging not enabled, or cable doesn't support data
- Physical device: didn't accept the "Allow USB debugging?" popup

**Fix:**
```bash
adb kill-server
adb start-server
adb devices
```

---

### ❌ Metro bundler errors / `Unable to resolve module`

```bash
# Clear all caches and restart
npx expo start --clear
```

---

### ❌ Build fails with Gradle errors

Make sure:
1. Java 17 is installed and `JAVA_HOME` is set
2. `ANDROID_HOME` points to the SDK
3. Run:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx expo run:android
   ```

---

### ❌ App crashes on launch (New Architecture issues)

This app has `"newArchEnabled": true`. Make sure you are using a **development build**, not Expo Go:
```bash
npx expo run:android
```

---

## 📝 Available Scripts

| Command                     | Description                                      |
|-----------------------------|--------------------------------------------------|
| `npx expo start`            | Start Metro + show QR (Expo Go mode)            |
| `npx expo start --android`  | Start + open Android emulator/device            |
| `npx expo start --clear`    | Start with cleared Metro cache                  |
| `npx expo run:android`      | Build & install native Android development build|
| `npm run lint`              | Run ESLint                                      |
| `npm run reset-project`     | Reset to blank app (moves current to app-example)|

---

## 🔐 Test Accounts

| Role     | Email           | Password |
|----------|-----------------|----------|
| Customer | user@test.com   | 123456   |
| Admin    | admin@test.com  | 123456   |
