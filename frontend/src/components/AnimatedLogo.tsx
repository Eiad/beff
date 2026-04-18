import { useState, useRef } from 'react';
import { motion } from 'motion/react';

// Ported from code-park — stripped next-intl, rebranded to Beff
export default function AnimatedLogo() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const text = 'Beff';
  const letters = text.split('');
  const letterColors = ['#047857', '#059669', '#0d9488', '#0f766e', '#10b981'];

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const getLetterStyle = (letterElement: HTMLSpanElement | null) => {
    if (!isHovering || !letterElement || !containerRef.current) {
      return { transform: 'translateY(0px) rotateX(0deg) rotateY(0deg)', transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' };
    }
    const rect = letterElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const lx = rect.left - containerRect.left + rect.width / 2;
    const ly = rect.top - containerRect.top + rect.height / 2;
    const dx = mousePos.x - lx;
    const dy = mousePos.y - ly;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 200) {
      const strength = 1 - dist / 200;
      const wave = Math.sin(strength * Math.PI) * strength;
      return {
        transform: `translateY(${-wave * 30}px) rotateX(${(dy / dist) * wave * 15}deg) rotateY(${(dx / dist) * wave * 15}deg)`,
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    }
    return { transform: 'translateY(0px) rotateX(0deg) rotateY(0deg)', transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' };
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* Glow behind logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <motion.h1
        ref={containerRef as React.RefObject<HTMLHeadingElement>}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="text-5xl sm:text-7xl md:text-9xl font-normal tracking-tight relative text-emerald-700"
        style={{ perspective: '1000px', fontFamily: 'var(--font-serif)' }}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            ref={(el) => { if (el) Object.assign(el.style, getLetterStyle(el)); }}
            className="inline-block"
            style={{ transformStyle: 'preserve-3d', color: letterColors[index % letterColors.length] }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-sm text-emerald-600/60 font-light tracking-widest mt-2 uppercase"
      >
        Greener Business, Together
      </motion.p>
    </div>
  );
}
