"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";

function useClerkAppearance() {
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme !== "light";

	return useMemo(
		() => ({
			variables: {
				colorBackground: isDark ? "#0f1420" : "#ffffff",
				colorInputBackground: isDark ? "#0a0e18" : "#f1f5f9",
				colorInputText: isDark ? "#e2e8f0" : "#0f172a",
				colorText: isDark ? "#e2e8f0" : "#0f172a",
				colorTextSecondary: isDark ? "#94a3b8" : "#64748b",
				colorPrimary: "#14b8a6",
				colorDanger: isDark ? "#f87171" : "#ef4444",
				borderRadius: "0.5rem",
				fontFamily: "inherit",
			},
			elements: {
				card: "shadow-none bg-transparent p-0",
				rootBox: "w-full",
				cardBox: "shadow-none w-full",
				headerTitle: "text-foreground font-mono",
				headerSubtitle: "text-muted-foreground",
				socialButtonsBlockButton:
					"border-border bg-card hover:bg-muted text-foreground",
				dividerLine: "bg-border",
				dividerText: "text-muted-foreground",
				formFieldInput:
					"bg-input border-border text-foreground placeholder:text-muted-foreground",
				formFieldLabel: "text-muted-foreground",
				footerActionLink: "text-primary hover:text-primary/80",
				footerAction: "hidden",
				footer: "hidden",
			},
		}),
		[isDark],
	);
}

export function FlipAuthCard() {
	const [flipped, setFlipped] = useState(false);
	const clerkAppearance = useClerkAppearance();

	return (
		<div className="w-full" style={{ perspective: "1200px" }}>
			{/*
			  Both faces share the same grid cell (gridArea "1/1").
			  The grid grows to fit the TALLEST face, so content below
			  always sits beneath the full form height — no overlap.
			*/}
			<div
				className="transition-all duration-700 ease-in-out"
				style={{
					display: "grid",
					transformStyle: "preserve-3d",
					transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
				}}
			>
				{/* Front — Sign In */}
				<div
					className="w-full"
					style={{ gridArea: "1/1", backfaceVisibility: "hidden" }}
				>
					<SignIn
						routing="hash"
						fallbackRedirectUrl="/dashboard"
						appearance={clerkAppearance}
					/>
					<p className="mt-4 text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<button
							type="button"
							onClick={() => setFlipped(true)}
							className="font-medium text-primary hover:underline"
						>
							Create one
						</button>
					</p>
				</div>

				{/* Back — Sign Up */}
				<div
					className="w-full"
					style={{
						gridArea: "1/1",
						backfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
					}}
				>
					<SignUp
						routing="hash"
						fallbackRedirectUrl="/dashboard"
						appearance={clerkAppearance}
					/>
					<p className="mt-4 text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<button
							type="button"
							onClick={() => setFlipped(false)}
							className="font-medium text-primary hover:underline"
						>
							Sign in
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
