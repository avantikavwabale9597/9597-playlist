const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const title = document.getElementById("song-title");
const playlist = document.getElementById("playlist");
const playlistBtn = document.getElementById("playlistBtn");
const playlistContainer = document.getElementById("playlistContainer");

const songs = [
  { name: "blue v", file: "music/blue-V.mp3" },
  { name: "cheek-to-cheek v", file: "music/Cheek-to-Cheek-V.mp3" },
  { name: "for-us v", file: "music/for-us-V (1).mp3" },
  { name: "love-me-again v", file: "music/love-me-again-V.mp3" },
  { name: "shot-glass-of-tears jk", file: "music/shot-glass-of-tears-jk.mp3" },
  { name: "still-with you jk", file: "music/still-with-you-jk.mp3" },
  { name: "to-find-you jk", file: "music/to-find-you-jk.mp3" },
  { name: "too-sad-to-dance jk", file: "music/too-sad-to-dance-jk.mp3" },
];

let current = 0;

songs.forEach((song, index) => {
  const li = document.createElement("li");
  li.innerText = song.name;
  li.onclick = () => loadSong(index);
  playlist.appendChild(li);
});

playlistBtn.addEventListener("click", () => {
  if (playlistContainer.style.display === "none") {
    playlistContainer.style.display = "block";
  } else {
    playlistContainer.style.display = "none";
  }
});

function loadSong(index) {
  current = index;
  audio.src = songs[index].file;
  title.innerText = songs[index].name;
  audio.play();
}

function playPause() {
  audio.paused ? audio.play() : audio.pause();
}

function nextSong() {
  current = (current + 1) % songs.length;
  loadSong(current);
}

function prevSong() {
  current = (current - 1 + songs.length) % songs.length;
  loadSong(current);
}

audio.addEventListener("timeUpdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});
