import type { Metadata } from "next";
import "./globals.css";
import "@/styles/theme.css";
import { Providers } from "@/app/components/providers";

export const metadata: Metadata = {
    title: "FlashMind",
    description: "Adaptive quiz training with EN/PL support",
    manifest: "/manifest.webmanifest",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
