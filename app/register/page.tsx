"use client"

import { useState, useEffect, useRef } from "react";
import { createUser } from "@/actions/createUser";
import Link from "next/link";
import { ArrowRight, Link2, BarChart2, Zap, ShieldCheck } from "lucide-react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        createUser(email, password);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const setSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setSize();

        type Particle = {
            x: number; y: number; speed: number;
            opacity: number; fadeDelay: number; fadeStart: number; fadingOut: boolean;
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

        const onResize = () => { setSize(); particles = []; for (let i = 0; i < count(); i++) particles.push(make()); };
        window.addEventListener("resize", onResize);
        for (let i = 0; i < count(); i++) particles.push(make());
        raf = requestAnimationFrame(draw);

        return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
    }, []);

    const perks = [
        { icon: Link2, text: "Permanent share link — works across all versions" },
        { icon: BarChart2, text: "See exactly when recruiters view your resume" },
        { icon: Zap, text: "Swap your resume silently without changing the link" },
        { icon: ShieldCheck, text: "Free to use — no credit card required" },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.cdnfonts.com/css/hubot-sans');

                .auth-page {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #111010;
                    padding: 40px 16px;
                    font-family: 'Hubot Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial, sans-serif;
                    overflow: hidden;
                }

                .auth-canvas {
                    position: fixed;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    mix-blend-mode: screen;
                    opacity: 0.5;
                    z-index: 1;
                }

                .auth-grid {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 1;
                }

                .auth-hline, .auth-vline {
                    position: absolute;
                    background: #1e1d12;
                    opacity: 0.6;
                }
                .auth-hline { height: 1px; left: 0; right: 0; }
                .auth-hline:nth-child(1) { top: 20%; }
                .auth-hline:nth-child(2) { top: 50%; }
                .auth-hline:nth-child(3) { top: 80%; }
                .auth-vline { width: 1px; top: 0; bottom: 0; }
                .auth-vline:nth-child(4) { left: 20%; }
                .auth-vline:nth-child(5) { left: 50%; }
                .auth-vline:nth-child(6) { left: 80%; }

                .auth-glow {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -60%);
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(ellipse at center, rgba(249,248,113,0.07) 0%, rgba(249,248,113,0.03) 40%, transparent 70%);
                    pointer-events: none;
                    z-index: 2;
                }

                .auth-card-wrap {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 440px;
                    animation: authFadeUp 0.7s cubic-bezier(.22,.61,.36,1) both;
                }

                @keyframes authFadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }


                .auth-card {
                    background: rgba(24, 24, 27, 0.75);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(249, 248, 113, 0.1);
                    border-radius: 20px;
                    padding: 40px 36px;
                    box-shadow: 0 24px 64px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(249,248,113,0.04);
                }

                .auth-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 12px;
                    border-radius: 9999px;
                    border: 1px solid #292813;
                    background: rgba(249,248,113,0.06);
                    font-size: 10px;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #f9f871;
                    margin-bottom: 20px;
                }
                .auth-eyebrow-dot {
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #f9f871;
                    animation: authPulse 2.5s ease-in-out infinite;
                }
                @keyframes authPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(249,248,113,0); }
                    50%       { box-shadow: 0 0 10px 3px rgba(249,248,113,0.2); }
                }

                .auth-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #ffffff;
                    letter-spacing: -0.02em;
                    margin: 0 0 6px 0;
                    line-height: 1.15;
                }
                .auth-title-accent { color: #f9f871; }

                .auth-subtitle {
                    font-size: 14px;
                    color: #9696a5;
                    margin: 0 0 28px 0;
                    line-height: 1.55;
                }

                .auth-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(249,248,113,0.12), transparent);
                    margin-bottom: 28px;
                }

                .auth-label {
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    color: #aaaaaf;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                }

                .auth-input {
                    width: 100%;
                    background: rgba(17, 16, 16, 0.8);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #ffffff;
                    border-radius: 10px;
                    padding: 12px 16px;
                    font-size: 14px;
                    font-family: inherit;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                }
                .auth-input::placeholder { color: #555560; }
                .auth-input:focus {
                    border-color: rgba(249,248,113,0.4);
                    box-shadow: 0 0 0 3px rgba(249,248,113,0.06);
                }

                .auth-field { margin-bottom: 18px; }

                .auth-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 13px 24px;
                    border-radius: 10px;
                    background: #f9f871;
                    color: #111010;
                    font-size: 14px;
                    font-weight: 700;
                    font-family: inherit;
                    border: none;
                    cursor: pointer;
                    margin-top: 8px;
                    transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
                    box-shadow: 0 8px 24px -4px rgba(249,248,113,0.25);
                    letter-spacing: 0.01em;
                }
                .auth-btn:hover {
                    background: #fffc94;
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px -4px rgba(249,248,113,0.35);
                }
                .auth-btn:active { transform: translateY(0); }
                .auth-btn svg { transition: transform 0.2s; }
                .auth-btn:hover svg { transform: translateX(3px); }

                .auth-footer-row {
                    margin-top: 24px;
                    text-align: center;
                    font-size: 13px;
                    color: #6a6a75;
                }
                .auth-footer-link {
                    color: #f9f871;
                    font-weight: 600;
                    text-decoration: none;
                    margin-left: 4px;
                    transition: color 0.15s;
                }
                .auth-footer-link:hover { color: #fffc94; text-decoration: underline; }

                .auth-perks {
                    margin-top: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                }
                .auth-perk {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 11.5px;
                    color: #6a6a75;
                    line-height: 1.3;
                }
                .auth-perk-icon {
                    flex-shrink: 0;
                    width: 22px;
                    height: 22px;
                    border-radius: 5px;
                    background: rgba(249,248,113,0.07);
                    border: 1px solid rgba(249,248,113,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #f9f871;
                }
            `}</style>

            {/* Background layers */}
            <canvas ref={canvasRef} className="auth-canvas" />
            <div className="auth-glow" />
            <div className="auth-grid">
                <div className="auth-hline" />
                <div className="auth-hline" />
                <div className="auth-hline" />
                <div className="auth-vline" />
                <div className="auth-vline" />
                <div className="auth-vline" />
            </div>

            <div className="auth-page">
                <div className="auth-card-wrap">

                    {/* Card */}
                    <div className="auth-card">
                        <div className="auth-eyebrow">
                            <span className="auth-eyebrow-dot" />
                            It&apos;s free
                        </div>
                        <h1 className="auth-title">
                            Start sharing smarter,<br /><span className="auth-title-accent">today.</span>
                        </h1>
                        <p className="auth-subtitle">
                            Create your free account and get a permanent resume link in seconds. No credit card needed.
                        </p>

                        <div className="auth-divider" />

                        <form onSubmit={handleSubmit}>
                            <div className="auth-field">
                                <label className="auth-label">Email address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="auth-input"
                                />
                            </div>

                            <div className="auth-field">
                                <label className="auth-label">Password</label>
                                <input
                                    type="password"
                                    placeholder="Choose a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="auth-input"
                                />
                            </div>

                            <button type="submit" className="auth-btn">
                                Create free account
                                <ArrowRight size={15} />
                            </button>
                        </form>

                        <div className="auth-footer-row">
                            Already have an account?
                            <Link href="/login" className="auth-footer-link">
                                Sign in
                            </Link>
                        </div>

                        <div className="auth-perks">
                            {perks.map(({ icon: Icon, text }) => (
                                <div className="auth-perk" key={text}>
                                    <div className="auth-perk-icon">
                                        <Icon size={11} />
                                    </div>
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}