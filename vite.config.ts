import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function resolvePublicSiteUrl(env: Record<string, string>): string {
  const vercelHost =
    env.VERCEL_ENV === 'production'
      ? env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL
      : env.VERCEL_URL || env.VERCEL_PROJECT_PRODUCTION_URL

  const candidates = [env.VITE_SITE_URL, vercelHost, env.CF_PAGES_URL, env.URL]

  for (const raw of candidates) {
    const trimmed = raw?.trim()
    if (!trimmed) continue
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    return withProtocol.replace(/\/+$/, '')
  }

  return ''
}

function openGraphMetaPlugin(siteUrl: string): Plugin {
  return {
    name: 'og-meta-url-resolver',
    transformIndexHtml(html) {
      const ogImageUrl = siteUrl ? `${siteUrl}/og-cover.png` : '/og-cover.png'
      const ogUrlMeta = siteUrl ? `    <meta property="og:url" content="${siteUrl}/" />\n` : ''

      return html
        .replaceAll('%OG_IMAGE_URL%', ogImageUrl)
        .replace('    %OG_URL_META%\n', ogUrlMeta)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const siteUrl = resolvePublicSiteUrl(env)

  return {
    plugins: [react(), openGraphMetaPlugin(siteUrl)],
  }
})
