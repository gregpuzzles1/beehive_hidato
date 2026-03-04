/**
 * Contact form endpoint configuration.
 *
 * Uses Formspree as a third-party static form endpoint compatible with
 * GitHub Pages hosting. Replace the FORM_ID with your actual Formspree
 * form ID.
 */
export const CONTACT_CONFIG = {
  /** Formspree endpoint URL */
  endpoint: 'https://formspree.io/f/YOUR_FORM_ID',

  /** HTTP method */
  method: 'POST' as const,

  /** Required headers */
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
} as const
