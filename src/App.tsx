import { Route, Routes } from 'react-router-dom'
import { GoogleAnalytics } from './components/GoogleAnalytics'
import Layout from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Services from './pages/Services'

export default function App() {
  return (
    <>
      <GoogleAnalytics />
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/diensten" element={<Services />} />
          <Route path="/over-ons" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  )
}
