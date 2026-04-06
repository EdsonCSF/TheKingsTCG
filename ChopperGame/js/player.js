let PD = {
  gold: 0,
  xp: 0,
  level: 1,
  xpNext: 100,
  stars: {},
  owned: [],
  upgrades: {},
  stats: { saved: 0, eaten: 0, done: 0 }
};

export function loadPlayer() {
  try {
    const s = localStorage.getItem("chV3");
    if (s) PD = Object.assign(PD, JSON.parse(s));
  } catch(e) {}
}

export function savePlayer() {
  try {
    localStorage.setItem("chV3", JSON.stringify(PD));
  } catch(e) {}
}

export function getPlayer() {
  return PD;
}

export function earnGold(amount) {
  PD.gold += amount;
  savePlayer();
}

export function earnXP(amount) {
  PD.xp += amount;
  while (PD.xp >= PD.xpNext) {
    PD.xp -= PD.xpNext;
    PD.level++;
    PD.xpNext = Math.floor(PD.xpNext * 1.5);
    // Notify será chamado por quem chamar esta função (import circular evitado)
  }
  savePlayer();
}

export function hasUpgrade(eff) {
  return !!(PD.upgrades && PD.upgrades[eff]);
}

export function addOwned(itemId) {
  if (!PD.owned.includes(itemId)) PD.owned.push(itemId);
  savePlayer();
}

export function addUpgrade(eff) {
  if (!PD.upgrades) PD.upgrades = {};
  PD.upgrades[eff] = true;
  savePlayer();
}

export function setStars(phaseId, stars) {
  if (stars > (PD.stars[phaseId] || 0)) PD.stars[phaseId] = stars;
  savePlayer();
}

export function updateStats(saved, eaten, donePhaseId) {
  PD.stats.saved += saved;
  PD.stats.eaten += eaten;
  if (donePhaseId > (PD.stats.done || 0)) PD.stats.done = donePhaseId;
  savePlayer();
}