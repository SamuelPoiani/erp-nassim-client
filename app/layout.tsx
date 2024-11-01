import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./contexts/UserContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const openSans = Open_Sans({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: "ERP Nassim",
  description: "ERP Nassim Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className}`}>
        <UserProvider>
          {children}
          <ToastContainer position="top-right" />
        </UserProvider>
      </body>
    </html>
  );
}
