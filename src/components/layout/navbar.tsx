import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggle } from "./theme-toggle";

export async function Navbar() {
	const user = await currentUser();

	const displayName =
		user?.firstName ??
		user?.emailAddresses[0]?.emailAddress?.split("@")[0] ??
		"User";

	return (
		<header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur-sm md:px-6">
			<div className="flex items-center gap-3">
				<MobileSidebar />
				<span className="text-xs text-muted-foreground">
					Welcome back,{" "}
					<span className="font-medium text-foreground">{displayName}</span>
				</span>
			</div>
			<div className="flex items-center gap-2">
				<ThemeToggle />
				<UserButton />
			</div>
		</header>
	);
}
