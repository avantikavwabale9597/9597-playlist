const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const title = document.getElementById("song-title");
const playlist = document.getElementById("playlist");
const playlistBtn = document.getElementById("playlistBtn");
const playlistContainer = document.getElementById("playlistContainer");
const searchInput = document.getElementById("searchInput");
const playPauseBtn = document.getElementById("playPauseBtn");
const mainContent = document.getElementById("mainContent");
const miniPlayer = document.getElementById("miniPlayer");
const miniTitle = document.getElementById("miniTitle");
const albumArt = document.getElementById("albumArt");
const canvas = document.getElementById("waveform");
const ctx = document.getElementById("2d");

let current = 0;
let isShuffle = false;
let isRepeat = false;

const songs = [
  {
    name: "To Find You JK",
    file: "music/to-find-you-jk.mp3",
    art: "images/to-find-you.jpg",
  },
  { name: "Blue V", file: "music/blue-V.mp3", art: "images/layover.jpg" },
  {
    name: "Still With You JK",
    file: "music/still-with-you-jk.mp3",
    art: "images/stiill-with-you.jpg",
  },
  {
    name: "Cheek To Cheek V",
    file: "music/Cheek-to-Cheek-V.mp3",
    art: "images/le-jazz-v.jpg",
  },
  {
    name: "Shot Glass Of Tears JK",
    file: "music/shot-glass-of-tears-jk.mp3",
    art: "images/golden.jpg",
  },
  {
    name: "For Us V",
    file: "music/for-us-V (1).mp3",
    art: "images/layover.jpg",
  },
  {
    name: "Too Sad To Dance JK",
    file: "music/too-sad-to-dance-jk.mp3",
    art: "images/golden.jpg",
  },
  {
    name: "Love Me Again V",
    file: "music/love-me-again-V.mp3",
    art: "images/layover.jpg",
  },
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
  mainContent.classList.toggle("blur");

  playlistBtn.textContent = playlistContainer.classList.contains("show")
    ? "✖"
    : "☰";
});

function loadSong(index) {
  current = index;
  audio.src = songs[index].file;
  albumArt.src = songs[index].art;
  miniArt.src = songs[index].art;

  title.innerText = songs[index].name;
  miniTitle.innerText = songs[index].name;

  audio.play();
  playPauseBtn.textContent = "⏸";
  miniPlayer.classList.add("show");

  renderPlaylist(searchInput.value);
}

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
