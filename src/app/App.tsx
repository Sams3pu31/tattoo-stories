import Header from '../components/layout/Header/Header'

import Hero from '../sections/Hero/Hero'
import Intro from '../sections/Intro/Intro'
import Foundation from '../sections/Foundation/Foundation'
import Stories from '../sections/Stories/Stories'



function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Intro />
        <Stories />
        <Foundation />
      </main>
    </>
  )
}


export default App