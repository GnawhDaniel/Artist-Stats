import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Teko } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
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
      <body className={teko.className}>
        {children}
        <GoogleAnalytics gaId="G-GRDDY5DHXX"></GoogleAnalytics>
      </body>
    </html>
  );
}
