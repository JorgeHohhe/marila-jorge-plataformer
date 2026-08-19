import math
import random
import struct
import wave
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "audio" / "marila-jorge-theme.wav"

SAMPLE_RATE = 44100
BPM = 84
BEAT = 60 / BPM
BAR = BEAT * 4
BARS = 16
TAIL_SECONDS = 2.6
TOTAL_SAMPLES = int(BARS * BAR * SAMPLE_RATE)
TAIL_SAMPLES = int(TAIL_SECONDS * SAMPLE_RATE)

random.seed(16052026)
samples = [0.0] * (TOTAL_SAMPLES + TAIL_SAMPLES)

NOTE_OFFSETS = {
    "C": -9,
    "C#": -8,
    "Db": -8,
    "D": -7,
    "D#": -6,
    "Eb": -6,
    "E": -5,
    "F": -4,
    "F#": -3,
    "Gb": -3,
    "G": -2,
    "G#": -1,
    "Ab": -1,
    "A": 0,
    "A#": 1,
    "Bb": 1,
    "B": 2,
}


def note(name):
    pitch = name[:-1]
    octave = int(name[-1])
    semitone = NOTE_OFFSETS[pitch] + (octave - 4) * 12
    return 440 * (2 ** (semitone / 12))


def envelope(t, duration, attack, release, sustain=0.75):
    if t < 0 or t > duration:
        return 0.0
    if attack > 0 and t < attack:
        return (1 - math.cos(math.pi * t / attack)) * 0.5
    if release > 0 and t > duration - release:
        tail = max(0.0, (duration - t) / release)
        return sustain * (1 - math.cos(math.pi * tail)) * 0.5
    return sustain


def add_tone(start, duration, freq, amp, attack=0.01, release=0.12, kind="sine", pan=0.0):
    start_i = int(start * SAMPLE_RATE)
    end_i = min(len(samples), int((start + duration) * SAMPLE_RATE))
    phase = random.random() * math.tau
    trem_phase = random.random() * math.tau

    for i in range(max(0, start_i), end_i):
        t = (i - start_i) / SAMPLE_RATE
        env = envelope(t, duration, attack, release)
        trem = 0.92 + 0.08 * math.sin(math.tau * 0.55 * t + trem_phase)
        wobble = 1 + 0.0016 * math.sin(math.tau * 4.2 * t)
        angle = math.tau * freq * wobble * t + phase

        if kind == "triangle":
            value = (2 / math.pi) * math.asin(math.sin(angle))
        elif kind == "bell":
            value = (
                math.sin(angle)
                + 0.52 * math.sin(angle * 2.01)
                + 0.18 * math.sin(angle * 3.98)
            )
        elif kind == "soft_square":
            value = math.tanh(1.7 * math.sin(angle))
        else:
            value = math.sin(angle)

        pan_gain = 0.96 + 0.04 * math.sin(math.tau * 0.09 * t + pan)
        samples[i] += value * amp * env * trem * pan_gain


def add_pad(start, duration, chord, amp):
    for freq in chord:
        add_tone(start, duration, freq * 0.997, amp * 0.48, 0.9, 1.4, "sine")
        add_tone(start, duration, freq * 1.003, amp * 0.38, 0.9, 1.4, "triangle")
        add_tone(start, duration, freq * 2.0, amp * 0.12, 1.1, 1.2, "sine")


def add_pluck(start, freq, amp=0.08, duration=1.1):
    add_tone(start, duration, freq, amp, 0.006, duration * 0.92, "bell", pan=start)
    add_tone(start, duration * 0.7, freq * 2.0, amp * 0.28, 0.004, duration * 0.62, "sine", pan=start * 0.7)


def add_bass(start, freq):
    add_tone(start, BEAT * 1.85, freq, 0.075, 0.03, 0.42, "sine")
    add_tone(start, BEAT * 1.2, freq * 2, 0.018, 0.02, 0.3, "triangle")


def add_memory_sparkle(start):
    for step in (0, 0.18, 0.36, 0.58):
        freq = random.choice([note("A5"), note("B5"), note("C#6"), note("D6"), note("F#6")])
        add_pluck(start + step, freq, 0.035, 0.82)


chords = [
    ("Dmaj9", ["D3", "A3", "C#4", "E4", "F#4"]),
    ("Aadd4", ["A2", "E3", "A3", "D4", "C#4"]),
    ("Bm7", ["B2", "F#3", "A3", "D4", "F#4"]),
    ("Gmaj9", ["G2", "D3", "A3", "B3", "F#4"]),
    ("Em9", ["E2", "B2", "D3", "F#3", "G3"]),
    ("A6", ["A2", "E3", "F#3", "C#4", "E4"]),
    ("Dmaj9", ["D3", "A3", "C#4", "E4", "F#4"]),
    ("A", ["A2", "E3", "A3", "C#4", "E4"]),
]

melody = [
    ("A4", 0.5), ("F#4", 0.5), ("E4", 1.0), ("D4", 1.0),
    ("F#4", 0.5), ("A4", 0.5), ("B4", 1.0), ("A4", 1.0),
    ("C#5", 0.5), ("B4", 0.5), ("A4", 1.0), ("F#4", 1.0),
    ("E4", 0.5), ("F#4", 0.5), ("D4", 2.0),
]

for bar in range(BARS):
    chord_name, chord_notes = chords[bar % len(chords)]
    chord = [note(n) for n in chord_notes]
    root = chord[0]
    start = bar * BAR
    add_pad(start, BAR + 0.75, chord, 0.028)
    add_bass(start, root)
    add_bass(start + BEAT * 2, root * (1.5 if chord_name != "A" else 1.333))

    arp_notes = chord[1:] + [chord[-1] * 2]
    for step in range(8):
        arp_freq = arp_notes[(step + bar) % len(arp_notes)]
        add_pluck(start + step * BEAT * 0.5, arp_freq, 0.024 + bar * 0.0008, 0.62)

    if bar in (2, 6, 10, 14):
        add_memory_sparkle(start + BEAT * 3.05)

melody_time = BEAT * 2
for name, beats in melody:
    add_pluck(melody_time, note(name), 0.072, BEAT * beats + 0.5)
    melody_time += BEAT * beats

melody_time = BAR * 8 + BEAT
for name, beats in melody:
    freq = note(name) * (2 ** (2 / 12 if name in ("E4", "F#4", "A4") else 0))
    add_pluck(melody_time, freq, 0.065, BEAT * beats + 0.45)
    melody_time += BEAT * beats

for bar in range(BARS):
    start = bar * BAR
    add_tone(start + BEAT * 1.5, 0.55, note("D5"), 0.012, 0.003, 0.18, "sine")
    add_tone(start + BEAT * 3.5, 0.55, note("A5"), 0.01, 0.003, 0.18, "sine")

for i in range(TAIL_SAMPLES):
    samples[i] += samples[TOTAL_SAMPLES + i]

peak = max(0.01, max(abs(s) for s in samples[:TOTAL_SAMPLES]))
gain = 0.88 / peak

OUT.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(OUT), "wb") as wav:
    wav.setnchannels(2)
    wav.setsampwidth(2)
    wav.setframerate(SAMPLE_RATE)
    for i, sample in enumerate(samples[:TOTAL_SAMPLES]):
        edge = min(i, TOTAL_SAMPLES - 1 - i) / (SAMPLE_RATE * 0.018)
        edge_gain = min(1.0, max(0.0, edge))
        value = max(-1.0, min(1.0, sample * gain * edge_gain))
        left = int(value * 32767)
        right = int(value * 31000)
        wav.writeframes(struct.pack("<hh", left, right))

print(OUT)
