// js/entities.js
import { HDEF, NPC_DEF, NPC_ROUTES_MORNING, NPC_ROUTES_AFTERNOON, NPC_ROOM_ACTIONS, POI } from './data.js';
import { accessibleRooms, randomPosInRoom, getRoomId, moveWithWall, getDoorBetween, getDoorCenter } from './map.js';
import { addFloat, notify } from './utils.js';
import { hasUpgrade } from './player.js';

// --- SPAWN DE NPCs ---
export function spawnNPCs(G, phase, rooms, doors, margin) {
  const routes = phase.id % 2 === 0 ? NPC_ROUTES_AFTERNOON : NPC_ROUTES_MORNING;
  phase.npcs.forEach((type) => {
    if (type === 'bird') return;
    const def = NPC_DEF[type];
    if (!def) return;
    const npcRoutes = routes[type] || NPC_ROUTES_MORNING[type] || ["kitchen"];
    const startRoomId = npcRoutes[0];
    const sr = rooms.find(r => r.id === startRoomId) || rooms[0];
    G.npcs.push({
      type, def,
      x: sr.x + sr.w/2 + (Math.random() - 0.5) * 20,
      y: sr.y + sr.h/2 + (Math.random() - 0.5) * 20,
      tx: sr.x + sr.w/2,
      ty: sr.y + sr.h/2,
      moveT: Math.random() * 4,
      dropT: 0,
      routes: npcRoutes,
      routeIdx: 0,
      roomId: startRoomId,
      sz: def.sz * Math.min(G.CW, G.CH),
      actionT: 0,
      currentAction: null,
      idle: false,
      idleT: 0,
      // Waypoint system: when crossing rooms, NPC must walk through door first
      waypoint: null,   // intermediate door center target
      destRoomId: null, // final destination room
      stuckT: 0         // stuck counter
    });
  });
  if (phase.id >= 2) spawnBird(G);
}

function spawnBird(G) {
  const backyard = G.rooms.find(r => r.id === 'backyard');
  if (!backyard) return;
  const bx = backyard.x + backyard.w * 0.60;
  const by = backyard.y + backyard.h * 0.30;
  G.npcs.push({
    type: 'bird', def: NPC_DEF.bird,
    x: bx, y: by, tx: bx, ty: by,
    moveT: 0, dropT: 0,
    routes: ["backyard"], routeIdx: 0,
    roomId: "backyard",
    sz: Math.min(G.CW, G.CH) * 0.045,
    birdTimer: 7 + Math.random() * 6,
    actionT: 0, currentAction: null, idle: false, idleT: 0
  });
}

function npcDrop(G, npc) {
  const drops = G.phase.hz.filter(id => npc.def.drops.includes(id));
  if (!drops.length) return;
  const id = drops[Math.floor(Math.random() * drops.length)];
  const def = HDEF[id];
  if (!def) return;
  G.items.push({
    id: "dr_" + Date.now(), def, roomId: npc.roomId,
    x: npc.x + (Math.random() - 0.5) * 18,
    y: npc.y + (Math.random() - 0.5) * 18,
    age: 0, maxAge: 22, collected: false, eaten: false, scale: 0, pulse: 0
  });
  addFloat("💥 " + npc.def.emoji + " derrubou!", npc.x, npc.y - 24, "#FF9800");
}

function npcNextRoute(G, npc) {
  npc.routeIdx = (npc.routeIdx + 1) % npc.routes.length;
  const wantedId = npc.routes[npc.routeIdx];
  const accRooms = accessibleRooms(npc.roomId, G.doors, G.rooms);
  const accIds = new Set(accRooms.map(r => r.id));

  // If destination is blocked (door closed), stay in current room or pick accessible one
  const destId = accIds.has(wantedId) ? wantedId : npc.roomId;
  npc.destRoomId = destId;
  npc.waypoint = null;

  if (destId !== npc.roomId) {
    // Need to pass through a door — find the connecting door and set it as waypoint
    const door = getDoorBetween(npc.roomId, destId, G.doors);
    if (door && !door.blocked) {
      const dc = getDoorCenter(door);
      npc.waypoint = { x: dc.x, y: dc.y };
    }
  }

  const dest = G.rooms.find(r => r.id === destId);
  if (dest) {
    const pos = randomPosInRoom(dest, G.margin + 8);
    npc.tx = pos.x;
    npc.ty = pos.y;
  }
  npc.stuckT = 0;
}

// --- UPDATE NPCs ---
export function updateNPCs(G, dt) {
  // Respawn pássaro
  if (G.phase.id >= 2 && Math.random() < 0.0003 * 60 * dt) {
    const hasBird = G.npcs.some(n => n.type === 'bird');
    if (!hasBird) spawnBird(G);
  }

  for (let idx = 0; idx < G.npcs.length; idx++) {
    const npc = G.npcs[idx];
    if (npc.type === 'bird') {
      npc.birdTimer -= dt;
      npc.moveT += dt;
      const backyard = G.rooms.find(r => r.id === 'backyard');
      if (!backyard) { G.npcs.splice(idx,1); idx--; continue; }
      const cx = backyard.x + backyard.w * 0.60;
      const cy = backyard.y + backyard.h * 0.32;
      const rx = backyard.w * 0.20;
      const ry = backyard.h * 0.12;
      const bx = cx + Math.sin(npc.moveT * 0.9) * rx;
      const by = cy + Math.cos(npc.moveT * 0.6) * ry;
      npc.x = Math.max(backyard.x + npc.sz, Math.min(backyard.x + backyard.w - npc.sz, npc.x + (bx - npc.x) * dt * 5));
      npc.y = Math.max(backyard.y + npc.sz, Math.min(backyard.y + backyard.h - npc.sz, npc.y + (by - npc.y) * dt * 5));
      npc.roomId = 'backyard';
      npc.dropT += dt;
      if (npc.dropT > 4 && Math.random() < 0.012 * dt * 60 && G.items.length < G.phase.maxItems) {
        npc.dropT = 0;
        const drops = G.phase.hz.filter(id => NPC_DEF.bird.drops.includes(id));
        if (drops.length) {
          const id = drops[Math.floor(Math.random() * drops.length)];
          const def = HDEF[id];
          if (def) {
            G.items.push({
              id: "bird_" + Date.now(), def, roomId: "backyard",
              x: npc.x + (Math.random() - 0.5) * 20,
              y: npc.y + npc.sz,
              age: 0, maxAge: 20, collected: false, eaten: false, scale: 0, pulse: 0
            });
            addFloat("🐦 Largou algo!", npc.x, npc.y - npc.sz - 8, "#27AE60");
          }
        }
      }
      if (npc.birdTimer <= 0) { G.npcs.splice(idx,1); idx--; }
      continue;
    }

    // NPC normal
    const spd = npc.def.speed * Math.min(G.CW, G.CH) * dt;

    // If NPC has a waypoint (door center), go there first before heading to final dest
    let targetX = npc.tx, targetY = npc.ty;
    if (npc.waypoint) {
      const doorDist = Math.hypot(npc.x - npc.waypoint.x, npc.y - npc.waypoint.y);
      if (doorDist < spd + 6) {
        // Arrived at door center, clear waypoint and continue to final dest
        npc.waypoint = null;
      } else {
        targetX = npc.waypoint.x;
        targetY = npc.waypoint.y;
      }
    }

    const dx = targetX - npc.x, dy = targetY - npc.y, dist = Math.hypot(dx, dy);

    if (npc.idle) {
      npc.idleT -= dt;
      if (npc.idleT <= 0) {
        npc.idle = false;
        npc.currentAction = null;
        npc.moveT += dt;
        if (npc.moveT > 1 + Math.random() * 2) {
          npc.moveT = 0;
          npcNextRoute(G, npc);
        }
      }
      npc.dropT += dt;
      if (npc.dropT > 2 && Math.random() < npc.def.dropChance * 60 * dt * 1.5 && G.items.length < G.phase.maxItems) {
        npc.dropT = 0;
        npcDrop(G, npc);
      }
      continue;
    }

    if (dist < spd + 3) {
      npc.x = npc.tx;
      npc.y = npc.ty;
      npc.stuckT = 0;
      npc.moveT += dt;
      if (npc.moveT > 0.5) {
        const roomActions = (NPC_ROOM_ACTIONS[npc.type] || {})[npc.roomId] || ["passear"];
        const chosenAction = roomActions[Math.floor(Math.random() * roomActions.length)];
        if (chosenAction === 'pegar_item') {
          npcDrop(G, npc);
          npc.moveT = 0;
          npcNextRoute(G, npc);
        } else {
          npc.idle = true;
          npc.currentAction = chosenAction;
          npc.idleT = 1.5 + Math.random() * 3.0;
          npc.moveT = 0;
        }
      }
    } else {
      const vx = (dx / dist) * spd, vy = (dy / dist) * spd;
      const prevX = npc.x, prevY = npc.y;
      const np = moveWithWall(npc.x, npc.y, vx, vy, G.rooms, G.doors);
      npc.x = np.x;
      npc.y = np.y;
      // Stuck detection: if NPC barely moved, increment stuck counter
      const moved = Math.hypot(npc.x - prevX, npc.y - prevY);
      if (moved < 0.5) {
        npc.stuckT += dt;
        if (npc.stuckT > 2.5) {
          // NPC is stuck — door might be blocked. Reset route to accessible destination.
          npc.stuckT = 0;
          npc.waypoint = null;
          const accRooms = accessibleRooms(npc.roomId, G.doors, G.rooms);
          const room = accRooms[Math.floor(Math.random() * accRooms.length)] || G.rooms.find(r => r.id === npc.roomId) || G.rooms[0];
          const pos = randomPosInRoom(room, G.margin + 8);
          npc.tx = pos.x;
          npc.ty = pos.y;
          npc.destRoomId = room.id;
        }
      } else {
        npc.stuckT = 0;
      }
      const actualRoom = getRoomId(npc.x, npc.y, G.rooms);
      if (actualRoom) npc.roomId = actualRoom;
    }

    npc.dropT += dt;
    if (npc.dropT > 5 && Math.random() < npc.def.dropChance * 60 * dt && G.items.length < G.phase.maxItems) {
      npc.dropT = 0;
      npcDrop(G, npc);
    }
  }
}

// --- SPAWN DE ITEM ---
export function spawnItem(G, roomId = null) {
  const hz = G.phase.hz;
  if (!hz.length) return;
  const id = hz[Math.floor(Math.random() * hz.length)];
  const def = HDEF[id];
  if (!def) return;
  const room = roomId ? G.rooms.find(r => r.id === roomId) || G.rooms[0] : G.rooms[Math.floor(Math.random() * G.rooms.length)];
  const pos = randomPosInRoom(room, G.margin + 10);
  G.items.push({
    id: "it_" + Date.now() + "_" + Math.random(), def, roomId: room.id,
    x: pos.x, y: pos.y, age: 0, maxAge: 25,
    collected: false, eaten: false, scale: 0, pulse: Math.random() * Math.PI * 2
  });
}

// --- EVENTO ALEATÓRIO ---
export function triggerEvent(G) {
  if (Math.random() < 0.6) spawnItem(G);
  else if (G.npcs.length) {
    const npc = G.npcs[Math.floor(Math.random() * G.npcs.length)];
    const drops = G.phase.hz.filter(id => npc.def.drops.includes(id));
    if (drops.length && G.items.length < G.phase.maxItems) {
      const id = drops[Math.floor(Math.random() * drops.length)];
      const def = HDEF[id];
      if (def) {
        G.items.push({
          id: "ev_" + Date.now(), def, roomId: npc.roomId,
          x: npc.x + (Math.random() - 0.5) * 18,
          y: npc.y + (Math.random() - 0.5) * 18,
          age: 0, maxAge: 20, collected: false, eaten: false, scale: 0, pulse: 0
        });
      }
    }
  }
}

// --- COLETAR ITEM ---
export function collectItem(G, item) {
  if (item.collected || item.eaten) return;
  item.collected = true;
  G.saved++;
  G.gold += 2;
  addFloat("✓+2🪙", item.x, item.y - 16, "#4CAF50");
}

// --- AÇÕES DO JOGADOR ---
export function useAction(G, k) {
  if (!G.running) return;
  const a = G.actions[k];
  if (!a || a.cd > 0 || a.count === 0) return;
  const c = G.chopper;
  if (k === 'distract') {
    if (a.count <= 0) { notify("Sem distrações!"); return; }
    a.count--;
    a.cd = a.maxCD;
    const distractOptions = ['toys','food'];
    const chosenPOI = distractOptions[Math.floor(Math.random() * distractOptions.length)];
    const poi = getPOICoords(G, chosenPOI);
    const dur = hasUpgrade('dist_dur') ? 6 : 4;
    c.distracted = true;
    c.distractT = dur;
    if (poi) {
      c.distractDest = { x: poi.x + (Math.random() - 0.5) * 20, y: poi.y + (Math.random() - 0.5) * 20 };
      const icon = chosenPOI === 'toys' ? '🎾' : '🍖';
      addFloat(icon + " Distraído!", c.x, c.y - 30, "#FFD700");
      notify(icon + " Chopper foi " + (chosenPOI === 'toys' ? "brincar!" : "comer petisco!"));
      const iconEl = document.getElementById('distractIcon');
      if (iconEl) iconEl.textContent = chosenPOI === 'toys' ? '🎾' : '🍖';
    } else {
      const acc = accessibleRooms(c.roomId, G.doors, G.rooms);
      const room = acc[Math.floor(Math.random() * acc.length)] || G.rooms[0];
      c.distractDest = { x: room.x + room.w/2 + (Math.random() - 0.5) * 30, y: room.y + room.h/2 + (Math.random() - 0.5) * 30 };
      addFloat("🎾 Distraído!", c.x, c.y - 30, "#FFD700");
      notify("🎾 Chopper distraído!");
    }
    c.state = "distracted";
  } else if (k === 'call') {
    a.cd = a.maxCD;
    const bed = getPOICoords(G, 'bed');
    c.called = true;
    c.calledT = 4;
    c.calledDest = bed ? { x: bed.x, y: bed.y } : { x: G.rooms.find(r => r.id === 'living').x + G.CW * 0.08, y: G.CH * 0.38 };
    c.state = "called";
    addFloat("🏠 Caminha!", c.x, c.y - 30, "#4CAF50");
    notify("🏠 Chopper foi para a caminha!");
  } else if (k === 'clean') {
    a.cd = a.maxCD;
    let best = null, bd = 9999;
    G.items.forEach(i => {
      if (i.collected || i.eaten) return;
      const d = Math.hypot(c.x - i.x, c.y - i.y);
      if (d < bd) { best = i; bd = d; }
    });
    if (best && bd < 140 * (G.CW / 480)) {
      collectItem(G, best);
      addFloat("🧹+3🪙", best.x, best.y - 16, "#4CAF50");
      G.gold += 1;
    } else {
      notify("Nenhum item próximo!");
    }
  } else if (k === 'medicine') {
    if (a.count <= 0) { notify("Sem remédio!"); return; }
    a.count--;
    a.cd = a.maxCD;
    const red = hasUpgrade('red_30') ? 30 : 20;
    G.contam = Math.max(0, G.contam - red);
    addFloat("💊-" + red + "%", c.x, c.y - 30, "#E91E63");
    notify("💊 Contaminação -" + red + "%!");
  }
}

// --- Auxiliar para coordenadas de POI ---
function getPOICoords(G, poiKey) {
  const p = POI[poiKey];
  if (!p) return null;
  return { x: p.lx * G.CW, y: p.ly * G.CH, roomId: p.roomId };
} 