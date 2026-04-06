// js/game.js
import { PHASES, POI, CHOPPER_ROUTINE, MAP } from './data.js';
import { buildRoomRects, buildDoorRects, getRoomId, accessibleRooms, randomPosInRoom, moveWithWall } from './map.js';
import { spawnNPCs, spawnItem, triggerEvent, collectItem, updateNPCs, useAction } from './entities.js';
import { addFloat, updateFloats, floats, notify } from './utils.js';
import { hasUpgrade, getPlayer, earnGold, earnXP, updateStats, setStars } from './player.js';
import { drawRooms, drawDoors, drawPOIs, drawItems, drawNPCs, drawChopper, drawFloats, renderHudTop } from './rendering.js';

// Expose addFloat globally so helpers inside game.js can call it
window._addFloat = (...args) => addFloat(...args);

let G = null;
let animationId = null;
let tapHandlers = null;

// --- EXPORTAO PARA MAIN ---
export function startGame(phaseId) {
  const phase = PHASES.find(p => p.id === phaseId);
  if (!phase) return;

  exitGame();
  showScreen('gameScreen');
  initGame(phase);
}

export function playerAction(k) {
  if (G && G.running) useAction(G, k);
}

export function exitGame() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (G && G.cv && tapHandlers) {
    G.cv.removeEventListener('click', tapHandlers.onTapHandler);
    G.cv.removeEventListener('touchend', tapHandlers.onTouchHandler);
  }

  tapHandlers = null;

  if (G) {
    G.running = false;
  }

  G = null;
}

// --- INICIALIZAO DO JOGO ---
function initGame(phase) {
  const hudTop = document.getElementById('hudTop');
  const hudBot = document.getElementById('hudBot');
  const cvWrap = document.getElementById('cvWrap');
  const cv = document.getElementById('gCv');

  const appH = window.innerHeight;
  const hudTopH = Math.max(56, Math.floor(appH * 0.09));
  const hudBotH = Math.max(54, Math.floor(appH * 0.10));

  if (hudTop) {
    hudTop.style.height = hudTopH + 'px';
    hudTop.style.display = 'flex';
    hudTop.style.alignItems = 'center';
    hudTop.style.justifyContent = 'space-between';
    hudTop.style.padding = '8px 10px';
    hudTop.style.position = 'relative';
    hudTop.style.zIndex = '30';
    hudTop.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.15))';
    hudTop.style.boxSizing = 'border-box';


  }

  if (hudBot) hudBot.style.height = hudBotH + 'px';
  if (cvWrap) {
    cvWrap.style.height = (appH - hudTopH - hudBotH) + 'px';
    cvWrap.style.position = 'relative';
    cvWrap.style.zIndex = '1';
  }

  const CW = window.innerWidth;
  const CH = appH - hudTopH - hudBotH;

  cv.width = CW;
  cv.height = CH;
  cv.style.width = CW + 'px';
  cv.style.height = CH + 'px';
  cv.style.display = 'block';

  const rooms = buildRoomRects(CW, CH);
  const doors = buildDoorRects(MAP.connections, rooms, CW, CH, hasUpgrade('door_boost'));
  const margin = 6;
  const kitchen = rooms.find(r => r.id === 'kitchen') || rooms[0];
  const chopperSz = Math.min(CW, CH) * 0.048;

  G = {
    phase,
    ctx: cv.getContext('2d'),
    cv,
    CW,
    CH,
    rooms,
    doors,
    running: true,
    timeLeft: phase.dur,
    contam: 0,
    saved: 0,
    eaten: 0,
    gold: 0,
    ateList: [],
    items: [],
    npcs: [],
    floats: [],
    lastTime: null,
    frame: 0,
    pendingTap: null,
    margin,
    chopper: {
      x: kitchen.x + kitchen.w / 2,
      y: kitchen.y + kitchen.h / 2,
      sz: chopperSz,
      baseSpeed: phase.speed * Math.min(CW, CH) * 0.18,
      smellRadius: phase.smell * Math.min(CW, CH),
      state: 'wandering',
      targetItem: null,
      roomId: 'kitchen',
      distracted: false,
      distractT: 0,
      distractDest: null,
      called: false,
      calledT: 0,
      calledDest: null,
      paralyzed: false,
      paralyzeT: 0,
      memRooms: [],
      wander: { timer: 0, dest: null, stuck: 0, waypoint: null },
      ai: phase.ai,
      angle: 0,
      animT: 0,
      contamLv: 'normal',
      eatAnim: 0,
      huntWaypoint: null,
      routine: {
        timer: 0,
        actionIdx: 0,
        currentAction: null,
        actionT: 0,
        npcTarget: null,
        knownNPCs: [],
        lastRoom: null,
        dest: null,
        waypoint: null
      }
    },
    actions: {
      distract: { cd: 0, maxCD: 10, count: 3 + (hasUpgrade('dist_count') ? 2 : 0) },
      call:     { cd: 0, maxCD: hasUpgrade('call_cd') ? 8 : 14, count: -1 },
      clean:    { cd: 0, maxCD: 2, count: -1 },
      medicine: { cd: 0, maxCD: 35, count: 1 }
    }
  };

  spawnNPCs(G, phase, rooms, doors, margin);
  attachGameEvents();

  if (phase.id === 1 && !(getPlayer().stars[1])) {
    showTutorial(() => {
      animationId = requestAnimationFrame(gameLoop);
    });
  } else {
    animationId = requestAnimationFrame(gameLoop);
  }
}
function attachGameEvents() {
  if (!G || !G.cv) return;

  const cv = G.cv;

  if (tapHandlers) {
    cv.removeEventListener('click', tapHandlers.onTapHandler);
    cv.removeEventListener('touchend', tapHandlers.onTouchHandler);
  }

  const onTapHandler = e => {
    if (!G || !G.running) return;
    const r = cv.getBoundingClientRect();
    G.pendingTap = {
      x: (e.clientX - r.left) * (G.CW / r.width),
      y: (e.clientY - r.top) * (G.CH / r.height)
    };
  };

  const onTouchHandler = e => {
    if (!G || !G.running) return;
    e.preventDefault();

    const t = e.changedTouches[0];
    const r = cv.getBoundingClientRect();

    G.pendingTap = {
      x: (t.clientX - r.left) * (G.CW / r.width),
      y: (t.clientY - r.top) * (G.CH / r.height)
    };
  };

  tapHandlers = { onTapHandler, onTouchHandler };

  cv.addEventListener('click', onTapHandler);
  cv.addEventListener('touchend', onTouchHandler, { passive: false });
}

function processTap() {
  if (!G || !G.pendingTap) return;

  const p = G.pendingTap;
  G.pendingTap = null;

  for (const d of G.doors) {
    if (p.x >= d.x && p.x <= d.x + d.w && p.y >= d.y && p.y <= d.y + d.h) {
      toggleDoor(d);
      return;
    }
  }

  const hitR = 26 * (G.CW / 480);
  for (const item of G.items) {
    if (item.collected || item.eaten) continue;
    if (Math.hypot(p.x - item.x, p.y - item.y) < hitR) {
      collectItem(G, item);
      return;
    }
  }
}

function toggleDoor(d) {
  d.blocked = !d.blocked;
  d.timer = d.blocked ? d.maxTime : 0;

  if (d.blocked) {
    notify(` Porta bloqueada por ${d.maxTime}s!`);
    addDoorBlockedFloat(d);
  } else {
    notify(' Porta aberta!');
  }
}

function addDoorBlockedFloat(d) {
  if (window._addFloat) window._addFloat('', d.cx, d.cy - 18, '#FF9800');
}

function updateDoors(dt) {
  G.doors.forEach(d => {
    if (d.blocked) {
      d.timer -= dt;

      if (d.timer <= 0) {
        d.blocked = false;
        d.timer = 0;
        notify(' Porta abriu automaticamente!');

        G.npcs.forEach(npc => {
          if (npc.waypoint) {
            const wdist = Math.hypot(npc.x - d.cx, npc.y - d.cy);
            if (wdist < 40) {
              npc.stuckT = 0;
              npc.waypoint = { x: d.cx, y: d.cy };
            }
          }
        });
      }
    }
  });
}

function updateActions(dt) {
  ['distract', 'call', 'clean', 'medicine'].forEach(k => {
    const a = G.actions[k];
    if (a.cd > 0) a.cd = Math.max(0, a.cd - dt);

    const K = k.charAt(0).toUpperCase() + k.slice(1);
    const btn = document.getElementById('ab' + K);
    const cd = document.getElementById('cd' + K);
    const cn = document.getElementById('cn' + K);

    if (btn) btn.classList.toggle('oncd', a.cd > 0 || a.count === 0);
    if (cd) cd.style.width = (a.cd > 0 ? (a.cd / a.maxCD) * 100 : 0) + '%';
    if (cn) cn.textContent = a.count === -1 ? '' : a.count;
  });
}

function updateSpawn(dt) {
  if (G.items.length < G.phase.maxItems && Math.random() < G.phase.spawnRate * 60 * dt) spawnItem(G);
  if (Math.random() < G.phase.eventRate * 60 * dt) triggerEvent(G);
}

// --- IA DO CHOPPER ---
function updateChopper(dt) {
  const c = G.chopper;
  c.animT += dt;

  if (c.paralyzed) {
    c.paralyzeT -= dt;
    if (c.paralyzeT <= 0) {
      c.paralyzed = false;
      c.state = 'wandering';
    }
    return;
  }

  if (c.distracted) {
    c.distractT -= dt;
    if (c.distractT <= 0) {
      c.distracted = false;
      c.state = 'wandering';
    } else if (c.distractDest) {
      moveEntity(c, c.distractDest.x, c.distractDest.y, c.baseSpeed * dt);
    }

    c.roomId = getRoomId(c.x, c.y, G.rooms) || c.roomId;
    return;
  }

  if (c.called) {
    c.calledT -= dt;
    if (c.calledT <= 0) {
      c.called = false;
      c.state = 'wandering';
    } else if (c.calledDest) {
      moveEntity(c, c.calledDest.x, c.calledDest.y, c.baseSpeed * 1.1 * dt);
    }

    c.roomId = getRoomId(c.x, c.y, G.rooms) || c.roomId;
    return;
  }

  const sniffTarget = findTarget(c);
  if (sniffTarget) {
    G.npcs.forEach(npc => {
      if (Math.hypot(c.x - npc.x, c.y - npc.y) < c.smellRadius * 0.9) {
        if (!c.routine.knownNPCs.includes(npc.type)) c.routine.knownNPCs.push(npc.type);
      }
    });

    c.state = 'hunting';
    c.targetItem = sniffTarget;

    let speedMult = 0.85;
    switch (c.ai) {
      case 'basic': speedMult = 0.85; break;
      case 'expanded': speedMult = 0.95; break;
      case 'food': speedMult = 1.0; break;
      case 'memory': speedMult = 1.05; break;
      case 'advanced': speedMult = 1.1; break;
    }

    chaseTarget(dt, c, sniffTarget, speedMult);
    c.roomId = getRoomId(c.x, c.y, G.rooms) || c.roomId;
    c.contamLv = G.contam < 31 ? 'normal' : G.contam < 61 ? 'mild' : 'severe';
    return;
  }

  if (c.routine.knownNPCs.length > 0 && c.ai !== 'basic' && Math.random() < 0.003 * 60 * dt) {
    const knownType = c.routine.knownNPCs[Math.floor(Math.random() * c.routine.knownNPCs.length)];
    const targetNPC = G.npcs.find(n => n.type === knownType);
    if (targetNPC) {
      c.routine.npcTarget = targetNPC;
      c.state = 'npc_follow';
    }
  }

  if (c.state === 'npc_follow' && c.routine.npcTarget) {
    const tnpc = c.routine.npcTarget;
    const arrived = moveEntity(c, tnpc.x, tnpc.y, c.baseSpeed * 0.9 * dt);

    if (arrived || Math.random() < 0.005 * 60 * dt) {
      c.routine.npcTarget = null;
      c.state = 'wandering';
      c.routine.timer = 0;
    }

    c.roomId = getRoomId(c.x, c.y, G.rooms) || c.roomId;
    c.contamLv = G.contam < 31 ? 'normal' : G.contam < 61 ? 'mild' : 'severe';
    return;
  }

  updateChopperRoutine(dt, c);
  c.roomId = getRoomId(c.x, c.y, G.rooms) || c.roomId;
  c.contamLv = G.contam < 31 ? 'normal' : G.contam < 61 ? 'mild' : 'severe';
}

function updateChopperRoutine(dt, c) {
  const r = c.routine;
  r.actionT -= dt;

  if (r.actionT <= 0 || !r.currentAction) {
    r.actionIdx = (r.actionIdx + 1) % CHOPPER_ROUTINE.length;
    const ra = CHOPPER_ROUTINE[r.actionIdx];
    r.currentAction = ra.action;
    r.actionT = ra.dur[0] + Math.random() * (ra.dur[1] - ra.dur[0]);
    r.dest = null;
  }

  const act = r.currentAction;
  let destPOI = null;

  if (act === 'eat') destPOI = 'food';
  else if (act === 'drink') destPOI = 'water';
  else if (act === 'sleep') destPOI = 'bed';
  else if (act === 'pee') destPOI = 'toilet';
  else if (act === 'play') destPOI = 'toys';

  if (destPOI) {
    const poi = getPOICoords(destPOI);
    if (poi) {
      if (!r.dest) {
        r.dest = {
          x: poi.x + (Math.random() - 0.5) * 18,
          y: poi.y + (Math.random() - 0.5) * 18
        };

        if (poi.roomId && poi.roomId !== c.roomId) {
          const door = getDoorBetweenRooms(c.roomId, poi.roomId);
          r.waypoint = (door && !door.blocked) ? { x: door.cx, y: door.cy } : null;
        } else {
          r.waypoint = null;
        }
      }

      const spd = c.baseSpeed * (act === 'play' ? 1.05 : 0.80);
      let tx = r.dest.x;
      let ty = r.dest.y;

      if (r.waypoint) {
        const wdist = Math.hypot(c.x - r.waypoint.x, c.y - r.waypoint.y);
        if (wdist < spd * dt + 6) {
          r.waypoint = null;
        } else {
          tx = r.waypoint.x;
          ty = r.waypoint.y;
        }
      }

      const arr = moveEntity(c, tx, ty, spd * dt);
      if (arr && !r.waypoint) {
        c.state = act === 'sleep' ? 'sleeping' : (act === 'eat' || act === 'drink') ? 'eating' : 'wandering';
      } else {
        c.state = 'wandering';
      }
    } else {
      wander(dt, c, act === 'play' ? 1.0 : 0.75);
    }
  } else {
    r.dest = null;
    const speedMult = c.ai === 'basic' ? 0.70 : c.ai === 'advanced' ? 1.0 : 0.85;
    wander(dt, c, speedMult);
    c.state = 'wandering';
  }
}

function wander(dt, c, speedMult) {
  if (c.state !== 'wandering') c.state = 'wandering';

  c.wander.timer -= dt;
  c.wander.stuck++;

  if (!c.wander.dest || c.wander.timer <= 0 || c.wander.stuck > 180) {
    c.wander.stuck = 0;
    c.wander.timer = 1.5 + Math.random() * 2.5;
    c.wander.waypoint = null;

    const acc = accessibleRooms(c.roomId, G.doors, G.rooms);
    let room;

    if (c.memRooms.length > 0 && Math.random() < 0.35) {
      const memId = c.memRooms[Math.floor(Math.random() * c.memRooms.length)];
      room = acc.find(r => r.id === memId) || acc[Math.floor(Math.random() * acc.length)] || G.rooms[0];
    } else {
      room = acc[Math.floor(Math.random() * acc.length)] || G.rooms[0];
    }

    if (room.id !== c.roomId) {
      const door = getDoorBetweenRooms(c.roomId, room.id);
      if (door && !door.blocked) {
        c.wander.waypoint = { x: door.cx, y: door.cy };
      }
    }

    const pos = randomPosInRoom(room, G.margin + 8);
    c.wander.dest = pos;
  }

  if (c.wander.dest) {
    let tx = c.wander.dest.x;
    let ty = c.wander.dest.y;

    if (c.wander.waypoint) {
      const wdist = Math.hypot(c.x - c.wander.waypoint.x, c.y - c.wander.waypoint.y);
      if (wdist < c.baseSpeed * speedMult * dt + 6) {
        c.wander.waypoint = null;
      } else {
        tx = c.wander.waypoint.x;
        ty = c.wander.waypoint.y;
      }
    }

    const arr = moveEntity(c, tx, ty, c.baseSpeed * speedMult * dt);
    if (arr && !c.wander.waypoint) {
      c.wander.dest = null;
      c.wander.stuck = 0;
    }
  }
}

function getDoorBetweenRooms(roomAId, roomBId) {
  return G.doors.find(d =>
    (d.from === roomAId && d.to === roomBId) ||
    (d.from === roomBId && d.to === roomAId)
  ) || null;
}

function moveEntity(e, tx, ty, spd) {
  const dx = tx - e.x;
  const dy = ty - e.y;
  const dist = Math.hypot(dx, dy);

  if (dist < 2) return true;

  const vx = (dx / dist) * spd;
  const vy = (dy / dist) * spd;
  const np = moveWithWall(e.x, e.y, vx, vy, G.rooms, G.doors);

  e.x = np.x;
  e.y = np.y;
  e.angle = Math.atan2(dy, dx);

  return dist < spd + 2;
}

function findTarget(c) {
  const radius = c.smellRadius;
  let best = null;
  let bd = Infinity;

  const accRooms = new Set(accessibleRooms(c.roomId, G.doors, G.rooms).map(r => r.id));

  G.items.forEach(i => {
    if (i.collected || i.eaten) return;
    if (!accRooms.has(i.roomId)) return;

    const d = Math.hypot(c.x - i.x, c.y - i.y);
    if (d < radius && d < bd) {
      best = i;
      bd = d;
    }
  });

  return best;
}

function chaseTarget(dt, c, item, speedMult) {
  if (!item || item.collected || item.eaten) {
    c.state = 'wandering';
    return;
  }

  let tx = item.x;
  let ty = item.y;

  if (item.roomId && item.roomId !== c.roomId) {
    if (!c.huntWaypoint || c.huntWaypoint.destRoom !== item.roomId) {
      const door = getDoorBetweenRooms(c.roomId, item.roomId);
      if (door && !door.blocked) {
        c.huntWaypoint = { x: door.cx, y: door.cy, destRoom: item.roomId };
      } else {
        c.huntWaypoint = null;
      }
    }

    if (c.huntWaypoint) {
      const wdist = Math.hypot(c.x - c.huntWaypoint.x, c.y - c.huntWaypoint.y);
      if (wdist < c.baseSpeed * speedMult * dt + 6) {
        c.huntWaypoint = null;
      } else {
        tx = c.huntWaypoint.x;
        ty = c.huntWaypoint.y;
      }
    }
  } else {
    c.huntWaypoint = null;
  }

  const arr = moveEntity(c, tx, ty, c.baseSpeed * speedMult * dt);
  if (!c.huntWaypoint && (arr || Math.hypot(c.x - item.x, c.y - item.y) < c.sz * 0.6)) {
    chopperEat(item, c);
  }
}

function chopperEat(item, c) {
  if (item.eaten || item.collected) return;

  item.eaten = true;

  const mult = G.contam > 60 ? 1.3 : 1;
  G.contam = Math.min(100, G.contam + item.def.contam * mult);
  G.eaten++;
  G.ateList.push(item.def);

  const rid = item.roomId;
  if (rid && !c.memRooms.includes(rid)) c.memRooms.push(rid);

  addFloat(item.def.emoji + '! +' + item.def.contam + '%', item.x, item.y - 24, '#FF4444');
  notify(' Chopper comeu ' + item.def.name + '!');
  c.state = 'eating';
  c.eatAnim = 0.6;

  setTimeout(() => {
    if (G && G.chopper && G.chopper.state === 'eating') {
      G.chopper.state = 'wandering';
    }
  }, 900);
}

function updateItems(dt) {
  G.items.forEach(i => {
    i.age += dt;
    i.pulse += dt * 2.5;
    if (i.scale < 1) i.scale = Math.min(1, i.scale + dt * 6);
  });

  G.items = G.items.filter(i => !i.eaten && !(i.collected && i.age > 0.15) && i.age < i.maxAge + 0.5);
}

// --- LOOP PRINCIPAL ---
function gameLoop(ts) {
  if (!G || !G.running) {
    animationId = null;
    return;
  }

  if (!G.lastTime) G.lastTime = ts;

  const dt = Math.min((ts - G.lastTime) / 1000, 0.08);
  G.lastTime = ts;
  G.frame++;

  update(dt);
  render();

  if (G && G.running) {
    animationId = requestAnimationFrame(gameLoop);
  } else {
    animationId = null;
  }
}

function update(dt) {
  G.timeLeft -= dt;
  if (G.timeLeft <= 0) {
    G.timeLeft = 0;
    endPhase(true);
    return;
  }

  if (G.contam >= 100) {
    endPhase(false);
    return;
  }

  updateActions(dt);
  updateDoors(dt);
  updateSpawn(dt);
  updateNPCs(G, dt);
  updateChopper(dt);
  updateItems(dt);
  updateFloats(dt);
  processTap();
}

function render() {
  const ctx = G.ctx;
  const W = G.CW;
  const H = G.CH;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#2a1a0a';
  ctx.fillRect(0, 0, W, H);

  drawRooms(ctx, G.rooms, W, H);
  drawDoors(ctx, G.doors);
  drawPOIs(ctx, W, H);
  drawItems(ctx, G.items, W, H);
  drawNPCs(ctx, G.npcs);
  drawChopper(ctx, G.chopper, G.contam);
  drawFloats(ctx, floats);
  renderHudTop(G);
}

// --- FIM DE FASE ---
function endPhase(victory) {
  if (!G) return;

  G.running = false;

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (G.cv && tapHandlers) {
    G.cv.removeEventListener('click', tapHandlers.onTapHandler);
    G.cv.removeEventListener('touchend', tapHandlers.onTouchHandler);
    tapHandlers = null;
  }

  let stars = 0;
  if (victory) {
    if (G.contam < 30 && G.eaten === 0) stars = 3;
    else if (G.contam < 60 && G.eaten <= 2) stars = 2;
    else stars = 1;
  }

  const ph = G.phase;
  let goldReward = 0;
  let xpReward = 0;

  if (victory) {
    goldReward = Math.floor(Math.random() * (ph.gMax - ph.gMin) + ph.gMin);
    goldReward = Math.floor(goldReward * (stars / 3 + 0.5)) + G.gold;
    xpReward = Math.floor(ph.xp * (stars / 3 + 0.3));
  } else {
    goldReward = Math.floor(G.gold * 0.5);
    xpReward = Math.floor(ph.xp * 0.1);
  }

  earnGold(goldReward);
  earnXP(xpReward);
  updateStats(G.saved, G.eaten, victory ? ph.id : 0);

  if (stars > (getPlayer().stars[ph.id] || 0)) {
    setStars(ph.id, stars);
  }

  setTimeout(() => showEndScreen(victory, stars, goldReward, xpReward), 500);
}

function showEndScreen(victory, stars, gold, xp) {
  showScreen('endScreen');

  const es = document.getElementById('endScreen');
  const titleEl = es.querySelector('.end-title');
  titleEl.textContent = victory ? ' FASE COMPLETA!' : ' CHOPPER PASSOU MAL!';
  titleEl.className = 'end-title ' + (victory ? 'end-win' : 'end-lose');

  const ec = document.getElementById('endCv');
  const asz = Math.min(window.innerWidth * 0.22, 90);
  ec.width = asz;
  ec.height = asz;
  ec.style.width = asz + 'px';
  ec.style.height = asz + 'px';

  let et = 0;
  function ea(ts) {
    if (!document.getElementById('endScreen').classList.contains('active')) return;

    et = ts / 1000;
    const ectx = ec.getContext('2d');
    ectx.clearRect(0, 0, asz, asz);

    const bounce = Math.sin(et * 2) * 3;
    ectx.font = (asz * 0.72) + 'px serif';
    ectx.textAlign = 'center';
    ectx.textBaseline = 'middle';
    ectx.fillText(victory ? '' : '', asz / 2, asz / 2 + bounce);

    requestAnimationFrame(ea);
  }
  requestAnimationFrame(ea);

  document.getElementById('starsRow').innerHTML = ''.repeat(stars) + ''.repeat(3 - stars);

  document.getElementById('endStats').innerHTML = `
    <div class="esr"><span> Itens salvos</span><span class="esv">${G.saved}</span></div>
    <div class="esr"><span> Itens comidos</span><span class="esv">${G.eaten}</span></div>
    <div class="esr"><span> Contaminao</span><span class="esv">${Math.floor(G.contam)}%</span></div>
    <div class="esr"><span> Durao</span><span class="esv">${G.phase.dur}s</span></div>
  `;

  document.getElementById('endRew').innerHTML = `
    <div class="ri"><div class="ri-icon"></div><div class="ri-amt">+${gold}</div><div class="ri-lbl">Gold</div></div>
    <div class="ri"><div class="ri-icon"></div><div class="ri-amt">+${xp}</div><div class="ri-lbl">XP</div></div>
  `;

  const ab = document.getElementById('ateBox');
  if (G.ateList.length > 0) {
    ab.style.display = 'block';
    ab.innerHTML = `
      <div class="ate-t"> Chopper comeu:</div>
      <div class="ate-w">${G.ateList.map(i => `<div class="ate-b">${i.emoji || '?'} ${i.name}</div>`).join('')}</div>
    `;
  } else {
    ab.style.display = 'none';
  }

  const next = PHASES.find(p => p.id === G.phase.id + 1);
  const btns = document.getElementById('endBtns');
  btns.innerHTML = `
    <button class="eb eb-m" id="endMenuBtn"> Menu</button>
    <button class="eb eb-r" id="endRetryBtn"> Tentar</button>
    ${victory && next ? `<button class="eb eb-n" id="endNextBtn"> Prxima</button>` : ''}
  `;

  document.getElementById('endMenuBtn').onclick = () => {
    exitGame();
    showScreen('menuScreen');
  };

  document.getElementById('endRetryBtn').onclick = () => startGame(G.phase.id);

  if (victory && next) {
    document.getElementById('endNextBtn').onclick = () => startGame(next.id);
  }
}

// --- UTILITRIOS ---
function getPOICoords(poiKey) {
  const p = POI[poiKey];
  if (!p) return null;
  return { x: p.lx * G.CW, y: p.ly * G.CH, roomId: p.roomId };
}

function showTutorial(cb) {
  const ov = document.createElement('div');
  ov.className = 'tut-ov';
  ov.innerHTML = `
    <div class="tut-box">
      <div class="tut-icon"></div>
      <div class="tut-title">Como Jogar</div>
      <div class="tut-txt">
         Chopper anda sozinho e tenta comer tudo!<br><br>
         <b>Toque nos itens</b> para remov-los<br>
         <b>Toque nas portas</b> para bloquear  Chopper no passa!<br>
         <b>Distrair</b> desvia o Chopper<br>
         <b>Chamar</b> traz o Chopper<br>
         No deixe a contaminao encher!
      </div>
      <button class="tut-btn" id="tutBtn">Vamos l! </button>
    </div>
  `;

  document.getElementById('gameScreen').appendChild(ov);
  document.getElementById('tutBtn').onclick = () => {
    ov.remove();
    cb();
  };
}

// --- AUXILIAR PARA showScreen ---
function showScreen(id) {
  if (window.showScreenGlobal) window.showScreenGlobal(id);
  else console.warn('showScreen not set');
}

export function setShowScreen(fn) {
  window.showScreenGlobal = fn;
}