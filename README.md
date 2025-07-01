# FitLog AI - Personal Fitness Tracker Dashboard

A modern fitness tracking dashboard built with Next.js 14, Firebase, and shadcn/ui. View and analyze your fitness data with a clean, responsive interface.

## ✨ Features

### 📊 Dashboard

- **Overview**: Comprehensive dashboard with key fitness metrics and statistics
- **Running Logs**: View mock running data with distance, pace, and calories
- **Strength Training**: Display sample strength training sessions with exercises and volumes
- **Analytics**: Visual charts showing fitness trends and progress
- **Session Details**: Drill-down modal to view detailed workout information

### 🎨 Modern UI/UX

- Built with shadcn/ui components for consistency
- Dark/light mode support with system preference detection
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessible design following WCAG guidelines

### 🏗️ Technical Architecture

- **Frontend**: Next.js 14 with App Router
- **Database**: Firebase Firestore configuration ready
- **Styling**: Tailwind CSS with shadcn/ui components
- **Type Safety**: Full TypeScript implementation
- **Code Quality**: ESLint, Prettier, and strict TypeScript config

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fit-log-ai.git
cd fit-log-ai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database (optional for demo)

2. **Setup Firestore (Optional)**
   - Go to Firestore Database
   - Create database in production mode
   - Use for storing real fitness data

3. **Get Firebase Config**
   - Go to Project Settings > General
   - Scroll to "Your apps" and add a web app
   - Copy the Firebase configuration object

### 4. Environment Variables

```bash
cp .env.example .env.local
```

Update `.env.local` with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_USE_PRODUCTION_FIREBASE=true
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
fit-log-ai/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── globals.css         # Global styles with CSS variables
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx            # Main dashboard page
│   ├── components/             # React components
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── dashboard.tsx   # Main dashboard component
│   │   │   ├── navbar.tsx      # Navigation bar
│   │   │   ├── stats-cards.tsx # Statistics cards
│   │   │   ├── workout-table.tsx # Workout data table
│   │   │   ├── insights-panel.tsx # Analytics panel
│   │   │   └── session-detail-modal.tsx # Session details modal
│   │   ├── theme-provider.tsx  # Theme context provider
│   │   ├── theme-toggle.tsx    # Dark/light mode toggle
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-run-logs.ts     # Run logs data management
│   │   ├── use-strength-sessions.ts # Strength training data
│   │   └── use-toast.ts        # Toast notifications
│   ├── lib/                    # Utility libraries
│   │   ├── firebase.ts         # Firebase configuration
│   │   └── utils.ts            # Utility functions
│   ├── services/               # Business logic layer
│   │   └── firebase-service.ts # Firebase CRUD operations
│   └── types/                  # TypeScript type definitions
│       └── index.ts            # All type definitions
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🗄️ Data Models

### RunLog

```typescript
interface RunLog {
  id: string
  date: string
  distance: number // in kilometers
  duration: number // in minutes
  pace: number // minutes per kilometer
  calories: number
  heartRate?: {
    average?: number
    max?: number
  }
  route?: string
  feeling: 'poor' | 'okay' | 'good' | 'great' | 'excellent'
  notes?: string
}
```

### StrengthSession

```typescript
interface StrengthSession {
  id: string
  date: string
  duration: number // in minutes
  exercises: Exercise[]
  totalVolume: number // calculated weight x reps
  workoutType: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'sports'
  feeling: 'poor' | 'okay' | 'good' | 'great' | 'excellent'
  notes?: string
}

interface Exercise {
  name: string
  sets: number
  reps: number
  weight: number // in kg
}
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

## 🚀 Deployment

### Deploy to Vercel

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Environment Variables on Vercel**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID
   NEXT_PUBLIC_USE_PRODUCTION_FIREBASE
   ```

## 📝 Current Status

- ✅ Dashboard UI with fitness statistics
- ✅ Session detail modal with drill-down functionality
- ✅ Mock data for running logs and strength training
- ✅ Responsive design with dark/light theme toggle
- ✅ Firebase configuration ready
- 🔧 User authentication (planned)
- 🔧 Real data persistence (planned)
- 🔧 AI-powered insights (planned)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy tracking! 💪**
