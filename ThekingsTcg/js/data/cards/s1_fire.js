const CARDS_S1_FIRE = [

/* =========================
   🔴 REI
========================= */
{
 id: "S1-CR-FIR-001",
 name: "Ignivar, Rei da Coroa Flamejante",
 tribe: "dragon",
 type: "creature",
 element: "fire",
 atk: 21,
 def: 12,
 rarity: "ancient",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "buffRace",
   value: 2,
   target: "dragon",
   condition: "fireField"
 },
 img: "img/cards/s1/fire/Ignivar.webp"
},

/* =========================
   🔴 MÃO DO REI
========================= */
{
 id: "S1-CR-FIR-002",
 name: "Valtherion, Chama da Coroa",
 tribe: "demon",
 type: "creature",
 element: "fire",
 atk: 16,
 def: 7,
 rarity: "ancient",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "buffRace",
   value: 1,
   target: "demon"
 },
 img: "img/cards/s1/fire/Valtherion.webp"
},

/* =========================
   🟡 GENERAL
========================= */
{
 id: "S1-CR-FIR-003",
 name: "Drakarion, Asa Rubra",
 tribe: "dragon",
 type: "creature",
 element: "fire",
 atk: 16,
 def: 6,
 rarity: "legendary",
 source: "drop",
 effect: {
   kind: "active",
   trigger: "onPlay",
   action: "buffPosition",
   value: 1,
   target: "backline"
 },
 img: "img/cards/s1/fire/Drakarion.webp"
},

/* =========================
   🟣 ÉPICAS
========================= */
{
 id: "S1-CR-FIR-004",
 name: "Azrakar, Flagelo Carmesim",
 tribe: "dragon",
 type: "creature",
 element: "fire",
 atk: 14,
 def: 3,
 rarity: "epic",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuff",
   value: 2
 },
 img: "img/cards/s1/fire/Azrakar.webp"
},

{
 id: "S1-CR-FIR-005",
 name: "Velkros, Arauto das Cinzas",
 tribe: "demon",
 type: "creature",
 element: "fire",
 atk: 10,
 def: 18,
 rarity: "epic",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "ignoreDisadvantage",
   target: "water"
 },
 img: "img/cards/s1/fire/Velkros.webp"
},

/* =========================
   🔵 RARAS
========================= */
{
 id: "S1-CR-FIR-006",
 name: "Drakthar, Cauda Escarlate",
 tribe: "dragon",
 type: "creature",
 element: "fire",
 atk: 13,
 def: 2,
 rarity: "rare",
 source: "drop",
 effect: null,
 img: "img/cards/s1/fire/Drakthar.webp"
},

{
 id: "S1-CR-FIR-007",
 name: "Atsur, Demônio da Fenda",
 tribe: "demon",
 type: "creature",
 element: "fire",
 atk: 8,
 def: 15,
 rarity: "rare",
 source: "drop",
 effect: null,
 img: "img/cards/s1/fire/Atsur.webp"
},

{
 id: "S1-CR-FIR-008",
 name: "Cyndra, Lâmina Ígnea",
 tribe: "demon",
 type: "creature",
 element: "fire",
 atk: 9,
 def: 6,
 rarity: "rare",
 source: "drop",
 effect: null,
 img: "img/cards/s1/fire/Cyndra.webp"
},

{
 id: "S1-CR-FIR-009",
 name: "Volkris, Asa Ardente",
 tribe: "dragon",
 type: "creature",
 element: "fire",
 atk: 6,
 def: 8,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "complexBuff"
 },
 img: "img/cards/s1/fire/Volkris.webp"
},

{
 id: "S1-CR-FIR-010",
 name: "Ignor, O Impetuoso",
 tribe: "demon",
 type: "creature",
 element: "fire",
 atk: 11,
 def: 5,
 rarity: "rare",
 source: "drop",
 effect: null,
 img: "img/cards/s1/fire/Ignor.webp"
},

{
 id: "S1-CR-FIR-011",
 name: "Pyron, Escudo Incandescente",
 tribe: "demon",
 type: "creature",
 element: "fire",
 atk: 8,
 def: 11,
 rarity: "rare",
 source: "drop",
 effect: null,
 img: "img/cards/s1/fire/Pyron.webp"
},

{
 id: "S1-CR-FIR-012",
 name: "Dravenyx, Fúria Rubra",
 tribe: "dragon",
 type: "creature",
 element: "fire",
 atk: 10,
 def: 10,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuff",
   value: 1
 },
 img: "img/cards/s1/fire/Dravenyx.webp"
},

/* =========================
   🟢 NORMAIS
========================= */
{
 id: "S1-CR-FIR-013",
 name: "Draco  Escama Rubra",
 tribe: "dragon",
 type: "creature",
 element: "fire",
 atk: 9,
 def: 1,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/fire/Draco_escama.webp"
},

{
 id: "S1-CR-FIR-014",
 name: "Imp das Brasas",
 tribe: "demon",
 type: "creature",
 element: "fire",
 atk: 7,
 def: 4,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/fire/Imp_Brasas.webp"
},

{
 id: "S1-CR-FIR-015",
 name: "Guardião da Lava",
 tribe: "demon",
 type: "creature",
 element: "fire",
 atk: 2,
 def: 20,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/fire/Guardiao_Lava.webp"
},

{
 id: "S1-CR-FIR-016",
 name: "Draco Jovem Escarlate",
 tribe: "dragon",
 type: "creature",
 element: "fire",
 atk: 7,
 def: 3,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/fire/Draco_Jovem.webp"
},

{
 id: "S1-CR-FIR-017",
 name: "Cultista da Chama Viva",
 tribe: "demon",
 type: "creature",
 element: "fire",
 atk: 3,
 def: 12,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/fire/Cultista.webp"
},

{
 id: "S1-CR-FIR-018",
 name: "Batedores Incendiário",
 tribe: "demon",
 type: "creature",
 element: "fire",
 atk: 9,
 def: 2,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/fire/Batedores.webp"
},

{
 id: "S1-CR-FIR-019",
 name: "Draco Vigias Carmesim",
 tribe: "dragon",
 type: "creature",
 element: "fire",
 atk: 8,
 def: 8,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/fire/Draco_Vigias.webp"
}

];