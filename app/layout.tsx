import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeToggle from "./ThemeToggle";
import { cookies } from "next/headers";
import ServerBackendRequest from "@/utils/serverBackend";
import { redirect } from "next/navigation";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");

  return (
    <html lang="en">
      <body className={inter.className + " " + theme?.value}>
        <ThemeToggle initialValue={theme?.value as "light" | "dark"} />
        {children}
      </body>
    </html>
  );
}
