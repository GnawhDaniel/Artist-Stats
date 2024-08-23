import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Teko } from "next/font/google";
import ReactGA from "react-ga4";

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
  ReactGA.initialize('G-GRDDY5DHXX');
  return (
    <html lang="en">
      <body className={teko.className}>
        {children}
      </body>
    </html>
  );
}
