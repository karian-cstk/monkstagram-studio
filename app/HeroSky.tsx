"use client";

import { useEffect, useRef } from "react";

type Cloud = { x: number; y: number; size: string };

const CLOUDS: Cloud[] = [
  { x: 28, y: 34, size: "clamp(160px,36vh,380px)" },
  { x: 74, y: 64, size: "clamp(170px,40vh,420px)" },
  { x: 82, y: 18, size: "clamp(100px,22vh,220px)" },
  { x: 16, y: 76, size: "clamp(110px,26vh,260px)" },
];

export default function HeroSky() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const glow = glowRef.current;
    if (!wrap || !glow) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let rect = wrap.getBoundingClientRect();
    let targetX = rect.width / 2;
    let targetY = rect.height / 2;
    let curX = targetX;
    let curY = targetY;
    let prevX = curX;
    let prevY = curY;
    let angle = 0;
    let energy = 0;
    const cloudOpacity = CLOUDS.map(() => 0);

    const handleResize = () => {
      rect = wrap.getBoundingClientRect();
    };
    const handleMove = (e: PointerEvent) => {
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    const tick = () => {
      const dx = targetX - curX;
      const dy = targetY - curY;
      curX += dx * 0.12;
      curY += dy * 0.12;

      const mvx = curX - prevX;
      const mvy = curY - prevY;
      const speed = Math.min(Math.hypot(mvx, mvy), 45);
      if (speed > 0.4) {
        angle = (Math.atan2(mvy, mvx) * 180) / Math.PI + 90;
      }
      energy = Math.max(energy * 0.92, speed / 45);
      prevX = curX;
      prevY = curY;

      const length = 160 + energy * 200;
      glow.style.transform = `translate(calc(${curX}px - 50%), calc(${curY}px - 50%)) rotate(${angle}deg)`;
      glow.style.height = `${length}px`;
      glow.style.opacity = String(Math.min(energy * 1.1, 0.6));

      CLOUDS.forEach((c, i) => {
        const el = cloudRefs.current[i];
        if (!el) return;
        const cx = (c.x / 100) * rect.width;
        const cy = (c.y / 100) * rect.height;
        const influence = Math.max(rect.width, rect.height) * 0.22;
        const dist = Math.hypot(curX - cx, curY - cy);
        const proximity = Math.max(0, 1 - dist / influence);
        const target = proximity * energy * 0.55;
        cloudOpacity[i] += (target - cloudOpacity[i]) * 0.1;
        el.style.opacity = String(cloudOpacity[i]);
      });

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("resize", handleResize);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="hero-sky" aria-hidden>
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          ref={(el) => {
            cloudRefs.current[i] = el;
          }}
          className="hero-cloud"
          style={{ left: `${c.x}%`, top: `${c.y}%`, width: c.size, height: c.size }}
        />
      ))}
      <div ref={glowRef} className="hero-sky-glow" />
    </div>
  );
}
