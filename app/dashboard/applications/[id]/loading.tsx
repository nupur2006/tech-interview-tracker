export default function ApplicationDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2"></div>
            <div className="h-5 w-32 bg-gray-100 dark:bg-gray-900 rounded-lg"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl h-64"></div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl h-96"></div>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl h-48"></div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl h-64"></div>
        </div>
      </div>
    </div>
  );
}
