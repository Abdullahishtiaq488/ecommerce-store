import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "../globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import ToasterProvider from "@/lib/providers/ToasterProvider";
import TopStrip from "@/components/TopStrip";
import FooterWrapper from "@/components/FooterWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sana Safinaz",
  description: "Best Clothing Brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <ToasterProvider />
          <TopStrip />
          <NavbarWrapper />
          {children}
          <FooterWrapper />
        </ClerkProvider>
      </body>
    </html>
  );
}
