function NoteCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-6 w-6 rounded" />
      </div>
      <div className="skeleton h-5 w-full mb-2 rounded" />
      <div className="skeleton h-5 w-3/4 mb-3 rounded" />
      <div className="flex gap-2 mb-3">
        <div className="skeleton h-4 w-20 rounded" />
        <div className="skeleton h-4 w-16 rounded-full" />
      </div>
      <div className="skeleton h-4 w-full mb-2 rounded" />
      <div className="skeleton h-4 w-5/6 mb-4 rounded" />
      <div className="flex gap-3 mb-3">
        <div className="skeleton h-3 w-8 rounded" />
        <div className="skeleton h-3 w-8 rounded" />
        <div className="skeleton h-3 w-8 rounded" />
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
        <div className="flex gap-2">
          <div className="skeleton h-3.5 w-10 rounded" />
          <div className="skeleton h-3.5 w-10 rounded" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="skeleton w-5 h-5 rounded-full" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  )
}

export default NoteCardSkeleton
