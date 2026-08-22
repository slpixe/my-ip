# my-ip Cloudflare Workers Deployment Setup

This document outlines the setup for deploying `my-ip` to Cloudflare Workers
with automatic CI/CD via GitHub Actions.

## Setup Complete ✅

The following configuration has been added to your project:

### 1. Dependencies Installed
- `@opennextjs/cloudflare@1.20.2` - OpenNext adapter for Cloudflare Workers
- `wrangler@4.124.0` - Cloudflare CLI tool

### 2. Configuration Files Added

#### `wrangler.json`
- Configures the Cloudflare Worker deployment
- Sets up asset handling and Node.js compatibility
- Adds a native Worker rate-limit binding for `/api/ip` (10 requests per 10 seconds per client key and Cloudflare location)
- Worker name: `my-ip`

#### `open-next.config.ts`
- OpenNext configuration for Cloudflare adapter
- Uses default Cloudflare configuration

#### Updated `package.json` Scripts
- `preview` - Build and preview locally with Cloudflare environment
- `deploy` - Build and deploy to Cloudflare Workers
- `cf-typegen` - Generate TypeScript types for Cloudflare environment

#### `.github/workflows/deploy.yml`
- Quality checks on pull requests and pushes to `master` or `main`
- Automatic deployment after successful checks on pushes to `master` or `main`
  when the `CLOUDFLARE_DEPLOY_ENABLED` repository variable is `true`
- Uses Node.js 24 and pnpm 11.9.0 with dependency caching

## Next Steps - Manual Setup Required

### 1. Cloudflare Account Setup

1. **Create/Access Cloudflare Account**: Go to [dash.cloudflare.com](https://dash.cloudflare.com)

2. **Get Account ID**: 
   - In the Cloudflare dashboard, find your Account ID in the right sidebar
   - Copy this for step 3

3. **Create API Token**:
   - Go to [cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click "Create Token"
   - Use "Custom token" template
   - Under permission policies, select `Edit Cloudflare Workers`
   - For Account resources: Select your account
   - For Zone resources: Select specific zone (if using custom domain) or "All zones"

### 2. GitHub Repository Secrets

Add these secrets to your GitHub repository:

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add these repository secrets:
   - `CLOUDFLARE_API_TOKEN`: The API token from step 3 above
   - `CLOUDFLARE_ACCOUNT_ID`: The Account ID from step 2 above
3. Add the repository variable `CLOUDFLARE_DEPLOY_ENABLED` with value `true`
   after both secrets are configured. Until then, CI runs the quality job and
   safely skips deployment.

### 3. First Deployment

#### Option A: Deploy from Local Machine
```bash
# Authenticate with Cloudflare (one-time setup)
npx wrangler login

# Deploy to production
pnpm deploy
```

#### Option B: Deploy via GitHub Actions
- Confirm both secrets and `CLOUDFLARE_DEPLOY_ENABLED=true` are configured
- Push changes to the `master` or `main` branch
- GitHub Actions will deploy after the quality job passes

### 4. Custom Domain

The `routes` entry in `wrangler.json` binds the Worker to `ip.slpixe.com` as a
Cloudflare custom domain. Cloudflare manages the domain's DNS record and TLS
certificate; update the route before deploying a fork under another hostname.

## Development Workflow

- **Local Development**: `pnpm dev` (uses Next.js dev server)
- **Test with Cloudflare**: `pnpm preview` (tests with Cloudflare Workers environment)
- **Deploy**: `pnpm deploy` or push to master/main branch

## Features Verified Working

- ✅ App builds successfully for Cloudflare Workers
- ✅ API endpoints use trusted and validated visitor IP metadata
- ✅ External providers enrich the visitor IP instead of reporting Worker egress IPs
- ✅ API endpoints use Cloudflare's native rate-limit binding
- ✅ Per-visitor responses opt out of browser and CDN caching
- ✅ Static assets served correctly
- ✅ Server-side rendering functional
- ✅ Auto-refresh and time-series functionality preserved

## Monitoring Deployment

After setting up the secrets and deploying:

1. **Check GitHub Actions**: Monitor the deployment in the Actions tab
2. **Cloudflare Dashboard**: View your Worker in the Workers & Pages section
3. **Custom Metrics**: Access logs and analytics in the Cloudflare dashboard

## Troubleshooting

- **Build Failures**: Check that all dependencies are properly installed
- **Deployment Issues**: Verify API token has correct permissions
- **Custom Domain**: Ensure the deploy token can edit Workers in the relevant zone

`my-ip` is ready for Cloudflare Workers deployment once the account secrets are configured.
