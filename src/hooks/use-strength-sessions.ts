'use client'

import { useState, useEffect, useCallback } from 'react'
import { strengthSessionService } from '@/services/firebase-service'
import { StrengthSession, LogFilter } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface UseStrengthSessionsReturn {
  strengthSessions: StrengthSession[]
  loading: boolean
  error: string | null
  createStrengthSession: (
    data: Omit<StrengthSession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => Promise<boolean>
  updateStrengthSession: (
    id: string,
    data: Partial<
      Omit<StrengthSession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    >
  ) => Promise<boolean>
  deleteStrengthSession: (id: string) => Promise<boolean>
  refreshSessions: () => Promise<void>
  filters: LogFilter
  setFilters: (filters: LogFilter) => void
}

export function useStrengthSessions(
  initialFilters: LogFilter = {}
): UseStrengthSessionsReturn {
  const [strengthSessions, setStrengthSessions] = useState<StrengthSession[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<LogFilter>(initialFilters)

  const { toast } = useToast()
  // Use a fixed user ID for personal use (matching run logs)
  const userId = 'ZNyZtqgLvLckssrkxZop'

  const fetchStrengthSessions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await strengthSessionService.getUserSessions(
        userId,
        filters,
        100
      )

      if (response.success) {
        setStrengthSessions(response.data)
      } else {
        setError(response.error || 'Failed to fetch strength sessions')
        toast({
          title: 'Error fetching strength sessions',
          description: response.error || 'Failed to fetch strength sessions',
          variant: 'destructive',
        })
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      toast({
        title: 'Error fetching strength sessions',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [userId, filters, toast])

  useEffect(() => {
    fetchStrengthSessions()
  }, [fetchStrengthSessions])

  const createStrengthSession = async (
    data: Omit<StrengthSession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> => {
    try {
      const response = await strengthSessionService.create({
        ...data,
        userId,
      })

      if (response.success) {
        toast({
          title: 'Strength session created',
          description: 'Your workout has been successfully logged',
        })
        await fetchStrengthSessions() // Refresh the list
        return true
      } else {
        toast({
          title: 'Failed to create strength session',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        })
        return false
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      toast({
        title: 'Failed to create strength session',
        description: errorMessage,
        variant: 'destructive',
      })
      return false
    }
  }

  const updateStrengthSession = async (
    id: string,
    data: Partial<
      Omit<StrengthSession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    >
  ): Promise<boolean> => {
    try {
      const response = await strengthSessionService.update(id, data)

      if (response.success) {
        toast({
          title: 'Strength session updated',
          description: 'Your workout has been successfully updated',
        })
        await fetchStrengthSessions() // Refresh the list
        return true
      } else {
        toast({
          title: 'Failed to update strength session',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        })
        return false
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      toast({
        title: 'Failed to update strength session',
        description: errorMessage,
        variant: 'destructive',
      })
      return false
    }
  }

  const deleteStrengthSession = async (id: string): Promise<boolean> => {
    try {
      const response = await strengthSessionService.delete(id)

      if (response.success) {
        toast({
          title: 'Strength session deleted',
          description: 'The workout has been successfully deleted',
        })
        await fetchStrengthSessions() // Refresh the list
        return true
      } else {
        toast({
          title: 'Failed to delete strength session',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        })
        return false
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      toast({
        title: 'Failed to delete strength session',
        description: errorMessage,
        variant: 'destructive',
      })
      return false
    }
  }

  const refreshSessions = async () => {
    await fetchStrengthSessions()
  }

  return {
    strengthSessions,
    loading,
    error,
    createStrengthSession,
    updateStrengthSession,
    deleteStrengthSession,
    refreshSessions,
    filters,
    setFilters,
  }
}
