# Clean Architecture Template

based on this [repo](https://github.com/nikolovlazar/nextjs-clean-architecture)

## Features

- Own Autentification Implementation
- Email Verification (Mocked up)
- User Roles

### To Implement

- [ ] Password Recovery
- [ ] 2FA
- [ ] Admin Dashboard
- [ ] Email Verification with actual email service

## Setup

1. Get `DATABASE_URL` of a postgres neon databse at
   [neon database](https://neon.tech/)
2. Go to [sentry](https://sentry.io), create and project and follow the
   instructions to get `SENTRY_DSN`
3. If using codecov for test coverage reports go to
   [codecov](https://codecov.io) and get `CODECOV_TOKEN` on project settings

follow `.env.example` file to know the required enviroment variables

### Setup Github Ruleset for actions

1. import the `PR Lint, Test, Deploy Workflow Must Pass` settings for rulsesets
   inside `.github/rulesets/`
2. if using vercel for deployment add the following secrets to te github
   repository `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN`, obtained at
   the following
   [guide ](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)
