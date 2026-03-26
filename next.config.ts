import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
	devIndicators: false,
	experimental: {
		optimizePackageImports: [
			'sanity',
			'@sanity/vision',
			'next-sanity',
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
		return [
			{
				source: '/((?!studio).*)',
				headers: [
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'X-XSS-Protection', value: '1; mode=block' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
				],
			},
		]
	},
}

export default withBundleAnalyzer(nextConfig)
