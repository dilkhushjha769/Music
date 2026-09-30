import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import sounds from '../audio/soundEffects';

export default function HeartPullScene({ onComplete, girlfriendName = 'Nonsense 🙃' }) {
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const [hasExploded, setHasExploded] = useState(false);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [heartShards, setHeartShards] = useState([]);
  const [pullProgress, setPullProgress] = useState(0);
  const [petals, setPetals] = useState([]);

  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const animFrameRef = useRef(null);
  const lastSoundTimeRef = useRef(0);
  const dragContainerRef = useRef(null);
  const hasMovedRef = useRef(false);

  const MAX_DRAG = 160;
  const TRIGGER_THRESHOLD = 36;

  const unlockAudio = () => {
    sounds.init();
  };

  // Generate floating falling rose petals after heart burst
  const spawnPrettyPetals = () => {
    const newPetals = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      y: -10,
      size: Math.random() * 12 + 14,
      dur: Math.random() * 3 + 3.5,
      delay: Math.random() * 2,
      rot: Math.random() * 360,
      emoji: ['🌸', '✨', '💖', '🎀', '⭐'][Math.floor(Math.random() * 5)],
    }));
    setPetals(newPetals);
  };

  // Shatter / Explode heart into flying fragments
  const explodeHeart = () => {
    setHasExploded(true);
    sounds.playPop();
    sounds.playHeartbeat();
    sounds.playSparkle();
    sounds.playConfetti();
    sounds.startBackgroundMusic();
    spawnPrettyPetals();

    // 28 glowing flying pieces
    const shards = Array.from({ length: 28 }).map((_, i) => {
      const angle = (i / 28) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 240 + 130;
      return {
        id: i,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        rot: (Math.random() - 0.5) * 360,
        emoji: ['❤️', '💖', '💕', '✨', '🌸', '💘', '⭐', '🎂'][Math.floor(Math.random() * 8)],
        size: Math.random() * 18 + 18,
      };
    });
    setHeartShards(shards);

    // Multi-stage grand celebration confetti
    confetti({
      particleCount: 90,
      spread: 110,
      origin: { y: 0.45, x: 0.5 },
      colors: ['#FF4B72', '#FF8FA3', '#FFD166', '#FFFFFF', '#F72585', '#9D4EDD'],
      ticks: 260,
      gravity: 0.6,
      scalar: 1.25,
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 140,
        origin: { y: 0.42, x: 0.5 },
        colors: ['#FF1493', '#FFA07A', '#FFD700', '#FFFFFF'],
        ticks: 200,
        gravity: 0.45,
        scalar: 0.95,
      });
    }, 200);
  };

  // High-energy snap back & heart burst
  const triggerSnapAndBurst = useCallback((initialY) => {
    if (isBursting) return;
    setIsBursting(true);
    setIsDragging(false);

    sounds.playBoing();
    sounds.playWhoosh();

    let y = initialY;
    let v = -26;
    const k = 0.48;
    const c = 0.72;
    let hasSnapped = false;

    const step = () => {
      const f = -k * y;
      v = (v + f) * c;
      y = y + v;

      if (y <= 4 && !hasSnapped) {
        hasSnapped = true;
        setOffsetY(0);
        setScale({ x: 1.6, y: 1.6 });

        setTimeout(() => {
          explodeHeart();
        }, 160);

        return;
      }

      setOffsetY(Math.max(0, y));
      const stretchFactor = Math.max(0, y) / MAX_DRAG;
      setScale({
        x: 1 - stretchFactor * 0.15,
        y: 1 + stretchFactor * 0.3,
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [isBursting]);

  const springReturn = (initialY) => {
    let y = initialY;
    let v = -10;
    const k = 0.32;
    const c = 0.75;

    sounds.playBoing();

    const step = () => {
      const f = -k * y;
      v = (v + f) * c;
      y = y + v;

      if (Math.abs(y) < 0.6 && Math.abs(v) < 0.3) {
        setOffsetY(0);
        setScale({ x: 1, y: 1 });
        currentYRef.current = 0;
        setPullProgress(0);
        return;
      }

      setOffsetY(Math.max(0, y));
      const stretchFactor = Math.max(0, y) / MAX_DRAG;
      setScale({
        x: 1 - stretchFactor * 0.18,
        y: 1 + stretchFactor * 0.3,
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  const handlePointerDown = (e) => {
    if (isBursting || hasExploded) return;
    unlockAudio();
    sounds.playTap();

    setIsDragging(true);
    hasMovedRef.current = false;
    startYRef.current = e.clientY - currentYRef.current;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isBursting || hasExploded) return;

    const rawDelta = e.clientY - startYRef.current;
    if (rawDelta > 4) {
      hasMovedRef.current = true;
    }

    if (rawDelta > 0) {
      const clampedY = Math.min(rawDelta * 0.85, MAX_DRAG);
      currentYRef.current = clampedY;
      setOffsetY(clampedY);

      const progress = clampedY / MAX_DRAG;
      setPullProgress(progress);

      setScale({
        x: 1 - progress * 0.22,
        y: 1 + progress * 0.45,
      });

      const now = Date.now();
      if (now - lastSoundTimeRef.current > 100) {
        sounds.playStretch(progress);
        lastSoundTimeRef.current = now;
      }
    } else {
      currentYRef.current = 0;
      setOffsetY(0);
      setScale({ x: 1, y: 1 });
      setPullProgress(0);
    }
  };

  const handlePointerUp = (e) => {
    if (!isDragging || isBursting || hasExploded) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}

    const releasedDistance = currentYRef.current;

    if (!hasMovedRef.current) {
      autoPullAndRelease();
    } else if (releasedDistance >= TRIGGER_THRESHOLD) {
      triggerSnapAndBurst(releasedDistance);
    } else {
      springReturn(releasedDistance);
    }
  };

  const autoPullAndRelease = () => {
    if (isBursting || hasExploded) return;
    sounds.playStretch(0.6);

    let progress = 0;
    const targetY = 95;

    const pullStep = () => {
      progress += 0.12;
      const curY = targetY * Math.sin((progress * Math.PI) / 2);
      setOffsetY(curY);
      setScale({
        x: 1 - (curY / MAX_DRAG) * 0.2,
        y: 1 + (curY / MAX_DRAG) * 0.4,
      });

      if (progress < 1) {
        requestAnimationFrame(pullStep);
      } else {
        setTimeout(() => {
          triggerSnapAndBurst(targetY);
        }, 120);
      }
    };

    requestAnimationFrame(pullStep);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const stringLength = 70 + offsetY;
  const stringSag = isDragging ? offsetY * 0.2 : 0;
  const isReadyToRelease = offsetY >= TRIGGER_THRESHOLD;

  return (
    <div 
      className="relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] select-none overflow-hidden px-4 touch-none"
      onClick={unlockAudio}
    >
      {/* Soft romantic ambient background warmth */}
      <div 
        className="absolute w-[550px] h-[550px] rounded-full pointer-events-none transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(255, 182, 193, 0.35) 0%, rgba(255, 235, 238, 0.18) 50%, transparent 75%)',
          transform: `translateY(${offsetY * 0.35}px) scale(${1 + offsetY * 0.002})`,
        }}
      />

      {/* Floating Petals / Sparkles Animation across the screen */}
      {hasExploded && petals.map((p) => (
        <span
          key={p.id}
          className="fixed pointer-events-none z-20 animate-[floatPetalFall_4.5s_linear_infinite]"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            transform: `rotate(${p.rot}deg)`,
            opacity: 0.8,
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Main Interactive Stage */}
      <div className="relative flex flex-col items-center z-10 w-full max-w-lg">
        
        {/* SHATTERED HEART FLYING PIECES */}
        {hasExploded && heartShards.map((s) => (
          <span
            key={s.id}
            className="absolute pointer-events-none z-30 transition-all duration-1000 ease-out"
            style={{
              left: '50%',
              top: '40%',
              transform: `translate(${s.dx}px, ${s.dy}px) rotate(${s.rot}deg)`,
              fontSize: `${s.size}px`,
              opacity: 0,
              filter: 'drop-shadow(0 4px 10px rgba(255, 60, 100, 0.5))',
            }}
          >
            {s.emoji}
          </span>
        ))}

        {/* 1. HEART BEFORE EXPLOSION */}
        {!hasExploded ? (
          <div 
            ref={dragContainerRef}
            className="relative cursor-grab active:cursor-grabbing touch-none select-none p-4"
            style={{
              transform: `translateY(${offsetY}px)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* 3D Glossy Inflated Heart SVG */}
            <div 
              className={`transition-transform duration-75 ${!isDragging && !isBursting ? 'animate-romantic-float' : ''}`}
              style={{
                transform: `scale(${scale.x}, ${scale.y})`,
                transformOrigin: '50% 90%',
              }}
            >
              <svg
                width="170"
                height="160"
                viewBox="0 0 170 160"
                className={`overflow-visible transition-all duration-300 ${
                  isDragging ? 'heart-glow-active' : 'heart-glow'
                }`}
              >
                <defs>
                  <radialGradient id="heartRadialGrad" cx="38%" cy="32%" r="68%">
                    <stop offset="0%" stopColor="#FFA6B8" />
                    <stop offset="25%" stopColor="#FF4B72" />
                    <stop offset="68%" stopColor="#E61E4A" />
                    <stop offset="92%" stopColor="#B80E34" />
                    <stop offset="100%" stopColor="#8A0825" />
                  </radialGradient>

                  <linearGradient id="rimLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.75)" />
                    <stop offset="40%" stopColor="rgba(255, 200, 215, 0.25)" />
                    <stop offset="100%" stopColor="rgba(180, 20, 50, 0.4)" />
                  </linearGradient>

                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" />
                  </filter>
                </defs>

                <path
                  d="M 85,152 
                     C 72,138 22,96 10,60 
                     C 0,30 20,4 52,4 
                     C 68,4 78,14 85,25 
                     C 92,14 102,4 118,4 
                     C 150,4 170,30 160,60 
                     C 148,96 98,138 85,152 Z"
                  fill="url(#heartRadialGrad)"
                  stroke="url(#rimLightGrad)"
                  strokeWidth="1.2"
                />

                <ellipse
                  cx="52"
                  cy="32"
                  rx="22"
                  ry="13"
                  transform="rotate(-26 52 32)"
                  fill="white"
                  opacity="0.7"
                  filter="url(#softGlow)"
                />

                <path
                  d="M 36,44 C 33,35 40,24 55,22"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.9)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />

                <ellipse
                  cx="116"
                  cy="34"
                  rx="12"
                  ry="7"
                  transform="rotate(22 116 34)"
                  fill="white"
                  opacity="0.35"
                  filter="url(#softGlow)"
                />
              </svg>
            </div>

            {/* Hand-drawn Elastic Spring String */}
            <div className="absolute top-[160px] left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing">
              <svg 
                width="80" 
                height={stringLength + 55} 
                viewBox={`0 0 80 ${stringLength + 55}`} 
                className="overflow-visible"
              >
                <path
                  d={`M 40,0 Q ${40 + stringSag},${stringLength * 0.5} 40,${stringLength}`}
                  fill="none"
                  stroke="#D48A98"
                  strokeWidth={Math.max(1.6, 2.8 - (offsetY / MAX_DRAG) * 1.1)}
                  strokeDasharray={isDragging ? 'none' : '3 2'}
                  strokeLinecap="round"
                />

                <circle cx="40" cy="2" r="3.5" fill="#E62248" />

                <g transform={`translate(40, ${stringLength})`}>
                  <circle cx="0" cy="0" r="26" fill="transparent" />
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="9" 
                    fill={isReadyToRelease ? '#FF4B72' : '#FFF7FA'} 
                    stroke="#E62248" 
                    strokeWidth="2.5" 
                    className="drop-shadow-md transition-colors"
                  />
                  <circle cx="0" cy="0" r="3.5" fill={isReadyToRelease ? '#FFF' : '#FF4B72'} />
                  
                  <path
                    d="M -3,6 Q -7,16 -3,22 M 3,6 Q 7,16 3,22"
                    stroke="#E62248"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
          </div>
        ) : (
          /* 2. ULTRA-PRETTY, ANIMATED HAPPY BIRTHDAY ANGEL REVEAL AFTER HEART BURST */
          <div className="relative animate-[scaleUpPretty_0.7s_cubic-bezier(0.16,1,0.3,1)_forwards] flex flex-col items-center text-center glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-white/90 my-6 max-w-md w-full overflow-hidden">
            
            {/* Shimmering top decorative halo */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-200/35 rounded-full blur-2xl pointer-events-none" />

            {/* Floating Cute Animated Cupcake / Crown */}
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF6B8B] to-[#FFD166] flex items-center justify-center text-3xl shadow-lg shadow-rose-400/30 animate-romantic-float">
                👑
              </div>
              <span className="absolute -top-1 -right-2 text-xl animate-spin text-amber-400">
                ✨
              </span>
            </div>

            {/* Glowing celebratory badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-100/90 to-pink-100/90 border border-rose-300/70 text-[#C42E4B] text-xs font-bold uppercase tracking-[0.28em] mb-3 shadow-sm animate-pulse">
              <span>💖</span>
              <span>SPECIAL SURPRISE</span>
              <span>🎂</span>
            </div>

            {/* Glowing Calligraphy Title for Nonsense 🙃 */}
            <h1 className="text-3xl md:text-5xl font-serif text-[#2B141C] font-normal leading-tight">
              Happy Birthday, <br />
              <span className="font-script text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#E62248] via-[#FF4B72] to-[#FF8FA3] block mt-1 filter drop-shadow">
                {girlfriendName}!
              </span>
            </h1>

            {/* Sweet Birthday Wish */}
            <p className="font-serif italic text-base md:text-lg text-[#5E3844] mt-4 max-w-xs mx-auto leading-relaxed">
              "My heart burst with all the infinite love and adoration I hold for you. Happy Birthday, Nonsense 🙃! ✨❤️"
            </p>

            {/* Cute Little Birthday Wish Accents */}
            <div className="mt-4 flex items-center justify-center gap-3 text-lg opacity-85">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>🌸</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎀</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>✨</span>
              <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🧁</span>
              <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>💖</span>
            </div>

            {/* Smooth Continue Button to Cake */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  sounds.playSparkle();
                  sounds.playWhoosh();
                  if (onComplete) onComplete();
                }}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF4B72] to-[#E62248] text-white font-medium text-sm md:text-base tracking-wide shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                <span>Make a Wish &amp; Cut The Cake</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300 whitespace-nowrap">🎂 →</span>
              </button>
            </div>

          </div>
        )}

        {/* Elegant "PULL & RELEASE" instruction text (Only before explosion) */}
        {!hasExploded && (
          <div 
            className="mt-40 flex flex-col items-center gap-2 transition-all duration-300"
            style={{
              transform: `translateY(${offsetY * 0.25}px)`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#D48A98]" />
              <p className={`text-[12px] md:text-[13px] font-semibold tracking-[0.32em] uppercase font-sans transition-colors ${
                isReadyToRelease ? 'text-[#E62248] scale-105' : 'text-[#A66E7A]'
              }`}>
                {isReadyToRelease ? 'RELEASE TO BURST! 💥' : 'PULL & RELEASE'}
              </p>
              <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#D48A98]" />
            </div>

            <p className="text-[14px] text-[#C48895] font-playful animate-pulse-slow">
              {isReadyToRelease ? 'Let go to release the love 💕' : 'Pull down the heart to reveal the magic... ✨'}
            </p>

            <div className={`transition-all duration-300 ${isReadyToRelease ? 'rotate-180 text-[#E62248]' : 'animate-bounce text-[#D48A98]'} text-sm`}>
              ↓
            </div>
          </div>
        )}

      </div>

      {/* Delicate floating ambient ring */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        <div className="w-[320px] h-[320px] rounded-full border border-pink-200/35 border-dashed animate-[spin_60s_linear_infinite]" />
      </div>

      <style>{`
        @keyframes scaleUpPretty {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes floatPetalFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          90% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(105vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
