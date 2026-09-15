import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServer } from "./supabase.server";

const waitlistSchema = z.object({
	email: z.string().trim().toLowerCase().email(),
});

export const joinWaitlist = createServerFn({ method: "POST" })
	.validator((data: { email: string }) => data)
	.handler(async ({ data }) => {
		const parsed = waitlistSchema.safeParse(data);

		if (!parsed.success) {
			return { status: "invalid_email" as const };
		}

		const supabaseServer = getSupabaseServer();

		if (!supabaseServer) {
			console.error("Waitlist signup failed: missing server configuration");
			return { status: "error" as const };
		}

		const { error } = await supabaseServer
			.from("waitlist")
			.insert({ email: parsed.data.email });

		if (error?.code === "23505") {
			return { status: "already_joined" as const };
		}

		if (error) {
			console.error("Waitlist signup failed", { code: error.code });
			return { status: "error" as const };
		}

		return { status: "success" as const };
	});
