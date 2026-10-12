(function () {
  const C = window.GAME_CONFIG;
  const $ = (id) => document.getElementById(id);
  const STORE_KEY = "lathinh2010_results";

  const screens = ["screen-login", "screen-confirm", "screen-played", "screen-game"];
  const show = (id) => screens.forEach((s) => $(s).classList.toggle("hidden", s !== id));

  let player = null;
  let startAt = null;
  let timerId = null;
  let moves = 0;
  let matched = 0;
  let open = [];
  let lock = false;
  const sessionId = Math.random().toString(36).slice(2, 10);

  // ---------- helpers ----------
  const pad = (n) => String(n).padStart(2, "0");
  const fmtClock = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const fmtDuration = (ms) => {
    const s = Math.floor(ms / 1000);
    return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
  };
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const loadResults = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
  };
  const saveResult = (name, data) => {
    try {
      const all = loadResults();
      all[name] = data;
      localStorage.setItem(STORE_KEY, JSON.stringify(all));
    } catch {}
  };
  const report = (payload) => {
    if (!C.sheetWebhookUrl) return;
    // text/plain để tránh CORS preflight với Google Apps Script
    fetch(C.sheetWebhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, sessionId, userAgent: navigator.userAgent }),
    }).catch(() => {});
  };

  // ---------- login ----------
  const select = $("player-select");
  C.players.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = p.name;
    select.appendChild(opt);
  });
  select.addEventListener("change", () => ($("btn-next").disabled = select.value === ""));

  $("btn-next").addEventListener("click", () => {
    player = C.players[+select.value];
    const prev = loadResults()[player.name];
    if (C.onePlayPerDevice && prev && prev.finishedAt) {
      $("played-name").textContent = player.name;
      $("played-info").textContent =
        `Bắt đầu ${new Date(prev.startedAt).toLocaleString("vi-VN")} · ` +
        `Hoàn thành trong ${fmtDuration(prev.durationMs)} · ${prev.moves} lượt lật`;
      show("screen-played");
      return;
    }
    $("confirm-name").textContent = player.name;
    show("screen-confirm");
  });
  $("btn-back").addEventListener("click", () => show("screen-login"));
  $("btn-played-back").addEventListener("click", () => show("screen-login"));
  $("btn-start").addEventListener("click", startGame);

  // ---------- game ----------
  function startGame() {
    const total = C.rows * C.cols;
    const pairs = total / 2;
    const icons = shuffle(C.icons.slice()).slice(0, pairs);
    const deck = shuffle([...icons, ...icons]);

    $("board-image").src = player.image;
    $("win-image").src = player.image;
    const board = $("board");
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${C.cols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${C.rows}, 1fr)`;
    deck.forEach((icon) => {
      const tile = document.createElement("button");
      tile.className = "tile";
      tile.type = "button";
      tile.setAttribute("aria-label", "Thẻ úp");
      tile.dataset.icon = icon;
      tile.style.border = "0";
      tile.style.padding = "0";
      tile.style.background = "transparent";
      tile.innerHTML =
        `<div class="tile-inner"><div class="tile-face tile-back"></div>` +
        `<div class="tile-face tile-front">${icon}</div></div>`;
      tile.addEventListener("click", () => flip(tile));
      board.appendChild(tile);
    });

    moves = 0; matched = 0; open = []; lock = false;
    startAt = new Date();
    $("stat-name").textContent = player.name;
    $("stat-start").textContent = fmtClock(startAt);
    $("stat-moves").textContent = "0";
    $("stat-time").textContent = "00:00";
    clearInterval(timerId);
    timerId = setInterval(() => ($("stat-time").textContent = fmtDuration(Date.now() - startAt)), 500);

    saveResult(player.name, { startedAt: startAt.toISOString() });
    report({ event: "start", name: player.name, startedAt: startAt.toISOString() });
    show("screen-game");
  }

  function flip(tile) {
    if (lock || tile.classList.contains("flipped") || tile.classList.contains("matched")) return;
    tile.classList.add("flipped");
    open.push(tile);
    if (open.length < 2) return;

    moves++;
    $("stat-moves").textContent = moves;
    const [a, b] = open;
    open = [];
    if (a.dataset.icon === b.dataset.icon) {
      a.classList.add("matched");
      b.classList.add("matched");
      matched += 2;
      if (matched === C.rows * C.cols) setTimeout(finish, 900);
    } else {
      lock = true;
      setTimeout(() => {
        a.classList.add("shake"); b.classList.add("shake");
        setTimeout(() => {
          a.classList.remove("flipped", "shake");
          b.classList.remove("flipped", "shake");
          lock = false;
        }, 350);
      }, 600);
    }
  }

  function finish() {
    clearInterval(timerId);
    const finishedAt = new Date();
    const durationMs = finishedAt - startAt;
    $("stat-time").textContent = fmtDuration(durationMs);
    const data = {
      startedAt: startAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs,
      moves,
    };
    saveResult(player.name, data);
    report({ event: "finish", name: player.name, ...data, durationSec: Math.round(durationMs / 1000) });

    $("win-name").textContent = player.name;
    $("win-stats").textContent =
      `Bắt đầu lúc ${fmtClock(startAt)} · Hoàn thành trong ${fmtDuration(durationMs)} · ${moves} lượt lật`;
    $("win").classList.remove("hidden");
  }
  $("btn-close-win").addEventListener("click", () => $("win").classList.add("hidden"));

  // ---------- petals ----------
  const petals = document.querySelector(".petals");
  ["🌸", "🌷", "💮", "🌹"].forEach((p, k) => {
    for (let i = 0; i < 4; i++) {
      const el = document.createElement("span");
      el.className = "petal";
      el.textContent = p;
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDuration = 9 + Math.random() * 10 + "s";
      el.style.animationDelay = -Math.random() * 15 + "s";
      el.style.fontSize = 14 + Math.random() * 14 + "px";
      petals.appendChild(el);
    }
  });
})();
