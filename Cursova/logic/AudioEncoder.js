import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import WavEncoder from "wav-encoder";

const START_FREQ = 6200;
const END_FREQ = 6500;

export async function playImageAsSound(base64, toneDuration = 0.05) {
  if (!base64) return;

  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const sampleRate = 44100;
  const samplesPerByte = Math.floor(sampleRate * toneDuration);

  // Загальна кількість семплів:
  const totalSamples = samplesPerByte * (bytes.length + 2); // + START + END

  const samples = new Float32Array(totalSamples);

  let offset = 0;

  // 1️⃣ START тон 18kHz
  for (let t = 0; t < samplesPerByte; t++) {
    samples[offset + t] = Math.sin((2 * Math.PI * START_FREQ * t) / sampleRate);
  }
  offset += samplesPerByte;

  // 2️⃣ Байти
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    const freq = 400 + (byte / 255) * 1200;

    for (let t = 0; t < samplesPerByte; t++) {
      samples[offset + t] = Math.sin((2 * Math.PI * freq * t) / sampleRate);
    }

    offset += samplesPerByte;
  }

  // 3️⃣ END тон 19kHz
  for (let t = 0; t < samplesPerByte; t++) {
    samples[offset + t] = Math.sin((2 * Math.PI * END_FREQ * t) / sampleRate);
  }

  // Кодування у WAV (Float32)
  const wav = await WavEncoder.encode({
    sampleRate,
    channelData: [samples],
  });

  const base64wav = btoa(
    new Uint8Array(wav).reduce((acc, b) => acc + String.fromCharCode(b), ""),
  );

  const uri = FileSystem.cacheDirectory + "transmission.wav";

  await FileSystem.writeAsStringAsync(uri, base64wav, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

  const { sound } = await Audio.Sound.createAsync({ uri });

  return new Promise((resolve) => {
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
        resolve();
      }
    });

    sound.playAsync();
  });
}
