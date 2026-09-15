import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion, useReducedMotion } from "motion/react";
import { type FormEvent, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { joinWaitlist } from "../utils/waitlist.functions";

const WAITLIST_JOINED_KEY = "photon.waitlist.joined";
const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
const HERO_EXIT_DURATION = 760;

export const Route = createFileRoute("/")({ component: Home });

function rememberWaitlistSignup() {
	try {
		window.localStorage.setItem(WAITLIST_JOINED_KEY, "true");
	} catch {
		// Storage can be unavailable in private browsing or locked-down contexts.
	}
}

function hasRememberedSignup() {
	try {
		return window.localStorage.getItem(WAITLIST_JOINED_KEY) === "true";
	} catch {
		return false;
	}
}

function drawSmallConfetti(
	this: { shape: number; radius: number; w: number; h: number },
	context: CanvasRenderingContext2D,
) {
	if (this.shape === 0) {
		context.arc(0, 0, this.radius * 0.4, 0, 2 * Math.PI);
		context.fill();
	} else if (this.shape === 1) {
		context.fillRect(-this.w * 0.2, -this.h * 0.2, this.w * 0.4, this.h * 0.4);
	} else {
		context.fillRect(
			-this.w * 0.067,
			-this.h * 0.2,
			this.w * 0.134,
			this.h * 0.4,
		);
	}
}

function useWindowSize() {
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		function updateSize() {
			setSize({ width: window.innerWidth, height: window.innerHeight });
		}

		updateSize();
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	return size;
}

function Navbar() {
	return (
		<header className="relative z-10 flex items-center justify-between gap-6 px-4 py-4 sm:px-8 sm:py-6 lg:px-12">
			<a
				className="flex items-center gap-2.5 text-[14px] font-semibold leading-none tracking-[-0.025em] text-[#16181d] no-underline"
				href="#top"
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
	);
}

function WaitlistForm({ onJoined }: { onJoined: (message: string) => void }) {
	const joinWaitlistFn = useServerFn(joinWaitlist);
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		"idle" | "submitting" | "invalid_email" | "error"
	>("idle");
	const prefersReducedMotion = useReducedMotion();

	const isSubmitting = status === "submitting";
	const feedback =
		status === "error"
			? "Something went wrong. Try again."
			: status === "invalid_email"
				? "Enter a valid email address."
				: undefined;

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (isSubmitting) return;

		if (!email.trim()) {
			setStatus("invalid_email");
			return;
		}

		const submittedAt = Date.now();
		setStatus("submitting");

		try {
			const result = await joinWaitlistFn({ data: { email } });

			if (result.status === "success") {
				const remaining = Math.max(0, 800 - (Date.now() - submittedAt));

				if (remaining > 0) {
					await new Promise((resolve) => setTimeout(resolve, remaining));
				}

				rememberWaitlistSignup();
				setEmail("");
				onJoined("You're on the list.");
				return;
			}

			if (result.status === "already_joined") {
				rememberWaitlistSignup();
				onJoined("You're already on the list.");
				return;
			}

			setStatus(result.status);
		} catch {
			setStatus("error");
		}
	}

	return (
		<form
			className="mt-8 w-full max-w-[440px]"
			noValidate
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col gap-2 rounded-[18px] border border-white/80 bg-white/45 p-1.5 shadow-[0_10px_30px_rgba(98,113,145,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl sm:flex-row">
				<input
					aria-label="Email address"
					aria-describedby={feedback ? "email-feedback" : undefined}
					aria-invalid={status === "invalid_email"}
					className="photon-input h-11 min-w-0 flex-1 rounded-[13px] border-white/70 bg-white/35 px-3.5 text-sm text-[#17191d] placeholder:text-[#636b78]"
					id="email"
					name="email"
					placeholder="you@example.com"
					required
					type="email"
					autoComplete="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					disabled={isSubmitting}
				/>
				<motion.button
					className="photon-button h-11 rounded-[13px] bg-[#17191d] px-5 text-sm font-medium text-white shadow-[0_5px_14px_rgba(20,22,27,0.16)] hover:bg-[#2a2d33] sm:min-w-[148px]"
					disabled={isSubmitting}
					type="submit"
					transition={{
						damping: 28,
						mass: 0.35,
						stiffness: 420,
						type: "spring",
					}}
					whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
				>
					{isSubmitting ? "Joining…" : "Join the waitlist"}
				</motion.button>
			</div>
			{feedback && (
				<p
					id="email-feedback"
					aria-live="polite"
					className="mt-2 min-h-5 text-[13px] text-[#646a74]"
				>
					{feedback}
				</p>
			)}
		</form>
	);
}

function SuccessCheck({
	isVisible,
	prefersReducedMotion,
}: {
	isVisible: boolean;
	prefersReducedMotion: boolean;
}) {
	const transition = prefersReducedMotion
		? { duration: 0 }
		: { duration: 1.05, ease: MOTION_EASE };

	return (
		<motion.span
			aria-hidden="true"
			animate={
				isVisible
					? { opacity: 1, y: 0, rotate: 0, scale: 1, filter: "blur(0px)" }
					: {
							opacity: 0,
							y: 24,
							rotate: -8,
							scale: 0.96,
							filter: "blur(10px)",
						}
			}
			initial={{
				opacity: 0,
				y: 24,
				rotate: -8,
				scale: 0.96,
				filter: "blur(10px)",
			}}
			transition={transition}
		>
			<svg
				aria-hidden="true"
				className="h-10 w-10"
				fill="none"
				viewBox="0 0 24 24"
			>
				<motion.path
					animate={{ strokeDashoffset: isVisible ? 0 : 20 }}
					d="M5 12.5 9.3 16.8 19 7.2"
					initial={{ strokeDashoffset: 20 }}
					pathLength={20}
					stroke="currentColor"
					strokeDasharray="20"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.8"
					transition={
						prefersReducedMotion
							? { duration: 0 }
							: { delay: 0.12, duration: 0.9, ease: MOTION_EASE }
					}
				/>
			</svg>
		</motion.span>
	);
}

function WaitlistHero() {
	const [hasJoined, setHasJoined] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [joinedMessage, setJoinedMessage] = useState("You're on the list.");
	const prefersReducedMotion = useReducedMotion();
	const { width, height } = useWindowSize();
	const morphTransition = prefersReducedMotion
		? { duration: 0 }
		: { duration: HERO_EXIT_DURATION / 1000, ease: MOTION_EASE };

	useEffect(() => {
		if (hasRememberedSignup()) setHasJoined(true);
	}, []);

	useEffect(() => {
		if (!hasJoined) {
			setShowSuccess(false);
			return;
		}

		if (prefersReducedMotion) {
			setShowSuccess(true);
			return;
		}

		const timer = window.setTimeout(
			() => setShowSuccess(true),
			HERO_EXIT_DURATION,
		);
		return () => window.clearTimeout(timer);
	}, [hasJoined, prefersReducedMotion]);

	function showJoined(message: string) {
		setJoinedMessage(message);
		setHasJoined(true);
		setShowConfetti(prefersReducedMotion !== true);
	}

	return (
		<>
			{showConfetti && width > 0 && height > 0 && (
				<>
					<Confetti
						aria-hidden="true"
						className="photon-confetti"
						colors={["#8fe8ef", "#a8cff4", "#d5caf2", "#f4d2b7"]}
						confettiSource={{ x: 0, y: height * 0.72, w: 1, h: 1 }}
						height={height}
						initialVelocityX={{ min: 3, max: 11 }}
						initialVelocityY={{ min: -18, max: -10 }}
						numberOfPieces={150}
						onConfettiComplete={() => setShowConfetti(false)}
						recycle={false}
						drawShape={drawSmallConfetti}
						tweenDuration={420}
						width={width}
					/>
					<Confetti
						aria-hidden="true"
						className="photon-confetti"
						colors={["#8fe8ef", "#a8cff4", "#d5caf2", "#f4d2b7"]}
						confettiSource={{ x: width - 1, y: height * 0.72, w: 1, h: 1 }}
						height={height}
						initialVelocityX={{ min: -11, max: -3 }}
						initialVelocityY={{ min: -18, max: -10 }}
						numberOfPieces={150}
						drawShape={drawSmallConfetti}
						recycle={false}
						tweenDuration={420}
						width={width}
					/>
				</>
			)}
			<section className="relative z-10 flex flex-1 -translate-y-4 flex-col items-center justify-center px-4 pb-12 pt-12 text-center sm:-translate-y-16 sm:px-8 sm:pb-14 sm:pt-14 lg:pb-16 lg:pt-16">
				<div className="photon-hero-stage">
					<motion.div
						animate={{
							opacity: hasJoined ? 0 : 1,
							y: hasJoined ? 6 : 0,
							filter: hasJoined ? "blur(4px)" : "blur(0px)",
						}}
						className="photon-hero-content"
						style={{ pointerEvents: hasJoined ? "none" : "auto" }}
						transition={morphTransition}
					>
						<h1 className="max-w-[720px] text-balance text-[clamp(2.65rem,5.4vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[#111318]">
							A calmer way to browse.
						</h1>
						<p className="mt-5 max-w-[360px] text-[15px] font-normal leading-6 text-[#646a74]">
							Join the waitlist for early access to Photon.
						</p>
						<WaitlistForm onJoined={showJoined} />
					</motion.div>
					<output
						aria-atomic="true"
						aria-hidden={!showSuccess}
						aria-live="polite"
						className="photon-success-state"
						style={{
							pointerEvents: showSuccess ? "auto" : "none",
							visibility: showSuccess ? "visible" : "hidden",
						}}
					>
						<SuccessCheck
							isVisible={showSuccess}
							prefersReducedMotion={prefersReducedMotion === true}
						/>
						<motion.p
							animate={
								showSuccess
									? { opacity: 1, y: 0, filter: "blur(0px)" }
									: { opacity: 0, y: 12, filter: "blur(8px)" }
							}
							className="photon-success-copy"
							initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
							transition={
								prefersReducedMotion
									? { duration: 0 }
									: { delay: 0.16, duration: 0.8, ease: MOTION_EASE }
							}
						>
							{joinedMessage}
						</motion.p>
					</output>
				</div>
			</section>
		</>
	);
}

function Home() {
	return (
		<main className="photon-page" id="top">
			<div className="photon-canvas">
				<div aria-hidden="true" className="photon-light photon-light--cyan" />
				<div aria-hidden="true" className="photon-light photon-light--blue" />
				<div aria-hidden="true" className="photon-light photon-light--lilac" />
				<div aria-hidden="true" className="photon-light photon-light--peach" />
				<div aria-hidden="true" className="photon-atmosphere" />
				<Navbar />
				<WaitlistHero />
			</div>
		</main>
	);
}
