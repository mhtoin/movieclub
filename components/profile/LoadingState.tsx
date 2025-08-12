interface LoadingStateProps {
  isLoading?: boolean
  hasError?: boolean
}

export function LoadingState({ isLoading, hasError }: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Access Denied</p>
      </div>
    )
  }

  return null
}
