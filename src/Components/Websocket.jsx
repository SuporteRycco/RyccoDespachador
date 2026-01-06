import { useEffect, useRef, useState } from "react";

export default function SocketExample() {
  const token = localStorage.getItem("token");
  const aesBase64 = localStorage.getItem("aes");

  const wsRef = useRef(null);
  const cryptoKeyRef = useRef(null);

  const playCtxRef = useRef(null);
  const recordCtxRef = useRef(null);
  const processorRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const baseIvSendRef = useRef(null);
  const baseIvRecvRef = useRef(null);
  const sendCounterRef = useRef(0);

  const [wsReady, setWsReady] = useState(false);

  let pcmBuffer = [];
  let sending = false;
  let falando = false;

  const SAMPLE_RATE = 16000;
  const FRAME_SAMPLES = 320; // 20ms @16kHz

  /* =======================
     Utils
  ======================= */

  const base64ToBytes = (base64) => {
    const binary = atob(base64);
    return Uint8Array.from(binary, c => c.charCodeAt(0));
  };

  const buildIv = (baseIv, counter) => {
    const iv = new Uint8Array(baseIv);
    iv[12] = (counter >>> 24) & 0xff;
    iv[13] = (counter >>> 16) & 0xff;
    iv[14] = (counter >>> 8) & 0xff;
    iv[15] = counter & 0xff;
    return iv;
  };

  /* =======================
     Inicialização AES + Áudio
  ======================= */

  const startAudio = async () => {
    if (cryptoKeyRef.current) return;

    const keyBytes = base64ToBytes(aesBase64);
    cryptoKeyRef.current = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-CTR" },
      false,
      ["encrypt", "decrypt"]
    );

    playCtxRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });
    await playCtxRef.current.resume();

    console.log("🔐 AES + 🔊 áudio prontos");
  };

  /* =======================
     Envio de IV base (1x)
  ======================= */

  const sendBaseIvOnce = () => {
    if (baseIvSendRef.current) return;

    const iv = crypto.getRandomValues(new Uint8Array(16));
    baseIvSendRef.current = iv;
    sendCounterRef.current = 0;

    wsRef.current.send(iv.buffer);
    console.log("🔑 IV base enviado");
  };

  /* =======================
     Falar (captura)
  ======================= */

  const startTalking = async () => {
    if (falando || !wsReady) return;
    falando = true;

    sendBaseIvOnce();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;

    const ctx = new AudioContext({ sampleRate: SAMPLE_RATE });
    recordCtxRef.current = ctx;

    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(2048, 1, 1);
    processorRef.current = processor;

    source.connect(processor);
    processor.connect(ctx.destination);

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        pcmBuffer.push(s < 0 ? s * 32768 : s * 32767);
      }
    };

    sending = true;
    sendLoop();
  };

  const sendLoop = async () => {
    if (!sending) return;

    if (pcmBuffer.length >= FRAME_SAMPLES && cryptoKeyRef.current) {
      const frame = pcmBuffer.splice(0, FRAME_SAMPLES);
      const pcm16 = new Int16Array(frame);

      const counter = sendCounterRef.current;
      const iv = buildIv(baseIvSendRef.current, counter);

      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-CTR", counter: iv, length: 128 },
        cryptoKeyRef.current,
        pcm16.buffer
      );

      const packet = new ArrayBuffer(4 + encrypted.byteLength);
      const view = new DataView(packet);
      view.setInt32(0, counter, false); // big-endian
      new Uint8Array(packet, 4).set(new Uint8Array(encrypted));

      wsRef.current.send(packet);
      sendCounterRef.current++;
    }

    setTimeout(sendLoop, 20);
  };

  const stopTalking = () => {
    falando = false;
    sending = false;

    processorRef.current?.disconnect();
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    recordCtxRef.current?.close();

    processorRef.current = null;
    mediaStreamRef.current = null;
    recordCtxRef.current = null;
    baseIvSendRef.current = null;
    pcmBuffer = [];
  };

  /* =======================
     WebSocket + Escuta
  ======================= */

  useEffect(() => {
    const ws = new WebSocket(
      `ws://192.168.15.17:5000/audiochat?access_token=${token}&group=1`
    );
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket conectado");
      setWsReady(true);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket fechado");
      setWsReady(false);
    };

    ws.onerror = (e) => console.error("WS erro", e);

    ws.onmessage = async (event) => {
      if (!cryptoKeyRef.current || !playCtxRef.current) return;

      const data = event.data;

      // 🔑 IV base
      if (data.byteLength === 16) {
        baseIvRecvRef.current = new Uint8Array(data);
        return;
      }

      if (!baseIvRecvRef.current) return;

      const view = new DataView(data);
      const counter = view.getInt32(0, false);
      const encrypted = data.slice(4);

      const iv = buildIv(baseIvRecvRef.current, counter);

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-CTR", counter: iv, length: 128 },
        cryptoKeyRef.current,
        encrypted
      );

      const pcm16 = new Int16Array(decrypted);
      const float32 = new Float32Array(pcm16.length);

      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768;
      }

      const ctx = playCtxRef.current;
      const buffer = ctx.createBuffer(1, float32.length, SAMPLE_RATE);
      buffer.copyToChannel(float32, 0);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    };

    return () => ws.close();
  }, [token]);

  /* =======================
     UI
  ======================= */

  return (
    <div>
      <button onClick={startAudio}>🔊 Ativar áudio</button>

      <button
        disabled={!wsReady}
        onMouseDown={startTalking}
        onMouseUp={stopTalking}
        onTouchStart={startTalking}
        onTouchEnd={stopTalking}
        className="px-6 py-4 bg-green-600 text-white rounded-xl"
      >
        🎙️ Pressione para falar
      </button>

      <h1>{wsReady ? "🟢 Conectado" : "🔴 Desconectado"}</h1>
    </div>
  );
}
