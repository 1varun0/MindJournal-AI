export function AppHeader() {
  return (
    <header className="w-full border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
      <div className="mx-auto flex max-w-2xl items-center justify-center px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MindJournal AI
          </h1>
          <div className="h-2 w-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </header>
  )
}