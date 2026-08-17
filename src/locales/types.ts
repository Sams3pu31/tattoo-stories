export type Language = 'ru' | 'en'

export type Translation = {
  common: {
    theme: string
    themeLight: string
    themeDark: string
    language: string
    booking: string
    openMenu: string
    closeMenu: string
    mainNavigation: string
    mobileNavigation: string
  }

  hero: {
    title: string
    subtitle: string
    aboutPeople: string
    forPeople: string
  }

  intro: {
    eyebrow: string
    title: string
    lead: string
    text: string
    note: string
  }

  stories: {
    title: string
    categories: {
      important: string
      favorite: string
      unnamed: string
    }
    captions: {
      books: string
      cartoons: string
      era: string
    }
    previous: string
    next: string
  }

  foundation: {
    title: string
    lead: string
    paragraphs: string[]
  }

  sketch: {
    eyebrow: string
    title: string
    lead: string
    text: string
  }

  consultation: {
    eyebrow: string
    title: string
    lead: string
    prompt: string
    final: string
  }

  fitting: {
    eyebrow: string
    title: string
    lead: string
    text: string
    final: string
  }

  session: {
    eyebrow: string
    title: string
    lead: string
    text: string
    final: string
  }

  reviews: {
    eyebrow: string
    title: string
    lead: string
    text: string
    final: string
  }

  finalCta: {
    title: string
    action: string
  }

  booking: {
    eyebrow: string
    title: string
    lead: string
    previousMonth: string
    nextMonth: string
    selectedDate: string
    chooseDate: string
    time: string
    timePlaceholder: string
    name: string
    namePlaceholder: string
    contact: string
    contactPlaceholder: string
    message: string
    messagePlaceholder: string
    submit: string
  }

  navigation: {
    intro: string
    foundation: string
    fitting: string
    session: string
    reviews: string
  }
}