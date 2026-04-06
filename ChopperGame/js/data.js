// Fases
export const PHASES = [
  {id:1, name:"Casa: Manhã",   icon:"🏠", dur:120, speed:0.6, smell:0.14, spawnRate:0.004, maxItems:4, eventRate:0.002, hz:["chocolate","onion"],          npcs:["adult","child","cat"], ai:"basic",    gMin:30, gMax:60, xp:50,  reqXP:0  },
  {id:2, name:"Casa: Tarde",   icon:"🌤️", dur:150, speed:0.8, smell:0.17, spawnRate:0.005, maxItems:5, eventRate:0.003, hz:["chocolate","onion","grape"],   npcs:["adult","child","cat"], ai:"expanded", gMin:50, gMax:90, xp:80,  reqXP:50 },
  {id:3, name:"Quintal",       icon:"🌿", dur:180, speed:1.0, smell:0.20, spawnRate:0.007, maxItems:7, eventRate:0.004, hz:["chocolate","onion","grape","medicine"], npcs:["adult","child","cat"], ai:"food", gMin:70, gMax:120, xp:120, reqXP:130},
  {id:4, name:"Caos Total",    icon:"🌪️", dur:180, speed:1.2, smell:0.23, spawnRate:0.009, maxItems:9, eventRate:0.006, hz:["chocolate","onion","grape","medicine","toxic_plant"], npcs:["adult","child","cat"], ai:"memory", gMin:100, gMax:180, xp:180, reqXP:250},
  {id:5, name:"Casa Vizinho",  icon:"🏡", dur:200, speed:1.4, smell:0.26, spawnRate:0.011, maxItems:11, eventRate:0.008, hz:["chocolate","onion","grape","medicine","toxic_plant","cleaning"], npcs:["adult","child","cat"], ai:"advanced", gMin:140, gMax:220, xp:250, reqXP:430},
  {id:6, name:"Parque",        icon:"🌳", dur:240, speed:1.6, smell:0.29, spawnRate:0.013, maxItems:13, eventRate:0.010, hz:["chocolate","onion","grape","medicine","toxic_plant","cleaning","coffee","gum"], npcs:["adult","child","cat"], ai:"advanced", gMin:180, gMax:280, xp:330, reqXP:680}
];

// Itens perigosos
export const HDEF = {
  chocolate:  { name:"Chocolate",    contam:25, color:"#5D1A0A", ring:"#D2691E", emoji:"🍫" },
  onion:      { name:"Cebola",       contam:18, color:"#6B3D8A", ring:"#9B59B6", emoji:"🧅" },
  grape:      { name:"Uva",          contam:20, color:"#4A235A", ring:"#8E44AD", emoji:"🍇" },
  medicine:   { name:"Remédio",      contam:22, color:"#7B241C", ring:"#E74C3C", emoji:"💊" },
  toxic_plant:{ name:"Planta Tóxica",contam:30, color:"#1A5C2A", ring:"#27AE60", emoji:"🌿" },
  cleaning:   { name:"Sabão",        contam:15, color:"#154360", ring:"#2980B9", emoji:"🧴" },
  coffee:     { name:"Café",         contam:12, color:"#3D1C02", ring:"#7F5C3E", emoji:"☕" },
  gum:        { name:"Chiclete",     contam:16, color:"#880E4F", ring:"#E91E63", emoji:"🍬" }
};

// Loja
export const SHOP_DB = {
  prevention: [
    { id:"trash_lid",   icon:"🗑️", name:"Lixeira Reforçada", desc:"Lixeira resiste mais",         cost:80, eff:"trash_resistant", type:"upgrade" },
    { id:"kitch_gate",  icon:"🚪", name:"Portão da Cozinha",  desc:"Porta bloqueia por mais tempo", cost:100, eff:"door_boost",    type:"upgrade" },
    { id:"win_lock",    icon:"🪟", name:"Trava de Janela",    desc:"Janelas não abrem com vento",   cost:60,  eff:"window_lock",   type:"upgrade" },
    { id:"safe_pot",    icon:"🫙", name:"Pote Seguro",        desc:"Alimentos protegidos",          cost:70,  eff:"safe_storage",  type:"upgrade" }
  ],
  control: [
    { id:"whistle",     icon:"🎵", name:"Apito Melhorado",   desc:"Chamar tem cooldown menor",      cost:90,  eff:"call_cd",       type:"upgrade" },
    { id:"att_ball",    icon:"⚽", name:"Bola Atrativa",     desc:"Distração dura mais",            cost:75,  eff:"dist_dur",      type:"upgrade" },
    { id:"safe_treat",  icon:"🦴", name:"Petisco Seguro",    desc:"+2 distrações por fase",         cost:50,  eff:"dist_count",    type:"consumable" },
    { id:"prem_toy",    icon:"🧸", name:"Brinquedo Premium", desc:"Distração ignora contam.",       cost:150, eff:"dist_immune",   type:"upgrade" }
  ],
  recovery: [
    { id:"shampoo",     icon:"🧼", name:"Shampoo",           desc:"Remove 15% contaminação",        cost:40,  eff:"red_15",        type:"consumable" },
    { id:"med_kit",     icon:"💊", name:"Remédio Forte",     desc:"Remove 30% contaminação",        cost:80,  eff:"red_30",        type:"consumable" },
    { id:"clean_kit",   icon:"🧹", name:"Kit Limpeza",       desc:"+1 uso de limpeza",             cost:45,  eff:"clean_count",   type:"consumable" },
    { id:"spray",       icon:"🌬️", name:"Spray Paralisante",desc:"Paralisa Chopper 5s",            cost:110, eff:"paralyze",      type:"consumable" }
  ],
  cosmetics: [
    { id:"col_red",     icon:"❤️", name:"Coleira Vermelha",  desc:"Visual cosmético",               cost:30,  eff:"col_red",       type:"cosmetic" },
    { id:"bandana",     icon:"💙", name:"Bandana Azul",      desc:"Visual cosmético",               cost:30,  eff:"bandana",       type:"cosmetic" },
    { id:"hat_chef",    icon:"👨‍🍳", name:"Chapéu de Chef",  desc:"Visual cosmético",               cost:50,  eff:"hat_chef",      type:"cosmetic" },
    { id:"shirt_star",  icon:"⭐", name:"Camiseta Estrela",  desc:"Visual cosmético",               cost:50,  eff:"shirt_star",    type:"cosmetic" }
  ]
};

// NPCs definições
export const NPC_DEF = {
  adult: { name:"Adulto", emoji:"🧑", speed:0.35, dropChance:0.003, drops:["chocolate","onion","medicine"], color:"#2471A3", sz:0.038 },
  child: { name:"Criança", emoji:"👦", speed:0.45, dropChance:0.005, drops:["grape","gum","chocolate"],    color:"#C0392B", sz:0.034 },
  cat:   { name:"Gato",   emoji:"🐱", speed:0.25, dropChance:0.004, drops:["toxic_plant","cleaning"],      color:"#7D3C98", sz:0.030 },
  bird:  { name:"Pássaro",emoji:"🐦", speed:0.70, dropChance:0.006, drops:["gum","cleaning"],              color:"#27AE60", sz:0.022 }
};

// Rotas dos NPCs (manhã/tarde)
export const NPC_ROUTES_MORNING = {
  adult: ["kitchen","living","laundry","kitchen","kitchen"],
  child: ["living","backyard","living","kitchen","backyard"],
  cat:   ["backyard","living","laundry","backyard","kitchen"]
};
export const NPC_ROUTES_AFTERNOON = {
  adult: ["living","kitchen","living","backyard","kitchen"],
  child: ["backyard","living","backyard","living","backyard"],
  cat:   ["living","backyard","backyard","kitchen","living"]
};

// Ações dos NPCs por cômodo
export const NPC_ROOM_ACTIONS = {
  adult: { kitchen:["comer","pegar_item"], living:["descansar"], laundry:["lavar"], backyard:["passear"] },
  child: { kitchen:["pegar_item"], living:["brincar","pegar_item"], backyard:["brincar","brincar"] },
  cat:   { kitchen:["beber_agua","pegar_item"], living:["dormir","pegar_item"], backyard:["brincar","pegar_item","pegar_item"], laundry:["pegar_item"] }
};

// POIs (pontos de interesse)
export const POI = {
  bed:   { roomId:"living",  lx:0.59, ly:0.38, emoji:"🛏️",  name:"Caminha" },
  food:  { roomId:"kitchen", lx:0.15, ly:0.32, emoji:"🍖",  name:"Tigela Comida" },
  water: { roomId:"kitchen", lx:0.30, ly:0.32, emoji:"💧",  name:"Tigela Água" },
  toilet:{ roomId:"laundry", lx:0.10, ly:0.65, emoji:"🚿",  name:"Banheiro" },
  toys:  { roomId:"backyard",lx:0.60, ly:0.62, emoji:"🎾",  name:"Brinquedos" },
  birds: { roomId:"backyard",lx:0.80, ly:0.57, emoji:"🐦",  name:"Pássaros" }
};

// Mapa (rooms e conexões)
export const MAP = {
  rooms: [
    { id:"kitchen", name:"Cozinha",    x:0,   y:0,   w:0.5, h:0.5, floorA:"#F5DEB3", floorB:"#DEB887", wall:"#8B6914", pat:"tile",
      furn: [
        { t:"rect",  lx:0.03, ly:0.04, lw:0.44, lh:0.11, c:"#8B4513", lbl:"Balcão" },
        { t:"circle",lx:0.10, ly:0.085,lr:0.04, c:"#555", lbl:"🍳" },
        { t:"rect",  lx:0.34, ly:0.04, lw:0.11, lh:0.14, c:"#B0C4DE", lbl:"🧊" },
        { t:"rect",  lx:0.20, ly:0.045,lw:0.12, lh:0.09, c:"#87CEEB", lbl:"🚿" },
        { t:"rect",  lx:0.08, ly:0.27, lw:0.30, lh:0.16, c:"#DEB887", lbl:"Mesa" },
        { t:"circle",lx:0.43, ly:0.37, lr:0.04, c:"#556B2F", lbl:"🗑️" }
      ] },
    { id:"living",  name:"Sala",       x:0.5, y:0,   w:0.5, h:0.5, floorA:"#C8D8B0", floorB:"#A8C090", wall:"#5D7A3A", pat:"wood",
      furn: [
        { t:"rect",  lx:0.53, ly:0.04, lw:0.43, lh:0.13, c:"#6B5344", lbl:"Sofá" },
        { t:"rect",  lx:0.69, ly:0.20, lw:0.17, lh:0.09, c:"#1a1a1a", lbl:"📺" },
        { t:"rect",  lx:0.57, ly:0.28, lw:0.21, lh:0.10, c:"#CD853F", lbl:"Mesa" },
        { t:"circle",lx:0.92, ly:0.08, lr:0.04, c:"#2E8B57", lbl:"🪴" },
        { t:"oval",  lx:0.59, ly:0.20, lw:0.30, lh:0.17, c:"#DC143C44", lbl:"" }
      ] },
    { id:"laundry", name:"Lavanderia", x:0,   y:0.5, w:0.5, h:0.5, floorA:"#B3D9F0", floorB:"#90C4E0", wall:"#2471A3", pat:"tile",
      furn: [
        { t:"rect",  lx:0.04, ly:0.54, lw:0.16, lh:0.14, c:"#90CAF9", lbl:"🌀" },
        { t:"rect",  lx:0.22, ly:0.54, lw:0.16, lh:0.14, c:"#B0BEC5", lbl:"♨️" },
        { t:"circle",lx:0.41, ly:0.62, lr:0.04, c:"#FFB300", lbl:"🪣" },
        { t:"rect",  lx:0.04, ly:0.72, lw:0.40, lh:0.06, c:"#78909C", lbl:"Prateleira" },
        { t:"rect",  lx:0.44, ly:0.72, lw:0.04, lh:0.16, c:"#90A4AE", lbl:"🧹" }
      ] },
    { id:"backyard",name:"Quintal",    x:0.5, y:0.5, w:0.5, h:0.5, floorA:"#7CB342", floorB:"#558B2F", wall:"#2E7D32", pat:"grass",
      furn: [
        { t:"tree",  lx:0.85, ly:0.54, lr:0.07, c:"#1B5E20", lbl:"🌳" },
        { t:"rect",  lx:0.52, ly:0.72, lw:0.16, lh:0.13, c:"#795548", lbl:"🏠" },
        { t:"circle",lx:0.90, ly:0.76, lr:0.04, c:"#546E7A", lbl:"🗑️" },
        { t:"circle",lx:0.55, ly:0.57, lr:0.025,c:"#E91E63", lbl:"🌸" },
        { t:"circle",lx:0.64, ly:0.56, lr:0.025,c:"#FF9800", lbl:"🌻" },
        { t:"circle",lx:0.73, ly:0.57, lr:0.025,c:"#388E3C", lbl:"🌿" }
      ] }
  ],
  connections: [
    { from:"kitchen", to:"living",   border:"right" },
    { from:"kitchen", to:"laundry",  border:"bottom" },
    { from:"living",  to:"backyard", border:"bottom" },
    { from:"laundry", to:"backyard", border:"right" }
  ]
};

// Rotina diária do Chopper
export const CHOPPER_ROUTINE = [
  { action:'explore', dur:[4,8],   desc:'explorar' },
  { action:'eat',     dur:[2,4],   desc:'comer' },
  { action:'drink',   dur:[2,3],   desc:'beber água' },
  { action:'explore', dur:[5,10],  desc:'explorar' },
  { action:'sleep',   dur:[3,6],   desc:'descansar' },
  { action:'play',    dur:[3,5],   desc:'brincar' },
  { action:'pee',     dur:[2,3],   desc:'fazer xixi' },
  { action:'explore', dur:[4,8],   desc:'explorar' }
];