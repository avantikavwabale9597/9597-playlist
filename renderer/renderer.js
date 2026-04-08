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
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const currentTimeE1 = document.getElementById("currentTime");
const durationE1 = document.getElementById("duration");
const likeBtn = document.getElementById("likeBtn");
const likedToggleBtn = document.getElementById("likedToggleBtn");
const likedSection = document.getElementById("likedSection");
const likedPlaylist = document.getElementById("likedPlaylist");
const allSongsSection = document.getElementById("allSongsSection");
const miniArt = document.getElementById("miniArt");
const miniPlayPauseBtn = document.getElementById("miniplayPauseBtn");
const uploadBtn = document.getElementById("uploadBtn");
const audioUpload = document.getElementById("audioUpload");
const coverUpload = document.getElementById("coverUpload");

let current = 0;
let isShuffle = false;
let shuffleOrder = [];
let isRepeat = false;
let showingLiked = false;

const songs = [
  {
    name: "To Find You JK",
    file: "music/to-find-you-jk.mp3",
    art: "images/to-find-you.jpg",
    gradient: "linear-gradient(135deg, #153B2C, #1E4D3A, #b6c757)",
  },
  {
    name: "Blue V",
    file: "music/blue-V.mp3",
    art: "images/layover.jpg",
    gradient: "linear-gradient(135deg, #111111, #2B2B2B, #f1f1f1)",
  },
  {
    name: "Still With You JK",
    file: "music/still-with-you-jk.mp3",
    art: "images/stiill-with-you.jpg",
    gradient: "linear-gradient(135deg, #0C1C2C, #1F3C88, #5a56b7dd)",
  },
  {
    name: "Cheek To Cheek V",
    file: "music/Cheek-to-Cheek-V.mp3",
    art: "images/le-jazz-v.jpg",
    gradient: "linear-gradient(135deg, #5C1A1B, #3B2A23, #1A0F0F)",
  },
  {
    name: "Shot Glass Of Tears JK",
    file: "music/shot-glass-of-tears-jk.mp3",
    art: "images/golden.jpg",
    gradient: "linear-gradient(135deg, #0F3D2E, #184f42, #0A0A0A)",
  },
  {
    name: "For Us V",
    file: "music/for-us-V (1).mp3",
    art: "images/layover.jpg",
    gradient: "linear-gradient(135deg, #111111, #2B2B2B, #f1f1f1)",
  },
  {
    name: "Too Sad To Dance JK",
    file: "music/too-sad-to-dance-jk.mp3",
    art: "images/golden.jpg",
    gradient: "linear-gradient(135deg, #0F3D2E, #184f42, #0A0A0A)",
  },
  {
    name: "Love Me Again V",
    file: "music/love-me-again-V.mp3",
    art: "images/layover.jpg",
    gradient: "linear-gradient(135deg, #111111, #2B2B2B, #f1f1f1)",
  },
];

const savedSongs = JSON.parse(localStorage.getItem("userSongs"));
if (savedSongs) {
  songs.push(...savedSongs);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];

function updateLikeUI() {
  if (!songs[current]) return;
  const isLiked = likedSongs.includes(songs[current].name);
  likeBtn.innerHTML = isLiked
    ? '<i class="fa-solid fa-heart"></i>'
    : '<i class="fa-regular fa-heart"></i>';
  likeBtn.classList.toggle("liked", isLiked);
}

function renderPlaylist(filter = "") {
  playlist.innerHTML = "";

  // ALWAYS SHOW ALL SONGS (just filter by search) - NO LIKED CHECK
  songs.forEach((song, index) => {
    if (!filter || song.name.toLowerCase().includes(filter.toLowerCase())) {
      const li = document.createElement("li");
      li.innerText = song.name;

      // Add heart icon if liked (visual feedback in main playlist)
      if (likedSongs.includes(song.name)) {
        li.innerHTML +=
          ' <i class="fa-solid fa-heart" style="color: #ff3b5c; font-size: 12px; float: right;"></i>';
      }

      li.dataset.index = index;
      li.onclick = () => loadSong(index);

      if (index === current) li.classList.add("active");
      playlist.appendChild(li);
    }
  });
}

function renderLikedSongs() {
  likedPlaylist.innerHTML = "";
  const liked = songs.filter((song) => likedSongs.includes(song.name));

  if (liked.length === 0) {
    likedPlaylist.innerHTML =
      '<li style="color: #888; cursor: default;">No liked songs yet</li>';
    return;
  }

  liked.forEach((song) => {
    const li = document.createElement("li");
    li.innerText = song.name;
    li.onclick = () => {
      const index = songs.findIndex((s) => s.name === song.name);
      loadSong(index);
    };
    likedPlaylist.appendChild(li);
  });
}

function loadSong(index) {
  current = index;
  audio.src = songs[index].file;
  albumArt.src = songs[index].art;
  miniArt.src = songs[index].art;
  title.innerText = songs[index].name;
  miniTitle.innerText = songs[index].name;

  document.body.style.background = songs[index].gradient;
  document.body.style.backgroundSize = "400% 400%";
  document.body.style.animation = "gradientMove 15s ease infinite";

  audio.play();
  playPauseBtn.textContent = "⏸";
  miniPlayPauseBtn.textContent = "⏸";
  miniPlayer.classList.add("show");

  localStorage.setItem("lastSongIndex", index);
  renderPlaylist(searchInput.value);
  updateLikeUI();

  // Close sidebar when song selected
  playlistContainer.classList.remove("show");
  mainContent.classList.remove("blur");
  playlistBtn.textContent = "☰";
}

function playPause() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸";
    miniPlayPauseBtn.textContent = "⏸";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶";
    miniPlayPauseBtn.textContent = "▶";
  }
}

function nextSong() {
  if (isShuffle && shuffleOrder.length > 0) {
    const currentIndex = shuffleOrder.indexOf(current);
    const nextIndex = (currentIndex + 1) % shuffleOrder.length;
    current = shuffleOrder[nextIndex];
  } else {
    current = (current + 1) % songs.length;
  }
  loadSong(current);
}

function prevSong() {
  current = (current - 1 + songs.length) % songs.length;
  loadSong(current);
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  if (isShuffle) {
    shuffleOrder = [...Array(songs.length).keys()];
    shuffleOrder.sort(() => Math.random() - 0.5);
  }
  shuffleBtn.classList.toggle("active", isShuffle);
  shuffleBtn.style.opacity = isShuffle ? "1" : "0.5";
}

// Event Listeners
playlistBtn.addEventListener("click", () => {
  showingLiked = false; // Always show all songs when opening main menu
  allSongsSection.style.display = "block";
  likedSection.style.display = "none";
  likedToggleBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';

  playlistContainer.classList.toggle("show");
  mainContent.classList.toggle("blur");
  playlistBtn.textContent = playlistContainer.classList.contains("show")
    ? "✖"
    : "☰";
  renderPlaylist(searchInput.value);
});

searchInput.addEventListener("input", () => {
  if (!showingLiked) {
    renderPlaylist(searchInput.value.trim());
  }
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextSong();
  }
});

audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeE1.innerText = formatTime(audio.currentTime);
  }
});

audio.addEventListener("loadedmetadata", () => {
  durationE1.innerText = formatTime(audio.duration);
  progress.max = 100;
});

progress.addEventListener("input", () => {
  if (!isNaN(audio.duration)) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

repeatBtn.onclick = () => {
  isRepeat = !isRepeat;
  repeatBtn.style.opacity = isRepeat ? "1" : "0.5";
};

likedToggleBtn.onclick = () => {
  showingLiked = !showingLiked;
  if (showingLiked) {
    // Show ONLY liked songs
    allSongsSection.style.display = "none";
    likedSection.style.display = "block";
    renderLikedSongs();
    likedToggleBtn.innerHTML = '<i class="fa-solid fa-music"></i>'; // Shows "All Songs"
  } else {
    // Show all songs
    allSongsSection.style.display = "block";
    likedSection.style.display = "none";
    renderPlaylist(searchInput.value);
    likedToggleBtn.innerHTML = '<i class="fa-solid fa-heart"></i>'; // Shows "Liked"
  }
};

likeBtn.onclick = () => {
  if (!songs[current]) return;
  const songName = songs[current].name;

  if (likedSongs.includes(songName)) {
    likedSongs = likedSongs.filter((s) => s !== songName);
  } else {
    likedSongs.push(songName);
  }

  localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  updateLikeUI();
  renderPlaylist(searchInput.value); // Update hearts in main list
  renderLikedSongs(); // Update liked list
};

// Initialize
renderPlaylist();
renderLikedSongs();
updateLikeUI();

const savedIndex = localStorage.getItem("lastSongIndex");
if (savedIndex !== null && songs[Number(savedIndex)]) {
  current = Number(savedIndex);
  loadSong(current);
  audio.pause();
  playPauseBtn.textContent = "▶";
  miniPlayPauseBtn.textContent = "▶";
}

// Expose global functions for onclick handlers
window.prevSong = prevSong;
window.nextSong = nextSong;
window.playPause = playPause;
window.toggleShuffle = toggleShuffle;

const uploadModal = document.getElementById("uploadModal");
const uploadConfirm = document.getElementById("uploadConfirm");
const uploadCancel = document.getElementById("uploadCancel");

let tempAudio = null;
let tempCover = null;

uploadBtn.onclick = () => {
  uploadModal.style.display = "flex";
};

uploadCancel.onclick = () => {
  uploadModal.style.display = "none";
  tempAudio = null;
  tempCover = null;
};

audioUpload.addEventListener("change", () => {
  const file = audioUpload.files[0];
  if (!file) return;

  if (file.type !== "audio/mpeg") {
    alert("Only MP3 allowed!");
    audioUpload.value = "";
    return;
  }

  tempAudio = file;
});

coverUpload.addEventListener("change", () => {
  const file = coverUpload.files[0];
  if (!file) return;

  const valid = ["image/jpeg", "image/png", "image/jpg"];
  if (!valid.includes(file.type)) {
    alert("Only JPG/PNG allowed!");
    coverUpload.value = "";
    return;
  }

  tempCover = file;
});

uploadConfirm.onclick = () => {
  if (!tempAudio || !tempCover) {
    alert("Select both audio and Cover!");
    return;
  }

  const readerAudio = new FileReader();
  const readerCover = new FileReader();

  readerAudio.onload = () => {
    readerCover.onload = () => {
      generateGradientFromImage(tempCover, (gradient) => {
        const newSong = {
          name: tempAudio.name.replace(".mp3", ""),
          file: readerAudio.result,
          art: readerCover.result,
          gradient: gradient,
        };

        songs.push(newSong);

        const userSongs = songs.slice(8);
        localStorage.setItem("userSongs", JSON.stringify(userSongs));

        renderPlaylist();

        uploadModal.style.display = "none";
        tempAudio = null;
        tempCover = null;

        alert("Song Uploaded!");
      });
    };

    readerCover.readAsDataURL(tempCover);
  };

  readerAudio.readAsDataURL(tempAudio);
};

function generateGradientFromImage(file, callback) {
  const img = new Image();
  const reader = new FileReader();

  reader.onload = function (e) {
    img.src = e.target.result;
  };

  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let r = 0,
      g = 0,
      b = 0,
      count = 0;

    for (let i = 0; i < data.length; i += 40) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    const gradient = `linear-gradient(135deg, rgb(${r}, ${g}, ${b}), #000000, #ffffff)`;

    callback(gradient);
  };

  reader.readAsDataURL(file);
}
