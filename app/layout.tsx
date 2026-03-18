import type { Metadata, Viewport } from "next";
import { displayFont, bodyFont } from "@/lib/fonts";
import GSAPProvider from "@/components/providers/GSAPProvider";
import LenisProvider from "@/components/providers/LenisProvider";
import SplashScreen from "@/components/splash/SplashScreen";
import Navbar from "@/components/nav/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Symmetra Studios",
    template: "%s | Symmetra Studios",
  },
  description: "Premium AI Video Production Studio",
  metadataBase: new URL("https://symmetrastudios.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060606",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body className="bg-bg text-text font-body antialiased overflow-x-hidden">
        <GSAPProvider>
          <LenisProvider>
            <Navbar />
            <SplashScreen assets={[]}>{children}</SplashScreen>
          </LenisProvider>
        </GSAPProvider>
      </body>
    </html>
  );
}
