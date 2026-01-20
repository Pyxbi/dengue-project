import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Import standard font
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dengue Sentinel - Outbreak Zero",
  description: "Advanced Dengue Prevention Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${jakarta.variable} antialiased font-sans bg-slate-50 text-charcoal`}>
        {children}
      </body>
    </html>
  );
}
