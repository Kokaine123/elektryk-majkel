import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})

function getContentSecurityPolicy(isDev: boolean) {
	const scriptSrc = isDev
		? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net"
		: "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net"

	return [
		"default-src 'self'",
		"base-uri 'self'",
		"object-src 'none'",
		"frame-ancestors 'none'",
		"form-action 'self'",
		scriptSrc,
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob: https://cdn.sanity.io https://www.googletagmanager.com https://www.facebook.com https://*.tile.openstreetmap.org https://unpkg.com",
		"font-src 'self' data: https://fonts.gstatic.com",
		"connect-src 'self' https://cdn.sanity.io https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://www.facebook.com",
		"frame-src https://www.googletagmanager.com",
		"worker-src 'self' blob:",
		'upgrade-insecure-requests',
	].join('; ')
}

const nextConfig: NextConfig = {
	turbopack: {},
	devIndicators: false,
	transpilePackages: ['sanity', '@sanity/vision', 'next-sanity', 'sanity-plugin-media'],
	experimental: {
		optimizePackageImports: [
			'@portabletext/react',
			'styled-components',
			'leaflet',
			'react-leaflet',
		],
	},
	webpack: (config, { isServer, dev }) => {
		if (!isServer) {
			// Remove unnecessary polyfills for modern browsers
			config.resolve.alias = {
				...config.resolve.alias,
				'core-js': false,
			}
			// Exclude Next.js built-in nomodule polyfills
			config.plugins = config.plugins.filter(
				(plugin: { constructor?: { name?: string } }) => plugin.constructor?.name !== 'NextPolyfillNoModulePlugin',
			)
		}
		if (dev) {
			// Increase HMR WebSocket timeout to prevent "no activity" warnings
			config.devServer = {
				...config.devServer,
				client: { webSocketTransport: 'ws' },
			}
		}
		return config
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
			},
		],
	},
	async headers() {
		const isDev = process.env.NODE_ENV !== 'production'
		const contentSecurityPolicy = getContentSecurityPolicy(isDev)
		return [
			{
				source: '/((?!studio).*)',
				headers: [
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
					{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
					{ key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
					{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
					{ key: 'Content-Security-Policy', value: contentSecurityPolicy },
				],
			},
		]
	},
}

export default withBundleAnalyzer(nextConfig)
