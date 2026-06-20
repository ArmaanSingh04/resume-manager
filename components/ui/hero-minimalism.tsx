"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar1 } from "./navbar-1";
import { ArrowRight, ChevronDown } from "lucide-react";

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
  height: 100vh;
  overflow: hidden;

  --bg: #111010;
  --fg: #ffffff;
  --muted: #9696a5;
  --muted-light: #aaaaaf;
  --border: #292813;
  --border-subtle: #1e1d12;
  --accent: #f9f871;
  --accent-light: #fffc94;
  --accent-dim: rgba(249, 248, 113, 0.12);
  --accent-glow: rgba(249, 248, 113, 0.18);

  background: var(--bg);
  color: var(--fg);
  font-family: 'Hubot Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
}

/* Radial glow behind hero content */
.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  width: 700px;
  height: 700px;
  background: radial-gradient(ellipse at center, rgba(249,248,113,0.07) 0%, rgba(249,248,113,0.03) 40%, transparent 70%);
  pointer-events: none;
  z-index: 3;
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
  background: var(--border-subtle);
  opacity: .6;
  will-change: transform, opacity;
}

/* horizontal lines */
.hline {
  height: 1px; left: 0; right: 0;
  transform: scaleX(0);
  transform-origin: 50% 50%;
  animation: drawX 900ms cubic-bezier(.22,.61,.36,1) forwards;
}
.hline:nth-child(1){ top: 20%; animation-delay: 150ms; }
.hline:nth-child(2){ top: 50%; animation-delay: 280ms; }
.hline:nth-child(3){ top: 80%; animation-delay: 410ms; }

/* vertical lines */
.vline {
  width: 1px; top: 0; bottom: 0;
  transform: scaleY(0);
  transform-origin: 50% 0%;
  animation: drawY 1000ms cubic-bezier(.22,.61,.36,1) forwards;
}
.vline:nth-child(4){ left: 20%; animation-delay: 520ms; }
.vline:nth-child(5){ left: 50%; animation-delay: 640ms; }
.vline:nth-child(6){ left: 80%; animation-delay: 760ms; }

/* subtle gradient shimmer while drawing */
.hline::after, .vline::after{
  content:"";
  position:absolute;
  inset:0;
  background: linear-gradient(90deg, transparent, rgba(249, 248, 113, 0.15), transparent);
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
  60% { opacity: .7; }
  100% { transform: scaleX(1); opacity: .6; }
}
@keyframes drawY {
  0% { transform: scaleY(0); opacity: 0; }
  60% { opacity: .7; }
  100% { transform: scaleY(1); opacity: .6; }
}
@keyframes shimmer {
  0% { opacity: .0; }
  30% { opacity: .2; }
  100% { opacity: 0; }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(249,248,113,0); }
  50%       { box-shadow: 0 0 20px 4px rgba(249,248,113,0.12); }
}
@keyframes bounce-arrow {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(5px); }
}

/* canvas */
.particleCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: .5;
  z-index: 2;
}

/* hero center */
.hero {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  z-index: 5;
  padding: 0 24px;
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  animation: fadeUp 0.8s cubic-bezier(.22,.61,.36,1) both;
}

/* Eyebrow badge */
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 14px;
  border-radius: 9999px;
  border: 1px solid var(--border);
  background: rgba(249,248,113,0.06);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 24px;
  animation: fadeUp 0.8s 0.1s cubic-bezier(.22,.61,.36,1) both;
}
.eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
  animation: pulse-glow 2.5s ease-in-out infinite;
}

/* Main title */
.title {
  font-weight: 700;
  font-size: clamp(36px, 8vw, 92px);
  line-height: 0.95;
  margin: 0;
  color: var(--fg);
  letter-spacing: -0.02em;
  animation: fadeUp 0.8s 0.2s cubic-bezier(.22,.61,.36,1) both;
}
.yellow-glow {
  color: var(--accent);
  text-shadow: 0 0 40px rgba(249, 248, 113, 0.3);
}

/* Subtitle */
.subtitle {
  margin-top: 20px;
  font-size: clamp(15px, 2vw, 18px);
  color: var(--muted);
  max-width: 520px;
  line-height: 1.65;
  animation: fadeUp 0.8s 0.3s cubic-bezier(.22,.61,.36,1) both;
}

/* CTA group */
.hero-cta-wrapper {
  margin-top: 36px;
  display: flex;
  align-items: center;
  gap: 14px;
  pointer-events: auto;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeUp 0.8s 0.4s cubic-bezier(.22,.61,.36,1) both;
}
.hero-cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 28px;
  border-radius: 12px;
  background: var(--accent);
  color: #111010;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.22s ease;
  box-shadow: 0 8px 32px -4px rgba(249, 248, 113, 0.3);
  border: none;
  cursor: pointer;
}
.hero-cta-primary:hover {
  background: var(--accent-light);
  transform: translateY(-2px);
  box-shadow: 0 14px 36px -4px rgba(249, 248, 113, 0.4);
}
.hero-cta-primary:active { transform: translateY(0); }
.hero-cta-primary svg { transition: transform 0.2s ease; }
.hero-cta-primary:hover svg { transform: translateX(3px); }

.hero-cta-secondary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 13px 22px;
  border-radius: 12px;
  background: transparent;
  color: var(--muted-light);
  font-weight: 500;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.22s ease;
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
}
.hero-cta-secondary:hover {
  color: var(--fg);
  border-color: rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.04);
}

/* Stats bar */
.stats-bar {
  margin-top: 52px;
  display: flex;
  align-items: center;
  gap: 32px;
  animation: fadeUp 0.8s 0.55s cubic-bezier(.22,.61,.36,1) both;
  pointer-events: auto;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--fg);
  letter-spacing: -0.01em;
}
.stat-label {
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--border);
  opacity: 0.7;
}

/* Scroll indicator */
.scroll-hint {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  pointer-events: none;
  animation: fadeIn 1s 1.2s both;
}
.scroll-arrow {
  animation: bounce-arrow 1.8s ease-in-out infinite;
}
      `}</style>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar1 hasSession={hasSession} />
      </div>

      {/* Radial glow */}
      <div className="hero-glow" />

      {/* Particles */}
      <canvas ref={canvasRef} className="particleCanvas" />

      {/* Accent Lines */}
      <div className="accent-lines">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>

      {/* Hero Content */}
      <main className="hero">
        <div className="hero-inner">
          {/* Eyebrow */}
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Resume Management, Reimagined
          </div>

          {/* Title */}
          <h1 className="title">
            <span className="yellow-glow">Share</span> your resume<br />on your <span className="yellow-glow">terms</span>.
          </h1>

          {/* Subtitle */}
          <p className="subtitle">
            Upload, organize, and share all your resumes from one place. Create permanent links, swap documents silently, and track every recruiter visit.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-wrapper">
            {hasSession ? (
              <>
                <Link className="hero-cta-primary" href="/dashboard">
                  Go to Dashboard
                  <ArrowRight size={16} />
                </Link>
                <Link className="hero-cta-secondary" href="/#features">
                  Explore features
                </Link>
              </>
            ) : (
              <>
                <Link className="hero-cta-primary" href="/register">
                  Get Started — it&apos;s free
                  <ArrowRight size={16} />
                </Link>
                <Link className="hero-cta-secondary" href="/login">
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">1 Link</span>
              <span className="stat-label">Forever</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">Real-time</span>
              <span className="stat-label">View Tracking</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">AI</span>
              <span className="stat-label">Feedback</span>
            </div>
          </div>
        </div>
      </main>

      {/* Scroll hint */}
      <div className="scroll-hint">
        <span>Scroll</span>
        <span className="scroll-arrow">
          <ChevronDown size={14} />
        </span>
      </div>
    </section>
  );
}
