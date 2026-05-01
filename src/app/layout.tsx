import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foyer — Private Events, Handled.",
  description: "Foyer's AI reads every private dining and event enquiry, qualifies the lead, and drafts a personalised reply in your voice — in under a minute.",
  icons: {
    icon: "/brand/foyer-favicon.svg",
    apple: "/brand/foyer-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ backgroundColor: "#F4EDE4" }}>
        {children}
      </body>
    </html>
  );
}
