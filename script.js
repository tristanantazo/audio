const container = document.getElementById("image-scroll");
const audio = document.getElementById("reel");

let current = 0;
let target = 0;
let lastTarget = 0;
let velocity = 0;
let isPlaying = false;

const backdrop = document.querySelector(".backdrop");

let unlocked = false;

backdrop.addEventListener("click", () => {
  audio.volume = 0.01; // silent start
  audio.play().then(() => {
    unlocked = true;
    backdrop.classList.add("hide");
    console.log("Audio unlocked");
  }).catch(err => console.log(err));
});

// Set page height
const totalHeight = container.scrollHeight;
// document.body.style.height = totalHeight + "px";

// // iOS audio unlock
// container.addEventListener("touchstart", () => {
//   audio.play().then(() => audio.pause()).catch(() => {});
// }, { once: true });


// Capture scroll
container.addEventListener("scroll", () => {
//   target = window.scrollY;
  target = container.scrollTop;
  console.log(`Scroll: ${target}px`);
});

// Smooth scroll loop
function animate() {
  current += (target - current) * 0.08;
//   container.style.transform = `translateY(${-current}px)`;

  velocity = Math.abs(target - lastTarget);

  controlReel(velocity);

  lastTarget = target;
  requestAnimationFrame(animate);
}

animate();


// function controlReel(speed) {
//   if (speed > 0.2) {
//     if (!isPlaying) {
//       // Do NOT reset currentTime
//       audio.play().catch(() => {});
//       isPlaying = true;
//     }

//     // Adjust playback rate and volume based on scroll speed
//     audio.playbackRate = clamp(speed * 0.04, 0.8, 2.2);
//     audio.volume = clamp(speed * 0.03, 0.3, 1);
//   } else if (isPlaying) {
//     slowStop();
//   }
// }

function controlReel(speed) {
  if (!unlocked) return;

  if (!isPlaying) {
    audio.loop = true;
    audio.play().catch(() => {});
    isPlaying = true;
  }

  if (speed > 0.2) {
    audio.playbackRate = clamp(speed * 0.04, 0.8, 2.2);
    audio.volume = clamp(speed * 0.03, 0.3, 1);
  } else {
    // Instead of pause → just fade volume
    audio.volume *= 0.5;

    if (audio.volume < 0.05) {
      audio.volume = 0.05;
    }
  }
}


function slowStop() {
  let rate = audio.playbackRate;
  let vol = audio.volume;

  const stop = setInterval(() => {
    rate -= 0.04;
    vol -= 0.04;

    if (rate <= 0.8 || vol <= 0) {
      audio.pause();
      audio.playbackRate = 1;
      audio.volume = 1;
      isPlaying = false;
      clearInterval(stop);
      return;
    }

    audio.playbackRate = rate;
    audio.volume = vol;
  }, 40);
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
