import { TopNav } from '../components/navigation/TopNav'
import '../components/navigation/TopNav.css'
import './HowToPlayPage.css'

export function HowToPlayPage() {
  return (
    <div className="how-to-play-page">
      <TopNav context="how-to-play" />
      <header className="how-to-play-page__header">
        <h1>How to Play</h1>
      </header>

      <section className="how-to-play-page__section" aria-labelledby="tutorial-heading">
        <h2 id="tutorial-heading">What is Beehive Hidato?</h2>
        <p>
          Beehive Hidato is a hexagonal number puzzle where you fill in a
          continuous chain of numbers on a honeycomb grid. Each number must be
          adjacent to the next number in the sequence — horizontally or
          diagonally on the hex grid.
        </p>
        <p>
          Some numbers are already placed as anchors (shown in honey/yellow).
          The start and end numbers are highlighted in blue-green. Your job is
          to fill in the remaining numbers to complete the chain.
        </p>
      </section>

      <section className="how-to-play-page__section" aria-labelledby="tips-heading">
        <h2 id="tips-heading">Tips</h2>
        <ul className="how-to-play-page__tips">
          <li>Each puzzle has one solution.</li>
          <li>Pure logic solves puzzles without guesswork.</li>
          <li>Starting elsewhere can be better than starting at first number.</li>
          <li>Working backwards can reveal clues.</li>
        </ul>
      </section>

      <section className="how-to-play-page__section" aria-labelledby="controls-heading">
        <h2 id="controls-heading">Using the Interface</h2>
        <dl className="how-to-play-page__controls-list">
          <dt>Number Selector</dt>
          <dd>
            Use the left/right arrows below the grid to pick which number to
            place. The selector only shows numbers you haven't placed yet.
          </dd>
          <dt>Placing Numbers</dt>
          <dd>
            Tap or click an empty cell to place the currently selected number.
            Tap a filled cell to remove it. You can also type numbers with your
            keyboard.
          </dd>
          <dt>Check</dt>
          <dd>
            Verify your placements — incorrect numbers are highlighted in red.
            If everything is correct, you'll see a success message.
          </dd>
          <dt>Reset</dt>
          <dd>Clear all your entries and start over with the same puzzle.</dd>
          <dt>Solution</dt>
          <dd>Reveal the complete solution for the current puzzle.</dd>
          <dt>Next Puzzle</dt>
          <dd>Generate a brand new puzzle at the same difficulty level.</dd>
          <dt>Timer</dt>
          <dd>
            The timer starts when you enter a puzzle page. You can hide the
            timer display or pause the game. While paused, all numbers are
            hidden.
          </dd>
          <dt>Choose Your Challenge</dt>
          <dd>Return to the Home page to pick a different difficulty level.</dd>
        </dl>
      </section>
    </div>
  )
}
