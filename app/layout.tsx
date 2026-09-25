import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chemistry Department | Research Community",
  description: "Explore the Chemistry Department's connected research community.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
