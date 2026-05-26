import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://studio.squarebidness.com"),
  title: {
    default: "Square Bidness Studio — Short Films, Culture & More",
    template: "%s | SB Studio",
  },
  description: "Square Bidness Studio — original short films, culture content, music, and Louisiana-based entertainment. Watch free.",
  keywords: [
    "Square Bidness Studio", "SB Studio", "Louisiana films",
    "short films Louisiana", "Black content creators Louisiana",
    "independent films", "culture videos", "Square Bidness Network",
  ],
  applicationName: "SB Studio",
  appleWebApp: { capable: true, title: "SB Studio", statusBarStyle: "black-translucent" },
  openGraph: {
    siteName: "Square Bidness Studio",
    title: "Square Bidness Studio — Original Content",
    description: "Original short films, culture, and entertainment from Square Bidness.",
    type: "website",
    url: "https://studio.squarebidness.com",
    images: [{ url: "/studio-og.png", width: 1200, height: 630, alt: "Square Bidness Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Square Bidness Studio",
    description: "Original short films, culture, and entertainment.",
    images: ["/studio-og.png"],
  },
  alternates: { canonical: "https://studio.squarebidness.com" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
