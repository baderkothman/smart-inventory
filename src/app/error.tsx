"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex h-screen flex-col items-center justify-center gap-4">
			<h2 className="font-mono text-lg font-semibold text-foreground">
				Something went wrong
			</h2>
			<p className="text-sm text-muted-foreground">
				{error.message || "An unexpected error occurred."}
			</p>
			<Button size="sm" onClick={reset}>
				Try again
			</Button>
		</div>
	);
}
