import Header from '../components/layout/Header/Header'
import Foundation from '../sections/Foundation/Foundation'
import Hero from '../sections/Hero/Hero'
import Intro from '../sections/Intro/Intro'
import Sketch from '../sections/Sketch/Sketch'
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
        <Sketch />
      </main>
    </>
  )
}

export default App