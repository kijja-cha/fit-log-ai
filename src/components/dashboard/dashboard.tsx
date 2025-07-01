'use client'

import { useState } from 'react'
import { Navbar } from './navbar'
import { StatsCards } from './stats-cards'
import { WorkoutTable } from './workout-table'
import { InsightsPanel } from './insights-panel'
import { useRunLogs } from '@/hooks/use-run-logs'
import { useStrengthSessions } from '@/hooks/use-strength-sessions'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Filter } from 'lucide-react'

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'runs' | 'strength' | 'insights'
  >('overview')

  const { runLogs, loading: runLoading } = useRunLogs()
  const { strengthSessions, loading: strengthLoading } = useStrengthSessions()

  const allWorkouts = [
    ...runLogs.map(run => ({ ...run, type: 'run' as const })),
    ...strengthSessions.map(session => ({
      ...session,
      type: 'strength' as const,
    })),
  ].sort((a, b) => {
    const aDate =
      a.date && typeof a.date === 'object' && 'toDate' in a.date
        ? a.date.toDate()
        : new Date(a.date)
    const bDate =
      b.date && typeof b.date === 'object' && 'toDate' in b.date
        ? b.date.toDate()
        : new Date(b.date)
    return bDate.getTime() - aDate.getTime()
  })

  const isLoading = runLoading || strengthLoading

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your fitness journey and progress
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 days
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Workout
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'runs', label: 'Running' },
            { id: 'strength', label: 'Strength' },
            { id: 'insights', label: 'Insights' },
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id as any)}
              className="relative"
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <StatsCards
              runLogs={runLogs}
              strengthSessions={strengthSessions}
              isLoading={isLoading}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Workouts</CardTitle>
                    <CardDescription>
                      Your latest fitness activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WorkoutTable
                      workouts={allWorkouts.slice(0, 10)}
                      isLoading={isLoading}
                      showType={true}
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <InsightsPanel
                  runLogs={runLogs}
                  strengthSessions={strengthSessions}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'runs' && (
          <Card>
            <CardHeader>
              <CardTitle>Running Logs</CardTitle>
              <CardDescription>
                All your running activities and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkoutTable
                workouts={runLogs
                  .map(run => ({ ...run, type: 'run' as const }))
                  .sort((a, b) => {
                    const aDate =
                      a.date && typeof a.date === 'object' && 'toDate' in a.date
                        ? a.date.toDate()
                        : new Date(a.date)
                    const bDate =
                      b.date && typeof b.date === 'object' && 'toDate' in b.date
                        ? b.date.toDate()
                        : new Date(b.date)
                    return bDate.getTime() - aDate.getTime()
                  })}
                isLoading={runLoading}
                showType={false}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'strength' && (
          <Card>
            <CardHeader>
              <CardTitle>Strength Training</CardTitle>
              <CardDescription>
                All your strength training sessions and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkoutTable
                workouts={strengthSessions
                  .map(session => ({ ...session, type: 'strength' as const }))
                  .sort((a, b) => {
                    const aDate =
                      a.date && typeof a.date === 'object' && 'toDate' in a.date
                        ? a.date.toDate()
                        : new Date(a.date)
                    const bDate =
                      b.date && typeof b.date === 'object' && 'toDate' in b.date
                        ? b.date.toDate()
                        : new Date(b.date)
                    return bDate.getTime() - aDate.getTime()
                  })}
                isLoading={strengthLoading}
                showType={false}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'insights' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InsightsPanel
              runLogs={runLogs}
              strengthSessions={strengthSessions}
              expanded={true}
            />

            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>
                  Personalized suggestions based on your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Coming Soon</h3>
                    <p className="text-muted-foreground">
                      AI-powered insights and recommendations will be available
                      soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
