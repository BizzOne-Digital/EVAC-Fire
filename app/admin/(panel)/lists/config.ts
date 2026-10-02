export const LISTS = {
  audiences: {
    title: 'Who we serve',
    singular: 'group',
    description: 'The audience groups on the home page.',
    sectionHref: '/admin/pages/home',
    itemsLabel: 'Examples (one per line)',
  },
  approach: {
    title: 'Our approach',
    singular: 'approach item',
    description: 'Shown on the home page and the About page.',
    sectionHref: '/admin/pages/about',
    itemsLabel: 'Paragraphs (one per line)',
  },
} as const

export type ListKind = keyof typeof LISTS
