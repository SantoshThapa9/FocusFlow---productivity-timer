import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FocusFlow | Pomodoro Timer",
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
  metadataBase: new URL("https://focus-flow-productivity-timer.vercel.app"),
  authors: [{ name: "Santosh", url: "https://santosh-gamma.vercel.app/" }],
  creator: "Santosh Thapa",
  publisher: "Santosh Thapa",
  openGraph: {
    title: "FocusFlow | Pomodoro Timer",
    description:
      "Stay focused and increase productivity with FocusFlow, a Pomodoro timer app built for efficient task management and time tracking.",
    url: "https://focus-flow-productivity-timer.vercel.app",
    siteName: "FocusFlow",

    locale: "en_US",
    type: "website",
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
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
