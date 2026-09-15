import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Photon - A calmer way to browse",
			},
			{
				name: "description",
				content:
					"Join the Photon waitlist for early access to a calmer way to browse.",
			},
			{
				property: "og:title",
				content: "Photon — A calmer way to browse",
			},
			{
				property: "og:description",
				content:
					"Join the Photon waitlist for early access to a calmer way to browse.",
			},
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:url",
				content: "https://photonbrowser.vercel.app/",
			},
			{
				name: "twitter:card",
				content: "summary",
			},
			{
				name: "twitter:title",
				content: "Photon — A calmer way to browse",
			},
			{
				name: "twitter:description",
				content:
					"Join the Photon waitlist for early access to a calmer way to browse.",
			},
		],
		links: [
			{
				rel: "canonical",
				href: "https://photonbrowser.vercel.app/",
			},
			{
				rel: "icon",
				href: "/logo.svg",
				type: "image/svg+xml",
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com",
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&display=swap",
			},
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	notFoundComponent: NotFoundPage,
	shellComponent: RootDocument,
});

function NotFoundPage() {
	return (
		<main className="photon-page" id="top">
			<div className="photon-canvas">
				<div aria-hidden="true" className="photon-light photon-light--cyan" />
				<div aria-hidden="true" className="photon-light photon-light--blue" />
				<div aria-hidden="true" className="photon-light photon-light--lilac" />
				<div aria-hidden="true" className="photon-light photon-light--peach" />
				<div aria-hidden="true" className="photon-atmosphere" />
				<div aria-hidden="true" className="photon-not-found-backdrop">
					404
				</div>
				<header className="relative z-10 flex items-center justify-between gap-6 px-4 py-4 sm:px-8 sm:py-6 lg:px-12">
					<a
						className="flex items-center gap-2.5 text-[14px] font-semibold leading-none tracking-[-0.025em] text-[#16181d] no-underline"
						href="/"
					>
						<img
							alt=""
							aria-hidden="true"
							className="h-4 w-5 object-contain"
							src="/logo.svg"
						/>
						Photon
					</a>
				</header>
				<section
					aria-labelledby="not-found-title"
					className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center"
				>
					<h1
						className="max-w-[440px] text-balance text-[clamp(1.5rem,3vw,2.1rem)] font-medium leading-tight tracking-[-0.04em] text-[#111318]"
						id="not-found-title"
					>
						Sorry, this page isn’t here.
					</h1>
					<p className="mt-3 max-w-[320px] text-[14px] leading-6 text-[#646a74]">
						Let’s get you back to something useful.
					</p>
					<a
						className="photon-button mt-7 inline-flex h-11 items-center rounded-[13px] bg-[#17191d] px-5 text-sm font-medium text-white no-underline shadow-[0_5px_14px_rgba(20,22,27,0.16)] hover:bg-[#2a2d33] focus-visible:outline-2 focus-visible:outline-[#454a53] focus-visible:outline-offset-2"
						href="/"
					>
						Back to Photon
					</a>
				</section>
			</div>
		</main>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
