import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import sounds from '../audio/soundEffects';

export default function GiftBoxScene({ onComplete, girlfriendName = 'My Love' }) {
  const [state, setState] = useState('idle'); // 'idle' | 'shaking' | 'opened'
  const [flyingItems, setFlyingItems] = useState([]);

  const handleOpenGift = () => {
    if (state !== 'idle') return;

    sounds.init();
    sounds.playTap();
    setState('shaking');

    // 400ms shake anticipation, then dramatic pop
    setTimeout(() => {
      setState('opened');
      sounds.playPop();
      sounds.playSparkle();
      sounds.playConfetti();

      // Explode custom emojis & hearts
      generateBurstEmojis();

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.55, x: 0.5 },
        colors: ['#FF4B72', '#FF8FA3', '#FFD166', '#FFB703', '#FFFFFF', '#FF80B0'],
        ticks: 250,
        gravity: 0.7,
        scalar: 1.2,
      });

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 2200);
    }, 450);
  };

  const generateBurstEmojis = () => {
    const emojis = ['❤️', '💕', '🥰', '✨', '🌸', '🎀', '🦋', '⭐', '💖', '💐'];
    const generated = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      char: emojis[i % emojis.length],
      dx: (Math.random() - 0.5) * 280,
      dy: -(Math.random() * 260 + 100),
      rot: (Math.random() - 0.5) * 90,
      scale: Math.random() * 0.7 + 0.9,
      delay: Math.random() * 0.15,
    }));
    setFlyingItems(generated);
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] select-none overflow-hidden px-4">
      
      {/* Ambient background glow */}
      <div className="absolute w-[450px] h-[450px] bg-gradient-to-tr from-pink-200/40 via-rose-100/30 to-amber-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Gift Container */}
      <div className="relative flex flex-col items-center z-10">
        
        {/* Instruction Tag */}
        <div 
          className={`mb-10 text-center transition-all duration-500 ${
            state === 'opened' ? 'opacity-0 scale-90' : 'opacity-100'
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-[#C4556F] text-xs font-semibold uppercase tracking-[0.25em] shadow-sm mb-3">
            Surprise For You
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-[#3D262C] font-normal tracking-wide">
            Tap the gift to open ✨
          </h2>
        </div>

        {/* 3D Illustrated Gift Box */}
        <div 
          onClick={handleOpenGift}
          className={`relative cursor-pointer transition-transform duration-300 ${
            state === 'idle' ? 'hover:scale-105 active:scale-95 animate-romantic-float' : ''
          } ${state === 'shaking' ? 'animate-[shake_0.45s_ease-in-out]' : ''}`}
        >
          {/* Shadow underneath */}
          <div 
            className={`w-40 h-8 bg-rose-900/15 rounded-[100%] mx-auto blur-md transition-all duration-500 ${
              state === 'opened' ? 'scale-125 opacity-40' : 'scale-100'
            }`} 
          />

          {/* SVG Romantic Gift Box */}
          <div className="relative -mt-6">
            <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible filter drop-shadow-xl">
              <defs>
                <linearGradient id="boxBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B8B" />
                  <stop offset="50%" stopColor="#E63956" />
                  <stop offset="100%" stopColor="#C41E3A" />
                </linearGradient>

                <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF85A1" />
                  <stop offset="60%" stopColor="#F74465" />
                  <stop offset="100%" stopColor="#D92045" />
                </linearGradient>

                <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFE066" />
                  <stop offset="50%" stopColor="#FFD166" />
                  <stop offset="100%" stopColor="#E5A823" />
                </linearGradient>

                <filter id="boxGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#FF3366" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Gift Box Base */}
              <g id="box-base" transform="translate(30, 85)">
                {/* Box body */}
                <rect x="0" y="0" width="140" height="95" rx="14" fill="url(#boxBodyGrad)" />
                {/* Vertical Gold Silk Ribbon */}
                <rect x="56" y="0" width="28" height="95" fill="url(#ribbonGrad)" opacity="0.95" />
                {/* Ribbon subtle stitching shadow */}
                <line x1="56" y1="0" x2="56" y2="95" stroke="#C88E14" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="84" y1="0" x2="84" y2="95" stroke="#C88E14" strokeWidth="1" strokeDasharray="3 2" />
                {/* Soft highlight on front of box */}
                <path d="M 6,6 Q 20,45 6,85" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>

              {/* Gift Box Lid + Giant Cute Bow (pops off when opened!) */}
              <g 
                id="box-lid"
                className="transition-all duration-700 ease-out"
                style={{
                  transform: state === 'opened' 
                    ? 'translate(10px, -85px) rotate(-18deg) scale(1.08)' 
                    : 'translate(0px, 0px)',
                  transformOrigin: '100px 70px',
                }}
              >
                {/* Lid Base */}
                <rect x="22" y="68" width="156" height="26" rx="8" fill="url(#lidGrad)" filter="url(#boxGlow)" />
                {/* Lid Ribbon */}
                <rect x="86" y="68" width="28" height="26" fill="url(#ribbonGrad)" />

                {/* Big Fluffy Silk Bow on top */}
                <g transform="translate(100, 68)">
                  {/* Left bow loop */}
                  <path
                    d="M 0,0 C -35,-35 -45,10 0,0"
                    fill="url(#ribbonGrad)"
                    stroke="#D49A1C"
                    strokeWidth="1.2"
                  />
                  {/* Right bow loop */}
                  <path
                    d="M 0,0 C 35,-35 45,10 0,0"
                    fill="url(#ribbonGrad)"
                    stroke="#D49A1C"
                    strokeWidth="1.2"
                  />
                  {/* Hanging bow ribbons */}
                  <path
                    d="M -6,4 Q -22,25 -28,34 M 6,4 Q 22,25 28,34"
                    stroke="url(#ribbonGrad)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Bow Center knot */}
                  <circle cx="0" cy="0" r="9" fill="#FFD166" stroke="#D49A1C" strokeWidth="1.5" />
                  <circle cx="-2" cy="-2" r="3" fill="white" opacity="0.6" />
                </g>
              </g>

              {/* Inside heart aura when opened */}
              {state === 'opened' && (
                <g transform="translate(85, 95)" className="animate-pulse">
                  <circle cx="15" cy="10" r="35" fill="rgba(255, 230, 240, 0.9)" filter="blur(8px)" />
                  <text x="15" y="20" fontSize="38" textAnchor="middle">💖</text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Flying items bursting out of box */}
        {flyingItems.map((item) => (
          <span
            key={item.id}
            className="absolute pointer-events-none transition-all duration-1000 ease-out z-20"
            style={{
              left: '50%',
              top: '55%',
              transform: state === 'opened' 
                ? `translate(${item.dx}px, ${item.dy}px) rotate(${item.rot}deg) scale(${item.scale})`
                : 'translate(0, 0) scale(0)',
              opacity: state === 'opened' ? 1 : 0,
              fontSize: '28px',
              filter: 'drop-shadow(0 4px 10px rgba(255, 100, 130, 0.4))',
            }}
          >
            {item.char}
          </span>
        ))}

        {/* Sweet text after opening */}
        {state === 'opened' && (
          <div className="mt-8 text-center animate-fade-in">
            <p className="font-serif italic text-xl text-[#A63852] animate-bounce">
              A little universe of love unfolds... 🌸
            </p>
          </div>
        )}

      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg) scale(1); }
          20% { transform: rotate(-6deg) scale(1.04); }
          40% { transform: rotate(6deg) scale(1.05); }
          60% { transform: rotate(-5deg) scale(1.03); }
          80% { transform: rotate(4deg) scale(1.02); }
        }
      `}</style>
    </div>
  );
}
