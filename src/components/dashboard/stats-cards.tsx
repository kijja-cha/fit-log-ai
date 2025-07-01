'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { RunLog, StrengthSession } from '@/types'
import {
  formatDistance,
  formatDuration,
  formatCalories,
  formatWeight,
} from '@/lib/utils'
import { Activity, Zap, Target, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  runLogs: RunLog[]
  strengthSessions: StrengthSession[]
  isLoading: boolean
}

export function StatsCards({
  runLogs,
  strengthSessions,
  isLoading,
}: StatsCardsProps) {
  const stats = useMemo(() => {
    if (isLoading) return null

    // Calculate date ranges
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Filter data by date ranges
    const recent7DaysRuns = runLogs.filter(run => {
      const runDate =
        run.date && typeof run.date === 'object' && 'toDate' in run.date
          ? run.date.toDate()
          : new Date(run.date)
      return runDate >= last7Days
    })

    const recent7DaysStrength = strengthSessions.filter(session => {
      const sessionDate =
        session.date &&
        typeof session.date === 'object' &&
        'toDate' in session.date
          ? session.date.toDate()
          : new Date(session.date)
      return sessionDate >= last7Days
    })

    const recent30DaysRuns = runLogs.filter(run => {
      const runDate =
        run.date && typeof run.date === 'object' && 'toDate' in run.date
          ? run.date.toDate()
          : new Date(run.date)
      return runDate >= last30Days
    })

    const recent30DaysStrength = strengthSessions.filter(session => {
      const sessionDate =
        session.date &&
        typeof session.date === 'object' &&
        'toDate' in session.date
          ? session.date.toDate()
          : new Date(session.date)
      return sessionDate >= last30Days
    })

    // Calculate metrics
    const totalWorkouts7Days =
      recent7DaysRuns.length + recent7DaysStrength.length
    const totalWorkouts30Days =
      recent30DaysRuns.length + recent30DaysStrength.length

    const totalDistance7Days = recent7DaysRuns.reduce(
      (sum, run) => sum + ((run as any).distance_km || run.distance || 0),
      0
    )
    const totalDistance30Days = recent30DaysRuns.reduce(
      (sum, run) => sum + ((run as any).distance_km || run.distance || 0),
      0
    )

    const totalCalories7Days = [
      ...recent7DaysRuns.map(
        run => (run as any).calories_total || run.calories || 0
      ),
      ...recent7DaysStrength.map(
        session => (session.duration || 0) * 8 // Rough estimate: 8 calories per minute for strength training
      ),
    ].reduce((sum, cal) => sum + cal, 0)

    const totalVolume7Days = recent7DaysStrength.reduce((sum, session) => {
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

    // Calculate previous period for comparison
    const prev7Days = new Date(last7Days.getTime() - 7 * 24 * 60 * 60 * 1000)
    const prevWorkouts = [
      ...runLogs.filter(run => {
        const runDate =
          run.date && typeof run.date === 'object' && 'toDate' in run.date
            ? run.date.toDate()
            : new Date(run.date)
        return runDate >= prev7Days && runDate < last7Days
      }),
      ...strengthSessions.filter(session => {
        const sessionDate =
          session.date &&
          typeof session.date === 'object' &&
          'toDate' in session.date
            ? session.date.toDate()
            : new Date(session.date)
        return sessionDate >= prev7Days && sessionDate < last7Days
      }),
    ].length

    const workoutTrend = totalWorkouts7Days - prevWorkouts

    return {
      totalWorkouts7Days,
      totalWorkouts30Days,
      totalDistance7Days,
      totalDistance30Days,
      totalCalories7Days,
      totalVolume7Days,
      workoutTrend,
    }
  }, [runLogs, strengthSessions, isLoading])

  const cards = [
    {
      title: 'Total Workouts',
      value: stats?.totalWorkouts7Days || 0,
      description: 'Last 7 days',
      icon: Activity,
      trend: stats?.workoutTrend || 0,
      format: (value: number) => value.toString(),
    },
    {
      title: 'Distance Covered',
      value: stats?.totalDistance7Days || 0,
      description: 'Last 7 days',
      icon: Target,
      format: formatDistance,
    },
    {
      title: 'Calories Burned',
      value: stats?.totalCalories7Days || 0,
      description: 'Last 7 days',
      icon: Zap,
      format: formatCalories,
    },
    {
      title: 'Training Volume',
      value: stats?.totalVolume7Days || 0,
      description: 'Last 7 days (kg)',
      icon: TrendingUp,
      format: (value: number) => `${Math.round(value)}kg`,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  card.format(card.value)
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.description}
                {card.trend !== undefined && !isLoading && (
                  <span
                    className={`ml-2 ${card.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {card.trend >= 0 ? '+' : ''}
                    {card.trend} from last week
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
