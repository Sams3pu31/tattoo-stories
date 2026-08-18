import Footer from '../components/layout/Footer/Footer'
import Header from '../components/layout/Header/Header'
import FloatingBookingButton from '../components/ui/FloatingBookingButton/FloatingBookingButton'
import Booking from '../sections/Booking/Booking'
import FinalCTA from '../sections/FinalCTA/FinalCTA'
import Fitting from '../sections/Fitting/Fitting'
import Foundation from '../sections/Foundation/Foundation'
import Hero from '../sections/Hero/Hero'
import Intro from '../sections/Intro/Intro'
import Reviews from '../sections/Reviews/Reviews'
import Session from '../sections/Session/Session'
import Stories from '../sections/Stories/Stories'
import Works from '../sections/Works/Works'

function App() {
  return (
    <>
      <Header />
      <FloatingBookingButton />

      <main>
        <Hero />
        <Intro />
        <Foundation />
        <Stories />
        <Fitting />
        <Session />
        <Works />
        <Reviews />
        <FinalCTA />
        <Booking />
      </main>

      <Footer />
    </>
  )
}

export default App