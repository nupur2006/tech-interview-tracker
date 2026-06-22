"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { SignInButton } from "@/components/landing/sign-in-button";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5">
      <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-xl" />
      <div className="relative mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-shadow duration-300">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            InterviewTracker
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-brand-400 hover:text-white transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-brand-400 hover:text-white transition-colors duration-200"
          >
            How it Works
          </a>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-dark rounded-xl transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-accent/40"
            >
              Dashboard
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </nav>
  );
}
