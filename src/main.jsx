import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Mic, Music, Music2, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import "./styles.css";

const HER_NAME = "Bestie";

const LETTER_LINES = [
  "You’re genuinely one of the best people I’ve ever met…",
  "You make ordinary days feel lighter, funnier, and softer just by being you.",
  "Thank you for existing, for caring so deeply, and for being my safe little corner in this chaotic world.",
  "I hope this year gives you everything you deserve: peace, glow-ups, belly laughs, pretty memories, and love that never makes you question your worth.",
  "I love you the mostest 💖",
];

const memoryCards = [
  { id: 1, title: "our cutest chaos", caption: "photo slot #1", emoji: "📸", rotate: -8 },
  { id: 2, title: "tiny forever moment", caption: "photo slot #2", emoji: "🌷", rotate: 6 },
  { id: 3, title: "main character day", caption: "photo slot #3", emoji: "✨", rotate: -3 },
  { id: 4, title: "laughing for no reason", caption: "photo slot #4", emoji: "🫶", rotate: 8 },
];

const springTransition = { type: "spring", stiffness: 80, damping: 18 };

function App() {
  const [step, setStep] = useState(0);
  const [introReady, setIntroReady] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const [heartBursts, setHeartBursts] = useState([]);
  const [cursorHearts, setCursorHearts] = useState([]);
  const [typedName, setTypedName] = useState("");
  const audioCtxRef = useRef(null);
  const musicTimerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIntroReady(true), 3300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!introReady) return undefined;
    setTypedName("");
    const text = `Hey ${HER_NAME} 💖`;
    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setTypedName(text.slice(0, index));
      if (index >= text.length) clearInterval(timer);
    }, 88);
    return () => clearInterval(timer);
  }, [introReady]);

  useEffect(() => {
    const onPointerMove = (event) => {
      if (Math.random() > 0.22) return;
      const id = crypto.randomUUID();
      setCursorHearts((items) => [...items.slice(-16), { id, x: event.clientX, y: event.clientY }]);
      setTimeout(() => setCursorHearts((items) => items.filter((item) => item.id !== id)), 1000);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    if (!musicOn) {
      stopMusic();
      return undefined;
    }
    playSoftLoop();
    return () => stopMusic();
  }, [musicOn]);

  function getAudioContext() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  }

  function playTone(frequency, duration = 0.28, type = "sine", gainValue = 0.035) {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration + 0.02);
  }

  function playSoftLoop() {
    stopMusic();
    const notes = [392, 523.25, 587.33, 659.25, 587.33, 523.25, 440, 392];
    let i = 0;
    playTone(notes[i], 0.52, "sine", 0.018);
    musicTimerRef.current = setInterval(() => {
      i = (i + 1) % notes.length;
      playTone(notes[i], 0.62, "sine", 0.016);
    }, 780);
  }

  function stopMusic() {
    if (musicTimerRef.current) clearInterval(musicTimerRef.current);
    musicTimerRef.current = null;
  }

  function tactile(pattern = 18) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  function nextStep() {
    tactile([12, 35, 12]);
    setStep((value) => Math.min(value + 1, 5));
  }

  function replay() {
    tactile([20, 40, 20]);
    setWishMade(false);
    setHeartBursts([]);
    setStep(0);
    setIntroReady(false);
    setTimeout(() => setIntroReady(true), 1800);
  }

  function bouquetTap(event) {
    tactile(10);
    const rect = event.currentTarget.getBoundingClientRect();
    const id = crypto.randomUUID();
    setHeartBursts((items) => [
      ...items,
      { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
    ]);
    playTone(784, 0.18, "triangle", 0.025);
    setTimeout(() => setHeartBursts((items) => items.filter((item) => item.id !== id)), 950);
  }

  function blowCandles() {
    if (wishMade) return;
    tactile([30, 50, 30, 50, 60]);
    setWishMade(true);
    [659, 784, 988, 1175].forEach((note, index) => setTimeout(() => playTone(note, 0.22, "triangle", 0.04), index * 110));
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#fff5f8] font-body text-plum selection:bg-pink-200">
      <AmbientBackground />
      <ParticleField />
      <CursorTrail hearts={cursorHearts} />

      <button
        className="fixed right-4 top-4 z-50 grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-white/55 text-rose-500 shadow-soft backdrop-blur-xl transition hover:scale-105"
        aria-label={musicOn ? "Turn music off" : "Turn music on"}
        onClick={() => {
          tactile(8);
          setMusicOn((value) => !value);
        }}
      >
        {musicOn ? <Music2 size={21} /> : <Music size={21} />}
      </button>

      <main className="relative z-10 h-dvh snap-y snap-mandatory overflow-y-auto scroll-smooth">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <OpeningScreen
              key="opening"
              introReady={introReady}
              typedName={typedName}
              onOpen={nextStep}
            />
          )}
          {step === 1 && <BouquetSection key="bouquet" onNext={nextStep} onTap={bouquetTap} bursts={heartBursts} />}
          {step === 2 && <CakeSection key="cake" onNext={nextStep} onBlow={blowCandles} wishMade={wishMade} />}
          {step === 3 && <GallerySection key="gallery" onNext={nextStep} />}
          {step === 4 && <LetterSection key="letter" onNext={nextStep} />}
          {step === 5 && <FinalSection key="final" onReplay={replay} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(255,157,205,.75),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(204,187,255,.75),transparent_28%),linear-gradient(145deg,#fff6df_0%,#ffe7f3_42%,#eee3ff_100%)]" />
      <motion.div
        className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-pink-300/35 blur-3xl"
        animate={{ x: [0, 55, -15, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-lavender-300/40 blur-3xl"
        animate={{ x: [0, -50, 20, 0], y: [0, 35, -25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40" />
    </div>
  );
}

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 7 + Math.random() * 9,
        size: 10 + Math.random() * 15,
        icon: ["♡", "✦", "✧", "🦋", "⋆"][Math.floor(Math.random() * 5)],
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute -bottom-10 text-pink-400/60 drop-shadow-glow"
          style={{ left: `${particle.left}%`, fontSize: particle.size }}
          animate={{ y: [0, -window.innerHeight - 80], x: [0, 24, -18, 10], rotate: [0, 12, -10, 8] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "linear" }}
        >
          {particle.icon}
        </motion.span>
      ))}
    </div>
  );
}

function CursorTrail({ hearts }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] hidden sm:block" aria-hidden="true">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.span
            key={heart.id}
            className="absolute text-sm text-pink-400"
            style={{ left: heart.x, top: heart.y }}
            initial={{ opacity: 0.8, scale: 0.6, y: 0 }}
            animate={{ opacity: 0, scale: 1.4, y: -36 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          >
            💗
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

function SectionShell({ children, className = "" }) {
  return (
    <motion.section
      className={`grid min-h-dvh snap-start place-items-center px-4 py-8 ${className}`}
      initial={{ opacity: 0, filter: "blur(18px)", scale: 0.985 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(18px)", scale: 1.02 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

function GlassCard({ children, className = "", ...props }) {
  return (
    <div
      className={`w-full max-w-[430px] rounded-[2rem] border border-white/70 bg-white/45 p-5 shadow-dream backdrop-blur-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function OpeningScreen({ introReady, typedName, onOpen }) {
  return (
    <SectionShell>
      <GlassCard className="text-center">
        <AnimatePresence mode="wait">
          {!introReady ? (
            <motion.div key="loader" className="py-10" exit={{ opacity: 0, y: -22, scale: 0.95 }}>
              <motion.div
                className="relative mx-auto mb-8 h-36 w-36"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute left-7 top-1 h-11 w-24 origin-bottom rounded-t-2xl bg-gradient-to-r from-pink-300 to-lavender-300 shadow-soft"
                  animate={{ rotate: [0, -10, -22], y: [0, -6, -14] }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
                <div className="absolute bottom-2 left-4 h-24 w-28 rounded-3xl bg-gradient-to-br from-pink-200 via-rose-300 to-lavender-300 shadow-dream" />
                <div className="absolute bottom-2 left-[4.1rem] h-24 w-5 bg-white/60" />
                <div className="absolute bottom-11 left-4 h-5 w-28 bg-white/55" />
                <motion.span className="absolute -right-2 top-4 text-3xl" animate={{ scale: [1, 1.25, 1], rotate: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>💖</motion.span>
                <motion.span className="absolute left-0 top-2 text-2xl" animate={{ y: [0, -14, 0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.6 }}>✨</motion.span>
              </motion.div>
              <p className="font-hand text-3xl text-rose-500">Something special for you…</p>
              <div className="mx-auto mt-5 h-2 w-44 overflow-hidden rounded-full bg-white/70">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-pink-300 to-lavender-400" animate={{ x: ["-100%", "110%"] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} />
              </div>
            </motion.div>
          ) : (
            <motion.div key="intro" className="py-8" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-extrabold text-lavender-600 shadow-soft">
                <Gift size={16} /> tiny secret unlocked
              </p>
              <h1 className="min-h-24 font-hand text-6xl leading-none text-rose-500 drop-shadow-glow">{typedName}<span className="animate-pulse">|</span></h1>
              <p className="mx-auto mt-4 max-w-xs text-lg font-bold leading-relaxed text-plum/80">I made something just for you…</p>
              <GlowButton onClick={onOpen} className="mt-8">Open Your Surprise</GlowButton>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </SectionShell>
  );
}

function GlowButton({ children, onClick, className = "", icon = <Sparkles size={18} /> }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-lavender-400 px-7 py-4 text-base font-black text-white shadow-glow outline-none ring-4 ring-white/40 ${className}`}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
    >
      {icon}
      {children}
    </motion.button>
  );
}

function BouquetSection({ onNext, onTap, bursts }) {
  return (
    <SectionShell>
      <GlassCard className="relative overflow-hidden text-center">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-lavender-600">chapter one</p>
        <h2 className="mt-2 font-hand text-5xl text-rose-500">a tiny bouquet</h2>
        <div className="relative mx-auto mt-7 h-72 w-full max-w-xs cursor-pointer" onClick={onTap} role="button" tabIndex={0} aria-label="Tap the flower bouquet to make tiny hearts appear">
          <motion.div className="absolute inset-x-0 bottom-7 mx-auto h-24 w-40 origin-top rounded-b-full bg-rose-200/80" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.1, ...springTransition }} />
          <motion.div className="absolute bottom-0 left-1/2 h-20 w-44 -translate-x-1/2 rounded-[50%] bg-gradient-to-br from-pink-300 to-lavender-300 shadow-dream" initial={{ rotateX: 80, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.7 }} />
          {[28, 74, 118, 166, 212].map((left, index) => (
            <motion.div key={left} className="absolute bottom-20" style={{ left }} initial={{ scale: 0, y: 60 }} animate={{ scale: 1, y: 0 }} transition={{ delay: 0.35 + index * 0.16, ...springTransition }}>
              <div className="h-28 w-1 origin-bottom rotate-[-10deg] rounded-full bg-green-300" />
              <motion.div className="absolute -left-7 -top-8 grid h-16 w-16 place-items-center rounded-full bg-pink-200 text-3xl shadow-soft" animate={{ rotate: [0, 6, -5, 0], scale: [1, 1.04, 1] }} transition={{ duration: 3 + index * 0.2, repeat: Infinity }}>
                🌸
              </motion.div>
            </motion.div>
          ))}
          <motion.div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-6xl" animate={{ rotate: [-7, 7, -7] }} transition={{ repeat: Infinity, duration: 2.4 }}>🎀</motion.div>
          <AnimatePresence>
            {bursts.map((burst) => (
              <motion.span key={burst.id} className="absolute text-2xl" style={{ left: burst.x, top: burst.y }} initial={{ opacity: 1, scale: 0.3 }} animate={{ opacity: 0, scale: 1.7, y: -70 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>💞</motion.span>
            ))}
          </AnimatePresence>
        </div>
        <p className="mx-auto mt-2 max-w-xs text-lg font-bold leading-relaxed">These flowers may be virtual…<br />but the love behind them is real 🌸</p>
        <p className="mt-3 text-sm font-bold text-rose-400">tap the flowers for tiny hearts</p>
        <GlowButton onClick={onNext} className="mt-6">Next little magic</GlowButton>
      </GlassCard>
    </SectionShell>
  );
}

function CakeSection({ onNext, onBlow, wishMade }) {
  const startY = useRef(null);
  return (
    <SectionShell>
      <GlassCard className="relative overflow-hidden text-center" onTouchStart={(e) => { startY.current = e.touches[0].clientY; }} onTouchEnd={(e) => { if (startY.current && startY.current - e.changedTouches[0].clientY > 45) onBlow(); }}>
        <p className="text-sm font-black uppercase tracking-[0.28em] text-lavender-600">chapter two</p>
        <h2 className="mt-2 font-hand text-5xl text-rose-500">wish time</h2>
        <p className="mt-3 text-lg font-bold">Make a wish and blow the candles 🎂</p>
        <div className="relative mx-auto my-8 h-72 w-72 perspective-dramatic">
          <motion.div className="absolute inset-x-0 top-2 mx-auto flex w-40 justify-around" animate={wishMade ? { y: -8 } : { y: [0, -3, 0] }} transition={{ repeat: wishMade ? 0 : Infinity, duration: 1.5 }}>
            {[0, 1, 2].map((item) => (
              <div key={item} className="relative h-16 w-5 rounded-md bg-[repeating-linear-gradient(45deg,#fff_0_5px,#ff9ccc_5px_10px)] shadow-soft">
                <motion.span className="absolute -top-8 left-1/2 h-8 w-5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_75%,#ffe66d_10%,#ff985f_65%,transparent_70%)] blur-[.2px]" animate={wishMade ? { opacity: 0, scale: 0.2, y: -8 } : { scale: [1, 1.18, 0.94, 1], rotate: [-4, 5, -3] }} transition={{ duration: wishMade ? 0.55 : 0.38, repeat: wishMade ? 0 : Infinity }} />
                {wishMade && <motion.span className="absolute -top-8 left-1/2 text-xs text-gray-400" initial={{ opacity: 0.8, y: 0 }} animate={{ opacity: 0, y: -26, x: 12 }} transition={{ duration: 1.2 }}>smoke</motion.span>}
              </div>
            ))}
          </motion.div>
          <motion.div className="absolute bottom-5 left-1/2 h-28 w-64 -translate-x-1/2 rounded-[2rem] bg-gradient-to-b from-pink-100 via-pink-200 to-rose-300 shadow-dream" animate={{ rotateX: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 3.2 }}>
            <div className="absolute -top-7 left-0 h-14 w-full rounded-[50%] bg-gradient-to-r from-cream via-white to-pink-100 shadow-soft" />
            <div className="absolute left-8 top-4 h-12 w-6 rounded-b-full bg-white/75" />
            <div className="absolute left-28 top-0 h-16 w-7 rounded-b-full bg-white/75" />
            <div className="absolute right-10 top-5 h-10 w-6 rounded-b-full bg-white/75" />
            <div className="absolute bottom-7 left-8 right-8 flex justify-between text-xl">💗 💫 💗</div>
          </motion.div>
          {wishMade && <ConfettiBurst />}
        </div>
        <div className="flex flex-col items-center gap-3">
          <GlowButton onClick={onBlow} icon={<Mic size={18} />}>{wishMade ? "Wish made!" : "Tap mic or swipe up"}</GlowButton>
          <AnimatePresence>
            {wishMade && (
              <motion.p className="font-hand text-5xl text-rose-500" initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>YAYYYY 💖</motion.p>
            )}
          </AnimatePresence>
          <button type="button" onClick={onNext} className="rounded-full bg-white/60 px-5 py-3 font-black text-lavender-600 shadow-soft">continue to memories ✨</button>
        </div>
      </GlassCard>
    </SectionShell>
  );
}

function ConfettiBurst() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 34 }, (_, index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 top-1/2 text-lg"
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{ opacity: 0, scale: 1, x: Math.cos(index) * (95 + Math.random() * 60), y: Math.sin(index) * (95 + Math.random() * 60) }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          {index % 3 === 0 ? "💖" : index % 3 === 1 ? "✨" : "🎊"}
        </motion.span>
      ))}
    </div>
  );
}

function GallerySection({ onNext }) {
  return (
    <SectionShell>
      <GlassCard className="text-center">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-lavender-600">chapter three</p>
        <h2 className="mt-2 font-hand text-5xl text-rose-500">favorite moments</h2>
        <p className="mt-3 text-lg font-bold">Some of my favorite moments with you ✨</p>
        <div className="relative mt-6 grid min-h-[430px] grid-cols-2 gap-4">
          {memoryCards.map((card) => (
            <motion.div
              drag
              dragMomentum={false}
              whileDrag={{ scale: 1.08, zIndex: 10 }}
              key={card.id}
              className="relative h-48 cursor-grab rounded-xl bg-white p-3 shadow-dream active:cursor-grabbing"
              style={{ rotate: card.rotate }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3 + card.id * 0.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -top-3 left-1/2 h-7 w-16 -translate-x-1/2 rotate-[-4deg] rounded-sm bg-cream/80 shadow-soft" />
              <div className="grid h-28 place-items-center rounded-lg border-2 border-dashed border-pink-200 bg-gradient-to-br from-pink-50 to-lavender-100 text-4xl">{card.emoji}</div>
              <p className="mt-3 font-hand text-2xl leading-none text-plum">{card.title}</p>
              <p className="text-xs font-black uppercase tracking-wider text-rose-300">{card.caption}</p>
              <span className="absolute -right-2 top-8 text-xl">✨</span>
            </motion.div>
          ))}
        </div>
        <p className="text-sm font-bold text-plum/65">drag the polaroids around like a scrapbook</p>
        <GlowButton onClick={onNext} className="mt-5">read your letter</GlowButton>
      </GlassCard>
    </SectionShell>
  );
}

function LetterSection({ onNext }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    setVisible(0);
    const timer = setInterval(() => {
      setVisible((count) => {
        if (count >= LETTER_LINES.length) {
          clearInterval(timer);
          return count;
        }
        return count + 1;
      });
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  return (
    <SectionShell className="bg-[linear-gradient(180deg,rgba(66,41,104,.5),rgba(255,191,218,.22))]">
      <GlassCard className="relative overflow-hidden bg-slate-950/35 text-left text-white">
        <div className="absolute inset-0 opacity-70">
          {Array.from({ length: 28 }, (_, index) => <span key={index} className="absolute text-xs" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}>✦</span>)}
        </div>
        <div className="relative">
          <p className="text-center text-sm font-black uppercase tracking-[0.28em] text-pink-100">chapter four</p>
          <h2 className="mt-2 text-center font-hand text-5xl text-pink-100">a tiny letter</h2>
          <div className="mt-7 space-y-4 rounded-[1.5rem] border border-white/20 bg-white/10 p-5 shadow-soft backdrop-blur-xl">
            {LETTER_LINES.slice(0, visible).map((line, index) => (
              <motion.p key={line} className="text-lg font-semibold leading-relaxed text-white/90" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                {line}{index === visible - 1 && visible < LETTER_LINES.length ? <span className="animate-pulse">|</span> : null}
              </motion.p>
            ))}
          </div>
          <p className="mt-4 text-center text-xs font-bold text-pink-100/80">Edit the LETTER_LINES array in src/main.jsx to personalize every sentence.</p>
          <div className="mt-6 text-center"><GlowButton onClick={onNext} icon={<Wand2 size={18} />}>final surprise</GlowButton></div>
        </div>
      </GlassCard>
    </SectionShell>
  );
}

function FinalSection({ onReplay }) {
  return (
    <SectionShell>
      <GlassCard className="relative overflow-hidden text-center">
        <div className="absolute inset-0">{Array.from({ length: 38 }, (_, index) => <motion.span key={index} className="absolute text-2xl" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ scale: [0, 1.2, 0], rotate: [0, 90, 180] }} transition={{ delay: Math.random() * 2, duration: 1.8, repeat: Infinity }}>✨</motion.span>)}</div>
        <div className="relative py-6">
          <div className="mb-3 flex justify-center gap-4 text-5xl"><motion.span animate={{ y: [0, -18, 0] }} transition={{ repeat: Infinity, duration: 2.7 }}>🎈</motion.span><motion.span animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>🐱</motion.span><motion.span animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 2.9 }}>🎈</motion.span></div>
          <motion.div className="mx-auto grid h-44 w-44 place-items-center rounded-full bg-gradient-to-br from-pink-300 to-rose-500 text-8xl shadow-glow" animate={{ scale: [1, 1.12, 1], rotate: [0, 3, -3, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>💖</motion.div>
          <h2 className="mt-7 font-hand text-6xl leading-none text-rose-500">HAPPY BIRTHDAY {HER_NAME} 🎉</h2>
          <p className="mx-auto mt-5 max-w-xs text-xl font-black leading-relaxed text-plum/80">You deserve the entire universe.</p>
          <GlowButton onClick={onReplay} className="mt-8" icon={<RotateCcw size={18} />}>Replay Surprise</GlowButton>
        </div>
      </GlassCard>
    </SectionShell>
  );
}

createRoot(document.getElementById("root")).render(<App />);
