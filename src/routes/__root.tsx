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
	shellComponent: RootDocument,
});

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
