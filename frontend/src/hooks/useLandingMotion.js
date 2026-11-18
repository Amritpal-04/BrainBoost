import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLandingMotion(root) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();

    media.add({
      animate: "(prefers-reduced-motion: no-preference)",
      wide: "(min-width: 800px)",
    }, ({ conditions }) => {
      if (!conditions.animate) return;

      const sections = root.current.querySelectorAll(".bb-section");

      sections.forEach((section, index) => {
        const elements = section.querySelectorAll("[data-reveal]");
        const hero = index === 0;
        const line = section.querySelector("[data-draw]");
        const bars = section.querySelectorAll("[data-bar]");
        const distance = conditions.wide ? 56 : 28;
        const direction = index % 2 === 0 ? -1 : 1;
        const reveal = {
          opacity: 0,
          x: hero ? 0 : distance * direction,
          y: hero ? 24 : 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "opacity,transform",
        };

        if (hero || conditions.wide) {
          const sequence = gsap.timeline({
            scrollTrigger: hero ? undefined : {
              trigger: elements[0],
              start: "top 82%",
              once: true,
            },
          });
          if (line) {
            sequence.from(Array.from(elements).slice(0, 2), { ...reveal, stagger: 0.13 });
            sequence.from(line, { scaleX: 0, duration: 0.65 }, "-=0.25");
            sequence.from(Array.from(elements).slice(2), { ...reveal, stagger: 0.15 }, "-=0.25");
          } else {
            sequence.from(elements, { ...reveal, stagger: 0.12 });
          }
          if (bars.length) {
            sequence.from(bars, { scaleY: 0, duration: 0.6, stagger: 0.07, ease: "power2.out" }, "-=0.4");
          }
        } else {
          elements.forEach((element) => {
            gsap.from(element, {
              ...reveal,
              scrollTrigger: { trigger: element, start: "top 86%", once: true },
            });
          });
          if (bars.length) {
            gsap.from(bars, {
              scaleY: 0, duration: 0.6, stagger: 0.07, ease: "power2.out",
              scrollTrigger: { trigger: bars[0].closest(".bb-chart"), start: "top 88%", once: true },
            });
          }
        }

        if (conditions.wide) {
          section.querySelectorAll("[data-parallax]").forEach((element) => {
            gsap.to(element, {
              y: -Number(element.dataset.parallax),
              ease: "none",
              scrollTrigger: { trigger: section, start: hero ? "top top" : "top bottom", end: "bottom top", scrub: true },
            });
          });
        }
      });
    }, root);

    return () => media.revert();
  }, [root]);
}
