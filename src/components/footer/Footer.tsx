import './Footer.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__content">
        <p className="site-footer__copyright">
          &copy; {currentYear} Greg Christian
        </p>
        <p className="site-footer__license">
          Licensed under the{' '}
          <a
            href="https://opensource.org/licenses/MIT"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT License
          </a>
        </p>
        <div className="site-footer__links">
          <a
            href="https://github.com/GREGP/beehive_hidato"
            target="_blank"
            rel="noopener noreferrer"
          >
            Repository
          </a>
          <span className="site-footer__separator" aria-hidden="true">|</span>
          <a
            href="https://github.com/GREGP/beehive_hidato/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Report an Issue
          </a>
        </div>
      </div>
      <div className="site-footer__spacing" aria-hidden="true" />
    </footer>
  )
}
