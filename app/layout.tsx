import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteMetadata } from "@/lib/site";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo-2",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: siteMetadata.title, template: `%s · ${siteMetadata.title}` },
  description: siteMetadata.description,
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={baloo.variable}>
      <body>
        <ThemeProvider>
          <a href="#main" className="skip-main">Skip to content</a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </ThemeProvider>
        <GoogleAnalytics gaId="G-LHTW9V1F9R" />
      </body>
    </html>
  );
}
