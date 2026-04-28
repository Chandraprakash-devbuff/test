const surpriseBtn = document.getElementById("surprise-btn");
const blowBtn = document.getElementById("blow-btn");
const surpriseText = document.getElementById("surprise-text");
const flames = [...document.querySelectorAll(".flame")];
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");

const wishes = [
  "💖 You deserve all the happiness in the world!",
  "🎂 May this year be your sweetest one yet!",
  "🌟 Keep shining exactly as you are!",
  "🎁 Hope your day is full of little magical moments!",
];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti(duration = 1800) {
  const particles = Array.from({ length: 130 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.4,
    size: 4 + Math.random() * 6,
    speedY: 1.5 + Math.random() * 2.5,
    sway: (Math.random() - 0.5) * 1.5,
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
