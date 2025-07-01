'use client'

import { useState } from 'react'
import { RunLog, StrengthSession } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import {
  formatDate,
  formatDistance,
  formatDuration,
  formatPace,
  formatCalories,
  getFeelingEmoji,
  getWorkoutTypeColor,
  parseDurationToMinutes,
} from '@/lib/utils'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SessionDetailModal } from './session-detail-modal'

type WorkoutWithType = (RunLog | StrengthSession) & {
  type: 'run' | 'strength'
}

interface WorkoutTableProps {
  workouts: WorkoutWithType[]
  isLoading: boolean
  showType?: boolean
}

export function WorkoutTable({
  workouts,
  isLoading,
  showType = false,
}: WorkoutTableProps) {
  const [selectedSession, setSelectedSession] = useState<
    RunLog | StrengthSession | null
  >(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="medium" />
      </div>
    )
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No workouts found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Start logging your fitness activities to see them here
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {showType && <TableHead>Type</TableHead>}
              <TableHead>Activity</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Key Metrics</TableHead>
              <TableHead>Feeling</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workouts.map(workout => {
              const workoutDate =
                workout.date &&
                typeof workout.date === 'object' &&
                'toDate' in workout.date
                  ? workout.date.toDate()
                  : new Date(workout.date)
              const isRun = workout.type === 'run'
              const runWorkout = workout as RunLog
              const strengthWorkout = workout as StrengthSession

              return (
                <TableRow
                  key={workout.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedSession(workout)}
                >
                  <TableCell className="font-medium">
                    {formatDate(workoutDate)}
                  </TableCell>

                  {showType && (
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getWorkoutTypeColor(
                          isRun
                            ? 'cardio'
                            : strengthWorkout.workoutType || 'strength'
                        )}
                      >
                        {isRun
                          ? 'Running'
                          : strengthWorkout.workoutType || 'Strength'}
                      </Badge>
                    </TableCell>
                  )}

                  <TableCell>
                    {isRun ? (
                      <div>
                        <p className="font-medium">
                          {(runWorkout as any).run_type
                            ? (runWorkout as any).run_type
                                .charAt(0)
                                .toUpperCase() +
                              (runWorkout as any).run_type.slice(1)
                            : 'Run'}
                        </p>
                        {runWorkout.route?.name && (
                          <p className="text-sm text-muted-foreground">
                            {runWorkout.route.name}
                          </p>
                        )}
                        {(runWorkout as any).source && (
                          <p className="text-sm text-muted-foreground">
                            {(runWorkout as any).source}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Strength Training</p>
                        <p className="text-sm text-muted-foreground">
                          {(strengthWorkout as any).category?.join(', ') ||
                            strengthWorkout.workoutType ||
                            'Strength'}
                        </p>
                        {(strengthWorkout as any).session_id && (
                          <p className="text-xs text-muted-foreground">
                            Session: {(strengthWorkout as any).session_id}
                          </p>
                        )}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    {isRun
                      ? formatDuration(
                          (runWorkout as any).duration,
                          parseDurationToMinutes((runWorkout as any).duration)
                        )
                      : (strengthWorkout as any).sets
                        ? `${(strengthWorkout as any).sets.length} sets`
                        : formatDuration(workout.duration)}
                  </TableCell>

                  <TableCell>
                    {isRun ? (
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Distance:</span>{' '}
                          {formatDistance(
                            (runWorkout as any).distance_km,
                            runWorkout.distance
                          )}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Pace:</span>{' '}
                          {formatPace(
                            (runWorkout as any).pace_min_per_km,
                            runWorkout.pace
                          )}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Calories:</span>{' '}
                          {formatCalories(
                            (runWorkout as any).calories_total,
                            runWorkout.calories
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Volume:</span>{' '}
                          {(() => {
                            const sets = (strengthWorkout as any).sets || []
                            // Exclude bodyweight exercises (Push-up, Pull-up) from volume calculation
                            const weightTrainingSets = sets.filter(
                              (set: any) =>
                                !['Push-up', 'Pull-up', 'Plank'].includes(
                                  set.exercise
                                )
                            )
                            const totalVolume = weightTrainingSets.reduce(
                              (sum: number, set: any) =>
                                sum + set.reps * set.weight_kg,
                              0
                            )
                            return Math.round(
                              totalVolume || strengthWorkout.totalVolume || 0
                            )
                          })()}
                          kg
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Exercises:</span>{' '}
                          {(() => {
                            const sets = (strengthWorkout as any).sets || []
                            const uniqueExercises = Array.from(
                              new Set(sets.map((set: any) => set.exercise))
                            )
                            return (
                              uniqueExercises.length ||
                              strengthWorkout.exercises?.length ||
                              0
                            )
                          })()}
                        </p>
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getFeelingEmoji(workout.feeling || 'good')}
                      </span>
                      <span className="text-sm capitalize">
                        {workout.feeling ||
                          (isRun
                            ? 'good'
                            : (() => {
                                const sets = (strengthWorkout as any).sets || []
                                const avgRpe =
                                  sets.length > 0
                                    ? sets.reduce(
                                        (sum: number, set: any) =>
                                          sum +
                                          (typeof set.rpe === 'number'
                                            ? set.rpe
                                            : 7),
                                        0
                                      ) / sets.length
                                    : 7
                                return avgRpe >= 8
                                  ? 'great'
                                  : avgRpe >= 6
                                    ? 'good'
                                    : 'okay'
                              })())}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={e => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={e => {
                            e.stopPropagation()
                            setSelectedSession(workout)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <SessionDetailModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
        recentSessions={workouts}
      />
    </>
  )
}
