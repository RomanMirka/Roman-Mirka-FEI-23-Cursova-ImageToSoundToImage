import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import FFT from "fft.js";

const START_FREQ = 6200;
const END_FREQ = 6500;

const sampleRate = 44100;
const CHUNK = 2048;

// -------------------- 1. START RECORDING -----------------------
export async function startRecording() {
  console.log("🎙️ Starting mic...");

  await Audio.requestPermissionsAsync();

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY,
  );

  return recording;
}

// -------------------- 2. STOP RECORDING ------------------------
export async function stopRecording(rec) {
  if (!rec) return null;

  await rec.stopAndUnloadAsync();
  return rec.getURI();
}

// -------------------- 3. DECODE --------------------------------
export async function decodeImageFromSound(uri) {
  console.log("📡 Decoding sound:", uri);

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const wavBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const dataStart = 44;
  const raw = wavBytes.slice(dataStart);
  const floatSamples = pcm16ToFloat(raw);

  const bytes = await extractBytesFromFrequencies(floatSamples);

  if (!bytes.length) {
    console.log("⚠️ No bytes extracted.");
    return null;
  }

  const base64img = btoa(
    bytes.reduce((acc, b) => acc + String.fromCharCode(b), ""),
  );

  return `data:image/png;base64,${base64img}`;
}

// -------------------- PCM → Float ------------------------------
function pcm16ToFloat(bytes) {
  const out = new Float32Array(bytes.length / 2);
  for (let i = 0; i < out.length; i++) {
    const lo = bytes[i * 2];
    const hi = bytes[i * 2 + 1];
    const val = (hi << 8) | lo;
    out[i] = val / 32768;
  }
  return out;
}

// -------------------- Frequency detection ----------------------
function detectFrequency(chunk) {
  const fft = new FFT(chunk.length);
  const out = fft.createComplexArray();

  fft.realTransform(out, chunk);
  fft.completeSpectrum(out);

  let maxMag = 0;
  let index = 0;

  for (let i = 0; i < chunk.length / 2; i++) {
    const re = out[2 * i];
    const im = out[2 * i + 1];
    const mag = re * re + im * im;

    if (mag > maxMag) {
      maxMag = mag;
      index = i;
    }
  }

  const freq = (index * sampleRate) / chunk.length;

  return freq;
}

// -------------------- Extract data -----------------------------
async function extractBytesFromFrequencies(samples) {
  let receiving = false;
  let bytes = [];

  for (let i = 0; i < samples.length; i += CHUNK) {
    const block = samples.slice(i, i + CHUNK);
    if (block.length < CHUNK) break;

    const freq = detectFrequency(block);

    // Діагностика
    console.log("📈 freq =", Math.round(freq));

    if (!receiving) {
      if (Math.abs(freq - START_FREQ) < 200) {
        console.log("🚀 START detected");
        receiving = true;
      }
      continue;
    }

    if (Math.abs(freq - END_FREQ) < 200) {
      console.log("🏁 END detected");
      break;
    }

    if (freq >= 400 && freq <= 1600) {
      const byte = Math.round(((freq - 400) / 1200) * 255);
      bytes.push(byte);
    }
  }

  return bytes;
}
