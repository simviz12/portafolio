/** Fully synthesized SFX (Web Audio) — no asset downloads. */
export class RangeAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  muted = false;

  init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.7;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.7, this.ctx.currentTime, 0.02);
  }

  dispose() {
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }

  private tone(type: OscillatorType, f0: number, f1: number, dur: number, vol: number, delay = 0) {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  private noise(dur: number, vol: number, freq: number, q = 1, delay = 0) {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + delay;
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.25));
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.value = vol;
    src.connect(f).connect(g).connect(this.master);
    src.start(t);
  }

  shot() {
    this.init();
    this.tone("sawtooth", 210, 40, 0.14, 0.4);
    this.tone("triangle", 1800, 260, 0.08, 0.18);
    this.noise(0.16, 0.6, 1400, 0.8);
  }

  hit() {
    this.init();
    this.tone("sine", 1900, 1100, 0.07, 0.28);
    this.noise(0.05, 0.25, 4200, 2);
  }

  crit() {
    this.init();
    this.tone("sine", 2800, 1500, 0.09, 0.35);
    this.tone("square", 3600, 2400, 0.05, 0.06, 0.01);
  }

  kill(streak: number) {
    this.init();
    const chords = [
      [587.33, 880, 1174.66],
      [659.25, 987.77, 1318.51],
      [783.99, 1046.5, 1567.98, 2093],
    ];
    chords[Math.min(streak - 1, 2)].forEach((f, i) => this.tone("sine", f, f * 0.98, 0.5, 0.22, i * 0.045));
    this.noise(0.5, 0.35, 220, 0.6);
  }

  empty() {
    this.init();
    this.tone("square", 900, 700, 0.04, 0.08);
  }

  reload() {
    this.init();
    this.tone("square", 320, 260, 0.06, 0.08);
    this.noise(0.05, 0.3, 2400, 3, 0.05);
    this.tone("square", 520, 640, 0.07, 0.09, 0.55);
    this.noise(0.06, 0.35, 3000, 3, 0.62);
  }

  ui() {
    this.init();
    this.tone("sine", 660, 990, 0.08, 0.12);
  }

  victory() {
    this.init();
    [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) => this.tone("triangle", f, f, 0.6, 0.16, i * 0.09));
  }
}
