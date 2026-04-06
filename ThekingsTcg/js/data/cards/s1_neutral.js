const CARDS_S1_NEUTRAL = [

/* =========================
   🔴 REI
========================= */
{
 id: "S1-CR-NEU-001",
 name: "Azhakar, O Dragao Exilado",
 tribe: "dragon",
 type: "creature",
 element: "neutral",
 atk: 16,
 def: 10,
 rarity: "ancient",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "chanceFieldBuff",
   value: 0.5,
   target: "neutralAllies"
 },
 img: "img/cards/s1/neutral/Azhakar.webp"
},

/* =========================
   🔴 MÃO DO REI
========================= */
{
 id: "S1-CR-NEU-002",
 name: "Zeraphion, O Dissidente",
 tribe: "demon",
 type: "creature",
 element: "neutral",
 atk: 15,
 def: 11,
 rarity: "ancient",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "buffRaceAtk",
   value: 5,
   target: "demon"
 },
 img: "img/cards/s1/neutral/Zeraphion.webp"
},

/* =========================
   🟡 GENERAL
========================= */
{
 id: "S1-CR-NEU-003",
 name: "Ravix, O Errante",
 tribe: "triton",
 type: "creature",
 element: "neutral",
 atk: 14,
 def: 10,
 rarity: "legendary",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "copyFieldBonus",
   target: "self"
 },
 img: "img/cards/s1/neutral/Ravix.webp"
},

/* =========================
   🟣 ÉPICAS
========================= */
{
 id: "S1-CR-NEU-004",
 name: "Kaeros, Andarilho dos Reinos",
 tribe: "dragon",
 type: "creature",
 element: "neutral",
 atk: 13,
 def: 11,
 rarity: "epic",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffAtk",
   value: 5
 },
 img: "img/cards/s1/neutral/Kaeros.webp"
},

{
 id: "S1-CR-NEU-005",
 name: "Myra, Lamina Sem Bandeira",
 tribe: "aqua_elf",
 type: "creature",
 element: "neutral",
 atk: 12,
 def: 3,
 rarity: "epic",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "buffRaceAtk",
   value: 5,
   target: "elf"
 },
 img: "img/cards/s1/neutral/Myra.webp"
},

/* =========================
   🔵 RARAS
========================= */
{
 id: "S1-CR-NEU-006",
 name: "Drogan, Mercenario Rubro",
 tribe: "demon",
 type: "creature",
 element: "neutral",
 atk: 11,
 def: 6,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffAtk",
   value: 2
 },
 img: "img/cards/s1/neutral/Drogan.webp"
},

{
 id: "S1-CR-NEU-007",
 name: "Theryn, Guardiao Errante",
 tribe: "werewolf",
 type: "creature",
 element: "neutral",
 atk: 7,
 def: 14,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffDef",
   value: 2
 },
 img: "img/cards/s1/neutral/Theryn.webp"
},

{
 id: "S1-CR-NEU-008",
 name: "Varok, Presa Livre",
 tribe: "werewolf",
 type: "creature",
 element: "neutral",
 atk: 10,
 def: 8,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffAtk",
   value: 2
 },
 img: "img/cards/s1/neutral/Varok.webp"
},

{
 id: "S1-CR-NEU-009",
 name: "Brom, Forjador Exilado",
 tribe: "dwarf",
 type: "creature",
 element: "neutral",
 atk: 8,
 def: 12,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffDef",
   value: 2
 },
 img: "img/cards/s1/neutral/Brom.webp"
},

{
 id: "S1-CR-NEU-010",
 name: "Seraphis, Escama Perdida",
 tribe: "dragon",
 type: "creature",
 element: "neutral",
 atk: 15,
 def: 8,
 rarity: "rare",
 source: "drop",
 effect: null,
 img: "img/cards/s1/neutral/Seraphis.webp"
},

/* =========================
   🟢 NORMAIS
========================= */
{
 id: "S1-CR-NEU-011",
 name: "Soldados Sem Reino",
 tribe: "golem",
 type: "creature",
 element: "neutral",
 atk: 12,
 def: 12,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/neutral/Soldados_Sem_Reino.webp"
},

{
 id: "S1-CR-NEU-012",
 name: "Exploradores Errantes",
 tribe: "forest_elf",
 type: "creature",
 element: "neutral",
 atk: 1,
 def: 13,
 rarity: "normal",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffDef",
   value: 4
 },
 img: "img/cards/s1/neutral/Exploradores_Errantes.webp"
},

{
 id: "S1-CR-NEU-013",
 name: "Acolitas da Terra",
 tribe: "golem",
 type: "creature",
 element: "neutral",
 atk: 12,
 def: 5,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/neutral/Acolitas_Terra.webp"
}

];