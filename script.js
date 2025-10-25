const openBtn = document.getElementById('openDiary');
const diaryPopup = document.getElementById('diaryPopup');
const pages = diaryPopup.querySelectorAll('.diary-page');
const nextBtn = document.getElementById('nextPage');
const celebrationPopup = document.getElementById('celebrationPopup');
const homeBtn = document.getElementById('homeBtn');
const birthdayBox = document.getElementById('birthdayBox');
const floatingEmojis = document.querySelector('.floating-emojis');
const music = document.getElementById('birthdayMusic');

let currentPage = 0;
const emojis = ['❤️','💕','💖','💘','💞','💓','❣️','💗','🎂','💋','✨','🎉'];

// Floating emojis randomly
function createFloatingEmoji(){
  const span = document.createElement('span');
  span.innerText = emojis[Math.floor(Math.random()*emojis.length)];
  span.style.left = Math.random()*90 + 'vw';
  span.style.fontSize = (20+Math.random()*20)+'px';
  span.style.animationDuration = (5+Math.random()*5)+'s';
  floatingEmojis.appendChild(span);
  setTimeout(()=>floatingEmojis.removeChild(span),10000);
}
setInterval(createFloatingEmoji,200);

// Typing effect
function typeText(page){
  const text = page.dataset.text;
  page.innerHTML = '';
  let idx = 0;
  const span = document.createElement('span');
  span.classList.add('typing-text');
  page.appendChild(span);
  const interval = setInterval(()=>{
    span.innerText = text.slice(0,idx+1);
    idx++;
    if(idx>=text.length) clearInterval(interval);
  },50);
}

// Open diary
openBtn.onclick = ()=>{
  birthdayBox.style.display='none';
  diaryPopup.classList.add('active');
  pages[currentPage].style.display='block';
  typeText(pages[currentPage]);
  music.play();
};

// Next page
nextBtn.onclick = ()=>{
  pages[currentPage].style.display='none';
  currentPage++;
  if(currentPage<pages.length){
    pages[currentPage].style.display='block';
    typeText(pages[currentPage]);
  }else{
    diaryPopup.classList.remove('active');
    celebrationPopup.classList.add('active');
  }
};

// Home button
homeBtn.onclick = ()=>{
  celebrationPopup.classList.remove('active');
  currentPage=0;
  birthdayBox.style.display='block';
  pages.forEach(p=>p.style.display='none');
  music.pause();
  music.currentTime=0;
};
