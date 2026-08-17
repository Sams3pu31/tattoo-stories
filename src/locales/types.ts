export type Language = 'ru' | 'en'

export type Translation = {
  common: {
  theme: string
  themeLight: string
  themeSystem: string
  themeDark: string

  language: string
  booking: string

  openMenu: string
  closeMenu: string
}

  hero: {
    title: string
    subtitle: string
    aboutPeople: string
    forPeople: string
  }

  navigation: {
    intro: string
    foundation: string
    fitting: string
    session: string
    reviews: string
  }
}