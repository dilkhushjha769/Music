import React, { useState, useEffect } from 'react';
import sounds from '../audio/soundEffects';

export default function MessageRevealScene({ onComplete, girlfriendName = 'My Love' }) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const messages = [
    `For the most special person in my life, ${girlfriendName} ❤️`,
    "You make my ordinary days feel extraordinary. ✨",
    "I made this little world just for you. 💕"
  ];

  useEffect(() => {
    let charIndex = 0;
    const currentFullText = messages[currentLineIndex];
    setDisplayedText('');
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (charIndex < currentFullText.length) {
        setDisplayedText(currentFullText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        sounds.playSparkle();

        // If not the last line, wait and advance to next line after 1.6s
        if (currentLineIndex < messages.length - 1) {
          setTimeout(() => {
            setCurrentLineIndex((prev) => prev + 1);
          }, 1800);
        }
      }
    }, 42);

    return () => clearInterval(typeInterval);
  }, [currentLineIndex]);

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] px-6 select-none overflow-hidden">
      
      {/* Soft romantic backdrop lighting */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-b from-rose-100/50 via-pink-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Romantic Card Container */}
      <div className="relative z-10 max-w-lg w-full glass-card rounded-3xl p-8 md:p-12 text-center shadow-xl border border-white/80">
        
        {/* Cute top badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50/90 border border-rose-200/50 text-[#C44D68] text-xs font-medium tracking-widest uppercase mb-8 shadow-sm">
          <span>💌</span>
          <span>From My Heart</span>
        </div>

        {/* Display previous lines with elegant soft faded appearance */}
        <div className="space-y-4 min-h-[140px] flex flex-col justify-center">
          {messages.slice(0, currentLineIndex).map((line, idx) => (
            <p 
              key={idx} 
              className="text-lg md:text-xl font-serif text-[#6B4B54] transition-all duration-700 ease-out opacity-75"
            >
              {line}
            </p>
          ))}

          {/* Current typing line */}
          <div className="min-h-[50px] flex items-center justify-center">
            <h2 className="text-xl md:text-2xl font-serif text-[#3B1E28] font-normal leading-relaxed">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-[2px] h-6 bg-[#E63956] ml-1 animate-pulse align-middle" />
              )}
            </h2>
          </div>
        </div>

        {/* Continue button appears once all lines are revealed */}
        <div 
          className={`mt-10 transition-all duration-700 ease-out ${
            currentLineIndex === messages.length - 1 && !isTyping 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 pointer-events-none translate-y-4'
          }`}
        >
          <button
            onClick={() => {
              sounds.playTap();
              sounds.playWhoosh();
              if (onComplete) onComplete();
            }}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF4B72] to-[#E62248] text-white font-medium text-sm md:text-base tracking-wide shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span>Our Memories Await</span>
            <span className="group-hover:translate-x-1 transition-transform">✨</span>
          </button>
        </div>

        {/* Decorative corner ribbons/stamps */}
        <div className="absolute top-4 right-4 text-xs font-handwriting text-rose-300">
          with love ♡
        </div>
      </div>

      {/* Floating gentle particles */}
      <div className="absolute bottom-10 text-xs text-[#A67E88] font-sans tracking-widest uppercase opacity-70">
        Chapter 02 · Whispers
      </div>
    </div>
  );
}
