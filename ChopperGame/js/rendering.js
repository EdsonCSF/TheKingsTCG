import { MAP, POI } from './data.js';
import { rrect } from './utils.js';

export function drawRooms(ctx, rooms, W, H) {
  MAP.rooms.forEach((mr, idx) => {
    const r = rooms[idx];
    if (!r) return;
    const { x, y, w, h } = r;
    if (mr.pat === 'tile') {
      ctx.fillStyle = mr.floorA; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 0.7;
      const ts = Math.max(14, w / 12);
      for (let tx2 = x; tx2 < x + w; tx2 += ts) { ctx.beginPath(); ctx.moveTo(tx2, y); ctx.lineTo(tx2, y + h); ctx.stroke(); }
      for (let ty2 = y; ty2 < y + h; ty2 += ts) { ctx.beginPath(); ctx.moveTo(x, ty2); ctx.lineTo(x + w, ty2); ctx.stroke(); }
    } else if (mr.pat === 'wood') {
      ctx.fillStyle = mr.floorA; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = 'rgba(80,40,0,0.14)'; ctx.lineWidth = 1;
      const ps = Math.max(11, h / 14);
      for (let ty2 = y; ty2 < y + h; ty2 += ps) { ctx.beginPath(); ctx.moveTo(x, ty2); ctx.lineTo(x + w, ty2); ctx.stroke(); }
    } else {
      const g = ctx.createLinearGradient(x, y, x, y + h);
      g.addColorStop(0, mr.floorA); g.addColorStop(1, mr.floorB);
      ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let gx = x + 4; gx < x + w; gx += 8)
        for (let gy = y + 4; gy < y + h; gy += 8) {
          ctx.beginPath(); ctx.arc(gx, gy, 1.2, 0, Math.PI * 2); ctx.fill();
        }
    }
    ctx.strokeStyle = mr.wall; ctx.lineWidth = 3;
    ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
    drawFurniture(ctx, mr.furn, W, H);
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.48)';
    ctx.font = `bold ${Math.max(9, w * 0.068)}px Arial`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(mr.name.toUpperCase(), x + w / 2, y + 5);
    ctx.restore();
  });
}

function drawFurniture(ctx, furn, W, H) {
  furn.forEach(f => {
    ctx.save();
    if (f.t === 'oval') {
      ctx.fillStyle = f.c;
      ctx.beginPath();
      ctx.ellipse(f.lx * W + f.lw * W / 2, f.ly * H + f.lh * H / 2, f.lw * W / 2, f.lh * H / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (f.t === 'circle') {
      const cx = f.lx * W, cy = f.ly * H, r = f.lr * Math.min(W, H);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = f.c; ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 1; ctx.stroke();
      if (f.lbl) { ctx.font = Math.max(9, r * 1.05) + 'px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(f.lbl, cx, cy); }
    } else if (f.t === 'tree') {
      const cx = f.lx * W, cy = f.ly * H, r = f.lr * Math.min(W, H);
      ctx.fillStyle = '#5D4037'; ctx.fillRect(cx - r * 0.18, cy + r * 0.2, r * 0.36, r * 0.8);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = f.c; ctx.fill();
      ctx.font = Math.max(11, r * 1.15) + 'px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(f.lbl, cx, cy);
    } else {
      const fx = f.lx * W, fy = f.ly * H, fw = f.lw * W, fh = f.lh * H;
      rrect(ctx, fx, fy, fw, fh, 4); ctx.fillStyle = f.c; ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.fillRect(fx + 2, fy + 2, fw - 4, fh * 0.28);
      ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 1; ctx.stroke();
      if (f.lbl) {
        const fs = Math.min(fw * 0.44, fh * 0.6, 15);
        ctx.font = fs + 'px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillText(f.lbl, fx + fw / 2, fy + fh / 2);
      }
    }
    ctx.restore();
  });
}

export function drawDoors(ctx, doors) {
  doors.forEach(d => {
    ctx.save();
    const { x, y, w, h } = d;
    const r = Math.min(w, h) * 0.22;
    rrect(ctx, x, y, w, h, r);
    ctx.fillStyle = d.blocked ? 'rgba(160,25,25,0.95)' : 'rgba(80,50,20,0.88)';
    ctx.fill();
    ctx.strokeStyle = d.blocked ? '#FF6B6B' : '#FFD700';
    ctx.lineWidth = 2; ctx.stroke();
    ctx.font = Math.min(w, h) * 0.52 + 'px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(d.blocked ? '🔒' : '🚪', x + w / 2, y + h / 2);
    if (d.blocked && d.timer > 0) {
      ctx.fillStyle = 'white';
      ctx.font = `bold ${Math.min(w, h) * 0.32}px Arial`;
      ctx.fillText(Math.ceil(d.timer) + 's', x + w / 2, y + h * 0.82);
    }
    ctx.restore();
  });
}

export function drawPOIs(ctx, W, H) {
  Object.entries(POI).forEach(([key, p]) => {
    if (key === 'birds') return;
    const x = p.lx * W, y = p.ly * H;
    const r = Math.min(W, H) * 0.030;
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,220,0.15)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.font = r * 1.4 + 'px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(p.emoji, x, y);
    ctx.globalAlpha = 1;
    ctx.restore();
  });
}

export function drawItems(ctx, items, W, H) {
  items.forEach(item => {
    if (item.collected || item.eaten) return;
    const urgency = item.age / item.maxAge;
    const sc = item.scale * (1 + Math.sin(item.pulse) * 0.07);
    const r = 15 * (W / 480) * sc;
    ctx.save(); ctx.translate(item.x, item.y);
    if (urgency > 0.62) { ctx.shadowBlur = 12; ctx.shadowColor = '#FF4500'; }
    ctx.beginPath(); ctx.arc(0, 0, r + 3, 0, Math.PI * 2);
    ctx.fillStyle = item.def.ring; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = item.def.color; ctx.fill();
    ctx.font = Math.max(9, r * 1.1) + 'px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(item.def.emoji, 0, 0);
    ctx.beginPath(); ctx.arc(r * 0.68, -r * 0.68, r * 0.36, 0, Math.PI * 2);
    ctx.fillStyle = '#FF4500'; ctx.fill();
    ctx.fillStyle = 'white'; ctx.font = `bold ${r * 0.38}px Arial`;
    ctx.fillText('!', r * 0.68, -r * 0.68);
    ctx.fillStyle = 'rgba(0,0,0,0.42)'; ctx.fillRect(-r, r + 2, r * 2, 4);
    const ratio = 1 - urgency;
    ctx.fillStyle = ratio > 0.5 ? '#4CAF50' : ratio > 0.25 ? '#FFC107' : '#FF4500';
    ctx.fillRect(-r, r + 2, r * 2 * ratio, 4);
    ctx.restore();
  });
}

export function drawNPCs(ctx, npcs) {
  npcs.forEach(npc => {
    ctx.save(); ctx.translate(npc.x, npc.y);
    const r = npc.sz;
    if (npc.type === 'bird') {
      const t = npc.moveT || 0;
      const wingFlap = Math.sin(t * 8) * 0.4;
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.beginPath(); ctx.ellipse(0, r * 0.9, r * 0.8, r * 0.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.7, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#E53935'; ctx.fill();
      ctx.strokeStyle = '#B71C1C'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.save(); ctx.rotate(-wingFlap);
      ctx.beginPath(); ctx.moveTo(-r * 0.1, -r * 0.1); ctx.lineTo(-r * 0.9, -r * 0.5); ctx.lineTo(-r * 0.7, r * 0.2); ctx.closePath();
      ctx.fillStyle = '#EF5350'; ctx.fill(); ctx.restore();
      ctx.save(); ctx.rotate(wingFlap);
      ctx.beginPath(); ctx.moveTo(r * 0.1, -r * 0.1); ctx.lineTo(r * 0.9, -r * 0.5); ctx.lineTo(r * 0.7, r * 0.2); ctx.closePath();
      ctx.fillStyle = '#EF5350'; ctx.fill(); ctx.restore();
      ctx.beginPath(); ctx.arc(0, -r * 0.3, r * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = '#E53935'; ctx.fill(); ctx.strokeStyle = '#B71C1C'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r * 0.28, -r * 0.3); ctx.lineTo(r * 0.62, -r * 0.22); ctx.lineTo(r * 0.28, -r * 0.14); ctx.closePath();
      ctx.fillStyle = '#FF8F00'; ctx.fill();
      ctx.beginPath(); ctx.arc(r * 0.1, -r * 0.35, r * 0.09, 0, Math.PI * 2);
      ctx.fillStyle = 'black'; ctx.fill();
      ctx.beginPath(); ctx.arc(r * 0.13, -r * 0.38, r * 0.035, 0, Math.PI * 2);
      ctx.fillStyle = 'white'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-r * 0.08, -r * 0.62); ctx.lineTo(r * 0.05, -r * 0.9); ctx.lineTo(r * 0.18, -r * 0.60);
      ctx.fillStyle = '#FF5722'; ctx.fill();
      ctx.restore();
      return;
    }
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.beginPath(); ctx.ellipse(0, r + 2, r, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = npc.def.color + 'CC'; ctx.fill();
    ctx.strokeStyle = 'white'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.font = (r * 1.4) + 'px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(npc.def.emoji, 0, 0);
    if (npc.idle && npc.currentAction) {
      const icons = { comer:'🍽️', beber_agua:'💧', dormir:'💤', brincar:'⚽', lavar:'🧺', passear:'🚶', pegar_item:'💥', descansar:'😌' };
      const ic = icons[npc.currentAction] || '💬';
      ctx.font = r * 0.9 + 'px serif';
      ctx.fillText(ic, r * 0.8, -r * 0.9);
    }
    ctx.restore();
  });
}

export function drawChopper(ctx, c, contam) {
  const sz = c.sz * 10;
  const bounce = (c.state === 'wandering' || c.state === 'npc_follow') ? Math.sin(c.animT * 2.6) * sz * 0.007 : 0;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath(); ctx.ellipse(c.x, c.y + sz * 0.12 + 3, sz * 0.065, sz * 0.018, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  if (contam > 60) {
    ctx.save(); ctx.shadowBlur = 18 + Math.sin(c.animT * 2) * 5; ctx.shadowColor = '#9C27B0';
    ctx.beginPath(); ctx.arc(c.x, c.y + bounce, sz * 0.11, 0, Math.PI * 2); ctx.fillStyle = 'rgba(156,39,176,0.13)'; ctx.fill(); ctx.restore();
  } else if (contam > 30) {
    ctx.save(); ctx.shadowBlur = 10; ctx.shadowColor = '#FF9800';
    ctx.beginPath(); ctx.arc(c.x, c.y + bounce, sz * 0.105, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,152,0,0.10)'; ctx.fill(); ctx.restore();
  }
  drawSpitz(ctx, c.x, c.y + bounce, c.sz, c.animT, c.contamLv);
  let st = '';
  if (c.state === 'hunting') st = '👃';
  else if (c.distracted) st = '🎾';
  else if (c.state === 'eating') st = '😋';
  else if (c.called) st = '🏠';
  else if (c.paralyzed) st = '😵';
  else if (c.state === 'sleeping') st = '😴';
  else if (c.state === 'npc_follow') st = '👀';
  else if (c.routine && c.routine.currentAction === 'pee') st = '💦';
  else if (c.routine && c.routine.currentAction === 'drink') st = '💧';
  if (st) {
    ctx.save();
    ctx.font = c.sz * 0.9 + 'px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(st, c.x, c.y - c.sz * 1.1 + bounce);
    ctx.restore();
  }
  if (c.state === 'hunting') {
    ctx.save(); ctx.globalAlpha = 0.05 + Math.sin(c.animT * 3) * 0.02;
    ctx.beginPath(); ctx.arc(c.x, c.y, c.smellRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF9800'; ctx.fill(); ctx.restore();
  }
}

function drawSpitz(ctx, cx, cy, sz, animT, contamLv) {
  ctx.save(); ctx.translate(cx, cy);
  const fur = contamLv === 'severe' ? '#C8A0A0' : contamLv === 'mild' ? '#F0E0B0' : '#FFFAE8';
  const furD = contamLv === 'severe' ? '#A07070' : contamLv === 'mild' ? '#D4C080' : '#E8D098';
  const nose = '#2c1810';
  const eyeC = contamLv === 'severe' ? '#7B1FA2' : '#1a0c06';
  ctx.save(); ctx.rotate(Math.sin(animT * 2.0) * 0.38);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(-sz * 0.72, -sz * 0.05 + i * sz * 0.07, sz * (0.38 - i * 0.07), sz * (0.2 - i * 0.04), -0.5, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? furD : fur; ctx.fill();
  }
  ctx.restore();
  [-0.32, 0.32].forEach(side => {
    ctx.beginPath();
    ctx.ellipse(-sz * 0.22, sz * side, sz * 0.16, sz * 0.12, Math.sin(animT * 4 + side) * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = furD; ctx.fill();
  });
  ctx.beginPath(); ctx.ellipse(0, 0, sz * 0.5, sz * 0.38, 0, 0, Math.PI * 2);
  ctx.fillStyle = fur; ctx.fill(); ctx.strokeStyle = furD; ctx.lineWidth = sz * 0.04; ctx.stroke();
  ctx.strokeStyle = furD + '88'; ctx.lineWidth = sz * 0.022;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * sz * 0.32, Math.sin(a) * sz * 0.26);
    ctx.lineTo(Math.cos(a) * sz * 0.48, Math.sin(a) * sz * 0.36); ctx.stroke();
  }
  const lOff = Math.sin(animT * 4) * sz * 0.05;
  [-0.28, 0.28].forEach((side, i) => {
    ctx.beginPath();
    ctx.ellipse(sz * 0.28 + lOff * (i === 0 ? 1 : -1), sz * side, sz * 0.14, sz * 0.11, Math.sin(animT * 4 + i) * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = furD; ctx.fill();
  });
  ctx.beginPath(); ctx.ellipse(sz * 0.44, 0, sz * 0.34, sz * 0.29, 0, 0, Math.PI * 2);
  ctx.fillStyle = fur; ctx.fill(); ctx.strokeStyle = furD; ctx.lineWidth = sz * 0.04; ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sz * 0.70, 0);
  ctx.quadraticCurveTo(sz * 0.82, -sz * 0.065, sz * 0.87, 0);
  ctx.quadraticCurveTo(sz * 0.82, sz * 0.065, sz * 0.70, 0);
  ctx.fillStyle = '#E8C090'; ctx.fill();
  ctx.strokeStyle = furD; ctx.lineWidth = sz * 0.022; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(sz * 0.87, 0, sz * 0.055, sz * 0.04, 0, 0, Math.PI * 2);
  ctx.fillStyle = nose; ctx.fill();
  [-0.13, 0.13].forEach(ey => {
    ctx.beginPath(); ctx.arc(sz * 0.53, sz * ey, sz * 0.055, 0, Math.PI * 2);
    ctx.fillStyle = eyeC; ctx.fill();
    ctx.beginPath(); ctx.arc(sz * 0.55, sz * ey - sz * 0.018, sz * 0.018, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; ctx.fill();
  });
  [[-1, -1], [1, -1]].forEach(([ex, ey]) => {
    ctx.save(); ctx.translate(sz * 0.33, sz * (ey === -1 ? -0.22 : 0.22));
    ctx.rotate(ey === -1 ? -0.28 : 0.28);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(sz * -0.06, sz * (ey === -1 ? -0.26 : 0.26)); ctx.lineTo(sz * 0.14, sz * (ey === -1 ? -0.28 : 0.28)); ctx.closePath();
    ctx.fillStyle = fur; ctx.fill(); ctx.strokeStyle = furD; ctx.lineWidth = sz * 0.028; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sz * 0.02, sz * (ey === -1 ? -0.04 : 0.04)); ctx.lineTo(sz * -0.02, sz * (ey === -1 ? -0.18 : 0.18)); ctx.lineTo(sz * 0.09, sz * (ey === -1 ? -0.20 : 0.20)); ctx.closePath();
    ctx.fillStyle = '#E8A0A0'; ctx.fill();
    ctx.restore();
  });
  if (contamLv !== 'normal') {
    ctx.save(); ctx.translate(sz * 0.82, sz * 0.07);
    ctx.beginPath(); ctx.ellipse(0, 0, sz * 0.045, sz * 0.075, 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#FF69B4'; ctx.fill(); ctx.restore();
  }
  ctx.beginPath(); ctx.ellipse(sz * 0.30, 0, sz * 0.20, sz * 0.16, 0, 0, Math.PI * 2);
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = sz * 0.055; ctx.stroke();
  if (contamLv !== 'normal') {
    const n = contamLv === 'severe' ? 6 : 3;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + animT * 1.5;
      const dr = sz * 0.62;
      ctx.beginPath(); ctx.arc(Math.cos(ang) * dr, Math.sin(ang) * dr, sz * 0.055, 0, Math.PI * 2);
      ctx.fillStyle = contamLv === 'severe' ? '#9C27B0AA' : '#FF9800AA'; ctx.fill();
    }
  }
  ctx.restore();
}

export function drawFloats(ctx, floats) {
  floats.forEach(f => {
    ctx.save(); ctx.globalAlpha = f.alpha;
    ctx.translate(f.x, f.y); ctx.scale(f.scale, f.scale);
    ctx.font = `bold ${Math.max(10, 12 * (ctx.canvas.width / 480))}px Arial`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowBlur = 5; ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.fillStyle = f.color; ctx.fillText(f.txt, 0, 0);
    ctx.restore();
  });
}

export function renderHudTop(G) {
  const h = document.getElementById('hudTop');
  if (!G.running) { h.innerHTML = ''; return; }
  const c = G.chopper;
  const contamPct = Math.min(100, Math.floor(G.contam));
  const mins = Math.floor(G.timeLeft / 60);
  const secs = Math.floor(G.timeLeft % 60);
  const timerStr = mins + ':' + String(secs).padStart(2, '0');
  const barColor = contamPct < 31 ? '#4CAF50' : contamPct < 61 ? '#FF9800' : '#F44336';
  const urgentTimer = G.timeLeft < 30;
  const portraitBorder = contamPct < 31 ? '#FFD700' : contamPct < 61 ? '#FF9800' : '#E91E63';
  h.innerHTML = `
    <canvas id="portCv" width="38" height="38" style="border-radius:50%;border:2.5px solid ${portraitBorder};flex-shrink:0;margin-left:4px;"></canvas>
    <div style="flex:1;display:flex;flex-direction:column;gap:3px;padding:0 6px;">
      <div style="display:flex;align-items:center;gap:4px;">
        <span style="font-size:8px;color:rgba(255,255,255,0.6);">☣️ CONTAM.</span>
        <div style="flex:1;background:rgba(255,255,255,0.1);border-radius:5px;height:9px;overflow:hidden;">
          <div style="width:${contamPct}%;height:100%;background:${barColor};border-radius:5px;transition:width .3s;"></div>
        </div>
        <span style="font-size:9px;color:${barColor};font-weight:bold;min-width:28px;">${contamPct}%</span>
      </div>
      <div style="display:flex;gap:10px;">
        <span style="font-size:9px;color:#4CAF50;font-weight:bold;">🛡️${G.saved}</span>
        <span style="font-size:9px;color:#FF4500;font-weight:bold;">💀${G.eaten}</span>
        <span style="font-size:9px;color:#FFD700;font-weight:bold;">🪙${G.gold}</span>
      </div>
    </div>
    <div style="background:${urgentTimer ? 'rgba(160,20,20,0.9)' : 'rgba(10,50,20,0.9)'};border:1.5px solid ${urgentTimer ? '#FF4500' : '#FFD700'};border-radius:8px;padding:3px 8px;margin-right:4px;flex-shrink:0;">
      <div style="font-size:clamp(14px,4vw,18px);color:${urgentTimer ? '#FF6666' : '#FFD700'};font-weight:bold;font-family:monospace;text-align:center;">${timerStr}</div>
      <div style="font-size:7px;color:rgba(255,255,255,0.4);text-align:center;">TEMPO</div>
    </div>
    <button id="btnExitGame" style="margin-left:6px;margin-right:4px;padding:5px 10px;background:rgba(20,20,20,0.82);border:1px solid rgba(255,255,255,0.22);border-radius:8px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;"> Sair</button>`;
  const portCv = document.getElementById('portCv');
  if (portCv) {
    const pCtx = portCv.getContext('2d');
    pCtx.clearRect(0, 0, 38, 38);
    pCtx.fillStyle = 'rgba(10,20,10,0.8)';
    pCtx.beginPath(); pCtx.arc(19, 19, 19, 0, Math.PI * 2); pCtx.fill();
    pCtx.font = '24px serif'; pCtx.textAlign = 'center'; pCtx.textBaseline = 'middle';
    pCtx.fillText(c.contamLv === 'severe' ? '' : c.contamLv === 'mild' ? '' : '', 19, 19);
  }
  const btnExit = document.getElementById('btnExitGame');
  if (btnExit && window._exitGameHandler) {
    btnExit.addEventListener('click', window._exitGameHandler);
  }
}