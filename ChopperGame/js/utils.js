let nTO;
export function notify(txt) {
  const e = document.getElementById('notif');
  if (!e) return;
  e.textContent = txt;
  e.classList.add('show');
  clearTimeout(nTO);
  nTO = setTimeout(() => e.classList.remove('show'), 2600);
}

export function setText(id, v) {
  const e = document.getElementById(id);
  if (e) e.textContent = v;
}

export function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Gerenciamento de floats (textos animados)
export let floats = [];

export function addFloat(txt, x, y, color) {
  floats.push({ txt, x, y, vy: -55, alpha: 1, color, scale: 1.2, age: 0 });
}

export function updateFloats(dt) {
  for (let i = 0; i < floats.length; i++) {
    const f = floats[i];
    f.y += f.vy * dt;
    f.age += dt;
    f.alpha = Math.max(0, 1 - f.age / 1.3);
    f.scale = 1.2 - f.age * 0.16;
  }
  floats = floats.filter(f => f.alpha > 0);
}