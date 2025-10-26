// script.js
document.addEventListener('DOMContentLoaded', function() {
    const card = document.getElementById('birthdayCard');
    const audio = document.getElementById('birthdayMusic');
    const modal = document.getElementById('popupModal');
    const closeBtn = document.querySelector('.close');

    card.addEventListener('click', function() {
        card.classList.add('open');
        audio.play().catch(function(error) {
            console.log("Audio playback failed:", error);
        });
        setTimeout(function() {
            modal.style.display = 'flex';
        }, 3000);
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
    // schedule repeating loop
    const loopLen = schedule(t);
    // set up an interval to reschedule slightly before loop ends
    loopId = setInterval(() => {
      // schedule again after a small gap
      schedule(audioCtx.currentTime + 0.1);
    }, Math.max(4000, loopLen * 1000 - 500));

    isPlaying = true;
  }

  function stopSynth() {
    if (loopId) { clearInterval(loopId); loopId = null; }
    if (audioCtx) { audioCtx.close(); audioCtx = null; }
    isPlaying = false;
  }

  // Try to start music; if autoplay blocked, show fallback button
  async function tryStartMusic() {
    try {
      startSynth();
      // browsers often require a user gesture; check state
      if (audioCtx && audioCtx.state === 'suspended') {
        // will show fallback
        throw new Error('suspended');
      }
    } catch (e) {
      // show fallback play button
      playFallback.classList.remove('hidden');
      playFallback.addEventListener('click', async () => {
        try {
          startSynth();
          playFallback.classList.add('hidden');
        } catch (err) {
          alert('Playback failed — your browser may block sound.');
        }
      });
    }
  }

  // If user leaves page, stop synth & confetti
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stopSynth(); stopConfetti(); }
  });
})();
