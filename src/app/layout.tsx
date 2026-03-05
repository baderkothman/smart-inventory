import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppClerkProvider } from "@/components/providers/clerk-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({
	variable: "--font-geist",
	subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Smart Inventory Hub",
	description: "AI-powered company asset inventory management",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${geist.variable} ${jetbrainsMono.variable} font-sans antialiased`}
			>
				<AppClerkProvider>
					<TooltipProvider>
						{children}
						<Toaster richColors position="bottom-right" />
					</TooltipProvider>
				</AppClerkProvider>
			</body>
		</html>
	);
}
