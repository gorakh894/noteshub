function LoadingSpinner({ fullScreen = false, size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }

  const spinner = (
    <div className={`${sizes[size]} border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin`} />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner
