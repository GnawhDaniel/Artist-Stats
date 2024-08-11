import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Teko, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const teko = Teko({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "musipster",
  description: "Track the growth of your favorite artists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={teko.className}>{children}</body>
    </html>
  );
}
