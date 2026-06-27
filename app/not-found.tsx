import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
        <FileQuestion className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        We couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
      </p>
      
      <Link href="/dashboard">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
