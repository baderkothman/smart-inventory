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
	const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
	const [rotation, setRotation] = useState(0);
	const clerkAppearance = useClerkAppearance();

	const switchTo = (newMode: "signIn" | "signUp") => {
		// Phase 1: rotate to 90° (card becomes edge-on)
		setRotation(90);
		setTimeout(() => {
			// Phase 2: swap content + jump to -90° with no transition
			setMode(newMode);
			setRotation(-90);
			// Phase 3: wait two frames so -90° is painted, then animate to 0°
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setRotation(0);
				});
			});
		}, 420);
	};

	return (
		<div className="w-full" style={{ perspective: "1200px" }}>
			<div
				style={{
					transform: `rotateY(${rotation}deg)`,
					transition: rotation === -90 ? "none" : "transform 420ms cubic-bezier(0.65, 0, 0.35, 1)",
				}}
			>
				{mode === "signIn" ? (
					<>
						<SignIn
							routing="hash"
							signUpUrl="/"
							fallbackRedirectUrl="/dashboard"
							appearance={clerkAppearance}
						/>
						<p className="mt-4 text-center text-sm text-muted-foreground">
							Don&apos;t have an account?{" "}
							<button
								type="button"
								onClick={() => switchTo("signUp")}
								className="font-medium text-primary hover:underline"
							>
								Create one
							</button>
						</p>
					</>
				) : (
					<>
						<SignUp
							routing="hash"
							signInUrl="/"
							fallbackRedirectUrl="/dashboard"
							appearance={clerkAppearance}
						/>
						<p className="mt-4 text-center text-sm text-muted-foreground">
							Already have an account?{" "}
							<button
								type="button"
								onClick={() => switchTo("signIn")}
								className="font-medium text-primary hover:underline"
							>
								Sign in
							</button>
						</p>
					</>
				)}
			</div>
		</div>
	);
}
