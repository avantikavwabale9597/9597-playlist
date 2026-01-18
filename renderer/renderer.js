const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const title = document.getElementById("song-title");
const playlist = document.getElementById("playlist");
const playlistBtn = document.getElementById("playlistBtn");
const playlistContainer = document.getElementById("playlistContainer");
const searchInput = document.getElementById("searchInput");
const playPauseBtn = document.getElementById("playPauseBtn");

let current = 0;

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

function renderPlaylist(filter = "") {
  playlist.innerHTML = "";

  songs.forEach((song, index) => {
    if (song.name.toLowerCase().includes(filter.toLowerCase())) {
      const li = document.createElement("li");
      li.innerText = song.name;
      li.dataset.index = index;
      li.onclick = () => loadSong(index);

      if (index === current) li.classList.add("active");

      playlist.appendChild(li);
    }
  });
}
renderPlaylist();

playlistBtn.addEventListener("click", () => {
  playlistContainer.classList.toggle("show");

  playlistBtn.textContent = playlistContainer.classList.contains("show")
    ? "✖"
    : "☰";
});

function loadSong(index) {
  current = index;
  audio.src = songs[index].file;
  title.innerText = songs[index].name;
  audio.play();
  playPauseBtn.textContent = "⏸";
  renderPlaylist(searchInput.value);
}

searchInput.addEventListener("input", (e) => {
  renderPlaylist(e.target.value);
});

function playPause() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶";
  }
}

function nextSong() {
  current = (current + 1) % songs.length;
  loadSong(current);
}

function prevSong() {
  current = (current - 1 + songs.length) % songs.length;
  loadSong(current);
}

audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});
