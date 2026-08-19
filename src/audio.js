/* Trilha original em arquivo, com ambiência Web Audio como fallback. */
window.LoveAudio = (() => {
  const soundtrack = window.LOVE_STORY.soundtrack || {};
  const soundtrackSrc = soundtrack.src || "assets/audio/marila-jorge-theme.wav";
  const soundtrackVolume = typeof soundtrack.volume === "number" ? soundtrack.volume : 0.42;
  let audio;
  let context;
  let master;
  let playing = true;
  let started = false;
  let fallbackStarted = false;
  const nodes = [];

  function createOsc(type, freq, gain, detune = 0) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = freq;
    oscillator.detune.value = detune;
    gainNode.gain.value = 0;
    oscillator.connect(gainNode).connect(master);
    oscillator.start();
    gainNode.gain.linearRampToValueAtTime(gain, context.currentTime + 2);
    nodes.push({ oscillator, gainNode, gain });
    return { oscillator, gainNode };
  }

  function pulse(gainNode, min, max, seconds) {
    const now = context.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(min, now);
    gainNode.gain.linearRampToValueAtTime(max, now + seconds / 2);
    gainNode.gain.linearRampToValueAtTime(min, now + seconds);
    window.setTimeout(() => {
      if (context && playing) pulse(gainNode, min, max, seconds);
    }, seconds * 1000);
  }

  function createSoundtrackAudio() {
    if (audio) return audio;
    audio = new Audio(soundtrackSrc);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = playing ? soundtrackVolume : 0;
    audio.addEventListener("error", () => {
      if (started) startFallback();
    });
    return audio;
  }

  function startFallback() {
    if (fallbackStarted) {
      setFallbackEnabled(playing);
      return;
    }

    context = new (window.AudioContext || window.webkitAudioContext)();
    master = context.createGain();
    master.gain.value = 0;
    master.connect(context.destination);

    const padA = createOsc("sine", 220, 0.035, -8);
    const padB = createOsc("triangle", 330, 0.025, 4);
    const shimmer = createOsc("sine", 660, 0.012, 2);
    pulse(padA.gainNode, 0.015, 0.045, 8);
    pulse(padB.gainNode, 0.01, 0.032, 11);
    pulse(shimmer.gainNode, 0.003, 0.015, 5);
    fallbackStarted = true;
    setFallbackEnabled(playing);
  }

  async function start() {
    if (started) return;
    started = true;

    try {
      await createSoundtrackAudio().play();
    } catch (error) {
      console.warn("Não foi possível tocar a trilha em arquivo; usando ambiência:", error);
      startFallback();
    }
  }

  function setFallbackEnabled(enabled) {
    if (!context || !master) return;
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.linearRampToValueAtTime(enabled ? 0.12 : 0, context.currentTime + 0.4);
  }

  function setEnabled(enabled) {
    playing = enabled;

    if (audio && !fallbackStarted) {
      audio.volume = enabled ? soundtrackVolume : 0;
      if (enabled && started) {
        audio.play().catch(() => startFallback());
      } else {
        audio.pause();
      }
    }

    setFallbackEnabled(enabled);
  }

  function toggle() {
    setEnabled(!playing);
    return playing;
  }

  return { start, toggle, setEnabled, get playing() { return playing; } };
})();
