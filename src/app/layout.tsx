import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sora } from "next/font/google";
import "./globals.css";
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { AuthGuard } from "../components/AuthGuard";
import { ErrorBoundary } from '../components/ErrorBoundary';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "FarmLand | Login",
  description: "FarmLand application login page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
