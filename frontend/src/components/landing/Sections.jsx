import {
  ArrowDown, ArrowRight, ArrowUpRight, Brain, Calculator, ChartNoAxesColumnIncreasing,
  CircleCheck, Flame, Layers3, Lightbulb, ListChecks, Sparkles, Target, Trophy, Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import brainImage from "../../assets/landing-brain.webp";

const modes = [
  { id: "mathematics", name: "Mathematics", description: "Practise addition, subtraction, multiplication and division.", action: "Explore Mathematics", icon: Calculator },
  { id: "logical-thinking", name: "Logical Thinking", description: "Discover patterns, solve puzzles and strengthen your reasoning.", action: "Explore Logic", icon: Lightbulb },
  { id: "fast-calculation", name: "Fast Calculation", description: "Improve your calculation speed through quick mental maths challenges.", action: "Explore Speed", icon: Zap },
];

const benefits = [
  { title: "Interactive Learning", description: "Learn through short, engaging challenges.", icon: Layers3 },
  { title: "Track Your Progress", description: "See how your accuracy and scores change over time.", icon: ChartNoAxesColumnIncreasing },
  { title: "Challenge Yourself", description: "Build confidence and improve your speed at your own pace.", icon: Target },
];

const steps = [
  { title: "Choose Your Challenge", description: "Select Mathematics, Logical Thinking or Fast Calculation.", icon: ListChecks },
  { title: "Start Practising", description: "Work through questions at the difficulty you choose.", icon: Zap },
  { title: "Track Your Growth", description: "Review your results and see where to focus next.", icon: ChartNoAxesColumnIncreasing },
];

export function HeroSection() {
  return (
    <section id="top" className="bb-section bb-hero" aria-labelledby="bb-hero-title">
      <div className="bb-container bb-split">
        <div className="bb-hero-copy" data-parallax="18">
          <p className="bb-pill" data-reveal><Sparkles size={15} aria-hidden="true" /> Sharpen your mind</p>
          <h1 id="bb-hero-title" data-reveal>Sharpen Your Mind.<br /><span>Boost Your Skills.</span></h1>
          <p className="bb-lede" data-reveal>Practice mathematics, logical thinking and mental calculations — anytime, anywhere.</p>
          <div className="bb-actions" data-reveal>
            <Link className="bb-button bb-primary" to="/signup">Start Practicing <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <a className="bb-button bb-outline" href="#modes">Explore Modes <ArrowDown size={17} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="bb-hero-art" aria-hidden="true" data-parallax="-30">
          <div className="bb-art-field" data-reveal>
            <span className="bb-orbit bb-orbit-one" />
            <span className="bb-orbit bb-orbit-two" />
            <span className="bb-symbol bb-plus">+</span>
            <span className="bb-symbol bb-times">×</span>
            <span className="bb-symbol bb-divide">÷</span>
            <span className="bb-symbol bb-minus">−</span>
            <div className="bb-brain-tilt">
              <img className="bb-brain-image" src={brainImage} width="1254" height="1254" alt="" fetchPriority="high" />
            </div>
          </div>
        </div>
      </div>
      <a className="bb-scroll" href="#modes" aria-label="Scroll to practice modes"><ArrowDown size={19} aria-hidden="true" /></a>
    </section>
  );
}

export function PracticeSection() {
  const signedIn = Boolean(localStorage.getItem("token"));

  return (
    <section id="modes" className="bb-section bb-lavender" aria-labelledby="bb-modes-title">
      <div className="bb-container">
        <div className="bb-section-heading">
          <h2 id="bb-modes-title" data-reveal>Find Your Way to Get Smarter</h2>
          <p className="bb-lede" data-reveal>Choose your practice mode and challenge yourself at your own pace.</p>
        </div>
        <div className="bb-modes">
          {modes.map(({ id, name, description, action, icon: Icon }) => (
            <article className={`bb-mode bb-mode-${id}`} key={id} data-reveal>
              <span className="bb-mode-icon"><Icon size={27} aria-hidden="true" /></span>
              <h3>{name}</h3>
              <p>{description}</p>
              <Link to={signedIn ? `/home/practice/${id}` : "/signup"}>{action} <ArrowRight size={17} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection() {
  return (
    <section id="why-brainboost" className="bb-section" aria-labelledby="bb-benefits-title">
      <div className="bb-container bb-split">
        <div>
          <h2 id="bb-benefits-title" data-reveal>More Than Just Practice.</h2>
          <p className="bb-lede" data-reveal>BrainBoost makes improving your mental abilities simple, engaging and measurable.</p>
          <ul className="bb-benefits">
            {benefits.map(({ title, description, icon: Icon }) => (
              <li key={title} data-reveal>
                <span className="bb-small-icon"><Icon size={21} aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </li>
            ))}
          </ul>
          <a className="bb-text-link" href="#how-it-works" data-reveal>Discover More <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
        <div className="bb-benefit-art" aria-hidden="true" data-parallax="-23">
          <div className="bb-benefit-scene" data-reveal>
            <span className="bb-orbit bb-orbit-one" />
            <span className="bb-orbit bb-orbit-two" />
            <img src={brainImage} width="1254" height="1254" alt="" loading="lazy" />
            <span className="bb-art-tile"><ChartNoAxesColumnIncreasing size={29} /></span>
            <span className="bb-art-tile"><Trophy size={29} /></span>
            <span className="bb-art-tile"><Brain size={29} /></span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LearningSection() {
  return (
    <section id="how-it-works" className="bb-section bb-learning" aria-labelledby="bb-learning-title">
      <div className="bb-container">
        <div className="bb-section-heading">
          <h2 id="bb-learning-title" data-reveal>Your Journey to a Sharper Mind</h2>
          <p className="bb-lede" data-reveal>Three simple steps. A smarter you.</p>
        </div>
        <ol className="bb-steps">
          <li className="bb-step-line" aria-hidden="true" data-draw />
          {steps.map(({ title, description, icon: Icon }, index) => (
            <li className="bb-step" key={title} data-reveal>
              <span className="bb-step-number">{String(index + 1).padStart(2, "0")}</span>
              <Icon size={25} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const sampleActivity = [
  ["Mon", 2], ["Tue", 4], ["Wed", 3], ["Thu", 5], ["Fri", 4], ["Sat", 6], ["Sun", 5],
];

function ProgressPreview() {
  return (
    <figure className="bb-preview" data-reveal>
      <figcaption><strong>Weekly activity</strong><span>Sample dashboard</span></figcaption>
      <div className="bb-chart" role="img" aria-label="Illustrative rounds completed from Monday through Sunday: 2, 4, 3, 5, 4, 6 and 5.">
        {sampleActivity.map(([day, rounds]) => (
          <div key={day} aria-hidden="true">
            <span className="bb-chart-bar" style={{ "--height": `${rounds / 6 * 100}%` }} data-bar />
            <span>{day}</span>
          </div>
        ))}
      </div>
      <div className="bb-preview-metrics">
        <div><Flame size={21} aria-hidden="true" /><strong>7 days</strong><span>Practice streak</span></div>
        <div><CircleCheck size={21} aria-hidden="true" /><strong>86%</strong><span>Accuracy</span></div>
        <div><Trophy size={21} aria-hidden="true" /><strong>3 badges</strong><span>Achievements</span></div>
      </div>
    </figure>
  );
}

export function ProgressSection() {
  return (
    <section id="progress-preview" className="bb-section bb-lavender" aria-labelledby="bb-progress-title">
      <div className="bb-container bb-split">
        <div>
          <h2 id="bb-progress-title" data-reveal>Every Challenge Makes You Better.</h2>
          <p className="bb-lede" data-reveal>Small improvements today lead to stronger thinking tomorrow.</p>
          <p className="bb-preview-note" data-reveal>Preview an example of how practice activity, streaks and accuracy could look in BrainBoost.</p>
        </div>
        <div data-parallax="-20"><ProgressPreview /></div>
      </div>
    </section>
  );
}

export function FinalSection() {
  return (
    <section className="bb-section bb-final" aria-labelledby="bb-final-title">
      <span className="bb-final-ring" aria-hidden="true" data-parallax="-30" />
      <div className="bb-container">
        <div className="bb-final-icon" data-reveal><ArrowUpRight size={32} aria-hidden="true" /></div>
        <h2 id="bb-final-title" data-reveal>Ready to Level Up Your Brain?</h2>
        <p className="bb-lede" data-reveal>Start practising today and discover what your mind can achieve.</p>
        <div data-reveal><Link className="bb-button bb-white" to="/signup">Get Started <ArrowRight size={18} aria-hidden="true" /></Link></div>
        <p className="bb-final-note" data-reveal>No complicated setup. Just choose a challenge and begin.</p>
      </div>
    </section>
  );
}
