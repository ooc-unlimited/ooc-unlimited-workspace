import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Donna PM",
  description: "Project management made simple",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-950 text-gray-100`}
      >
        <AppProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
