const app = document.getElementById("app");

let saves = JSON.parse(localStorage.getItem("saves") || "[]");

// ---------- UI Setup ----------
function showMainMenu() {
  app.innerHTML = `
    <h1>Urban Ascend</h1>
    <button id="play">Play</button>
    <button id="settings">Settings</button>
  `;

  document.getElementById("play").onclick = showSaveMenu;
  document.getElementById("settings").onclick = showSettings;
}

function showSettings() {
  app.innerHTML = `
    <h1>Settings</h1>
    <label>
      Dark Mode
      <input type="checkbox" id="dark-toggle">
    </label>
    <label>
      Show Tips
      <input type="checkbox" id="show-tips-toggle">
    </label>
    <label>
      Confirm Deletes
      <input type="checkbox" id="confirm-deletes-toggle">
    </label>
    <button id="back">Back</button>
  `;

  const darkToggle = document.getElementById("dark-toggle");

  // --- Load saved settings or set defaults ---
  const dark = localStorage.getItem("darkMode") === "true";
  const showTips = localStorage.getItem("showTips");
  const confirmDeletes = localStorage.getItem("confirmDeletes");

  darkToggle.checked = dark;
  document.body.classList.toggle("dark", dark);

  document.getElementById("show-tips-toggle").checked = showTips !== "false";
  document.getElementById("confirm-deletes-toggle").checked = confirmDeletes !== "false";

  // --- Handle setting changes ---
  darkToggle.onchange = e => {
    localStorage.setItem("darkMode", e.target.checked);
    document.body.classList.toggle("dark", e.target.checked);
  };

  document.getElementById("show-tips-toggle").onchange = e => {
    localStorage.setItem("showTips", e.target.checked);
  };
  document.getElementById("confirm-deletes-toggle").onchange = e => {
    localStorage.setItem("confirmDeletes", e.target.checked);
  };

  document.getElementById("back").onclick = showMainMenu;
}

function showSaveMenu() {
  app.innerHTML = `
    <h1>Your Cities</h1>
    <div id="save-list"></div>
    <button id="back">Back</button>
  `;

  const list = document.getElementById("save-list");
  list.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const slot = saves[i];
    const div = document.createElement("div");
    div.className = "save-slot";

    if (slot) {
      div.innerHTML = `
        <strong>${slot.name}</strong><br>
        <button data-index="${i}" class="play">Play</button>
        <button data-index="${i}" class="rename">Rename</button>
        <button data-index="${i}" class="delete">Delete</button>
      `;
    } else {
      div.innerHTML = `
        <em>Empty Slot</em><br>
        <button data-index="${i}" class="new">Build New City</button>
      `;
    }

    list.appendChild(div);
  }

  list.onclick = e => {
    const i = e.target.dataset.index;
    if (e.target.classList.contains("play")) playGame(i);
    if (e.target.classList.contains("rename")) renameSave(i);
    if (e.target.classList.contains("delete")) deleteSave(i);
    if (e.target.classList.contains("new")) createNewCity(i);
  };

  document.getElementById("back").onclick = showMainMenu;
}

function createNewCity(i) {
  const name = prompt("Enter your city's name:");
  if (!name) return;
  saves[i] = { name, population: 0, money: 1000 };
  saveAll();
  showSaveMenu();
}

function renameSave(i) {
  const name = prompt("Enter new city name:", saves[i].name);
  if (name) {
    saves[i].name = name;
    saveAll();
    showSaveMenu();
  }
}

function deleteSave(i) {
  const confirmDeletes = localStorage.getItem("confirmDeletes") !== "false";
  if (confirmDeletes && !confirm("Delete this city?")) return;
  saves[i] = null;
  saveAll();
  showSaveMenu();
}

function playGame(i) {
  const save = saves[i];
  app.innerHTML = `
    <h1>${save.name}</h1>
    <p>Population: ${save.population}</p>
    <p>Money: $${save.money}</p>
    <button id="back">Main Menu</button>
  `;

  document.getElementById("back").onclick = showMainMenu;
}

// ---------- Save System ----------
function saveAll() {
  localStorage.setItem("saves", JSON.stringify(saves));
}

// ---------- Autosave ----------
setInterval(saveAll, 1000);

// ---------- Start Game ----------
showMainMenu();
