"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function AppClerkProvider({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider
			signInUrl="/"
			signUpUrl="/"
			appearance={{
				variables: {
					colorPrimary: "var(--primary)",
					colorBackground: "var(--card)",
					colorInputBackground: "var(--input)",
					colorText: "var(--foreground)",
					colorTextSecondary: "var(--muted-foreground)",
					colorDanger: "var(--destructive)",
					borderRadius: "0.5rem",
				},
			}}
		>
			{children}
		</ClerkProvider>
	);
}
