import { env } from "node:process";
import { createClient } from "@supabase/supabase-js";

export function getSupabaseServer() {
	const supabaseUrl = env.SUPABASE_URL;
	const supabaseKey = env.SUPABASE_PUBLISHABLE_KEY ?? env.SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseKey) {
		return null;
	}

	return createClient(supabaseUrl, supabaseKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}
