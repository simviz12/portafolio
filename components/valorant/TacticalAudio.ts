export class TacticalAudio {
  private ctx: AudioContext | null = null;

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playGunshot() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Mechanical punch (Sawtooth)
    const osc = this.ctx.createOscillator();
    const gainOsc = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.14);
    gainOsc.gain.setValueAtTime(0.55, now);
    gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gainOsc);
    gainOsc.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);

    // 2. Sci-Fi Laser High Pitch (Prime Vandal)
    const laser = this.ctx.createOscillator();
    const gainLaser = this.ctx.createGain();
    laser.type = "triangle";
    laser.frequency.setValueAtTime(1400, now);
    laser.frequency.exponentialRampToValueAtTime(220, now + 0.09);
    gainLaser.gain.setValueAtTime(0.25, now);
    gainLaser.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
    laser.connect(gainLaser);
    gainLaser.connect(this.ctx.destination);
    laser.start(now);
    laser.stop(now + 0.1);

    // 3. Noise Burst
    const bufferSize = this.ctx.sampleRate * 0.18;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.045));
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, now);

    const gainNoise = this.ctx.createGain();
    gainNoise.gain.setValueAtTime(0.7, now);
    gainNoise.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    whiteNoise.connect(filter);
    filter.connect(gainNoise);
    gainNoise.connect(this.ctx.destination);
    whiteNoise.start(now);
  }

  playHeadshot() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Crisp metal dink
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  playKillSound(streak = 1) {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Multi-kill escalation pitch (Valorant ACE sound progression)
    const baseFreqs = [
      [587.33, 880, 1174.66],              // Kill 1
      [659.25, 987.77, 1318.51],            // Kill 2
      [783.99, 1046.50, 1567.98, 2093.00], // Kill 3 ACE
    ];
    const freqs = baseFreqs[Math.min(streak - 1, baseFreqs.length - 1)];
    freqs.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + idx * 0.04);
      gain.gain.setValueAtTime(0.35, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.48);
    });
  }

  playMechanical() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.setValueAtTime(540, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }
}
