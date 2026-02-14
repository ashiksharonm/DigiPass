# DigiPass 2.0 - Digital Bus Pass System

A modern mobile-first application for managing digital bus passes, designed with React Native and Expo.

## Features

### For Passengers
- **Smart Dashboard**: View active passes, recent trips, and savings at a glance.
- **Easy Pass Application**: 3-step process to select route, plan, and pay.
- **Payment Simulation**: Razorpay-style secure payment interface.
- **QR Code Generation**: Secure, encrypted QR codes with auto-refresh for pass verification.
- **Travel History**: Comprehensive log of all trips and expenses.
- **Analytics**: Visual insights into travel spending and habits.

### For Conductors
- **Dedicated Dashboard**: Quick access to verification tools.
- **QR Scanner**: Fast and reliable pass verification using camera.
- **Validation History**: Track valid and invalid scans.
- **Secure Login**: Pre-issued government credentials for security.

## Tech Stack
- **Framework**: React Native with Expo (SDK 50)
- **Language**: TypeScript
- **Styling**: Custom theme system with Linear Gradients
- **Navigation**: React Navigation (Stack)
- **Backend**: Firebase Auth (Google + Email) & Firestore Database
- **Maps**: Google Maps API Integration for route planning
- **Storage**: AsyncStorage for local settings

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on how to deploy to Vercel (Web) or build an APK (Android).

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/digipass.git
   cd digipass
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   *Note: If you encounter issues with `watchman` on macOS, the project is configured to fallback to Node's file watcher.*

### Running the App

#### Web (Recommended for Demo)
To run the web version:
```bash
npx expo export --platform web
npx serve dist
```
Open `http://localhost:3000` in your browser.

#### Mobile
To run on iOS/Android:
```bash
npx expo start
```
Scan the QR code with Expo Go app.

## Project Structure
```
src/
├── components/   # Reusable UI components (Cards, Buttons, Headers)
├── constants/    # Theme, colors, and configuration
├── context/      # React Contex for Auth and State Management
├── screens/      # Application screens for all roles
├── services/     # Mock data and Firebase configuration
└── ...
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.
