const surpriseBtn = document.getElementById("surprise-btn");
const blowBtn = document.getElementById("blow-btn");
const musicBtn = document.getElementById("music-btn");
const surpriseText = document.getElementById("surprise-text");
const flames = [...document.querySelectorAll(".flame")];
const questItems = [...document.querySelectorAll(".quest-item")];
const questProgress = document.getElementById("quest-progress");
const questText = document.getElementById("quest-text");
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");

const wishes = [
  "💖 You deserve all the happiness in the world!",
  "🎂 May this year be your sweetest one yet!",
  "🌟 Keep shining exactly as you are!",
  "🎁 Hope your day is full of little magical moments!",
  "🫶 Your friendship is one of my favorite gifts in life!",
  "🍓 Sending you extra sweetness for your whole year ahead!",
];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti(duration = 1800) {
  const particles = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.4,
    size: 4 + Math.random() * 6,
    speedY: 1.5 + Math.random() * 2.5,
    sway: (Math.random() - 0.5) * 1.6,
    color: ["#ff7eb6", "#ffd166", "#7bdff2", "#b2f7ef", "#cdb4ff"][Math.floor(Math.random() * 5)],
  }));

  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.sway;
      if (p.y > canvas.height + 20) {
        p.y = -20;
      }

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size * 0.7);
    });

    if (elapsed < duration) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(frame);
}

function beepSequence() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [
    { f: 392, t: 0.0 },
    { f: 392, t: 0.24 },
    { f: 440, t: 0.48 },
    { f: 392, t: 0.72 },
    { f: 523.25, t: 0.96 },
    { f: 493.88, t: 1.2 },
  ];

  notes.forEach((note) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.value = note.f;

    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime + note.t);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + note.t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + note.t + 0.18);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + note.t);
    osc.stop(audioCtx.currentTime + note.t + 0.2);
  });
}

function updateQuest() {
  const completed = questItems.filter((item) => item.classList.contains("done")).length;
  const total = questItems.length;
  const percent = Math.round((completed / total) * 100);
  questProgress.style.width = `${percent}%`;
  questText.textContent = `${completed} / ${total} tasks completed.`;

  if (completed === total) {
    surpriseText.textContent = "🏆 Birthday quest complete! You unlocked extra confetti!";
    launchConfetti(2500);
  }
}

surpriseBtn.addEventListener("click", () => {
  const wish = wishes[Math.floor(Math.random() * wishes.length)];
  surpriseText.textContent = wish;
  launchConfetti();
});

blowBtn.addEventListener("click", () => {
  flames.forEach((flame) => flame.classList.add("out"));
  surpriseText.textContent = "🥳 Make a wish! Candles blown out.";
  launchConfetti(1200);

  setTimeout(() => {
    flames.forEach((flame) => flame.classList.remove("out"));
  }, 4000);
});

musicBtn.addEventListener("click", async () => {
  try {
    beepSequence();
    surpriseText.textContent = "🎶 Tiny birthday tune playing!";
  } catch {
    surpriseText.textContent = "🎵 Tap again to allow audio and play the tune!";
  }
});

questItems.forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("done");
    updateQuest();
  });
});

updateQuest();
