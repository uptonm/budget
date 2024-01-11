import "~/styles/globals.css";

import { ConfigProvider } from "antd";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ClientContainer } from "~/app/_components/shared/containers/ClientContainer";
import StyledComponentsRegistry from "~/lib/StyledComponentsRegistry";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Budget",
  description:
    "A simple budgeting application for those too lazy for spreadsheets.",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" },
  ],
  appleWebApp: {
    title: "Budget",
  },
  applicationName: "Budget",
  manifest: "/site.webmanifest",
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
            <TRPCReactProvider headers={headers()}>
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
