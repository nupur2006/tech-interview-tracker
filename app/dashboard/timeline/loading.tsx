export default function TimelineLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2"></div>
          <div className="h-5 w-72 bg-gray-100 dark:bg-gray-900 rounded-lg"></div>
        </div>
        <div className="h-10 w-full sm:w-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-b border-gray-200 dark:border-gray-800">
           <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 flex flex-col sm:flex-row gap-4">
              <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-4 sm:w-32">
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
                <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
              </div>
              
              <div className="shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>

              <div className="flex-1 space-y-3">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 w-full bg-gray-100 dark:bg-gray-900 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
