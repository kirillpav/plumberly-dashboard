import type { Metadata } from "next";
import { DM_Sans, Source_Sans_3 } from "next/font/google";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Plumberly Admin",
  description: "Admin dashboard for the Plumberly plumbing marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${sourceSans.variable} antialiased`}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
