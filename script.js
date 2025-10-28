// -------------------- Global Game Data --------------------
const MAX_SAVES = 10;
let saves = JSON.parse(localStorage.getItem("urbanSaves") || "[]");
let currentCity = null;
let gameStats = { population: 0, money: 0, happiness: 100 };

// -------------------- DOM Elements --------------------
const screens = {
  main: document.getElementById("main-menu"),
  settings: document.getElementById("settings-menu"),
  save: document.getElementById("save-menu"),
  game: document.getElementById("game-screen"),
};
const playBtn = document.getElementById("play-btn");
const settingsBtn = document.getElementById("settings-btn");
const settingsBackBtn = document.getElementById("settings-back-btn");
const saveBackBtn = document.getElementById("save-back-btn");
const darkToggle = document.getElementById("dark-mode-toggle");
const saveList = document.getElementById("save-list");
const cityNameDisplay = document.getElementById("city-name-display");
const returnMainBtn = document.getElementById("return-main-btn");

// -------------------- Screen Switching --------------------
function showScreen(name) {
  for (let key in screens) screens[key].classList.add("hidden");
  screens[name].classList.remove("hidden");
}

// -------------------- Settings --------------------
darkToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", darkToggle.checked);
  localStorage.setItem("darkMode", darkToggle.checked);
});

document.addEventListener("DOMContentLoaded", () => {
  const dark = localStorage.getItem("darkMode") === "true";
  darkToggle.checked = dark;
  document.body.classList.toggle("dark", dark);
});

// -------------------- Save System --------------------
function renderSaves() {
  saveList.innerHTML = "";
  for (let i = 0; i < MAX_SAVES; i++) {
    const save = saves[i];
    const div = document.createElement("div");
    div.className = "save-slot";

    if (save) {
      div.innerHTML = `
        <span>${save.name}</span>
        <div>
          <button onclick="loadCity(${i})">Play</button>
          <button onclick="renameCity(${i})">Rename</button>
          <button onclick="deleteCity(${i})">Delete</button>
        </div>`;
    } else {
      div.innerHTML = `<button onclick="newCity(${i})">Build New City</button>`;
    }
    saveList.appendChild(div);
  }
}

function saveAll() {
  localStorage.setItem("urbanSaves", JSON.stringify(saves));
}

function newCity(slot) {
  const name = prompt("Enter your city name:");
  if (!name) return;
  saves[slot] = { name, stats: { population: 100, money: 1000, happiness: 100 } };
  saveAll();
  renderSaves();
}

function loadCity(slot) {
  currentCity = slot;
  gameStats = saves[slot].stats;
  cityNameDisplay.textContent = saves[slot].name;
  showScreen("game");
}

function renameCity(slot) {
  const newName = prompt("Enter new name for your city:");
  if (!newName) return;
  saves[slot].name = newName;
  saveAll();
  renderSaves();
}

function deleteCity(slot) {
  const confirmDelete = confirm("Are you sure you want to delete this city?");
  if (!confirmDelete) return;
  saves[slot] = null;
  saveAll();
  renderSaves();
}

// -------------------- Autosave --------------------
setInterval(() => {
  if (currentCity !== null) {
    saves[currentCity].stats = gameStats;
    saveAll();
  }
}, 1000);

// -------------------- Game Loop (placeholder) --------------------
function gameTick() {
  if (currentCity !== null) {
    // Example idle income
    gameStats.money += 1;
    document.getElementById("stat-money").textContent = gameStats.money;
  }
}
setInterval(gameTick, 1000);

// -------------------- Event Listeners --------------------
playBtn.onclick = () => {
  renderSaves();
  showScreen("save");
};
settingsBtn.onclick = () => showScreen("settings");
settingsBackBtn.onclick = () => showScreen("main");
saveBackBtn.onclick = () => showScreen("main");
returnMainBtn.onclick = () => {
  currentCity = null;
  showScreen("main");
};

// -------------------- Initialize --------------------
showScreen("main");
