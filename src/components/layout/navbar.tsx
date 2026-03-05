import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function Navbar() {
	const user = await currentUser();

	const displayName =
		user?.firstName ??
		user?.emailAddresses[0]?.emailAddress?.split("@")[0] ??
		"User";

	const initials = displayName.slice(0, 2).toUpperCase();

	return (
		<header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/60 px-6 backdrop-blur-sm">
			<div className="flex items-center gap-2">
				<span className="text-xs text-muted-foreground">
					Welcome back,{" "}
					<span className="font-medium text-foreground">{displayName}</span>
				</span>
			</div>
			<div className="flex items-center gap-3">
				<Avatar className="h-7 w-7 border border-border">
					<AvatarImage src={user?.imageUrl} alt={displayName} />
					<AvatarFallback className="bg-primary/10 font-mono text-xs text-primary">
						{initials}
					</AvatarFallback>
				</Avatar>
				<UserButton />
			</div>
		</header>
	);
}
