import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSS Widgets",
  description: "Front-end Technologies | CSS, HTML, Accessibility.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
