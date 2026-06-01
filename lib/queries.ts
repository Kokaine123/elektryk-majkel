import { client, previewClient } from './sanity'
import { groq } from 'next-sanity'
import { draftMode } from 'next/headers'

// Draft-mode-aware fetch with revalidation tags
async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}, tags: string[] = []): Promise<T> {
	let isDraft = false
	try {
		isDraft = (await draftMode()).isEnabled
	} catch {
		// draftMode() unavailable in generateStaticParams / build context
	}

	if (isDraft) {
		return previewClient.fetch<T>(query, params)
	}

	return client.fetch<T>(query, params, {
		next: { revalidate: 60, tags: [...tags, 'sanity'] },
	})
}

// ─── Projects ────────────────────────────────────────────
export interface SanityProject {
	_id: string
	title: string
	category: string
	description: string
	image?: {
		asset: {
			_ref: string
		}
		alt?: string
		hotspot?: {
			x: number
			y: number
		}
	}
	order: number
}

const projectsQuery = groq`
	*[_type == "project"] | order(order asc) {
		_id,
		title,
		category,
		description,
		image,
		order
	}
`

export async function getProjects(): Promise<SanityProject[]> {
	return sanityFetch(projectsQuery, {}, ['project'])
}

// ─── Reviews ─────────────────────────────────────────────
export interface SanityReview {
	_id: string
	author: string
	rating: number
	text: string
	date: string
	order: number
}

const reviewsQuery = groq`
	*[_type == "review"] | order(order asc) {
		_id, author, rating, text, date, order
	}
`

export async function getReviews(): Promise<SanityReview[]> {
	return sanityFetch(reviewsQuery, {}, ['review'])
}

// ─── Services ────────────────────────────────────────────
export interface SanityService {
	_id: string
	title: string
	description: string
	icon?: string
	order: number
}

const servicesQuery = groq`
	*[_type == "service"] | order(order asc) {
		_id, title, description, icon, order
	}
`

export async function getServices(): Promise<SanityService[]> {
	return sanityFetch(servicesQuery, {}, ['service'])
}

// ─── Contact Info (singleton) ────────────────────────────
export interface SanityContactInfo {
	phone: string
	email: string
	location?: string
	workingHoursWeekday?: string
	workingHoursSaturday?: string
	emergencyNote?: string
	emergencyAvailable?: string
	emailResponseTime?: string
}

const contactInfoQuery = groq`
	*[_type == "contactInfo"][0] {
		phone, email, location,
		workingHoursWeekday, workingHoursSaturday, emergencyNote,
		emergencyAvailable, emailResponseTime
	}
`

export async function getContactInfo(): Promise<SanityContactInfo | null> {
	return sanityFetch(contactInfoQuery, {}, ['contactInfo'])
}

// ─── About Section (singleton) ───────────────────────────
export interface SanityAboutSection {
	yearsExperience?: string
	description?: string
	clientsCount?: string
	projectsCount?: string
	certifications?: string[]
	features?: { icon?: string; title: string; description: string }[]
}

const aboutSectionQuery = groq`
	*[_type == "aboutSection"][0] {
		yearsExperience, description, clientsCount, projectsCount,
		certifications, features[]{ icon, title, description }
	}
`

export async function getAboutSection(): Promise<SanityAboutSection | null> {
	return sanityFetch(aboutSectionQuery, {}, ['aboutSection'])
}

// ─── Map Cities ──────────────────────────────────────────
export interface SanityMapCity {
	_id: string
	name: string
	slug?: { current: string }
	lat: number
	lng: number
	distanceKm?: number
	metaTitle?: string
	metaDescription?: string
	pageHeading?: string
	pageDescription?: string
}

const mapCitiesQuery = groq`
	*[_type == "mapCity"] {
		_id, name, slug, lat, lng, distanceKm,
		metaTitle, metaDescription, pageHeading, pageDescription
	}
`

export async function getMapCities(): Promise<SanityMapCity[]> {
	return sanityFetch(mapCitiesQuery, {}, ['mapCity'])
}

// ─── Single City by slug ─────────────────────────────────
const cityBySlugQuery = groq`
	*[_type == "mapCity" && slug.current == $slug][0] {
		_id, name, slug, lat, lng, distanceKm,
		metaTitle, metaDescription, pageHeading, pageDescription
	}
`

export async function getCityBySlug(slug: string): Promise<SanityMapCity | null> {
	return sanityFetch(cityBySlugQuery, { slug }, ['mapCity'])
}

// ─── All city slugs (for static generation) ─────────────
const citySlugsQuery = groq`
	*[_type == "mapCity" && defined(slug.current)].slug.current
`

export async function getAllCitySlugs(): Promise<string[]> {
	return sanityFetch(citySlugsQuery, {}, ['mapCity'])
}

// ─── SEO Settings (singleton) ────────────────────────────
export interface SanitySeoSettings {
	// Basic
	siteTitle?: string
	siteDescription?: string
	keywords?: string[]
	canonicalUrl?: string
	// Open Graph
	ogTitle?: string
	ogDescription?: string
	ogImage?: { asset: { _ref: string }; alt?: string }
	ogType?: string
	// Twitter
	twitterCard?: string
	twitterTitle?: string
	twitterDescription?: string
	twitterImage?: { asset: { _ref: string }; alt?: string }
	// JSON-LD / Schema.org
	businessName?: string
	businessType?: string
	businessPhone?: string
	businessEmail?: string
	businessUrl?: string
	addressStreet?: string
	addressCity?: string
	addressPostalCode?: string
	addressCountry?: string
	geoLatitude?: number
	geoLongitude?: number
	serviceRadius?: number
	priceRange?: string
	logo?: { asset: { _ref: string } }
	openingHours?: { days?: string[]; opens?: string; closes?: string }[]
	socialProfiles?: string[]
	servicesList?: string[]
	// Robots
	robotsIndex?: boolean
	robotsFollow?: boolean
	robotsNoarchive?: boolean
	googleSiteVerification?: string
	bingSiteVerification?: string
	// Local SEO
	googleBusinessUrl?: string
	googleBusinessReviewsUrl?: string
	serviceAreas?: { name: string; description?: string }[]
	// Analytics
	googleAnalyticsId?: string
	googleTagManagerId?: string
	facebookPixelId?: string
}

const seoSettingsQuery = groq`
	*[_type == "seoSettings"][0] {
		siteTitle, siteDescription, keywords, canonicalUrl,
		ogTitle, ogDescription, ogImage, ogType,
		twitterCard, twitterTitle, twitterDescription, twitterImage,
		businessName, businessType, businessPhone, businessEmail, businessUrl,
		addressStreet, addressCity, addressPostalCode, addressCountry,
		geoLatitude, geoLongitude, serviceRadius, priceRange,
		logo, openingHours, socialProfiles, servicesList,
		robotsIndex, robotsFollow, robotsNoarchive,
		googleSiteVerification, bingSiteVerification,
		googleBusinessUrl, googleBusinessReviewsUrl,
		serviceAreas[]{ name, description },
		googleAnalyticsId, googleTagManagerId, facebookPixelId
	}
`

export async function getSeoSettings(): Promise<SanitySeoSettings | null> {
	return sanityFetch(seoSettingsQuery, {}, ['seoSettings'])
}

// ─── FAQ Items ───────────────────────────────────────────
export interface SanityFaqItem {
	_id: string
	question: string
	answer: string
	order: number
}

const faqItemsQuery = groq`
	*[_type == "faqItem"] | order(order asc) {
		_id, question, answer, order
	}
`

export async function getFaqItems(): Promise<SanityFaqItem[]> {
	return sanityFetch(faqItemsQuery, {}, ['faqItem'])
}

// ─── Legal Pages ─────────────────────────────────────────
export interface SanityLegalPage {
	_id: string
	title: string
	slug: { current: string }
	metaTitle?: string
	metaDescription?: string
	lastUpdated?: string
	content?: any[]
}

const legalPageBySlugQuery = groq`
	*[_type == "legalPage" && slug.current == $slug][0] {
		_id, title, slug, metaTitle, metaDescription, lastUpdated, content
	}
`

export async function getLegalPageBySlug(slug: string): Promise<SanityLegalPage | null> {
	return sanityFetch(legalPageBySlugQuery, { slug }, ['legalPage'])
}

// ─── Hero Section (singleton) ────────────────────────────
export interface SanityHeroSection {
	badgeText?: string
	headingLine1?: string
	headingLine2?: string
	description?: string
	ctaText?: string
	ctaLink?: string
	phoneNumber?: string
	stats?: { value: string; label: string }[]
}

const heroSectionQuery = groq`
	*[_type == "heroSection"][0] {
		badgeText, headingLine1, headingLine2, description,
		ctaText, ctaLink, phoneNumber,
		stats[]{ value, label }
	}
`

export async function getHeroSection(): Promise<SanityHeroSection | null> {
	return sanityFetch(heroSectionQuery, {}, ['heroSection'])
}

// ─── Site Settings (singleton) ───────────────────────────
export interface SanitySiteSettings {
	showHero?: boolean
	showServices?: boolean
	showAbout?: boolean
	showProjects?: boolean
	showContact?: boolean
	showMap?: boolean
	showReviews?: boolean
	showFaq?: boolean
	navItems?: { label: string; href: string }[]
}

const siteSettingsQuery = groq`
	*[_type == "siteSettings"][0] {
		showHero, showServices, showAbout, showProjects,
		showContact, showMap, showReviews, showFaq,
		navItems[]{ label, href }
	}
`

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
	return sanityFetch(siteSettingsQuery, {}, ['siteSettings'])
}

// ─── Blog Posts ──────────────────────────────────────────
export interface SanityBlogPost {
	_id: string
	title: string
	slug: { current: string }
	excerpt: string
	coverImage?: {
		asset: { _ref: string }
		alt?: string
		hotspot?: { x: number; y: number }
	}
	content?: any[]
	publishedAt: string
	category: string
	metaTitle?: string
	metaDescription?: string
}

const blogPostsQuery = groq`
	*[_type == "blogPost"] | order(publishedAt desc) {
		_id, title, slug, excerpt, coverImage, publishedAt, category
	}
`

export async function getBlogPosts(): Promise<SanityBlogPost[]> {
	return sanityFetch(blogPostsQuery, {}, ['blogPost'])
}

const blogPostBySlugQuery = groq`
	*[_type == "blogPost" && slug.current == $slug][0] {
		_id, title, slug, excerpt, coverImage, content, publishedAt, category,
		metaTitle, metaDescription
	}
`

export async function getBlogPostBySlug(slug: string): Promise<SanityBlogPost | null> {
	return sanityFetch(blogPostBySlugQuery, { slug }, ['blogPost'])
}

const relatedBlogPostsQuery = groq`
	*[_type == "blogPost" && slug.current != $slug] | order(publishedAt desc)[0...3] {
		_id, title, slug, excerpt, coverImage, publishedAt, category
	}
`

export async function getRelatedBlogPosts(slug: string, category: string): Promise<SanityBlogPost[]> {
	return sanityFetch(relatedBlogPostsQuery, { slug, category }, ['blogPost'])
}

const blogSlugsQuery = groq`
	*[_type == "blogPost" && defined(slug.current)].slug.current
`

export async function getAllBlogSlugs(): Promise<string[]> {
	return sanityFetch(blogSlugsQuery, {}, ['blogPost'])
}

// ─── Service Pages ───────────────────────────────────────
export interface SanityServicePage {
	_id: string
	title: string
	slug: { current: string }
	metaTitle?: string
	metaDescription?: string
	heroImage?: {
		asset: { _ref: string }
		alt?: string
		hotspot?: { x: number; y: number }
	}
	heroBadge?: string
	intro: string
	heroCtaSecondary?: string
	benefitsLabel?: string
	benefitsHeading?: string
	benefits?: { title: string; description: string }[]
	howWeWorkLabel?: string
	howWeWorkHeading?: string
	howWeWorkDescription?: string
	howWeWork?: { title: string; description: string }[]
	galleryHeading?: string
	galleryImages?: {
		asset: { _ref: string }
		alt?: string
		caption?: string
		hotspot?: { x: number; y: number }
	}[]
	scopeLabel?: string
	scopeHeading?: string
	scopeItems?: string[]
	ctaHeading?: string
	ctaDescription?: string
	faqHeading?: string
	faqDescription?: string
	faq?: { question: string; answer: string }[]
	keywords?: string[]
	order: number
}

const servicePageBySlugQuery = groq`
	*[_type == "servicePage" && slug.current == $slug][0] {
		_id, title, slug, metaTitle, metaDescription,
		heroImage, heroBadge, intro, heroCtaSecondary,
		benefitsLabel, benefitsHeading, benefits[]{ title, description },
		howWeWorkLabel, howWeWorkHeading, howWeWorkDescription,
		howWeWork[]{ title, description },
		galleryHeading, galleryImages[]{ asset, alt, caption, hotspot },
		scopeLabel, scopeHeading, scopeItems,
		ctaHeading, ctaDescription,
		faqHeading, faqDescription, faq[]{ question, answer },
		keywords, order
	}
`

export async function getServicePageBySlug(slug: string): Promise<SanityServicePage | null> {
	return sanityFetch(servicePageBySlugQuery, { slug }, ['servicePage'])
}

const servicePageSlugsQuery = groq`
	*[_type == "servicePage" && defined(slug.current)].slug.current
`

export async function getAllServicePageSlugs(): Promise<string[]> {
	return sanityFetch(servicePageSlugsQuery, {}, ['servicePage'])
}

const allServicePagesQuery = groq`
	*[_type == "servicePage"] | order(order asc) {
		_id, title, slug, metaTitle, metaDescription, order
	}
`

export async function getAllServicePages(): Promise<SanityServicePage[]> {
	return sanityFetch(allServicePagesQuery, {}, ['servicePage'])
}
