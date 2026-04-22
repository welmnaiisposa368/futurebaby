'use client'

import { createContext, useContext, useState, useCallback } from 'react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])

    // Auto-remove toast after duration
    const duration = toast.duration || 5000
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }, [addToast])

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message })
  }, [addToast])

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message })
  }, [addToast])

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }, [addToast])

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onClose: () => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const typeStyles = {
    success: {
      container: 'bg-green-50 border-green-200',
      icon: '✅',
      title: 'text-green-800',
      message: 'text-green-600'
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: '❌',
      title: 'text-red-800',
      message: 'text-red-600'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: '⚠️',
      title: 'text-yellow-800',
      message: 'text-yellow-600'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'ℹ️',
      title: 'text-blue-800',
      message: 'text-blue-600'
    }
  }

  const styles = typeStyles[toast.type]

  return (
    <div className={`border rounded-lg p-4 shadow-lg max-w-sm animate-slide-in ${styles.container}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-lg">{styles.icon}</span>
        </div>
        <div className="ml-3 flex-1">
          <h4 className={`text-sm font-semibold ${styles.title}`}>
            {toast.title}
          </h4>
          {toast.message && (
            <p className={`mt-1 text-sm ${styles.message}`}>
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
