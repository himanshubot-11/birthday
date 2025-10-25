// Heart + star background
const background = document.getElementById("background");
const shapes = ["💖", "⭐"];
for (let i = 0; i < 40; i++) {
  const el = document.createElement("div");
  el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
  el.className = Math.random() > 0.5 ? "heart" : "star";
  el.style.left = Math.random() * 100 + "vw";
  el.style.animationDuration = 6 + Math.random() * 6 + "s";
  el.style.fontSize = 15 + Math.random() * 25 + "px";
  background.appendChild(el);
}

// Music + animation logic
const startBtn = document.getElementById("startButton");
const book = document.querySelector(".book");
const pages = document.querySelectorAll(".page");
const song = document.getElementById("birthdaySong");
const flip = document.getElementById("flipSound");
const finalScreen = document.querySelector(".final-screen");

startBtn.addEventListener("click", async () => {
  startBtn.classList.add("hidden");
  book.classList.remove("hidden");

  try {
    await song.play();
  } catch (e) {
    alert("Tap the button again to enable music 🎵");
  }

  let i = 0;
  const interval = setInterval(() => {
    if (i < pages.length) {
      flip.play();
      pages[i].classList.add("flip");
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        book.classList.add("hidden");
        finalScreen.classList.remove("hidden");
      }, 1500);
    }
  }, 2500);
});
