"use client";

import { LayoutDashboard, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
	{
		href: "/dashboard",
		label: "Overview",
		icon: LayoutDashboard,
		exact: true,
	},
	{
		href: "/dashboard/assets",
		label: "Assets",
		icon: Package,
		exact: false,
	},
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="hidden h-full w-56 flex-col border-r border-sidebar-border bg-sidebar md:flex">
			{/* Logo */}
			<div className="flex h-14 items-center gap-3 px-5">
				<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-primary/30 bg-primary/10">
					<Package className="h-3.5 w-3.5 text-primary" />
				</div>
				<span className="font-mono text-sm font-semibold tracking-tight text-foreground">
					smart<span className="text-primary">inv</span>
				</span>
			</div>

			<div className="mx-4 h-px bg-sidebar-border" />

			{/* Navigation */}
			<nav className="flex-1 px-3 py-4">
				<p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
					Navigation
				</p>
				<div className="space-y-0.5">
					{NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
						const isActive = exact
							? pathname === href
							: pathname.startsWith(href);
						return (
							<Link
								key={href}
								href={href}
								className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 ${
									isActive
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
								}`}
							>
								{isActive && (
									<span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
								)}
								<Icon className="h-4 w-4 shrink-0" />
								{label}
							</Link>
						);
					})}
				</div>
			</nav>

			<div className="mx-4 h-px bg-sidebar-border" />

			<div className="px-5 py-4">
				<p className="font-mono text-[10px] text-muted-foreground">v1.0.0</p>
			</div>
		</aside>
	);
}
