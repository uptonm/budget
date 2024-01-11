import "~/styles/globals.css";

import { ConfigProvider } from "antd";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { ClientContainer } from "~/app/_components/shared/containers/ClientContainer";
import StyledComponentsRegistry from "~/lib/StyledComponentsRegistry";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "App Router Sandbox",
  description: "A web application for testing out Next.js App Router",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
      </body>
    </html>
  );
}
