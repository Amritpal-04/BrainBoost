import { useRef } from "react";
import {
  BenefitsSection,
  FinalSection,
  HeroSection,
  LearningSection,
  PracticeSection,
  ProgressSection,
} from "../components/landing/Sections";
import { LandingFooter, LandingHeader } from "../components/landing/Navigation";
import { useLandingMotion } from "../hooks/useLandingMotion";
import { useCursorInteractions } from "../hooks/useCursorInteractions";
import "./LandingPage.css";
import "../components/landing/cursor-effects.css";

export default function LandingPage() {
  const root = useRef(null);
  useLandingMotion(root);
  useCursorInteractions(root);

  return (
    <div className="landing" ref={root}>
      <LandingHeader />
      <main id="landing-content">
        <HeroSection />
        <PracticeSection />
        <BenefitsSection />
        <LearningSection />
        <ProgressSection />
        <FinalSection />
      </main>
      <LandingFooter />
    </div>
  );
}
