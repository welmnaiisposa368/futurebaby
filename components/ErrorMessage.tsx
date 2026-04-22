interface ErrorMessageProps {
  title?: string
  message: string
  type?: 'error' | 'warning' | 'info'
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

export default function ErrorMessage({
  title = 'Error',
  message,
  type = 'error',
  onRetry,
  onDismiss,
  className = ''
}: ErrorMessageProps) {
  const typeStyles = {
    error: {
      container: 'bg-red-50 border-red-200',
      icon: '❌',
      title: 'text-red-800',
      message: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: '⚠️',
      title: 'text-yellow-800',
      message: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'ℹ️',
      title: 'text-blue-800',
      message: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700'
    }
  }

  const styles = typeStyles[type]

  return (
    <div className={`border rounded-2xl p-4 ${styles.container} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-2xl">{styles.icon}</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-semibold ${styles.title}`}>
            {title}
          </h3>
          <p className={`mt-1 text-sm ${styles.message}`}>
            {message}
          </p>
          {(onRetry || onDismiss) && (
            <div className="mt-4 flex space-x-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`text-white px-3 py-1 rounded-full text-sm font-medium transition-colors ${styles.button}`}
                >
                  Try Again
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
