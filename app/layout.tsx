import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Course Catalog",
  description: "Course catalog for the Advanced Web Technologies course",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-3xl gap-6 px-6 py-4 text-sm font-medium">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link href="/courses" className="hover:text-blue-600">
              Courses
            </Link>
            <Link href="/about" className="hover:text-blue-600">
              About
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
