import { useEffect, useRef } from 'react';

// ─── Tuning Parameters for Google Antigravity-Style Halo ────────────────────
const CONFIG = {
  // Halo geometry
  interactionRadius: 260,      // Range from cursor that pulls particles in (px)
  haloRadiusMin: 35,           // Inner boundary of the dense particle halo
  haloRadiusMax: 95,           // Outer boundary of the dense particle halo
  innerCore: 22,               // Gentle buffer to prevent collapse into the 1px center

  // Physical forces
  attractStrength: 2.8,        // Pulls particles toward the halo surrounding the mouse
  tangentialStrength: 1.8,     // Swirls particles gently around the cursor
  velocityInfluence: 0.55,     // Makes the cloud follow the mouse cursor dynamically
  returnSpeed: 0.035,          // Elastic spring returning particles to their original scatter
  damping: 0.88,               // Smooth fluid damping to prevent jitter
  maxSpeed: 14,                // Velocity limit

  // Ambient motion
  ambientDriftSpeed: 0.12,     // Subtle drift for calm background particles

  // Dash appearance
  lineWidth: 1.8,
  minDashLen: 4,
  maxDashLen: 11,
  baseOpacity: 0.82,
  activeOpacity: 1.0,          // Solid / fully opaque inside the halo

  // All Cyan palette
  palette: [
    '#00FFFF', // Pure Cyan
    '#00F0FF', // Electric Cyan
    '#00E5FF', // Bright Cyan
    '#06B6D4', // Deep Cyan
    '#22D3EE', // Light Cyan
    '#38BDF8', // Sky Cyan
  ],
};
// ────────────────────────────────────────────────────────────────────────────

function buildParticles(w, h) {
  const isMobile = w < 768;
  const area = w * h;
  // Natural density: ~480-560 particles on desktop, ~160 on mobile
  const targetCount = isMobile
    ? Math.min(Math.max(Math.round(area / 2400), 130), 180)
    : Math.min(Math.max(Math.round(area / 3600), 340), 560);

  return Array.from({ length: targetCount }, () => {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const angle = Math.random() * Math.PI * 2;
    const len = CONFIG.minDashLen + Math.random() * (CONFIG.maxDashLen - CONFIG.minDashLen);
    const color = CONFIG.palette[Math.floor(Math.random() * CONFIG.palette.length)];
    const baseOpacity = CONFIG.baseOpacity * (0.85 + Math.random() * 0.15);
    const driftAngle = Math.random() * Math.PI * 2;
    const driftSpeed = CONFIG.ambientDriftSpeed * (0.6 + Math.random() * 0.8);
    // Randomized preferred orbit distance for natural halo cloud thickness
    const preferredHalo =
      CONFIG.haloRadiusMin +
      Math.random() * (CONFIG.haloRadiusMax - CONFIG.haloRadiusMin);
    const orbitDir = Math.random() < 0.5 ? 1 : -1;

    return {
      ox: x,
      oy: y,
      x,
      y,
      vx: 0,
      vy: 0,
      angle,
      baseAngle: angle,
      len,
      color,
      baseOpacity,
      highlight: 0,
      driftAngle,
      driftSpeed,
      preferredHalo,
      orbitDir,
    };
  });
}

export default function InteractiveParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let particles = [];
    let rafId = null;
    let hidden = false;
    let scaled = false;

    // Pointer state with position and smoothed velocity tracking
    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      speed: 0,
      active: false,
    };

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scaled = true;

      if (particles.length === 0) {
        particles = buildParticles(W, H);
      } else {
        // Clamp existing particles to new viewport bounds
        particles.forEach((p) => {
          p.ox = Math.min(p.ox, W);
          p.oy = Math.min(p.oy, H);
          p.x = Math.min(p.x, W);
          p.y = Math.min(p.y, H);
        });
      }
    }

    function onPointerMove(e) {
      mouse.active = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function onTouchMove(e) {
      if (e.touches && e.touches.length > 0) {
        mouse.active = true;
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    }

    function onPointerLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.prevX = -9999;
      mouse.prevY = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
      mouse.speed = 0;
    }

    function onVisibility() {
      hidden = document.hidden;
    }

    function tick() {
      if (hidden) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      if (!scaled) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Update pointer velocity with inertia damping
      if (mouse.active && mouse.x > -9000) {
        if (mouse.prevX === -9999) {
          mouse.prevX = mouse.x;
          mouse.prevY = mouse.y;
        }
        const rawVx = mouse.x - mouse.prevX;
        const rawVy = mouse.y - mouse.prevY;
        mouse.vx = mouse.vx * 0.65 + rawVx * 0.35;
        mouse.vy = mouse.vy * 0.65 + rawVy * 0.35;
        mouse.speed = Math.hypot(mouse.vx, mouse.vy);
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
      } else {
        mouse.vx *= 0.8;
        mouse.vy *= 0.8;
        mouse.speed = Math.hypot(mouse.vx, mouse.vy);
      }

      ctx.clearRect(0, 0, W, H);

      const R = CONFIG.interactionRadius;
      const core = CONFIG.innerCore;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Ambient slow drift for calm natural background
        p.ox += Math.cos(p.driftAngle) * p.driftSpeed;
        p.oy += Math.sin(p.driftAngle) * p.driftSpeed;
        if (p.ox < 0) p.ox = W;
        if (p.ox > W) p.ox = 0;
        if (p.oy < 0) p.oy = H;
        if (p.oy > H) p.oy = 0;

        // 2. Mouse interaction calculation: Attraction towards circular halo
        const toMouseX = mouse.x - p.x;
        const toMouseY = mouse.y - p.y;
        const dist = Math.hypot(toMouseX, toMouseY) || 0.001;

        let targetAngle = p.baseAngle;

        if (mouse.active && dist < R) {
          // Unit vector pointing toward mouse
          const dirX = toMouseX / dist;
          const dirY = toMouseY / dist;

          // Normalized distance from cursor to outer boundary [0, 1]
          const outerNorm = dist / R;
          const falloff = (1 - outerNorm) * (1 - outerNorm);

          const haloR = p.preferredHalo;

          if (dist > haloR) {
            // Particle is outside halo: Pull INWARD toward the halo around the mouse
            const pullFactor = (dist - haloR) / (R - haloR);
            const attractForce =
              (pullFactor * 0.8 + 0.2) * falloff * CONFIG.attractStrength;
            p.vx += dirX * attractForce;
            p.vy += dirY * attractForce;
          } else if (dist < core) {
            // Particle is too close to cursor center: gentle buffer pushing out to halo
            const buffer = (core - dist) / core;
            const pushOut = (buffer * 1.5 + 0.3) * CONFIG.attractStrength;
            p.vx -= dirX * pushOut;
            p.vy -= dirY * pushOut;
          } else {
            // Particle is inside halo ring: gently balance distance around preferred halo
            const diff = haloR - dist;
            const gentleAdjustment = (diff / haloR) * 0.4 * CONFIG.attractStrength;
            p.vx -= dirX * gentleAdjustment;
            p.vy -= dirY * gentleAdjustment;
          }

          // Tangential Swirl: Particles circulate gently around the cursor
          const tangentX = -dirY;
          const tangentY = dirX;
          const swirlForce =
            falloff *
            CONFIG.tangentialStrength *
            (0.7 + Math.min(mouse.speed * 0.1, 1.4));
          p.vx += tangentX * p.orbitDir * swirlForce;
          p.vy += tangentY * p.orbitDir * swirlForce;

          // Pointer Velocity Wake: Halo rides along with mouse movement
          const wake = falloff * CONFIG.velocityInfluence;
          p.vx += mouse.vx * wake;
          p.vy += mouse.vy * wake;

          // Highlight particles concentrated in the halo
          p.highlight = Math.max(p.highlight, 1 - dist / R);

          // Dash stroke aligns with tangential flow and velocity
          const tangentAngle = Math.atan2(toMouseY, toMouseX) + Math.PI / 2;
          const velocityAngle = Math.atan2(p.vy, p.vx);
          targetAngle = Math.hypot(p.vx, p.vy) > 0.8 ? velocityAngle : tangentAngle;
        } else {
          // Gradual decay of highlight when cursor is far
          p.highlight *= 0.94;
          targetAngle = p.baseAngle;
        }

        // 3. Elastic Return Force: pulls particles back to their home scatter
        const homeDx = p.ox - p.x;
        const homeDy = p.oy - p.y;
        p.vx += homeDx * CONFIG.returnSpeed;
        p.vy += homeDy * CONFIG.returnSpeed;

        // 4. Fluid Damping / Friction: prevents jitter and stabilizes the cloud
        p.vx *= CONFIG.damping;
        p.vy *= CONFIG.damping;

        // Velocity clamp
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > CONFIG.maxSpeed) {
          p.vx = (p.vx / speed) * CONFIG.maxSpeed;
          p.vy = (p.vy / speed) * CONFIG.maxSpeed;
        }

        // 5. Update Position
        p.x += p.vx;
        p.y += p.vy;

        // 6. Smooth Angle Interpolation
        let da = targetAngle - p.angle;
        while (da > Math.PI) da -= Math.PI * 2;
        while (da < -Math.PI) da += Math.PI * 2;
        p.angle += da * 0.18;

        // 7. Render Dash Stroke
        const currentLen = p.len + Math.min(speed * 0.8, 6);
        const halfLen = currentLen / 2;
        const cos = Math.cos(p.angle);
        const sin = Math.sin(p.angle);

        const currentOpacity =
          p.baseOpacity + (CONFIG.activeOpacity - p.baseOpacity) * p.highlight;

        ctx.globalAlpha = Math.min(1, Math.max(0, currentOpacity));
        ctx.strokeStyle = p.color;
        ctx.lineWidth = CONFIG.lineWidth + p.highlight * 0.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x - cos * halfLen, p.y - sin * halfLen);
        ctx.lineTo(p.x + cos * halfLen, p.y + sin * halfLen);
        ctx.stroke();
      }

      rafId = requestAnimationFrame(tick);
    }

    resize();
    tick();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('mouseleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('mouseleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        display: 'block',
      }}
    />
  );
}
