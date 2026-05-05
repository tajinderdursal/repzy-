import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./providers"; // 👈 important

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Repzy",
  description: "Repzy App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col">
        
        <Providers> 
          <Navbar />

          <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            {children}
          </div>

          <Footer />
        </Providers>

      </body>
    </html>
  );
}