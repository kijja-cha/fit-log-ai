import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

/**
 * Merge and dedupe className values using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format distance in kilometers with appropriate precision
 */
export function formatDistance(
  distance: number | undefined,
  legacyDistance?: number
): string {
  const dist = distance || legacyDistance
  if (!dist || isNaN(dist)) return '0km'
  if (dist < 1) {
    return `${Math.round(dist * 1000)}m`
  }
  return `${dist.toFixed(1)}km`
}

/**
 * Format pace from string "MM:SS" or number to readable format
 */
export function formatPace(
  pace: string | number | undefined,
  legacyPace?: number
): string {
  // Handle string format "MM:SS"
  if (typeof pace === 'string' && pace.includes(':')) {
    return `${pace}/km`
  }

  // Handle number format (legacy)
  const numPace = typeof pace === 'number' ? pace : legacyPace
  if (!numPace || isNaN(numPace)) return '0:00/km'

  const minutes = Math.floor(numPace)
  const seconds = Math.round((numPace - minutes) * 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`
}

/**
 * Convert HH:MM:SS string to minutes
 */
export function parseDurationToMinutes(duration: string): number {
  if (!duration || typeof duration !== 'string') return 0

  const parts = duration.split(':')
  if (parts.length === 3) {
    const hours = parseInt(parts[0]) || 0
    const minutes = parseInt(parts[1]) || 0
    const seconds = parseInt(parts[2]) || 0
    return hours * 60 + minutes + seconds / 60
  }
  return 0
}

/**
 * Format duration from string "HH:MM:SS" or minutes to readable format
 */
export function formatDuration(
  duration: string | number | undefined,
  legacyDuration?: number
): string {
  // Handle string format "HH:MM:SS"
  if (typeof duration === 'string' && duration.includes(':')) {
    return duration
  }

  // Handle number format (minutes)
  const minutes = typeof duration === 'number' ? duration : legacyDuration
  if (!minutes || isNaN(minutes)) return '0min'

  if (minutes < 60) {
    return `${Math.round(minutes)}min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = Math.round(minutes % 60)
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
}

/**
 * Format calories with appropriate precision
 */
export function formatCalories(
  calories: number | undefined,
  legacyCalories?: number
): string {
  const cals = calories || legacyCalories
  if (!cals || isNaN(cals)) return '0 cal'
  return `${Math.round(cals)} cal`
}

/**
 * Format weight with kg suffix
 */
export function formatWeight(weight: number): string {
  return `${weight}kg`
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  if (isToday(date)) {
    return 'Today'
  }
  if (isYesterday(date)) {
    return 'Yesterday'
  }
  return format(date, 'MMM dd, yyyy')
}

/**
 * Format date for chart labels
 */
export function formatChartDate(date: Date): string {
  return format(date, 'MMM dd')
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true })
}

/**
 * Calculate pace from distance and duration
 */
export function calculatePace(distance: number, duration: number): number {
  if (distance === 0) return 0
  return duration / distance
}

/**
 * Calculate total volume for strength training
 */
export function calculateVolume(
  exercises: Array<{
    sets: Array<{ reps: number; weight: number }>
  }>
): number {
  return exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      return setTotal + set.reps * set.weight
    }, 0)
    return total + exerciseVolume
  }, 0)
}

/**
 * Get feeling emoji for workout rating
 */
export function getFeelingEmoji(feeling: string): string {
  const emojiMap: Record<string, string> = {
    poor: '😫',
    okay: '😐',
    good: '🙂',
    great: '😊',
    excellent: '🤩',
  }
  return emojiMap[feeling] || '🙂'
}

/**
 * Get workout type color for badges
 */
export function getWorkoutTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    strength: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    cardio: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    hiit: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    flexibility:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    sports:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  }
  return (
    colorMap[type] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  )
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Generate date range for charts
 */
export function generateDateRange(days: number): Date[] {
  const dates: Date[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date)
  }

  return dates
}

/**
 * Safe number parsing with fallback
 */
export function parseNumber(value: string | number, fallback = 0): number {
  if (typeof value === 'number') return value
  const parsed = parseFloat(value)
  return isNaN(parsed) ? fallback : parsed
}
