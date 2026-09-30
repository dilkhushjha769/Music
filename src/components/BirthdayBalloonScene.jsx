import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import sounds from '../audio/soundEffects';

const INITIAL_BALLOONS = [
  { id: 1, color: '#FF6B8B', highlight: '#FFA3B5', text: 'Prettiest Smile 🥰', x: 18, y: 35, delay: 0 },
  { id: 2, color: '#FFB703', highlight: '#FFE066', text: 'My Sunshine ☀️', x: 38, y: 22, delay: 0.8 },
  { id: 3, color: '#E63956', highlight: '#FF7597', text: 'Pure Magic ✨', x: 62, y: 28, delay: 0.4 },
  { id: 4, color: '#B5838D', highlight: '#DDBEA9', text: 'Gentlest Heart 🧸', x: 82, y: 36, delay: 1.2 },
  { id: 5, color: '#FF85A1', highlight: '#FFCAD4', text: 'My Whole World 🌎', x: 28, y: 52, delay: 0.6 },
  { id: 6, color: '#F72585', highlight: '#B5179E', text: 'Forever & Always 💍', x: 72, y: 50, delay: 1.0 },
];

export default function BirthdayBalloonScene({ onComplete, girlfriendName = 'My Love' }) {
  const [balloons, setBalloons] = useState(INITIAL_BALLOONS);
  const [poppedCount, setPoppedCount] = useState(0);
  const [isWishRevealed, setIsWishRevealed] = useState(false);
  const [floatingNotes, setFloatingNotes] = useState([]);

  // Handle popping a balloon
  const handlePopBalloon = (balloon, e) => {
    e.stopPropagation();
    sounds.playBalloonPop();
    sounds.playSparkle();

    const rect = e.currentTarget.getBoundingClientRect();
    const newNote = {
      id: Date.now(),
      text: balloon.text,
      x: rect.left + rect.width / 2,
      y: rect.top,
    };
    setFloatingNotes((prev) => [...prev, newNote]);

    // Canvas confetti sparkle
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
      colors: [balloon.color, balloon.highlight, '#FFFFFF', '#FFD166'],
      ticks: 140,
      gravity: 0.6,
      scalar: 1,
    });

    const remainingBalloons = balloons.filter((b) => b.id !== balloon.id);
    setBalloons(remainingBalloons);
    const nextCount = poppedCount + 1;
    setPoppedCount(nextCount);

    // When all balloons are popped
    if (remainingBalloons.length === 0) {
      setTimeout(() => {
        revealBirthdayWish();
      }, 500);
    }
  };

  const revealBirthdayWish = () => {
    setIsWishRevealed(true);
    sounds.startHappyBirthdaySong();
    sounds.playConfetti();

    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.45, x: 0.5 },
      colors: ['#FF4B72', '#FFD166', '#FF85A1', '#7209B7', '#4CC9F0', '#FFFFFF'],
      ticks: 280,
      gravity: 0.7,
      scalar: 1.2,
    });
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF5F7] via-[#FAF7F2] to-[#FFF0F5] px-4 py-8 select-none overflow-hidden">
      
      {/* Ambient twilight / celebration warm aura */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-pink-200/40 via-amber-100/30 to-purple-100/25 rounded-full blur-3xl pointer-events-none" />

      {/* Floating text messages from popped balloons */}
      {floatingNotes.map((note) => (
        <span
          key={note.id}
          className="fixed pointer-events-none z-50 px-3.5 py-2 rounded-full bg-white/95 border border-rose-200 text-[#C42E4B] font-semibold text-xs md:text-sm shadow-lg animate-[floatTextUp_1.8s_ease-out_forwards]"
          style={{
            left: `${note.x}px`,
            top: `${note.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {note.text}
        </span>
      ))}

      {/* BALLOON POPPING STAGE */}
      {!isWishRevealed ? (
        <div className="relative z-10 w-full max-w-xl flex flex-col items-center min-h-[560px]">
          
          {/* Header instructions */}
          <div className="text-center mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/70 text-[#C44D68] text-xs font-semibold uppercase tracking-[0.25em] shadow-sm mb-2">
              Birthday Surprise 🎈
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#382229]">
              Pop All Balloons For <span className="text-[#E62248] italic">{girlfriendName}</span>!
            </h2>
            <p className="text-xs md:text-sm text-[#8A5A66] font-playful text-lg mt-1">
              Tap each balloon to release your birthday secret ({poppedCount}/{INITIAL_BALLOONS.length})
            </p>
          </div>

          {/* Floating Balloons Field */}
          <div className="relative w-full h-[400px] sm:h-[440px]">
            {balloons.map((b) => (
              <div
                key={b.id}
                onClick={(e) => handlePopBalloon(b, e)}
                className="absolute cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 group"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: `balloonBob 4s ease-in-out ${b.delay}s infinite alternate`,
                }}
              >
                {/* SVG 3D Balloon */}
                <svg width="95" height="150" viewBox="0 0 95 150" className="overflow-visible filter drop-shadow-md">
                  <defs>
                    <radialGradient id={`balloonGrad-${b.id}`} cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor={b.highlight} />
                      <stop offset="60%" stopColor={b.color} />
                      <stop offset="100%" stopColor="#4A0515" />
                    </radialGradient>
                  </defs>

                  <ellipse 
                    cx="47" 
                    cy="48" 
                    rx="42" 
                    ry="48" 
                    fill={`url(#balloonGrad-${b.id})`} 
                  />

                  <ellipse 
                    cx="32" 
                    cy="30" 
                    rx="12" 
                    ry="7" 
                    transform="rotate(-30 32 30)" 
                    fill="white" 
                    opacity="0.65" 
                  />

                  <polygon points="43,96 51,96 54,101 40,101" fill={b.color} />

                  <path
                    d="M 47,101 Q 54,115 42,128 T 49,150"
                    fill="none"
                    stroke="#C48A96"
                    strokeWidth="1.4"
                    strokeDasharray="3 2"
                  />
                </svg>

                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase font-bold tracking-wider text-rose-500 bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
                  POP!
                </span>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* GRAND BIRTHDAY WISH REVEAL AFTER BALLOONS */
        <div className="relative z-10 w-full max-w-lg glass-card rounded-3xl p-6 md:p-10 text-center shadow-2xl border border-white/80 animate-[scaleUp_0.4s_ease-out]">
          
          {/* Song indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-[#C48008] text-xs font-semibold uppercase tracking-widest mb-4 shadow-sm animate-bounce">
            <span>🎶</span>
            <span>Happy Birthday Music Box...</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif text-[#3D1E28] font-normal leading-tight">
            Happy Birthday, <br />
            <span className="text-[#E62248] font-script text-6xl md:text-7xl block mt-1">
              {girlfriendName}!
            </span>
          </h1>

          <p className="text-sm md:text-base text-[#6B4B54] font-serif italic mt-4 mb-6 max-w-md mx-auto leading-relaxed">
            "Every balloon held a piece of why you mean the entire world to me. May your birthday be as luminous, wonderful, and extraordinary as you are! 💖✨"
          </p>

          <div className="mt-8">
            <button
              onClick={() => {
                sounds.playSparkle();
                sounds.playWhoosh();
                if (onComplete) onComplete();
              }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF4B72] to-[#E62248] text-white font-medium text-sm md:text-base tracking-wide shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Bring Out The Birthday Cake 🎂 →
            </button>
          </div>

        </div>
      )}

      <style>{`
        @keyframes balloonBob {
          0% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
          50% { transform: translate(-50%, -50%) translateY(-18px) rotate(3deg); }
          100% { transform: translate(-50%, -50%) translateY(-32px) rotate(-3deg); }
        }
        @keyframes floatTextUp {
          0% { opacity: 1; transform: translate(-50%, 0) scale(0.9); }
          100% { opacity: 0; transform: translate(-50%, -80px) scale(1.15); }
        }
      `}</style>
    </div>
  );
}
