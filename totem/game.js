
'use strict';

/* ════════════════════════════════════════
   SISTEMA DE SONS RICO — WebAudio API sintetizada
   Música ambiente + SFX elaborados
════════════════════════════════════════ */
let audioCtx=null;
let soundEnabled=true;
let musicGain=null;
let sfxGain=null;
let currentMusic=null;
let currentMusicName=null;

function initAudio(){
  if(!audioCtx){
    try{
      audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      // Master gains
      musicGain=audioCtx.createGain();
      musicGain.gain.value=0.32; /* aumentado: música menu/jogo */
      musicGain.connect(audioCtx.destination);
      sfxGain=audioCtx.createGain();
      sfxGain.gain.value=0.45;
      sfxGain.connect(audioCtx.destination);
    }catch(e){audioCtx=null;}
  }
  if(audioCtx && audioCtx.state==='suspended'){
    audioCtx.resume();
  }
}

/* Tom com envelope ADSR simplificado */
function playTone(freq, duration, type='sine', volume=0.15, when=0){
  if(!soundEnabled) return;
  initAudio();
  if(!audioCtx) return;
  const t=audioCtx.currentTime + when;
  const osc=audioCtx.createOscillator();
  const gain=audioCtx.createGain();
  osc.type=type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t+0.008);
  gain.gain.exponentialRampToValueAtTime(volume*0.4, t+duration*0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, t+duration);
  osc.connect(gain);
  gain.connect(sfxGain||audioCtx.destination);
  osc.start(t);
  osc.stop(t+duration+0.05);
}

/* Slide de frequência */
function playSlide(f1, f2, duration, type='sine', volume=0.15){
  if(!soundEnabled) return;
  initAudio();
  if(!audioCtx) return;
  const t=audioCtx.currentTime;
  const osc=audioCtx.createOscillator();
  const gain=audioCtx.createGain();
  osc.type=type;
  osc.frequency.setValueAtTime(f1, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20,f2), t+duration);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t+0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t+duration);
  osc.connect(gain);
  gain.connect(sfxGain||audioCtx.destination);
  osc.start(t);
  osc.stop(t+duration+0.05);
}

/* Acorde (3+ notas simultâneas) */
function playChord(freqs, duration, type='sine', volume=0.1){
  if(!soundEnabled) return;
  initAudio();
  if(!audioCtx) return;
  freqs.forEach((f,i)=>playTone(f, duration, type, volume, i*0.02));
}

/* Som percussivo (ruído filtrado) */
function playNoise(duration, volume=0.1, filterFreq=1000, type='lowpass'){
  if(!soundEnabled) return;
  initAudio();
  if(!audioCtx) return;
  const t=audioCtx.currentTime;
  const bufferSize=Math.floor(audioCtx.sampleRate * duration);
  const buffer=audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++){
    data[i]=(Math.random()*2-1)*(1-i/bufferSize);
  }
  const noise=audioCtx.createBufferSource();
  noise.buffer=buffer;
  const filter=audioCtx.createBiquadFilter();
  filter.type=type;
  filter.frequency.value=filterFreq;
  const gain=audioCtx.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t+duration);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(sfxGain||audioCtx.destination);
  noise.start(t);
  noise.stop(t+duration);
}

/* ══ MÚSICA AMBIENTE — loops contínuos ══ */
function stopMusic(){
  if(currentMusic){
    try{
      clearInterval(currentMusic);
      currentMusic=null;
      currentMusicName=null;
    }catch(e){}
  }
}

/* Música do menu — mistica, lenta, com arpejos */
function playMenuMusic(){
 if(currentMusicName==='menu'&&currentMusic)return;
  if(!soundEnabled) return;
  initAudio();
  if(!audioCtx) return;
  if(currentMusicName==='menu') return;
  stopMusic();
  currentMusicName='menu';
  // Progressão mística Am - F - C - G
  const chords=[
    [220,261.63,329.63], // Am
    [174.61,220,261.63], // F
    [261.63,329.63,392], // C
    [196,246.94,293.66]  // G
  ];
  let step=0;
  const playChord_=()=>{
    if(!soundEnabled || currentMusicName!=='menu') return;
    const chord=chords[step%chords.length];
    // Bass note
    if(musicGain){
      const t=audioCtx.currentTime;
      const osc=audioCtx.createOscillator();
      const g=audioCtx.createGain();
      osc.type='triangle';
      osc.frequency.value=chord[0]/2;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(0.18,t+0.05);
      g.gain.exponentialRampToValueAtTime(0.001,t+1.8);
      osc.connect(g); g.connect(musicGain);
      osc.start(t); osc.stop(t+2);
    }
    // Arpejo
    chord.forEach((f,i)=>{
      setTimeout(()=>{
        if(!soundEnabled || currentMusicName!=='menu') return;
        playTone(f*2, 0.6, 'sine', 0.06);
      }, i*180);
    });
    step++;
  };
  playChord_();
  currentMusic=setInterval(playChord_, 2000);
}

/* Música de gameplay — mais ritmada */
function playGameMusic(){
 if(currentMusicName==='game'&&currentMusic)return;
  if(!soundEnabled) return;
  initAudio();
  if(!audioCtx) return;
  if(currentMusicName==='game') return;
  stopMusic();
  currentMusicName='game';
  // Progressão Dm - Bb - F - C com ritmo
  const pattern=[
    [146.83, 220, 293.66],  // Dm
    [116.54, 174.61, 233.08], // Bb
    [130.81, 196, 261.63],  // F
    [130.81, 164.81, 196]   // C (power)
  ];
  let step=0;
  const playBeat=()=>{
    if(!soundEnabled || currentMusicName!=='game') return;
    const chord=pattern[step%pattern.length];
    if(musicGain){
      const t=audioCtx.currentTime;
      // Bass
      const osc=audioCtx.createOscillator();
      const g=audioCtx.createGain();
      osc.type='sawtooth';
      osc.frequency.value=chord[0];
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(0.10,t+0.02);
      g.gain.exponentialRampToValueAtTime(0.001,t+0.45);
      const filter=audioCtx.createBiquadFilter();
      filter.type='lowpass';
      filter.frequency.value=400;
      osc.connect(filter); filter.connect(g); g.connect(musicGain);
      osc.start(t); osc.stop(t+0.5);
      // Pad (chord)
      chord.forEach((f,i)=>{
        const o=audioCtx.createOscillator();
        const gg=audioCtx.createGain();
        o.type='sine';
        o.frequency.value=f*2;
        gg.gain.setValueAtTime(0,t);
        gg.gain.linearRampToValueAtTime(0.04,t+0.1);
        gg.gain.exponentialRampToValueAtTime(0.001,t+1.4);
        o.connect(gg); gg.connect(musicGain);
        o.start(t); o.stop(t+1.5);
      });
    }
    step++;
  };
  playBeat();
  currentMusic=setInterval(playBeat, 1500);
}

/* ══ EFEITOS SONOROS ELABORADOS ══ */
const SFX={
  click:   ()=>{
    playTone(660,0.06,'sine',0.12);
    playTone(880,0.05,'sine',0.08,0.02);
  },
  dice:    ()=>{
    // Rolagem de dado com múltiplos cliques
    for(let i=0;i<5;i++){
      setTimeout(()=>{
        playTone(180+Math.random()*120,0.04,'square',0.06);
      }, i*60);
    }
    playNoise(0.18,0.06,1200,'bandpass');
  },
  success: ()=>{
    // Arpejo ascendente maior
    [523,659,784,1046].forEach((f,i)=>playTone(f,0.18,'triangle',0.10,i*0.05));
  },
  perfect: ()=>{
    // Fanfarra dourada
    [523,659,784,1046,1318].forEach((f,i)=>playTone(f,0.22,'sine',0.12,i*0.06));
    playTone(2093,0.4,'sine',0.08,0.3);
  },
  crit:    ()=>{
    // Explosão critica
    playSlide(110,880,0.35,'sawtooth',0.15);
    playNoise(0.25,0.12,2000,'highpass');
    [784,988,1318].forEach((f,i)=>playTone(f,0.2,'triangle',0.10,i*0.04));
  },
  fail:    ()=>{
    // Descida triste
    playSlide(440,110,0.4,'sawtooth',0.16);
    playNoise(0.2,0.08,300,'lowpass');
    playTone(220,0.3,'square',0.08,0.1);
  },
  piece:   ()=>{
    // Drop de peça com peso
    playTone(330,0.08,'triangle',0.10);
    playTone(220,0.15,'sine',0.12,0.03);
    playNoise(0.05,0.04,500);
  },
  coin:    ()=>{
    // Moeda tilintante
    playTone(988,0.05,'sine',0.10);
    playTone(1318,0.05,'sine',0.10,0.04);
    playTone(1760,0.12,'sine',0.08,0.08);
  },
  boss:    ()=>{
    // Rugido de boss
    playSlide(110,55,0.6,'sawtooth',0.18);
    playNoise(0.4,0.12,250,'lowpass');
    playTone(82,0.5,'square',0.12);
  },
  bossHit: ()=>{
    // Impacto
    playTone(150,0.08,'sawtooth',0.12);
    playNoise(0.1,0.1,800,'bandpass');
    playTone(100,0.12,'square',0.08,0.02);
  },
  bossDefeat: ()=>{
    // Vitória épica
    [261,329,392,523,659,784,1046].forEach((f,i)=>{
      playTone(f,0.3,'triangle',0.13,i*0.08);
    });
    playNoise(0.5,0.10,3000,'highpass');
    playTone(1568,0.6,'sine',0.10,0.5);
  },
  power:   ()=>{
    // Carga mística
    playSlide(220,880,0.3,'sine',0.14);
    playTone(440,0.2,'triangle',0.10,0.1);
    playTone(880,0.25,'sine',0.08,0.2);
  },
  milestone: ()=>{
    // Sequência vitoriosa
    [523,659,784,1046,1318,1568].forEach((f,i)=>{
      playTone(f,0.2,'triangle',0.13,i*0.08);
    });
    playTone(2093,0.5,'sine',0.10,0.5);
  },
  achievement: ()=>{
    [659,784,988,1318].forEach((f,i)=>playTone(f,0.18,'triangle',0.13,i*0.07));
    playTone(1568,0.3,'sine',0.10,0.28);
  },
  prestige: ()=>{
    // Ascensão celestial
    [220,330,440,550,660,880,1100,1760].forEach((f,i)=>{
      playTone(f,0.4,'sine',0.12,i*0.08);
    });
    playTone(2093,0.8,'sine',0.10,0.6);
  },
  buy:     ()=>{
    playTone(523,0.06,'triangle',0.10);
    playTone(659,0.06,'triangle',0.10,0.04);
    playTone(784,0.14,'sine',0.10,0.08);
  },
  event:   ()=>{
    // Aviso místico
    playSlide(440,660,0.2,'sine',0.12);
    playTone(550,0.18,'triangle',0.10,0.1);
    playTone(740,0.25,'sine',0.08,0.18);
  },
  combo:   ()=>{
    // Escalada de combo
    const base=440+G.combo*30;
    playTone(base,0.06,'triangle',0.10);
    playTone(base*1.25,0.06,'triangle',0.10,0.04);
    playTone(base*1.5,0.10,'triangle',0.10,0.08);
  },
  critical: ()=>{
    // Sirene de estado crítico
    playSlide(880,440,0.2,'sawtooth',0.18);
    setTimeout(()=>{ if(soundEnabled) playSlide(440,880,0.2,'sawtooth',0.18); }, 220);
  },
  recover: ()=>{
    // Recuperação bem-sucedida
    [392,523,659,784].forEach((f,i)=>playTone(f,0.18,'triangle',0.14,i*0.06));
    playTone(1046,0.3,'sine',0.10,0.25);
  },
  revive: ()=>{
    // Renascimento
    [220,330,440,550,660,880,1046,1318].forEach((f,i)=>{
      playTone(f,0.3,'sine',0.14,i*0.07);
    });
  },
  death: ()=>{
    // Morte lenta
    playSlide(440,55,1.2,'sawtooth',0.18);
    playNoise(0.6,0.10,200,'lowpass');
    playTone(82,1.0,'square',0.12,0.2);
  },
  toggleSound: ()=>{
    if(soundEnabled){
      playTone(523,0.08,'triangle',0.10);
      playTone(784,0.12,'sine',0.10,0.05);
    }
  }
};

function toggleSound(){
  soundEnabled=!soundEnabled;
  SFX.toggleSound();
  try{ localStorage.setItem('totemSound', soundEnabled?'1':'0'); }catch(e){}
  const btn=document.getElementById('sound-btn');
  if(btn) btn.textContent=soundEnabled?'🔊':'🔇';
  if(!soundEnabled) stopMusic();
  else if(curScreen==='menu') playMenuMusic();
  else if(curScreen==='game') playGameMusic();
  return soundEnabled;
}

function loadSoundPref(){
  try{
    const p=localStorage.getItem('totemSound');
    if(p!==null) soundEnabled = p!=='0';
  }catch(e){}
}


/* ════════════════════════════════════════
   RUNE SYMBOLS
════════════════════════════════════════ */
const RUNES = [
  { glyph:'ᚠ', name:'Fehu'   },
  { glyph:'ᚢ', name:'Uruz'   },
  { glyph:'ᚦ', name:'Thuris' },
  { glyph:'ᚨ', name:'Ansuz'  },
  { glyph:'ᚱ', name:'Raido'  },
  { glyph:'ᚲ', name:'Kaunan' },
  { glyph:'ᚷ', name:'Gebo'   },
  { glyph:'ᚹ', name:'Wunjo'  },
];

/* ════════════════════════════════════════
   PIECE TYPES
════════════════════════════════════════ */
const PIECES = [
  { id:'ember',   rune:'ᚠ', name:'Fogo',   cls:'tp-ember',   hv:1,  cv:2,  minH:0,   sRec:1, rarity:'common',   effectDesc:'+1 altura base'           },
  { id:'stone',   rune:'ᚢ', name:'Terra',   cls:'tp-stone',   hv:2,  cv:3,  minH:8,   sRec:1, rarity:'common',   effectDesc:'+1 altura base'           },
  { id:'forest',  rune:'ᚦ', name:'Natureza',  cls:'tp-forest',  hv:2,  cv:4,  minH:16,  sRec:2, rarity:'common',   effectDesc:'+1 estab. por acerto'    },
  { id:'water',   rune:'ᚨ', name:'Água',   cls:'tp-water',   hv:3,  cv:5,  minH:28,  sRec:2, rarity:'uncommon', effectDesc:'+5% moedas'              },
  { id:'wind',    rune:'ᚱ', name:'Vento',    cls:'tp-wind',    hv:3,  cv:6,  minH:42,  sRec:1, rarity:'uncommon', effectDesc:'+5% velocidade de carga' },
  { id:'gold',    rune:'ᚲ', name:'Metal',    cls:'tp-gold',    hv:5,  cv:9,  minH:60,  sRec:2, rarity:'uncommon', effectDesc:'+8% moedas'              },
  { id:'crystal', rune:'ᚷ', name:'Cristal', cls:'tp-crystal', hv:6,  cv:13, minH:85,  sRec:3, rarity:'rare',     effectDesc:'+10% moedas'             },
  { id:'shadow',  rune:'ᚹ', name:'Sombra',  cls:'tp-shadow',  hv:7,  cv:15, minH:115, sRec:1, rarity:'rare',     effectDesc:'+10% moedas'             },
  { id:'light',   rune:'ᛊ', name:'Luz',   cls:'tp-light',   hv:8,  cv:18, minH:155, sRec:3, rarity:'rare',     effectDesc:'+15% moedas'             },
  { id:'chaos',   rune:'ᛏ', name:'Arcano',   cls:'tp-chaos',   hv:10, cv:22, minH:210, sRec:0, rarity:'epic',     effectDesc:'Efeito aleatório a cada peça' },
  { id:'ancient', rune:'ᛚ', name:'Tempo', cls:'tp-ancient', hv:13, cv:28, minH:280, sRec:4, rarity:'legendary', effectDesc:'+2 estabilidade por acerto' },
  { id:'divine',  rune:'ᛟ', name:'Celestial',  cls:'tp-divine',  hv:18, cv:38, minH:380, sRec:5, rarity:'mythic',   effectDesc:'Bônus duplo em tudo'      },
];

const RARITY_INFO = {
  common:    {label:'Comum',     color:'#9aa0b0', stars:0, glyph:''},
  uncommon:  {label:'Incomum',   color:'#3de87a', stars:1, glyph:'★'},
  rare:      {label:'Rara',      color:'#4488ff', stars:2, glyph:'★★'},
  epic:      {label:'Épica',     color:'#aa44ff', stars:3, glyph:'★★★'},
  legendary: {label:'Lendária',  color:'#f0c040', stars:4, glyph:'★★★★'},
  mythic:    {label:'Mística',   color:'#ff44ff', stars:5, glyph:'★★★★★'},
};

/* Progressão com trade-offs (5 níveis, cada um com benefício E desvantagem) */
const PROGRESSIONS=[
  {
    id:1, name:'Era do Ouro', icon:'💰',
    benefit:'+50% moedas', drawback:'Dados mais rápidos (+15%)',
    minH:50,
    apply:()=>{
      G._progCoinMult=1.5;
      G.timingSpd=0.85;
    }
  },
  {
    id:2, name:'Era das Sombras', icon:'🌑',
    benefit:'+30% peças raras', drawback:'Vento mais frequente (+10%)',
    minH:312,
    apply:()=>{
      G._progRareBoost=0.30;
      G._progWindChance=0.10;
    }
  },
  {
    id:3, name:'Era dos Cristais', icon:'💎',
    benefit:'+50% cristais', drawback:'Sequências aparecem por menos tempo',
    minH:1953,
    apply:()=>{
      G._progCrystalMult=1.5;
      G._progSeqTimeMult=0.75; /* menos tempo para memorizar */
    }
  },
  {
    id:4, name:'Era Ancestral', icon:'🏺',
    benefit:'+25% chance Ancient', drawback:'Área verde -25%',
    minH:12207,
    apply:()=>{
      G._progAncientBoost=0.25;
      G.tGreenW=Math.max(4, G.tGreenW*0.75);
    }
  },
  {
    id:5, name:'Era Divina', icon:'✨',
    benefit:'+100% Essência no prestígio', drawback:'Bosses +50% HP',
    minH:30517,
    apply:()=>{
      G._progEssenceMult=2.0;
      G._progBossHpMult=1.5;
    }
  }
];

/* Aplica progressões com base na altura */
function applyProgressions(){
  // Reset defaults
  G._progCoinMult=1;
  G._progRareBoost=0;
  G._progWindChance=0;
  G._progCrystalMult=1;
  G._progAncientBoost=0;
  G._progEssenceMult=1;
  G._progBossHpMult=1;
  G._progSeqTimeMult=1;
  // seqLen é gerenciado pela altura em getSeqLengthForHeight
  G.timingSpd=0.72;
  G.tGreenW=16;
  G.activeProgressions=[];
  PROGRESSIONS.forEach(p=>{
    if(G.height>=p.minH){
      p.apply();
      G.activeProgressions.push(p.id);
    }
  });
}

/* Peso por raridade (afeta inclinação da torre) */
const RARITY_WEIGHT={
  ember:1, stone:1, forest:1, water:1, wind:2,
  gold:2, crystal:2, shadow:2, light:3,
  chaos:3, ancient:4, divine:5,
  rainbow:3, 'boss-':0
};

/* Curva de dificuldade suave:
   - 0 a 300: fácil (sem penalidade, recupera bem)
   - Após 300: ×1.8 escalonado (300→540→972→1750→3150→...)
   Cada nível adiciona +8% de penalidade */
const DIFFICULTY_THRESHOLDS=[300, 540, 972, 1750, 3150, 5670, 10206, 18371, 33068, 59452];
function getDifficultyLevel(h){
  let lvl=0;
  for(const t of DIFFICULTY_THRESHOLDS){
    if(h>=t) lvl++;
    else break;
  }
  return lvl;
}
function getHeightInstabilityPenalty(h){
  if(h<300) return 0; /* fácil no início */
  const lvl=getDifficultyLevel(h);
  return Math.min(0.64, lvl*0.08); /* +8% por nível, cap 64% */
}
/* Multiplicador de dificuldade geral (afeta dano, sorte, etc) */
function getDifficultyMult(h){
  if(h<300) return 1.0; /* fácil no início */
  const lvl=getDifficultyLevel(h);
  return Math.pow(1.18, lvl); /* ×1.18 por nível acima de 300 */
}
/* Sorte (luck) ajustada pela dificuldade — fica mais difícil em níveis altos */
function getLuckChance(h){
  const base=Math.min(0.35, upLv('luck')*0.04);
  return base / getDifficultyMult(h);
}

/* Aplica o efeito da raridade da peça ao sucesso (chamado em onSuccess) */
function applyPieceRarityEffect(pt){
  if(!pt||!pt.id) return;
  switch(pt.id){
    case 'forest':
      G.stab=Math.min(G.maxStab,G.stab+1); break;
    case 'water':
      G._tempCoinMult=(G._tempCoinMult||1)+0.05; break;
    case 'wind':
      G.power=Math.min(100,G.power+2); break;
    case 'gold':
      G._tempCoinMult=(G._tempCoinMult||1)+0.08; break;
    case 'crystal':
      G._tempCoinMult=(G._tempCoinMult||1)+0.10; break;
    case 'shadow':
      G._tempCoinMult=(G._tempCoinMult||1)+0.10; break;
    case 'light':
      G._tempCoinMult=(G._tempCoinMult||1)+0.15; break;
    case 'chaos':{
      const chaosEffects=['coins','stab','power','height','luck'];
      const eff=chaosEffects[Math.floor(Math.random()*chaosEffects.length)];
      if(eff==='coins')  {G._tempCoinMult=(G._tempCoinMult||1)+0.20; spawnFloat('🎲 Caos: +20% moedas','#aa44ff',40);}
      if(eff==='stab')   {G.stab=Math.min(G.maxStab,G.stab+5);       spawnFloat('🎲 Caos: +5 estab','#aa44ff',40);}
      if(eff==='power')  {G.power=Math.min(100,G.power+15);          spawnFloat('🎲 Caos: +15 power','#aa44ff',40);}
      if(eff==='height') {G.height+=3; if(G.height>G.bestHeight)G.bestHeight=G.height; spawnFloat('🎲 Caos: +3 altura','#aa44ff',40);}
      if(eff==='luck')   {G._tempLuckBoost=(G._tempLuckBoost||0)+0.15; spawnFloat('🎲 Caos: +15% sorte','#aa44ff',40);}
      break;
    }
    case 'ancient':
      G.stab=Math.min(G.maxStab,G.stab+2); break;
    case 'divine':
      G._tempCoinMult=(G._tempCoinMult||1)+1.0;
      G._tempHeightMult=(G._tempHeightMult||1)+1.0;
      break;
  }
  // Bônus de relíquias equipadas
  if(G.relics && G.relics.shadowT)  G._tempCoinMult=(G._tempCoinMult||1)+0.10;
  if(G.relics && G.relics.ancientF) G.stab=Math.min(G.maxStab,G.stab+2);
  if(G.relics && G.relics.divineB)  G._tempCoinMult=(G._tempCoinMult||1)+0.50;
  if(G.relics && G.relics.emberC)   G.height+=1;
  if(G.relics && G.relics.windM)    G.power=Math.min(100,G.power+5);
}

/* Tier base — alturas escaladas ×2.5 a partir de 50 */
const TIERS_BASE = [
  {h:0,    label:'🌲 Floresta',   bg:'#071a07', accent:'#3de87a' },
  {h:50,   label:'🌋 Terra',      bg:'#1a0f05', accent:'#c06820' },
  {h:125,  label:'🪨 Pedra',      bg:'#0d0d11', accent:'#8090a0' },
  {h:312,  label:'🌊 Oceano',     bg:'#030b14', accent:'#4488ff' },
  {h:781,  label:'⚡ Tempestade', bg:'#05050f', accent:'#aa44ff' },
  {h:1953, label:'💎 Cristal',    bg:'#05030f', accent:'#88aaff' },
  {h:4882, label:'🌑 Sombria',    bg:'#050005', accent:'#9930cc' },
  {h:12207,label:'☀️ Dourada',    bg:'#0f0b00', accent:'#f0c040' },
  {h:30517,label:'🌌 Cósmica',    bg:'#020208', accent:'#6688ff' },
  {h:76293,label:'☄️ Cometa',     bg:'#080018', accent:'#88ccff' },
];

/* Quantidade de altura total de um ciclo completo (último tier + 1) */
const TIER_CYCLE = 76293;

/* Gera o TIERS dinâmico para o ciclo atual do jogador (1.0, 2.0, 3.0...) */
function buildTiersForCycle(cycle){
  const suffix = cycle>0 ? ' '+cycle+'.0' : '';
  return TIERS_BASE.map(t=>({
    h: t.h + cycle*TIER_CYCLE,
    label: t.label + suffix,
    bg: t.bg,
    accent: t.accent
  }));
}

/* TIERS visível para a sessão atual (compatível com código antigo) */
let TIERS = buildTiersForCycle(0);

/* Recalcula TIERS quando muda de ciclo */
function refreshTiersForHeight(h){
  const cycle = Math.floor(h / TIER_CYCLE);
  if(TIERS._cycle !== cycle){
    TIERS = buildTiersForCycle(cycle);
    TIERS._cycle = cycle;
  }
}

const MILESTONES = [
  {h:50,    t:'🌋 Terra!',      s:'A floresta cedeu lugar à terra bruta.'},
  {h:125,   t:'🪨 Pedra!',      s:'O totem endurece. As rochas falam.'},
  {h:312,   t:'🌊 Oceano!',     s:'Forças aquáticas fluem pelo totem!'},
  {h:781,   t:'⚡ Tempestade!', s:'O vento e o trovão sopram alto!'},
  {h:1953,  t:'💎 Cristal!',    s:'Energia mágica se manifesta!'},
  {h:4882,  t:'🌑 Sombria!',    s:'O poder das trevas desperta!'},
  {h:12207, t:'☀️ Dourada!',    s:'A lenda dourada se revela!'},
  {h:30517, t:'🌌 Cósmica!',    s:'Além dos limites mortais!'},
  {h:76293, t:'☄️ Cometa!',     s:'Você cruzou o véu estelar!'},
];

/* ════════════════════════════════════════
   LOJA — 3 CATEGORIAS COM CUSTOS MÚLTIPLOS
═══════════════════════════════════════ */
/* Recursos: wood=Madeira, stone=Pedra, goldR=Ouro, crystal=Cristal */

const UPGRADES = [
  // ── Melhorias Permanentes (5x mais caro) ──
  {id:'luck',   cat:'perm', icon:'🍀',name:'Dados de Sorte',      desc:'+4% chance (cap 35%)',                 maxLv:10,base:75,  mult:1.8, costRes:{}},
  {id:'shield', cat:'perm', icon:'🛡️',name:'Escudo do Totem',     desc:'+20 estab. máxima por nível',          maxLv:8, base:125, mult:2.0, costRes:{wood:25}},
  {id:'coins',  cat:'perm', icon:'💰',name:'Mult. de Moedas',      desc:'×1.5 moedas por nível',               maxLv:8, base:150, mult:2.2, costRes:{wood:40,stone:15}},
  {id:'crit',   cat:'perm', icon:'💥',name:'Peças Críticas',       desc:'+10% chance dobrar altura',            maxLv:5, base:250, mult:2.5, costRes:{stone:50,goldR:10}},
  {id:'auto',   cat:'perm', icon:'⚡',name:'Construção Auto',      desc:'Constrói automaticamente',             maxLv:5, base:500, mult:3.0, costRes:{goldR:25,crystal:5}},
  {id:'regen',  cat:'perm', icon:'💚',name:'Regeneração',          desc:'+2 estab. extra por acerto',           maxLv:8, base:175, mult:1.9, costRes:{wood:50,stone:25}},
  {id:'pieces', cat:'perm', icon:'🔮',name:'Peças Avançadas',      desc:'Acessa tipos raros 10h mais cedo',     maxLv:5, base:300, mult:2.8, costRes:{stone:75,goldR:15}},
  {id:'zone',   cat:'perm', icon:'⏱️',name:'Zona Ampliada',        desc:'+5% zona verde no timing',             maxLv:6, base:175, mult:2.0, costRes:{wood:60,stone:30}},
  {id:'stabRec',cat:'perm', icon:'🌿',name:'Recuperação Ativa',    desc:'+3 estab. extra por acerto',           maxLv:6, base:225, mult:2.1, costRes:{stone:60,goldR:10}},
  {id:'heightB',cat:'perm', icon:'📏',name:'Fundações Profundas',  desc:'+10% ganho de altura',                 maxLv:5, base:400, mult:2.6, costRes:{stone:100,goldR:20}},
  {id:'power',  cat:'perm', icon:'🔮',name:'Power Meter Rápido',   desc:'+15% carga do Power Meter',            maxLv:5, base:350, mult:2.3, costRes:{goldR:15,crystal:5}},
  {id:'combo',  cat:'perm', icon:'🎨',name:'Mestre de Combo',      desc:'+10% bônus de combo por nível',        maxLv:5, base:275, mult:2.4, costRes:{goldR:20,crystal:5}},
];

/* ── Construção (custa recursos) ── */
const BUILDINGS = [
  {id:'tower',   icon:'🏰',name:'Torre Reforçada',     desc:'+25 estab. máxima permanentemente',   cost:{wood:250,stone:100},           max:5},
  {id:'forge',   icon:'🔥',name:'Forja Ancestral',     desc:'+15% moedas em todas as peças',       cost:{wood:200,stone:200,goldR:25},  max:3},
  {id:'sanctum', icon:'⛪',name:'Santuário Místico',   desc:'+1 essência divina a cada prestígio', cost:{stone:400,goldR:50,crystal:10},max:1},
  {id:'garden',  icon:'🌿',name:'Jardim Eterno',       desc:'+3 estab. por turno passivo',         cost:{wood:500,stone:150},           max:1},
  {id:'observ',  icon:'🔭',name:'Observatório',        desc:'Revela próxima peça antes de jogar',  cost:{stone:300,goldR:40,crystal:5}, max:1},
];

/* ── Relíquias (custam cristal) ── */
/* Relíquias: req.height 115 inicial, multiplicador ×1.8 progressivo
   115 → 207 → 372 → 670 → 1206 → 2171 → ... */
function getRelicUnlockHeight(idx){
  const base=115;
  return Math.floor(base * Math.pow(1.8, idx));
}

const RELICS = [
  {id:'shadowT',  icon:'🌑',name:'Relíquia Shadow',     desc:'+10% moedas (permanente)',            cost:{crystal:3}},
  {id:'chaosC',   icon:'🌀',name:'Cristal do Caos',     desc:'25% chance de peça bônus',             cost:{crystal:6}},
  {id:'ancientF', icon:'🏺',name:'Fragmento Ancient',   desc:'+2 estab. por acerto (permanente)',   cost:{crystal:5}},
  {id:'divineB',  icon:'✨',name:'Bênção Divina',       desc:'+50% moedas (permanente)',            cost:{crystal:8}},
  {id:'windM',    icon:'💨',name:'Marcador do Vento',   desc:'+25% carga do Power Meter',           cost:{crystal:4}},
  {id:'emberC',   icon:'🔥',name:'Coração de Brasa',    desc:'+1 altura garantida por acerto',      cost:{crystal:2}},
];

/* ── Codex / Enciclopédia completa ── */
const CODEX = [
  // ── PEÇAS (Raridades) ──
  {id:'ember',   icon:'🔥',rarity:'Comum',     unlockH:0,   effect:'+1 altura base',                   desc:'A primeira peça. Simples, mas essencial para começar sua jornada.'},
  {id:'stone',   icon:'🪨',rarity:'Comum',     unlockH:8,   effect:'+1 altura base',                   desc:'A resistência da pedra dá solidez ao totem em construções iniciais.'},
  {id:'forest',  icon:'🌲',rarity:'Comum',     unlockH:16,  effect:'+1 estab. por acerto',             desc:'A energia vital da floresta regenera a estabilidade a cada vitória.'},
  {id:'water',   icon:'💧',rarity:'Incomum',   unlockH:28,  effect:'+5% moedas',                       desc:'O fluxo constante da água atrai pequenas fortunas para o totem.'},
  {id:'wind',    icon:'💨',rarity:'Incomum',   unlockH:42,  effect:'+5% velocidade de carga',          desc:'O vento acelera o Power Meter, permitindo liberar bônus mais rápido.'},
  {id:'gold',    icon:'🪙',rarity:'Incomum',   unlockH:60,  effect:'+8% moedas',                       desc:'Peças douradas amplificam os ganhos monetários de forma consistente.'},
  {id:'crystal', icon:'💎',rarity:'Rara',      unlockH:85,  effect:'+10% moedas',                      desc:'Cristais místicos intensificam as recompensas com sua energia.'},
  {id:'shadow',  icon:'🌑',rarity:'Rara',      unlockH:115, effect:'+10% moedas + protege combo',     desc:'O poder das sombras multiplica discretamente suas moedas. 50% chance de manter combo ao errar.'},
  {id:'light',   icon:'☀️',rarity:'Rara',      unlockH:155, effect:'+15% moedas',                      desc:'A luz divina amplifica tudo o que toca com brilho dourado.'},
  {id:'chaos',   icon:'🌀',rarity:'Épica',     unlockH:210, effect:'Efeito aleatório a cada peça',     desc:'O caos é imprevisível: pode dar moedas, estabilidade, altura, power ou sorte.'},
  {id:'ancient', icon:'🏺',rarity:'Lendária',  unlockH:280, effect:'+2 estabilidade por acerto',      desc:'A sabedoria ancestral fortalece cada acerto de forma permanente.'},
  {id:'divine',  icon:'✨',rarity:'Mística',   unlockH:380, effect:'Bônus duplo + 30% chance sobreviver queda', desc:'A peça suprema: dobra moedas E altura. 30% de chance de salvar o totem da queda.'},
  {id:'rainbow', icon:'🌈',rarity:'Mítica',    unlockH:0,   effect:'Todos os recursos + cor especial', desc:'Peça especial que aparece durante eventos Arco-Íris. Dá todos os recursos de uma vez.'},
];

const ACHIEVEMENTS = [
  // ── Iniciais ──
  {id:'first',     icon:'🎯',name:'Primeiros Passos',   desc:'Construa sua primeira peça',           check:()=>G.hits>=1},
  {id:'hits50',    icon:'🔨',name:'Trabalhador',        desc:'Acerte 50 vezes no total',              check:()=>G.hits>=50},
  {id:'hits200',   icon:'🏗️',name:'Pedreiro',           desc:'Acerte 200 vezes no total',             check:()=>G.hits>=200},
  // ── Sequências ──
  {id:'streak5',   icon:'🔥',name:'Em Chamas',          desc:'Sequência de 5 acertos',               check:()=>G.bestStreak>=5},
  {id:'streak10',  icon:'⚡',name:'Imparável',          desc:'Sequência de 10 acertos',              check:()=>G.bestStreak>=10},
  {id:'streak20',  icon:'🌟',name:'Lendário',           desc:'Sequência de 20 acertos',              check:()=>G.bestStreak>=20},
  {id:'streak30',  icon:'👑',name:'Imortal',            desc:'Sequência de 30 acertos',              check:()=>G.bestStreak>=30},
  // ── Altura (escala nova ×2.5) ──
  {id:'h50',       icon:'🌋',name:'Construtor',         desc:'Alcance 50 de altura (Terra)',          check:()=>G.bestHeight>=50},
  {id:'h125',      icon:'🪨',name:'Arquiteto',          desc:'Alcance 125 de altura (Pedra)',         check:()=>G.bestHeight>=125},
  {id:'h312',      icon:'🌊',name:'Engenheiro',         desc:'Alcance 312 de altura (Oceano)',        check:()=>G.bestHeight>=312},
  {id:'h781',      icon:'⚡',name:'Mestre',             desc:'Alcance 781 de altura (Tempestade)',    check:()=>G.bestHeight>=781},
  {id:'h1953',     icon:'💎',name:'Grão-Mestre',        desc:'Alcance 1953 de altura (Cristal)',      check:()=>G.bestHeight>=1953},
  {id:'h4882',     icon:'🌑',name:'Sombrio',            desc:'Alcance 4882 de altura (Sombria)',      check:()=>G.bestHeight>=4882},
  {id:'h12207',    icon:'☀️',name:'Dourado',            desc:'Alcance 12207 de altura (Dourada)',     check:()=>G.bestHeight>=12207},
  // ── Bosses ──
  {id:'boss1',     icon:'⚔️',name:'Caçador',            desc:'Derrote seu primeiro boss',            check:()=>G.bossDefeated.length>=1},
  {id:'boss5',     icon:'🏆',name:'Exterminador',       desc:'Derrote 5 bosses',                     check:()=>G.bossDefeated.length>=5},
  {id:'boss10',    icon:'👹',name:'Justiceiro',         desc:'Derrote 10 bosses',                    check:()=>G.bossDefeated.length>=10},
  {id:'boss20',    icon:'💀',name:'Lenda Sombria',      desc:'Derrote 20 bosses',                    check:()=>G.bossDefeated.length>=20},
  // ── Economia ──
  {id:'rich',      icon:'💰',name:'Rico',               desc:'Acumule 1000 moedas',                   check:()=>G.totalCoins>=1000},
  {id:'rich10k',   icon:'💎',name:'Magnata',            desc:'Acumule 10000 moedas',                  check:()=>G.totalCoins>=10000},
  // ── Especiais ──
  {id:'crit',      icon:'💥',name:'Crítico',            desc:'Consiga um acerto crítico',            check:()=>G.critHits>=1},
  {id:'crit10',    icon:'🌟',name:'Mestre Crítico',     desc:'Consiga 10 acertos críticos',           check:()=>G.critHits>=10},
  {id:'prestige',  icon:'⭐',name:'Renascer',           desc:'Faça seu primeiro prestígio',          check:()=>G.prestige>=1},
  {id:'prestige3', icon:'🌠',name:'Ciclo Eterno',       desc:'Faça 3 prestígios',                    check:()=>G.prestige>=3},
  {id:'perfect',   icon:'✨',name:'Perfeição',          desc:'Acerte a zona perfeita do timing',     check:()=>G.perfectHits>=1},
  {id:'perfect10', icon:'💫',name:'Mestre do Timing',   desc:'Acerte 10 vezes a zona perfeita',       check:()=>G.perfectHits>=10},
  {id:'combo3',    icon:'🎨',name:'Combo Mestre',       desc:'Alcance combo ×3',                      check:()=>G.bestCombo>=3},
  {id:'combo5',    icon:'🎭',name:'Virtuose',           desc:'Alcance combo ×5',                      check:()=>G.bestCombo>=5},
  {id:'dice20',    icon:'🎲',name:'Sortudo',            desc:'Tire o máximo num dado',                check:()=>G.luckyMax>=1},
  {id:'essence5',  icon:'✨',name:'Alquimista',         desc:'Acumule 5 de Essência Divina',          check:()=>(G.divineEssence||0)>=5},
];

const EVENTS = [
  {id:'rain',    name:'🌧️ Chuva',    desc:'Erros causam 2x dano à estabilidade',  dur:6, col:'#4080ff'},
  {id:'wind',    name:'💨 Vento',    desc:'Perde 2 estabilidade por turno',       dur:8, col:'#80c0ff'},
  {id:'blessing',name:'🌟 Bênção',   desc:'Próximas 5 peças garantidas + estab',  dur:5, col:'#c09000'},
  {id:'eclipse', name:'🌑 Eclipse',  desc:'Peças raras 3x mais frequentes',       dur:7, col:'#600090'},
  {id:'quake',   name:'🌋 Tremor',   desc:'Tremor súbito! -15 estabilidade (não fatal)',dur:1, col:'#804020'},
  {id:'festival',name:'🎉 Festival', desc:'Moedas dobradas por 8 turnos',         dur:8, col:'#006040'},
  {id:'spring',  name:'🌸 Primavera',desc:'+2 estabilidade por turno (cura)',     dur:6, col:'#a04060'},
  {id:'ancient', name:'🏺 Ancestral',desc:'Apenas peças Ancient por 5 turnos',    dur:5, col:'#806000'},
  {id:'rainbow', name:'🌈 Arco-Íris',desc:'Peças Rainbow especiais aparecem! (dão todos os recursos)', dur:6, col:'#ff8040'},
];

/* Bosses: 5 originais (símbolos corrigidos) + 6 novos = 11 total
   Habilidades especiais:
   - damageReduction: % de redução de dano por acerto (0-1)
   - failDamageMult: multiplicador de dano ao jogador quando erra (1 = padrão)
   - hpRegenOnHit: HP que o boss recupera quando jogador acerta
   - hpRegenOnFail: HP que o boss recupera quando jogador erra
*/
const BOSSES = [
  /* heightLoss: altura perdida ao errar durante boss fight
     (não tira mais estabilidade — só altura) */
  {id:'wind',    name:'🌬️ Espírito do Vento',     hp:4,  stabReward:25,  coinReward:60,  emoji:'🌬️', damageReduction:0,    failDamageMult:1.0, hpRegenOnHit:0, hpRegenOnFail:1, heightLoss:5  },
  {id:'forest',  name:'🫎 Guardião da Floresta',  hp:5,  stabReward:30,  coinReward:90,  emoji:'🫎', damageReduction:0.20, failDamageMult:1.0, hpRegenOnHit:0, hpRegenOnFail:1, heightLoss:5  },
  {id:'serpent', name:'🐍 Serpente Ancestral',    hp:6,  stabReward:35,  coinReward:130, emoji:'🐍', damageReduction:0,    failDamageMult:1.0, hpRegenOnHit:0, hpRegenOnFail:2, heightLoss:10 },
  {id:'storm',   name:'🐲 Espírito da Tempestade',hp:7,  stabReward:40,  coinReward:180, emoji:'🐲', damageReduction:0.10, failDamageMult:1.0, hpRegenOnHit:1, hpRegenOnFail:2, heightLoss:10 },
  {id:'titan',   name:'👹 Titã do Caos',          hp:9,  stabReward:50,  coinReward:250, emoji:'👹', damageReduction:0.25, failDamageMult:1.0, hpRegenOnHit:2, hpRegenOnFail:2, heightLoss:15 },
  {id:'alien',   name:'👽 Invasor Alienígena',     hp:8,  stabReward:45,  coinReward:220, emoji:'👽', damageReduction:0.15, failDamageMult:1.0, hpRegenOnHit:1, hpRegenOnFail:1, heightLoss:15 },
  {id:'death',   name:'💀 Ceifador da Morte',     hp:10, stabReward:55,  coinReward:300, emoji:'💀', damageReduction:0,    failDamageMult:1.0, hpRegenOnHit:0, hpRegenOnFail:3, heightLoss:20 },
  {id:'pixel',   name:'👾 Pixel King',            hp:7,  stabReward:40,  coinReward:200, emoji:'👾', damageReduction:0.30, failDamageMult:1.0, hpRegenOnHit:2, hpRegenOnFail:1, heightLoss:20 },
  {id:'ghost',   name:'👻 Fantasma Errante',      hp:6,  stabReward:35,  coinReward:170, emoji:'👻', damageReduction:0,    failDamageMult:1.0, hpRegenOnHit:0, hpRegenOnFail:2, heightLoss:25 },
  {id:'doll',    name:'🪆 Boneca Maldita',        hp:9,  stabReward:50,  coinReward:280, emoji:'🪆', damageReduction:0.20, failDamageMult:1.0, hpRegenOnHit:1, hpRegenOnFail:2, heightLoss:25 },
  {id:'drama',   name:'🎭 Mestre do Disfarce',    hp:11, stabReward:60,  coinReward:350, emoji:'🎭', damageReduction:0.15, failDamageMult:1.0, hpRegenOnHit:2, hpRegenOnFail:3, heightLoss:30 },
];

/* Cap de recuperação de estabilidade ao derrotar boss (máx 50) */
function applyBossStabReward(reward){
  const capped=Math.min(50, reward);
  G.stab=Math.min(G.maxStab, G.stab+capped);
  return capped;
}

/* ════════════════════════════════════════
   DICE TYPES — with custom colors & pips
════════════════════════════════════════ */
const DICE_TYPES = [
  { sides:6,  name:'d6',  color:'#e84050', dark:'#801020', label:'Cubo'      },
  { sides:8,  name:'d8',  color:'#3de87a', dark:'#106030', label:'Octaedro'  },
  { sides:12, name:'d12', color:'#aa44ff', dark:'#5020a0', label:'Dodecaedro'},
  { sides:20, name:'d20', color:'#f0c040', dark:'#705010', label:'Icosaedro' },
];

/* ════════════════════════════════════════
   STATE
════════════════════════════════════════ */
const SAVE_KEY='totemAsc_v9';
let G={};

function newState(){
  return {
    coins:0,totalCoins:0,
 xp:0,level:1,eventCooldown:4,
    height:0,bestHeight:0,
    stab:100,maxStab:100,
    hits:0,misses:0,streak:0,bestStreak:0,
    critHits:0,perfectHits:0,luckyMax:0,
    combo:0,bestCombo:0,lastMechanic:'',
    power:0,powerReady:false,
    prestige:0,presBonus:0,
    prestigeDifficulty:1,
    divineEssence:0,
    wood:0,stone:0,goldR:0,crystal:0,
    relics:{},
    buildings:{},
    relicUnlocks:{},
    phase:1,
    diceReq:4,diceSides:6,diceType:0,
    diceMode:'higher', /* higher/lower/exact/parity/interval */
    diceModeLabel:'Maior',
    diceParityTarget:'par', /* par/ímpar */
    diceIntervalMin:0,diceIntervalMax:0,
    lastDiceTypes:[], /* anti-repetição */
    luckCombo:0, /* combo de sorte — escalonado */
    timingSpd:0.72,tGreenW:16,tYellowW:44,tPerfectW:5,
    timingPattern:'pingpong', /* pingpong/delay/hidden/dual/moving/reverse */
    timingZoneSlide:0, /* para zona móvel */
    timingHideColors:false, /* pulso oculto */
    seqLen:4,seqSol:[],seqProg:0,seqTimer:5,seqTimerMax:5,seqShowTime:3,seqEcho:false,seqModifier:null,
    seqEcho:false,
    bossActive:false,bossIdx:0,bossHp:0,bossMaxHp:0,bossDefeated:[],
    lastBossEmoji:null,
    eventId:null,eventLeft:0,
    blessing:0,doubleCoins:false,windOn:false,
    springOn:false,ancientOn:false,rainbowOn:false,
    upgrades:{},
    pieces:[],
    piecesSinceBoss:0,bossThreshold:40,
    turn:0,
    timingConsec:0,
    lastPhase:1,
    mergeSpeed:0.5,
    achievements:{},
    freeRolls:0,
    totemsSaved:0,
    _inCritical:false,
    reviveCount:0,
    _lastPieceWeight:1,
    _divineSaves:0,
    _shadowProtections:0,
    _timingZones:null,
    _tempCoinMult:1,
    _tempHeightMult:1,
    _tempLuckBoost:0,
  };
}

/* ════════════════════════════════════════
   SCREEN NAV
════════════════════════════════════════ */
let curScreen='menu';
function goScreen(id){
  SFX.click();
  // Música ambiente
  if(id==='menu' && soundEnabled) playMenuMusic();
  else if(id==='game' && soundEnabled) playGameMusic();
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-'+id).classList.add('active');
  if(id!=='menu'){
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    const nb=document.getElementById('nb-'+id);
    if(nb) nb.classList.add('active');
  }
  curScreen=id;
  if(id==='upgrades')      renderUpgrades();
  if(id==='inventory')     renderInventory();
  if(id==='codex')         renderCodex();
  if(id==='achievements')  renderAchievements();
  if(id==='stats')         renderStats();
  if(id==='log')           renderLog();
  if(id==='inventory')     renderInventory();
  if(id==='codex')         renderCodex();
  if(id==='game')          updateHUD();
}

function startNewGame(){
  G=newState();
  goScreen('game');
  applyUpgFx();
  applyRelicBuildEffects();
  applyProgressions();
  renderTotem();
  setPhaseUI();
  updateHUD();
  startTimingLoop();
  startAutoLoop();
  startEventLoop();
  startStabCheckLoop();
  setTimeout(()=>notify('🗿 Bem-vindo! Toque o botão para construir!'),700);
  addLog('🗿 Jogo iniciado!','e');
  checkAchievements();
}

function continuarJogo(){
  loadGame();
  goScreen('game');
  applyUpgFx();
  applyRelicBuildEffects();
  applyProgressions();
  renderTotem();
  setPhaseUI();
  updateHUD();
  startTimingLoop();
  startAutoLoop();
  startEventLoop();
  startStabCheckLoop();
  addLog('▶️ Jogo retomado!','e');
}

/* ════════════════════════════════════════
   MENU BACKGROUND — floating runes & stars
════════════════════════════════════════ */
function initMenuBackground(){
  const bg=document.getElementById('menu-bg');
  if(!bg) return;
  bg.innerHTML='';
  // Floating runes
  for(let i=0;i<14;i++){
    const r=document.createElement('div');
    r.className='menu-rune';
    r.textContent=RUNES[Math.floor(Math.random()*RUNES.length)].glyph;
    r.style.left=Math.random()*100+'%';
    r.style.animationDuration=(10+Math.random()*12)+'s';
    r.style.animationDelay=(-Math.random()*15)+'s';
    r.style.fontSize=(1+Math.random()*1.5)+'em';
    bg.appendChild(r);
  }
  // Stars
  for(let i=0;i<30;i++){
    const s=document.createElement('div');
    s.className='menu-star';
    s.style.left=Math.random()*100+'%';
    s.style.top=Math.random()*100+'%';
    s.style.animationDelay=(-Math.random()*3)+'s';
    bg.appendChild(s);
  }
}

/* ════════════════════════════════════════
   HOW TO PLAY
════════════════════════════════════════ */
function openHowTo(){
  openModal(`
    <h2>📖 Como Jogar</h2>
    <p class="msub">Construa o totem mais alto do mundo místico!</p>
    <div class="htp-step"><div class="htp-num">1</div><div class="htp-text">
      <strong>Dados 🎲:</strong> Role o dado e alcance o número pedido. Tirar o máximo dá <strong>rolagem grátis</strong>!
    </div></div>
    <div class="htp-step"><div class="htp-num">2</div><div class="htp-text">
      <strong>Timing ⏱️:</strong> Pare o cursor na zona verde. Acertar a <strong>zona dourada central</strong> dá triplo de recompensa!
    </div></div>
    <div class="htp-step"><div class="htp-num">3</div><div class="htp-text">
      <strong>Sequência 🔮:</strong> Memorize e repita as runas. Modo <strong>Echo</strong> inverte a ordem!
    </div></div>
    <div class="htp-step"><div class="htp-num">4</div><div class="htp-text">
      <strong>Combo:</strong> Acerte mecânicas diferentes seguidas para aumentar o <strong>multiplicador</strong>!
    </div></div>
    <div class="htp-step"><div class="htp-num">5</div><div class="htp-text">
      <strong>Power Meter:</strong> Encha a barra roxa com acertos. Em 100%, libera bônus especial!
    </div></div>
    <div class="htp-step"><div class="htp-num">6</div><div class="htp-text">
      <strong>Bosses:</strong> A cada 40 acertos, um boss aparece. Derrote-o com acertos perfeitos!
    </div></div>
    <div class="htp-step"><div class="htp-num">7</div><div class="htp-text">
      <strong>Recursos:</strong> Cada peça dropa Madeira 🪵, Pedra 🪨, Ouro 🪙 ou Cristal 💎. Use-os na Loja!
    </div></div>
    <div class="htp-step"><div class="htp-num">8</div><div class="htp-text">
      <strong>Raridades:</strong> Peças raras (Shadow, Chaos, Ancient, Divine) têm efeitos especiais. Veja o Codex 📖!
    </div></div>
    <div class="htp-step"><div class="htp-num">9</div><div class="htp-text">
      <strong>Prestígio:</strong> Renasça para ganhar Essência Divina ✨. Mantém relíquias mas a dificuldade sobe 15%.
    </div></div>
    <button class="modal-close" onclick="closeModal()">Entendi!</button>
  `);
}

/* ════════════════════════════════════════
   MODAL
════════════════════════════════════════ */
let modalOpen=false;
function openModal(html){
 window.modalEpoch=(window.modalEpoch||0)+1;
  document.getElementById('modal-box').innerHTML=html;
  document.getElementById('modal-overlay').classList.add('open');
  modalOpen=true;
}
function closeModal(){
 if(window.rollBusy)return;
 if(G._seqRepeatInterval)clearInterval(G._seqRepeatInterval);seqTimerRunning=false;window.seqResolved=true;
  document.getElementById('modal-overlay').classList.remove('open');
  modalOpen=false;
 window.modalEpoch=(window.modalEpoch||0)+1;
  tRunning=false;
}
document.getElementById('modal-overlay').addEventListener('click',e=>{
  if(e.target===document.getElementById('modal-overlay')) closeModal();
});

/* ════════════════════════════════════════
   MAIN ACTION
════════════════════════════════════════ */
function handleAction(){
  if(modalOpen) return;
  SFX.click();
  initAudio();
  const p=G.phase;
  if(p===1) openDiceModal();
  else if(p===2) openTimingModal();
  else if(p===3) openSeqModal(); else if(p===4) openSealModal();
}

/* ════════════════════════════════════════
   DICE MODAL — Beautiful 3D dice with pips
════════════════════════════════════════ */
function openDiceModal(){
  const bMode=G.bossActive;
  const boss=bMode?BOSSES[G.bossIdx%BOSSES.length]:null;
  const diceType=DICE_TYPES[G.diceType%DICE_TYPES.length];
  const modeInfo=getDiceModeInfo();

  openModal(`
    <h2 style="font-size:1em;">${bMode?'⚔️ '+boss.name:'🎲 Dado da Sorte'}</h2>
    <div id="dice-objective-card" style="background:linear-gradient(135deg,${modeInfo.color}22,${modeInfo.color}08);border:2px solid ${modeInfo.color};border-radius:10px;padding:8px 10px;margin:2px 0;text-align:center;width:100%;box-sizing:border-box;">
      <div style="font-size:.62em;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">OBJETIVO — ${diceType.name}</div>
      <div style="font-size:1.2em;font-weight:900;color:${modeInfo.color};line-height:1.2;">${modeInfo.icon} ${modeInfo.label}</div>
      <div style="font-size:.95em;color:var(--text);margin-top:2px;font-weight:700;" id="drn">${getDiceRequirementText()}</div>
    </div>
    <div id="dice-stage">
      <div class="dd-scene" id="dice-scene">
        <div class="dd-cube" id="dice-cube">
          <div class="dd-face dd-front  dd-f1"><div class="dd-pip"></div></div>
          <div class="dd-face dd-back   dd-f6"><div class="dd-pip"></div><div class="dd-pip"></div><div class="dd-pip"></div><div class="dd-pip"></div><div class="dd-pip"></div><div class="dd-pip"></div></div>
          <div class="dd-face dd-right  dd-f3"><div class="dd-pip"></div><div class="dd-pip"></div><div class="dd-pip"></div></div>
          <div class="dd-face dd-left   dd-f4"><div class="dd-pip"></div><div class="dd-pip"></div><div class="dd-pip"></div><div class="dd-pip"></div></div>
          <div class="dd-face dd-top    dd-f2"><div class="dd-pip"></div><div class="dd-pip"></div></div>
          <div class="dd-face dd-bottom dd-f5"><div class="dd-pip"></div><div class="dd-pip"></div><div class="dd-pip"></div><div class="dd-pip"></div><div class="dd-pip"></div></div>
        </div>
        <div class="dd-poly-container" id="dice-poly-container">
          <svg class="dd-poly-svg" id="dice-poly-svg" viewBox="0 0 200 200"></svg>
        </div>
      </div>
    </div>
    <div id="dice-result-msg" style="min-height:18px;font-size:.85em;font-weight:700;text-align:center;"></div>
    ${G.freeRolls>0?`<p class="msub" style="color:var(--gold);font-size:.7em;margin:0;">🎁 ${G.freeRolls} rolagem(ns) bônus</p>`:''}
    <button class="upg-buy" style="width:100%;padding:10px;font-size:.9em"
      id="dice-roll-btn" onclick="execDiceRoll()">🎲 Rolar!</button>
    <button class="modal-close" onclick="closeModal()" style="font-size:.72em;padding:4px 14px;">Fechar</button>
  `);
  renderDiceFace(1);
}

/* Info visual de cada modo */
function getDiceModeInfo(){
  const m=G.diceMode;
  const map={
    higher:   {icon:'≥',label:'Maior ou igual',color:'#3de87a',desc:'Tirou igual ou acima'},
    lower:    {icon:'≤',label:'Menor ou igual',color:'#4488ff',desc:'Tirou igual ou abaixo'},
    exact:    {icon:'=',label:'Exato',    color:'#f0c040',desc:'Tirou exatamente o número'},
    parity:   {icon:'½',label:'Par/Ímpar',color:'#aa44ff',desc:'Paridade sorteada'},
    interval: {icon:'…',label:'Intervalo',color:'#ff8833',desc:'Dentro do intervalo'}
  };
  return map[m]||map.higher;
}

/* Mapeamento de rotação do cubo real para cada resultado do D6 */
const d6Rotations={1:[0,0],2:[-90,0],3:[0,-90],4:[0,90],5:[90,0],6:[0,180]};

/* Geometria SVG dos poliedros D8 / D12 / D20 (fiel ao arquivo de referência) */
const POLY_GEOMETRY={
  8:(svg,num,color)=>{
    svg.innerHTML=`
      <polygon points="100,20 170,100 100,180 30,100" fill="${color}" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
      <line x1="30" y1="100" x2="170" y2="100" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <text x="100" y="110" text-anchor="middle" dominant-baseline="middle" fill="white" class="dd-poly-num font-dd8">${num}</text>
    `;
  },
  12:(svg,num,color)=>{
    svg.innerHTML=`
      <polygon points="100,30 166,78 141,156 59,156 34,78" fill="${color}" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
      <text x="100" y="105" text-anchor="middle" dominant-baseline="middle" fill="white" class="dd-poly-num font-dd12">${num}</text>
    `;
  },
  20:(svg,num,color)=>{
    svg.innerHTML=`
      <polygon points="100,20 180,70 180,140 100,190 20,140 20,70" fill="${color}" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
      <line x1="100" y1="20" x2="100" y2="190" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <line x1="20" y1="70" x2="180" y2="140" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <line x1="20" y1="140" x2="180" y2="70" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <text x="100" y="115" text-anchor="middle" dominant-baseline="middle" fill="white" class="dd-poly-num font-dd20">${num}</text>
    `;
  }
};

/* Renderiza a face do dado: cubo real (D6) ou poliedro SVG (D8/D12/D20) */
function renderDiceFace(value,cls){
  const cube=document.getElementById('dice-cube');
  const polyContainer=document.getElementById('dice-poly-container');
  const polySvg=document.getElementById('dice-poly-svg');
  if(!cube||!polyContainer||!polySvg) return;
  const diceType=DICE_TYPES[G.diceType%DICE_TYPES.length];
  const sides=diceType.sides;

  if(sides===6){
    cube.style.display='block';
    polyContainer.classList.remove('visible');
    const [rx,ry]=d6Rotations[value]||[0,0];
    cube.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;
  } else {
    cube.style.display='none';
    polyContainer.classList.add('visible');
    if(POLY_GEOMETRY[sides]) POLY_GEOMETRY[sides](polySvg,value,diceType.color);
  }

  const stage=document.getElementById('dice-stage');
  if(stage){
    stage.classList.remove('dice-win','dice-lose');
    if(cls==='win'){ void stage.offsetWidth; stage.classList.add('dice-win'); }
    else if(cls==='lose'){ void stage.offsetWidth; stage.classList.add('dice-lose'); }
  }
}

function execDiceRoll(){
 if(window.rollBusy)return;window.rollBusy=true;
  SFX.dice();
  const btn=document.getElementById('dice-roll-btn');
  if(btn) btn.disabled=true;
  const container=document.getElementById('dice-scene');
  if(!container){window.rollBusy=false;return;}

  container.classList.add('dd-shaking');
  container.classList.remove('dd-rolling-3d');
  void container.offsetWidth;
  container.classList.add('dd-rolling-3d');
  let tick=0;
  const totalTicks=14;
  const iv=setInterval(()=>{
    try{
      const val=rnd(G.diceSides);
      renderDiceFace(val);
      if(++tick>=totalTicks){
        clearInterval(iv);
        container.classList.remove('dd-shaking','dd-rolling-3d');
        const roll=rnd(G.diceSides);
        const luckB=getLuckChance(G.height);
        const maxVal=G.diceSides;
        const isLuckyMax=roll===maxVal;
        const pass=diceRollPasses(roll)||(G.blessing>0)||(Math.random()<luckB);

        renderDiceFace(roll,pass?'win':'lose');

        if(pass){
          spawnDiceParticles(isLuckyMax?'#f0c040':'#3de87a');
        } else {
          spawnDiceParticles('#e84050');
        }

        const msg=document.getElementById('dice-result-msg');
        if(msg){
          if(isLuckyMax&&pass){
            if(G.freeRolls<2){
              G.freeRolls++;
              msg.textContent='🌟 MÁXIMO! +1 Rolagem Bônus ('+G.freeRolls+'/2)';
            } else {
              msg.textContent='🌟 MÁXIMO! +20💰';
              G.coins+=20; G.totalCoins+=20;
            }
            msg.style.color='#f0c040';
            G.luckyMax++;
            SFX.perfect();
          } else if(pass){
            msg.textContent=diceRollPasses(roll)?'✅ Acertou! ('+roll+')':'✨ Sorte ou bênção salvou a jogada! ('+roll+')';
            msg.style.color='#3de87a';
            SFX.success();
          } else {
            msg.textContent='❌ Falhou! ('+roll+')';
            msg.style.color='#e84050';
            SFX.fail();
          }
        }

        const mechanic='dice';
        if(G.lastMechanic&&G.lastMechanic!==mechanic){
          G.combo++;
          if(G.combo>G.bestCombo) G.bestCombo=G.combo;
          if(G.combo>=2) spawnFloat('🎨 Combo ×'+(G.combo+1)+'!','#aa44ff',0);
        } else {
          G.combo=0;
        }
        G.lastMechanic=mechanic;

        if(pass){
          // Quality: perfect se passou com folga, lucky se passou no limite
          const isPerfect = (G.diceMode==='higher' && roll>=Math.ceil(G.diceSides*0.8)) ||
                            (G.diceMode==='lower' && roll<=Math.ceil(G.diceSides*0.2)) ||
                            (G.diceMode==='exact') ||
                            (G.diceMode==='parity') ||
                            (G.diceMode==='interval' && roll===Math.floor((G.diceIntervalMin+G.diceIntervalMax)/2));
          onSuccess('dice',isPerfect?'perfect':'lucky',6);
          // Anti-repetição
          if(!G.lastDiceTypes) G.lastDiceTypes=[];
          G.lastDiceTypes.push(G.diceType);
          if(G.lastDiceTypes.length>3) G.lastDiceTypes.shift();
          const lastTwo=G.lastDiceTypes.slice(-2);
          if(lastTwo.length===2 && lastTwo[0]===lastTwo[1]){
            let newType=(G.diceType+1+Math.floor(Math.random()*(DICE_TYPES.length-1)))%DICE_TYPES.length;
            G.diceType=newType;
            spawnFloat('🎲 Dado trocado!','#4488ff',50);
          } else if(G.streak%3===0){
            G.diceType=(G.diceType+1)%DICE_TYPES.length;
          }
        } else {
          if(G.freeRolls>0){
            G.freeRolls--;
            if(msg){msg.textContent='🎁 Rolagem grátis usada!';msg.style.color='#f0c040';}
            onSuccess('dice','lucky',3);
          } else {
            onFail();
          }
        }
        updateDiceReq();
      }
    }catch(e){
      console.error('Erro no execDiceRoll:',e);
      clearInterval(iv);
    }
  },55);
  // Garantia: sempre fechar modal após 1.2s, mesmo se houver erro
  setTimeout(()=>{
    try{window.rollBusy=false;closeModal();checkPhaseShift();checkAchievements();}catch(e){console.error('Erro ao fechar modal:',e);}
  },1700);
}

function spawnDiceParticles(color){
  const stage=document.getElementById('dice-stage');
  if(!stage) return;
  const rect=stage.getBoundingClientRect();
  for(let i=0;i<14;i++){
    const p=document.createElement('div');
    p.style.cssText=`position:fixed;left:${rect.left+rect.width/2}px;top:${rect.top+rect.height/2}px;
      width:6px;height:6px;border-radius:50%;background:${color};pointer-events:none;z-index:250;
      box-shadow:0 0 8px ${color};`;
    document.body.appendChild(p);
    const angle=(Math.PI*2*i)/14;
    const dist=60+Math.random()*40;
    p.animate([
      {transform:'translate(0,0) scale(1)',opacity:1},
      {transform:`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`,opacity:0}
    ],{duration:700,easing:'cubic-bezier(.22,.68,0,1)'}).onfinish=()=>p.remove();
  }
}

function getDiceRequirementText(){
  switch(G.diceMode){
    case 'higher':   return '≥ '+G.diceReq;
    case 'lower':    return '≤ '+G.diceReq;
    case 'exact':    return '= '+G.diceReq;
    case 'parity':   return G.diceParityTarget==='par'?'Par':'Ímpar';
    case 'interval': return G.diceIntervalMin+'-'+G.diceIntervalMax;
    default: return '≥ '+G.diceReq;
  }
}

function updateDiceReq(){
  const diceType=DICE_TYPES[G.diceType%DICE_TYPES.length];
  const sides=diceType.sides;
  G.diceSides=sides;
  // Pesos: Maior/Menor comuns (70%), Exato/Par-Ímpar/Intervalo raros (30%)
  const modes=[
    {m:'higher',   w:38},
    {m:'lower',    w:32},
    {m:'exact',    w:8},
    {m:'parity',   w:12},
    {m:'interval', w:10}
  ];
  const totalW=modes.reduce((s,x)=>s+x.w,0);
  let r=Math.random()*totalW;
  let chosen=modes[0].m;
  for(const x of modes){
    r-=x.w;
    if(r<=0){chosen=x.m;break;}
  }
  G.diceMode=chosen;
  // Configura requisitos por modo — SEMPRE com chance real de passar
  if(chosen==='higher'){
    // Maior ou igual: entre 2 e sides-1 (sempre tem pelo menos 2 valores possíveis)
    // ex: d6 → 2..5 (50-83%), d8 → 3..6, d12 → 4..10, d20 → 6..17
    const minReq=Math.max(2, Math.ceil(sides*0.35));
    const maxReq=sides-1; /* nunca pedir >sides */
    G.diceReq=minReq+Math.floor(Math.random()*(maxReq-minReq+1));
    G.diceModeLabel='Maior ou igual a';
  } else if(chosen==='lower'){
    // Menor ou igual: entre 2 e sides-1 (sempre tem pelo menos 2 valores possíveis)
    // ex: d6 → 2..5 (33-83%), nunca ≤0 ou ≤1
    const minReq=2;
    const maxReq=Math.max(3, Math.floor(sides*0.65));
    G.diceReq=minReq+Math.floor(Math.random()*(maxReq-minReq+1));
    G.diceModeLabel='Menor ou igual a';
  } else if(chosen==='exact'){
    // Exatamente: qualquer número entre 1 e sides
    G.diceReq=1+Math.floor(Math.random()*sides);
    G.diceModeLabel='Exatamente';
  } else if(chosen==='parity'){
    G.diceParityTarget=Math.random()<0.5?'par':'impar';
    G.diceModeLabel=G.diceParityTarget==='par'?'Número PAR':'Número ÍMPAR';
  } else if(chosen==='interval'){
    // Intervalo com 30-50% das faces, sempre válido
    const span=Math.max(2, Math.floor(sides*0.4));
    const maxStart=sides-span+1;
    const a=1+Math.floor(Math.random()*maxStart);
    G.diceIntervalMin=a;
    G.diceIntervalMax=a+span-1;
    G.diceModeLabel='Entre '+G.diceIntervalMin+' e '+G.diceIntervalMax;
  }
  // Atualiza UI
  const el=document.getElementById('drn');
  if(el) el.textContent=getDiceRequirementText();
  const dmEl=document.getElementById('dmode');
  if(dmEl) dmEl.textContent=G.diceModeLabel;
}

/* Verifica se o roll passa de acordo com o modo atual */
function diceRollPasses(roll){
  switch(G.diceMode){
    case 'higher':   return roll>=G.diceReq;
    case 'lower':    return roll<=G.diceReq;
    case 'exact':    return roll===G.diceReq;
    case 'parity':   return G.diceParityTarget==='par' ? (roll%2===0) : (roll%2===1);
    case 'interval': return roll>=G.diceIntervalMin && roll<=G.diceIntervalMax;
    default:         return roll>=G.diceReq;
  }
}

/* ════════════════════════════════════════
   TIMING MODAL — with PERFECT PULSE (golden center)
════════════════════════════════════════ */
let tPos=0,tDir=1,tRunning=false,tLast=0;
let timingConsecHits=0;

function getTimingSpeed(){
  const base=G.timingSpd;
  const mult=G.bossActive?3:Math.min(timingConsecHits,3);
  const bonus=mult*0.15;
  return base+bonus;
}

function getTimingPatternInfo(){
  const p=G.timingPattern||'pingpong';
  const map={
    pingpong: {label:'Ping-Pong',icon:'↔️',desc:'Cursor vai e volta'},
    delay:    {label:'Delay Falso',icon:'🐌',desc:'Desacelera perto do verde'},
    hidden:   {label:'Pulso Oculto',icon:'🌫️',desc:'Cores somem nos últimos 0.6s'},
    dual:     {label:'Janela Dupla',icon:'⛩️',desc:'Dois verdes — só um é válido'},
    moving:   {label:'Zona Móvel',icon:'🏃',desc:'Verde desliza'},
    reverse:  {label:'Reverse',icon:'⏮️',desc:'Começa rápido e desacelera'}
  };
  return map[p]||map.pingpong;
}

function pickTimingPattern(){
  // Padrão aleatório com base na altura (mais variações em alturas altas)
  const h=G.height;
  let pool=['pingpong'];
  if(h>=50)  pool.push('pingpong','delay');
  if(h>=150) pool.push('reverse','moving');
  if(h>=300) pool.push('hidden','dual');
  return pool[Math.floor(Math.random()*pool.length)];
}

function openTimingModal(){
  const bMode=G.bossActive;
  const boss=bMode?BOSSES[G.bossIdx%BOSSES.length]:null;
  let speedMult=timingConsecHits;
  if(bMode) speedMult=3;
  const spdLabel=speedMult===0?'Normal':
    speedMult===1?'Rápido ⚡':
    speedMult===2?'Veloz ⚡⚡':'Extremo ⚡⚡⚡';

  // Sorteia padrão de timing
  G.timingPattern=pickTimingPattern();
  G.timingHideColors=false;
  G.timingZoneSlide=0;
  const pat=getTimingPatternInfo();

  openModal(`
    <h2>${bMode?'⚔️ '+boss.name:'⏱️ Timing'}</h2>
    <p class="msub">Pare o cursor na zona verde! 🌟 Centro = Perfect!</p>
    <div id="timing-speed-badge">${pat.icon} Padrão: ${pat.label} — ${pat.desc} | Vel: ${spdLabel}</div>
    <div id="timing-track">
      <div id="t-red-l"></div>
      <div id="t-yellow-l"></div>
      <div id="t-green"></div>
      <div id="t-perfect"></div>
      <div id="t-green-2" style="display:none;"></div>
      <div id="t-yellow-r"></div>
      <div id="t-red-r"></div>
      <div id="t-cursor" style="left:0%"></div>
    </div>
    <div id="timing-hint">🔴 Falha | 🟡 Fraco | 🟢 Forte | 🌟 Perfect</div>
    <button class="upg-buy" style="width:100%;padding:13px;font-size:.95em"
      id="timing-go-btn" onclick="execTiming()">🔨 Construir!</button>
    <button class="modal-close" onclick="closeModal();tRunning=false;">Fechar</button>
  `);
  reposTimingZones();
  tPos=0;tDir=1;tLast=performance.now();
  tRunning=true;
  // Pulso oculto: esconder cores após 1.4s
  if(G.timingPattern==='hidden'){
    setTimeout(()=>{
      if(!tRunning) return;
      ['t-green','t-perfect','t-yellow-l','t-yellow-r','t-red-l','t-red-r'].forEach(id=>{
        const el=document.getElementById(id);
        if(el) el.style.opacity='0.15';
      });
      const hint=document.getElementById('timing-hint');
      if(hint) hint.textContent='🌫️ Cores ocultas — antecipe!';
    },1400);
  }
}

function startTimingLoop(){
 if(startTimingLoop.started)return; startTimingLoop.started=true;
  function loop(ts){
    if(tRunning){
      const dt=Math.min(40,Math.max(0,ts-tLast));
      let spd=getTimingSpeed()+
        (G.bossActive&&BOSSES[G.bossIdx%BOSSES.length].id==='serpent'?0.7:0);
      const pat=G.timingPattern||'pingpong';
      // Variações de velocidade
      if(pat==='delay'){
        // Desacelera perto do verde (centro 50%)
        const z=G._timingZones||{gL:40,gL2:60};
        const center=(z.gL+z.gL2)/2;
        const dist=Math.abs(tPos-center);
        if(dist<15) spd*=0.45; // desacelera perto do verde
        else spd*=1.3; // acelera fora
      } else if(pat==='reverse'){
        // Começa rápido e desacelera
        const phase=(tPos+0.01)/100;
        spd*=(1.6 - phase*1.0);
      }
      tPos+=tDir*spd*dt*0.05;
      if(tPos>=100){tPos=100;tDir=-1;}
      if(tPos<=0)  {tPos=0;  tDir=1;}
      // Zona móvel: desliza o verde
      if(pat==='moving' && G._timingZones){
        G.timingZoneSlide+=dt*0.0015;
        const offset=Math.sin(G.timingZoneSlide)*8;
        reposTimingZones(offset);
      }
      const cur=document.getElementById('t-cursor');
      if(cur) cur.style.left=tPos+'%';
    }
    tLast=ts;
    requestAnimationFrame(loop);
  }
  tLast=performance.now();
  requestAnimationFrame(loop);
}

function execTiming(){
 if(!tRunning)return;
 window.rollBusy=true;
 tRunning=false;
  const btn=document.getElementById('timing-go-btn');
  if(btn) btn.disabled=true;

  const z=G._timingZones||{};
  const hint=document.getElementById('timing-hint');
  let quality=null;
  // Centro perfeito (dourado)
  if(tPos>=z.pL&&tPos<=z.pL2){
    if(hint){hint.textContent='🌟 PERFECT! ×3 recompensa!';hint.style.color='#f0c040';}
    quality='perfect';
    G.perfectHits++;
    spawnTimingParticles('#f0c040');
    SFX.perfect();
  }
  // Verde = sucesso FORTE
  else if(tPos>=z.gL&&tPos<=z.gL2){
    if(hint){hint.textContent='🟢 Verde! Sucesso forte!';hint.style.color='#3de87a';}
    quality='strong';
    spawnTimingParticles('#3de87a');
    SFX.success();
  }
  // Amarelo = sucesso FRACO
  else if((tPos>=z.yL_l&&tPos<=z.yL_l2)||(tPos>=z.yR_l&&tPos<=z.yR_l2)){
    if(hint){hint.textContent='🟡 Amarelo — Sucesso fraco';hint.style.color='#f0c040';}
    quality='normal';
    spawnTimingParticles('#f0c040');
    SFX.click();
  }
  // Vermelho = FALHA (antes era "normal", agora é falha de verdade)
  else {
    if(hint){hint.textContent='🔴 Vermelho — FALHOU!';hint.style.color='#e84050';}
    SFX.fail();
  }

  // Combo multi-mecânica
  const mechanic='timing';
  if(G.lastMechanic&&G.lastMechanic!==mechanic){
    G.combo++;
    if(G.combo>G.bestCombo) G.bestCombo=G.combo;
    if(G.combo>=2) spawnFloat('🎨 Combo ×'+(G.combo+1)+'!','#aa44ff',0);
  } else {
    G.combo=0;
  }
  G.lastMechanic=mechanic;

  if(quality){
    timingConsecHits++;
    onSuccess('timing',quality,quality==='perfect'?9:quality==='strong'?7:4);
  } else {
    timingConsecHits=0;
    onFail();
  }

  setTimeout(()=>{window.rollBusy=false;closeModal();checkPhaseShift();checkAchievements();},750);
}

function spawnTimingParticles(color){
  const track=document.getElementById('timing-track');
  if(!track) return;
  const rect=track.getBoundingClientRect();
  for(let i=0;i<10;i++){
    const p=document.createElement('div');
    p.style.cssText=`position:fixed;left:${rect.left+tPos*rect.width/100}px;top:${rect.top+rect.height/2}px;
      width:5px;height:5px;border-radius:50%;background:${color};pointer-events:none;z-index:250;
      box-shadow:0 0 6px ${color};`;
    document.body.appendChild(p);
    const angle=Math.random()*Math.PI*2;
    const dist=40+Math.random()*40;
    p.animate([
      {transform:'translate(0,0) scale(1)',opacity:1},
      {transform:`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`,opacity:0}
    ],{duration:600,easing:'ease-out'}).onfinish=()=>p.remove();
  }
}

function reposTimingZones(offset){
  // Verde encolhe AGRESSIVAMENTE: 14% → 2% conforme altura
  const progressFactor=Math.max(0.45,1-Math.log2(1+G.height/100)*0.10);
  const gW=Math.max(7, Math.min(20, G.tGreenW*progressFactor + upLv('zone')*2));
  if(offset===undefined)G._timingBase=10+Math.random()*(80-gW);
  let gL=Math.max(2,Math.min(98-gW,G._timingBase+(offset||0)));
  const pW=Math.min(gW,Math.max(2.5,G.tPerfectW*progressFactor));
  const pL=gL+(gW-pW)/2;
  // Amarelo dos dois lados (cada um 6%)
  const yL_l=Math.max(0, gL-6);
  const yL_w=gL-yL_l;
  const yR_l=gL+gW;
  const yR_w=Math.min(6, 100-yR_l);
  // Vermelho dos dois lados (cada um 14%) — falha!
  const rL_l=Math.max(0, yL_l-14);
  const rL_w=yL_l-rL_l;
  const rR_l=yR_l+yR_w;
  const rR_w=Math.min(14, 100-rR_l);
  const g=document.getElementById('t-green');
  const p=document.getElementById('t-perfect');
  const yl=document.getElementById('t-yellow-l');
  const yr=document.getElementById('t-yellow-r');
  const rl=document.getElementById('t-red-l');
  const rr=document.getElementById('t-red-r');
  if(g){g.style.left=gL+'%';g.style.width=gW+'%';}
  if(p){p.style.left=pL+'%';p.style.width=pW+'%';}
  if(yl){yl.style.left=yL_l+'%';yl.style.width=yL_w+'%';}
  if(yr){yr.style.left=yR_l+'%';yr.style.width=yR_w+'%';}
  if(rl){rl.style.left=rL_l+'%';rl.style.width=rL_w+'%';}
  if(rr){rr.style.left=rR_l+'%';rr.style.width=rR_w+'%';}
  // Janela dupla: segundo verde falso (não pontua)
  const g2=document.getElementById('t-green-2');
  if(G.timingPattern==='dual' && g2){
    g2.style.display='block';
    g2.style.position='absolute';
    g2.style.height='100%';
    g2.style.background='linear-gradient(180deg,rgba(60,220,100,.4),rgba(60,220,100,.25))';
    const g2L=Math.max(0, 100-gL-gW-15)+Math.random()*10;
    g2.style.left=g2L+'%';
    g2.style.width=gW+'%';
    G._timingZonesFake={gL:g2L,gL2:g2L+gW};
  } else if(g2){
    g2.style.display='none';
    G._timingZonesFake=null;
  }
  // Guarda para execTiming
  G._timingZones={gL,gL2:gL+gW,pL,pL2:pL+pW,yL_l,yL_l2:yL_l+yL_w,yR_l,yR_l2:yR_l+yR_w,rL_l,rL_l2:rL_l+rL_w,rR_l,rR_l2:rR_l+rR_w};
}

/* ════════════════════════════════════════
   SEQUENCE MODAL — with ECHO MODE
════════════════════════════════════════ */
let seqShowTimer=null;
let seqTimerRunning=false;

function getSeqLengthForHeight(h){
  // 4 símbolos início → 7 máximo
  if(h<100)   return 4;
  if(h<300)   return 5;
  if(h<800)   return 6;
  return 7;
}

function getSeqShowTime(h, len){
  // Tempo de memorização: base 8s, diminui 0.5s a cada 300 de altura
  const base=Math.max(4, 8 - Math.floor(h/400));
  // +0.6s por símbolo (era 0.2)
  return Math.max(3, (base + len*0.6) * (G._progSeqTimeMult||1));
}

function getSeqRepeatTime(h, len){
  // Tempo para repetir: base 14s, +1.2s por símbolo (mais generoso)
  // Mínimo 8s mesmo em alturas altas
  return Math.max(8, (14 - Math.floor(h/300) + len*1.2) * (G._progSeqTimeMult||1));
}

function pickSeqModifier(h){
  // Modificadores entram progressivamente
  if(h<200) return null;
  const mods=[];
  if(h>=200) mods.push('shadow');
  if(h>=400) mods.push('wind');
  if(h>=700) mods.push('chaos');
  if(h>=1200) mods.push('ancient');
  if(h>=2000) mods.push('divine');
  // 35% chance de ativar um modificador
  if(Math.random()<0.35){
    return mods[Math.floor(Math.random()*mods.length)];
  }
  return null;
}

function getSeqModifierInfo(m){
  const map={
    shadow:  {icon:'🌑',label:'Shadow',desc:'Alguns símbolos escurecidos'},
    wind:    {icon:'💨',label:'Wind',desc:'Símbolos se movem lentamente'},
    chaos:   {icon:'🌀',label:'Chaos',desc:'Ordem dos símbolos embaralhada'},
    ancient: {icon:'🏺',label:'Ancient',desc:'Sequência aparece por menos tempo'},
    divine:  {icon:'✨',label:'Divine',desc:'Tentativa extra se errar'}
  };
  return map[m]||null;
}

function openSeqModal(){
  const bMode=G.bossActive;
  const boss=bMode?BOSSES[G.bossIdx%BOSSES.length]:null;
  G.seqLen=getSeqLengthForHeight(G.height);
  G.seqEcho=(G.streak>=3&&Math.random()<0.20);
  G.seqModifier=pickSeqModifier(G.height);
  G._seqDivineRetry=false;
  const showTime=getSeqShowTime(G.height, G.seqLen);
  const repeatTime=getSeqRepeatTime(G.height, G.seqLen);
  G.seqShowTime=showTime;
  G.seqTimerMax=repeatTime;

  const modInfo=getSeqModifierInfo(G.seqModifier);
  let modBadge='';
  if(modInfo){
    modBadge=`<div id="seq-mode-badge" style="background:rgba(170,68,255,.15);border:1px solid var(--purple);color:#c8a0ff;padding:5px 10px;border-radius:8px;font-size:.72em;margin:4px 0;">${modInfo.icon} ${modInfo.label}: ${modInfo.desc}</div>`;
  }
  openModal(`
    <h2>${bMode?'⚔️ '+boss.name:'🔮 Sequência de Runas'}</h2>
    <p class="msub">${G.seqEcho?'🌟 ECHO! Repita a sequência INVERTIDA!':'Memorize e repita a sequência!'}</p>
    ${G.seqEcho?'<div id="seq-mode-badge" style="background:rgba(240,192,64,.15);border:1px solid var(--gold);color:var(--gold);padding:5px 10px;border-radius:8px;font-size:.72em;margin:4px 0;">🔄 ECHO ATIVO — +50% Recompensa</div>':''}
    ${modBadge}
    <div id="seq-symbols"></div>
    <div id="seq-timer">Memorize: ${showTime.toFixed(1)}s</div>
    <div id="seq-progress-display"></div>
    <div id="seq-btns"></div>
    <div id="seq-hint"></div>
    <button class="modal-close" onclick="closeModal()">Fechar</button>
  `);
  genSeq();
}

function genSeq(){
 window.seqResolved=false;
  G.seqSol=Array.from({length:G.seqLen},()=>RUNES[Math.floor(Math.random()*RUNES.length)].glyph);
  if(G.seqEcho){
    G.seqSolOriginal=[...G.seqSol];
    G.seqSol=[...G.seqSol].reverse();
  }
  // Chaos: salva ordem embaralhada para exibição (mas solução é a original)
  if(G.seqModifier==='chaos'){
    G._seqDisplayOrder=[...G.seqSol].sort(()=>Math.random()-0.5);
    // Se por acaso ficou igual, inverte
    if(G._seqDisplayOrder.join('')===G.seqSol.join('')){
      G._seqDisplayOrder.reverse();
    }
  }
  if(G.seqModifier==='chaos'){G.seqSol=G.seqEcho?[...G._seqDisplayOrder].reverse():[...G._seqDisplayOrder];}
  G.seqProg=0;
  renderSeq();
  showSeqSymbols();
}

function showSeqSymbols(){
 const epoch=window.modalEpoch;
  const symDiv=document.getElementById('seq-symbols');
  if(!symDiv) return;
  // Display ORIGINAL order for memorization
  let display=G.seqEcho?G.seqSolOriginal:G.seqSol;
  // Chaos: mostra ordem embaralhada (jogador precisa descobrir a certa)
  if(G.seqModifier==='chaos' && G._seqDisplayOrder){
    display=G._seqDisplayOrder;
  }
  // Shadow: alguns símbolos escurecidos
  const shadowCount = G.seqModifier==='shadow' ? Math.ceil(G.seqLen/3) : 0;
  const shadowIdx = shadowCount>0 ? new Set() : null;
  if(shadowCount>0){
    while(shadowIdx.size<shadowCount) shadowIdx.add(Math.floor(Math.random()*G.seqLen));
  }
  // Wind: classe para animação de movimento
  const windClass = G.seqModifier==='wind' ? ' ssym-wind' : '';
  symDiv.innerHTML=display.map((g,i)=>{
    const isShadow = shadowIdx && shadowIdx.has(i);
    return `<div class="ssym${windClass}${isShadow?' ssym-shadow':''}" style="animation:dropIn .3s ease ${i*.08}s both">${g}</div>`;
  }).join('');

  if(seqShowTimer) clearTimeout(seqShowTimer);
  seqTimerRunning=true;
  // Ancient: tempo de exibição reduzido em 50%
  let showTime=G.seqShowTime;
  if(G.seqModifier==='ancient') showTime*=0.5;
  let remaining=showTime;
  const timerEl=document.getElementById('seq-timer');

  const startMs=Date.now();
  const tick=setInterval(()=>{
    if(epoch!==window.modalEpoch||!modalOpen||!document.getElementById("seq-symbols")||window.seqResolved){clearInterval(tick);return;}
    const elapsed=(Date.now()-startMs)/1000;
    remaining=Math.max(0, showTime-elapsed);
    if(timerEl) timerEl.textContent=`Memorize: ${remaining.toFixed(1)}s`;
    if(remaining<=0){
      clearInterval(tick);
      seqTimerRunning=false;
      if(symDiv) symDiv.innerHTML=display.map(g=>`<div class="ssym" style="opacity:0.2;pointer-events:none">◇</div>`).join('');
      if(timerEl) timerEl.textContent=G.seqEcho?'🔄 Inverta e repita agora:':'Sequência escondida! Repita:';
      // Inicia timer de repetição
      startRepeatTimer();
    }
  },100);
}

function startRepeatTimer(){
 const epoch=window.modalEpoch;
  const timerEl=document.getElementById('seq-timer');
  let remaining=G.seqTimerMax;
  const startMs=Date.now();
  const tick=setInterval(()=>{
    if(epoch!==window.modalEpoch||!modalOpen||!document.getElementById("seq-symbols")||window.seqResolved){clearInterval(tick);return;}
    const elapsed=(Date.now()-startMs)/1000;
    remaining=Math.max(0, G.seqTimerMax-elapsed);
    if(timerEl) timerEl.textContent=`Repita: ${remaining.toFixed(1)}s`;
    if(remaining<=0){
      clearInterval(tick);
      // Tempo esgotado = falha
      if(G.seqProg<G.seqSol.length){
        const h=document.getElementById('seq-hint');
        if(h){h.textContent='⏰ Tempo esgotado!';h.style.color='#e84050';}
        SFX.fail();
        window.seqResolved=true;window.rollBusy=true;
        setTimeout(()=>{onFail();window.rollBusy=false;closeModal();checkPhaseShift();checkAchievements();},500);
      }
    }
  },100);
  G._seqRepeatInterval=tick;
}

function renderSeq(){
  const symDiv=document.getElementById('seq-symbols');
  const btnDiv=document.getElementById('seq-btns');
  const prog=document.getElementById('seq-progress-display');
  if(!symDiv||!btnDiv) return;

  if(!seqTimerRunning){
    symDiv.innerHTML=G.seqSol.map((g,i)=>{
      const cls=i<G.seqProg?'ssym hit':'ssym';
      return `<div class="${cls}">${g}</div>`;
    }).join('');
  }

  if(prog) prog.textContent=`${G.seqProg} / ${G.seqSol.length}`;

  const pool=[...new Set(G.seqSol)];
  while(pool.length<4){
    const g=RUNES[Math.floor(Math.random()*RUNES.length)].glyph;
    if(!pool.includes(g)) pool.push(g);
  }
  pool.sort(()=>Math.random()-.5);

  btnDiv.innerHTML=pool.map(g=>
    `<button class="sbtn" onclick="seqClick('${g}')">${g}</button>`
  ).join('');

  const h=document.getElementById('seq-hint');
  if(h) h.textContent='';
}

function seqClick(glyph){
 if(window.seqResolved||seqTimerRunning||!modalOpen)return;
  if(G.seqProg>=G.seqSol.length) return;
  if(glyph===G.seqSol[G.seqProg]){
    G.seqProg++;
    renderSeq();
    if(G.seqProg>=G.seqSol.length){
      const h=document.getElementById('seq-hint');
      if(h){h.textContent=G.seqEcho?'🌟 ECHO Completo! +50%':'🌟 Sequência completa!';h.style.color='#f0c040';}
      SFX.perfect();
      if(G._seqRepeatInterval){clearInterval(G._seqRepeatInterval);G._seqRepeatInterval=null;}
      const mechanic='seq';
      if(G.lastMechanic&&G.lastMechanic!==mechanic){
        G.combo++;
        if(G.combo>G.bestCombo) G.bestCombo=G.combo;
        if(G.combo>=2) spawnFloat('🎨 Combo ×'+(G.combo+1)+'!','#aa44ff',0);
      } else {
        G.combo=0;
      }
      G.lastMechanic=mechanic;
      const stabBonus=G.seqEcho?3:2;
      window.seqResolved=true;window.rollBusy=true;
      setTimeout(()=>{onSuccess('seq','perfect',stabBonus);window.rollBusy=false;closeModal();checkPhaseShift();checkAchievements();},480);
    }
  } else {
    // Divine: uma tentativa extra
    if(G.seqModifier==='divine' && !G._seqDivineRetry){
      G._seqDivineRetry=true;
      const h=document.getElementById('seq-hint');
      if(h){h.textContent='✨ Divine te salvou! Tente novamente.';h.style.color='#ff44ff';}
      SFX.power();
      G.seqProg=0;
      renderSeq();
      return;
    }
    const h=document.getElementById('seq-hint');
    if(h){h.textContent='❌ Errado!';h.style.color='#e84050';}
    document.querySelectorAll('#seq-symbols .ssym').forEach(e=>e.classList.add('miss'));
    SFX.fail();
    G.seqProg=0;
    if(G._seqRepeatInterval){clearInterval(G._seqRepeatInterval);G._seqRepeatInterval=null;}
    window.seqResolved=true;window.rollBusy=true;
    setTimeout(()=>{onFail();window.rollBusy=false;closeModal();checkPhaseShift();checkAchievements();},580);
  }
}

/* ════════════════════════════════════════
   PHASE SHIFT
════════════════════════════════════════ */
function checkPhaseShift(){
 if(G._eventResolvedHits!==G.hits+G.misses){G._eventResolvedHits=G.hits+G.misses;advanceEvent();}
  const h=G.height;
  let np;
  if(h<20)      np=1;
  else if(h<50) np=Math.random()<.55?1:2;
  else if(h<100)np=[1,2,3,4][Math.floor(Math.random()*4)];
  else           np=[1,2,3,4][Math.floor(Math.random()*4)];

  if(np!==G.phase){
    if(G.phase===2&&np!==2){
      timingConsecHits=0;
    }
    G.lastPhase=G.phase;
    G.phase=np;
    setPhaseUI();
  }
}

function setPhaseUI(){
  const p=G.phase;
  const lbl=['','🎲 Dados','⏱️ Timing','🔮 Sequência','✦ Selos Elementais'];
  document.getElementById('phase-label').textContent='Mecânica: '+lbl[p];
  updateActionButton();
}

function updateActionButton(){
  const btn=document.getElementById('action-btn');
  const p=G.phase;
  if(G.bossActive){
    btn.className='btn-boss';btn.textContent='⚔️ Atacar Boss!';
  } else if(p===1){
    btn.className='btn-dice';btn.textContent='🎲 Jogar Dados';
  } else if(p===2){
    const spdLabel=timingConsecHits===0?'':
      timingConsecHits===1?' ⚡':timingConsecHits===2?' ⚡⚡':' ⚡⚡⚡';
    btn.className='btn-timing';btn.textContent='⏱️ Timing'+spdLabel;
  } else {
    btn.className='btn-seq';btn.textContent='🔮 Sequência';
  }
}

/* Combo de sorte (acertos consecutivos): 1→x1, 3→x1.2, 5→x1.5, 10→x2, 20→x3 */
function getLuckComboMult(){
  const s=G.luckCombo;
  if(s>=20) return 3.0;
  if(s>=10) return 2.0;
  if(s>=5)  return 1.5;
  if(s>=3)  return 1.2;
  return 1.0;
}
function getLuckComboLabel(){
  const s=G.luckCombo;
  if(s>=20) return 'x3.0 🔥🔥';
  if(s>=10) return 'x2.0 🔥';
  if(s>=5)  return 'x1.5 ⚡';
  if(s>=3)  return 'x1.2 ⚡';
  return 'x1.0';
}

/* ════════════════════════════════════════
   SUCCESS
════════════════════════════════════════ */
function onSuccess(src,quality,stabFixed){
  awardXP(quality==='perfect'?18:quality==='strong'?14:10);
  G.hits++;G.streak++;G.piecesSinceBoss++;
  G.luckCombo++; /* combo de sorte sobe a cada acerto */
  if(G.streak>G.bestStreak) G.bestStreak=G.streak;

  if(G.windOn) G.stab=Math.max(0,G.stab-2);
  if(G.springOn) G.stab=Math.min(G.maxStab,G.stab+2);

  let stabGain=stabFixed + upLv('regen')*2 + upLv('stabRec')*3;
  if(quality==='perfect') stabGain=Math.ceil(stabGain*1.5);
  if(G.streak>=5)         stabGain+=Math.floor(G.streak*0.3);
  // Recuperação limitada entre 3 e 9 por acerto (até 12 no easy mode <300)
  if(G.height<300){
    stabGain=Math.max(5, Math.min(12, stabGain));
  } else {
    stabGain=Math.max(3, Math.min(9, stabGain));
  }
  // Não exceder maxStab
  stabGain=Math.min(stabGain, G.maxStab-G.stab);
  if(stabGain>0){
    G.stab=Math.min(G.maxStab,G.stab+stabGain);
    spawnFloat('+'+stabGain+' ⚖️','#3de87a',-55);
  }

  // Power meter charge
  const powerGain=10 + upLv('power')*3 + (quality==='perfect'?8:0);
  G.power=Math.min(100,G.power+powerGain);
  if(G.power>=100&&!G.powerReady){
    G.powerReady=true;
    showEventToast('🔮 POWER METER PRONTO!');
    notify('🔮 Power Meter cheio! Toque para liberar!');
    SFX.power();
  }
  updatePowerUI();

  if(G.bossActive){
    const boss=BOSSES[G.bossIdx%BOSSES.length];
    let dmg=quality==='perfect'?3:quality==='strong'?2.2:1.8;
 dmg*=1+Math.min(0.4,((G.level||1)-1)*0.01);
    // Redução de dano
    if(boss.damageReduction) dmg=dmg*(1-boss.damageReduction);
    G.bossHp-=dmg;
    // Boss regenera HP ao ser atingido
    if(boss.hpRegenOnHit && G.bossHp>0){
      G.bossHp=Math.min(G.bossMaxHp, G.bossHp+Math.min(boss.hpRegenOnHit,dmg*0.3));
    }
    updateBossUI();
    SFX.bossHit();
    if(G.bossHp<=0)G._bossDefeatPending=true;
  }

  // Reset temporários por jogada
  G._tempCoinMult=1;
  G._tempHeightMult=1;
  G._tempLuckBoost=0;

  const pt=choosePiece(quality);
  applyPieceRarityEffect(pt);

  const crit=Math.random()<(upLv('crit')*.10 + G._tempLuckBoost);
  if(crit) G.critHits++;
  const perf=quality==='perfect'||quality==='lucky';

  let hGain=pt.hv;
  hGain=Math.ceil(hGain*(1+upLv('heightB')*.10));
  if(crit)      hGain*=2;
  else if(perf) hGain=Math.ceil(hGain*1.35);
  if(quality==='perfect' && src==='timing') hGain*=3;
  if(G.seqEcho && src==='seq') hGain=Math.ceil(hGain*1.5);
  if(G.blessing>0){G.blessing--;hGain=Math.ceil(hGain*1.25);}
  const luckMult=getLuckComboMult();
  /* combo multi-mecânico continua funcionando em paralelo */
  const comboMult=G.combo>=2?(1+G.combo*(0.15+upLv('combo')*0.10)):1;
  hGain=Math.ceil(hGain*luckMult*comboMult);
  if(G.powerReady){
    hGain*=2;
    G.power=0;
    G.powerReady=false;
    showEventToast('💥 POWER RELEASE! ×2!');
    spawnFloat('💥 POWER!','#aa44ff',0);
    SFX.power();
  }
  hGain=Math.ceil(hGain*(G._tempHeightMult||1));

  G.height+=hGain;
  if(G.height>G.bestHeight) G.bestHeight=G.height;
  // Re-aplica progressões se passou de algum threshold
  const wasActiveLen=G.activeProgressions?G.activeProgressions.length:0;
  applyProgressions();
  if(G.activeProgressions.length>wasActiveLen){
    const newProg=PROGRESSIONS.find(p=>p.id===G.activeProgressions[G.activeProgressions.length-1]);
    if(newProg){
      showEventToast(newProg.icon+' '+newProg.name+'! '+newProg.benefit+' / ⚠ '+newProg.drawback);
      addLog(newProg.icon+' Progressão: '+newProg.name+' — '+newProg.benefit+', mas '+newProg.drawback,'a');
      SFX.milestone();
    }
  }

  let c=pt.cv*(1+upLv('coins')*.5);
  if(crit)          c*=2;
  if(G.doubleCoins) c*=2;
  if(G.streak>=5)   c*=(1+G.streak*.04);
  c*=comboMult*luckMult;
  if(G.seqEcho && src==='seq') c=Math.ceil(c*1.5);
  if(quality==='perfect' && src==='timing') c*=3;
  if(G.buildings && G.buildings.forge) c*=(1+G.buildings.forge*0.15);
  if(G.divineEssence>0) c*=(1+G.divineEssence*0.10);
  if(G._progCoinMult) c*=G._progCoinMult;
  c*=(G._tempCoinMult||1);
  c=Math.ceil(c*(1+G.presBonus));
  G.coins+=c;G.totalCoins+=c;

  addResource(pt.id,1);
  addPieceVisual(pt,perf,crit);
  // Conta peças especiais para proteções
  if(pt.id==='divine') G._divineSaves=(G._divineSaves||0)+1;
  if(pt.id==='shadow') G._shadowProtections=(G._shadowProtections||0)+1;
  SFX.piece();
  if(crit) SFX.crit();
  if(G.combo>=2) SFX.combo();
  SFX.coin();

  if(G.relics && G.relics.chaosC && Math.random()<0.25){
    G.height+=Math.ceil(pt.hv*0.5);
    if(G.height>G.bestHeight) G.bestHeight=G.height;
    spawnFloat('🌀 Bônus Caos!','#aa44ff',-40);
  }

  spawnFloat('+'+hGain+' 📏','#3de87a');
  spawnFloat('+'+c+' 💰','#f0c040',30);
  if(crit)         spawnFloat('💥 CRÍTICO!','#e84050',-30);
  if(perf&&!crit)  spawnFloat('⭐ Perfeito!','#f0c040',58);
  if(G.streak===5) spawnFloat('🔥 ×5!','#ff8833');
  if(G.streak===10)spawnFloat('⚡ ×10!','#ffff44');
  if(G.streak===20)spawnFloat('🌟 ×20!','#f0c040');

  // Streak aura on totem
  updateStreakAura();

  updateStreakDisplay();
  updateComboDisplay();
  addLog(`✅ +${hGain}📏 +${c}💰 ${pt.name}${crit?' 💥':''}${perf?' ⭐':''} +${stabGain}⚖️${G.combo>=2?' 🎨×'+(G.combo+1):''}`,'s');

  if(G._bossDefeatPending){G._bossDefeatPending=false;defeatBoss();}
  checkBossSpawn();
  checkMilestones();
  checkPresBtn();
  applyTilt();
  bumpHUD('pill-coins');
  bumpHUD('pill-height');
  updateHUD();
  saveGame();
}

/* ════════════════════════════════════════
   FAIL
════════════════════════════════════════ */
function onFail(){
  // Divine: chance de sobreviver a uma queda
  if(G.stab<=0 && G._divineSaves && G._divineSaves>0 && Math.random()<0.30){
    G._divineSaves--;
    G.stab=Math.ceil(G.maxStab*0.30);
    showEventToast('✨ Divine protegeu o totem!');
    spawnFloat('✨ Salvo por Divine!','#ff44ff',0);
    addLog('✨ Divine salvou o totem da queda!','a');
    SFX.power();
    updateHUD();
    return;
  }
  G.misses++;G.streak=0;
  G.combo=0;
  // Shadow protege combo (50% chance de manter luckCombo)
  if(G._shadowProtections && G._shadowProtections>0 && Math.random()<0.50){
    G._shadowProtections--;
    spawnFloat('🌑 Shadow protegeu o combo!','#9930cc',0);
    // Mantém luckCombo
  } else {
    G.luckCombo=0;
  }
  timingConsecHits=0;
  updateStreakDisplay();
  updateComboDisplay();
  updateStreakAura();

  let dmg=8;
  if(G.eventId==='rain') dmg=Math.ceil(dmg*2.0);
  dmg=Math.ceil(dmg*G.prestigeDifficulty);
  // Penalidade por altura (curva ×1.8 após 300)
  const hPen=getHeightInstabilityPenalty(G.height);
  const diffMult=getDifficultyMult(G.height);
  dmg=Math.ceil(dmg*(1+hPen)*diffMult);
  // Easy mode até 300: dano reduzido
  if(G.height<300) dmg=Math.max(3, Math.floor(dmg*0.6));

  // DURANTE BOSS: NÃO perde estabilidade. Perde ALTURA no lugar.
  if(G.bossActive){
    const boss=BOSSES[G.bossIdx%BOSSES.length];
    const healAmt=boss.hpRegenOnFail||1;
    const heightLoss=boss.heightLoss||5;
    G.bossHp=Math.min(G.bossMaxHp,G.bossHp+healAmt);
    // Perde altura (não estabilidade)
    G.height=Math.max(0, G.height-heightLoss);
    spawnFloat('-'+heightLoss+' 📏 '+boss.emoji+'','#ff4040',-40);
    updateBossUI();
    spawnFloat('+'+healAmt+' Boss cura','#ff7070',40);
    addLog('💀 '+boss.name+' tirou '+heightLoss+' de altura! Recuperou +'+healAmt+' HP!','e');
    SFX.boss();
    // Estado crítico não se aplica durante boss (jogador não perde stab)
    const tt=document.getElementById('totem-tilt');
    tt.classList.add('shaking');
    setTimeout(()=>tt.classList.remove('shaking'),500);
    applyTilt();
    updateHUD();saveGame();
    return;
  }

  G.stab=Math.max(0,G.stab-dmg);

  const tt=document.getElementById('totem-tilt');
  tt.classList.add('shaking');
  setTimeout(()=>tt.classList.remove('shaking'),500);

  spawnFloat('-'+dmg+' ⚖️','#e84050');
  addLog(`❌ Falhou! -${dmg}⚖️`,'f');

  applyTilt();
  // Estado crítico: stab <= 10 (mas > 0)
  if(G.stab>0 && G.stab<=10 && !G._inCritical){
    triggerCriticalState();
    updateHUD();saveGame();
    return;
  }
  if(G.stab<=0){gameOver();return;}
  updateHUD();saveGame();
}

/* Estado crítico — abre overlay com 3 desafios de recuperação */
function triggerCriticalState(){
  G._inCritical=true;
  SFX.critical();
  const ov=document.getElementById('critical-overlay');
  if(ov){
    document.getElementById('crit-saved').textContent=G.totemsSaved||0;
    ov.classList.add('show');
  }
  // Tela vermelha tremor
  document.body.classList.add('critical-shake');
  addLog('⚠ ESTADO CRÍTICO! Salve o totem!','e');
}

function startCriticalRecovery(type){
  document.getElementById('critical-overlay').classList.remove('show');
  document.body.classList.remove('critical-shake');
  if(type==='timing') criticalTiming();
  else if(type==='seq') criticalSeq();
  else if(type==='balance') criticalBalance();
}

/* Recuperação via Timing simplificado */
function criticalTiming(){
  openModal(`
    <h2>⏱️ Salve o Totem!</h2>
    <p class="msub">Pare o cursor na zona verde!</p>
    <div id="timing-track">
      <div id="t-green"></div>
      <div id="t-perfect"></div>
      <div id="t-cursor" style="left:0%"></div>
    </div>
    <div id="timing-hint">Pressione na zona verde!</div>
    <button class="upg-buy" style="width:100%;padding:13px;" onclick="execCriticalTiming()">🔨 Salvar!</button>
  `);
  // Verde maior para recuperação
  const gW=22; const gL=10+Math.random()*(68-gW);
  const pW=8; const pL=gL+(gW-pW)/2;
  setTimeout(()=>{
    const g=document.getElementById('t-green');
    const p=document.getElementById('t-perfect');
    if(g){g.style.left=gL+'%';g.style.width=gW+'%';}
    if(p){p.style.left=pL+'%';p.style.width=pW+'%';}
    G._critZones={gL,gL2:gL+gW,pL,pL2:pL+pW};
  },50);
  tRunning=true;
}

function execCriticalTiming(){
  tRunning=false;
  const z=G._critZones||{};
  let ok=false;
  if(tPos>=z.gL&&tPos<=z.gL2){ok=true;}
  if(tPos>=z.pL&&tPos<=z.pL2){ok=true;}
  if(ok){
    recoverCritical();
  } else {
    failCritical();
  }
  setTimeout(()=>{closeModal();},500);
}

/* Recuperação via Sequência curta (3 símbolos) */
function criticalSeq(){
  const seq=Array.from({length:3},()=>RUNES[Math.floor(Math.random()*RUNES.length)].glyph);
  G._critSeq=seq;G._critSeqProg=0;
  openModal(`
    <h2>🔮 Salve o Totem!</h2>
    <p class="msub">Memorize e repita: <strong>${seq.join(' ')}</strong></p>
    <div id="seq-symbols">${seq.map(g=>`<div class="ssym">${g}</div>`).join('')}</div>
    <div id="seq-progress-display">0 / 3</div>
    <div id="seq-btns"></div>
    <div id="seq-hint"></div>
    <button class="modal-close" onclick="closeModal();failCritical();">Desistir</button>
  `);
  const pool=[...new Set(seq)];
  while(pool.length<4){const g=RUNES[Math.floor(Math.random()*RUNES.length)].glyph;if(!pool.includes(g))pool.push(g);}
  pool.sort(()=>Math.random()-.5);
  document.getElementById('seq-btns').innerHTML=pool.map(g=>`<button class="sbtn" onclick="critSeqClick('${g}')">${g}</button>`).join('');
}

function critSeqClick(g){
  if(g===G._critSeq[G._critSeqProg]){
    G._critSeqProg++;
    document.getElementById('seq-progress-display').textContent=G._critSeqProg+' / 3';
    document.querySelectorAll('#seq-symbols .ssym')[G._critSeqProg-1].classList.add('hit');
    if(G._critSeqProg>=3){
      setTimeout(()=>{closeModal();recoverCritical();},400);
    }
  } else {
    document.querySelectorAll('#seq-symbols .ssym').forEach(e=>e.classList.add('miss'));
    setTimeout(()=>{closeModal();failCritical();},500);
  }
}

/* Recuperação via Equilíbrio (toques laterais) */
function criticalBalance(){
  const sequence=[];
  for(let i=0;i<5;i++) sequence.push(Math.random()<.5?'L':'R');
  G._critBalance=sequence;G._critBalanceProg=0;
  openModal(`
    <h2>⚖️ Salve o Totem!</h2>
    <p class="msub">Toque o lado que apareceu! Sequência: ${sequence.length}</p>
    <div id="balance-display" style="font-size:2em;color:var(--gold);margin:12px 0;min-height:60px;">Prepare-se...</div>
    <div id="balance-progress">0 / ${sequence.length}</div>
    <div style="display:flex;gap:12px;justify-content:center;margin-top:14px;">
      <button class="sbtn" style="width:80px;height:80px;font-size:1.4em;" onclick="critBalanceClick('L')">⬅️</button>
      <button class="sbtn" style="width:80px;height:80px;font-size:1.4em;" onclick="critBalanceClick('R')">➡️</button>
    </div>
    <button class="modal-close" onclick="closeModal();failCritical();">Desistir</button>
  `);
  let idx=0;
  const showNext=()=>{
    if(idx>=sequence.length){
      setTimeout(()=>{closeModal();recoverCritical();},400);
      return;
    }
    const d=document.getElementById('balance-display');
    if(d) d.textContent=sequence[idx]==='L'?'⬅️ ESQUERDA':'➡️ DIREITA';
    idx++;
  };
  G._critBalanceShow=showNext;
  setTimeout(showNext,800);
}

function critBalanceClick(side){
  const expected=G._critBalance[G._critBalanceProg];
  if(side===expected){
    G._critBalanceProg++;
    document.getElementById('balance-progress').textContent=G._critBalanceProg+' / '+G._critBalance.length;
    G._critBalanceShow();
  } else {
    setTimeout(()=>{closeModal();failCritical();},400);
  }
}

/* Sucesso: torre volta com 50% */
function recoverCritical(){
  G._inCritical=false;
  G.stab=Math.max(G.stab, Math.ceil(G.maxStab*0.50));
  G.totemsSaved=(G.totemsSaved||0)+1;
  G.coins+=30;G.totalCoins+=30;
  SFX.recover();
  showEventToast('✅ TOTEM SALVO! +50% ⚖️ +30💰');
  addLog('✅ Totem salvo! +50% ⚖️ +30💰','s');
  spawnFloat('+50% ⚖️','#3de87a');
  updateHUD();saveGame();
}

/* Falha: torre cai */
function failCritical(){
  G._inCritical=false;
  SFX.death();
  gameOver();
}

/* ════════════════════════════════════════
   TILT
════════════════════════════════════════ */
let curTiltDeg=0;
function applyTilt(){
  const pct=G.stab/G.maxStab;
  let targetTilt=0;
  if(pct<0.9){
    const tiltPct=(1-pct)*100;
    // Peso da raridade aumenta inclinação
    const lastWeight=G._lastPieceWeight||1;
    const maxT=Math.min(15, 8+lastWeight*1.5);
    const t=(tiltPct/100)*maxT;
    if(Math.abs(curTiltDeg)<0.5) curTiltDeg=Math.random()<.5?t:-t;
    else curTiltDeg=curTiltDeg>0?t:-t;
    targetTilt=curTiltDeg;
  } else {
    curTiltDeg=0;targetTilt=0;
  }
  const tt=document.getElementById('totem-tilt');
  tt.style.transform=`rotate(${targetTilt}deg)`;
}

/* ════════════════════════════════════════
   STREAK AURA & STAB WARNING
════════════════════════════════════════ */
function updateStreakAura(){
  const tt=document.getElementById('totem-tilt');
  tt.classList.remove('streak-aura','streak-aura-high');
  if(G.streak>=10) tt.classList.add('streak-aura-high');
  else if(G.streak>=5) tt.classList.add('streak-aura');
}

function startStabCheckLoop(){
 if(startStabCheckLoop.started)return; startStabCheckLoop.started=true;
  setInterval(()=>{
    const row=document.getElementById('stab-row');
    if(!row) return;
    if(G.stab>0 && G.stab/G.maxStab<0.25){
      row.classList.add('danger');
    } else {
      row.classList.remove('danger');
    }
  },500);
}

function updatePowerUI(){
  const fill=document.getElementById('power-fill');
  const pct=document.getElementById('power-pct');
  const lbl=document.getElementById('power-label');
  if(fill) fill.style.width=G.power+'%';
  if(pct)  pct.textContent=Math.floor(G.power);
  if(lbl){
    if(G.powerReady) lbl.classList.add('ready');
    else lbl.classList.remove('ready');
  }
}

function updateComboDisplay(){
  const el=document.getElementById('combo-display');
  if(!el) return;
  let txt='';
  if(G.luckCombo>=3) txt='🍀 Sorte '+getLuckComboLabel()+' ('+G.luckCombo+' acertos)';
  if(G.combo>=2) txt+='  🎨 Multi ×'+(G.combo+1);
  el.textContent=txt;
}

/* ════════════════════════════════════════
   BOSS
════════════════════════════════════════ */
function checkBossSpawn(){
  if(G.bossActive) return;
  if(G.piecesSinceBoss>=G.bossThreshold){
    const bossIdx=G.bossDefeated.length%BOSSES.length;
    const boss=BOSSES[bossIdx];
    G.bossActive=true;
    G.bossIdx=bossIdx;
    const hpMult=(G._progBossHpMult||1) * getDifficultyMult(G.height);
    G.bossHp=Math.ceil(boss.hp*hpMult);
    G.bossMaxHp=Math.ceil(boss.hp*hpMult);
    G.piecesSinceBoss=0;
    updateBossUI();
    showEventToast(boss.name+' apareceu!');
    addLog('👹 '+boss.name+' apareceu!','e');
    SFX.boss();
    // Screen shake
    document.getElementById('arena').classList.add('shaking');
    setTimeout(()=>document.getElementById('arena').classList.remove('shaking'),500);
  }
}

function updateBossUI(){
  const strip=document.getElementById('boss-strip');
  if(!strip) return;
  strip.style.display=G.bossActive?'block':'none';
  if(G.bossActive){
    const boss=BOSSES[G.bossIdx%BOSSES.length];
    document.getElementById('boss-name').textContent=boss.name+' • '+Math.max(0,G.bossHp).toFixed(1)+' / '+G.bossMaxHp+' HP';
    const pct=Math.max(0,(G.bossHp/G.bossMaxHp)*100);
    document.getElementById('boss-hp-fill').style.width=pct+'%';
  }
}

function defeatBoss(){
 awardXP(80+G.bossDefeated.length*12);
  const boss=BOSSES[G.bossIdx%BOSSES.length];
  G.bossDefeated.push(G.bossIdx);
  // Marca o último boss derrotado — seu emoji aparece nas próximas peças
  G.lastBossEmoji=boss.emoji;
  G.bossActive=false;
  const healed=applyBossStabReward(boss.stabReward);
  spawnFloat('+'+healed+' ⚖️ cura','#3de87a',55);
  G.coins+=boss.coinReward;
  G.totalCoins+=boss.coinReward;
  // Ganha 1 Essência Divina por boss derrotado
  G.divineEssence=(G.divineEssence||0)+1;
  spawnFloat('+1 ✨ Essência!','#c8a0ff',-55);
  timingConsecHits=0;
  G.streak=0;
  
  // Boss piece on totem
  const bossPiece={id:'boss-'+boss.id,rune:boss.emoji,name:boss.name,cls:'tp-boss',hv:0,cv:0,rarity:'legendary'};
  addPieceVisual(bossPiece,true,false);
  
  // Celebration particles
  spawnBossParticles();
  
  showEventToast('🎉 '+boss.name+' derrotado!');
  SFX.bossDefeat();
  addLog('🎉 '+boss.name+' derrotado! +'+boss.stabReward+'⚖️ +'+boss.coinReward+'💰 +1✨','e');
  updateBossUI();
  updateStreakDisplay();
  updateStreakAura();
  updateHUD();
  checkAchievements();
  saveGame();
}

function spawnBossParticles(){
  for(let i=0;i<25;i++){
    const p=document.createElement('div');
    const colors=['#f0c040','#aa44ff','#3de87a','#ff8833'];
    const color=colors[i%colors.length];
    p.style.cssText=`position:fixed;left:50vw;top:50vh;width:8px;height:8px;border-radius:50%;
      background:${color};pointer-events:none;z-index:250;box-shadow:0 0 10px ${color};`;
    document.body.appendChild(p);
    const angle=Math.random()*Math.PI*2;
    const dist=80+Math.random()*120;
    p.animate([
      {transform:'translate(0,0) scale(1)',opacity:1},
      {transform:`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`,opacity:0}
    ],{duration:1000,easing:'cubic-bezier(.22,.68,0,1)'}).onfinish=()=>p.remove();
  }
}

/* ════════════════════════════════════════
   PIECE SELECTION & VISUAL
════════════════════════════════════════ */
function choosePiece(quality){
  const h=G.height;
  const pieceBonus=upLv('pieces')*10;
  let pool=PIECES.filter(p=>h>=Math.max(0,p.minH-pieceBonus));
  if(pool.length===0) pool=[PIECES[0]];
  if(G.ancientOn){const filtered=pool.filter(p=>p.id==='ancient'||Math.random()<.3);if(filtered.length)pool=filtered;}
  // Progressão: mais peças raras
  if(G._progRareBoost){
    const rarePool=pool.filter(p=>['shadow','light','chaos','ancient','divine'].includes(p.id));
    if(rarePool.length>0 && Math.random()<G._progRareBoost) return rarePool[Math.floor(Math.random()*rarePool.length)];
  }
  // Progressão: mais Ancient
  if(G._progAncientBoost){
    if(Math.random()<G._progAncientBoost){
      const ancient=PIECES.find(p=>p.id==='ancient');
      if(ancient && G.height>=ancient.minH) return ancient;
    }
  }
  if(G.rainbowOn&&Math.random()<0.15){
    return {id:'rainbow',rune:'✦',name:'Rainbow',cls:'tp-rainbow',hv:8,cv:20,rarity:'legendary'};
  }
  const pt=pool[Math.floor(Math.random()*pool.length)];
  if(!G.relicUnlocks) G.relicUnlocks={};
  G.relicUnlocks[pt.id]=true;
  return pt;
}

function addPieceVisual(pt,perf,crit){
  const stack=document.getElementById('totem-stack');
  if(!stack) return;
  // Guarda peso da última peça para inclinação
  G._lastPieceWeight=RARITY_WEIGHT[pt.id]||1;
  if(pt.id && pt.id.startsWith('boss-')) G._lastPieceWeight=0;
  const div=document.createElement('div');
  div.className='tp '+(pt.cls||'tp-stone');
  if(perf) div.classList.add('is-perf');
  if(crit) div.classList.add('is-crit');
  // Se há um último boss derrotado e a peça atual NÃO é peça de boss,
  // mostra o símbolo normal + emoji do boss lado a lado
  const isBossPiece = pt.id && pt.id.startsWith('boss-');
  if(G.lastBossEmoji && !isBossPiece && pt.rune){
    div.classList.add('tp-mixed');
    div.innerHTML='<span class="tp-rune">'+pt.rune+'</span><span class="tp-boss-mark">'+G.lastBossEmoji+'</span>';
  } else {
    div.textContent=pt.rune;
  }
  div.title=pt.name;div.setAttribute('aria-label',pt.name);
  stack.appendChild(div);
  
  setTimeout(()=>{
    if(stack.children.length>8){
      const toRemove=stack.children[0];
      toRemove.style.opacity='0';
      toRemove.style.transition='opacity .3s';
      setTimeout(()=>toRemove.remove(),300);
    }
  },G.mergeSpeed*1000);
}

/* ════════════════════════════════════════
   UTILITIES
════════════════════════════════════════ */
function rnd(max){return Math.floor(Math.random()*max)+1;}
function upLv(id){return G.upgrades[id]||0;}

function addResource(id,amt){
  if(id==='ember'||id==='forest') G.wood+=amt;
  else if(id==='stone'||id==='water') G.stone+=amt;
  else if(id==='gold'||id==='wind'||id==='light') G.goldR+=amt;
  else if(id==='crystal'||id==='shadow'||id==='chaos'||id==='ancient'||id==='divine'){
    const mult=G._progCrystalMult||1;
    G.crystal+=Math.ceil(amt*mult);
  }
  if(id==='rainbow'){G.wood+=amt;G.stone+=amt;G.goldR+=amt;G.crystal+=amt;}
  if(G.buildings && G.buildings.garden){G.stab=Math.min(G.maxStab,G.stab+3);}
}

function spawnFloat(txt,col,offsetX=0){
  const float=document.createElement('div');
  float.className='float-text';
  float.textContent=txt;
  float.style.color=col;
  float.style.left=(50+offsetX)+'vw';
  float.style.top='50vh';
  float.style.fontSize='1.1em';
  document.body.appendChild(float);
  setTimeout(()=>float.remove(),1200);
}

function showEventToast(msg){
  const toast=document.getElementById('evt-toast');
  if(!toast) return;
  toast.textContent=msg;
  toast.classList.add('on');
  setTimeout(()=>toast.classList.remove('on'),2500);
}

function notify(msg){
  const notif=document.getElementById('notif');
  if(!notif) return;
  const item=document.createElement('div');
  item.className='notif-item';
  item.textContent=msg;
  notif.appendChild(item);
  setTimeout(()=>{item.style.opacity='0';setTimeout(()=>item.remove(),300);},3500);
}

function bumpHUD(id){
  const el=document.getElementById(id);
  if(!el) return;
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

function updateStreakDisplay(){
  const el=document.getElementById('streak-display');
  if(!el) return;
  if(G.streak>0) el.textContent='🔥 '+G.streak+' seguidos';
  else el.textContent='';
}

function updateHUD(){
 updateJourney();
  refreshTiersForHeight(G.height);
  document.getElementById('hud-coins').textContent=G.coins;
  document.getElementById('hud-height').textContent=G.height;
  const hw=document.getElementById('hud-wood');      if(hw) hw.textContent=G.wood;
  const hs=document.getElementById('hud-stone');    if(hs) hs.textContent=G.stone;
  const hg=document.getElementById('hud-gold');     if(hg) hg.textContent=G.goldR;
  const hc=document.getElementById('hud-crystal');  if(hc) hc.textContent=G.crystal;
  const he=document.getElementById('hud-essence');  if(he) he.textContent=G.divineEssence||0;
  document.getElementById('stab-num').textContent=G.stab;
  document.getElementById('stab-max').textContent=G.maxStab;
  const stabPct=(G.stab/G.maxStab)*100;
  const stabFill=document.getElementById('stab-fill');
  stabFill.style.width=stabPct+'%';
  stabFill.style.background=stabPct>50?'linear-gradient(90deg,#3de87a,#2ab860)':
    stabPct>25?'linear-gradient(90deg,#f0c040,#c8980a)':'linear-gradient(90deg,#e84050,#a00020)';
  
  const hb=document.getElementById('hb-num');
  const ht=document.getElementById('hb-tier');
  if(hb) hb.textContent=G.height;
  if(ht){
    const tierIdx=TIERS.reduce((best,t,i)=>G.height>=t.h?i:best,-1);
    const tier=TIERS[Math.max(0,tierIdx)];
    const next=TIERS[tierIdx+1];
    if(next){
      const pct=Math.min(100,Math.floor((G.height-tier.h)/(next.h-tier.h)*100));
      ht.innerHTML=`${tier.label} <span style="color:var(--muted);font-size:.85em">${pct}% → ${next.label}</span>`;
    } else {
      ht.textContent=tier.label+' ✦ MAX';
    }
  }
  
  updatePowerUI();
  updateActionButton();
  updateTierBackground();
}

let _lastTierIdx=-1;
function updateTierBackground(){
  const tierIdx=TIERS.reduce((best,t,i)=>G.height>=t.h?i:best,-1);
  const idx=Math.max(0,tierIdx);
  if(idx===_lastTierIdx) return;
  _lastTierIdx=idx;
  const tier=TIERS[idx];
  const screen=document.getElementById('screen-game');
  if(screen){
    screen.style.transition='background 1.5s ease';
    screen.style.background=`radial-gradient(ellipse at 50% 110%,${tier.accent}22 0%,${tier.bg} 60%)`;
  }
  // Glow do totem muda com tier
  const glow=document.getElementById('totem-glow');
  if(glow) glow.style.background=`radial-gradient(ellipse,${tier.accent}33,transparent 70%)`;
}

function renderTotem(){
  const stack=document.getElementById('totem-stack');
  if(!stack) return;
  stack.innerHTML='';
  G.pieces.forEach(p=>{
    const div=document.createElement('div');
    div.className='tp '+p.cls;
    const isBossPiece = p.id && p.id.startsWith('boss-');
    if(G.lastBossEmoji && !isBossPiece && p.rune){
      div.classList.add('tp-mixed');
      div.innerHTML='<span class="tp-rune">'+p.rune+'</span><span class="tp-boss-mark">'+G.lastBossEmoji+'</span>';
    } else {
      div.textContent=p.rune;
    }
    stack.appendChild(div);
  });
}

/* ════════════════════════════════════════
   MILESTONES & PRESTIGE
════════════════════════════════════════ */
function checkMilestones(){
  const m=MILESTONES.find(x=>G.height>=x.h && (G._lastMilestoneH||0)<x.h);
  if(m){
    G._lastMilestoneH=m.h;
    const pop=document.getElementById('milestone-pop');
    if(pop){
      document.getElementById('ms-title').textContent=m.t;
      document.getElementById('ms-sub').textContent=m.s;
      pop.classList.add('show');
      setTimeout(()=>pop.classList.remove('show'),3000);
      SFX.milestone();
      // Milestone particles
      for(let i=0;i<20;i++){
        const p=document.createElement('div');
        p.style.cssText=`position:fixed;left:50vw;top:50vh;width:6px;height:6px;border-radius:50%;
          background:#f0c040;pointer-events:none;z-index:250;box-shadow:0 0 8px #f0c040;`;
        document.body.appendChild(p);
        const angle=Math.random()*Math.PI*2;
        const dist=60+Math.random()*80;
        p.animate([
          {transform:'translate(0,0) scale(1)',opacity:1},
          {transform:`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`,opacity:0}
        ],{duration:900,easing:'cubic-bezier(.22,.68,0,1)'}).onfinish=()=>p.remove();
      }
    }
    addLog(m.t+' '+m.s,'a');
  }
}

function checkPresBtn(){
  const btn=document.getElementById('prestige-btn');
  if(!btn) return;
  btn.disabled=G.height<20;
  const infoEl=document.getElementById('prestige-info');
  if(infoEl){
    const ess=Math.floor(G.height/50 * (G._progEssenceMult||1))+(G.buildings && G.buildings.sanctum?1:0);
    infoEl.innerHTML=`
      <div style="font-size:1.1em;font-weight:900;margin-bottom:6px;">✨ Essência Divina: ${G.divineEssence||0}</div>
      <div style="font-size:.95em;">Ao renascer agora: <strong style="color:#fff;">+${ess} ✨</strong></div>
      <div style="font-size:.85em;margin-top:4px;">Bônus de moedas atual: <strong style="color:var(--gold);">×${G.presBonus.toFixed(2)}</strong></div>
      <div style="font-size:.85em;">Dificuldade atual: <strong style="color:var(--red);">+${Math.round((G.prestigeDifficulty-1)*100)}%</strong></div>
      <div style="font-size:.75em;margin-top:6px;color:var(--muted);border-top:1px solid rgba(170,68,255,.3);padding-top:6px;line-height:1.5;">
        📌 <strong>O que é Prestígio?</strong><br>
        Reseta altura/recursos da partida atual, mas mantém <strong>relíquias, construções e conquistas</strong>.<br>
        Cada prestígio: <strong>+10% moedas permanentes</strong>, <strong>+15% dificuldade</strong>, e ganha <strong>Essência Divina</strong>.<br>
        ✨ Essência: <strong>+10% moedas</strong> por unidade, usada para <strong>reviver</strong> ao morrer.
      </div>
    `;
  }
}

function doPrestige(){
  if(G.height<20) return;
  const essenceGain=Math.floor(G.height/50 * (G._progEssenceMult||1));
  const sanctumBonus=G.buildings && G.buildings.sanctum?1:0;
  const totalEssence=essenceGain+sanctumBonus;

  const mult=1+G.prestige*0.1;
  G.presBonus+=mult;
  G.prestige++;
  G.prestigeDifficulty=1+G.prestige*0.15;

  const relics={...G.relics};
  const buildings={...G.buildings};
  const ach={...G.achievements};
  const relicUnlocks={...G.relicUnlocks};
  const divineEssence=G.divineEssence+totalEssence;
  const presBonus=G.presBonus;
  const prestige=G.prestige;
  const prestigeDifficulty=G.prestigeDifficulty;
  const bestHeight=G.bestHeight;
  const bestStreak=G.bestStreak;
  const bestCombo=G.bestCombo;
  const totalCoins=G.totalCoins;
  const savedXP=G.xp,savedLevel=G.level;
  const bossDefeated=[...G.bossDefeated];
  const lastBossEmoji=G.lastBossEmoji;

  G=newState();
  G.achievements=ach;
  G.relics=relics;
  G.buildings=buildings;
  G.relicUnlocks=relicUnlocks;
  G.divineEssence=divineEssence;
  G.presBonus=presBonus;
  G.prestige=prestige;
  G.prestigeDifficulty=prestigeDifficulty;
  G.bestHeight=bestHeight;
  G.bestStreak=bestStreak;
  G.bestCombo=bestCombo;
  G.totalCoins=totalCoins;
  G.bossDefeated=bossDefeated;G.xp=savedXP;G.level=savedLevel;
  G.lastBossEmoji=lastBossEmoji;
  applyRelicBuildEffects();
  applyProgressions();
  renderTotem();
  setPhaseUI();
  updateHUD();
  addLog('⭐ Prestígio! +'+totalEssence+' Essência Divina. Bônus: ×'+G.presBonus.toFixed(2)+' | Dificuldade: +'+Math.round((G.prestigeDifficulty-1)*100)+'%','e');
  showEventToast('🌟 +'+totalEssence+' Essência Divina!');
  SFX.prestige();
  checkAchievements();
  saveGame();
  goScreen('inventory');
}

function applyRelicBuildEffects(){
  if(G.buildings && G.buildings.tower) G.maxStab+=G.buildings.tower*25;
}

function getReviveEssenceCost(){
  // 1, 2, 4, 8, 16... (cada vez mais caro)
  return Math.pow(2, G.reviveCount||0);
}
function getReviveGoldCost(){
  const costs=[10000,50000,250000,1000000,5000000];
  const idx=Math.min(G.reviveCount||0, costs.length-1);
  return costs[idx];
}
function formatGold(n){
  if(n>=1000000) return (n/1000000).toFixed(n%1000000===0?0:1)+'M';
  if(n>=1000) return (n/1000).toFixed(n%1000===0?0:1)+'k';
  return n.toString();
}

function gameOver(){
  SFX.death();
  // Atualiza ranking com o recorde
  updateRanking(getPlayerName(), G.bestHeight, G.prestige, G.bossDefeated.length);
  renderRanking();
  const overlay=document.getElementById('go-overlay');
  if(!overlay) return;
  document.getElementById('go-score').textContent='Altura: '+G.height+' | Moedas: '+G.totalCoins;
  document.getElementById('go-extra').textContent='Conquistas: '+countAchievements()+'/'+ACHIEVEMENTS.length+
    ' | Bosses: '+G.bossDefeated.length;
  // Atualiza opções de reviver
  const essCost=getReviveEssenceCost();
  const goldCost=getReviveGoldCost();
  const essBtn=document.getElementById('go-revive-essence');
  const goldBtn=document.getElementById('go-revive-gold');
  document.getElementById('revive-essence-cost').textContent=essCost;
  document.getElementById('revive-gold-cost').textContent=formatGold(goldCost);
  if(essBtn) essBtn.disabled=(G.divineEssence||0)<essCost;
  if(essBtn) essBtn.style.opacity=(G.divineEssence||0)<essCost?'.4':'1';
  if(goldBtn) goldBtn.disabled=G.goldR<goldCost;
  if(goldBtn) goldBtn.style.opacity=G.goldR<goldCost?'.4':'1';
  overlay.classList.add('show');
  addLog('💀 Totem caiu!','e');
}

function reviveWithEssence(){
  const cost=getReviveEssenceCost();
  if((G.divineEssence||0)<cost){
    notify('❌ Essência insuficiente!');
    return;
  }
  G.divineEssence-=cost;
  G.reviveCount=(G.reviveCount||0)+1;
  reviveGame();
}

function reviveWithGold(){
  const cost=getReviveGoldCost();
  if(G.goldR<cost){
    notify('❌ Ouro insuficiente!');
    return;
  }
  G.goldR-=cost;
  G.reviveCount=(G.reviveCount||0)+1;
  reviveGame();
}

function reviveGame(){
  SFX.revive();
  updateRanking(getPlayerName(), G.bestHeight, G.prestige, G.bossDefeated.length);
  renderRanking();
  // Estabilidade volta em 50%
  G.stab=Math.ceil(G.maxStab*0.50);
  G._inCritical=false;
  G.luckCombo=0;
  G.streak=0;
  G.combo=0;
  const wasBossActive=G.bossActive;
  G.bossActive=false;
  document.getElementById('go-overlay').classList.remove('show');
  document.getElementById('critical-overlay').classList.remove('show');
  document.body.classList.remove('critical-shake');
  // Se estava em boss, boss volta com vida cheia
  if(wasBossActive && G.bossIdx!==undefined && G.bossDefeated && G.bossDefeated.length< (BOSSES.length*10)){
    const boss=BOSSES[G.bossIdx%BOSSES.length];
    if(boss){
      G.bossActive=true;
      G.bossHp=boss.hp;
      G.bossMaxHp=boss.hp;
      updateBossUI();
      showEventToast('🐉 '+boss.name+' voltou com vida cheia!');
      addLog('🐉 Boss retornou com vida cheia!','e');
    }
  }
  updateBossUI();
  updateHUD();
  showEventToast('✨ Renascido! Estabilidade em 50%');
  addLog('✨ Renascido com Essência/Ouro!','e');
  saveGame();
}

function restartGame(){
  document.getElementById('go-overlay').classList.remove('show');
  startNewGame();
}

/* ════════════════════════════════════════
   UPGRADES
════════════════════════════════════════ */
let currentShopTab='perm';

function renderUpgrades(){
  renderShopTab(currentShopTab);
}

function renderShopTab(tab){
  const body=document.getElementById('upg-body');
  if(!body) return;
  document.getElementById('upg-coins').textContent=G.coins;
  currentShopTab=tab;
  document.querySelectorAll('.shop-tab').forEach(t=>t.classList.remove('active'));
  const tabEl=document.getElementById('shop-tab-'+tab);
  if(tabEl) tabEl.classList.add('active');
  if(tab==='perm')   body.innerHTML=UPGRADES.map(u=>renderUpgradeCard(u)).join('');
  else if(tab==='build') body.innerHTML=BUILDINGS.map(b=>renderBuildingCard(b)).join('');
  else if(tab==='relic') body.innerHTML=RELICS.map((r,i)=>renderRelicCard(r,i)).join('');
}

function resIcon(id){return {wood:'🪵',stone:'🪨',goldR:'🪙',crystal:'💎'}[id]||'';}
function resName(id){return {wood:'Madeira',stone:'Pedra',goldR:'Ouro',crystal:'Cristal'}[id]||id;}

function canPayCost(coinsCost,resCost){
  if(G.coins<coinsCost) return false;
  if(resCost){
    for(const k in resCost){
      if((G[k]||0)<resCost[k]) return false;
    }
  }
  return true;
}

function renderCostLines(coinsCost,resCost){
  let html='';
  const haveCoins=G.coins>=coinsCost;
  html+=`<div class="cost-line ${haveCoins?'ok':'no'}"><span class="cost-ic">💰</span><span class="cost-nm">Moeda</span><span class="cost-need">${coinsCost}</span><span class="cost-have">${haveCoins?'✓':'✗ '+G.coins}</span></div>`;
  if(resCost){
    for(const k in resCost){
      const have=(G[k]||0)>=resCost[k];
      html+=`<div class="cost-line ${have?'ok':'no'}"><span class="cost-ic">${resIcon(k)}</span><span class="cost-nm">${resName(k)}</span><span class="cost-need">${resCost[k]}</span><span class="cost-have">${have?'✓':'✗ '+(G[k]||0)}</span></div>`;
    }
  }
  return `<div class="cost-block">${html}</div>`;
}

function renderUpgradeCard(u){
  const lv=upLv(u.id);
  const coinsCost=Math.ceil(u.base*Math.pow(u.mult,lv));
  const resCost=u.costRes||{};
  const maxed=lv>=u.maxLv;
  const canBuy=!maxed && canPayCost(coinsCost,resCost);
  return `
    <div class="upg-card">
      <div class="upg-icon">${u.icon}</div>
      <div class="upg-info">
        <div class="upg-name">${u.name} <span class="upg-lv">Nv ${lv}/${u.maxLv}</span></div>
        <div class="upg-desc">${u.desc}</div>
        ${maxed?'<div class="upg-maxed">★ MAXIMIZADO ★</div>':renderCostLines(coinsCost,resCost)}
      </div>
      <button class="upg-buy ${maxed?'maxed':''}" ${canBuy?'':'disabled'} onclick="buyUpg('${u.id}')">${maxed?'✓':'Comprar'}</button>
    </div>
  `;
}

function renderBuildingCard(b){
  const owned=G.buildings[b.id]||0;
  const maxed=owned>=b.max;
  const canBuy=!maxed && canPayCost(0,b.cost);
  return `
    <div class="upg-card">
      <div class="upg-icon">${b.icon}</div>
      <div class="upg-info">
        <div class="upg-name">${b.name} <span class="upg-lv">${owned}/${b.max}</span></div>
        <div class="upg-desc">${b.desc}</div>
        ${maxed?'<div class="upg-maxed">★ MÁXIMO ★</div>':renderCostLines(0,b.cost)}
      </div>
      <button class="upg-buy ${maxed?'maxed':''}" ${canBuy?'':'disabled'} onclick="buyBuilding('${b.id}')">${maxed?'✓':'Construir'}</button>
    </div>
  `;
}

function renderRelicCard(r, idx){
  const owned=G.relics[r.id]||false;
  const reqH=getRelicUnlockHeight(idx);
  const reqMet=G.bestHeight>=reqH;
  const canBuy=!owned && reqMet && canPayCost(0,r.cost);
  return `
    <div class="upg-card relic-card ${owned?'owned':''} ${!reqMet?'locked':''}">
      <div class="upg-icon">${r.icon}</div>
      <div class="upg-info">
        <div class="upg-name">${r.name} ${owned?'<span class="upg-lv owned">✓ EQUIPADA</span>':''}</div>
        <div class="upg-desc">${r.desc}</div>
        ${!reqMet?`<div class="relic-locked">🔒 Requer altura ${reqH} (recorde: ${G.bestHeight})</div>`:(owned?'<div class="upg-maxed">★ ADQUIRIDA ★</div>':renderCostLines(0,r.cost))}
      </div>
      <button class="upg-buy ${owned?'maxed':''}" ${canBuy?'':'disabled'} onclick="buyRelic('${r.id}')">${owned?'✓':(reqMet?'Comprar':'🔒')}</button>
    </div>
  `;
}

function payCost(coinsCost,resCost){
  G.coins-=coinsCost;
  if(resCost){
    for(const k in resCost){
      G[k]=(G[k]||0)-resCost[k];
    }
  }
}

function buyUpg(id){
  const u=UPGRADES.find(x=>x.id===id);
  if(!u) return;
  const lv=upLv(id);
  if(lv>=u.maxLv) return;
  const coinsCost=Math.ceil(u.base*Math.pow(u.mult,lv));
  const resCost=u.costRes||{};
  if(!canPayCost(coinsCost,resCost)){notify('❌ Recursos insuficientes!');return;}
  payCost(coinsCost,resCost);
  G.upgrades[id]=(G.upgrades[id]||0)+1;
  if(id==='shield') G.maxStab+=20;
  if(id==='zone') G.tGreenW+=5;
  applyUpgFx();
  renderUpgrades();
  updateHUD();
  saveGame();
  SFX.buy();
  notify('✅ '+u.name+' melhorado para Nv '+G.upgrades[id]+'!');
}

function buyBuilding(id){
  const b=BUILDINGS.find(x=>x.id===id);
  if(!b) return;
  const owned=G.buildings[id]||0;
  if(owned>=b.max) return;
  if(!canPayCost(0,b.cost)){notify('❌ Recursos insuficientes!');return;}
  payCost(0,b.cost);
  G.buildings[id]=owned+1;
  if(id==='tower') G.maxStab+=25;
  applyUpgFx();
  renderUpgrades();
  updateHUD();
  saveGame();
  SFX.buy();
  notify('🏰 '+b.name+' construída! ('+(owned+1)+'/'+b.max+')');
}

function buyRelic(id){
  const r=RELICS.find(x=>x.id===id);
  if(!r) return;
  const idx=RELICS.findIndex(x=>x.id===id);
  if(G.relics[id]) return;
  const reqH=getRelicUnlockHeight(idx);
  if(G.bestHeight<reqH){notify('🔒 Requer altura '+reqH+'!');return;}
  if(!canPayCost(0,r.cost)){notify('❌ Cristal insuficiente!');return;}
  payCost(0,r.cost);
  G.relics[id]=true;
  applyUpgFx();
  renderUpgrades();
  updateHUD();
  saveGame();
  SFX.buy();
  notify('✨ '+r.name+' adquirida!');
  addLog('✨ Relíquia equipada: '+r.name,'a');
}

function applyUpgFx(){}

/* ════════════════════════════════════════
   ACHIEVEMENTS
════════════════════════════════════════ */
function countAchievements(){
  return ACHIEVEMENTS.filter(a=>G.achievements[a.id]).length;
}

function checkAchievements(){
  let unlocked=false;
  ACHIEVEMENTS.forEach(a=>{
    if(!G.achievements[a.id]&&a.check()){
      G.achievements[a.id]=true;
      unlocked=true;
      notify('🏆 Conquista: '+a.name+'!');
      addLog('🏆 Conquista desbloqueada: '+a.name,'a');
      SFX.achievement();
      // Achievement particles
      for(let i=0;i<12;i++){
        const p=document.createElement('div');
        p.style.cssText=`position:fixed;left:50vw;top:50vh;width:7px;height:7px;border-radius:50%;
          background:#f0c040;pointer-events:none;z-index:250;box-shadow:0 0 8px #f0c040;`;
        document.body.appendChild(p);
        const angle=Math.random()*Math.PI*2;
        const dist=70+Math.random()*70;
        p.animate([
          {transform:'translate(0,0) scale(1)',opacity:1},
          {transform:`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`,opacity:0}
        ],{duration:800,easing:'cubic-bezier(.22,.68,0,1)'}).onfinish=()=>p.remove();
      }
    }
  });
  if(unlocked){
    saveGame();
    if(curScreen==='achievements') renderAchievements();
  }
}

function renderAchievements(){
  const body=document.getElementById('ach-body');
  if(!body) return;
  const unlocked=countAchievements();
  document.getElementById('ach-counter').textContent=unlocked+'/'+ACHIEVEMENTS.length;
  
  body.innerHTML=ACHIEVEMENTS.map(a=>{
    const got=G.achievements[a.id];
    return `
      <div class="ach-card ${got?'unlocked':''}">
        <div class="ach-icon">${a.icon}</div>
        <div class="ach-info">
          <div class="ach-name">${a.name}</div>
          <div class="ach-desc">${a.desc}</div>
        </div>
        <div class="ach-status ${got?'':'locked'}">${got?'✓':'🔒'}</div>
      </div>
    `;
  }).join('');
}

/* ════════════════════════════════════════
   AUTO & EVENT LOOPS
════════════════════════════════════════ */
function startAutoLoop(){
 if(startAutoLoop.started)return; startAutoLoop.started=true;
  setInterval(()=>{
    if(curScreen!=='game') return;
    if(G.stab<=0) return;
    const autolv=upLv('auto');
    if(autolv>0&&Math.random()<autolv*0.15){
      handleAction();
    }
  },2000);
}

function startEventLoop(){}
function advanceEvent(){
 if(G.bossActive)return;
 if(G.eventId){
  if(--G.eventLeft<=0){G.eventId=null;G.doubleCoins=G.springOn=G.ancientOn=G.windOn=G.rainbowOn=false;G.eventCooldown=4;showEventToast('Evento concluído');}
 }else if(G.eventCooldown>0){G.eventCooldown--;}
 else if(G.hits>=5&&Math.random()<0.18){
  const pool=EVENTS.filter(e=>e.id!==G.lastEvent&&(G.height>=100||!['rain','quake','wind'].includes(e.id)));
  const e=pool[Math.floor(Math.random()*pool.length)];G.eventId=e.id;G.lastEvent=e.id;G.eventLeft=e.dur;
  G.doubleCoins=e.id==='festival';G.springOn=e.id==='spring';G.ancientOn=e.id==='ancient';G.windOn=e.id==='wind';G.rainbowOn=e.id==='rainbow';
  if(e.id==='blessing')G.blessing=5;
  if(e.id==='quake')G.stab=Math.max(1,G.stab-15);
  showEventToast(e.name+' • '+e.desc);addLog(e.name+': '+e.desc,'e');SFX.event();
 }
 updateHUD();saveGame();
}

/* ════════════════════════════════════════
   STATS & LOG
════════════════════════════════════════ */
function renderStats(){
  refreshTiersForHeight(G.height);
  document.getElementById('sc-h').textContent=G.height;
  document.getElementById('sc-best').textContent=G.bestHeight;
  document.getElementById('sc-coins').textContent=G.totalCoins;
  document.getElementById('sc-pres').textContent=G.prestige;
  const scE=document.getElementById('sc-essence'); if(scE) scE.textContent=G.divineEssence||0;
  const scD=document.getElementById('sc-diff');    if(scD) scD.textContent='+'+Math.round((G.prestigeDifficulty-1)*100)+'%';
  const scB=document.getElementById('sc-boss');    if(scB) scB.textContent=G.bossDefeated.length;
  document.getElementById('sc-hits').textContent=G.hits;
  document.getElementById('sc-miss').textContent=G.misses;
  document.getElementById('sc-streak').textContent=G.streak;
  document.getElementById('sc-bstreak').textContent=G.bestStreak;
  
  document.getElementById('rb-w').textContent=G.wood;
  document.getElementById('rb-s').textContent=G.stone;
  document.getElementById('rb-g').textContent=G.goldR;
  document.getElementById('rb-c').textContent=G.crystal;
  const invEss=document.getElementById('inv-essence');
  if(invEss) invEss.textContent=G.divineEssence||0;

  // Card de tier atual
  const tierIdx=TIERS.reduce((best,t,i)=>G.height>=t.h?i:best,-1);
  const idx=Math.max(0,tierIdx);
  const tier=TIERS[idx];
  const next=TIERS[idx+1];
  const pct=next?Math.min(100,Math.floor((G.height-tier.h)/(next.h-tier.h)*100)):100;
  const curLbl=document.getElementById('tier-current-label');
  const pctLbl=document.getElementById('tier-pct-label');
  const pctBar=document.getElementById('tier-pct-bar');
  const nextLbl=document.getElementById('tier-next-label');
  const card=document.getElementById('tier-current-card');
  if(curLbl) curLbl.textContent=tier.label;
  if(pctLbl) pctLbl.textContent=pct+'%';
  if(pctBar) pctBar.style.width=pct+'%';
  if(pctBar) pctBar.style.background=tier.accent||'var(--gold)';
  if(curLbl) curLbl.style.color=tier.accent||'var(--gold)';
  if(card) card.style.borderColor=(tier.accent||'var(--gold)')+'55';
  if(nextLbl){
    if(next) nextLbl.textContent='Próximo: '+next.label+' (h.'+next.h+')';
    else nextLbl.textContent='✦ Tier máximo alcançado!';
  }

  const box=document.getElementById('tier-box');
  box.innerHTML=TIERS.map((tr,i)=>{
    const done=G.height>=tr.h;
    const next=TIERS[i+1];
    const pct=next&&done?Math.min(100,(G.height-tr.h)/(next.h-tr.h)*100):done?100:0;
    return `<div class="tier-row${done?' done':''}">
      <span class="tr-lbl">${tr.label}</span>
      <div class="tr-bar"><div class="tr-fill" style="width:${pct}%;background:${tr.accent||'var(--gold)'}"></div></div>
      <span class="tr-req">${done?(next?G.height+'/'+next.h:'MAX'):tr.h}</span>
    </div>`;
  }).join('');
  checkPresBtn();
}

let gameLog=[];
function addLog(msg,type=''){
  gameLog.unshift({msg,type});
  if(gameLog.length>100) gameLog.pop();
  if(curScreen==='log') renderLog();
}

function renderLog(){
  const body=document.getElementById('log-body');
  if(!body) return;
  body.innerHTML=gameLog.map(e=>`<div class="log-entry ${e.type}">${e.msg}</div>`).join('');
}

function clearLog(){
  gameLog=[];
  renderLog();
}

/* ════════════════════════════════════════
   SAVE/LOAD
════════════════════════════════════════ */
/* ════════════════════════════════════════
   INVENTORY
═══════════════════════════════════════ */
function renderInventory(){
  const body=document.getElementById('inv-body');
  if(!body) return;
  const ie=document.getElementById('inv-essence');
  if(ie) ie.textContent=G.divineEssence||0;
  
  let html='<div class="inventory-tabs">'+
    '<button class="active" onclick="setInventoryView(0,this)">RECURSOS</button>'+
    '<button onclick="setInventoryView(1,this)">RELÍQUIAS</button>'+
    '<button onclick="setInventoryView(2,this)">ESTRUTURAS</button></div>';
  
  html+='<div class="inv-section">📦 Recursos</div>';
  html+='<div class="inv-res-grid">'+
    '<div class="inv-res"><span class="inv-res-icon">🪵</span><span class="inv-res-name">Madeira</span><span class="inv-res-val">'+G.wood+'</span><span class="inv-res-use">Upgrades básicos</span></div>'+
    '<div class="inv-res"><span class="inv-res-icon">🪨</span><span class="inv-res-name">Pedra</span><span class="inv-res-val">'+G.stone+'</span><span class="inv-res-use">Melhorias médias</span></div>'+
    '<div class="inv-res"><span class="inv-res-icon">🪙</span><span class="inv-res-name">Ouro</span><span class="inv-res-val">'+G.goldR+'</span><span class="inv-res-use">Habilidades raras</span></div>'+
    '<div class="inv-res"><span class="inv-res-icon">💎</span><span class="inv-res-name">Cristal</span><span class="inv-res-val">'+G.crystal+'</span><span class="inv-res-use">Itens lendários</span></div>'+
    '<div class="inv-res" style="grid-column:1/-1;background:rgba(170,68,255,.08);border-color:var(--purple);"><span class="inv-res-icon">✨</span><span class="inv-res-name">Essência Divina</span><span class="inv-res-val" style="color:#c8a0ff;">'+(G.divineEssence||0)+'</span><span class="inv-res-use">Recurso de prestígio — +10% moedas por unidade</span></div>'+
  '</div>';
  
  html+='<div class="inv-section">🏺 Relíquias</div>';
  if(G.relics && Object.keys(G.relics).length>0){
    html+='<div class="inv-relic-grid">';
    Object.keys(G.relics).forEach(rid=>{
      if(!G.relics[rid]) return;
      const r=RELICS.find(x=>x.id===rid);
      if(!r) return;
      html+='<div class="inv-relic owned">'+
        '<span class="inv-relic-badge">✓</span>'+
        '<span class="inv-relic-icon">'+r.icon+'</span>'+
        '<span class="inv-relic-name">'+r.name+'</span>'+
        '<span class="inv-relic-desc">'+r.desc+'</span>'+
      '</div>';
    });
    html+='</div>';
  } else {
    html+='<div style="font-size:.75em;color:var(--muted);padding:10px;text-align:center;background:var(--panel);border:1px solid var(--border);border-radius:8px;">Nenhuma relíquia ainda. Compre cristais na Loja → Relíquias.</div>';
  }
  
  html+='<div class="inv-section">🏗️ Construções</div>';
  if(G.buildings && Object.keys(G.buildings).length>0){
    html+='<div class="inv-relic-grid">';
    Object.keys(G.buildings).forEach(bid=>{
      const owned=G.buildings[bid]||0;
      if(owned<=0) return;
      const b=BUILDINGS.find(x=>x.id===bid);
      if(!b) return;
      html+='<div class="inv-relic owned">'+
        '<span class="inv-relic-badge">×'+owned+'</span>'+
        '<span class="inv-relic-icon">'+b.icon+'</span>'+
        '<span class="inv-relic-name">'+b.name+'</span>'+
        '<span class="inv-relic-desc">'+b.desc+'</span>'+
      '</div>';
    });
    html+='</div>';
  } else {
    html+='<div style="font-size:.75em;color:var(--muted);padding:10px;text-align:center;background:var(--panel);border:1px solid var(--border);border-radius:8px;">Nenhuma construção. Visite a Loja → Construção.</div>';
  }
  
  html+='<div class="inv-section">📊 Estatísticas</div>';
  html+='<div class="inv-stat-grid">'+
    '<div class="stat-card"><span class="sc-icon">⭐</span><span class="sc-label">Prestígios</span><span class="sc-val">'+G.prestige+'</span></div>'+
    '<div class="stat-card"><span class="sc-icon">🏆</span><span class="sc-label">Recorde</span><span class="sc-val">'+G.bestHeight+'</span></div>'+
    '<div class="stat-card"><span class="sc-icon">⚔️</span><span class="sc-label">Bosses</span><span class="sc-val">'+G.bossDefeated.length+'</span></div>'+
    '<div class="stat-card"><span class="sc-icon">🔥</span><span class="sc-label">Melhor Seq.</span><span class="sc-val">'+G.bestStreak+'</span></div>'+
    '<div class="stat-card"><span class="sc-icon">🎨</span><span class="sc-label">Melhor Combo</span><span class="sc-val">'+G.bestCombo+'</span></div>'+
    '<div class="stat-card"><span class="sc-icon">✨</span><span class="sc-label">Essência</span><span class="sc-val">'+(G.divineEssence||0)+'</span></div>'+
  '</div>';
  
  body.innerHTML=html;
}

function setInventoryView(index,button){
 const body=document.getElementById('inv-body');if(!body)return;
 body.querySelectorAll('.inventory-tabs button').forEach(b=>b.classList.remove('active'));
 if(button)button.classList.add('active');
 const sections=[...body.querySelectorAll('.inv-section')];
 sections.forEach((heading,i)=>{
  let node=heading;const visible=i===index;
  while(node&&(!node.nextElementSibling||!node.nextElementSibling.classList.contains('inv-section'))){
   node.style.display=visible?'':'none';node=node.nextElementSibling;
   if(!node)break;
  }
 });
}

/* ════════════════════════════════════════
   CODEX / ENCICLOPÉDIA
═══════════════════════════════════════ */
function renderCodex(){
  const body=document.getElementById('codex-body');
  if(!body) return;
  
  let unlockedCount=0;
  let html='<div class="codex-section">🗿 Peças (Raridades)</div>';
  html+=CODEX.map(c=>{
    const unlocked=(G.bestHeight>=c.unlockH) || (G.relicUnlocks && G.relicUnlocks[c.id]);
    if(unlocked) unlockedCount++;
    const rarityIdx=['Comum','Incomum','Rara','Épica','Lendária','Mística','Mítica'].indexOf(c.rarity);
    const stars='★'.repeat(Math.max(0,rarityIdx));
    return '<div class="codex-entry '+(unlocked?'unlocked':'locked')+'">'+
      '<div class="codex-icon">'+(unlocked?c.icon:'❓')+'</div>'+
      '<div class="codex-info">'+
        '<div class="codex-name">'+
          (unlocked?c.id.toUpperCase():'???')+
          '<span class="codex-rarity '+c.rarity+'">'+c.rarity+'</span>'+
          (unlocked?'<span class="codex-stars">'+stars+'</span>':'')+
        '</div>'+
        (unlocked?
          '<div class="codex-unlock">Desbloqueado em: altura '+c.unlockH+'</div>'+
          '<div class="codex-effect">Efeito: '+c.effect+'</div>'+
          '<div class="codex-desc">'+c.desc+'</div>'
          :
          '<div class="codex-unlock">🔒 Desbloqueie alcançando altura '+c.unlockH+'</div>'
        )+
      '</div>'+
    '</div>';
  }).join('');

  // ── Bosses ──
  html+='<div class="codex-section" style="margin-top:14px;">👹 Bosses</div>';
  html+=BOSSES.map(b=>{
    const defeated=G.bossDefeated && G.bossDefeated.some((idx,i)=>BOSSES[idx%BOSSES.length].id===b.id);
    return '<div class="codex-entry '+(defeated?'unlocked':'locked')+'">'+
      '<div class="codex-icon">'+b.emoji+'</div>'+
      '<div class="codex-info">'+
        '<div class="codex-name">'+b.name+'</div>'+
        '<div class="codex-unlock">HP: '+b.hp+' | Recompensa: '+b.stabReward+'⚖️ +'+b.coinReward+'💰</div>'+
        (b.damageReduction?'<div class="codex-effect">🛡️ Redução de dano: '+Math.round(b.damageReduction*100)+'%</div>':'')+
        (b.failDamageMult>1?'<div class="codex-effect">💢 Dano extra ao errar: ×'+b.failDamageMult+'</div>':'')+
        (b.hpRegenOnHit?'<div class="codex-effect">💚 Regen ao acertar: +'+b.hpRegenOnHit+' HP</div>':'')+
        (b.hpRegenOnFail?'<div class="codex-effect">🔄 Regen ao errar: +'+b.hpRegenOnFail+' HP</div>':'')+
        (defeated?'<div class="codex-desc" style="color:var(--green);">✓ Derrotado</div>':'<div class="codex-desc" style="color:var(--muted);">🔒 Ainda não encontrado</div>')+
      '</div>'+
    '</div>';
  }).join('');

  // ── Eventos ──
  html+='<div class="codex-section" style="margin-top:14px;">🌌 Eventos Ambientais</div>';
  html+=EVENTS.map(e=>{
    return '<div class="codex-entry unlocked">'+
      '<div class="codex-icon" style="background:rgba('+e.col.slice(1).match(/.{2}/g).map(x=>parseInt(x,16)).join(',')+',.15);">'+e.id.charAt(0).toUpperCase()+e.id.slice(1)+'</div>'+
      '<div class="codex-info">'+
        '<div class="codex-name">'+e.name+'</div>'+
        '<div class="codex-effect">'+e.desc+'</div>'+
        '<div class="codex-unlock">Duração: '+e.dur+' turnos</div>'+
      '</div>'+
    '</div>';
  }).join('');

  // ── Recursos ──
  html+='<div class="codex-section" style="margin-top:14px;">📦 Recursos</div>';
  const resInfo=[
    {icon:'🪵',name:'Madeira',desc:'Dropa de peças Ember/Forest. Usada em upgrades básicos.'},
    {icon:'🪨',name:'Pedra',desc:'Dropa de peças Stone/Water. Usada em melhorias médias.'},
    {icon:'🪙',name:'Ouro',desc:'Dropa de peças Gold/Wind/Light. Usada em habilidades raras.'},
    {icon:'💎',name:'Cristal',desc:'Dropa de peças Crystal/Shadow/Chaos/Ancient/Divine. Usada em relíquias.'},
    {icon:'✨',name:'Essência Divina',desc:'Ganha no prestígio. +10% moedas por unidade. Usada para reviver.'}
  ];
  html+=resInfo.map(r=>{
    return '<div class="codex-entry unlocked">'+
      '<div class="codex-icon">'+r.icon+'</div>'+
      '<div class="codex-info">'+
        '<div class="codex-name">'+r.name+'</div>'+
        '<div class="codex-desc">'+r.desc+'</div>'+
      '</div>'+
    '</div>';
  }).join('');

  // ── Mecânicas ──
  html+='<div class="codex-section" style="margin-top:14px;">🎮 Mecânicas</div>';
  const mechInfo=[
    {icon:'🎲',name:'Dados (Sorte)',desc:'Role o dado e cumpra o objetivo. Modos: Maior/Menor (comuns), Exato/Par-Ímpar/Intervalo (raros). A sorte é sua aliada.'},
    {icon:'⏱️',name:'Timing (Agilidade)',desc:'Pare o cursor na zona verde! 6 padrões: Ping-Pong, Delay Falso, Pulso Oculto, Janela Dupla, Zona Móvel, Reverse. Exige reflexo real.'},
    {icon:'🔮',name:'Sequência (Memória)',desc:'Memorize e repita 4-7 símbolos. Modificadores: Shadow (escurecidos), Wind (se movem), Chaos (ordem trocada), Ancient (menos tempo), Divine (tentativa extra).'}
  ];
  html+=mechInfo.map(m=>{
    return '<div class="codex-entry unlocked">'+
      '<div class="codex-icon">'+m.icon+'</div>'+
      '<div class="codex-info">'+
        '<div class="codex-name">'+m.name+'</div>'+
        '<div class="codex-desc">'+m.desc+'</div>'+
      '</div>'+
    '</div>';
  }).join('');

  body.innerHTML=html;
  
  const counter=document.getElementById('codex-counter');
  if(counter) counter.textContent=unlockedCount+'/'+CODEX.length;
}

function openInfoModal(){
  openModal(`
    <h2>ℹ️ Eventos & Sistemas</h2>
    <p class="msub">Tudo que você precisa saber para evoluir</p>
    <div style="text-align:left;font-size:.78em;line-height:1.6;max-height:60vh;overflow-y:auto;padding-right:8px;">
      <div style="color:var(--gold);font-weight:900;margin:8px 0 4px;">📊 Recursos</div>
      <div>🪵 <strong>Madeira</strong>: drops de peças Ember/Forest — upgrades básicos</div>
      <div>🪨 <strong>Pedra</strong>: drops de Stone/Water — melhorias médias</div>
      <div>🪙 <strong>Ouro</strong>: drops de Gold/Wind/Light — habilidades raras</div>
      <div>💎 <strong>Cristal</strong>: drops de Crystal/Shadow/Chaos/Ancient/Divine — itens lendários</div>
      <div>✨ <strong>Essência Divina</strong>: ganha no prestígio — +10% moedas por unidade, usada para reviver</div>

      <div style="color:var(--gold);font-weight:900;margin:12px 0 4px;">⭐ Prestígio</div>
      <div>Reseta altura/recursos da partida. <strong>Mantém</strong>: relíquias, construções, conquistas, essência.</div>
      <div>Cada prestígio: +10% moedas, +15% dificuldade, ganha Essência (1 a cada 50 altura).</div>

      <div style="color:var(--gold);font-weight:900;margin:12px 0 4px;">💀 Reviver</div>
      <div>Ao morrer, pode reviver com Essência (1→2→4→8) ou Ouro (10k→50k→250k→1M→5M).</div>
      <div>Estabilidade volta em 50%. Se estava em boss, ele retorna com vida cheia.</div>

      <div style="color:var(--gold);font-weight:900;margin:12px 0 4px;">🌀 Eventos Ambientais</div>
      <div>🌧️ <strong>Chuva</strong>: erros causam 2x dano</div>
      <div>💨 <strong>Vento</strong>: -2 estab por turno</div>
      <div>🌟 <strong>Bênção</strong>: 5 peças garantidas</div>
      <div>🌑 <strong>Eclipse</strong>: peças raras 3x mais frequentes</div>
      <div>🌋 <strong>Tremor</strong>: -20 estab instantâneo</div>
      <div>🎉 <strong>Festival</strong>: moedas dobradas</div>
      <div>🌸 <strong>Primavera</strong>: +2 estab por turno (cura)</div>
      <div>🏺 <strong>Ancestral</strong>: só peças Ancient por 5 turnos</div>
      <div>🌈 <strong>Arco-Íris</strong>: peças Rainbow aparecem! (dão todos os recursos + cor especial)</div>

      <div style="color:var(--gold);font-weight:900;margin:12px 0 4px;">🎰 Mecânicas</div>
      <div>🎲 <strong>Dados</strong>: sorte — Maior/Menor (comuns) ou Exato/Par-Ímpar/Intervalo (raros)</div>
      <div>⏱️ <strong>Timing</strong>: agilidade — pare o cursor no verde! Padrões variam (ping-pong, delay, pulso oculto, janela dupla, zona móvel, reverse)</div>
      <div>🔮 <strong>Sequência</strong>: memória — 4 a 7 símbolos. Modificadores: Shadow (escurecidos), Wind (se movem), Chaos (ordem trocada), Ancient (menos tempo), Divine (tentativa extra)</div>

      <div style="color:var(--gold);font-weight:900;margin:12px 0 4px;">📈 Progressões (trade-offs)</div>
      <div>1. Era do Ouro (h=50): +50% moedas / dados +rápidos</div>
      <div>2. Era das Sombras (h=312): +30% raras / +vento</div>
      <div>3. Era dos Cristais (h=1953): +50% cristais / seq menor tempo</div>
      <div>4. Era Ancestral (h=12207): +25% Ancient / verde -25%</div>
      <div>5. Era Divina (h=30517): +100% essência / bosses +50% HP</div>
    </div>
    <button class="modal-close" onclick="closeModal()">Entendi!</button>
  `);
}

function exitToMenu(){
  saveGame();
  stopMusic();
  goScreen('menu');
  if(soundEnabled) playMenuMusic();
  addLog('🏠 Voltou ao menu','e');
}

/* ════════════════════════════════════════
   RANKING DE RECORDES — Top 10 local
═══════════════════════════════════════ */
const RANKING_KEY='totemRanking_v1';
const NAME_KEY='totemPlayerName';

function getPlayerName(){
  try{ return localStorage.getItem(NAME_KEY) || 'Jogador'; }catch(e){ return 'Jogador'; }
}
function savePlayerName(name){
  try{ localStorage.setItem(NAME_KEY, (name||'').slice(0,24) || 'Jogador'); }catch(e){}
}

function getRanking(){
  try{
    const data=localStorage.getItem(RANKING_KEY);
    if(!data) return [];
    return JSON.parse(data);
  }catch(e){ return []; }
}

function saveRanking(list){
  try{ localStorage.setItem(RANKING_KEY, JSON.stringify(list)); }catch(e){}
}

/* Adiciona/atualiza score do jogador no ranking */
function updateRanking(name, score, prestige, bosses){
  name=(name||'Jogador').slice(0,24);
  let ranking=getRanking();
  // Procura entrada existente do jogador (mesmo nome)
  let entry=ranking.find(r=>r.name===name);
  if(entry){
    if(score>entry.score){
      entry.score=score;
      entry.prestige=prestige;
      entry.bosses=bosses;
      entry.date=Date.now();
    }
  } else {
    ranking.push({name, score, prestige, bosses, date:Date.now()});
  }
  // Ordena por score decrescente
  ranking.sort((a,b)=>b.score-a.score);
  // Top 10
  ranking=ranking.slice(0,10);
  saveRanking(ranking);
  return ranking;
}

function renderRanking(){
  const list=document.getElementById('ranking-list');
  if(!list) return;
  const ranking=getRanking();
  const myName=getPlayerName();
  if(ranking.length===0){
    list.innerHTML='<div class="rk-empty">Nenhum recorde ainda.<br>Suba seu primeiro totem!</div>';
    return;
  }
  list.innerHTML=ranking.map((r,i)=>{
    const isMe=r.name===myName?' me':'';
    const medals=['🥇','🥈','🥉'];
    const pos=i<3?medals[i]:(i+1)+'º';
    return '<div class="rk-row'+isMe+'">'+
      '<span class="rk-pos">'+pos+'</span>'+
      '<span class="rk-name">'+r.name+'</span>'+
      '<span class="rk-score">'+r.score+' 📏</span>'+
    '</div>';
  }).join('');
}

/* Comprar estabilidade com Essência Divina: 1 essência = 10% do máximo */
function buyStabilityWithEssence(){
  if((G.divineEssence||0)<1){
    notify('❌ Essência Divina insuficiente!');
    return;
  }
  const healAmt=Math.ceil(G.maxStab*0.10);
  G.divineEssence-=1;
  G.stab=Math.min(G.maxStab, G.stab+healAmt);
  SFX.power();
  spawnFloat('+'+healAmt+' ⚖️','#3de87a',-55);
  showEventToast('✨ +'+healAmt+' ⚖️ com Essência Divina!');
  addLog('✨ Comprou +'+healAmt+' ⚖️ com 1 Essência Divina','s');
  updateHUD();
  if(curScreen==='stats') renderStats();
  saveGame();
}

function closeGameOver(){
  document.getElementById('go-overlay').classList.remove('show');
  document.getElementById('critical-overlay').classList.remove('show');
  document.body.classList.remove('critical-shake');
}

function saveGame(){
  try{
    localStorage.setItem(SAVE_KEY,JSON.stringify({G,gameLog}));
  }catch(e){}
}

function loadGame(){
  const data=localStorage.getItem(SAVE_KEY);
  if(!data){
    G=newState();
    return;
  }
  try{
    const parsed=JSON.parse(data);
    G=Object.assign(newState(),parsed.G||{});
    gameLog=parsed.gameLog||[];
    if(!G.relics) G.relics={};
    if(!G.buildings) G.buildings={};
    if(!G.relicUnlocks) G.relicUnlocks={};
    if(typeof G.divineEssence!=='number') G.divineEssence=0;
    if(typeof G.prestigeDifficulty!=='number') G.prestigeDifficulty=1;
    if(G.lastBossEmoji===undefined) G.lastBossEmoji=null;
    if(!Array.isArray(G.lastDiceTypes)) G.lastDiceTypes=[];
    if(typeof G.diceMode!=='string') G.diceMode='higher';
    if(typeof G.diceReq!=='number') G.diceReq=4;
  }catch(e){
    G=newState();
  }
}

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
window.addEventListener('load',()=>{
  loadSoundPref();
  initMenuBackground();
  // Carrega nome do jogador
  const nameInput=document.getElementById('player-name-input');
  if(nameInput) nameInput.value=getPlayerName();
  // Renderiza ranking
  renderRanking();
  const sb=document.getElementById('sound-btn');
  if(sb) sb.textContent=soundEnabled?'🔊':'🔇';
  loadGame();

  // Init dice sides
  if(G.diceSides){
    const dt=DICE_TYPES[G.diceType%DICE_TYPES.length];
    G.diceSides=dt.sides;
  }
});

const POLY_MESH={"8": {"v": [[-1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.0, -1.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, -1.0], [0.0, 0.0, 1.0]], "f": [[2, 0, 4], [4, 1, 2], [5, 0, 2], [2, 1, 5], [3, 1, 4], [4, 0, 3], [5, 1, 3], [3, 0, 5]]}, "12": {"v": [[-0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [-0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [-0.5773502691896258, 0.5773502691896258, -0.5773502691896258], [-0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [0.5773502691896258, -0.5773502691896258, -0.5773502691896258], [0.5773502691896258, -0.5773502691896258, 0.5773502691896258], [0.5773502691896258, 0.5773502691896258, -0.5773502691896258], [0.5773502691896258, 0.5773502691896258, 0.5773502691896258], [0.0, -0.35682208977308993, -0.9341723589627158], [-0.35682208977308993, -0.9341723589627158, 0.0], [-0.9341723589627158, 0.0, -0.35682208977308993], [0.0, -0.35682208977308993, 0.9341723589627158], [-0.35682208977308993, 0.9341723589627158, 0.0], [0.9341723589627158, 0.0, -0.35682208977308993], [0.0, 0.35682208977308993, -0.9341723589627158], [0.35682208977308993, -0.9341723589627158, 0.0], [-0.9341723589627158, 0.0, 0.35682208977308993], [0.0, 0.35682208977308993, 0.9341723589627158], [0.35682208977308993, 0.9341723589627158, 0.0], [0.9341723589627158, 0.0, 0.35682208977308993]], "f": [[16, 10, 0, 9, 1], [3, 12, 2, 10, 16], [5, 11, 1, 9, 15], [15, 9, 0, 8, 4], [6, 13, 4, 8, 14], [14, 8, 0, 10, 2], [5, 15, 4, 13, 19], [6, 14, 2, 12, 18], [19, 13, 6, 18, 7], [3, 16, 1, 11, 17], [17, 11, 5, 19, 7], [18, 12, 3, 17, 7]]}, "20": {"v": [[0.0, -0.5257311121191336, -0.85065080835204], [-0.5257311121191336, -0.85065080835204, 0.0], [-0.85065080835204, 0.0, -0.5257311121191336], [0.0, -0.5257311121191336, 0.85065080835204], [-0.5257311121191336, 0.85065080835204, 0.0], [0.85065080835204, 0.0, -0.5257311121191336], [0.0, 0.5257311121191336, -0.85065080835204], [0.5257311121191336, -0.85065080835204, 0.0], [-0.85065080835204, 0.0, 0.5257311121191336], [0.0, 0.5257311121191336, 0.85065080835204], [0.5257311121191336, 0.85065080835204, 0.0], [0.85065080835204, 0.0, 0.5257311121191336]], "f": [[2, 0, 1], [6, 2, 4], [5, 0, 6], [6, 0, 2], [3, 1, 7], [7, 0, 5], [1, 0, 7], [4, 2, 8], [2, 1, 8], [8, 1, 3], [8, 3, 9], [9, 4, 8], [10, 4, 9], [6, 4, 10], [10, 5, 6], [7, 5, 11], [9, 3, 11], [11, 3, 7], [10, 9, 11], [11, 5, 10]]}};
function xpNeeded(level){return Math.round(70+level*30+Math.pow(level,1.35)*8);}
function awardXP(amount){
 G.level=Math.max(1,G.level||1);G.xp=(G.xp||0)+amount;
 while(G.xp>=xpNeeded(G.level)){
  G.xp-=xpNeeded(G.level);G.level++;
  const reward=25+G.level*10;G.coins+=reward;G.totalCoins+=reward;
  G.stab=Math.min(G.maxStab,G.stab+10);
  showEventToast('Nível '+G.level+' • +'+reward+' moedas • +10 estabilidade');SFX.perfect();
 }
}
function updateJourney(){
 const arena=document.getElementById('arena'),tower=document.getElementById('totem-tilt');
 if(arena&&tower&&arena.clientHeight){const h=window.innerHeight<=740?40:54;const count=Math.max(1,Math.min(8,(G.pieces||[]).length));tower.style.zoom=Math.max(.25,Math.min(1,(arena.clientHeight-(G.bossActive?130:65))/(count*h+21)));}
 const label=document.getElementById('level-label');if(!label)return;
 label.textContent='ASCENSÃO • NÍVEL '+(G.level||1);
 document.getElementById('xp-label').textContent=(G.xp||0)+' / '+xpNeeded(G.level||1)+' XP';
 const p=document.getElementById('xp-progress');p.value=G.xp||0;p.max=xpNeeded(G.level||1);
 const e=EVENTS.find(e=>e.id===G.eventId);
 document.getElementById('event-status').textContent=e?e.name+' • '+G.eventLeft+' turnos • '+e.desc:G.bossActive?'⚔️ Batalha ativa • Eventos pausados':'Próximo guardião em '+Math.max(0,G.bossThreshold-G.piecesSinceBoss)+' acertos';
}
const originalOpenModal=openModal;
openModal=function(html){
 if(G.bossActive&&(/dice-stage|timing-track|seq-display/.test(html))){
  const boss=BOSSES[G.bossIdx%BOSSES.length];
  html='<div class="battle-card"><div class="boss-portrait"></div><strong>'+boss.name+'</strong><br>Vida: '+G.bossHp.toFixed(1)+' / '+G.bossMaxHp+
   ' • Armadura: '+Math.round(boss.damageReduction*100)+'%<br>Erro: −'+boss.heightLoss+' altura • Recompensa: '+boss.coinReward+' moedas + 1 essência</div>'+html;
 }
 originalOpenModal(html);
 const portrait=document.querySelector('.boss-portrait');
 if(portrait&&G.bossActive){
  const positions=[[-495,-105],[-591,-105],[-495,-222],[-591,-222]];
  const pos=positions[G.bossIdx%4];portrait.style.backgroundPosition=pos[0]+'px '+pos[1]+'px';
 }
};
const oldRenderDice=renderDiceFace;
let diceSpin=0;
renderDiceFace=function(value,cls){
 oldRenderDice(value,cls);
 if(G.diceSides===6)return;
 const host=document.getElementById('dice-poly-container');if(!host)return;
 let canvas=host.querySelector('canvas');
 if(!canvas){host.innerHTML='<canvas class="poly-real" width="360" height="360" aria-label="Dado tridimensional"></canvas>';canvas=host.firstChild;}
 const data=POLY_MESH[G.diceSides];if(!data)return;
 const rolling=window.rollBusy&&!cls;diceSpin+=rolling?0.72:0;
 const ax=rolling?diceSpin:0.24,ay=rolling?diceSpin*1.3:0.32;
 const rot=p=>{const [x,y,z]=p;const yy=y*Math.cos(ax)-z*Math.sin(ax),zz=y*Math.sin(ax)+z*Math.cos(ax);return [x*Math.cos(ay)+zz*Math.sin(ay),yy,-x*Math.sin(ay)+zz*Math.cos(ay)];};
 const verts=data.v.map(rot);
 const faces=data.f.map((ids,i)=>({ids,i,z:ids.reduce((a,j)=>a+verts[j][2],0)/ids.length})).sort((a,b)=>a.z-b.z);
 const front=faces[faces.length-1].i;
 const ctx=canvas.getContext('2d');ctx.clearRect(0,0,360,360);
 ctx.fillStyle='#0007';ctx.beginPath();ctx.ellipse(180,318,80,12,0,0,7);ctx.fill();
 const color=DICE_TYPES[G.diceType].color;
 const rgb=color.match(/\w\w/g).map(h=>parseInt(h,16));
 for(const face of faces){
  const pts=face.ids.map(j=>[180+verts[j][0]*112,170+verts[j][1]*112]);
  const shade=.48+(face.z+1)*.25;
  ctx.fillStyle='rgb('+rgb.map(c=>Math.min(255,Math.round(c*shade+16))).join(',')+')';
  ctx.strokeStyle='#fff8';ctx.lineWidth=2;
  ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();ctx.stroke();
  if(face.z>0.1){
   const x=pts.reduce((a,p)=>a+p[0],0)/pts.length,y=pts.reduce((a,p)=>a+p[1],0)/pts.length;
   const num=((face.i-front+value-1+G.diceSides)%G.diceSides)+1;
   ctx.fillStyle='#fff';ctx.font='bold '+(face.i===front?36:19)+'px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(num,x,y);
  }
 }
 canvas.setAttribute('aria-label','D'+G.diceSides+' • '+(rolling?'rolando':'resultado '+value));
};
const baseOpenDice=openDiceModal;
openDiceModal=function(){
 baseOpenDice();
 const card=document.getElementById('dice-objective-card');
 const count=Array.from({length:G.diceSides},(_,i)=>i+1).filter(diceRollPasses).length;
 card.insertAdjacentHTML('beforeend','<div style="font-size:11px;margin-top:6px;color:#d1c3df">Chance base: '+Math.round(count/G.diceSides*100)+'% • Sorte e bênção podem ajudar</div>');
};
function exportProgress(){
 saveGame();
 const blob=new Blob([JSON.stringify({version:7,G,gameLog})],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Totem-progresso.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
}
function importProgress(){
 const input=document.createElement('input');input.type='file';input.accept='.json,application/json';
 input.onchange=async()=>{
  try{
   const data=JSON.parse(await input.files[0].text());
   if(!data.G||!Number.isFinite(data.G.height)||!Array.isArray(data.G.pieces))throw Error('Arquivo inválido');
   for(const [k,v] of Object.entries(data.G)){
    if(typeof v==='number'&&(!Number.isFinite(v)||Math.abs(v)>1e15))throw Error('Valor inválido');
   }
   // Imported saves use known piece definitions, never supplied HTML.
   data.G.pieces=data.G.pieces.slice(-8).map(p=>resolvePiece(p.id));
   if(!confirm('Substituir o progresso atual pelo arquivo selecionado?'))return;
   G=Object.assign(newState(),data.G);gameLog=[];saveGame();continuarJogo();
  }catch(e){notify('Não foi possível importar: arquivo de progresso inválido.');}
 };input.click();
}
window.addEventListener('load',()=>{
 const menu=document.getElementById('menu-version');
 document.addEventListener('keydown',e=>{
  if(e.code==='Space'&&tRunning&&e.target.tagName!=='INPUT'){e.preventDefault();execTiming();}
 });
 document.addEventListener('pointerdown',e=>{
  if(e.target.id==='timing-go-btn'&&tRunning){e.preventDefault();execTiming();}
 });
});
window.addEventListener('pagehide',saveGame);

let audioPrefs={music:.25,effects:.55};
try{Object.assign(audioPrefs,JSON.parse(localStorage.getItem('totemAudioMix')||'{}'));}catch(e){}
function setMix(kind,value){
 audioPrefs[kind]=Math.max(0,Math.min(1,Number(value)));
 if(musicGain)musicGain.gain.value=audioPrefs.music;
 if(sfxGain)sfxGain.gain.value=audioPrefs.effects;
 try{localStorage.setItem('totemAudioMix',JSON.stringify(audioPrefs));}catch(e){}
}
const oldInitAudio=initAudio;
initAudio=function(){oldInitAudio();if(musicGain)musicGain.gain.value=audioPrefs.music;if(sfxGain)sfxGain.gain.value=audioPrefs.effects;};
function openSettings(){
 openModal('<h2>Som e controles</h2><p class="msub">Timing: toque em Construir ou use Espaço. Cada ação consome um turno de evento.</p>'+
 '<label>Música <input type="range" min="0" max="1" step=".05" value="'+audioPrefs.music+'" oninput="setMix(\'music\',this.value)"></label>'+
 '<label>Efeitos <input type="range" min="0" max="1" step=".05" value="'+audioPrefs.effects+'" oninput="setMix(\'effects\',this.value)"></label>'+
 '<button class="upg-buy" onclick="toggleSound()">Ativar / silenciar sons</button><button class="modal-close" onclick="closeModal()">Fechar</button>');
}

/* Navegação limpa: telas secundárias lembram de onde foram abertas. */
let sectionOrigin='game';
function continuarOuJogar(){
 if(G&&(G.height>0||G.prestige>0)) continuarJogo(); else startNewGame();
}
function menuGo(id){
 sectionOrigin='menu';
 if(!G||!Object.keys(G).length) loadGame();
 goScreen(id);
}
function closeSection(){goScreen(sectionOrigin==='menu'?'menu':'game');}
function toggleMenuTools(){
 const box=document.getElementById('menu-tools');
 if(box) box.hidden=!box.hidden;
}
function toggleGameNav(force){
 const dock=document.getElementById('nav-dock'),btn=document.getElementById('nav-toggle');
 if(!dock)return;
 const open=typeof force==='boolean'?force:dock.classList.contains('collapsed');
 dock.classList.toggle('collapsed',!open);
 if(btn){btn.setAttribute('aria-expanded',String(open));btn.textContent=open?'×':'☰';}
}
const cleanGoScreen=goScreen;
goScreen=function(id){
 if(id!=='menu'&&id!=='game'&&curScreen==='game') sectionOrigin='game';
 cleanGoScreen(id);
 if(id==='game') toggleGameNav(false);
};
window.addEventListener('load',()=>{
 const tools=document.getElementById('menu-tools');
 if(tools) tools.insertAdjacentHTML('beforeend','<div id="backup-actions"><button onclick="exportProgress()">Exportar progresso</button><button onclick="importProgress()">Importar progresso</button></div>');
});
window.addEventListener('resize',()=>{if(curScreen==='game')updateJourney();});


/* v8 presentation and lifecycle: mechanics keep the same save key. */
const ELEMENT_ART={ember:0,water:1,forest:2,light:3,shadow:4,wind:5,crystal:6,stone:7,chaos:8,ancient:9,gold:10,divine:11,rainbow:11};
const BOSS_THEMES={wind:1,forest:3,serpent:1,storm:1,titan:0,alien:2,death:2,pixel:2,ghost:2,doll:2,drama:3};
const v8NewState=newState;
newState=function(){return Object.assign(v8NewState(),{playerName:'',hasRun:false,elementCounts:{},battlePieces:[],savedTower:[],collectionVersion:1});};
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function resolvePiece(id){
 const p=PIECES.find(x=>x.id===id);if(p)return {...p};
 const b=BOSSES.find(x=>'boss-'+x.id===id);
 return b?{id:'boss-'+b.id,name:b.name,rune:b.emoji,cls:'tp-boss',hv:0,cv:0,rarity:'legendary'}:{...PIECES[0]};
}
function artIndex(piece){return piece.id.startsWith('boss-')?12+(BOSS_THEMES[piece.id.slice(5)]||0):(ELEMENT_ART[piece.id]??0);}
function spriteMarkup(piece,extra=''){
 const i=artIndex(piece);return '<span class="stone-sprite '+(i>=12?'boss-stone ':'')+extra+'" role="img" aria-label="'+esc(piece.name)+'" style="--col:'+i%4+';--row:'+Math.floor(i/4)+'"></span>';
}
const storedPlayerName=getPlayerName;
getPlayerName=function(){return G?.playerName||storedPlayerName();};
function normalizeV8(){
 if(!G.playerName)G.playerName=storedPlayerName();
 if(!G.elementCounts||typeof G.elementCounts!=='object')G.elementCounts={};
 if(!Array.isArray(G.pieces))G.pieces=[];
 if(!Array.isArray(G.battlePieces))G.battlePieces=[];
 if(!Array.isArray(G.savedTower))G.savedTower=[];
 G.hasRun=!!(G.hasRun||G.hits||G.height||G.prestige||G.bossActive);
 G.pieces=G.pieces.slice(-8).map(p=>resolvePiece(p.id));
}
const v8LoadGame=loadGame;
loadGame=function(){v8LoadGame();normalizeV8();};
function updateMenuRun(){
 const btn=document.getElementById('continue-run'),label=document.getElementById('continue-name');
 if(btn)btn.disabled=!G.hasRun;
 if(label)label.textContent=G.hasRun?G.playerName+' • Andar '+G.height:'Nenhuma partida salva';
}
function newRunPrompt(){
 openModal('<h2>Nova jornada</h2><p class="msub">Dê um nome ao construtor desta torre.</p>'+
 '<label class="form-field">Nome do jogador<input id="new-player-name" maxlength="24" autocomplete="off" placeholder="Seu nome" value="'+esc(storedPlayerName())+'"></label>'+
 (G.hasRun?'<p class="msub">A nova jornada substitui a partida em andamento. O recorde continua no ranking.</p>':'')+
 '<button class="modal-action" onclick="beginNamedRun()">JOGAR</button><button class="modal-close" onclick="closeModal()">Voltar</button>');
}
function beginNamedRun(){
 const name=(document.getElementById('new-player-name').value||'Jogador').trim().slice(0,24)||'Jogador';
 if(G.hasRun)updateRanking(G.playerName,G.bestHeight,G.prestige,G.bossDefeated.length);
 closeModal();savePlayerName(name);battleVictory=false;clearTimeout(victoryTimer);startNewGame();
 G.playerName=name;G.hasRun=true;saveGame();updateMenuRun();syncBattle();
}
function resumeRun(){if(!G.hasRun)return;continuarJogo();syncBattle();}
function continuarOuJogar(){G.hasRun?resumeRun():newRunPrompt();}
function openRanking(){
 if(G.hasRun)updateRanking(G.playerName,G.bestHeight,G.prestige,G.bossDefeated.length);
 const rows=getRanking();
 openModal('<h2>Ranking</h2><p class="msub">Os 10 maiores recordes neste navegador.</p><table class="ranking-table"><thead><tr><th>#</th><th>CONSTRUTOR</th><th>ANDAR</th></tr></thead><tbody>'+
 (rows.length?rows.map((r,i)=>'<tr class="'+(r.name===G.playerName?'mine':'')+'"><td>'+String(i+1).padStart(2,'0')+'</td><td>'+esc(r.name)+'</td><td>'+esc(r.score)+'</td></tr>').join(''):'<tr><td colspan="3">Sua primeira torre começa uma nova história.</td></tr>')+
 '</tbody></table><button class="modal-close" onclick="closeModal()">Fechar</button>');
}
// Ranking names must always be text, including legacy names.
renderRanking=function(){const list=document.getElementById('ranking-list');if(list)list.textContent=getRanking().map((r,i)=>(i+1)+'. '+r.name+' — '+r.score).join('\n');};

/* Actual persisted tower, including boss trophies. */
addPieceVisual=function(pt,perf,crit){
 if(!pt)return;
 G._lastPieceWeight=RARITY_WEIGHT[pt.id]||1;
 if(!G.elementCounts)G.elementCounts={};
 if(!pt.id.startsWith('boss-'))G.elementCounts[pt.id]=(Number(G.elementCounts[pt.id])||0)+1;
 const inBattle=G.bossActive&&!pt.id.startsWith('boss-');
 if(inBattle){
  const trophy=resolvePiece('boss-'+BOSSES[G.bossIdx%BOSSES.length].id);
 G.battlePieces.push(trophy);G.battlePieces=G.battlePieces.slice(-8);renderBossTower(true);
 }else{
  G.pieces.push({...pt});G.pieces=G.pieces.slice(-8);renderTotem(true);
 }
};
renderTotem=function(animate=false){
 const stack=document.getElementById('totem-stack');if(!stack)return;
 const visible=(G.pieces||[]).slice(-8);
 stack.innerHTML=visible.map((p,i)=>spriteMarkup(resolvePiece(p.id),animate&&i===visible.length-1?'arrive':'')).join('');
 const empty=document.getElementById('empty-tower');if(empty)empty.hidden=visible.length>0;
 fitTower();
};
function fitTower(){
 const arena=document.getElementById('arena'),stack=document.getElementById('totem-stack');if(!arena||!stack)return;
 const count=Math.max(1,stack.children.length),height=arena.clientHeight||450;
 const tile=Math.min(174,Math.max(45,(height*.79-24)/(count*.64)));
 stack.style.setProperty('--tile',tile+'px');
}
const v8Prestige=doPrestige;
doPrestige=function(){const name=G.playerName,collection={...G.elementCounts};v8Prestige();G.playerName=name;G.elementCounts=collection;G.hasRun=true;saveGame();};
let lastEventId=null;
updateJourney=function(){
 const level=document.getElementById('level-label'),xp=document.getElementById('xp-label'),bar=document.getElementById('xp-progress');
 if(level)level.textContent='NÍVEL '+(G.level||1);if(xp)xp.textContent=(G.xp||0)+' / '+xpNeeded(G.level||1)+' XP';
 if(bar){bar.value=G.xp||0;bar.max=xpNeeded(G.level||1);}
 renderEventSide();fitTower();
 const side=document.getElementById('combo-side');
 if(side){side.hidden=!G.streak&&!G.bestStreak;side.innerHTML='<span class="side-label">SEQUÊNCIA</span><span class="side-value">'+G.streak+'</span><span class="side-note">Recorde<br>'+G.bestStreak+'</span>';}
 syncBattle();
};
function renderEventSide(){
 const side=document.getElementById('event-side'),weather=document.getElementById('event-weather');if(!side||!weather)return;
 const event=EVENTS.find(e=>e.id===G.eventId);side.hidden=!event;
 if(event){const words=event.name.split(' ');side.style.setProperty('--event-color',event.col);side.innerHTML='<span class="side-label">EVENTO</span><span class="event-icon">'+words.shift()+'</span><strong class="side-title">'+esc(words.join(' '))+'</strong><span class="side-note">'+esc(event.desc)+'</span><progress value="'+G.eventLeft+'" max="'+event.dur+'"></progress><span class="side-note">'+G.eventLeft+' turnos</span>';}
 if(lastEventId===G.eventId)return;lastEventId=G.eventId;weather.dataset.event=G.eventId||'';weather.innerHTML='';
 if(!event)return;
 const particles=event.id==='rain'?20:12;
 for(let i=0;i<particles;i++){const p=document.createElement('span');p.className='weather-particle';p.textContent=event.id==='rain'?'':event.id==='spring'?'✿':event.id==='wind'?'〜':'✦';p.style.cssText='--left:'+((i*83)%100)+'%;--duration:'+(4+i%4)+'s;--delay:-'+i/3+'s;--size:'+(7+i%9)+'px;--weather-color:'+event.col;weather.appendChild(p);}
}

/* A battle is an overlay of the existing run, never a replacement game state. */
let battleVictory=false,victoryTimer=null,lastBattleId=null;
function renderBossTower(animate=false){
 const tower=document.getElementById('boss-tower');if(!tower)return;
 const id='boss-'+BOSSES[G.bossIdx%BOSSES.length].id;
 const count=Math.min(8,(G.battlePieces||[]).length);
 tower.innerHTML=Array.from({length:count},(_,i)=>spriteMarkup(resolvePiece(id),animate&&i===count-1?'arrive':'')).join('');
 const field=tower.parentElement?.clientHeight||540;tower.style.setProperty('--tile',Math.max(48,Math.min(104,field*.60/(Math.max(1,count)*.76)))+'px');
}
function syncBattle(){
 const overlay=document.getElementById('boss-overlay');if(!overlay)return;
 const visible=curScreen==='game'&&(G.bossActive||battleVictory);overlay.hidden=!visible;
 if(!visible)return;
 const boss=BOSSES[G.bossIdx%BOSSES.length];
 document.getElementById('battle-name').textContent=battleVictory?'Guardião superado':boss.name;
 document.getElementById('battle-hp').textContent=Math.max(0,G.bossHp).toFixed(1)+' / '+G.bossMaxHp+' HP';
 document.getElementById('battle-floor').textContent='ANDAR '+G.height;
 const bar=document.getElementById('battle-progress');bar.max=G.bossMaxHp||1;bar.value=Math.max(0,G.bossHp);
 document.getElementById('battle-rewards').textContent=battleVictory?'Bloco do guardião conquistado • +'+boss.coinReward+' moedas • +1 essência':'Recompensa • '+boss.coinReward+' moedas + 1 essência';
 document.getElementById('battle-mechanic').textContent=battleVictory?'A torre continua de onde você parou.':['','Dado • cumpra o objetivo','Timing • acerte o centro dourado','Runas • memorize e repita'][G.phase];
 document.getElementById('battle-action').hidden=battleVictory;document.getElementById('battle-return').hidden=!battleVictory;
 overlay.classList.toggle('victory',battleVictory);
 if(lastBattleId!==G.bossIdx){lastBattleId=G.bossIdx;const portrait=document.getElementById('boss-portrait'),i=G.bossIdx%BOSSES.length;portrait.style.setProperty('--boss-col',i%4);portrait.style.setProperty('--boss-row',Math.floor(i/4));portrait.setAttribute('aria-label',boss.name);renderBossTower();}
}
const v8BossSpawn=checkBossSpawn;
checkBossSpawn=function(){
 const active=G.bossActive;v8BossSpawn();
 if(!active&&G.bossActive){G.savedTower=G.pieces.map(p=>({...p}));G.battlePieces=[];battleVictory=false;lastBattleId=null;renderBossTower();syncBattle();saveGame();}
};
const v8BossUI=updateBossUI;
updateBossUI=function(){v8BossUI();syncBattle();};
const v8DefeatBoss=defeatBoss;
defeatBoss=function(){
 battleVictory=true;v8DefeatBoss();G.piecesSinceBoss=0;G.savedTower=[];
 document.getElementById('battle-feedback').textContent='VITÓRIA';syncBattle();saveGame();
 clearTimeout(victoryTimer);victoryTimer=setTimeout(finishBossVictory,2800);
};
function finishBossVictory(){
 if(window.rollBusy){clearTimeout(victoryTimer);victoryTimer=setTimeout(finishBossVictory,250);return;}
 battleVictory=false;clearTimeout(victoryTimer);document.getElementById('battle-feedback').textContent='';syncBattle();renderTotem();updateActionButton();saveGame();
}
function attackBoss(){if(G.bossActive&&!battleVictory)handleAction();}
function pauseBattle(){if(window.rollBusy)return;exitToMenu();syncBattle();updateMenuRun();}
const v8GoScreen=goScreen;
goScreen=function(id){v8GoScreen(id);if(id==='menu')updateMenuRun();syncBattle();};
const v8HandleAction=handleAction;
handleAction=function(){if(battleVictory||curScreen!=='game'||document.hidden)return;v8HandleAction();};
const v8OnSuccess=onSuccess;
onSuccess=function(src,quality,stab){const boss=G.bossActive;v8OnSuccess(src,quality,stab);if(boss)bossImpact(false);syncBattle();};
const v8OnFail=onFail;
onFail=function(){const boss=G.bossActive;v8OnFail();if(boss)bossImpact(true);syncBattle();};
function bossImpact(fail){
 const tower=document.getElementById('boss-tower');tower.classList.remove('hit');void tower.offsetWidth;tower.classList.add('hit');
 if(battleVictory)return;
 const feedback=document.getElementById('battle-feedback');feedback.textContent=fail?'DEFESA DO GUARDIÃO':'IMPACTO';feedback.style.color=fail?'#ea8a93':'#ffd591';
 setTimeout(()=>{if(!battleVictory)feedback.textContent='';},700);
}
// Use the original modal opening routine: battle info already has its own screen.
openModal=function(html){originalOpenModal(html);};

/* Inventory: selectable icons, exact counts and a single detail panel. */
let inventoryTab='elements',inventorySelected=null;
function inventoryEntries(){
 if(inventoryTab==='elements')return PIECES.map(p=>({id:p.id,name:p.name,piece:p,count:Number(G.elementCounts?.[p.id])||0,desc:p.effectDesc+' • '+p.rarity,kind:'Peças construídas'}));
 if(inventoryTab==='resources')return [
  {id:'wood',name:'Madeira',icon:'🪵',desc:'Recurso usado em melhorias e construções.'},
  {id:'stone',name:'Pedra',icon:'🪨',desc:'Recurso usado para reforçar a sua evolução.'},
  {id:'goldR',name:'Ouro',icon:'🪙',desc:'Recurso usado em melhorias e renascimento.'},
  {id:'crystal',name:'Cristal',piece:resolvePiece('crystal'),desc:'Recurso usado para adquirir relíquias e melhorias raras.'},
  {id:'coins',name:'Moedas',icon:'◉',desc:'Moeda usada na loja de melhorias permanentes.'},
  {id:'divineEssence',name:'Essência',icon:'✦',desc:'Conquistada ao derrotar guardiões. Usada em renascimento e recuperação.'}
 ].map(e=>({...e,count:G[e.id]||0,kind:'Quantidade disponível'}));
 if(inventoryTab==='artifacts')return RELICS.map(r=>({id:r.id,name:r.name,icon:r.icon,count:G.relics?.[r.id]?1:0,desc:r.desc,kind:G.relics?.[r.id]?'Adquirida • efeito ativo':'Ainda não adquirida'}));
 return [
  {id:'freeRolls',name:'Rolagem bônus',icon:'⚄',count:G.freeRolls||0,desc:'Protege automaticamente uma rolagem malsucedida.',kind:'Cargas disponíveis'},
  {id:'blessing',name:'Bênção',icon:'✧',count:G.blessing||0,desc:'Aplicada automaticamente nas próximas jogadas, conforme a mecânica.',kind:'Cargas disponíveis'}
 ];
}
function chooseInventoryTab(tab){inventoryTab=tab;inventorySelected=null;renderInventory();}
function chooseInventoryItem(id){inventorySelected=id;renderInventory();}
renderInventory=function(){
 const body=document.getElementById('inv-body');if(!body)return;
 const ie=document.getElementById('inv-essence');if(ie)ie.textContent=G.divineEssence||0;
 const entries=inventoryEntries(),selected=entries.find(x=>x.id===inventorySelected)||entries[0];inventorySelected=selected?.id;
 const artwork=e=>e.piece?spriteMarkup(e.piece):'<span class="item-symbol">'+esc(e.icon)+'</span>';
 body.innerHTML='<nav class="inventory-tabs" aria-label="Categorias">'+[['elements','ELEMENTOS'],['resources','RECURSOS'],['artifacts','ARTEFATOS'],['consumables','CONSUMÍVEIS']].map(([id,label])=>'<button class="'+(id===inventoryTab?'active':'')+'" onclick="chooseInventoryTab(\''+id+'\')">'+label+'</button>').join('')+'</nav>'+
 '<div class="item-grid">'+entries.map(e=>'<button class="inventory-item '+(e.id===selected?.id?'selected':'')+'" onclick="chooseInventoryItem(\''+e.id+'\')" aria-label="'+esc(e.name)+' '+e.count+'" aria-pressed="'+(e.id===selected?.id)+'"><span class="item-name">'+esc(e.name)+'</span>'+artwork(e)+'<span class="item-count">'+e.count+'</span></button>').join('')+'</div>'+
 (selected?'<article class="item-detail"><div class="detail-art">'+artwork(selected)+'</div><div><h3>'+esc(selected.name)+'</h3><p>'+esc(selected.desc)+'</p><strong>'+esc(selected.kind)+': '+selected.count+'</strong></div></article>':'')+
 '<p class="inventory-caption">'+(inventoryTab==='elements'?'Coleção de peças construídas a partir desta versão. Os materiais para compras ficam na aba Recursos.':'Toque em um item para ver seu uso e a quantidade disponível.')+'</p>';
};

/* Layered sounds with short tails and a separate boss soundscape. */
SFX.piece=()=>{playNoise(.12,.09,700);playTone(130,.13,'triangle',.12);playTone(523,.28,'sine',.045,.06);};
SFX.dice=()=>{for(let i=0;i<6;i++){playTone(190+i*43,.05,'triangle',.055,i*.09);setTimeout(()=>playNoise(.035,.05,2200),i*90);}};
SFX.perfect=()=>{[523,659,784,1047].forEach((f,i)=>playTone(f,.38,'sine',.08,i*.07));};
SFX.boss=()=>{playSlide(130,42,1.05,'sawtooth',.07);playNoise(.5,.08,450);playTone(55,1.3,'sine',.12);};
SFX.bossHit=()=>{playNoise(.17,.10,650);playSlide(230,75,.22,'triangle',.11);playTone(622,.18,'sine',.045,.06);};
SFX.bossDefeat=()=>{[261,329,392,523,659,784].forEach((f,i)=>playTone(f,.7,'triangle',.065,i*.09));};
SFX.event=()=>{playSlide(230,920,.5,'sine',.07);[392,587,784].forEach((f,i)=>playTone(f,.55,'sine',.045,.1+i*.11));};
const v8Music=playGameMusic;
playGameMusic=function(){
 if(!G.bossActive){v8Music();return;}
 if(currentMusicName==='boss'&&currentMusic)return;stopMusic();initAudio();if(!audioCtx||!soundEnabled)return;
 currentMusicName='boss';
 const beat=()=>{if(!soundEnabled||document.hidden)return;const t=audioCtx.currentTime;[55,82.4].forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(.09,t+.08);g.gain.exponentialRampToValueAtTime(.001,t+1.4);o.connect(g);g.connect(musicGain);o.start(t+i*.08);o.stop(t+1.5);});};
 beat();currentMusic=setInterval(beat,1500);
};
const v8SyncBattle=syncBattle;let audioWasBoss=false;
syncBattle=function(){v8SyncBattle();const active=curScreen==='game'&&G.bossActive;if(active!==audioWasBoss){audioWasBoss=active;if(soundEnabled&&curScreen==='game')playGameMusic();}};
openSettings=function(){
 openModal('<h2>Configurações</h2><label class="form-field">Música<input aria-label="Volume da música" type="range" min="0" max="1" step=".05" value="'+audioPrefs.music+'" oninput="setMix(\'music\',this.value)"></label>'+
 '<label class="form-field">Efeitos<input aria-label="Volume dos efeitos" type="range" min="0" max="1" step=".05" value="'+audioPrefs.effects+'" oninput="setMix(\'effects\',this.value)"></label>'+
 '<button class="modal-action" onclick="toggleSound()">Ligar / silenciar sons</button><button class="modal-action" onclick="exportProgress()">Exportar progresso</button><button class="modal-action" onclick="importProgress()">Importar progresso</button><button class="modal-close" onclick="closeModal()">Fechar</button>');
};
window.addEventListener('load',()=>{normalizeV8();updateMenuRun();renderTotem();syncBattle();});
window.addEventListener('resize',()=>{fitTower();if(G.bossActive)renderBossTower();});
document.getElementById('boss-overlay')?.addEventListener('pointermove',e=>{const el=e.currentTarget,r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--boss-bg-x',(-x*8)+'px');el.style.setProperty('--boss-bg-y',(-y*8)+'px');el.style.setProperty('--boss-far-x',(x*11)+'px');el.style.setProperty('--boss-far-y',(y*8)+'px');el.style.setProperty('--boss-near-x',(x*20)+'px');el.style.setProperty('--boss-near-y',(y*14)+'px');el.style.setProperty('--boss-face-x',(x*16)+'px');el.style.setProperty('--boss-face-y',(y*10)+'px');});
document.addEventListener('visibilitychange',()=>{if(document.hidden){saveGame();stopMusic();}else if(soundEnabled){curScreen==='menu'?playMenuMusic():curScreen==='game'?playGameMusic():null;}});

/* v9: additive presentation, collectibles and fourth action. */
const baseSpriteV9=spriteMarkup;
spriteMarkup=function(piece,extra=''){
 const raw=baseSpriteV9(piece,extra),index=BOSSES.findIndex(b=>'boss-'+b.id===piece.id);
 if(index<0)return raw;
 return raw.replace('</span>','<span class="boss-block-face" style="--face-x:'+((index%4)*100/3)+'%;--face-y:'+(Math.floor(index/4)*50)+'%"></span></span>');
};
const entriesV9=inventoryEntries;
inventoryEntries=function(){
 if(inventoryTab!=='bosses')return entriesV9();
 return BOSSES.map((b,i)=>{const count=(G.bossDefeated||[]).filter(n=>n%BOSSES.length===i).length;return {id:'boss-'+b.id,name:b.name,piece:resolvePiece('boss-'+b.id),count,kind:'Vitórias registradas',desc:count?'Bloco do guardião conquistado. Família: '+['Vulcânica','Tempestade','Cripta','Santuário'][BOSS_THEMES[b.id]||0]+'.':'Derrote este guardião para conquistar seu bloco.'};});
};
const inventoryV9=renderInventory;
renderInventory=function(){inventoryV9();const nav=document.querySelector('#inv-body .inventory-tabs');if(nav)nav.insertAdjacentHTML('beforeend','<button class="'+(inventoryTab==='bosses'?'active':'')+'" onclick="chooseInventoryTab(\'bosses\')">BOSSES</button>');};

const syncV9=syncBattle;
syncBattle=function(){syncV9();const overlay=document.getElementById('boss-overlay');if(!overlay||overlay.hidden)return;const theme=BOSS_THEMES[BOSSES[G.bossIdx%BOSSES.length].id]||0;overlay.dataset.family=String(theme);const bg=document.getElementById('boss-backdrop');bg.style.backgroundPosition=(theme%2*100)+'% '+(Math.floor(theme/2)*100)+'%';if(G.phase===4&&!battleVictory)document.getElementById('battle-mechanic').textContent='Selos • encontre o símbolo indicado';};

let sealState=null,sealTimer=null;
function openSealModal(){
 sealState={hits:0,target:0,done:false,epoch:0,deadline:0};
 openModal('<h2>✦ Selos Elementais</h2><p class="msub">Encontre o selo indicado. Acerte três para construir.</p><div id="seal-target"></div><progress id="seal-time" max="1" value="1"></progress><div id="seal-grid"></div><p id="seal-status" aria-live="polite">0 / 3 selos</p><button class="modal-close" onclick="closeModal()">Fechar</button>');
 sealState.epoch=window.modalEpoch;nextSeal();
 sealTimer=setInterval(()=>{if(!sealState||sealState.done||!modalOpen||sealState.epoch!==window.modalEpoch){clearInterval(sealTimer);return;}const left=sealState.deadline-performance.now();const p=document.getElementById('seal-time');if(p)p.value=Math.max(0,left/sealState.duration);if(left<=0)finishSeal(false);},50);
}
function nextSeal(){
 const order=RUNES.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 const choices=order.slice(0,6);sealState.target=choices[Math.floor(Math.random()*choices.length)];
 const rune=RUNES[sealState.target];document.getElementById('seal-target').textContent=rune.glyph+' • '+rune.name;
 document.getElementById('seal-grid').innerHTML=choices.map(i=>'<button class="seal-option" onclick="chooseSeal('+i+')" aria-label="'+RUNES[i].name+'">'+RUNES[i].glyph+'</button>').join('');
 sealState.duration=G.bossActive?3000:Math.max(3200,5000-(G.level||1)*35);sealState.deadline=performance.now()+sealState.duration;
}
function chooseSeal(i){if(!sealState||sealState.done||!modalOpen||sealState.epoch!==window.modalEpoch)return;if(performance.now()>sealState.deadline||i!==sealState.target){finishSeal(false);return;}sealState.hits++;SFX.click();if(sealState.hits===3){finishSeal(true);return;}document.getElementById('seal-status').textContent=sealState.hits+' / 3 selos';nextSeal();}
function finishSeal(won){
 if(!sealState||sealState.done)return;sealState.done=true;clearInterval(sealTimer);window.rollBusy=true;
 document.getElementById('seal-status').textContent=won?'SELOS HARMONIZADOS':'SELO ROMPIDO';
 try{if(won){onSuccess('seal','strong',6);SFX.perfect();}else onFail();}finally{window.rollBusy=false;}
 closeModal();checkPhaseShift();checkAchievements();saveGame();
}
const closeV9=closeModal;
closeModal=function(){if(window.rollBusy)return;clearInterval(sealTimer);sealState=null;closeV9();};
const buttonV9=updateActionButton;
updateActionButton=function(){buttonV9();if(G.phase===4&&!G.bossActive){const b=document.getElementById('action-btn');b.className='btn-seq';b.textContent='✦ Selos Elementais';}};
const modalV9=openModal;
openModal=function(html){modalV9(html);const b=document.getElementById('modal-box');b.dataset.action=html.includes('timing-track')?'timing':html.includes('seq-symbols')?'sequence':html.includes('dice-stage')?'dice':html.includes('seal-grid')?'seals':'';};

function addAtmosphere(parent,id,count){
 if(!parent||document.getElementById(id))return;const layer=document.createElement('div');layer.id=id;layer.className='atmosphere';layer.setAttribute('aria-hidden','true');
 for(let i=0;i<count;i++){const p=document.createElement('span');p.textContent=['ᚠ','✦','◇','ᚨ','✧'][i%5];p.style.cssText='--x:'+((i*73)%100)+'%;--speed:'+(7+i%7)+'s;--delay:-'+(i*.77)+'s;--size:'+(9+i%16)+'px;';layer.appendChild(p);}parent.appendChild(layer);
}
let dangerMusicTimer=null;
function dangerBeat(){
 if(!soundEnabled||document.hidden||curScreen!=='game'||G.stab/G.maxStab>.30)return;
 initAudio();if(!audioCtx||!musicGain)return;const t=audioCtx.currentTime;
 [55,58.27,82.4].forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=i===2?'triangle':'sine';o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(.07,t+.05+i*.09);g.gain.exponentialRampToValueAtTime(.001,t+.75);o.connect(g);g.connect(musicGain);o.start(t);o.stop(t+.8);});
}
function updateDanger(){
 const danger=curScreen==='game'&&G.stab/Math.max(1,G.maxStab)<=.30;
 document.getElementById('screen-game').classList.toggle('danger-mode',danger);document.getElementById('boss-overlay').classList.toggle('danger-mode',danger);
 if(danger&&!dangerMusicTimer){dangerBeat();dangerMusicTimer=setInterval(dangerBeat,900);}else if(!danger&&dangerMusicTimer){clearInterval(dangerMusicTimer);dangerMusicTimer=null;}
}
const journeyV9=updateJourney;updateJourney=function(){journeyV9();updateDanger();};
const goV9=goScreen;goScreen=function(id){goV9(id);updateDanger();};
const eventV9=renderEventSide;
renderEventSide=function(){eventV9();const weather=document.getElementById('event-weather');if(weather){weather.classList.toggle('event-intense',!!G.eventId);if(G.eventId&&weather.dataset.enriched!==G.eventId){weather.dataset.enriched=G.eventId;for(let i=0;i<12;i++){const p=document.createElement('span');p.className='weather-particle';p.textContent=G.eventId==='rain'?'':G.eventId==='spring'?'✿':'✧';p.style.cssText='--left:'+((i*67+8)%100)+'%;--duration:'+(2+i%3)+'s;--delay:-'+i/3+'s;--size:'+(9+i%10)+'px;';weather.appendChild(p);}}if(!G.eventId)weather.dataset.enriched='';}};
window.addEventListener('load',()=>{addAtmosphere(document.getElementById('screen-menu'),'menu-particles',22);addAtmosphere(document.getElementById('boss-overlay'),'battle-particles',30);addAtmosphere(document.getElementById('arena'),'danger-debris',12);document.getElementById('menu-version').textContent='v9 • Ascensão Elemental';});
