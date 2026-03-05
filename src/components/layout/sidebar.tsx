"use client";

import { LayoutDashboard, Package, PackagePlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV_ITEMS = [
	{
		href: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true,
	},
	{
		href: "/dashboard/assets/new",
		label: "Add Asset",
		icon: PackagePlus,
		exact: false,
	},
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="flex h-full w-60 flex-col border-r bg-card">
			{/* Logo */}
			<div className="flex h-14 items-center gap-2 px-5">
				<Package className="h-5 w-5 text-primary" />
				<span className="text-base font-bold tracking-tight">
					Smart
					<span className="text-muted-foreground font-normal">Inventory</span>
				</span>
			</div>

			<Separator />

			{/* Navigation */}
			<nav className="flex-1 space-y-1 px-3 py-4">
				{NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
					const isActive = exact
						? pathname === href
						: pathname.startsWith(href);
					return (
						<Tooltip key={href} delayDuration={300}>
							<TooltipTrigger asChild>
								<Link
									href={href}
									className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
										isActive
											? "bg-primary text-primary-foreground"
											: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
									}`}
								>
									<Icon className="h-4 w-4 shrink-0" />
									{label}
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">{label}</TooltipContent>
						</Tooltip>
					);
				})}
			</nav>

			<Separator />

			<div className="px-5 py-4">
				<p className="text-xs text-muted-foreground">Smart Inventory Hub</p>
				<p className="text-xs text-muted-foreground">v1.0.0</p>
			</div>
		</aside>
	);
}
