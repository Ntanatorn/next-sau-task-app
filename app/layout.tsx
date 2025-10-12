import type { Metadata } from "next";
import { Kanit } from 'next/font/google';
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai"],
  weight: ["100", "200","300","400","500","600","700","800","900"]
});


export const metadata: Metadata = {
  title: "Manage Task App by Tanatorn SAU",
  description: "เว็บแอปพลิเคชั่นสำหรับจัดการงานที่พัฒนาโดย  tanatorn SAU โดยใช้ next.js",
  keywords: ["Manage Task App", "Tanatorn SAU", "Next.js", "React", "TypeScript"],
  authors: [{ name: "Tanatorn SAU", url: "https://github.com/Tanatorn-SAU" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={kanit.className}>
        {children}
      </body>
    </html>
  );
}
