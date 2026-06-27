export default function AnalyticsLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2"></div>
        <div className="h-5 w-96 bg-gray-100 dark:bg-gray-900 rounded-lg"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-gray-800 mr-4"></div>
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
          <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800/50 rounded-lg"></div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
          <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800/50 rounded-full scale-90"></div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm lg:col-span-2">
          <div className="h-6 w-64 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
          <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800/50 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
