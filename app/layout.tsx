import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notion to Live JSON API Engine | Realtime Database Endpoint",
  description:
    "Convert any Notion database into a sub-50ms live REST API endpoint. Instant JSON response for developers.",
  openGraph: {
    title: "Notion to Live JSON API Engine | Realtime Database Endpoint",
    description:
      "Convert any Notion database into a sub-50ms live REST API endpoint. Instant JSON response for developers.",
    url: "https://my-saas-app-ten-nu.vercel.app",
    siteName: "Notion API Engine",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notion to Live JSON API Engine | Realtime Database Endpoint",
    description:
      "Convert any Notion database into a sub-50ms live REST API endpoint. Instant JSON response for developers.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}