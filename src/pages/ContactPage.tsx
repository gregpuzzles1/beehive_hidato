import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react'
import { TopNav } from '../components/navigation/TopNav'
import {
  submitContactForm,
  type ContactFormData,
  type SubmissionStatus,
} from '../features/contact/contactService'
import '../components/navigation/TopNav.css'
import './ContactPage.css'

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const INITIAL_FORM: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

function validateForm(data: ContactFormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim()) {
    errors.name = 'Name is required.'
  }
  if (!data.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!data.subject.trim()) {
    errors.subject = 'Subject is required.'
  }
  if (!data.message.trim()) {
    errors.message = 'Message is required.'
  }
  return errors
}

export function ContactPage() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setForm((prev) => ({ ...prev, [name]: value }))
      // Clear field error on edit
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      const validationErrors = validateForm(form)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setStatus('submitting')
      setStatusMessage('')

      const result = await submitContactForm(form)
      setStatus(result.status)
      setStatusMessage(result.message)

      if (result.status === 'success') {
        setForm(INITIAL_FORM)
        setErrors({})
      }
    },
    [form]
  )

  return (
    <div className="contact-page">
      <TopNav context="contact" />
      <header className="contact-page__header">
        <h1>Contact</h1>
        <p>Have a question, suggestion, or found a bug? Get in touch!</p>
      </header>
      <div className="contact-page__form-container">
        {status === 'success' ? (
          <div className="contact-page__status contact-page__status--success" role="status">
            <p>{statusMessage}</p>
            <button
              className="contact-page__btn"
              onClick={() => {
                setStatus('idle')
                setStatusMessage('')
              }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form
            className="contact-page__form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Contact form"
          >
            <div className="contact-page__field">
              <label htmlFor="contact-name" className="contact-page__label">
                Name <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                className={`contact-page__input ${errors.name ? 'contact-page__input--error' : ''}`}
                value={form.name}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                disabled={status === 'submitting'}
              />
              {errors.name && (
                <p id="contact-name-error" className="contact-page__error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="contact-page__field">
              <label htmlFor="contact-email" className="contact-page__label">
                Email Address <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                className={`contact-page__input ${errors.email ? 'contact-page__input--error' : ''}`}
                value={form.email}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                disabled={status === 'submitting'}
              />
              {errors.email && (
                <p id="contact-email-error" className="contact-page__error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="contact-page__field">
              <label htmlFor="contact-subject" className="contact-page__label">
                Subject <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                className={`contact-page__input ${errors.subject ? 'contact-page__input--error' : ''}`}
                value={form.subject}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                disabled={status === 'submitting'}
              />
              {errors.subject && (
                <p id="contact-subject-error" className="contact-page__error" role="alert">
                  {errors.subject}
                </p>
              )}
            </div>

            <div className="contact-page__field">
              <label htmlFor="contact-message" className="contact-page__label">
                Message <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                className={`contact-page__textarea ${errors.message ? 'contact-page__input--error' : ''}`}
                value={form.message}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                disabled={status === 'submitting'}
              />
              {errors.message && (
                <p id="contact-message-error" className="contact-page__error" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            {status === 'failure' && (
              <div className="contact-page__status contact-page__status--failure" role="alert">
                <p>{statusMessage}</p>
              </div>
            )}

            <button
              type="submit"
              className="contact-page__submit"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
