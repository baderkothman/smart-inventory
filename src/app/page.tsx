import { auth } from "@clerk/nextjs/server";
import { Activity, BarChart3, Bot, Package, Shield, Tag } from "lucide-react";
import { redirect } from "next/navigation";
import { FlipAuthCard } from "@/components/auth/flip-auth-card";

const FEATURES = [
	{
		icon: Bot,
		title: "AI-Generated Descriptions",
		desc: "Powered by Google Gemini — auto-fill asset descriptions in one click.",
	},
	{
		icon: Activity,
		title: "Real-Time Status Tracking",
		desc: "Monitor Active, Assigned, Maintenance, and Retired states across all assets.",
	},
	{
		icon: BarChart3,
		title: "Analytics Dashboard",
		desc: "Visual overview of your inventory with category and status breakdowns.",
	},
	{
		icon: Tag,
		title: "Smart Categorization",
		desc: "Organize assets by type — laptops, servers, licenses, peripherals, and more.",
	},
	{
		icon: Shield,
		title: "Secure & Private",
		desc: "Every asset is scoped to your account. No cross-user data leakage, ever.",
	},
	{
		icon: Package,
		title: "Full Asset Lifecycle",
		desc: "Track serial numbers, manufacturers, models, locations, and assignees.",
	},
];

export default async function HomePage() {
	const { userId } = await auth();
	if (userId) redirect("/dashboard");

	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			{/* Background grid */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>
			{/* Glow blobs */}
			<div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
			<div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />

			<div className="relative mx-auto max-w-7xl px-6">
				{/*
				  Mobile:  flex-col — brand/headline → auth card → features → footer
				  Desktop: CSS grid — left col (headline+features+footer) | right col (auth, centered)
				*/}
				<div className="flex flex-col gap-8 py-8 lg:grid lg:min-h-screen lg:grid-cols-[1fr_420px] lg:grid-rows-[auto_1fr_auto] lg:gap-x-16 lg:gap-y-6 lg:py-0">
					{/* ── 1. Brand + Headline ── */}
					<div className="order-1 flex flex-col gap-5 lg:col-start-1 lg:row-start-1 lg:pt-24">
						{/* Brand */}
						<div className="flex items-center gap-3">
							<div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
								<Package className="h-4 w-4 text-primary" />
							</div>
							<span className="font-mono text-base font-semibold tracking-tight text-foreground">
								smart<span className="text-primary">inv</span>
							</span>
						</div>

						{/* Headline */}
						<div className="space-y-3">
							<div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
								<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
								AI-Powered Asset Management
							</div>
							<h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
								Manage every
								<br />
								<span className="text-primary">asset</span>, effortlessly.
							</h1>
							<p className="max-w-lg text-base text-muted-foreground sm:text-lg">
								Smart Inventory Hub gives your team a single source of truth for
								all organizational assets — from laptops to licenses — with
								AI-powered descriptions and real-time analytics.
							</p>
						</div>
					</div>

					{/* ── 2. Auth card ── */}
					<div className="order-2 flex flex-col items-center lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:justify-center lg:py-24">
						<div className="mb-6 text-center">
							<h2 className="font-mono text-lg font-semibold text-foreground">
								Get started
							</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								Sign in or create a free account to continue
							</p>
						</div>
						<FlipAuthCard />
					</div>

					{/* ── 3. Features grid (3×2) ── */}
					<div className="order-3 grid grid-cols-3 gap-3 lg:col-start-1 lg:row-start-2 lg:grid-cols-2 lg:gap-3">
						{FEATURES.map(({ icon: Icon, title, desc }) => (
							<div
								key={title}
								className="flex flex-col gap-2 rounded-xl border border-border/50 bg-card/40 p-3 backdrop-blur-sm lg:flex-row lg:gap-3 lg:p-4"
							>
								<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
									<Icon className="h-3.5 w-3.5 text-primary" />
								</div>
								<div>
									<p className="text-xs font-medium text-foreground lg:text-sm">
										{title}
									</p>
									<p className="mt-0.5 hidden text-xs text-muted-foreground lg:block">
										{desc}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* ── 4. Footer note ── */}
					<p className="order-4 font-mono text-[11px] text-muted-foreground/50 lg:col-start-1 lg:row-start-3 lg:pb-24">
						v1.0.0 · Built with Next.js, Clerk &amp; Gemini AI
					</p>
				</div>
			</div>
		</div>
	);
}
