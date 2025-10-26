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
