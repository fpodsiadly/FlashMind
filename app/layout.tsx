import type { Metadata } from "next";
import "./globals.css";
import "@/styles/theme.css";
import { Providers } from "@/app/components/providers";

export const metadata: Metadata = {
    title: "FlashMind",
    description: "Prosty quiz wiedzy po polsku",
    manifest: "/manifest.webmanifest",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pl" suppressHydrationWarning>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
