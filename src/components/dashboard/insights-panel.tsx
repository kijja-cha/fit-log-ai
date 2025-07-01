'use client'

import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RunLog, StrengthSession } from '@/types'
import { formatDistance, formatDuration } from '@/lib/utils'
import { TrendingUp, Calendar, Award, Target } from 'lucide-react'

interface InsightsPanelProps {
  runLogs: RunLog[]
  strengthSessions: StrengthSession[]
  expanded?: boolean
}

export function InsightsPanel({
  runLogs,
  strengthSessions,
  expanded = false,
}: InsightsPanelProps) {
  const insights = useMemo(() => {
    const now = new Date()
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Filter recent data
    const recentRuns = runLogs.filter(run => {
      const runDate =
        run.date && typeof run.date === 'object' && 'toDate' in run.date
          ? run.date.toDate()
          : new Date(run.date)
      return runDate >= last30Days
    })

    const recentStrength = strengthSessions.filter(session => {
      const sessionDate =
        session.date &&
        typeof session.date === 'object' &&
        'toDate' in session.date
          ? session.date.toDate()
          : new Date(session.date)
      return sessionDate >= last30Days
    })

    // Calculate insights
    const totalWorkouts = recentRuns.length + recentStrength.length
    const totalDistance = recentRuns.reduce(
      (sum, run) => sum + ((run as any).distance_km || run.distance || 0),
      0
    )

    // Convert pace string "MM:SS" to number for averaging
    const paceNumbers = recentRuns
      .map(run => {
        if ((run as any).pace_min_per_km) {
          const parts = (run as any).pace_min_per_km.split(':')
          return parseFloat(parts[0]) + parseFloat(parts[1]) / 60
        }
        return run.pace || 0
      })
      .filter(pace => pace > 0)

    const averagePace =
      paceNumbers.length > 0
        ? paceNumbers.reduce((sum, pace) => sum + pace, 0) / paceNumbers.length
        : 0

    const totalVolume = recentStrength.reduce((sum, session) => {
      if (session.totalVolume) return sum + session.totalVolume
      const sets = (session as any).sets || []
      // Exclude bodyweight exercises from volume calculation
      const weightTrainingSets = sets.filter(
        (set: any) => !['Push-up', 'Pull-up', 'Plank'].includes(set.exercise)
      )
      const volume = weightTrainingSets.reduce(
        (setSum: number, set: any) => setSum + set.reps * set.weight_kg,
        0
      )
      return sum + volume
    }, 0)

    // Workout frequency (workouts per week)
    const weeksInPeriod = 4.3 // approximately 30 days / 7
    const workoutsPerWeek = totalWorkouts / weeksInPeriod

    // Most common feeling
    const allWorkouts = [...recentRuns, ...recentStrength]
    const feelingCounts = allWorkouts.reduce(
      (acc, workout) => {
        const feeling = workout.feeling || 'good'
        acc[feeling] = (acc[feeling] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const mostCommonFeeling =
      Object.entries(feelingCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      'good'

    // Best run (fastest pace)
    const runsWithPace = recentRuns.filter(run => {
      const pace = (run as any).pace_min_per_km || run.pace
      return (
        pace && (typeof pace === 'string' ? pace.includes(':') : !isNaN(pace))
      )
    })

    const bestRun =
      runsWithPace.length > 0
        ? runsWithPace.reduce((best, run) => {
            const currentPace = (run as any).pace_min_per_km
              ? (() => {
                  const parts = (run as any).pace_min_per_km.split(':')
                  return parseFloat(parts[0]) + parseFloat(parts[1]) / 60
                })()
              : run.pace || Infinity
            const bestPace = (best as any).pace_min_per_km
              ? (() => {
                  const parts = (best as any).pace_min_per_km.split(':')
                  return parseFloat(parts[0]) + parseFloat(parts[1]) / 60
                })()
              : best.pace || Infinity
            return currentPace < bestPace ? run : best
          })
        : null

    // Longest run
    const runsWithDistance = recentRuns.filter(run => {
      const distance = (run as any).distance_km || run.distance
      return distance && !isNaN(distance)
    })

    const longestRun =
      runsWithDistance.length > 0
        ? runsWithDistance.reduce((longest, run) => {
            const currentDistance =
              (run as any).distance_km || run.distance || 0
            const longestDistance =
              (longest as any).distance_km || longest.distance || 0
            return currentDistance > longestDistance ? run : longest
          })
        : null

    return {
      totalWorkouts,
      totalDistance,
      averagePace,
      totalVolume,
      workoutsPerWeek,
      mostCommonFeeling,
      bestRun,
      longestRun,
    }
  }, [runLogs, strengthSessions])

  const quickInsights = [
    {
      icon: Calendar,
      label: 'Workout Frequency',
      value: `${(insights.workoutsPerWeek || 0).toFixed(1)} per week`,
      description: 'Your current training rhythm',
    },
    {
      icon: TrendingUp,
      label: 'Most Common Feeling',
      value: insights.mostCommonFeeling,
      description: 'How you typically feel after workouts',
    },
    {
      icon: Target,
      label: 'Best Pace',
      value: insights.bestRun
        ? (insights.bestRun as any).pace_min_per_km
          ? `${(insights.bestRun as any).pace_min_per_km} min/km`
          : insights.bestRun.pace
            ? `${insights.bestRun.pace.toFixed(1)} min/km`
            : 'No data'
        : 'No data',
      description: 'Your fastest pace this month',
    },
    {
      icon: Award,
      label: 'Longest Run',
      value: insights.longestRun
        ? formatDistance(
            (insights.longestRun as any).distance_km,
            (insights.longestRun as any).distance
          )
        : 'No data',
      description: 'Your longest distance this month',
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Insights
          </CardTitle>
          <CardDescription>Key metrics from your last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quickInsights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {insight.label}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {insight.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {expanded && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
            <CardDescription>Your fitness journey overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Workouts</p>
                <p className="text-2xl font-bold">{insights.totalWorkouts}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Distance</p>
                <p className="text-2xl font-bold">
                  {formatDistance(insights.totalDistance)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Average Pace</p>
                <p className="text-2xl font-bold">
                  {insights.averagePace > 0
                    ? `${insights.averagePace.toFixed(1)} min/km`
                    : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Training Volume</p>
                <p className="text-2xl font-bold">
                  {Math.round(insights.totalVolume || 0)}kg
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Recommendations</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                {insights.workoutsPerWeek < 3 && (
                  <p>
                    • Consider increasing your workout frequency to 3-4 times
                    per week
                  </p>
                )}
                {insights.totalWorkouts > 0 &&
                  insights.mostCommonFeeling === 'poor' && (
                    <p>
                      • You're feeling tired after workouts - consider reducing
                      intensity or adding rest days
                    </p>
                  )}
                {insights.totalWorkouts > 0 &&
                  insights.mostCommonFeeling === 'excellent' && (
                    <p>
                      • Great energy levels! You might be ready to increase
                      workout intensity
                    </p>
                  )}
                {runLogs.length === 0 && (
                  <p>
                    • Try adding some cardio workouts to improve cardiovascular
                    health
                  </p>
                )}
                {strengthSessions.length === 0 && (
                  <p>
                    • Consider adding strength training to build muscle and
                    improve metabolism
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
