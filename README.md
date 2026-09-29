# 🌾 Smart Slot Reminder & Procurement Turn Alert System

> An intelligent, farmer-friendly agricultural procurement management system designed for Indian APMC Mandis, PACS, and government procurement centres. Featuring multi-crop selection, smart slot scheduling, automated SMS reminders, live queue tracking, turn alerts with audio alarms, operator weighbridge processing, and digital e-receipt generation.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. Multi-Crop Selection System](#1-multi-crop-selection-system)
  - [2. Mandi & Centre Recommendation Engine](#2-mandi--centre-recommendation-engine)
  - [3. Slot Booking & Scheduling](#3-slot-booking--scheduling)
  - [4. Live Queue Tracking & Turn Alert System](#4-live-queue-tracking--turn-alert-system)
  - [5. SMS & Notification Simulation](#5-sms--notification-simulation)
  - [6. Mandi Operator Dashboard & Digital Receipting](#6-mandi-operator-dashboard--digital-receipting)
  - [7. Administrative Analytics & Database Inspector](#7-administrative-analytics--database-inspector)
  - [8. Progressive Web App (PWA) & Mobile First](#8-progressive-web-app-pwa--mobile-first)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Crop Management Architecture](#-crop-management-architecture)
  - [Where the Crop List is Stored](#where-the-crop-list-is-stored)
  - [How Crops are Connected to Booking](#how-crops-are-connected-to-booking)
  - [Frontend vs Database Storage](#frontend-vs-database-storage)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [License](#-license)

---

## 🌟 Overview

Harvest season creates severe bottlenecks at Indian grain mandis and procurement centres, resulting in multi-day tractor queues, spoilage, traffic congestion, and farmer distress. 

The **Smart Slot Reminder & Procurement Turn Alert System** replaces chaotic physical waiting with a seamless digital scheduling pipeline:
1. **Farmers** select their specific crop (out of 58+ Indian crops), enter harvest volume, receive AI/smart mandi recommendations based on distance and wait time, and book a verified time slot.
2. **Automated Reminders** trigger via SMS/WhatsApp simulations with slot confirmation, dispatch readiness reminders, and gate pass instructions.
3. **Queue Monitoring** provides real-time tractor token positions, live wait-time countdowns, and high-visibility **Audible Turn Alarms** when the farmer's gate or weighbridge is ready.
4. **Mandi Operators** verify farmers at gate check-in, record moisture/quality analysis, log net weighbridge weight, and immediately issue digital procurement receipts (J-Form / e-Receipt) with QR validation.

---

## 🚀 Key Features

### 1. Multi-Crop Selection System
- **58+ Indian Crops Across 8 Agricultural Categories**:
  - **Cereals**: Wheat (गेहूं), Rice / Paddy (धान), Maize (मक्का), Barley (जौ), Sorghum / Jowar (ज्वार), Pearl Millet / Bajra (बाजरा), Finger Millet / Ragi (रागी).
  - **Pulses**: Chickpea / Chana (चना), Pigeon Pea / Arhar / Tur (अरहर/तूर), Lentil / Masoor (मसूर), Green Gram / Moong (मूंग), Black Gram / Urad (उड़द), Peas (मटर).
  - **Oilseeds**: Mustard (सरसों), Groundnut (मूंगफली), Soybean (सोयाबीन), Sunflower (सूरजमुखी), Sesame (तिल), Linseed (अलसी).
  - **Commercial / Cash Crops**: Sugarcane (गन्ना), Cotton (कपास), Jute (जूट), Tobacco (तंबाकू).
  - **Vegetables**: Potato, Tomato, Onion, Garlic, Cabbage, Cauliflower, Brinjal, Okra, Peas, Carrot, Radish, Spinach, Chilli.
  - **Fruits**: Mango, Banana, Apple, Orange, Guava, Grapes, Papaya, Pomegranate, Watermelon, Muskmelon.
  - **Spices**: Turmeric, Ginger, Coriander, Cumin, Black Pepper, Cardamom, Chilli.
  - **Other Crops**: Tea, Coffee, Coconut, Cashew, Rubber.
- **Bilingual Search & Quick Filtering**: Search in English or Hindi, or filter by category chips.
- **MSP & Pricing Guidance**: Displays active Minimum Support Price (MSP) benchmarks per quintal.
- **Scalable Architecture**: Easily add more crops by appending to `src/data/cropsData.ts`.

### 2. Mandi & Centre Recommendation Engine
- Analyzes the farmer's village location, crop type, and declared quantity.
- Ranks nearby APMC Mandis and PACS centres by:
  - Distance (km) & travel transit time
  - Current queue load and waiting times
  - Dedicated unloading bays and commodity compatibility
- Badges the optimal choice with *"Recommended: Lowest Wait & Optimal Capacity"*.

### 3. Slot Booking & Scheduling
- Selectable morning, afternoon, and evening slots.
- Capacity management: prevents gate overcrowding by enforcing maximum slots per hour.
- Generates a unique **Booking ID** and digital gate pass token immediately upon booking.

### 4. Live Queue Tracking & Turn Alert System
- Live queue display with token sequence (e.g., `TK-101`, `TK-102`).
- Real-time estimated wait time, vehicles ahead counter, and assigned gate/weighbridge bay.
- **Audible Turn Alarm Modal**: When the farmer's token status transitions to `CALLED`, the screen triggers a visual turn alert with an audible alert horn to ensure farmers resting nearby do not miss their turn.

### 5. SMS & Notification Simulation
- Interactive **Phone SMS Simulator** panel demonstrating multi-lingual notifications sent to the farmer's mobile:
  - Immediate booking confirmation with slot date/time and gate pass ID.
  - 2-hour dispatch reminder with route and weather advisory.
  - Real-time turn call alert with assigned unloading bay number.
  - Final procurement summary with payable amount and digital receipt link.

### 6. Mandi Operator Dashboard & Digital Receipting
- Integrated operator terminal for mandi officials:
  - **Gate Check-in**: Scan QR or enter Token ID to verify arriving tractors.
  - **Quality Inspection**: Input moisture percentage, foreign matter, and grade (FAQ / Grade A).
  - **Weighbridge Integration**: Record gross weight, tare weight, and net crop weight.
  - **Instant Payment Calculation**: Automatic computation based on MSP rate minus standard deductions.
  - **Digital e-Receipt (J-Form)**: Generates a printable and QR-scannable procurement receipt.

### 7. Administrative Analytics & Database Inspector
- Live dashboard displaying:
  - Total arrivals and total tonnage procured.
  - Crop-wise procurement volume distribution.
  - Centre-wise queue load and capacity utilization.
  - In-browser **Database Inspector** allowing inspection and verification of underlying records in `procurement_pg_db.json`.

### 8. Progressive Web App (PWA) & Mobile First
- Fully responsive design optimized for smartphones used by farmers in the field.
- Installable PWA support with service worker caching for unreliable rural networks.
- High-contrast typography and intuitive icons.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion (Framer Motion) |
| **Bundler & Tooling** | Vite 6, tsx, esbuild, TypeScript 5.8 |
| **Backend** | Express 4 running on Node.js via full-stack `server.ts` |
| **Data Persistence** | Persistent JSON store (`procurement_pg_db.json`) with PostgreSQL client capability (`pg`) |
| **PWA & Offline** | `vite-plugin-pwa`, Service Workers, Web App Manifest |
| **Styling & Fonts** | Tailwind CSS v4, Plus Jakarta Sans, JetBrains Mono |

---

## 📁 Project Structure

```text
├── index.html                   # HTML entry point with meta tags and font imports
├── metadata.json                # App metadata and system permissions
├── package.json                 # Project dependencies and run scripts
├── procurement_pg_db.json       # JSON-based database for appointments, queues, and receipts
├── server.ts                    # Express API server & Vite development middleware
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite build and PWA configuration
├── public/                      # Static assets, icons, and manifest
└── src/
    ├── main.tsx                 # React application mounting point
    ├── App.tsx                  # Root component, routing, role switching, and global state
    ├── index.css                # Tailwind CSS imports and utility styles
    ├── types/
    │   └── index.ts             # TypeScript interfaces (Crop, Appointment, Queue, Centre)
    ├── data/
    │   ├── cropsData.ts         # 58+ Indian crops catalogue categorized with MSP & Hindi names
    │   └── mockProcurementData.ts # Default mandi centres, initial queue data, and slots
    ├── components/
    │   ├── CropSelector.tsx             # Searchable multi-crop selector with categories & modal
    │   ├── CentreRecommendationCard.tsx # Mandi recommendation & distance comparison
    │   ├── SlotBookingCard.tsx          # Date and time slot booking component
    │   ├── QueueMonitor.tsx             # Live token queue and turn tracking
    │   ├── TurnAlarmModal.tsx           # Full-screen audio-visual turn alert modal
    │   ├── PhoneSMSSimulator.tsx        # Simulated mobile phone showing incoming SMS alerts
    │   ├── OperatorDashboard.tsx        # Gate check-in, quality check, and weighbridge logging
    │   ├── DigitalReceiptModal.tsx      # Formal J-Form / digital procurement receipt with QR
    │   ├── AdminDashboard.tsx           # Centre performance and crop procurement metrics
    │   ├── DatabaseInspector.tsx        # Live inspector for underlying database records
    │   ├── LanguageSelector.tsx         # English / Hindi language toggle
    │   ├── PWAInstallButton.tsx         # In-app PWA install trigger
    │   └── ErrorBoundary.tsx            # React runtime error boundary
    ├── hooks/                           # Custom React hooks (sound alerts, timers, queue poll)
    ├── translations/                    # English and Hindi UI strings
    └── utils/                           # Formatting, audio synthesizer, and date helpers
```

---

## 🌾 Crop Management Architecture

### Where the Crop List is Stored
1. **Source of Truth**: The central crop catalogue is stored in:
   ```text
   src/data/cropsData.ts
   ```
   Each entry defines:
   - Unique identifier (`id`)
   - English name (`name`)
   - Hindi name (`nameHi`)
   - Agricultural Category (`category`)
   - Minimum Support Price (`mspPerQuintal`)
   - Standard packaging unit (`standardUnit`)
   - Descriptive details & peak harvesting season

2. **API Endpoint**: Served to clients dynamically through the Express backend at:
   ```http
   GET /api/crops
   ```

### How Crops are Connected to Booking
1. **Selection**: When the farmer selects a crop in `CropSelector.tsx`, the crop item and category are bound to the booking state.
2. **Payload**: During booking submission (`POST /api/appointments`), the selected `crop_type`, category, and declared quantity (quintals) are transmitted.
3. **Queue Generation**: The system creates a queue ticket (`TK-XXX`) with the linked crop type and estimated unloading duration based on crop volume.
4. **Operator Verification**: When the farmer arrives at the mandi, the operator views the booked crop type, inputs the actual gross/tare weight, and the system calculates payable dues using that specific crop's MSP.

### Frontend vs Database Storage
- **Static Catalogue**: Stored centrally in the codebase (`src/data/cropsData.ts`) and served via `/api/crops`. This guarantees zero latency during client-side search and category filtering while avoiding unnecessary database overhead.
- **Transactional Records**: The farmer's selected crop (`crop_type`), booked volume, and final weighed quantity are persisted in the **database** (`procurement_pg_db.json`) across appointments, queue entries, and final procurement receipts.

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun** / **yarn**

### Installation

Clone the repository and install all dependencies:

```bash
npm install
```

### Development Server

Start the full-stack development server (Express API + Vite HMR on Port 3000):

```bash
npm run dev
```

Visit `http://localhost:3000` in your web browser.

### Production Build

Build the client assets and compile the server bundle:

```bash
npm run build
npm start
```

### Type Checking & Linting

Run TypeScript verification:

```bash
npm run lint
```

---

## 📡 API Endpoints

The full-stack Express backend (`server.ts`) exposes the following REST endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/crops` | Retrieve all 58+ available crops and categories |
| `GET` | `/api/centres` | List all procurement centres and mandis with live capacity |
| `GET` | `/api/appointments` | Fetch all booked appointments (filter by phone or date) |
| `POST` | `/api/appointments` | Create a new slot booking with chosen crop and time |
| `GET` | `/api/queue` | Get live queue tokens and active serving status |
| `POST` | `/api/queue/call-next` | Mandi operator: advance the queue and alert the next token |
| `POST` | `/api/operator/checkin` | Check in arriving farmer vehicle at gate |
| `POST` | `/api/procurement-complete` | Record final weight, quality, and issue digital receipt |
| `GET` | `/api/receipts/:id` | Fetch digital procurement receipt by ID |
| `GET` | `/api/admin/metrics` | Retrieve overall mandi throughput and crop analytics |
| `GET` | `/api/db/export` | Export raw database state for inspection |

---

## ⚙️ Environment Variables

A `.env.example` file is included in the root directory:

```env
# GEMINI_API_KEY: Optional Gemini API key for smart advice / LLM assistance
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# APP_URL: The hosting URL of the application
APP_URL="http://localhost:3000"
```

---

## 👥 User Roles

- **Farmer View**: Search crops, find closest mandi, book slot, receive SMS reminders, monitor token position, hear turn alarm, download digital receipt.
- **Mandi Operator View**: Search tokens, verify moisture/quality, enter weighbridge scale readings, complete procurement, issue digital receipts.
- **Mandi Administrator View**: Monitor overall daily procurement tonnage, bay capacity, slot utilization, and inspect raw database records.

---

## 📄 License

This project is licensed under the MIT License.
