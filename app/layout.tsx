import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tech Interview Timeline Tracker",
    template: "%s | Interview Tracker",
  },
  description:
    "Track your tech interview progress from application to offer. Organize timelines, manage follow-ups, and land your dream role.",
  keywords: [
    "tech interviews",
    "interview tracker",
    "job applications",
    "career management",
  ],
  authors: [{ name: "Interview Tracker Team" }],
  openGraph: {
    title: "Tech Interview Timeline Tracker",
    description:
      "Track your tech interview progress from application to offer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
