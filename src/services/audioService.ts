/**
 * Procedural Web Audio API sound generator for MindEase AI.
 * Generates continuous soothing ambient soundscapes (Rain, Ocean Waves, Ambient Stream)
 * and mindfulness chimes without relying on external network mp3 assets.
 */

class AudioController {
  private ctx: AudioContext | null = null;
  private currentSoundType: 'none' | 'rain' | 'ocean' | 'stream' | 'forest' = 'none';
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.35;

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentSound(): string {
    return this.currentSoundType;
  }

  public stopAmbient() {
    this.activeNodes.forEach(node => {
      try {
        if (typeof node === 'number') {
          window.clearInterval(node);
        } else if (typeof node === 'object' && node !== null) {
          if ('stop' in node && typeof (node as any).stop === 'function') {
            (node as any).stop();
          }
          if ('disconnect' in node && typeof (node as any).disconnect === 'function') {
            (node as any).disconnect();
          }
        }
      } catch (e) {
        // ignore cleanup errors
      }
    });
    this.activeNodes = [];
    this.currentSoundType = 'none';
  }

  public playAmbient(type: 'rain' | 'ocean' | 'stream' | 'forest') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.currentSoundType === type) {
      this.stopAmbient();
      return;
    }

    this.stopAmbient();
    this.currentSoundType = type;

    switch (type) {
      case 'rain':
        this.createRainSound();
        break;
      case 'ocean':
        this.createOceanSound();
        break;
      case 'stream':
        this.createStreamSound();
        break;
      case 'forest':
        this.createForestSound();
        break;
    }
  }

  private createRainSound() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to soft rain hiss
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1000, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.6, this.ctx.currentTime);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(2800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    whiteNoise.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, bandpass, lowpass, gain);
  }

  private createOceanSound() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    // Pinkish noise
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    // LFO for wave swelling
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8s wave cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, filter, waveGain, lfo, lfoGain);
  }

  private createStreamSound() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(700, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.activeNodes.push(noise, filter, gain);
  }

  private createForestSound() {
    if (!this.ctx || !this.masterGain) return;
    this.createRainSound(); // gentle background rustle
    
    // Random gentle bird chimes every 4-8 seconds
    const interval = window.setInterval(() => {
      if (this.ctx && this.currentSoundType === 'forest') {
        this.playSoftChime(1400 + Math.random() * 800, 0.08, 0.3);
      }
    }, 4500);

    this.activeNodes.push(interval);
  }

  /**
   * Plays a soft, harmonic mindfulness bell chime (e.g. for breathing cycle transitions).
   */
  public playChime(frequency: number = 528) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 2.2);
  }

  public playSoftChime(frequency: number = 600, gainLevel: number = 0.1, duration: number = 0.5) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(gainLevel, this.ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + duration);
  }
}

export const AudioService = new AudioController();
