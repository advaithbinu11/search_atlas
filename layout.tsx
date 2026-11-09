import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { bounds } from "@/lib/data";
import { dbExists } from "@/lib/db";

export const metadata: Metadata = { title: "Search Analytics", description: "Your own Google search history, charted." };
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ok = dbExists();
  const b = ok ? bounds() : null;
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-fg antialiased">
        <Shell dataThrough={b?.last ?? null} searches={b?.n ?? 0}>{children}</Shell>
      </body>
    </html>
  );
}
