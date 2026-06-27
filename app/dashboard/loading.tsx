export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse pb-20 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2"></div>
          <div className="h-5 w-48 bg-gray-100 dark:bg-gray-900 rounded-lg"></div>
        </div>
        <div className="hidden sm:block h-10 w-36 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800 mb-3"></div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-100 dark:bg-gray-900 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="h-14 w-full bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-96 w-full bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl"></div>
        </div>
        <div className="space-y-6">
          <div className="h-96 w-full bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
