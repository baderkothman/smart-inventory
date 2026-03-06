"use client";

import { LayoutDashboard, Menu, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

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

export function MobileSidebar() {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				className="h-8 w-8 md:hidden"
				onClick={() => setOpen(true)}
				aria-label="Open navigation"
			>
				<Menu className="h-4 w-4" />
			</Button>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent
					side="left"
					className="w-56 p-0 bg-sidebar border-sidebar-border"
				>
					<SheetTitle className="sr-only">Navigation</SheetTitle>

					{/* Logo */}
					<div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-5">
						<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-primary/30 bg-primary/10">
							<Package className="h-3.5 w-3.5 text-primary" />
						</div>
						<span className="font-mono text-sm font-semibold tracking-tight text-foreground">
							smart<span className="text-primary">inv</span>
						</span>
					</div>

					{/* Navigation */}
					<nav className="px-3 py-4">
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
										onClick={() => setOpen(false)}
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
				</SheetContent>
			</Sheet>
		</>
	);
}
