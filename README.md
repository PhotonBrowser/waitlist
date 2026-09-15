# Photon Waitlist

TanStack Start waitlist page, deployed with Nitro on Vercel.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `.env` for working signups.
The page still loads without them, but submissions return an error.

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import it in Vercel from the repository root.
3. Keep the detected `TanStack Start` framework preset.
4. Add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` under Project Settings → Environment Variables.
5. Deploy.

Vercel detects the existing `vercel.json` and Nitro setup automatically. No
custom output directory or build command is needed.

CLI deployment:

```bash
npx vercel
npx vercel --prod
```

Run checks locally before deploying:

```bash
npm run check
npm run build
```

Keep Supabase variables server-only. Do not rename them with a `VITE_` prefix;
those values are exposed in browser JavaScript.
