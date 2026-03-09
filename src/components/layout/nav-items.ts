import { LayoutDashboard, Package } from "lucide-react";

export const NAV_ITEMS = [
	{
		href: "/dashboard",
		label: "Overview",
		icon: LayoutDashboard,
		exact: true,
	},
	{
		href: "/assets",
		label: "Assets",
		icon: Package,
		exact: false,
	},
];
