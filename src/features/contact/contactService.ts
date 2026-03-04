import { CONTACT_CONFIG } from './contactConfig'

export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'failure'

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface SubmissionResult {
  status: 'success' | 'failure'
  message: string
}

/**
 * Submit contact form data to the configured third-party static form endpoint.
 * Handles the full lifecycle: submitting → success/failure.
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<SubmissionResult> {
  try {
    const response = await fetch(CONTACT_CONFIG.endpoint, {
      method: CONTACT_CONFIG.method,
      headers: CONTACT_CONFIG.headers,
      body: JSON.stringify(data),
    })

    if (response.ok) {
      return {
        status: 'success',
        message: 'Your message has been sent successfully. Thank you!',
      }
    }

    // Try to extract error message from response
    try {
      const body = await response.json()
      return {
        status: 'failure',
        message:
          body?.error ??
          body?.message ??
          `Submission failed (status ${response.status}). Please try again.`,
      }
    } catch {
      return {
        status: 'failure',
        message: `Submission failed (status ${response.status}). Please try again.`,
      }
    }
  } catch {
    return {
      status: 'failure',
      message:
        'Unable to reach the server. Please check your connection and try again.',
    }
  }
}
