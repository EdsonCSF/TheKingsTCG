import { MAP } from './data.js';

export function buildRoomRects(CW, CH) {
  return MAP.rooms.map(r => ({
    id: r.id,
    x: r.x * CW,
    y: r.y * CH,
    w: r.w * CW,
    h: r.h * CH
  }));
}

export function buildDoorRects(conns, rooms, CW, CH, hasDoorBoost) {
  const DW = Math.min(CW, CH) * 0.10;
  return conns.map(c => {
    const A = rooms.find(r => r.id === c.from);
    const B = rooms.find(r => r.id === c.to);
    if (!A || !B) return null;
    let x, y, w, h;
    if (c.border === 'right') {
      const mY = (Math.max(A.y, B.y) + Math.min(A.y + A.h, B.y + B.h)) / 2;
      x = A.x + A.w - DW / 2;
      y = mY - DW / 2;
      w = DW;
      h = DW;
    } else {
      const mX = (Math.max(A.x, B.x) + Math.min(A.x + A.w, B.x + B.w)) / 2;
      x = mX - DW / 2;
      y = A.y + A.h - DW / 2;
      w = DW;
      h = DW;
    }
    return {
      id: `${c.from}_${c.to}`,
      from: c.from,
      to: c.to,
      x, y, w, h,
      cx: x + w / 2,
      cy: y + h / 2,
      blocked: false,
      timer: 0,
      maxTime: hasDoorBoost ? 10 : 6
    };
  }).filter(Boolean);
}

export function getRoomAtPoint(px, py, rooms) {
  return rooms.find(r => px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) || null;
}

export function pointInRoom(px, py, rooms) {
  return !!getRoomAtPoint(px, py, rooms);
}

export function pointInOpenDoor(px, py, doors) {
  return doors.some(d => !d.blocked && px >= d.x && px <= d.x + d.w && py >= d.y && py <= d.y + d.h);
}

function crossesWall(ex, ey, nx, ny, rooms, doors) {
  const rA = getRoomAtPoint(ex, ey, rooms);
  const rB = getRoomAtPoint(nx, ny, rooms);
  if (!rA || !rB) return false;
  if (rA.id === rB.id) return false;
  // Rooms are different — movement crosses a boundary.
  // It is only allowed if an OPEN door connects these two rooms AND
  // the movement path actually goes through the door rectangle.
  for (const d of doors) {
    if (d.blocked) continue; // blocked doors = wall
    const connects = (d.from === rA.id && d.to === rB.id) || (d.from === rB.id && d.to === rA.id);
    if (!connects) continue;
    for (let t = 0; t <= 1; t += 0.15) {
      const ix = ex + (nx - ex) * t;
      const iy = ey + (ny - ey) * t;
      if (ix >= d.x && ix <= d.x + d.w && iy >= d.y && iy <= d.y + d.h) return false;
    }
  }
  return true; // no open door found → movement is blocked
}

// Returns door object connecting two rooms (open or closed), or null
export function getDoorBetween(roomAId, roomBId, doors) {
  return doors.find(d =>
    (d.from === roomAId && d.to === roomBId) ||
    (d.from === roomBId && d.to === roomAId)
  ) || null;
}

// Returns the center point of a door — useful for NPCs that need to walk through it
export function getDoorCenter(door) {
  return { x: door.cx, y: door.cy };
}

export function moveWithWall(ex, ey, dx, dy, rooms, doors) {
  const nx = ex + dx, ny = ey + dy;
  if (pointInRoom(nx, ny, rooms) && !crossesWall(ex, ey, nx, ny, rooms, doors))
    return { x: nx, y: ny };
  if (pointInRoom(nx, ey, rooms) && !crossesWall(ex, ey, nx, ey, rooms, doors))
    return { x: nx, y: ey };
  if (pointInRoom(ex, ny, rooms) && !crossesWall(ex, ey, ex, ny, rooms, doors))
    return { x: ex, y: ny };
  return { x: ex, y: ey };
}

export function getRoomId(px, py, rooms) {
  const r = getRoomAtPoint(px, py, rooms);
  return r ? r.id : null;
}

export function accessibleRooms(fromId, doors, allRooms) {
  const visited = new Set([fromId]);
  const queue = [fromId];
  while (queue.length) {
    const cur = queue.shift();
    doors.forEach(d => {
      if (d.blocked) return;
      let nb = null;
      if (d.from === cur) nb = d.to;
      else if (d.to === cur) nb = d.from;
      if (nb && !visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
      }
    });
  }
  return allRooms.filter(r => visited.has(r.id));
}

export function randomPosInRoom(room, margin) {
  return {
    x: room.x + margin + Math.random() * (room.w - margin * 2),
    y: room.y + margin + Math.random() * (room.h - margin * 2)
  };
}