<div align="center">
  <img src="./public/logo.svg" width="80" height="80" alt="Aether Logo">
  
  # AETHER WEATHER
  ### Atmospheric Intelligence for the Modern Desktop

  [![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![Tailwind](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-FF0055?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

  [Live Experience](https://react-weather-app-three-dusky.vercel.app/) • [Report Bug](https://github.com/roshan-soni-1/React-weather-app/issues) • [Request Feature](https://github.com/roshan-soni-1/React-weather-app/issues)

  ---
</div>

## Design Philosophy
Aether is a minimalist weather dashboard designed to prioritize clarity over visual clutter. Utilizing a Bento-style architecture, it organizes complex meteorological data into distinct, digestible tiles. The aesthetic focuses on editorial typography, high-contrast values, and organic textures.

### Key Features
- **Sophisticated UI:** A deep color palette (Indigo, Slate, Rose) paired with subtle grain textures.
- **Bento Architecture:** Logical grouping of data for instant situational awareness.
- **Data Visualization:** Interactive 24-hour temperature trends powered by Recharts.
- **Fluid Motion:** Purposeful entry transitions and layout animations via Framer Motion.
- **Precision Telemetry:** Real-time reverse geocoding via Nominatim/OSM for accurate location tracking.

---

## Technical Stack
| Category | Technology |
| :--- | :--- |
| **Core** | React 19, Tailwind CSS v4 |
| **Visualization** | Recharts, Lucide Icons |
| **Animation** | Framer Motion |
| **Build & Security** | Vite, Terser, CSP Hardening |

---

## Getting Started

### 1. Installation
```bash
git clone https://github.com/roshan-soni-1/React-weather-app.git
cd React-weather-app
```

### 2. Development
```bash
npm install
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## Security & Performance
Aether is optimized for security and delivery speed:
- **Content Security Policy:** Strict CSP headers to prevent unauthorized script execution.
- **Intelligent Chunking:** Heavy libraries are split into separate modules for optimized browser caching.
- **Production Stripping:** Automated removal of console logs and debuggers during the build process.
- **Privacy First:** Keyless location services to ensure user anonymity and zero tracking.

---

## Interface Preview

<div align="center">
  <table border="0">
    <tr>
      <td><img src="./screenshots/Search.png" width="350" style="border-radius:16px" alt="Search"></td>
      <td><img src="./screenshots/now.jpg" width="350" style="border-radius:16px" alt="Dashboard"></td>
    </tr>
    <tr>
      <td align="center">Minimal Search Interface</td>
      <td align="center">Primary Bento Dashboard</td>
    </tr>
    <tr>
      <td><img src="./screenshots/hourly.jpg" width="350" style="border-radius:16px" alt="Hourly"></td>
      <td><img src="./screenshots/daily.jpg" width="350" style="border-radius:16px" alt="Daily"></td>
    </tr>
    <tr>
      <td align="center">24h Temperature Timeline</td>
      <td align="center">Extended 7-Day Outlook</td>
    </tr>
  </table>
</div>

---

## License
Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <br>
  Built by <b>Roshan Soni</b>
  <br>
  <i>Translating meteorological data into atmospheric experiences.</i>
</div>
