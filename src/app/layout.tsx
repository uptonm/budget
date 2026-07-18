import "~/styles/globals.css";

import { ConfigProvider } from "antd";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ClientContainer } from "~/app/_components/shared/containers/ClientContainer";
import StyledComponentsRegistry from "~/lib/StyledComponentsRegistry";
import { TRPCReactProvider } from "~/trpc/react";

const siteUrl = "https://budget.uptonm.dev";
const title = "Budget — Private Personal Finance";
const description =
  "A private personal-finance dashboard for tracking spending, income, savings, categories, and net worth.";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: {
    default: title,
    template: "%s · Budget",
  },
  description,
  applicationName: "Budget",
  authors: [{ name: "Mike Upton", url: "https://uptonm.dev" }],
  creator: "Mike Upton",
  publisher: "Mike Upton",
  category: "finance",
  manifest: "/manifest.webmanifest",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Budget",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Budget — private personal finance without the spreadsheet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  appleWebApp: {
    title: "Budget",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        id="app"
        suppressHydrationWarning
        className={`font-sans ${inter.variable}`}
      >
        <StyledComponentsRegistry>
          <ConfigProvider theme={{ hashed: false }}>
            <TRPCReactProvider cookies={cookies().toString()}>
              <ClientContainer>{children}</ClientContainer>
            </TRPCReactProvider>
          </ConfigProvider>
        </StyledComponentsRegistry>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
