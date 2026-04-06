const CARDS_S1_FOREST = [

/* =========================
   🔴 REI
========================= */
{
 id: "S1-CR-FOR-001",
 name: "Sylpharis, Rainha da Raiz Ancestral",
 tribe: "elf",
 type: "creature",
 element: "forest",
 atk: 17,
 def: 19,
 rarity: "ancient",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "buffAdjacent",
   value: 2,
   target: "adjacentForest"
 },
 img: "img/cards/s1/forest/Sylpharis.webp"
},

/* =========================
   🔴 MÃO DO REI
========================= */
{
 id: "S1-CR-FOR-002",
 name: "Kaelthorn, Guardião da Lua Verde",
 tribe: "werewolf",
 type: "creature",
 element: "forest",
 atk: 12,
 def: 16,
 rarity: "ancient",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "buffRaceAdjacent",
   value: 4,
   target: "werewolf"
 },
 img: "img/cards/s1/forest/Kaelthorn.webp"
},

/* =========================
   🟡 GENERAL
========================= */
{
 id: "S1-CR-FOR-003",
 name: "Faelar, Lâmina Verde",
 tribe: "elf",
 type: "creature",
 element: "forest",
 atk: 12,
 def: 17,
 rarity: "legendary",
 source: "drop",
 effect: {
   kind: "active",
   trigger: "onPlay",
   action: "buffTargetAdjacent",
   value: 2,
   target: "adjacentForest"
 },
 img: "img/cards/s1/forest/Faelar.webp"
},

/* =========================
   🟣 ÉPICAS
========================= */
{
 id: "S1-CR-FOR-004",
 name: "Lyrien, Guardiã das Vinhas",
 tribe: "elf",
 type: "creature",
 element: "forest",
 atk: 10,
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
 img: "img/cards/s1/forest/Lyrien.webp"
},

{
 id: "S1-CR-FOR-005",
 name: "Vorag, Presa da Lua Sangrenta",
 tribe: "werewolf",
 type: "creature",
 element: "forest",
 atk: 14,
 def: 8,
 rarity: "epic",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffAtk",
   value: 2,
   target: "self"
 },
 img: "img/cards/s1/forest/Vorag.webp"
},

/* =========================
   🔵 RARAS
========================= */
{
 id: "S1-CR-FOR-006",
 name: "Eldrin, Arqueiro das Copas",
 tribe: "elf",
 type: "creature",
 element: "forest",
 atk: 10,
 def: 7,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffAtkStack",
   value: 1,
   target: "self"
 },
 img: "img/cards/s1/forest/Eldrin.webp"
},

{
 id: "S1-CR-FOR-007",
 name: "Thorgal, Caçador da Mata Profunda",
 tribe: "werewolf",
 type: "creature",
 element: "forest",
 atk: 12,
 def: 8,
 rarity: "rare",
 source: "drop",
 effect: null,
 img: "img/cards/s1/forest/Thorgal.webp"
},

{
 id: "S1-CR-FOR-008",
 name: "Selene, Protetora do Bosque",
 tribe: "elf",
 type: "creature",
 element: "forest",
 atk: 8,
 def: 14,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "buffAdjacentDefStack",
   value: 2,
   target: "adjacentForest"
 },
 img: "img/cards/s1/forest/Selene.webp"
},

{
 id: "S1-CR-FOR-009",
 name: "Ravok, Uivo das Sombras",
 tribe: "werewolf",
 type: "creature",
 element: "forest",
 atk: 11,
 def: 7,
 rarity: "rare",
 source: "drop",
 effect: null,
 img: "img/cards/s1/forest/Ravok.webp"
},

{
 id: "S1-CR-FOR-010",
 name: "Mythara, Guardiã da Seiva",
 tribe: "elf",
 type: "creature",
 element: "forest",
 atk: 7,
 def: 16,
 rarity: "rare",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "ignoreStatReduction",
   target: "self"
 },
 img: "img/cards/s1/forest/Mythara.webp"
},

/* =========================
   🟢 NORMAIS
========================= */
{
 id: "S1-CR-FOR-011",
 name: "Sentinelas da Raiz Viva",
 tribe: "elf",
 type: "creature",
 element: "forest",
 atk: 6,
 def: 10,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/forest/Sentinelas_Raiz.webp"
},

{
 id: "S1-CR-FOR-012",
 name: "Lobos da Clareira",
 tribe: "werewolf",
 type: "creature",
 element: "forest",
 atk: 10,
 def: 5,
 rarity: "normal",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffAtk",
   value: 1,
   target: "self"
 },
 img: "img/cards/s1/forest/Lobos_Clareira.webp"
},

{
 id: "S1-CR-FOR-013",
 name: "Aprendiz da Folha Sagrada",
 tribe: "elf",
 type: "creature",
 element: "forest",
 atk: 5,
 def: 12,
 rarity: "normal",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffDef",
   value: 2,
   target: "self"
 },
 img: "img/cards/s1/forest/Aprendiz_Folha.webp"
},

{
 id: "S1-CR-FOR-014",
 name: "Uivador Noturno",
 tribe: "werewolf",
 type: "creature",
 element: "forest",
 atk: 10,
 def: 6,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/forest/Uivador.webp"
},

{
 id: "S1-CR-FOR-015",
 name: "Guardiões da Árvore Antiga",
 tribe: "elf",
 type: "creature",
 element: "forest",
 atk: 4,
 def: 12,
 rarity: "normal",
 source: "drop",
 effect: null,
 img: "img/cards/s1/forest/Guardioes_Arvore.webp"
},

{
 id: "S1-CR-FOR-016",
 name: "Batedores das Sombras Verdes",
 tribe: "werewolf",
 type: "creature",
 element: "forest",
 atk: 7,
 def: 10,
 rarity: "normal",
 source: "drop",
 effect: {
   kind: "passive",
   trigger: "onField",
   action: "selfBuffDef",
   value: 1,
   target: "self"
 },
 img: "img/cards/s1/forest/Batedores_Sombras.webp"
}

];