import React, { useState } from 'react';
import sounds from '../audio/soundEffects';

const GIRLFRIEND_MEMORIES = [
  {
    id: 1,
    tag: 'Favorite Smiles 💕',
    title: 'Your Playful Pout & Glow',
    date: 'Pure Happiness',
    photoUrl: '/photos/gf_photo1.jpg',
    note: 'Every single expression you make is my absolute favorite. Seeing your cute smile and silly poses is the easiest way to make my entire day beautiful.',
    bgColor: 'from-rose-100/70 to-pink-100/70',
    accent: '#E63956',
  },
  {
    id: 2,
    tag: 'Vintage Sweetheart ✌️',
    title: 'Peace & Cute Vibes',
    date: 'Retro Film Memories',
    photoUrl: '/photos/gf_photo2.jpg',
    note: 'You have that effortless, timeless charm. Flashing peace signs and giving me that sweet look—I could look at this picture for hours.',
    bgColor: 'from-purple-100/60 to-pink-100/60',
    accent: '#9D4EDD',
  },
  {
    id: 3,
    tag: 'Golden Hour Sunshine ☀️',
    title: 'Radiant Royalty',
    date: 'Our Beautiful Day',
    photoUrl: '/photos/gf_photo3.jpg',
    note: 'Sitting under the golden sunlight by the palace arches, looking so graceful and calm. You shine brighter than any sunlight in the world.',
    bgColor: 'from-amber-100/70 to-orange-100/60',
    accent: '#D48C46',
  },
  {
    id: 4,
    tag: 'Gentlest Soul 🌸',
    title: 'That Precious Gaze',
    date: 'Stole My Heart',
    photoUrl: '/photos/gf_photo4.jpg',
    note: 'Your eyes hold so much kindness, warmth, and peace. Looking at you always reminds me that I found my home in you.',
    bgColor: 'from-blue-100/60 to-indigo-100/60',
    accent: '#4361EE',
  },
  {
    id: 5,
    tag: 'My Real Angel 👑',
    title: 'Most Gorgeous Princess',
    date: 'Forever & Always',
    photoUrl: '/photos/gf_photo5.jpg',
    note: 'Dressed like a dream, radiant like an angel. Loving you is the greatest privilege of my life, and I will cherish you endlessly.',
    bgColor: 'from-rose-100/80 to-amber-100/70',
    accent: '#FF4B72',
  },
];

export default function MemoriesScene({
  onComplete,
  girlfriendName = 'My Love',
  specialDate = 'Happy Birthday',
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    sounds.playTap();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNext = () => {
    sounds.playWhoosh();
    sounds.playTap();
    if (activeIndex < GIRLFRIEND_MEMORIES.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handlePrev = () => {
    sounds.playWhoosh();
    sounds.playTap();
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const currentMem = GIRLFRIEND_MEMORIES[activeIndex];
  const isFlipped = !!flippedCards[currentMem.id];

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] px-4 py-8 select-none overflow-hidden">
      
      {/* Background radial warmth */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-pink-100/40 via-rose-50/30 to-amber-50/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center mb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50/90 border border-rose-200/50 text-[#C44D68] text-xs font-semibold tracking-widest uppercase mb-1.5 shadow-sm">
          <span>📸</span>
          <span>{specialDate || 'Our Story'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-[#382229]">
          Memories of <span className="text-[#E62248] italic">{girlfriendName}</span>
        </h2>
        <p className="text-xs md:text-sm text-[#8A646E] font-handwriting text-lg mt-0.5">
          (Tap the photo to read my secret note ♡)
        </p>
      </div>

      {/* Interactive Polaroid Card Stage */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        
        {/* The Flip Card */}
        <div 
          onClick={() => toggleFlip(currentMem.id)}
          className="relative w-[300px] md:w-[330px] h-[430px] cursor-pointer group transition-all duration-300"
          style={{ perspective: '1000px' }}
        >
          <div 
            className="w-full h-full relative transition-transform duration-700 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* FRONT OF POLAROID */}
            <div 
              className="absolute inset-0 w-full h-full bg-white rounded-2xl p-4 flex flex-col justify-between polaroid-shadow border border-rose-100/70"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Photo Area displaying real uploaded picture */}
              <div className={`w-full h-[300px] rounded-xl bg-gradient-to-br ${currentMem.bgColor} relative overflow-hidden shadow-inner border border-white/60`}>
                <img
                  src={currentMem.photoUrl}
                  alt={currentMem.title}
                  className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating Tag */}
                <div className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider text-white bg-black/45 px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
                  {currentMem.tag}
                </div>

                {/* Heart Stamp */}
                <div className="absolute top-3 right-3 text-sm filter drop-shadow">
                  ❤️
                </div>
              </div>

              {/* Polaroid Caption Area */}
              <div className="pt-2 text-center pb-1">
                <h3 className="font-serif text-lg text-[#2E181F] font-medium tracking-tight">
                  {currentMem.title}
                </h3>
                <p className="text-xs text-[#B57C89] font-handwriting text-base flex items-center justify-center gap-1 mt-0.5">
                  <span>tap to read my note</span>
                  <span>↺</span>
                </p>
              </div>
            </div>

            {/* BACK OF POLAROID (Secret Handwritten Love Note) */}
            <div 
              className="absolute inset-0 w-full h-full bg-[#FFFDF9] rounded-2xl p-6 flex flex-col justify-between polaroid-shadow border border-rose-200/80"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              {/* Little cute washi tape on top */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-rose-200/80 rotate-[-1.5deg] rounded-sm shadow-sm" />

              <div>
                <div className="flex justify-between items-center border-b border-rose-100 pb-2 mb-3">
                  <span className="font-handwriting text-2xl text-[#E63956] font-bold">
                    For {girlfriendName} ♡
                  </span>
                  <span className="text-xs text-rose-300">★ ★ ★</span>
                </div>

                <p className="font-handwriting text-2xl md:text-3xl text-[#4A2D35] leading-relaxed">
                  "{currentMem.note}"
                </p>
              </div>

              <div className="border-t border-rose-100 pt-3 flex justify-between items-center text-xs font-handwriting text-rose-400">
                <span>loving you endlessly</span>
                <span className="text-sm">❤️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center justify-between w-full mt-4 px-4">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className={`p-3 rounded-full glass-card border border-rose-200/50 text-[#8A4A58] transition-all duration-200 ${
              activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95 cursor-pointer shadow-md'
            }`}
          >
            ←
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {GIRLFRIEND_MEMORIES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.playTap();
                  setActiveIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full ${
                  idx === activeIndex 
                    ? 'w-7 h-2 bg-[#E62248]' 
                    : 'w-2 h-2 bg-rose-200 hover:bg-rose-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-gradient-to-r from-[#FF4B72] to-[#E62248] text-white hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-md shadow-rose-500/25"
          >
            {activeIndex === GIRLFRIEND_MEMORIES.length - 1 ? '💌' : '→'}
          </button>
        </div>

        {/* Next Scene Button if on last card */}
        {activeIndex === GIRLFRIEND_MEMORIES.length - 1 && (
          <div className="mt-4 animate-fade-in">
            <button
              onClick={() => {
                sounds.playSparkle();
                sounds.playWhoosh();
                if (onComplete) onComplete();
              }}
              className="px-6 py-2.5 rounded-full bg-white/95 border border-rose-200 text-[#C43854] text-xs uppercase tracking-widest font-semibold shadow-sm hover:shadow-md hover:bg-rose-50 transition-all cursor-pointer"
            >
              Continue To Final Love Letter →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
