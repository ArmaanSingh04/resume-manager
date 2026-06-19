"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar1 } from "./navbar-1";

interface MinimalHeroProps {
  hasSession?: boolean;
}

export default function MinimalHero({ hasSession = false }: MinimalHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    };
    setSize();

    type Particle = {
      x: number;
      y: number;
      speed: number;
      opacity: number;
      fadeDelay: number;
      fadeStart: number;
      fadingOut: boolean;
    };

    let particles: Particle[] = [];
    let raf = 0;

    const count = () => Math.floor((canvas.width * canvas.height) / 7000);

    const make = (): Particle => {
      const fadeDelay = Math.random() * 600 + 100;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() / 5 + 0.1,
        opacity: 0.7,
        fadeDelay,
        fadeStart: Date.now() + fadeDelay,
        fadingOut: false,
      };
    };

    const reset = (p: Particle) => {
      p.x = Math.random() * canvas.width;
      p.y = Math.random() * canvas.height;
      p.speed = Math.random() / 5 + 0.1;
      p.opacity = 0.7;
      p.fadeDelay = Math.random() * 600 + 100;
      p.fadeStart = Date.now() + p.fadeDelay;
      p.fadingOut = false;
    };

    const init = () => {
      particles = [];
      for (let i = 0; i < count(); i++) particles.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) reset(p);
        if (!p.fadingOut && Date.now() > p.fadeStart) p.fadingOut = true;
        if (p.fadingOut) {
          p.opacity -= 0.008;
          if (p.opacity <= 0) reset(p);
        }
        // Draw yellow particles: RGB for #f9f871 is (249, 248, 113)
        ctx.fillStyle = `rgba(249, 248, 113, ${p.opacity})`;
        ctx.fillRect(p.x, p.y, 0.6, Math.random() * 2 + 1);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      setSize();
      init();
    };

    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="minimal-root">
      <style>{`
@import url('https://fonts.cdnfonts.com/css/hubot-sans');

.minimal-root, .minimal-root * {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.minimal-root {
  position: relative;
  width: 100%;
  height: 95vh;
  overflow: hidden;

  --bg: #111010;
  --fg: #ffffff;
  --muted: #aaaaaf;
  --border: #292813;
  --accent: #f9f871;

  background: var(--bg);
  color: var(--fg);
  font-family: 'Hubot Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
}

/* header */
.header {
  position: absolute;
  top: 0; left: 0; right: 0;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  z-index: 10;
}
.brand {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  text-decoration: none;
}
.cta {
  display: inline-block;
  height: 36px;
  padding: 0 16px;
  border-radius: 9999px;
  background: var(--accent);
  color: #111010;
  font-weight: 600;
  font-size: 13px;
  line-height: 36px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}
.cta:hover {
  background: #fffc94;
  transform: scale(1.02);
}
.cta:active {
  transform: scale(0.98);
}

/* hero center */
.hero {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  pointer-events: none;
  z-index: 5;
}
.kicker {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 14px;
}
.title {
  font-weight: 600;
  font-size: clamp(32px, 8vw, 88px);
  line-height: 0.95;
  margin: 0;
  color: var(--fg);
  text-shadow: none;
}
.yellow-glow {
  color: var(--accent);
  text-shadow: 0 0 30px rgba(249, 248, 113, 0.35);
}
.subtitle {
  margin-top: 18px;
  font-size: clamp(14px, 2.2vw, 18px);
  color: var(--muted);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.hero-cta-wrapper {
  margin-top: 28px;
  pointer-events: auto;
}
.hero-cta {
  display: inline-block;
  padding: 12px 28px;
  border-radius: 12px;
  background: var(--accent);
  color: #111010;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 10px 25px -5px rgba(249, 248, 113, 0.25);
  border: none;
  cursor: pointer;
}
.hero-cta:hover {
  background: #fffc94;
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(249, 248, 113, 0.35);
}
.hero-cta:active {
  transform: translateY(0);
}

/* accent lines container */
.accent-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

/* base line visuals */
.hline, .vline {
  position: absolute;
  background: var(--border);
  opacity: .75;
  will-change: transform, opacity;
}

/* horizontal lines */
.hline {
  height: 1px; left: 0; right: 0;
  transform: scaleX(0);
  transform-origin: 50% 50%;
  animation: drawX 800ms cubic-bezier(.22,.61,.36,1) forwards;
}
.hline:nth-child(1){ top: 20%; animation-delay: 150ms; }
.hline:nth-child(2){ top: 50%; animation-delay: 280ms; }
.hline:nth-child(3){ top: 80%; animation-delay: 410ms; }

/* vertical lines */
.vline {
  width: 1px; top: 0; bottom: 0;
  transform: scaleY(0);
  transform-origin: 50% 0%;
  animation: drawY 900ms cubic-bezier(.22,.61,.36,1) forwards;
}
.vline:nth-child(4){ left: 20%; animation-delay: 520ms; }
.vline:nth-child(5){ left: 50%; animation-delay: 640ms; }
.vline:nth-child(6){ left: 80%; animation-delay: 760ms; }

/* subtle gradient shimmer while drawing */
.hline::after, .vline::after{
  content:"";
  position:absolute;
  inset:0;
  background: linear-gradient(90deg, transparent, rgba(249, 248, 113, 0.2), transparent);
  opacity:0;
  animation: shimmer 900ms ease-out forwards;
}
.hline:nth-child(1)::after{ animation-delay: 150ms; }
.hline:nth-child(2)::after{ animation-delay: 280ms; }
.hline:nth-child(3)::after{ animation-delay: 410ms; }
.vline:nth-child(4)::after{ animation-delay: 520ms; }
.vline:nth-child(5)::after{ animation-delay: 640ms; }
.vline:nth-child(6)::after{ animation-delay: 760ms; }

/* keyframes */
@keyframes drawX {
  0% { transform: scaleX(0); opacity: 0; }
  60% { opacity: .9; }
  100% { transform: scaleX(1); opacity: .75; }
}
@keyframes drawY {
  0% { transform: scaleY(0); opacity: 0; }
  60% { opacity: .9; }
  100% { transform: scaleY(1); opacity: .75; }
}
@keyframes shimmer {
  0% { opacity: .0; }
  30% { opacity: .25; }
  100% { opacity: 0; }
}

/* canvas */
.particleCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: .6;
  z-index: 2;
}

/* footer section (copy) */
.content {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  padding: 32px 24px;
  border-top: 1px solid var(--border);
  display: grid;
  place-items: center;
  text-align: center;
  gap: 6px;
  z-index: 10;
  background: rgba(17, 16, 16, 0.65);
  backdrop-filter: blur(8px);
}
.content .tag {
  font-size: 12px;
  color: var(--accent);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.content .heading {
  font-size: 22px;
  font-weight: 600;
  color: var(--fg);
}
.content .desc {
  font-size: 14px;
  color: var(--muted);
  max-width: 680px;
}
      `}</style>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar1 hasSession={hasSession} />
      </div>

      {/* Particles */}
      <canvas ref={canvasRef} className="particleCanvas" />

      {/* Accent Lines (animated on mount) */}
      <div className="accent-lines">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>

      {/* Hero */}
      <main className="hero">
        <div>
          <h1 className="title">
            <span className="yellow-glow">Share</span> your resume<br />on your <span className="yellow-glow">terms</span>.
          </h1>
          <p className="subtitle">
            Upload, organize, and manage all your resumes in one place. Create secure public or private links, update documents anytime, and share with confidence.
          </p>
          <div className="hero-cta-wrapper">
            {hasSession ? (
              <Link className="hero-cta" href="/dashboard">
                Go to your Dashboard
              </Link>
            ) : (
              <Link className="hero-cta" href="/register">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </main>
    </section>
  );
}
