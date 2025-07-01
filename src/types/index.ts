import { Timestamp } from 'firebase/firestore'

// Base types for common fields
export interface BaseLog {
  id?: string
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
  notes?: string
}

// Running log data structure
export interface RunLog extends BaseLog {
  date: Timestamp | string
  distance?: number // legacy field for compatibility
  distance_km: number // in kilometers
  duration?: number // legacy field for compatibility (in minutes)
  pace?: number // legacy field for compatibility
  pace_min_per_km: string // in MM:SS format
  calories?: number // legacy field for compatibility
  calories_total: number
  calories_active: number
  run_type: 'run' | 'walk' | 'bike'
  source?: string
  hr_max?: number
  hr_avg?: number
  cadence_max?: number
  cadence_avg?: number
  stride_max?: number
  stride_avg?: number
  steps?: number
  vo2max?: number | null
  training_effect_aerobic?: number | null
  training_effect_anaerobic?: number | null
  training_load?: string
  recovery_hours?: number
  fileName?: string
  shoes?: string
  remark?: string
  heartRate?: {
    average?: number
    max?: number
  }
  route?: {
    name?: string
    elevation?: number
  }
  weather?: {
    temperature?: number
    conditions?: string
  }
  feeling: 'poor' | 'okay' | 'good' | 'great' | 'excellent'
}

// Strength training session - Updated to match real data structure
export interface StrengthSet {
  exercise: string
  set: number
  reps: number
  weight_kg: number
  rpe: number | string // Rate of Perceived Exertion (can be "x" for failure)
  category: string // muscle group
  remark?: string
}

export interface StrengthSession extends BaseLog {
  id: string
  session_id: string
  date: Timestamp | string
  category: string[] // muscle groups worked
  sets: StrengthSet[]

  // Legacy fields for compatibility
  duration?: number // in minutes
  exercises?: Exercise[] // legacy field
  totalVolume?: number // calculated total weight x reps
  bodyweight?: number // in kg
  feeling?: 'poor' | 'okay' | 'good' | 'great' | 'excellent'
  workoutType?: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'sports'
}

// Legacy Exercise interface for compatibility
export interface Exercise {
  name: string
  sets: Array<{
    reps: number
    weight: number // in kg
    restTime?: number // in seconds
  }>
  muscleGroups: string[]
  notes?: string
}

// Nutrition data (for future expansion)
export interface NutritionLog extends BaseLog {
  date: Timestamp
  meals: Array<{
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    time: Timestamp
  }>
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  waterIntake: number // in ml
}

// User profile and settings
export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: Timestamp
  settings: {
    units: 'metric' | 'imperial'
    privacy: 'public' | 'friends' | 'private'
    notifications: {
      workoutReminders: boolean
      progressUpdates: boolean
      socialUpdates: boolean
    }
  }
  goals: {
    weeklyRunDistance?: number
    weeklyWorkouts?: number
    targetWeight?: number
    dailyCalories?: number
    dailyProtein?: number
  }
  stats: {
    totalWorkouts: number
    totalDistance: number
    totalCaloriesBurned: number
    currentStreak: number
    longestStreak: number
  }
}

// Dashboard analytics types
export interface DashboardStats {
  last7Days: {
    totalWorkouts: number
    totalDistance: number
    totalCalories: number
    averagePace: number
    totalVolume: number
  }
  last30Days: {
    totalWorkouts: number
    totalDistance: number
    totalCalories: number
    averagePace: number
    totalVolume: number
  }
  allTime: {
    totalWorkouts: number
    totalDistance: number
    totalCalories: number
    bestPace: number
    maxVolume: number
  }
}

// Chart data types for visualization
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface WorkoutTrend {
  date: string
  runs: number
  strength: number
  totalWorkouts: number
}

// Filter and search types
export interface LogFilter {
  dateFrom?: Date
  dateTo?: Date
  logType?: 'run' | 'strength' | 'nutrition'
  feeling?: RunLog['feeling']
  workoutType?: StrengthSession['workoutType']
  minDistance?: number
  maxDistance?: number
  minDuration?: number
  maxDuration?: number
}

// API response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

// Auth context types
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

// Component prop types
export interface PageProps {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
