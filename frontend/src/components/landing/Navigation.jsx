import { ArrowUpRight, Brain } from "lucide-react";
import { Link } from "react-router-dom";

function Brand() {
  return (
    <a className="bb-brand" href="#top">
      <span className="bb-brand-mark"><Brain size={21} aria-hidden="true" /></span>
      BrainBoost
    </a>
  );
}

export function LandingHeader() {
  return (
    <header className="bb-header">
      <div className="bb-container bb-header-inner">
        <Brand />
        <nav className="bb-header-links" aria-label="Main navigation">
          <a href="#modes">Practice modes</a>
          <a href="#how-it-works">How it works</a>
          <a href="#progress-preview">Progress</a>
        </nav>
        <div className="bb-auth">
          <Link className="bb-login" to="/login">Log in</Link>
          <Link className="bb-button bb-primary" to="/signup">Sign up <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </header>
  );
}

export function LandingFooter() {
  return (
    <footer className="bb-footer">
      <div className="bb-container">
        <div className="bb-footer-top">
          <div><Brand /><p>Think smarter. Learn faster.</p></div>
          <nav aria-label="Footer navigation">
            <a href="#top">Home</a>
            <a href="#modes">Practice</a>
            <a href="#why-brainboost">About</a>
          </nav>
          <a className="bb-external" href="https://github.com/Amritpal-04/BrainBoost">GitHub <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
        <p className="bb-copyright">© 2026 BrainBoost. All rights reserved.</p>
      </div>
    </footer>
  );
}
