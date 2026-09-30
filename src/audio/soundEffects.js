// Procedural Web Audio API sound designer for romantic experience
// 100% self-contained, no external MP3 dependencies, instant load and zero CORS errors

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmGain = null;
    this.sfxGain = null;
    this.isMusicPlaying = false;
    this.isBirthdaySongPlaying = false;
    this.musicTimer = null;
    this.bdayTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master FX gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.75;
      this.sfxGain.connect(this.ctx.destination);

      // Background music gain
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.25;
      this.bgmGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.isMuted ? 0 : 0.75;
    }
    if (this.bgmGain) {
      this.bgmGain.gain.value = this.isMuted ? 0 : 0.25;
    }
    return this.isMuted;
  }

  // Light switch click sound (mechanical toggle click-clack)
  playLightSwitch() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    
    // First sharp click
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1200, t);
    osc1.frequency.exponentialRampToValueAtTime(180, t + 0.025);
    gain1.gain.setValueAtTime(0.7, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(t);
    osc1.stop(t + 0.035);

    // Second resonant snap (0.03s later)
    const t2 = t + 0.03;
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(700, t2);
    osc2.frequency.exponentialRampToValueAtTime(100, t2 + 0.04);
    gain2.gain.setValueAtTime(0.6, t2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.045);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(t2);
    osc2.stop(t2 + 0.05);
  }

  // Cake knife slice sound
  playKnifeSlice() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.frequency.linearRampToValueAtTime(900, t + 0.22);
    filter.Q.value = 4;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(t);
  }

  // Soft organic tap
  playTap() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.05);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  // Elastic tension pitch while dragging heart or pull cord
  playStretch(tension) {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 160 + tension * 260;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.linearRampToValueAtTime(baseFreq + 30, t + 0.08);

    gain.gain.setValueAtTime(0.06 + tension * 0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Satisfying spring boing / snap
  playBoing() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(680, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.22);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.35);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.42);
  }

  // Romantic deep heartbeat (lub-dub)
  playHeartbeat() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const playThump = (timeOffset, freq, vol, dur) => {
      const t = this.ctx.currentTime + timeOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, t);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + dur);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + dur + 0.02);
    };

    playThump(0, 68, 0.65, 0.16);
    playThump(0.14, 58, 0.5, 0.2);
  }

  // Balloon pop sound
  playBalloonPop() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.09;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(t);

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.1);

    oscGain.gain.setValueAtTime(0.5, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.11);
  }

  // Blow candle sound
  playBlowCandle() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.linearRampToValueAtTime(400, t + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(t);

    setTimeout(() => {
      this.playSparkle();
    }, 250);
  }

  // Gift opening pop sound
  playPop() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.12);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  // Sparkling celestial bell chime arpeggio
  playSparkle() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.48);
    });
  }

  // Confetti burst sizzle
  playConfetti() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + 0.28);
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
  }

  // Smooth cinematic whoosh
  playWhoosh() {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.linearRampToValueAtTime(1400, t + 0.15);
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.35);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(360, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.35);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.38);
  }

  // Sweet Romantic Music Box "Happy Birthday to You" Melody
  startHappyBirthdaySong() {
    this.init();
    if (this.isBirthdaySongPlaying || !this.ctx) return;
    this.isBirthdaySongPlaying = true;
    this.stopBackgroundMusic();

    const G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25;
    const D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;

    const melody = [
      { f: G4, d: 0.75 }, { f: G4, d: 0.25 }, { f: A4, d: 1 }, { f: G4, d: 1 }, { f: C5, d: 1 }, { f: B4, d: 2 },
      { f: G4, d: 0.75 }, { f: G4, d: 0.25 }, { f: A4, d: 1 }, { f: G4, d: 1 }, { f: D5, d: 1 }, { f: C5, d: 2 },
      { f: G4, d: 0.75 }, { f: G4, d: 0.25 }, { f: G5, d: 1 }, { f: E5, d: 1 }, { f: C5, d: 1 }, { f: B4, d: 1 }, { f: A4, d: 2 },
      { f: F5, d: 0.75 }, { f: F5, d: 0.25 }, { f: E5, d: 1 }, { f: C5, d: 1 }, { f: D5, d: 1 }, { f: C5, d: 2.5 },
    ];

    const beatTime = 0.52;

    const playNote = (freq, duration, delay) => {
      const t = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, t);

      const noteVol = 0.22 * (this.isMuted ? 0 : 1);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(noteVol, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration * beatTime * 0.95);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(t);
      osc2.start(t);
      osc.stop(t + duration * beatTime);
      osc2.stop(t + duration * beatTime);
    };

    let totalTime = 0;
    melody.forEach((item) => {
      playNote(item.f, item.d, totalTime);
      totalTime += item.d * beatTime;
    });

    this.bdayTimer = setTimeout(() => {
      this.isBirthdaySongPlaying = false;
      this.startHappyBirthdaySong();
    }, (totalTime + 1.5) * 1000);
  }

  stopBirthdaySong() {
    this.isBirthdaySongPlaying = false;
    if (this.bdayTimer) {
      clearTimeout(this.bdayTimer);
      this.bdayTimer = null;
    }
  }

  // Ambient romantic lofi electric piano chords
  startBackgroundMusic() {
    this.init();
    if (this.isMusicPlaying || this.isBirthdaySongPlaying || !this.ctx) return;
    this.isMusicPlaying = true;

    const chords = [
      [174.61, 220.00, 261.63, 329.63, 392.00],
      [220.00, 261.63, 329.63, 392.00, 493.88],
      [146.83, 220.00, 261.63, 349.23, 440.00],
      [116.54, 174.61, 233.08, 293.66, 349.23],
    ];

    let chordIdx = 0;

    const playChordStep = () => {
      if (!this.isMusicPlaying || this.isBirthdaySongPlaying || !this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const chord = chords[chordIdx % chords.length];
      chordIdx++;

      chord.forEach((freq, noteIdx) => {
        const t = this.ctx.currentTime + noteIdx * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = noteIdx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, t);
        filter.Q.value = 1.2;

        const noteVol = (noteIdx === 0 ? 0.08 : 0.04) * (this.isMuted ? 0 : 1);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(noteVol, t + 0.3);
        gain.gain.setValueAtTime(noteVol * 0.8, t + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(t);
        osc.stop(t + 3.3);
      });

      this.musicTimer = setTimeout(playChordStep, 3200);
    };

    playChordStep();
  }

  stopBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const sounds = new SoundEngine();
export default sounds;
