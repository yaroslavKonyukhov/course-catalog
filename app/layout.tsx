import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
