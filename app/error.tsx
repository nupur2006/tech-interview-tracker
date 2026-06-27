"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        We encountered an unexpected error while trying to process your request. 
        Please try again or return to the dashboard.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button onClick={() => reset()} className="w-full sm:w-auto">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
