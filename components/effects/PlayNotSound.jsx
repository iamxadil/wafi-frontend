// src/effects/PlayNotSound.jsx
let audio;

const PlayNotSound = () => {
  if (!audio) {
    audio = new Audio("../../assets/sounds/notification-sound.mp3");
  }
  audio.currentTime = 0;
  audio.play().catch(err => console.warn("Play blocked:", err));
};

// Unlock once after user interaction
export const unlockAudio = () => {
  if (!audio) {
    audio = new Audio("../../assets/sounds/notification-sound.mp3");
  }
  audio.play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      console.log("🔊 Notification sound unlocked");
    })
    .catch(err => console.warn("Unlock failed:", err));
};

export default PlayNotSound;
