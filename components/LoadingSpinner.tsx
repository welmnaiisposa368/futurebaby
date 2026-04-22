interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'pink' | 'purple' | 'blue' | 'gray'
  text?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'pink', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const colorClasses = {
    pink: 'border-pink-500',
    purple: 'border-purple-500',
    blue: 'border-blue-500',
    gray: 'border-gray-500'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  )
}
