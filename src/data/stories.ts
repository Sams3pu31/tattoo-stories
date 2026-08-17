import work01 from '../assets/images/portfolio/work-01.jpg'
import work02 from '../assets/images/portfolio/work-02.jpg'
import work03 from '../assets/images/portfolio/work-03.jpg'

export type Story = {
  id: string
  number: string
  image: string
  categoryKey: 'important' | 'favorite' | 'unnamed'
  captionKey: 'books' | 'cartoons' | 'era'
}

export const stories: Story[] = [
  {
    id: 'story-01',
    number: '01',
    image: work01,
    categoryKey: 'favorite',
    captionKey: 'books',
  },
  {
    id: 'story-02',
    number: '02',
    image: work02,
    categoryKey: 'important',
    captionKey: 'cartoons',
  },
  {
    id: 'story-03',
    number: '03',
    image: work03,
    categoryKey: 'unnamed',
    captionKey: 'era',
  },
]