import Header from '../components/layout/Header/Header'
import Booking from '../sections/Booking/Booking'
import Consultation from '../sections/Consultation/Consultation'
import FinalCTA from '../sections/FinalCTA/FinalCTA'
import Fitting from '../sections/Fitting/Fitting'
import Foundation from '../sections/Foundation/Foundation'
import Hero from '../sections/Hero/Hero'
import Intro from '../sections/Intro/Intro'
import Reviews from '../sections/Reviews/Reviews'
import Session from '../sections/Session/Session'
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
        <Consultation />
        <Fitting />
        <Session />
        <Reviews />
        <FinalCTA />
        <Booking />
      </main>
    </>
  )
}

export default App