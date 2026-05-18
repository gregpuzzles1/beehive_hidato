import { TopNav } from '../components/navigation/TopNav'
import '../components/navigation/TopNav.css'
import './ContactPage.css'

export function ContactPage() {
  return (
    <div className="contact-page">
      <TopNav context="contact" />
      <header className="contact-page__header">
        <h1>Contact</h1>
        <p>Have a question, suggestion, or found a bug? Get in touch!</p>
      </header>
      <div className="contact-page__form-container">
        <div className="contact-page__form" aria-label="Contact options">
          <a className="contact-page__submit" href="mailto:gregpuzzles1@gmail.com">
            Send Message
          </a>
        </div>
      </div>
    </div>
  )
}
