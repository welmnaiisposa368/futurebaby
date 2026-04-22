import { useState, useCallback, useEffect } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseAsyncReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: any[]) => Promise<T | null>
  reset: () => void
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>
): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const result = await asyncFunction(...args)
        setState({ data: result, loading: false, error: null })
        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
        setState({ data: null, loading: false, error: errorMessage })
        return null
      }
    },
    [asyncFunction]
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset
  }
}

// Specialized hook for form submissions
export function useAsyncForm<T>(
  submitFunction: (...args: any[]) => Promise<T>
) {
  const [success, setSuccess] = useState(false)
  const asyncState = useAsync(submitFunction)

  const submit = useCallback(
    async (...args: any[]) => {
      setSuccess(false)
      const result = await asyncState.execute(...args)
      if (result && !asyncState.error) {
        setSuccess(true)
      }
      return result
    },
    [asyncState]
  )

  const reset = useCallback(() => {
    setSuccess(false)
    asyncState.reset()
  }, [asyncState])

  return {
    ...asyncState,
    success,
    submit,
    reset
  }
}

// Hook for data fetching with automatic loading states
export function useAsyncData<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const asyncState = useAsync(fetchFunction)

  // Auto-fetch on mount and dependency changes
  useEffect(() => {
    asyncState.execute()
  }, dependencies)

  return asyncState
}
