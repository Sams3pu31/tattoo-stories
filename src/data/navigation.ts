export type NavigationItem = {
  id: string
  labelKey:
    | 'intro'
    | 'foundation'
    | 'fitting'
    | 'session'
    | 'reviews'
  href: `#${string}`
}

export const navigation: NavigationItem[] = [
  {
    id: 'intro',
    labelKey: 'intro',
    href: '#intro',
  },
  {
    id: 'foundation',
    labelKey: 'foundation',
    href: '#foundation',
  },
  {
    id: 'fitting',
    labelKey: 'fitting',
    href: '#fitting',
  },
  {
    id: 'session',
    labelKey: 'session',
    href: '#session',
  },
  {
    id: 'reviews',
    labelKey: 'reviews',
    href: '#reviews',
  },
]