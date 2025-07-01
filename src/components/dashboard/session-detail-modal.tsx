'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Clock, MapPin, Zap, Target, TrendingUp } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { RunLog, StrengthSession } from '@/types'

interface SessionDetailModalProps {
  session: RunLog | StrengthSession | null
  onClose: () => void
  recentSessions?: (RunLog | StrengthSession)[]
}

export function SessionDetailModal({
  session,
  onClose,
  recentSessions = [],
}: SessionDetailModalProps) {
  if (!session) return null

  const isRunning = 'distance_km' in session

  // Generate mini chart data based on recent sessions
  const generateChartData = () => {
    if (isRunning) {
      const runningSessions = recentSessions
        .filter(s => 'distance_km' in s)
        .slice(-7) as RunLog[]

      return runningSessions.map(s => {
        const date =
          s.date && typeof s.date === 'object' && 'toDate' in s.date
            ? s.date.toDate()
            : new Date(s.date)
        return {
          date: date.toLocaleDateString('th-TH', {
            month: 'short',
            day: 'numeric',
          }),
          distance: s.distance_km || 0,
          pace: s.pace_min_per_km
            ? parseFloat(s.pace_min_per_km.split(':')[0]) +
              parseFloat(s.pace_min_per_km.split(':')[1]) / 60
            : 0,
          calories: s.calories_total || 0,
        }
      })
    } else {
      const strengthSessions = recentSessions
        .filter(s => 'sets' in s)
        .slice(-7) as StrengthSession[]

      return strengthSessions.map(s => {
        const sets = (s as any).sets || []
        const volume = sets
          .filter(
            (set: any) =>
              !['Push-up', 'Pull-up', 'Plank'].includes(set.exercise)
          )
          .reduce((sum: number, set: any) => sum + set.reps * set.weight_kg, 0)
        const avgRpe =
          sets.length > 0
            ? sets.reduce((sum: number, set: any) => sum + (set.rpe || 0), 0) /
              sets.length
            : 0
        const date =
          s.date && typeof s.date === 'object' && 'toDate' in s.date
            ? s.date.toDate()
            : new Date(s.date)

        return {
          date: date.toLocaleDateString('th-TH', {
            month: 'short',
            day: 'numeric',
          }),
          volume: Math.round(volume),
          sets: sets.length,
          avgRpe: Math.round(avgRpe * 10) / 10,
        }
      })
    }
  }

  const chartData = generateChartData()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {isRunning ? '🏃‍♂️ Running Session' : '🏋️‍♂️ Strength Training'}
              </h2>
              <p className="text-muted-foreground">
                {(() => {
                  const date =
                    session.date &&
                    typeof session.date === 'object' &&
                    'toDate' in session.date
                      ? session.date.toDate()
                      : new Date(session.date)
                  return date.toLocaleDateString('th-TH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                })()}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 space-y-4">
              {isRunning ? (
                <RunningSessionDetail session={session as RunLog} />
              ) : (
                <StrengthSessionDetail session={session as StrengthSession} />
              )}
            </div>

            {/* Side Panel - Charts */}
            <div className="xl:w-80 flex-shrink-0">
              <div className="sticky top-0 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Recent Trend (7 days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isRunning ? (
                      <>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Distance (km)
                          </p>
                          <div className="h-16">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                <Line
                                  type="monotone"
                                  dataKey="distance"
                                  stroke="#3b82f6"
                                  strokeWidth={2}
                                  dot={false}
                                />
                                <Tooltip
                                  labelFormatter={label => `Date: ${label}`}
                                  formatter={(value: any) => [
                                    `${value}km`,
                                    'Distance',
                                  ]}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Calories
                          </p>
                          <div className="h-16">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData}>
                                <Bar dataKey="calories" fill="#10b981" />
                                <Tooltip
                                  labelFormatter={label => `Date: ${label}`}
                                  formatter={(value: any) => [
                                    `${value}`,
                                    'Calories',
                                  ]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Volume (kg)
                          </p>
                          <div className="h-16">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData}>
                                <Bar dataKey="volume" fill="#8b5cf6" />
                                <Tooltip
                                  labelFormatter={label => `Date: ${label}`}
                                  formatter={(value: any) => [
                                    `${value}kg`,
                                    'Volume',
                                  ]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">
                            Average RPE
                          </p>
                          <div className="h-16">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                <Line
                                  type="monotone"
                                  dataKey="avgRpe"
                                  stroke="#f59e0b"
                                  strokeWidth={2}
                                  dot={false}
                                />
                                <Tooltip
                                  labelFormatter={label => `Date: ${label}`}
                                  formatter={(value: any) => [
                                    `${value}/10`,
                                    'Avg RPE',
                                  ]}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RunningSessionDetail({ session }: { session: RunLog }) {
  return (
    <>
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Session Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Distance</p>
              <p className="text-2xl font-bold">{session.distance_km || 0}km</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-2xl font-bold">
                {(session as any).duration_min || session.duration || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pace</p>
              <p className="text-2xl font-bold">
                {session.pace_min_per_km || 'N/A'}/km
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Calories</p>
              <p className="text-2xl font-bold">
                {session.calories_total || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Run Type</p>
              <Badge variant="secondary">{session.run_type || 'General'}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Feeling</p>
              <div className="flex items-center gap-2">
                <span>
                  {session.feeling === 'great'
                    ? '😊'
                    : session.feeling === 'okay'
                      ? '😐'
                      : '😫'}
                </span>
                <span className="capitalize">{session.feeling || 'N/A'}</span>
              </div>
            </div>
          </div>

          {session.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Notes</p>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">{session.notes}</p>
              </div>
            </div>
          )}

          {session.weather && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Weather Conditions
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">
                  {typeof session.weather === 'string'
                    ? session.weather
                    : `${session.weather.conditions || 'N/A'} - ${session.weather.temperature || 'N/A'}°C`}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

function StrengthSessionDetail({ session }: { session: StrengthSession }) {
  const sets = (session as any).sets || []
  const exercises = Array.from(new Set(sets.map((set: any) => set.exercise)))

  // Group sets by exercise
  const exerciseGroups = exercises.map(exercise => ({
    name: exercise,
    sets: sets.filter((set: any) => set.exercise === exercise),
  }))

  const totalVolume = sets
    .filter(
      (set: any) => !['Push-up', 'Pull-up', 'Plank'].includes(set.exercise)
    )
    .reduce((sum: number, set: any) => sum + set.reps * set.weight_kg, 0)

  const avgRpe =
    sets.length > 0
      ? sets.reduce((sum: number, set: any) => sum + (set.rpe || 0), 0) /
        sets.length
      : 0

  return (
    <>
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Session Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">{Math.round(totalVolume)}kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Sets</p>
              <p className="text-2xl font-bold">{sets.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Exercises</p>
              <p className="text-2xl font-bold">{exercises.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg RPE</p>
              <p className="text-2xl font-bold">
                {Math.round(avgRpe * 10) / 10}/10
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Muscle Groups */}
      {(session.category || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Muscle Groups Trained</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(session.category || []).map((muscle, index) => (
                <Badge key={index} variant="outline">
                  {muscle}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Exercise Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {exerciseGroups.map((group, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">{group.name as string}</h4>
                <div className="space-y-2">
                  {group.sets.map((set: any, setIndex: number) => (
                    <div
                      key={setIndex}
                      className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded"
                    >
                      <span className="font-medium">Set {setIndex + 1}</span>
                      <div className="flex items-center gap-3">
                        <span>{set.reps} reps</span>
                        <span>{set.weight_kg}kg</span>
                        {set.rpe && (
                          <Badge variant="secondary" className="text-xs">
                            RPE {set.rpe}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Exercise Summary */}
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Volume:</span>
                    <span className="font-medium">
                      {Math.round(
                        group.sets.reduce(
                          (sum: number, set: any) =>
                            ['Push-up', 'Pull-up', 'Plank'].includes(
                              set.exercise
                            )
                              ? sum
                              : sum + set.reps * set.weight_kg,
                          0
                        )
                      )}
                      kg
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
