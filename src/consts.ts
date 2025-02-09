export type Site = {
  TITLE: string
  DESCRIPTION: string
  EMAIL: string
  NUM_POSTS_ON_HOMEPAGE: number
  POSTS_PER_PAGE: number
  SITEURL: string
}

export type Link = {
  href: string
  label: string
}

export const SITE: Site = {
  TITLE: 'Rishabh Lal',
  DESCRIPTION:
    'Welcome to my personal website',
  EMAIL: 'lalrishabh2106@gmail.com',
  NUM_POSTS_ON_HOMEPAGE: 2,
  POSTS_PER_PAGE: 3,
  SITEURL: 'rishblol.github.io',
}

export const NAV_LINKS: Link[] = [
  { href: '/blog', label: 'blog' },
  { href: '/about', label: 'about' }
  
]

export const SOCIAL_LINKS: Link[] = [
  { href: 'https://github.com/Rishblol', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/lal-rishabh/', label: 'LinkedIn' },
  { href: 'lalrishabh2106@gmail.com', label: 'Email' },
]
