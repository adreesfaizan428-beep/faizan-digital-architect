import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg: "#070709",
  surface: "#0d0d12",
  glass: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.07)",
  emerald: "#00ff87",
  blue: "#0ea5e9",
  silver: "#c0c8d8",
  muted: "#4a5165",
  text: "#e8eaf2",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@300;400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; scrollbar-width: thin; scrollbar-color: #1a1a2e ${T.bg}; }

    body {
      background: ${T.bg};
      color: ${T.text};
      font-family: 'DM Sans', sans-serif;
      overflow-x: hidden;
      cursor: none;
    }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: ${T.bg}; }
    ::-webkit-scrollbar-thumb { background: #1e2030; border-radius: 2px; }

    .syne { font-family: 'Syne', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }

    .glass {
      background: ${T.glass};
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid ${T.border};
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(0,255,135,0.15); }
      50% { box-shadow: 0 0 40px rgba(0,255,135,0.35), 0 0 80px rgba(0,255,135,0.1); }
    }

    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes scan {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }

    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

    @keyframes grain {
      0%, 100% { transform: translate(0,0); }
      10% { transform: translate(-2%,-3%); }
      20% { transform: translate(3%,2%); }
      30% { transform: translate(-1%,4%); }
      40% { transform: translate(2%,-2%); }
      50% { transform: translate(-3%,3%); }
      60% { transform: translate(1%,-4%); }
      70% { transform: translate(-2%,2%); }
      80% { transform: translate(3%,-1%); }
      90% { transform: translate(-1%,3%); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.92); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes drawLine {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
    }

    @keyframes counterUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
    .animate-spin-slow { animation: spin-slow 20s linear infinite; }
    .animate-blink { animation: blink 1s step-end infinite; }

    .text-gradient-emerald {
      background: linear-gradient(135deg, ${T.emerald} 0%, #00d4ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .text-gradient-silver {
      background: linear-gradient(135deg, #c0c8d8 0%, #ffffff 50%, #a0a8b8 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-left { opacity: 0; transform: translateX(-30px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
    .reveal-left.visible { opacity: 1; transform: translateX(0); }
    .reveal-scale { opacity: 0; transform: scale(0.94); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
    .reveal-scale.visible { opacity: 1; transform: scale(1); }

    .card-hover {
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.3s ease;
    }
    .card-hover:hover {
      transform: translateY(-6px) scale(1.01);
      border-color: rgba(0,255,135,0.2) !important;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,255,135,0.05);
    }

    .btn-primary {
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0,255,135,0.15), rgba(14,165,233,0.15));
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .btn-primary:hover::before { opacity: 1; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,255,135,0.2); }
    .btn-primary:active { transform: translateY(0); }

    .nav-link {
      position: relative;
      transition: color 0.3s ease;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: ${T.emerald};
      transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .nav-link:hover::after { width: 100%; }
    .nav-link:hover { color: ${T.emerald}; }

    .grain-overlay {
      position: fixed;
      inset: -50%;
      width: 200%;
      height: 200%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.025;
      animation: grain 0.5s steps(1) infinite;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    }

    .skill-tag {
      transition: all 0.25s ease;
      cursor: default;
    }
    .skill-tag:hover {
      background: rgba(0,255,135,0.1);
      border-color: rgba(0,255,135,0.4);
      color: ${T.emerald};
    }

    input, textarea {
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: rgba(0,255,135,0.4) !important;
      box-shadow: 0 0 0 3px rgba(0,255,135,0.06);
    }

    .cursor-dot {
      pointer-events: none;
      position: fixed;
      z-index: 99999;
      mix-blend-mode: difference;
    }

    .stat-number {
      font-feature-settings: 'tnum';
    }
  `}</style>
);

// ─── CURSOR ───────────────────────────────────────────────────────────────────
const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    const onEnter = () => ringRef.current && (ringRef.current.style.transform += " scale(2)");
    const onLeave = () => {};
    document.querySelectorAll("a, button, .card-hover").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: T.emerald }} />
      <div ref={ringRef} className="cursor-dot" style={{
        width: 36, height: 36, borderRadius: "50%",
        border: `1px solid rgba(0,255,135,0.5)`,
        transition: "transform 0.1s ease, width 0.3s ease, height 0.3s ease",
      }} />
    </>
  );
};

// ─── PARTICLE CANVAS ──────────────────────────────────────────────────────────
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const PARTICLE_COUNT = 90;
    const CONNECTION_DIST = 130;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.7 ? T.emerald : Math.random() > 0.5 ? T.blue : "#ffffff",
    }));

    // Geometric ring
    const rings = [
      { r: 180, speed: 0.002, offset: 0, dotCount: 24 },
      { r: 260, speed: -0.0013, offset: Math.PI / 6, dotCount: 36 },
      { r: 340, speed: 0.0008, offset: 0, dotCount: 48 },
    ];

    let t = 0;
    const cx = W / 2, cy = H / 2;

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    const onMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Radial gradient center glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400);
      grad.addColorStop(0, "rgba(0,255,135,0.04)");
      grad.addColorStop(0.5, "rgba(14,165,233,0.02)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Geometric rings
      rings.forEach(ring => {
        ring.offset += ring.speed;
        for (let i = 0; i < ring.dotCount; i++) {
          const angle = (i / ring.dotCount) * Math.PI * 2 + ring.offset;
          const dx = cx + Math.cos(angle) * ring.r;
          const dy = cy + Math.sin(angle) * ring.r;
          const pulse = Math.sin(t * 2 + i) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.arc(dx, dy, 1.2 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,255,135,${0.25 * pulse})`;
          ctx.fill();
        }
        // Ring arc
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,255,135,0.04)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Particles
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      particles.forEach(p => {
        // Mouse repulsion
        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.vx += (dx / dist) * 0.04;
          p.vy += (dy / dist) * 0.04;
        }
        p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(")", `,${p.alpha})`).replace("rgb(", "rgba(");
        // Simple alpha approach
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECTION_DIST) {
            const alpha = (1 - d / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,255,135,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      t += 0.016;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0, opacity: 0.8,
    }} />
  );
};

// ─── SCAN LINE ────────────────────────────────────────────────────────────────
const ScanLine = () => (
  <div style={{
    position: "fixed", top: 0, left: 0, width: "100%", height: "2px",
    background: "linear-gradient(90deg, transparent, rgba(0,255,135,0.3), transparent)",
    pointerEvents: "none", zIndex: 9998,
    animation: "scan 8s linear infinite",
  }} />
);

// ─── HOOK: REVEAL ON SCROLL ───────────────────────────────────────────────────
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-scale");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("visible"), (e.target.dataset.delay || 0) * 1000);
        }
      }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
};

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["About", "Expertise", "Work", "Process", "Contact"];

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 5%",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        ...(scrolled ? {
          background: "rgba(7,7,9,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${T.border}`,
          padding: "0 5%",
        } : {}),
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72, maxWidth: 1400, margin: "0 auto" }}>
          {/* Logo */}
          <div className="syne" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="text-gradient-emerald">F</span>
            <span style={{ color: T.text }}>AIZAN</span>
            <span style={{ color: T.muted, fontSize: 11, marginLeft: 8, fontWeight: 400, letterSpacing: "0.15em" }}>AI × DEV</span>
          </div>

          {/* Desktop Links */}
          <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="desktop-nav">
            {links.map(l => (
              <button key={l} className="nav-link" onClick={() => scrollTo(l)}
                style={{ background: "none", border: "none", color: T.silver, fontSize: 13, letterSpacing: "0.08em", cursor: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>
                {l.toUpperCase()}
              </button>
            ))}
            <button className="btn-primary" onClick={() => scrollTo("Contact")}
              style={{
                background: "transparent", border: `1px solid rgba(0,255,135,0.4)`,
                color: T.emerald, padding: "9px 22px", borderRadius: 4, fontSize: 12,
                letterSpacing: "0.1em", cursor: "none", fontFamily: "'Syne', sans-serif", fontWeight: 600,
              }}>
              LET'S TALK
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "none", background: "none", border: "none", cursor: "none", flexDirection: "column", gap: 5 }}
            className="hamburger">
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 24, height: 1,
                background: menuOpen ? T.emerald : T.silver,
                transition: "all 0.3s ease",
                transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(4px, 4px)" : i === 2 ? "rotate(-45deg) translate(4px, -4px)" : "scaleX(0)") : "none",
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div style={{
        position: "fixed", top: 72, left: 0, right: 0, zIndex: 999,
        background: "rgba(7,7,9,0.97)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.border}`,
        transform: menuOpen ? "translateY(0)" : "translateY(-20px)",
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? "all" : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        padding: "24px 5%",
      }}>
        {links.map((l, i) => (
          <button key={l} onClick={() => scrollTo(l)}
            style={{
              display: "block", width: "100%", textAlign: "left",
              background: "none", border: "none", cursor: "none",
              color: T.silver, fontSize: 22, fontFamily: "'Syne', sans-serif",
              fontWeight: 700, padding: "12px 0",
              borderBottom: `1px solid ${T.border}`,
              transition: `all 0.3s ease ${i * 0.05}s`,
            }}>
            {l}
          </button>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const [typed, setTyped] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const lines = ["AI Solutions Architect", "Full-Stack Developer", "Systems Thinker"];

  useEffect(() => {
    let i = 0;
    let deleting = false;
    const tick = setInterval(() => {
      const current = lines[lineIdx];
      if (!deleting) {
        setTyped(current.slice(0, i + 1));
        i++;
        if (i === current.length) { deleting = true; setTimeout(() => {}, 1200); }
      } else {
        setTyped(current.slice(0, i - 1));
        i--;
        if (i === 0) { deleting = false; setLineIdx(p => (p + 1) % lines.length); }
      }
    }, deleting ? 40 : 80);
    return () => clearInterval(tick);
  }, [lineIdx]);

  return (
    <section id="about" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 5% 80px", zIndex: 1 }}>
      {/* Corner decorators */}
      {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos, i) => (
        <div key={pos} style={{
          position: "absolute",
          [pos.includes("top") ? "top" : "bottom"]: 40,
          [pos.includes("left") ? "left" : "right"]: "5%",
          width: 60, height: 60,
          borderTop: pos.includes("top") ? `1px solid rgba(0,255,135,0.2)` : "none",
          borderBottom: pos.includes("bottom") ? `1px solid rgba(0,255,135,0.2)` : "none",
          borderLeft: pos.includes("left") ? `1px solid rgba(0,255,135,0.2)` : "none",
          borderRight: pos.includes("right") ? `1px solid rgba(0,255,135,0.2)` : "none",
        }} />
      ))}

      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto" }}>
        {/* Status badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32, animation: "fadeInUp 0.8s ease forwards" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.emerald, boxShadow: `0 0 10px ${T.emerald}`, animation: "pulse-glow 2s infinite" }} />
          <span className="mono" style={{ fontSize: 11, color: T.emerald, letterSpacing: "0.2em" }}>AVAILABLE FOR PROJECTS · 2026</span>
        </div>

        {/* Main headline */}
        <h1 className="syne" style={{
          fontSize: "clamp(52px, 9vw, 120px)", fontWeight: 800,
          lineHeight: 0.92, letterSpacing: "-0.04em",
          marginBottom: 24,
          animation: "fadeInUp 0.8s 0.1s ease both",
        }}>
          <span className="text-gradient-silver">FAIZAN</span>
          <br />
          <span style={{ color: "rgba(255,255,255,0.12)", WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}>DIGITAL</span>
          <br />
          <span className="text-gradient-emerald">ARCHITECT</span>
        </h1>

        {/* Typewriter subtitle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40, animation: "fadeInUp 0.8s 0.2s ease both" }}>
          <span className="mono" style={{ fontSize: "clamp(14px, 2vw, 18px)", color: T.muted }}>→</span>
          <span className="mono" style={{ fontSize: "clamp(14px, 2vw, 18px)", color: T.silver }}>{typed}</span>
          <span className="animate-blink" style={{ width: 2, height: "1.2em", background: T.emerald, display: "inline-block" }} />
        </div>

        {/* Description */}
        <p style={{
          fontSize: "clamp(15px, 1.8vw, 18px)", color: T.muted, maxWidth: 520,
          lineHeight: 1.7, marginBottom: 56,
          animation: "fadeInUp 0.8s 0.3s ease both",
        }}>
          Building intelligent systems at the intersection of AI, design, and engineering.
          I craft solutions that are technically elegant and commercially decisive.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", animation: "fadeInUp 0.8s 0.4s ease both" }}>
          <button className="btn-primary" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: `linear-gradient(135deg, rgba(0,255,135,0.1), rgba(14,165,233,0.1))`,
              border: `1px solid rgba(0,255,135,0.35)`,
              color: T.emerald, padding: "16px 40px", borderRadius: 4,
              fontSize: 13, letterSpacing: "0.12em", cursor: "none",
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
            }}>
            LET'S BUILD →
          </button>
          <a href="https://faizan-digital-architect-wuq5.vercel.app/" target="_blank" rel="noopener noreferrer"
            className="btn-primary"
            style={{
              background: "transparent", border: `1px solid ${T.border}`,
              color: T.silver, padding: "16px 40px", borderRadius: 4,
              fontSize: 13, letterSpacing: "0.12em", cursor: "none",
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
              textDecoration: "none", display: "inline-block",
            }}>
            VIEW PORTFOLIO ↗
          </a>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 48, marginTop: 80, paddingTop: 48, borderTop: `1px solid ${T.border}`, flexWrap: "wrap" }}>
          {[["50+", "Projects Delivered"], ["4+", "Years Experience"], ["3", "Core Domains"], ["∞", "Curiosity"]].map(([num, label], i) => (
            <div key={label} style={{ animation: `fadeInUp 0.8s ${0.5 + i * 0.1}s ease both` }}>
              <div className="syne stat-number" style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: T.text, lineHeight: 1 }}>
                <span className="text-gradient-emerald">{num}</span>
              </div>
              <div style={{ fontSize: 12, color: T.muted, letterSpacing: "0.1em", marginTop: 6 }}>{label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        animation: "fadeInUp 1s 1s ease both",
      }}>
        <div className="mono" style={{ fontSize: 10, color: T.muted, letterSpacing: "0.2em" }}>SCROLL</div>
        <div style={{
          width: 1, height: 50,
          background: `linear-gradient(to bottom, ${T.emerald}, transparent)`,
          animation: "float 2s ease-in-out infinite",
        }} />
      </div>
    </section>
  );
};

// ─── EXPERTISE ────────────────────────────────────────────────────────────────
const Expertise = () => {
  const pillars = [
    {
      icon: "◈",
      label: "AI ENGINEERING",
      headline: "Intelligence, Engineered",
      desc: "Custom autonomous agents, precision prompt engineering, and deep LLM integration. I architect AI systems that don't just respond — they reason, adapt, and deliver.",
      skills: ["Custom Agents", "Prompt Engineering", "OpenAI / GPT-4o", "LLM Integration", "RAG Systems", "AI Automation"],
      accent: T.emerald,
      glow: "rgba(0,255,135,0.08)",
    },
    {
      icon: "⬡",
      label: "FULL-STACK WEB",
      headline: "Code That Converts",
      desc: "Next.js App Router, React Server Components, Shopify headless commerce. Every pixel optimized, every interaction crafted for conversion and delight.",
      skills: ["Next.js 14", "React", "Shopify", "TypeScript", "PostgreSQL", "Vercel Edge"],
      accent: T.blue,
      glow: "rgba(14,165,233,0.08)",
    },
    {
      icon: "◐",
      label: "GROWTH ENGINE",
      headline: "Visibility at Scale",
      desc: "Technical SEO at the infrastructure level, workflow automation that scales, and high-authority content architectures that compound over time.",
      skills: ["Technical SEO", "Core Web Vitals", "Schema Markup", "n8n / Zapier", "Content Strategy", "Analytics"],
      accent: "#c0a0ff",
      glow: "rgba(192,160,255,0.08)",
    },
    {
      icon: "◎",
      label: "MOTION & BRAND",
      headline: "Identity in Motion",
      desc: "2D/3D motion graphics, brand identity systems, and UI animations that turn interfaces into experiences. Design that communicates authority.",
      skills: ["Framer Motion", "Three.js", "After Effects", "Brand Identity", "UI Animation", "Figma → Code"],
      accent: "#ff6b6b",
      glow: "rgba(255,107,107,0.08)",
    },
  ];

  return (
    <section id="expertise" style={{ padding: "120px 5%", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: 80 }}>
          <div className="reveal mono" style={{ fontSize: 11, color: T.emerald, letterSpacing: "0.25em", marginBottom: 16 }}>
            02 / EXPERTISE
          </div>
          <h2 className="reveal syne" style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}
            data-delay="0.1">
            FOUR PILLARS.<br />
            <span style={{ color: "rgba(255,255,255,0.18)", WebkitTextStroke: "1px rgba(255,255,255,0.12)" }}>ONE VISION.</span>
          </h2>
        </div>

        {/* Pillar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {pillars.map((p, i) => (
            <div key={p.label} className="glass card-hover reveal reveal-scale" data-delay={i * 0.1}
              style={{
                borderRadius: 12, padding: 36,
                background: `linear-gradient(135deg, ${p.glow}, rgba(13,13,18,0.8))`,
                position: "relative", overflow: "hidden",
              }}>
              {/* Top accent line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }} />

              {/* Icon */}
              <div className="syne" style={{ fontSize: 36, color: p.accent, marginBottom: 20, lineHeight: 1 }}>{p.icon}</div>

              {/* Label */}
              <div className="mono" style={{ fontSize: 10, color: p.accent, letterSpacing: "0.2em", marginBottom: 12 }}>{p.label}</div>

              {/* Headline */}
              <h3 className="syne" style={{ fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 16, letterSpacing: "-0.02em" }}>
                {p.headline}
              </h3>

              {/* Description */}
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, marginBottom: 28 }}>{p.desc}</p>

              {/* Skills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {p.skills.map(s => (
                  <span key={s} className="mono skill-tag" style={{
                    fontSize: 10, color: T.muted,
                    border: `1px solid ${T.border}`, borderRadius: 3,
                    padding: "4px 10px", letterSpacing: "0.05em",
                  }}>{s}</span>
                ))}
              </div>

              {/* Corner decorator */}
              <div style={{
                position: "absolute", bottom: 20, right: 20,
                width: 40, height: 40,
                border: `1px solid ${p.accent}22`,
                borderRadius: "50%",
                animation: "spin-slow 20s linear infinite",
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── WORK ─────────────────────────────────────────────────────────────────────
const Work = () => {
  const [active, setActive] = useState(null);

  const projects = [
    {
      num: "01", label: "AI AGENT SYSTEM",
      title: "Autonomous Research Pipeline",
      desc: "Multi-agent orchestration system that conducts deep research, synthesizes insights, and generates actionable reports autonomously.",
      tech: ["LangChain", "GPT-4o", "Next.js", "PostgreSQL"],
      accent: T.emerald,
    },
    {
      num: "02", label: "E-COMMERCE",
      title: "Headless Shopify Platform",
      desc: "Custom headless commerce experience with Next.js, achieving 98 Lighthouse score and 40% uplift in conversion rate.",
      tech: ["Shopify", "Next.js", "Framer Motion", "Vercel"],
      accent: T.blue,
    },
    {
      num: "03", label: "SEO × AUTOMATION",
      title: "Programmatic Content Engine",
      desc: "AI-powered content generation system producing 1,000+ SEO-optimized pages monthly with full schema markup automation.",
      tech: ["Python", "OpenAI", "n8n", "Ahrefs API"],
      accent: "#c0a0ff",
    },
    {
      num: "04", label: "3D BRAND IDENTITY",
      title: "Immersive Brand Experience",
      desc: "Complete brand identity with Three.js interactive website, motion system, and design tokens deployed across all touchpoints.",
      tech: ["Three.js", "Blender", "GSAP", "Figma"],
      accent: "#ff6b6b",
    },
  ];

  return (
    <section id="work" style={{ padding: "120px 5%", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 32, marginBottom: 64 }}>
          <div>
            <div className="reveal mono" style={{ fontSize: 11, color: T.emerald, letterSpacing: "0.25em", marginBottom: 16 }}>03 / SELECTED WORK</div>
            <h2 className="reveal syne" style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, letterSpacing: "-0.03em" }} data-delay="0.1">
              CASE STUDIES
            </h2>
          </div>
          <a href="https://faizan-digital-architect-wuq5.vercel.app/" target="_blank" rel="noopener noreferrer"
            style={{ color: T.emerald, textDecoration: "none", fontSize: 13, letterSpacing: "0.1em", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}
            className="reveal">
            VIEW ALL WORK ↗
          </a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {projects.map((p, i) => (
            <div key={p.num}
              className="reveal"
              data-delay={i * 0.08}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{
                padding: "32px 0",
                borderBottom: `1px solid ${T.border}`,
                borderTop: i === 0 ? `1px solid ${T.border}` : "none",
                cursor: "none",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                background: active === i ? `rgba(255,255,255,0.02)` : "transparent",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
                <span className="mono" style={{ fontSize: 11, color: T.muted, minWidth: 32 }}>{p.num}</span>
                <span className="mono" style={{ fontSize: 10, color: p.accent, letterSpacing: "0.15em", minWidth: 140 }}>{p.label}</span>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div className="syne" style={{
                    fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 700,
                    color: active === i ? T.text : T.silver,
                    letterSpacing: "-0.02em", transition: "color 0.3s ease",
                  }}>{p.title}</div>
                  <div style={{
                    fontSize: 13, color: T.muted, marginTop: 6,
                    maxHeight: active === i ? 60 : 0, overflow: "hidden",
                    transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1)",
                  }}>{p.desc}</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {p.tech.map(t => (
                    <span key={t} className="mono" style={{
                      fontSize: 10, color: T.muted, border: `1px solid ${T.border}`,
                      padding: "3px 8px", borderRadius: 3, letterSpacing: "0.05em",
                    }}>{t}</span>
                  ))}
                </div>
                <span style={{
                  color: p.accent, fontSize: 20,
                  transform: active === i ? "translateX(8px)" : "translateX(0)",
                  transition: "transform 0.3s ease",
                }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── PROCESS ──────────────────────────────────────────────────────────────────
const Process = () => {
  const steps = [
    { n: "01", title: "Discovery", desc: "Deep-dive into your goals, constraints, and opportunities. I map what exists, what's missing, and what's possible." },
    { n: "02", title: "Architecture", desc: "System design, tech stack selection, and a clear roadmap. No ambiguity — every decision is intentional and explained." },
    { n: "03", title: "Build", desc: "Iterative, high-velocity development with daily updates. Production-quality code from day one, not day thirty." },
    { n: "04", title: "Optimize", desc: "Performance audits, SEO validation, AI fine-tuning, and UX refinement. Ship when it's exceptional, not just functional." },
    { n: "05", title: "Scale", desc: "Infrastructure for growth, monitoring, documentation, and ongoing support. Built to last, built to scale." },
  ];

  return (
    <section id="process" style={{ padding: "120px 5%", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 80 }}>
          <div className="reveal mono" style={{ fontSize: 11, color: T.emerald, letterSpacing: "0.25em", marginBottom: 16 }}>04 / PROCESS</div>
          <h2 className="reveal syne" style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, letterSpacing: "-0.03em" }} data-delay="0.1">
            HOW WE<br />
            <span style={{ color: "rgba(255,255,255,0.18)", WebkitTextStroke: "1px rgba(255,255,255,0.12)" }}>GET THERE</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, background: T.border }}>
          {steps.map((s, i) => (
            <div key={s.n} className="reveal card-hover"
              data-delay={i * 0.08}
              style={{
                background: T.surface, padding: 36,
                position: "relative", overflow: "hidden",
              }}>
              <div className="syne" style={{ fontSize: 64, fontWeight: 800, color: "rgba(0,255,135,0.06)", lineHeight: 1, marginBottom: 20 }}>{s.n}</div>
              <div style={{ position: "absolute", top: 0, left: 0, width: 2, height: 0, background: T.emerald, transition: "height 0.5s ease" }} className="process-line" />
              <h3 className="syne" style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 12, letterSpacing: "-0.01em" }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .card-hover:hover .process-line { height: 100% !important; }
      `}</style>
    </section>
  );
};

// ─── CONTACT ──────────────────────────────────────────────────────────────────
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", project: "", message: "" });
  const [sent, setSent] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = () => { if (form.name && form.email) { setSent(true); } };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.03)",
    border: `1px solid ${T.border}`, borderRadius: 6,
    color: T.text, padding: "16px 20px", fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <section id="contact" style={{ padding: "120px 5% 80px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          {/* Left */}
          <div>
            <div className="reveal mono" style={{ fontSize: 11, color: T.emerald, letterSpacing: "0.25em", marginBottom: 16 }}>05 / CONTACT</div>
            <h2 className="reveal syne" style={{ fontSize: "clamp(42px, 6vw, 80px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.92, marginBottom: 32 }}
              data-delay="0.1">
              LET'S<br />BUILD.
            </h2>
            <p className="reveal" style={{ fontSize: 16, color: T.muted, lineHeight: 1.7, marginBottom: 48, maxWidth: 400 }} data-delay="0.15">
              Have a vision that needs an architect? Whether it's an AI system, a premium product, or a full digital stack — I'm here to build it properly.
            </p>

            {/* Contact info */}
            <div className="reveal" data-delay="0.2" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "EMAIL", val: "hello@faizan.dev", icon: "→" },
                { label: "RESPONSE TIME", val: "Within 24 hours", icon: "◎" },
                { label: "AVAILABILITY", val: "Open to Projects", icon: "◈" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span className="mono" style={{ color: T.emerald, fontSize: 14 }}>{item.icon}</span>
                  <div>
                    <div className="mono" style={{ fontSize: 10, color: T.muted, letterSpacing: "0.15em", marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 14, color: T.silver }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="reveal" data-delay="0.25" style={{ display: "flex", gap: 16, marginTop: 48 }}>
              {["GitHub", "LinkedIn", "Twitter", "Dribbble"].map(s => (
                <a key={s} href="#" style={{ fontSize: 11, color: T.muted, letterSpacing: "0.1em", textDecoration: "none", fontFamily: "'Syne',sans-serif", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = T.emerald}
                  onMouseLeave={e => e.target.style.color = T.muted}>
                  {s.toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className="glass reveal-scale" style={{ borderRadius: 16, padding: 48, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${T.emerald}, transparent)` }} />

            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div className="syne" style={{ fontSize: 48, marginBottom: 16 }}>◎</div>
                <div className="syne" style={{ fontSize: 24, fontWeight: 700, color: T.emerald, marginBottom: 12 }}>MESSAGE SENT</div>
                <p style={{ color: T.muted, fontSize: 14 }}>I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>START A PROJECT</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <input name="name" placeholder="Name" value={form.name} onChange={handle} style={inputStyle} />
                  <input name="email" placeholder="Email" value={form.email} onChange={handle} style={inputStyle} />
                </div>

                <select name="project" value={form.project} onChange={handle} style={{ ...inputStyle, appearance: "none" }}>
                  <option value="">Project Type</option>
                  <option>AI Agent / LLM Integration</option>
                  <option>Full-Stack Web Development</option>
                  <option>Growth & SEO Strategy</option>
                  <option>3D / Motion Design</option>
                  <option>Full Digital Stack</option>
                </select>

                <textarea name="message" placeholder="Tell me about your vision..." value={form.message} onChange={handle}
                  style={{ ...inputStyle, minHeight: 140, resize: "vertical" }} />

                <button className="btn-primary" onClick={submit}
                  style={{
                    background: `linear-gradient(135deg, rgba(0,255,135,0.12), rgba(14,165,233,0.08))`,
                    border: `1px solid rgba(0,255,135,0.35)`,
                    color: T.emerald, padding: "18px", borderRadius: 6,
                    fontSize: 13, letterSpacing: "0.12em", cursor: "none",
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, width: "100%",
                    animatePulseGlow: true,
                  }}
                  className="animate-pulse-glow btn-primary">
                  SEND MESSAGE →
                </button>

                <p className="mono" style={{ fontSize: 10, color: T.muted, textAlign: "center", letterSpacing: "0.08em" }}>
                  ENCRYPTED · NO SPAM · DIRECT REPLY
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact > div > div { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ borderTop: `1px solid ${T.border}`, padding: "40px 5%", position: "relative", zIndex: 1 }}>
    <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
      <div className="syne" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>
        <span className="text-gradient-emerald">FAIZAN</span>
        <span style={{ color: T.muted }}> · AI SOLUTIONS ARCHITECT & FULL-STACK DEV</span>
      </div>
      <div className="mono" style={{ fontSize: 10, color: T.muted, letterSpacing: "0.12em" }}>
        © 2026 · BUILT WITH PRECISION · ALL RIGHTS RESERVED
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.emerald, boxShadow: `0 0 8px ${T.emerald}` }} />
        <span className="mono" style={{ fontSize: 10, color: T.emerald, letterSpacing: "0.15em" }}>SYSTEMS ONLINE</span>
      </div>
    </div>
  </footer>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  useReveal();

  return (
    <>
      <GlobalStyles />
      <div className="grain-overlay" />
      <ParticleCanvas />
      <ScanLine />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Expertise />
        <Work />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
