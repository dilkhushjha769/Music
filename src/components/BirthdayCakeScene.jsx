import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import sounds from '../audio/soundEffects';

export default function BirthdayCakeScene({ onComplete, girlfriendName = 'Nonsense 🙃' }) {
  // Step: 'blow' | 'blown' | 'cutting' | 'cut'
  const [step, setStep] = useState('blow');
  const [knifeY, setKnifeY] = useState(0);

  // Step 1: Blow the Candles
  const handleBlowCandles = () => {
    if (step !== 'blow') return;
    sounds.playBlowCandle();
    setStep('blown');

    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.5, x: 0.5 },
      colors: ['#FFD166', '#FF6B8B', '#FFFFFF'],
      ticks: 180,
      gravity: 0.5,
    });
  };

  // Step 2: Cut the Cake with smooth animation
  const handleCutCake = () => {
    if (step !== 'blown') return;
    setStep('cutting');
    sounds.playKnifeSlice();
    sounds.playSparkle();

    // Smooth knife downward slice
    let progress = 0;
    const sliceAnim = setInterval(() => {
      progress += 8;
      setKnifeY(progress);
      if (progress >= 110) {
        clearInterval(sliceAnim);
        setStep('cut');
        sounds.playPop();
        sounds.startHappyBirthdaySong();

        // Celebration confetti burst for cutting the cake!
        confetti({
          particleCount: 85,
          spread: 110,
          origin: { y: 0.55, x: 0.5 },
          colors: ['#FF4B72', '#FFD166', '#FF85A1', '#FFFFFF', '#FFB703', '#9D4EDD'],
          ticks: 250,
          gravity: 0.65,
          scalar: 1.15,
        });
      }
    }, 28);
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF5F7] via-[#FAF7F2] to-[#FFF0F5] px-4 py-8 select-none overflow-hidden">
      
      {/* Background celebration lighting */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-pink-200/40 via-amber-100/35 to-rose-100/25 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-lg glass-card rounded-3xl p-6 md:p-10 text-center shadow-2xl border border-white/80 animate-[scaleUp_0.4s_ease-out]">
        
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/70 text-[#C44D68] text-xs font-semibold uppercase tracking-[0.25em] mb-3 shadow-sm">
          <span>🎂</span>
          <span>Birthday Tradition</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-serif text-[#381E27] font-normal leading-tight">
          {step === 'blow' && 'Make a Wish, '}
          {step === 'blown' && 'Now Cut The Cake, '}
          {(step === 'cutting' || step === 'cut') && 'Happy Birthday, '}
          <span className="text-[#E62248] italic block mt-0.5">
            {girlfriendName}!
          </span>
        </h1>

        <p className="text-xs md:text-sm text-[#7D4D59] font-playful text-lg mt-1 mb-5">
          {step === 'blow' && '🕯️ Tap the glowing candles to make a wish and blow them out!'}
          {step === 'blown' && '🔪 Tap the golden knife to cut your sweet birthday cake!'}
          {(step === 'cutting' || step === 'cut') && '🎉 May every single bite of life be sweet and joyful! ✨'}
        </p>

        {/* INTERACTIVE CAKE & KNIFE STAGE */}
        <div className="relative inline-block my-2">
          
          {/* Animated 3D Birthday Cake */}
          <div 
            onClick={step === 'blow' ? handleBlowCandles : undefined}
            className={`relative transition-transform duration-300 ${
              step === 'blow' ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
            }`}
          >
            <svg width="250" height="200" viewBox="0 0 250 200" className="overflow-visible filter drop-shadow-xl">
              <defs>
                <linearGradient id="plateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF" />
                  <stop offset="100%" stopColor="#E2D4D7" />
                </linearGradient>

                <linearGradient id="frostingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFA6B8" />
                  <stop offset="50%" stopColor="#FF7597" />
                  <stop offset="100%" stopColor="#E63956" />
                </linearGradient>

                <linearGradient id="spongeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF0D4" />
                  <stop offset="100%" stopColor="#F5D099" />
                </linearGradient>

                <linearGradient id="sliceInside" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFD1DC" />
                  <stop offset="50%" stopColor="#FFF0D4" />
                  <stop offset="100%" stopColor="#FFB6C1" />
                </linearGradient>

                <filter id="candleGlow">
                  <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#FFB703" floodOpacity="0.95" />
                </filter>
              </defs>

              {/* Ceramic Plate */}
              <ellipse cx="125" cy="172" rx="110" ry="18" fill="url(#plateGrad)" stroke="#DFD0D3" strokeWidth="2.5" />

              {/* Main Cake Body (Base Tier) */}
              <g 
                className="transition-transform duration-700 ease-out"
                style={{
                  transform: step === 'cut' ? 'translateX(-8px)' : 'none',
                }}
              >
                <path d="M 40,135 C 40,135 40,165 125,165 C 210,165 210,135 210,135 L 210,105 C 210,105 210,135 125,135 C 40,135 40,105 40,105 Z" fill="url(#spongeGradient)" />
                <ellipse cx="125" cy="105" rx="85" ry="24" fill="url(#frostingGradient)" />
                <path
                  d="M 40,105 Q 55,128 70,110 Q 90,132 110,112 Q 130,135 150,112 Q 170,130 190,110 Q 200,126 210,105"
                  fill="url(#frostingGradient)"
                />
              </g>

              {/* Separate Cake Slice (Slides out smoothly when cut!) */}
              {step === 'cut' && (
                <g 
                  className="transition-transform duration-700 ease-out animate-[slideSliceOut_0.8s_ease-out_forwards]"
                  transform="translate(45, 15)"
                >
                  <path d="M 125,105 L 175,120 L 175,150 L 125,135 Z" fill="url(#sliceInside)" stroke="#E63956" strokeWidth="1" />
                  <path d="M 125,105 L 155,95 L 175,120 Z" fill="url(#frostingGradient)" />
                  <text x="145" y="112" fontSize="18">🍓</text>
                </g>
              )}

              {/* Sprinkles & Pearls on Cake */}
              <circle cx="80" cy="100" r="3.5" fill="#FFF" />
              <circle cx="110" cy="108" r="4" fill="#FFD166" />
              <circle cx="145" cy="104" r="3.5" fill="#FFF" />
              <circle cx="170" cy="98" r="4" fill="#FFD166" />

              {/* 3 Candles */}
              {/* Candle 1 (Left) */}
              <rect x="85" y="55" width="8" height="48" rx="3" fill="#FFF" stroke="#FF7597" strokeWidth="1.5" />
              <line x1="89" y1="48" x2="89" y2="55" stroke="#444" strokeWidth="1.5" />

              {/* Candle 2 (Center) */}
              <rect x="121" y="48" width="8" height="55" rx="3" fill="#FFF" stroke="#FFB703" strokeWidth="1.5" />
              <line x1="125" y1="41" x2="125" y2="48" stroke="#444" strokeWidth="1.5" />

              {/* Candle 3 (Right) */}
              <rect x="157" y="55" width="8" height="48" rx="3" fill="#FFF" stroke="#FF7597" strokeWidth="1.5" />
              <line x1="161" y1="48" x2="161" y2="55" stroke="#444" strokeWidth="1.5" />

              {/* Candle Flames (Flickering before blown, Smoke after) */}
              {step === 'blow' ? (
                <g filter="url(#candleGlow)" className="animate-pulse">
                  <ellipse cx="89" cy="40" rx="5" ry="10" fill="#FFD166" />
                  <ellipse cx="89" cy="42" rx="2" ry="5" fill="#FF4B72" />

                  <ellipse cx="125" cy="33" rx="5.5" ry="11" fill="#FFD166" />
                  <ellipse cx="125" cy="35" rx="2.5" ry="5.5" fill="#FF4B72" />

                  <ellipse cx="161" cy="40" rx="5" ry="10" fill="#FFD166" />
                  <ellipse cx="161" cy="42" rx="2" ry="5" fill="#FF4B72" />
                </g>
              ) : (
                <g className="animate-[fadeUpSmoke_1.5s_ease-out_forwards]">
                  <path d="M 89,45 Q 85,32 92,22" stroke="#AAA" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
                  <path d="M 125,38 Q 130,25 122,16" stroke="#AAA" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
                  <path d="M 161,45 Q 158,32 165,22" stroke="#AAA" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
                  <text x="125" y="10" fontSize="16" textAnchor="middle">✨</text>
                </g>
              )}
            </svg>
          </div>

          {/* Golden Knife for Cutting (Appears once candles are blown!) */}
          {(step === 'blown' || step === 'cutting') && (
            <div 
              onClick={handleCutCake}
              className="absolute left-1/2 -top-12 -translate-x-1/2 cursor-pointer z-30 group"
              style={{
                transform: `translate(-50%, ${knifeY}px)`,
                transition: step === 'cutting' ? 'transform 0.03s linear' : 'transform 0.3s ease-out',
              }}
            >
              <svg width="70" height="130" viewBox="0 0 70 130" className="overflow-visible filter drop-shadow-xl animate-bounce">
                <defs>
                  <linearGradient id="knifeBlade" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFF" />
                    <stop offset="60%" stopColor="#FFE082" />
                    <stop offset="100%" stopColor="#FFB300" />
                  </linearGradient>
                </defs>

                <path d="M 32,45 L 38,45 L 38,125 Q 38,128 32,122 Z" fill="url(#knifeBlade)" stroke="#FFA000" strokeWidth="1" />
                <rect x="29" y="0" width="12" height="42" rx="4" fill="#C41E3A" stroke="#FFF" strokeWidth="1" />
                <circle cx="35" cy="20" r="4" fill="#FFD166" />
                <path d="M 31,42 Q 22,55 18,65 M 39,42 Q 48,55 52,65" stroke="#FF4B72" strokeWidth="2" fill="none" />
              </svg>

              {step === 'blown' && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-600 text-white font-bold text-xs uppercase px-3.5 py-1 rounded-full shadow-lg animate-pulse">
                  Tap to Cut! 🔪
                </span>
              )}
            </div>
          )}

        </div>

        {/* Action Button after Cake is Cut -> Leads to Next Surprise (Gift Box with Earrings) */}
        {step === 'cut' && (
          <div className="mt-8 animate-fade-in flex justify-center">
            <button
              onClick={() => {
                sounds.playSparkle();
                sounds.playWhoosh();
                if (onComplete) onComplete();
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF4B72] to-[#E62248] text-white font-semibold text-sm md:text-base tracking-wide shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Open Your Next Surprise</span>
              <span className="whitespace-nowrap">🎁 →</span>
            </button>
          </div>
        )}

      </div>

      <style>{`
        @keyframes slideSliceOut {
          0% { transform: translate(0, 0); }
          100% { transform: translate(32px, 14px); }
        }
      `}</style>
    </div>
  );
}
