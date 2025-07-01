'use client'

import { useState, useEffect, useCallback } from 'react'
import { runLogService } from '@/services/firebase-service'
import { RunLog, LogFilter } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface UseRunLogsReturn {
  runLogs: RunLog[]
  loading: boolean
  error: string | null
  createRunLog: (
    data: Omit<RunLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => Promise<boolean>
  updateRunLog: (
    id: string,
    data: Partial<Omit<RunLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ) => Promise<boolean>
  deleteRunLog: (id: string) => Promise<boolean>
  refreshLogs: () => Promise<void>
  filters: LogFilter
  setFilters: (filters: LogFilter) => void
}

export function useRunLogs(initialFilters: LogFilter = {}): UseRunLogsReturn {
  const [runLogs, setRunLogs] = useState<RunLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<LogFilter>(initialFilters)

  const { toast } = useToast()
  // Use a fixed user ID for personal use
  const userId = 'ZNyZtqgLvLckssrkxZop'

  const fetchRunLogs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await runLogService.getUserLogs(userId, filters, 100)

      if (response.success) {
        setRunLogs(response.data)
      } else {
        setError(response.error || 'Failed to fetch run logs')
        toast({
          title: 'Error fetching run logs',
          description: response.error || 'Failed to fetch run logs',
          variant: 'destructive',
        })
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      toast({
        title: 'Error fetching run logs',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [userId, filters, toast])

  useEffect(() => {
    fetchRunLogs()
  }, [fetchRunLogs])

  const createRunLog = async (
    data: Omit<RunLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> => {
    try {
      const response = await runLogService.create({
        ...data,
        userId,
      })

      if (response.success) {
        toast({
          title: 'Run log created',
          description: 'Your run has been successfully logged',
        })
        await fetchRunLogs() // Refresh the list
        return true
      } else {
        toast({
          title: 'Failed to create run log',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        })
        return false
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      toast({
        title: 'Failed to create run log',
        description: errorMessage,
        variant: 'destructive',
      })
      return false
    }
  }

  const updateRunLog = async (
    id: string,
    data: Partial<Omit<RunLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<boolean> => {
    try {
      const response = await runLogService.update(id, data)

      if (response.success) {
        toast({
          title: 'Run log updated',
          description: 'Your run has been successfully updated',
        })
        await fetchRunLogs() // Refresh the list
        return true
      } else {
        toast({
          title: 'Failed to update run log',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        })
        return false
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      toast({
        title: 'Failed to update run log',
        description: errorMessage,
        variant: 'destructive',
      })
      return false
    }
  }

  const deleteRunLog = async (id: string): Promise<boolean> => {
    try {
      const response = await runLogService.delete(id)

      if (response.success) {
        toast({
          title: 'Run log deleted',
          description: 'The run log has been successfully deleted',
        })
        await fetchRunLogs() // Refresh the list
        return true
      } else {
        toast({
          title: 'Failed to delete run log',
          description: response.error || 'An error occurred',
          variant: 'destructive',
        })
        return false
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      toast({
        title: 'Failed to delete run log',
        description: errorMessage,
        variant: 'destructive',
      })
      return false
    }
  }

  const refreshLogs = async () => {
    await fetchRunLogs()
  }

  return {
    runLogs,
    loading,
    error,
    createRunLog,
    updateRunLog,
    deleteRunLog,
    refreshLogs,
    filters,
    setFilters,
  }
}
