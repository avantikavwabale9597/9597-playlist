let playlists = JSON.parse(localStorage.getItem("playlists")) || {};

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
const songNameInput = document.getElementById("songNameInput");
const audioFileName = document.getElementById("audioFileName");
const coverFileName = document.getElementById("coverFileName");

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

  songs.forEach((song, index) => {
    if (!filter || song.name.toLowerCase().includes(filter.toLowerCase())) {
      const li = document.createElement("li");

      // Main content with menu
      li.innerHTML = `
        <span class="song-name">${song.name}</span>
        <span class="menu" data-index="${index}">⋮</span>
      `;

      // ❤️ Liked icon
      if (likedSongs.includes(song.name)) {
        const heart = document.createElement("i");
        heart.className = "fa-solid fa-heart";
        heart.style.color = "#ff3b5c";
        heart.style.fontSize = "12px";
        heart.style.marginRight = "8px";
        heart.style.float = "right";
        li.appendChild(heart);
      }

      // 🗑 Delete button (only user songs)
      if (song.isUser) {
        const delBtn = document.createElement("i");
        delBtn.className = "fa-solid fa-trash";
        delBtn.style.float = "right";
        delBtn.style.marginRight = "10px";
        delBtn.style.cursor = "pointer";
        delBtn.style.color = "#aaa";

        delBtn.onclick = (e) => {
          e.stopPropagation();
          deleteSong(index);
        };

        li.appendChild(delBtn);
      }

      const menuBtn = li.querySelector(".menu");

      menuBtn.onclick = (e) => {
        e.stopPropagation();
        showPlaylistOptions(index);
      };

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

playlistBtn.addEventListener("click", () => {
  showingLiked = false;
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
    allSongsSection.style.display = "none";
    likedSection.style.display = "block";
    renderLikedSongs();
    likedToggleBtn.innerHTML = '<i class="fa-solid fa-music"></i>'; // Shows "All Songs"
  } else {
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
  renderPlaylist(searchInput.value);
  renderLikedSongs();
};

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
  if (file) {
    audioFileName.textContent = file.name;
  }
  if (!file) return;

  if (file.type !== "audio/mpeg") {
    showToast("Only MP3 allowed!");
    audioUpload.value = "";
    return;
  }

  tempAudio = file;
});

coverUpload.addEventListener("change", () => {
  const file = coverUpload.files[0];
  if (file) {
    coverFileName.textContent = file.name;
  }
  if (!file) return;

  const valid = ["image/jpeg", "image/png", "image/jpg"];
  if (!valid.includes(file.type)) {
    showToast("Only JPG/PNG allowed!");
    coverUpload.value = "";
    songNameInput.value = "";
    return;
  }

  tempCover = file;
});

uploadConfirm.onclick = () => {
  if (!tempAudio || !tempCover) {
    showToast("Select both audio and Cover!");
    return;
  }

  const readerAudio = new FileReader();
  const readerCover = new FileReader();

  readerAudio.onload = () => {
    readerCover.onload = () => {
      generateGradientFromImage(tempCover, (gradient) => {
        const newSong = {
          name:
            songNameInput.value.trim() !== ""
              ? songNameInput.value.trim()
              : tempAudio.name.replace(".mp3", ""),
          file: readerAudio.result,
          art: readerCover.result,
          gradient: gradient,
          isUser: true,
        };
        console.log("Input Name:", songNameInput.value);
        songs.push(newSong);

        const userSongs = songs.slice(8);
        localStorage.setItem("userSongs", JSON.stringify(userSongs));

        renderPlaylist();

        uploadModal.style.display = "none";
        tempAudio = null;
        tempCover = null;

        showToast("Song Uploaded!");
        songNameInput.value = "";
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

function deleteSong(index) {
  if (!songs[index].isUser) {
    showToast("Default songs cannot be deleted");
    return;
  }

  songs.splice(index, 1);

  const userSongs = songs.filter((s) => s.isUser);
  localStorage.setItem("userSongs", JSON.stringify(userSongs));

  if (current === index) {
    audio.pause();
    title.innerText = "Select a song";
    albumArt.src = "";
  }
  renderPlaylist();
}
document.addEventListener("keydown", (e) => {
  if (document.activeElement.tagName === "INPUT") return;

  switch (e.code) {
    case "Space":
      e.preventDefault();
      playPause();
      break;

    case "ArrowRight":
      nextSong();
      break;

    case "ArrowLeft":
      prevSong();
      break;

    case "KeyM":
      audio.muted = !audio.muted;
      break;
  }
});

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function createPlaylist(name) {
  if (!name.trim()) return;

  if (playlists[name]) {
    showToast("Playlist already exists");
    return;
  }

  playlists[name] = [];
  localStorage.setItem("playlists", JSON.stringify(playlists));

  showToast("Playlist Created!");
  renderPlaylist();
}

function addToPlaylist(playlistName, songIndex) {
  const song = songs[songIndex];

  if (!playlists[playlistName].some((s) => s.name === song.name)) {
    playlists[playlistName].push(song);
    localStorage.setItem("playlists", JSON.stringify(playlists));
    showToast("Added to " + playlistName);
  } else {
    showToast("Already in Playlist");
  }
}

function showPlaylistOptions(index) {
  const playlistNames = Object.keys(playlists);

  if (playlistNames.length === 0) {
    showToast("No Playlists yet");
    return;
  }

  playlistNames.forEach((name) => {
    const add = confirm(`Add to playlist: ${name}?`);
    if (add) {
      addToPlaylist(name, index);
    }
  });
}

const playlistModal = document.getElementById("playlistModal");
const playlistNameInput = document.getElementById("playlistNameInput");
const createPlaylistConfirm = document.getElementById("createPlaylistConfirm");
const createPlaylistCancel = document.getElementById("createPlaylistCancel");

document.getElementById("createPlaylistBtn").onclick = () => {
  playlistModal.style.display = "flex";
};

createPlaylistCancel.onclick = () => {
  playlistModal.style.display = "none";
  playlistNameInput.value = "";
};

createPlaylistConfirm.onclick = () => {
  const name = playlistNameInput.value.trim();

  if (!name) {
    showToast("Enter Palylist Name");
    return;
  }

  createPlaylist(name);
  playlistModal.style.display = "none";
  playlistNameInput.value = "";
};
