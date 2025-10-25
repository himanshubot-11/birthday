const music = document.getElementById("music");
const flipSound = document.getElementById("flipSound");
const playBtn = document.getElementById("playBtn");
const book = document.getElementById("book");
const pages = document.querySelectorAll(".page");
const finalScreen = document.getElementById("final");

let currentPage = 0;
let isPlaying = false;

playBtn.addEventListener("click", () => {
  if (!isPlaying) {
    music.play();
    isPlaying = true;
    playBtn.style.display = "none";
    book.classList.remove("hidden");
  }
});

pages.forEach((page, i) => {
  page.addEventListener("click", () => {
    flipSound.currentTime = 0;
    flipSound.play();
    page.classList.add("flipped");
    if (i === pages.length - 1) {
      setTimeout(() => {
        book.classList.add("hidden");
        finalScreen.classList.remove("hidden");
      }, 1500);
    }
  });
});
