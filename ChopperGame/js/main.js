// js/main.js
import { PHASES, SHOP_DB } from './data.js';
import { loadPlayer, getPlayer, earnGold, hasUpgrade, addOwned, addUpgrade, savePlayer } from './player.js';
import { notify, setText } from './utils.js';
import { startGame, playerAction, setShowScreen, exitGame } from './game.js';

let AW = 480, AH = 854;
const APP = document.getElementById('app');

// --- RESIZE ---
function resize() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const ratio = 480 / 854;
  let w, h;

  if (vw / vh < ratio) {
    w = vw;
    h = vw / ratio;
  } else {
    h = vh;
    w = vh * ratio;
  }

  w = Math.floor(w);
  h = Math.floor(h);

  AW = w;
  AH = h;

  APP.style.width = w + 'px';
  APP.style.height = h + 'px';
}
window.addEventListener('resize', () => setTimeout(resize, 100));

// --- SCREEN MANAGER ---
export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.style.display = 'none';
    s.classList.remove('active');
  });

  const t = document.getElementById(id);
  if (!t) return;

  t.style.display = 'flex';
  t.classList.add('active');

  if (id === 'menuScreen') {
    updateMenuUI();
    animMenuDog();
  }
  if (id === 'phaseScreen') buildPhaseGrid();
  if (id === 'shopScreen') buildShop();
}

// --- MENU UI ---
function updateMenuUI() {
  const pd = getPlayer();
  setText('mGold', pd.gold);
  setText('mXP', pd.xp);
  setText('mLv', pd.level);
  setText('shGold', pd.gold);

  const p = Math.min(100, (pd.xp / pd.xpNext) * 100);
  const bar = document.getElementById('mXpBar');
  if (bar) bar.style.width = p + '%';
}

let menuAnimID = null;
function animMenuDog() {
  const cv = document.getElementById('menuCv');
  if (!cv) return;

  const sz = Math.min(AW * 0.35, 130);
  cv.width = sz;
  cv.height = sz;
  cv.style.width = sz + 'px';
  cv.style.height = sz + 'px';

  let t = 0;
  if (menuAnimID) cancelAnimationFrame(menuAnimID);

  function f(ts) {
    const menuScreen = document.getElementById('menuScreen');
    if (!menuScreen || !menuScreen.classList.contains('active')) return;

    t = ts / 1000;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, sz, sz);

    const bounce = Math.sin(t * 1.5) * 4;
    ctx.font = (sz * 0.72) + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐕', sz / 2, sz / 2 + bounce);

    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(sz / 2, sz * 0.82, sz * 0.24, sz * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();

    menuAnimID = requestAnimationFrame(f);
  }

  menuAnimID = requestAnimationFrame(f);
}

// --- PHASE GRID ---
function buildPhaseGrid() {
  const g = document.getElementById('phGrid');
  if (!g) return;

  g.innerHTML = '';
  const pd = getPlayer();

  PHASES.forEach(p => {
    const st = pd.stars[p.id] || 0;
    const ul = p.reqXP === 0 || (pd.stats.done >= (p.id - 1));

    const c = document.createElement('div');
    c.className = `ph-card ${!ul ? 'locked' : ''} ${st > 0 ? 'done' : ''}`;
    c.innerHTML = `
      <div class="ph-icon">${p.icon}</div>
      <div class="ph-name">${p.name}</div>
      <div class="ph-stars">${'⭐'.repeat(st)}${'☆'.repeat(3 - st)}</div>
      <div class="ph-num">Fase ${p.id}</div>
      ${!ul ? `<div style="font-size:8px;color:#FFD700">🔒${p.reqXP}XP</div>` : ''}
    `;

    if (ul) c.onclick = () => startGame(p.id);
    g.appendChild(c);
  });
}

// --- SHOP ---
let shopTab = 'prevention';

function buildShop() {
  setText('shGold', getPlayer().gold);

  const tabs = document.getElementById('shTabs');
  if (!tabs) return;

  tabs.innerHTML = '';
  const tn = {
    prevention: '🛡️Prev.',
    control: '🎮Ctrl',
    recovery: '💊Recup.',
    cosmetics: '🎨Cosm.'
  };

  Object.keys(tn).forEach(k => {
    const b = document.createElement('div');
    b.className = `sh-tab ${k === shopTab ? 'act' : ''}`;
    b.textContent = tn[k];
    b.onclick = () => {
      shopTab = k;
      buildShop();
    };
    tabs.appendChild(b);
  });

  const grid = document.getElementById('shGrid');
  if (!grid) return;

  grid.innerHTML = '';

  (SHOP_DB[shopTab] || []).forEach(item => {
    const owned = (getPlayer().owned || []).includes(item.id);
    const afford = getPlayer().gold >= item.cost;

    const d = document.createElement('div');
    d.className = `sh-item ${owned ? 'owned' : ''}`;
    d.innerHTML = `
      <div class="si-icon">${item.icon}</div>
      <div class="si-name">${item.name}</div>
      <div class="si-desc">${item.desc}</div>
      ${
        !owned
          ? `<button class="si-btn" style="${!afford ? 'opacity:.4;cursor:not-allowed' : ''}" data-id="${item.id}" data-cat="${shopTab}" data-cost="${item.cost}">🪙${item.cost}</button>`
          : `<div style="font-size:10px;color:#4CAF50;font-weight:bold">✓ Adquirido</div>`
      }
    `;
    grid.appendChild(d);
  });

  grid.querySelectorAll('.si-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const cat = btn.dataset.cat;
      const cost = parseInt(btn.dataset.cost);
      buyItem(id, cat, cost);
    });
  });
}

function buyItem(id, cat, cost) {
  const pd = getPlayer();

  if (pd.gold < cost) {
    notify('❌ Gold insuficiente!');
    return;
  }

  if ((pd.owned || []).includes(id)) return;

  earnGold(-cost);
  addOwned(id);

  const item = (SHOP_DB[cat] || []).find(i => i.id === id);
  if (item && item.type === 'upgrade') addUpgrade(item.eff);

  notify(`✅ ${item ? item.name : id} comprado!`);
  buildShop();
  updateMenuUI();
}

// --- CLOUDS ---
function initClouds() {
  const c = document.getElementById('menuClouds');
  if (!c) return;

  for (let i = 0; i < 5; i++) {
    const e = document.createElement('div');
    e.className = 'cloud';

    const s = 28 + Math.random() * 48;
    e.style.cssText = `
      width:${s * 2}px;
      height:${s}px;
      top:${4 + Math.random() * 38}%;
      animation-duration:${13 + Math.random() * 17}s;
      animation-delay:${-Math.random() * 18}s;
      opacity:${0.32 + Math.random() * 0.42}
    `;

    c.appendChild(e);
  }
}

// --- INICIALIZAÇÃO ---
function init() {
  loadPlayer();
  resize();
  updateMenuUI();
  initClouds();
  setShowScreen(showScreen);
  showScreen('menuScreen');

  // Botões do menu
  const btnPlay = document.getElementById('btnPlay');
  const btnShop = document.getElementById('btnShop');

  if (btnPlay) btnPlay.onclick = () => showScreen('phaseScreen');
  if (btnShop) btnShop.onclick = () => showScreen('shopScreen');

  // Botão sair da partida — handler global pois o botão é recriado a cada frame pelo renderHudTop
  window._exitGameHandler = () => {
    const ok = confirm('Deseja sair da partida?');
    if (!ok) return;
    exitGame();
    showScreen('phaseScreen');
  };

  // Botões de voltar
  const backPhases = document.getElementById('backFromPhases');
  const backShop = document.getElementById('backFromShop');

  if (backPhases) backPhases.onclick = () => showScreen('menuScreen');
  if (backShop) backShop.onclick = () => showScreen('menuScreen');

  // Botões de ação do jogo
  document.querySelectorAll('#hudBot .ab').forEach(btn => {
    const action = btn.dataset.action;
    if (action) btn.onclick = () => playerAction(action);
  });
}

// Iniciar
init();