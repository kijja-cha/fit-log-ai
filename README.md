# FitLog AI - Personal Fitness Tracker Dashboard

A modern, full-stack fitness tracking application built with Next.js 14, Firebase, and shadcn/ui. Track your workouts, analyze your progress, and get AI-powered insights for your fitness journey.

## ✨ Features

### 🔐 Authentication

- Email/password authentication with Firebase Auth
- Secure user session management
- Password reset functionality
- Clean, responsive auth UI

### 📊 Dashboard

- **Overview**: Comprehensive dashboard with key metrics and recent activities
- **Running Logs**: Detailed tracking of distance, pace, calories, and routes
- **Strength Training**: Log exercises, sets, reps, and training volume
- **Analytics**: Progress tracking with 7-day and 30-day trends
- **Insights Panel**: AI-powered recommendations and workout analysis

### 🎨 Modern UI/UX

- Built with shadcn/ui components for consistency
- Dark/light mode support with system preference detection
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessible design following WCAG guidelines

### 🏗️ Technical Architecture

- **Frontend**: Next.js 14 with App Router
- **Backend**: Firebase Firestore for real-time data
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS with CSS variables
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
   - Enable Authentication and Firestore

2. **Configure Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password

3. **Setup Firestore**
   - Go to Firestore Database
   - Create database in production mode
   - Start with default security rules (we'll update these)

4. **Get Firebase Config**
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
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-your_measurement_id
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
│   │   └── page.tsx            # Main page (dashboard/auth)
│   ├── components/             # React components
│   │   ├── auth/               # Authentication components
│   │   ├── dashboard/          # Dashboard components
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-run-logs.ts     # Run logs management
│   │   ├── use-strength-sessions.ts # Strength training management
│   │   └── use-toast.ts        # Toast notifications
│   ├── lib/                    # Utility libraries
│   │   ├── firebase.ts         # Firebase configuration
│   │   └── utils.ts            # Utility functions
│   ├── providers/              # React context providers
│   │   └── auth-provider.tsx   # Authentication context
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
  id?: string
  userId: string
  date: Timestamp
  distance: number // in kilometers
  duration: number // in minutes
  pace: number // minutes per kilometer
  calories: number
  heartRate?: {
    average?: number
    max?: number
  }
  route?: {
    name?: string
    elevation?: number
  }
  feeling: 'poor' | 'okay' | 'good' | 'great' | 'excellent'
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### StrengthSession

```typescript
interface StrengthSession {
  id?: string
  userId: string
  date: Timestamp
  duration: number // in minutes
  exercises: Exercise[]
  totalVolume: number // calculated weight x reps
  workoutType: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'sports'
  feeling: 'poor' | 'okay' | 'good' | 'great' | 'excellent'
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
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
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking
```

### Code Quality Tools

- **ESLint**: Linting with Next.js and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for code quality (optional)

### Architecture Principles

- **SOLID Principles**: Clean, maintainable code structure
- **Separation of Concerns**: Clear separation between UI, business logic, and data
- **Type Safety**: Comprehensive TypeScript coverage
- **Error Handling**: Graceful error handling with user feedback
- **Performance**: Optimized with React best practices and Next.js features

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect to Vercel**

   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Add all environment variables from `.env.local`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Firebase Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Run logs - users can only access their own logs
    match /run_logs/{logId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }

    // Strength sessions - users can only access their own sessions
    match /strength_sessions/{sessionId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🎯 Future Features

### Planned Enhancements

- [ ] **AI Insights**: Machine learning-powered workout recommendations
- [ ] **Social Features**: Share workouts and compete with friends
- [ ] **Wearable Integration**: Sync with fitness trackers and smartwatches
- [ ] **Nutrition Tracking**: Calorie and macro tracking
- [ ] **Goal Setting**: Custom fitness goals and progress tracking
- [ ] **Workout Plans**: Pre-built and custom workout programs
- [ ] **Export Data**: Download your fitness data
- [ ] **Progressive Web App**: Offline support and mobile app feel

### Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend platform
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Radix UI](https://radix-ui.com/) - Headless UI components

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/fit-log-ai/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Happy tracking! 💪**
