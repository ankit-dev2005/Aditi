import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";


// 🎵 Replace this URL with your own hosted audio file
// Options:
//   - Upload an mp3 to Google Drive / Dropbox and use the direct link
//   - Use any public .mp3 URL
//   - Put the file in /public folder and use "/your-song.mp3"
const MUSIC_URL = "/bairan.mp3";

// 📞 Replace with actual phone number (with country code for WhatsApp)
const PHONE = "+918271871056";

const messages = [
  "Hey Aadi… 👀",
  "Ek choti si cheez banayi hai… bas dekh lena 😌",
  "1 month ho gaya… aur honestly sab thoda off lagta hai 💔",
  "Thoda ego, thodi misunderstanding… dono side thi",
  "Par ek baat bolu?",
  "Tumhari aadat si ho gayi hai mujhe 💖",
  "Aur aadatein itni easily nahi jaati…",
  "Miss karta hoon tumhe… thoda zyada hi",
  "Waise gussa tum pe bhi cute lagta hai 😏",
  "Itna attitude bhi theek nahi hai madam 🙂",
  "Chalo maan bhi jao ab…",
  "Ek chance aur de do… is baar properly handle karunga 🤞",
];

const finalMessages = [
  "Okay… last thing 🙂",
  "I still like you… a lot ❤️",
  "Aur honestly… I don't want to lose you",
  "Toh bas ek baar baat kar lo…",
  "Baaki sab main handle kar lunga 😌",
];

const HEART_EMOJIS = ["❤️", "💕", "💗", "💖", "🩷", "💓"];

// ── Floating Heart Component ──────────────────────────────────────────────
function FloatingHeart({ id, left, onDone }) {
  const emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  const duration = 3 + Math.random() * 1.8;

  useEffect(() => {
    const t = setTimeout(onDone, duration * 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.span
      initial={{ y: 0, opacity: 0, rotate: -10 }}
      animate={{ y: "-110vh", opacity: [0, 1, 1, 0], rotate: 15 }}
      transition={{ duration, ease: "easeIn" }}
      style={{
        position: "fixed",
        left: `${left}%`,
        bottom: 20,
        fontSize: 22,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {emoji}
    </motion.span>
  );
}

// ── Equaliser Bars (music indicator) ──────────────────────────────────────
function EqBars({ playing }) {
  const bars = [0.4, 0.7, 0.55, 0.85, 0.5];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 14 }}>
      {bars.map((speed, i) => (
        <motion.div
          key={i}
          animate={playing ? { height: ["3px", "14px", "5px", "12px", "3px"] } : { height: "4px" }}
          transition={playing ? { duration: speed + 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 } : {}}
          style={{ width: 3, background: "white", borderRadius: 2, minHeight: 3 }}
        />
      ))}
    </div>
  );
}

// ── Star Background ────────────────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 3,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          animate={{ opacity: [0.15, 1, 0.15], scale: [1, 1.6, 1] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
          }}
        />
      ))}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [index, setIndex] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const audioRef = useRef(null);

  // Init audio
  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.55;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const spawnHeart = useCallback(() => {
    const id = Date.now() + Math.random();
    const left = 5 + Math.random() * 90;
    setHearts((prev) => [...prev, { id, left }]);
  }, []);

  const removeHeart = useCallback((id) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  }, []);

  // Start music on first tap (browser autoplay policy requires user gesture)
  const startMusic = () => {
    if (!musicStarted && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setMusicStarted(true);
      setMusicPlaying(true);
    }
  };

  const toggleMusic = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setMusicPlaying(true);
      setMusicStarted(true);
    }
  };

  const handleTap = () => {
    startMusic();
    spawnHeart();
    if (!showFinal) {
      if (index < messages.length - 1) {
        setIndex((i) => i + 1);
      } else {
        setShowFinal(true);
        // Spawn burst of hearts on final screen
        for (let i = 0; i < 8; i++) {
          setTimeout(spawnHeart, i * 250);
        }
      }
    }
  };

  const progress = showFinal ? 100 : Math.round((index / messages.length) * 100);

  return (
    <div
      onClick={handleTap}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e91e8c 0%, #f06292 40%, #ff8a65 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
        padding: "0 16px",
      }}
    >
      {/* Stars */}
      <Stars />

      {/* Floating Hearts */}
      {hearts.map((h) => (
        <FloatingHeart key={h.id} id={h.id} left={h.left} onDone={() => removeHeart(h.id)} />
      ))}

      {/* Progress Bar */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          height: 4, background: "rgba(255,255,255,0.25)", zIndex: 100,
        }}
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          style={{ height: "100%", background: "white", borderRadius: "0 2px 2px 0" }}
        />
      </div>

      {/* Music Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={toggleMusic}
        style={{
          position: "fixed", top: 14, right: 16,
          background: "rgba(255,255,255,0.22)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.4)",
          borderRadius: 50,
          padding: "6px 14px 6px 10px",
          display: "flex", alignItems: "center", gap: 8,
          zIndex: 200, cursor: "pointer",
          userSelect: "none",
        }}
      >
        <EqBars playing={musicPlaying} />
        <span style={{ color: "white", fontSize: 12, fontWeight: 700, letterSpacing: 0.3 }}>
          {musicPlaying ? "Playing" : "Music"}
        </span>
      </motion.div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 430, zIndex: 10, textAlign: "center" }}>
        <AnimatePresence mode="wait">
          {!showFinal ? (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.92 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.38)",
                borderRadius: 30,
                padding: "40px 30px",
                boxShadow: "0 10px 50px rgba(0,0,0,0.18)",
              }}
            >
              <p
                style={{
                  color: "white",
                  fontSize: "clamp(18px, 5vw, 24px)",
                  fontWeight: 600,
                  lineHeight: 1.65,
                  textShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
              >
                {messages[index]}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 180, damping: 18 }}
              style={{
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.42)",
                borderRadius: 30,
                padding: "40px 28px 32px",
                boxShadow: "0 10px 50px rgba(0,0,0,0.2)",
              }}
            >
              {finalMessages.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.18 + 0.1, duration: 0.45 }}
                  style={{
                    color: "white",
                    fontSize: "clamp(15px, 4vw, 18px)",
                    fontWeight: 600,
                    lineHeight: 1.7,
                    marginBottom: 10,
                    textShadow: "0 1px 3px rgba(0,0,0,0.12)",
                  }}
                >
                  {line}
                </motion.p>
              ))}

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95 }}
                style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}
              >
                <a
                  href={`tel:${PHONE}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "11px 22px", borderRadius: 50,
                    background: "white", color: "#d63c8a",
                    fontWeight: 700, fontSize: 15, textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    fontFamily: "inherit",
                  }}
                >
                  📞 Call Me?
                </a>
             <a
  href={`https://wa.me/${PHONE}`}
  onClick={(e) => e.stopPropagation()}
  target="_blank"
  rel="noreferrer"
>
  💬 WhatsApp
</a>
              </motion.div>

              {/* Heartbeat */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: [0, 1.2, 1] }}
                transition={{ delay: 1.2, duration: 0.5 }}
                style={{ fontSize: 42, marginTop: 20 }}
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1, 1.1, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.3 }}
                  style={{ display: "inline-block" }}
                >
                  💖
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Counter & Hint */}
        {!showFinal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 12, fontWeight: 600 }}>
              {index + 1} / {messages.length}
            </p>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 16, fontWeight: 600 }}
            >
              {!musicStarted ? "tap to start 🎵" : "tap anywhere ♡"}
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
}