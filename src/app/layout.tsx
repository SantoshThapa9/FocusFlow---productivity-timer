import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusFlow - Productivity Timer & Pomodoro App",
  description:
    "Boost your productivity with FocusFlow, a sleek Pomodoro timer app designed to help you manage tasks and stay focused using proven time management techniques.",
  keywords: [
    "Pomodoro timer",
    "productivity app",
    "focus timer",
    "time management",
    "task management",
    "work timer",
    "study timer",
    "productivity boost",
    "focus techniques",
  ],
  authors: [{ name: "Santosh Thapa" }],
  creator: "Santosh Thapa",
  publisher: "Santosh Thapa",
  openGraph: {
    title: "FocusFlow - Productivity Timer & Pomodoro App",
    description:
      "Stay focused and increase productivity with FocusFlow, a Pomodoro timer app built for efficient task management and time tracking.",
    url: "https://yourdomain.com",
    siteName: "FocusFlow",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "FocusFlow Productivity Timer App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FocusFlow - Productivity Timer & Pomodoro App",
    description:
      "Stay focused and increase productivity with FocusFlow, a Pomodoro timer app built for efficient task management and time tracking.",
    images: ["https://yourdomain.com/twitter-image.png"],
    creator: "@yourtwitterhandle",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
