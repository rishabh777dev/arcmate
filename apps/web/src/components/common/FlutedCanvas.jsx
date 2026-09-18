import React, { useEffect, useRef } from 'react';

/**
 * FlutedCanvas: High-performance interactive 2D canvas shader
 * Inspired by Emily's FallbackAuthCanvas and SavedMinds WebGPU ChromaFlow
 * Features fluid inertia mouse-tracking, radial color bloom, and fluted light ribs
 */
export default function FlutedCanvas({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const target = { x: width * 0.5, y: height * 0.4 };
    const current = { x: width * 0.5, y: height * 0.4 };
    const velocity = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let time = 0;
    const render = () => {
      time += 0.012;

      // Spring physics for smooth fluid tracking
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      velocity.x += dx * 0.04;
      velocity.y += dy * 0.04;
      velocity.x *= 0.84;
      velocity.y *= 0.84;
      current.x += velocity.x;
      current.y += velocity.y;

      // Deep dark matte background
      ctx.fillStyle = '#0B0C10';
      ctx.fillRect(0, 0, width, height);

      // Primary Luminous Radial Bloom (Paytm Cyan + Deep Royal Blue)
      const speedMag = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
      const bloomRadius = Math.max(280, Math.min(520, 360 + speedMag * 5));

      const grad = ctx.createRadialGradient(
        current.x,
        current.y,
        15,
        current.x,
        current.y,
        bloomRadius
      );
      grad.addColorStop(0, 'rgba(0, 186, 242, 0.28)');     // Paytm Cyan
      grad.addColorStop(0.35, 'rgba(0, 41, 112, 0.22)');   // Paytm Navy
      grad.addColorStop(0.7, 'rgba(124, 58, 237, 0.12)');   // Violet Accent
      grad.addColorStop(1, 'rgba(11, 12, 16, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(current.x, current.y, bloomRadius, 0, Math.PI * 2);
      ctx.fill();

      // Fluted diagonal light ribs for 3D depth
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate((28 * Math.PI) / 180);
      const diag = Math.sqrt(width * width + height * height);
      const ribW = 56;
      const totalRibs = Math.ceil(diag / ribW) + 4;

      for (let i = -totalRibs / 2; i < totalRibs / 2; i++) {
        const x = i * ribW + Math.sin(time * 0.3 + i * 0.15) * 4;
        const ribGrad = ctx.createLinearGradient(x, -diag, x + ribW, -diag);
        ribGrad.addColorStop(0, 'rgba(255, 255, 255, 0.025)');
        ribGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.008)');
        ribGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.03)');
        ribGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.015)');
        ctx.fillStyle = ribGrad;
        ctx.fillRect(x, -diag, ribW, diag * 2);
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
}
