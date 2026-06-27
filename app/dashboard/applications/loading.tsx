export default function ApplicationsLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2"></div>
          <div className="h-5 w-72 bg-gray-100 dark:bg-gray-900 rounded-lg"></div>
        </div>
        <div className="h-10 w-full sm:w-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>

      <div className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden h-[400px]">
        <div className="h-12 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 border-b border-gray-100 dark:border-gray-800/50 flex items-center px-6">
            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-100 dark:bg-gray-900 rounded ml-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
