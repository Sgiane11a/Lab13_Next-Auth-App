This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy to Vercel - NextAuth specific notes

Follow these steps to deploy this project to Vercel with NextAuth working correctly:

1. Push your repository to Git (GitHub/GitLab) and import it on Vercel.
2. In the Vercel dashboard, open your Project Settings → Environment Variables and add the following variables (Values depend on your OAuth apps and secrets):

	- `NEXTAUTH_URL` = `https://<your-vercel-app>.vercel.app`
	- `NEXTAUTH_SECRET` = a strong random string (e.g. from `openssl rand -hex 32`)
	- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (if you use Google OAuth)
	- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` (if you use GitHub OAuth)
	- (Optional) `DATABASE_URL` = connection string for a production database (recommended)

3. Important: this project currently uses a simple JSON file (`src/data/users.json`) as its user store. Vercel runs serverless functions with ephemeral filesystem — files written at runtime will NOT persist long-term. For production you must use a database (e.g. Postgres, MySQL, or a hosted DB service like Supabase, PlanetScale, Neon) and configure NextAuth with an adapter (Prisma adapter is recommended).

4. If you plan to use a database, set `DATABASE_URL` in Vercel and follow the adapter setup (e.g. Prisma): https://next-auth.js.org/adapters

5. Configure your OAuth apps (GitHub/Google) to include the correct callback URL(s), for example:

	- `https://<your-vercel-app>.vercel.app/api/auth/callback/github`
	- `https://<your-vercel-app>.vercel.app/api/auth/callback/google`

6. Deploy. After a successful build, test registration and signin flows on the deployed URL.

Notes & Recommendations:
- For production, migrate the JSON store to a real DB and use a NextAuth adapter.
- Add rate-limiting and monitoring to protect login endpoints.
- Keep OAuth client secrets and `NEXTAUTH_SECRET` private in Vercel environment variables.

If you want, I can help: 1) migrate the user store to Prisma+Postgres (or SQLite for local), 2) add the Prisma NextAuth adapter and database migrations, and 3) update the app to use the adapter for production.
