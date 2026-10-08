import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { QueryProvider } from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: { default: "Shelfwise admin", template: "%s · Shelfwise admin" },
  description: "Next.js commerce admin: products, categories and campaigns.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <div className="flex min-h-screen flex-col md:flex-row">
            <Sidebar />
            <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
