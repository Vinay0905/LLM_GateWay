"use client";

import React, { useEffect, useRef } from "react";
import { useAppTheme } from "@/app/ThemeContext";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseX: number;
  baseY: number;
}

export default function ThemeCanvas() {
  const { theme } = useAppTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const particleCount = theme === "neon-tokyo" ? 45 : 30;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.5 + 1,
          baseX: x,
          baseY: y,
        });
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Technical Hover Bloom: calculate local coordinates for active card/button components
      const target = (e.target as HTMLElement).closest(".technical-card, .glass-panel, button, .hover-bloom");
      if (target) {
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (target as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (target as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const isTokyo = theme === "neon-tokyo";
    const particleColor = isTokyo ? "rgba(255, 45, 120, 0.4)" : "rgba(204, 255, 128, 0.25)";
    const lineColor = isTokyo ? "rgba(0, 255, 204, 0.08)" : "rgba(93, 230, 255, 0.05)";

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const mouse = mouseRef.current;

      // Draw Grid crosses for Gateway OS theme
      if (!isTokyo) {
        ctx.strokeStyle = "rgba(66, 73, 54, 0.1)";
        ctx.lineWidth = 0.5;
        const gridSize = 80;
        for (let x = 0; x < w; x += gridSize) {
          for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x - 3, y);
            ctx.lineTo(x + 3, y);
            ctx.moveTo(x, y - 3);
            ctx.lineTo(x, y + 3);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p, idx) => {
        // Move particles
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Mouse attraction/repulsion interaction
        if (mouse.x !== -9999) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = isTokyo ? 180 : 120;
          
          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            if (isTokyo) {
              // Attraction for Tokyo
              p.x += dx * force * 0.015;
              p.y += dy * force * 0.015;
            } else {
              // Gentle drift towards mouse for Gateway OS
              p.x += dx * force * 0.006;
              p.y += dy * force * 0.006;
            }
          }
        }

        // Draw particle
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const threshold = isTokyo ? 130 : 90;

          if (dist < threshold) {
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[-1] opacity-40 transition-opacity duration-500" />;
}
