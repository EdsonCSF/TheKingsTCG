const CARDS_S1_EARTH = [

/* =========================
   🔴 REI
========================= */
{
 id: "S1-CR-EAR-001",
 name: "Grondar, Rei da Coroa Rochosa",
 tribe: "dwarf",
 type: "creature",
 element: "earth",
 atk: 15,
 def: 20,
 rarity: "ancient",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "buffSelfDefStack",
   value: 1,
   target: "self"
 },
 img: "img/cards/s1/earth/Grondar.webp"
},

/* =========================
   🔴 MÃO DO REI
========================= */
{
 id: "S1-CR-EAR-002",
 name: "Durmak, Martelo da Coroa",
 tribe: "golem",
 type: "creature",
 element: "earth",
 atk: 13,
 def: 17,
 rarity: "ancient",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "immuneFieldDebuff",
   target: "self"
 },
 img: "img/cards/s1/earth/Durmak.webp"
},

/* =========================
   🟡 GENERAL
========================= */
{
 id: "S1-CR-EAR-003",
 name: "Brumgar, Colosso de Pedra",
 tribe: "golem",
 type: "creature",
 element: "earth",
 atk: 8,
 def: 16,
 rarity: "legendary",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffDefStack",
   value: 1,
   target: "self"
 },
 img: "img/cards/s1/earth/Brumgar.webp"
},

/* =========================
   🟣 ÉPICAS
========================= */
{
 id: "S1-CR-EAR-004",
 name: "Thargrim, Escudo de Granito",
 tribe: "dwarf",
 type: "creature",
 element: "earth",
 atk: 11,
 def: 15,
 rarity: "epic",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffDef",
   value: 3,
   target: "self"
 },
 img: "img/cards/s1/earth/Thargrim.webp"
},

{
 id: "S1-CR-EAR-005",
 name: "Kolm, Punho Sísmico",
 tribe: "golem",
 type: "creature",
 element: "earth",
 atk: 14,
 def: 9,
 rarity: "epic",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffAtk",
   value: 3,
   target: "self"
 },
 img: "img/cards/s1/earth/Kolm.webp"
},

/* =========================
   🔵 RARAS
========================= */
{
 id: "S1-CR-EAR-006",
 name: "Borin, Guerreiro da Forja",
 tribe: "dwarf",
 type: "creature",
 element: "earth",
 atk: 10,
 def: 12,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffAtk",
   value: 4,
   target: "self"
 },
 img: "img/cards/s1/earth/Borin.webp"
},

{
 id: "S1-CR-EAR-007",
 name: "Mekthor, Rocha Viva",
 tribe: "golem",
 type: "creature",
 element: "earth",
 atk: 8,
 def: 15,
 rarity: "rare",
 source: "drop",
 effect: null,
 img: "img/cards/s1/earth/Mekthor.webp"
},

{
 id: "S1-CR-EAR-008",
 name: "Durgan, Escavador Profundo",
 tribe: "dwarf",
 type: "creature",
 element: "earth",
 atk: 11,
 def: 5,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffAtk",
   value: 1,
   target: "self"
 },
 img: "img/cards/s1/earth/Durgan.webp"
},

{
 id: "S1-CR-EAR-009",
 name: "Krag, Fragmento Titânico",
 tribe: "golem",
 type: "creature",
 element: "earth",
 atk: 6,
 def: 16,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffDef",
   value: 1,
   target: "self"
 },
 img: "img/cards/s1/earth/Krag.webp"
},

{
 id: "S1-CR-EAR-010",
 name: "Thorin, Martelo Pesado",
 tribe: "dwarf",
 type: "creature",
 element: "earth",
 atk: 11,
 def: 7,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffAtk",
   value: 1,
   target: "self"
 },
 img: "img/cards/s1/earth/Thorin.webp"
},

/* =========================
   🟢 NORMAIS
========================= */
{
 id: "S1-CR-EAR-011",
 name: "Soldados da Forja",
 tribe: "dwarf",
 type: "creature",
 element: "earth",
 atk: 7,
 def: 10,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/earth/Soldados_Forja.webp"
},

{
 id: "S1-CR-EAR-012",
 name: "Fragmento Rochoso",
 tribe: "golem",
 type: "creature",
 element: "earth",
 atk: 5,
 def: 14,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/earth/Fragmento_Rochoso.webp"
},

{
 id: "S1-CR-EAR-013",
 name: "Mineiros das Profundezas",
 tribe: "dwarf",
 type: "creature",
 element: "earth",
 atk: 6,
 def: 9,
 rarity: "normal",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffDef",
   value: 1,
   target: "self"
 },
 img: "img/cards/s1/earth/Mineiros.webp"
},

{
 id: "S1-CR-EAR-014",
 name: "Guardiao Basaltico",
 tribe: "golem",
 type: "creature",
 element: "earth",
 atk: 4,
 def: 17,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/earth/Guardiao_Basaltico.webp"
},

{
 id: "S1-CR-EAR-015",
 name: "Aprendiz da Forja Antiga",
 tribe: "dwarf",
 type: "creature",
 element: "earth",
 atk: 3,
 def: 12,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/earth/Aprendiz_Forja.webp"
},

{
 id: "S1-CR-EAR-016",
 name: "Sentinelas de Argila",
 tribe: "golem",
 type: "creature",
 element: "earth",
 atk: 8,
 def: 8,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/earth/Sentinelas_Argila.webp"
}

];