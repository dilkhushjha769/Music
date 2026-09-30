import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import sounds from '../audio/soundEffects';

export default function GiftBoxScene({ onComplete, girlfriendName = 'Nonsense 🙃' }) {
  const [state, setState] = useState('idle'); // 'idle' | 'shaking' | 'opened'
  const [flyingItems, setFlyingItems] = useState([]);

  const handleOpenGift = () => {
    if (state !== 'idle') return;

    sounds.init();
    sounds.playTap();
    setState('shaking');

    setTimeout(() => {
      setState('opened');
      sounds.playPop();
      sounds.playSparkle();
      sounds.playConfetti();

      generateBurstEmojis();

      // Confetti burst
      confetti({
        particleCount: 85,
        spread: 110,
        origin: { y: 0.55, x: 0.5 },
        colors: ['#FF4B72', '#FF8FA3', '#FFD166', '#FFB703', '#FFFFFF', '#9D4EDD'],
        ticks: 260,
        gravity: 0.65,
        scalar: 1.2,
      });
    }, 450);
  };

  const generateBurstEmojis = () => {
    const emojis = ['❤️', '💕', '🥰', '✨', '🌸', '🎀', '🦋', '⭐', '💖', '💎'];
    const generated = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      char: emojis[i % emojis.length],
      dx: (Math.random() - 0.5) * 280,
      dy: -(Math.random() * 260 + 100),
      rot: (Math.random() - 0.5) * 90,
      scale: Math.random() * 0.7 + 0.9,
    }));
    setFlyingItems(generated);
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] select-none overflow-hidden px-4 py-8">

      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-pink-200/40 via-rose-100/30 to-amber-100/25 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative flex flex-col items-center z-10 w-full max-w-md">

        {/* Instruction Tag (before opening) */}
        {state !== 'opened' && (
          <div className="mb-8 text-center transition-all duration-500">
            <span className="inline-block px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-[#C4556F] text-xs font-semibold uppercase tracking-[0.25em] shadow-sm mb-3">
              Birthday Gift For You
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#3D262C] font-normal tracking-wide">
              Tap the gift to open ✨
            </h2>
          </div>
        )}

        {/* 3D Illustrated Gift Box */}
        <div
          onClick={handleOpenGift}
          className={`relative cursor-pointer transition-all duration-500 ${state === 'idle' ? 'hover:scale-105 active:scale-95 animate-romantic-float' : ''
            } ${state === 'shaking' ? 'animate-[shake_0.45s_ease-in-out]' : ''} ${state === 'opened' ? 'scale-75 opacity-20 -mb-28 pointer-events-none' : ''
            }`}
        >
          {/* Shadow underneath */}
          <div className="w-40 h-8 bg-rose-900/15 rounded-[100%] mx-auto blur-md" />

          {/* SVG Gift Box */}
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
                <rect x="0" y="0" width="140" height="95" rx="14" fill="url(#boxBodyGrad)" />
                <rect x="56" y="0" width="28" height="95" fill="url(#ribbonGrad)" opacity="0.95" />
                <line x1="56" y1="0" x2="56" y2="95" stroke="#C88E14" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="84" y1="0" x2="84" y2="95" stroke="#C88E14" strokeWidth="1" strokeDasharray="3 2" />
                <path d="M 6,6 Q 20,45 6,85" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>

              {/* Gift Box Lid */}
              <g
                id="box-lid"
                className="transition-all duration-700 ease-out"
                style={{
                  transform: state === 'opened'
                    ? 'translate(10px, -90px) rotate(-18deg) scale(1.08)'
                    : 'translate(0px, 0px)',
                  transformOrigin: '100px 70px',
                }}
              >
                <rect x="22" y="68" width="156" height="26" rx="8" fill="url(#lidGrad)" filter="url(#boxGlow)" />
                <rect x="86" y="68" width="28" height="26" fill="url(#ribbonGrad)" />

                <g transform="translate(100, 68)">
                  <path d="M 0,0 C -35,-35 -45,10 0,0" fill="url(#ribbonGrad)" stroke="#D49A1C" strokeWidth="1.2" />
                  <path d="M 0,0 C 35,-35 45,10 0,0" fill="url(#ribbonGrad)" stroke="#D49A1C" strokeWidth="1.2" />
                  <path d="M -6,4 Q -22,25 -28,34 M 6,4 Q 22,25 28,34" stroke="url(#ribbonGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
                  <circle cx="0" cy="0" r="9" fill="#FFD166" stroke="#D49A1C" strokeWidth="1.5" />
                  <circle cx="-2" cy="-2" r="3" fill="white" opacity="0.6" />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* Flying celebration emojis */}
        {flyingItems.map((item) => (
          <span
            key={item.id}
            className="absolute pointer-events-none transition-all duration-1000 ease-out z-20"
            style={{
              left: '50%',
              top: '50%',
              transform: state === 'opened'
                ? `translate(${item.dx}px, ${item.dy}px) rotate(${item.rot}deg) scale(${item.scale})`
                : 'translate(0, 0) scale(0)',
              opacity: state === 'opened' ? 0.9 : 0,
              fontSize: '26px',
            }}
          >
            {item.char}
          </span>
        ))}

        {/* REVEALED REAL GIFT CARD WITH THE UPLOADED EARRINGS IMAGE */}
        {state === 'opened' && (
          <div className="relative z-30 w-full animate-[scaleUpGift_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] glass-card rounded-3xl p-6 md:p-8 text-center shadow-2xl border border-white/90">

            {/* Jewelry Card Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 border border-amber-300/80 text-[#C48008] text-xs font-bold uppercase tracking-[0.22em] mb-4 shadow-sm animate-pulse">
              <span>💎</span>
              <span>SPECIAL PRESENT FOR {girlfriendName}</span>
              <span>✨</span>
            </div>

            {/* Real Gift Image */}
            <div className="relative w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden shadow-xl border-2 border-amber-200/90 group">
              <img
                src="/photos/gift_earrings.png"
                alt="Earrings"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
            </div>

            {/* Gift Title & Description */}
            <div className="mt-4">
              <h3 className="font-serif text-xl md:text-2xl text-[#2B141C] font-medium tracking-tight">
                Earrings
              </h3>
            </div>

            {/* Continue to Next Surprise Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  sounds.playSparkle();
                  sounds.playWhoosh();
                  if (onComplete) onComplete();
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF4B72] to-[#E62248] text-white font-semibold text-sm tracking-wide shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Next Surprise Awaits</span>
                <span className="whitespace-nowrap">🎈 →</span>
              </button>
            </div>

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
        @keyframes scaleUpGift {
          0% { opacity: 0; transform: scale(0.7) translateY(40px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
