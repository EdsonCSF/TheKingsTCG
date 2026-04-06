const CARDS_S1_WATER = [

/* =========================
   🔴 REI
========================= */
{
 id: "S1-CR-WAT-001",
 name: "Thalassor, Rei das Mares Eternas",
 tribe: "triton",
 type: "creature",
 element: "water",
 atk: 10,
 def: 19,
 rarity: "ancient",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "buffRaceDef",
   value: 2,
   target: "triton"
 },
 img: "img/cards/s1/water/Thalassor.webp"
},

/* =========================
   🔴 MÃO DO REI
========================= */
{
 id: "S1-CR-WAT-002",
 name: "Nerith, Voz das Profundezas",
 tribe: "aqua_elf",
 type: "creature",
 element: "water",
 atk: 11,
 def: 18,
 rarity: "ancient",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "buffElementDef",
   value: 1,
   target: "water"
 },
 img: "img/cards/s1/water/Nerith.webp"
},

/* =========================
   🟡 GENERAL
========================= */
{
 id: "S1-CR-WAT-003",
 name: "Marilis, Tempestade Abissal",
 tribe: "triton",
 type: "creature",
 element: "water",
 atk: 13,
 def: 16,
 rarity: "legendary",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "debuffElementAtk",
   value: -2,
   target: "fire"
 },
 img: "img/cards/s1/water/Marilis.webp"
},

/* =========================
   🟣 ÉPICAS
========================= */
{
 id: "S1-CR-WAT-004",
 name: "Kaoryn, Guardiao da Mare Alta",
 tribe: "triton",
 type: "creature",
 element: "water",
 atk: 9,
 def: 17,
 rarity: "epic",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "buffAdjacentDef",
   value: 2,
   target: "adjacentAlly"
 },
 img: "img/cards/s1/water/Kaoryn.webp"
},

{
 id: "S1-CR-WAT-005",
 name: "Lythienne, Muralha Coralina",
 tribe: "aqua_elf",
 type: "creature",
 element: "water",
 atk: 10,
 def: 16,
 rarity: "epic",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "ignoreDefReduction",
   target: "self"
 },
 img: "img/cards/s1/water/Lythienne.webp"
},

/* =========================
   🔵 RARAS
========================= */
{
 id: "S1-CR-WAT-006",
 name: "Daryon, Escudo das Correntes",
 tribe: "triton",
 type: "creature",
 element: "water",
 atk: 7,
 def: 10,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffDef",
   value: 2,
   target: "self"
 },
 img: "img/cards/s1/water/Daryon.webp"
},

{
 id: "S1-CR-WAT-007",
 name: "Serelis, Lamina da Mare",
 tribe: "aqua_elf",
 type: "creature",
 element: "water",
 atk: 11,
 def: 6,
 rarity: "rare",
 source: "drop",
 effect: null,
 img: "img/cards/s1/water/Serelis.webp"
},

{
 id: "S1-CR-WAT-008",
 name: "Morvath, Vigia das Profundezas",
 tribe: "triton",
 type: "creature",
 element: "water",
 atk: 6,
 def: 11,
 rarity: "rare",
 source: "drop",
 effect: null,
 img: "img/cards/s1/water/Morvath.webp"
},

{
 id: "S1-CR-WAT-009",
 name: "Naerys, Guardiao Coral",
 tribe: "aqua_elf",
 type: "creature",
 element: "water",
 atk: 8,
 def: 13,
 rarity: "rare",
 source: "drop",
 effect: null,
 img: "img/cards/s1/water/Naerys.webp"
},

{
 id: "S1-CR-WAT-010",
 name: "Thomar, Rocha Submersa",
 tribe: "triton",
 type: "creature",
 element: "water",
 atk: 5,
 def: 13,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffDef",
   value: 1,
   target: "self"
 },
 img: "img/cards/s1/water/Thomar.webp"
},

/* =========================
   🟢 NORMAIS
========================= */
{
 id: "S1-CR-WAT-011",
 name: "Soldados das Mares",
 tribe: "triton",
 type: "creature",
 element: "water",
 atk: 6,
 def: 8,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/water/Soldados_Mares.webp"
},

{
 id: "S1-CR-WAT-012",
 name: "Escudeiros Coralino",
 tribe: "aqua_elf",
 type: "creature",
 element: "water",
 atk: 4,
 def: 15,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/water/Escudeiros_Coral.webp"
},

{
 id: "S1-CR-WAT-013",
 name: "Batedores das Ondas",
 tribe: "triton",
 type: "creature",
 element: "water",
 atk: 8,
 def: 5,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/water/Batedores_Ondas.webp"
},

{
 id: "S1-CR-WAT-014",
 name: "Acolitas da Concha Sagrada",
 tribe: "aqua_elf",
 type: "creature",
 element: "water",
 atk: 3,
 def: 14,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/water/Acolitas_Concha.webp"
},

{
 id: "S1-CR-WAT-015",
 name: "Vigias da Espuma",
 tribe: "triton",
 type: "creature",
 element: "water",
 atk: 5,
 def: 9,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/water/Vigias_Espuma.webp"
},

{
 id: "S1-CR-WAT-016",
 name: "Guardioes da Mares Baixa",
 tribe: "triton",
 type: "creature",
 element: "water",
 atk: 2,
 def: 10,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/water/Guardioes_Mare.webp"
}

];