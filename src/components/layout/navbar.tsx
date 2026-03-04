import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export async function Navbar() {
  const user = await currentUser();

  const displayName =
    user?.firstName ??
    user?.emailAddresses[0]?.emailAddress?.split("@")[0] ??
    "User";

  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-card px-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.imageUrl} alt={displayName} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Welcome back,{" "}
            <span className="font-medium text-foreground">{displayName}</span>
          </span>
        </div>
        <UserButton />
      </header>
      <Separator />
    </>
  );
}
