import { useEffect } from "react";

const properties = {
  glow: ["--pointer-x", "--pointer-y", "--pointer-opacity"],
  magnet: ["--magnet-x", "--magnet-y", "--magnet-scale"],
  brain: ["--brain-x", "--brain-y"],
};

const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));

export function useCursorInteractions(root) {
  useEffect(() => {
    const page = root.current;
    const media = window.matchMedia(
      "(min-width: 600px) and (any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let dispose = () => {};

    function enable() {
      dispose();
      if (!media.matches) return;

      const entries = [
        ...Array.from(page.querySelectorAll(".bb-section, .bb-mode"), (element) => ({
          element, type: "glow",
        })),
        ...Array.from(page.querySelectorAll(".bb-button, .bb-text-link"), (element) => ({
          element, type: "magnet",
        })),
        { element: page.querySelector(".bb-art-field"), type: "brain" },
      ].map((entry) => ({
        ...entry,
        x: 0, y: 0, opacity: 0,
        targetX: 0, targetY: 0, targetOpacity: 0,
        initialized: false,
      }));

      let pointer = null;
      let pointerTarget = null;
      let dirty = false;
      let frame = 0;
      let previousTime = 0;
      page.classList.add("bb-cursor-enabled");

      function measure() {
        const strength = window.innerWidth < 1024 ? 0.5 : 1;
        // Read bounds together before writing styles. Scroll and resize refresh them too.
        const bounds = entries.map(({ element, type, x, y }) => {
          const rect = element.getBoundingClientRect();
          return {
            left: rect.left - (type === "magnet" ? x : 0),
            top: rect.top - (type === "magnet" ? y : 0),
            width: rect.width, height: rect.height,
          };
        });

        entries.forEach((entry, index) => {
          const { left, top, width, height } = bounds[index];
          const margin = entry.type === "magnet" ? 16 : 0;
          const inside = pointer
            && pointer.x >= left - margin && pointer.x <= left + width + margin
            && pointer.y >= top - margin && pointer.y <= top + height + margin
            && (entry.type === "magnet" || entry.element.contains(pointerTarget));

          entry.targetOpacity = inside ? strength : 0;
          if (entry.type === "glow") {
            if (inside) {
              entry.targetX = pointer.x - left;
              entry.targetY = pointer.y - top;
              if (!entry.initialized) {
                entry.x = entry.targetX;
                entry.y = entry.targetY;
                entry.initialized = true;
              }
            }
          } else {
            const relativeX = inside ? (pointer.x - left - width / 2) / (width / 2) : 0;
            const relativeY = inside ? (pointer.y - top - height / 2) / (height / 2) : 0;
            const limit = entry.type === "brain" ? 7 : 8;
            entry.targetX = clamp(relativeX * limit, limit) * strength;
            entry.targetY = clamp(relativeY * limit, limit) * strength;
          }
        });
        dirty = false;
      }

      function animate(time) {
        const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16.7;
        previousTime = time;
        const easing = 1 - Math.exp(-elapsed / 85);
        if (dirty) measure();
        let moving = false;

        entries.forEach((entry) => {
          for (const [current, target] of [
            ["x", "targetX"], ["y", "targetY"], ["opacity", "targetOpacity"],
          ]) {
            const difference = entry[target] - entry[current];
            const threshold = current === "opacity" ? 0.002 : 0.02;
            entry[current] = Math.abs(difference) < threshold
              ? entry[target] : entry[current] + difference * easing;
            moving ||= entry[current] !== entry[target];
          }

          const style = entry.element.style;
          if (entry.type === "glow") {
            style.setProperty("--pointer-x", `${entry.x.toFixed(2)}px`);
            style.setProperty("--pointer-y", `${entry.y.toFixed(2)}px`);
            style.setProperty("--pointer-opacity", entry.opacity.toFixed(3));
          } else if (entry.type === "magnet") {
            style.setProperty("--magnet-x", `${entry.x.toFixed(2)}px`);
            style.setProperty("--magnet-y", `${entry.y.toFixed(2)}px`);
            style.setProperty("--magnet-scale", (1 + entry.opacity * 0.018).toFixed(4));
          } else {
            style.setProperty("--brain-x", `${(-entry.y).toFixed(2)}deg`);
            style.setProperty("--brain-y", `${entry.x.toFixed(2)}deg`);
          }
        });

        frame = moving ? requestAnimationFrame(animate) : 0;
        if (!frame) previousTime = 0;
      }

      function schedule() {
        dirty = true;
        if (!frame) frame = requestAnimationFrame(animate);
      }

      function move(event) {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
          reset();
          return;
        }
        pointer = { x: event.clientX, y: event.clientY };
        pointerTarget = event.target;
        schedule();
      }

      function reset() {
        pointer = null;
        pointerTarget = null;
        schedule();
      }

      function refresh() {
        if (pointer) {
          pointerTarget = document.elementFromPoint(pointer.x, pointer.y);
        }
        schedule();
      }

      function keyboard(event) {
        if (event.key === "Tab") reset();
      }

      page.addEventListener("pointermove", move, { passive: true });
      page.addEventListener("pointerleave", reset);
      page.addEventListener("pointercancel", reset);
      window.addEventListener("scroll", refresh, { passive: true });
      window.addEventListener("resize", refresh, { passive: true });
      window.addEventListener("blur", reset);
      document.addEventListener("keydown", keyboard);
      document.addEventListener("visibilitychange", reset);

      dispose = () => {
        cancelAnimationFrame(frame);
        page.classList.remove("bb-cursor-enabled");
        page.removeEventListener("pointermove", move);
        page.removeEventListener("pointerleave", reset);
        page.removeEventListener("pointercancel", reset);
        window.removeEventListener("scroll", refresh);
        window.removeEventListener("resize", refresh);
        window.removeEventListener("blur", reset);
        document.removeEventListener("keydown", keyboard);
        document.removeEventListener("visibilitychange", reset);
        entries.forEach(({ element, type }) => {
          properties[type].forEach((property) => element.style.removeProperty(property));
        });
      };
    }

    enable();
    media.addEventListener("change", enable);
    return () => {
      media.removeEventListener("change", enable);
      dispose();
    };
  }, [root]);
}
