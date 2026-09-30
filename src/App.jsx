import React, { useState, useEffect } from 'react';
import BackgroundEmojis from './components/BackgroundEmojis';
import LightPullerScene from './components/LightPullerScene';
import HeartPullScene from './components/HeartPullScene';
import GiftBoxScene from './components/GiftBoxScene';
import BirthdayBalloonScene from './components/BirthdayBalloonScene';
import BirthdayCakeScene from './components/BirthdayCakeScene';
import MessageRevealScene from './components/MessageRevealScene';
import MemoriesScene from './components/MemoriesScene';
import FinalScene from './components/FinalScene';
import MusicToggle from './components/MusicToggle';
import PersonalizeModal from './components/PersonalizeModal';
import sounds from './audio/soundEffects';

export default function App() {
  // Current active scene: 
  // 0: Lights Off Puller, 1: Heart, 2: Gift, 3: Balloons, 4: Cake (Blow & Cut), 5: Message, 6: Memories, 7: Final
  const [currentScene, setCurrentScene] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Personalized configuration with Angel as default
  const [personalData, setPersonalData] = useState({
    girlfriendName: 'Angel',
    specialDate: 'Happy Birthday Angel 🎂',
    personalMessage: 'No matter how many websites I build, this one will always be my favorite. Happy Birthday, Angel, my whole heart! ❤️',
  });

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get('name');
      const urlDate = params.get('date');
      const urlMsg = params.get('msg');

      const saved = localStorage.getItem('romantic_gift_data');
      let baseData = saved ? JSON.parse(saved) : {
        girlfriendName: 'Angel',
        specialDate: 'Happy Birthday Angel 🎂',
        personalMessage: 'No matter how many websites I build, this one will always be my favorite. Happy Birthday, Angel, my whole heart! ❤️',
      };

      // Always prefer Angel if previous default was Sophia
      if (!saved || baseData.girlfriendName === 'Sophia') {
        baseData.girlfriendName = 'Angel';
      }

      if (urlName) baseData.girlfriendName = urlName;
      if (urlDate) baseData.specialDate = urlDate;
      if (urlMsg) baseData.personalMessage = urlMsg;

      setPersonalData(baseData);
    } catch (e) {
      console.warn('Config load error:', e);
    }
  }, []);

  const handleSavePersonalData = (newData) => {
    setPersonalData(newData);
    try {
      localStorage.setItem('romantic_gift_data', JSON.stringify(newData));
    } catch (e) {
      console.warn(e);
    }
  };

  const advanceScene = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScene((prev) => Math.min(prev + 1, 7));
      setIsTransitioning(false);
    }, 450);
  };

  const jumpToScene = (sceneIndex) => {
    sounds.playTap();
    sounds.playWhoosh();
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScene(sceneIndex);
      setIsTransitioning(false);
    }, 300);
  };

  const sceneIcons = ['💡', '❤️', '🎁', '🎈', '🎂', '💌', '📸', '✨'];

  return (
    <div className="relative w-full min-h-screen bg-[#FAF7F2] text-[#3D262C] overflow-hidden select-none font-sans">
      
      {/* Ambient floating romantic emojis (subtle during dark scene) */}
      {currentScene > 0 && (
        <BackgroundEmojis intensity={currentScene === 7 ? 'subtle' : 'normal'} />
      )}

      {/* Floating Audio Toggle at top right */}
      <MusicToggle />

      {/* Top Left Mini Controls: Personalize & Step Indicators */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <button
          onClick={() => {
            sounds.playTap();
            setIsSettingsOpen(true);
          }}
          title="Personalize names & birthday date"
          className="w-9 h-9 rounded-full glass-card border border-rose-200/60 shadow-sm hover:shadow-md flex items-center justify-center text-sm text-[#8A4A58] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          ✏️
        </button>

        {/* Small scene progress dots */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card border border-rose-200/50 shadow-sm">
          {sceneIcons.map((icon, idx) => (
            <button
              key={idx}
              onClick={() => jumpToScene(idx)}
              title={`Jump to Scene ${idx + 1}`}
              className={`text-xs px-1.5 py-0.5 rounded-full transition-all cursor-pointer ${
                idx === currentScene 
                  ? 'bg-rose-200 text-[#C42E4B] scale-110 font-bold' 
                  : 'text-rose-400/60 hover:text-rose-500'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Scene Render Stage with smooth transitions */}
      <div 
        className={`w-full min-h-screen transition-all duration-500 ease-in-out ${
          isTransitioning ? 'opacity-0 scale-[0.98] blur-[1px]' : 'opacity-100 scale-100 blur-0'
        }`}
      >
        {currentScene === 0 && (
          <LightPullerScene 
            girlfriendName={personalData.girlfriendName} 
            onLightsOn={advanceScene} 
          />
        )}

        {currentScene === 1 && (
          <HeartPullScene 
            girlfriendName={personalData.girlfriendName}
            onComplete={advanceScene} 
          />
        )}

        {currentScene === 2 && (
          <GiftBoxScene 
            girlfriendName={personalData.girlfriendName} 
            onComplete={advanceScene} 
          />
        )}

        {currentScene === 3 && (
          <BirthdayBalloonScene
            girlfriendName={personalData.girlfriendName}
            onComplete={advanceScene}
          />
        )}

        {currentScene === 4 && (
          <BirthdayCakeScene
            girlfriendName={personalData.girlfriendName}
            onComplete={advanceScene}
          />
        )}

        {currentScene === 5 && (
          <MessageRevealScene 
            girlfriendName={personalData.girlfriendName} 
            onComplete={advanceScene} 
          />
        )}

        {currentScene === 6 && (
          <MemoriesScene 
            girlfriendName={personalData.girlfriendName} 
            specialDate={personalData.specialDate} 
            onComplete={advanceScene} 
          />
        )}

        {currentScene === 7 && (
          <FinalScene 
            girlfriendName={personalData.girlfriendName}
            specialDate={personalData.specialDate}
            personalMessage={personalData.personalMessage}
            onReplay={() => jumpToScene(0)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}
      </div>

      {/* Personalization Modal */}
      <PersonalizeModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        data={personalData}
        onSave={handleSavePersonalData}
      />

    </div>
  );
}
