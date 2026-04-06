// ============================================================
//  ENEMIES_CAMPAIGN3.JS
//  Campanha 3 — Conselho da Coroa (Deck 40 cartas)
//
//  14 inimigos com decks ALEATÓRIOS a cada partida
//  Ordem de batalha:
//    1–5  → 5 Líderes revisitados      | aiLevel: 4
//    6–13 → 8 Generais revisitados     | aiLevel: 5
//    14   → Boss: Rei Aleatório ★      | aiLevel: 5 + carta Rei no deck
//
//  Distribuição: 40% principal (16) / 30% sup1 (12) / 30% sup2 (12)
//
//  Regras de raridade por deck (40 cartas):
//    Principal (16):
//      - 1× Mão do Rei   (ancient, id -002)
//      - 1× Lendária     (legendary, id -003)
//      - 2× Épicas       (epic, ids -004 e -005)
//      - 1× Lendária sup1 no sup1Pool
//      - 1× Épica sup1   no sup1Pool
//      - 1× Lendária sup2 no sup2Pool
//      - 1× Épica sup2   no sup2Pool
//      - Resto: Raras e Normais
//    Boss (+1 carta Rei obrigatória do elemento sorteado)
//
//  IDs verificados dos arquivos de cartas:
//    FOGO:    Rei=FIR-001  Mão=FIR-002  Lend=FIR-003  Ep1=FIR-004  Ep2=FIR-005
//    ÁGUA:    Rei=WAT-001  Mão=WAT-002  Lend=WAT-003  Ep1=WAT-004  Ep2=WAT-005
//    FLORESTA:Rei=FOR-001  Mão=FOR-002  Lend=FOR-003  Ep1=FOR-004  Ep2=FOR-005
//    TERRA:   Rei=EAR-001  Mão=EAR-002  Lend=EAR-003  Ep1=EAR-004  Ep2=EAR-005
//    NEUTRO:  Rei=NEU-001  Mão=NEU-002  Lend=NEU-003  Ep1=NEU-004  Ep2=NEU-005
//
//  POOLS: 5 por combinação elemental + 5 com Neutro como sup2
//  Total: 40 pools (10 por elemento base)
// ============================================================

const COUNCIL_DECK_POOLS = {

    // ══════════════════════════════════════════════════════
    //  🔥 FOGO (base principal)
    //  Combinação A: Fogo + Água + Floresta
    //  Combinação N: Fogo + Água + Neutro
    // ══════════════════════════════════════════════════════

    // ── FOGO + ÁGUA + FLORESTA ─────────────────────────────

    "c3_fire_water_forest_1": {
        element: "fire", supports: ["water", "forest"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand" },   // Valtherion, Chama da Coroa
            { id: "S1-CR-FIR-003", rarity: "legendary" },   // Drakarion, Asa Rubra
            { id: "S1-CR-FIR-004", rarity: "epic"      },   // Azrakar, Flagelo Carmesim
            { id: "S1-CR-FIR-005", rarity: "epic"      },   // Velkros, Arauto das Cinzas
            { id: "S1-CR-FIR-006", rarity: "rare"      },   // Drakthar, Cauda Escarlate
            { id: "S1-CR-FIR-007", rarity: "rare"      },   // Atsur, Demônio da Fenda
            { id: "S1-CR-FIR-008", rarity: "rare"      },   // Cyndra, Lâmina Ígnea
            { id: "S1-CR-FIR-009", rarity: "rare"      },   // Volkris, Asa Ardente
            { id: "S1-CR-FIR-010", rarity: "rare"      },   // Ignor, O Impetuoso
            { id: "S1-CR-FIR-011", rarity: "rare"      },   // Pyron, Escudo Incandescente
            { id: "S1-CR-FIR-012", rarity: "rare"      },   // Dravenyx, Fúria Rubra
            { id: "S1-CR-FIR-013", rarity: "normal"    },   // Draco Escama Rubra
            { id: "S1-CR-FIR-014", rarity: "normal"    },   // Imp das Brasas
            { id: "S1-CR-FIR-015", rarity: "normal"    },   // Guardião da Lava
            { id: "S1-CR-FIR-017", rarity: "normal"    },   // Cultista da Chama Viva
            { id: "S1-CR-FIR-018", rarity: "normal"    },   // Batedores Incendiário
            { id: "S1-CR-FIR-019", rarity: "normal"    },   // Draco Vigias Carmesim
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },   // Marilis, Tempestade Abissal
            { id: "S1-CR-WAT-004", rarity: "epic"      },   // Kaoryn, Guardião da Maré Alta
            { id: "S1-CR-WAT-006", rarity: "rare"      },   // Daryon, Escudo das Correntes
            { id: "S1-CR-WAT-007", rarity: "rare"      },   // Serelis, Lâmina da Maré
            { id: "S1-CR-WAT-008", rarity: "rare"      },   // Morvath, Vigia das Profundezas
            { id: "S1-CR-WAT-009", rarity: "rare"      },   // Naerys, Guardião Coral
            { id: "S1-CR-WAT-010", rarity: "rare"      },   // Thomar, Rocha Submersa
            { id: "S1-CR-WAT-011", rarity: "normal"    },   // Soldados das Marés
            { id: "S1-CR-WAT-012", rarity: "normal"    },   // Escudeiros Coralino
            { id: "S1-CR-WAT-013", rarity: "normal"    },   // Batedores das Ondas
            { id: "S1-CR-WAT-015", rarity: "normal"    },   // Vigias da Espuma
            { id: "S1-CR-WAT-016", rarity: "normal"    },   // Guardiões da Maré Baixa
        ],
        sup2Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },   // Faelar, Lâmina Verde
            { id: "S1-CR-FOR-004", rarity: "epic"      },   // Lyrien, Guardiã das Vinhas
            { id: "S1-CR-FOR-006", rarity: "rare"      },   // Eldrin, Arqueiro das Copas
            { id: "S1-CR-FOR-007", rarity: "rare"      },   // Thorgal, Caçador da Mata
            { id: "S1-CR-FOR-008", rarity: "rare"      },   // Selene, Protetora do Bosque
            { id: "S1-CR-FOR-009", rarity: "rare"      },   // Ravok, Uivo das Sombras
            { id: "S1-CR-FOR-010", rarity: "rare"      },   // Mythara, Guardiã da Seiva
            { id: "S1-CR-FOR-011", rarity: "normal"    },   // Sentinelas da Raiz Viva
            { id: "S1-CR-FOR-012", rarity: "normal"    },   // Lobos da Clareira
            { id: "S1-CR-FOR-013", rarity: "normal"    },   // Aprendiz da Folha Sagrada
            { id: "S1-CR-FOR-015", rarity: "normal"    },   // Guardiões da Árvore Antiga
            { id: "S1-CR-FOR-016", rarity: "normal"    },   // Batedores das Sombras Verdes
        ]
    },

    "c3_fire_water_forest_2": {
        element: "fire", supports: ["water", "forest"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand" },
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-006", rarity: "rare"      },
            { id: "S1-CR-FIR-008", rarity: "rare"      },
            { id: "S1-CR-FIR-010", rarity: "rare"      },
            { id: "S1-CR-FIR-011", rarity: "rare"      },
            { id: "S1-CR-FIR-012", rarity: "rare"      },
            { id: "S1-CR-FIR-014", rarity: "normal"    },
            { id: "S1-CR-FIR-015", rarity: "normal"    },
            { id: "S1-CR-FIR-016", rarity: "normal"    },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-005", rarity: "epic"      },   // Lythienne, Muralha Coralina
            { id: "S1-CR-WAT-007", rarity: "rare"      },
            { id: "S1-CR-WAT-009", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-014", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-005", rarity: "epic"      },   // Vorag, Presa da Lua Sangrenta
            { id: "S1-CR-FOR-007", rarity: "rare"      },
            { id: "S1-CR-FOR-009", rarity: "rare"      },
            { id: "S1-CR-FOR-010", rarity: "rare"      },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-014", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ]
    },

    "c3_fire_water_forest_3": {
        element: "fire", supports: ["water", "forest"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand" },
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-007", rarity: "rare"      },
            { id: "S1-CR-FIR-009", rarity: "rare"      },
            { id: "S1-CR-FIR-011", rarity: "rare"      },
            { id: "S1-CR-FIR-013", rarity: "normal"    },
            { id: "S1-CR-FIR-015", rarity: "normal"    },
            { id: "S1-CR-FIR-017", rarity: "normal"    },
            { id: "S1-CR-FIR-017", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-006", rarity: "rare"      },
            { id: "S1-CR-WAT-008", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-012", rarity: "normal"    },
            { id: "S1-CR-WAT-015", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-006", rarity: "rare"      },
            { id: "S1-CR-FOR-008", rarity: "rare"      },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
            { id: "S1-CR-FOR-015", rarity: "normal"    },
        ]
    },

    "c3_fire_water_forest_4": {
        element: "fire", supports: ["water", "forest"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand" },
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-006", rarity: "rare"      },
            { id: "S1-CR-FIR-010", rarity: "rare"      },
            { id: "S1-CR-FIR-012", rarity: "rare"      },
            { id: "S1-CR-FIR-014", rarity: "normal"    },
            { id: "S1-CR-FIR-014", rarity: "normal"    },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-007", rarity: "rare"      },
            { id: "S1-CR-WAT-009", rarity: "rare"      },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-009", rarity: "rare"      },
            { id: "S1-CR-FOR-010", rarity: "rare"      },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ]
    },

    "c3_fire_water_forest_5": {
        element: "fire", supports: ["water", "forest"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand" },
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-007", rarity: "rare"      },
            { id: "S1-CR-FIR-008", rarity: "rare"      },
            { id: "S1-CR-FIR-011", rarity: "rare"      },
            { id: "S1-CR-FIR-015", rarity: "normal"    },
            { id: "S1-CR-FIR-015", rarity: "normal"    },
            { id: "S1-CR-FIR-017", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-006", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-014", rarity: "normal"    },
            { id: "S1-CR-WAT-015", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-007", rarity: "rare"      },
            { id: "S1-CR-FOR-008", rarity: "rare"      },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
        ]
    },

    // ── FOGO + ÁGUA + NEUTRO ───────────────────────────────

    "c3_fire_water_neutral_1": {
        element: "fire", supports: ["water", "neutral"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand" },
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-006", rarity: "rare"      },
            { id: "S1-CR-FIR-009", rarity: "rare"      },
            { id: "S1-CR-FIR-010", rarity: "rare"      },
            { id: "S1-CR-FIR-012", rarity: "rare"      },
            { id: "S1-CR-FIR-014", rarity: "normal"    },
            { id: "S1-CR-FIR-017", rarity: "normal"    },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-007", rarity: "rare"      },
            { id: "S1-CR-WAT-009", rarity: "rare"      },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },   // Ravix, O Errante
            { id: "S1-CR-NEU-004", rarity: "epic"      },   // Kaeros, Andarilho dos Reinos
            { id: "S1-CR-NEU-006", rarity: "rare"      },   // Drogan, Mercenário Rubro
            { id: "S1-CR-NEU-007", rarity: "rare"      },   // Theryn, Guardião Errante
            { id: "S1-CR-NEU-008", rarity: "rare"      },   // Varok, Presa Livre
            { id: "S1-CR-NEU-010", rarity: "rare"      },   // Seraphis, Escama Perdida
            { id: "S1-CR-NEU-011", rarity: "normal"    },   // Soldados Sem Reino
            { id: "S1-CR-NEU-013", rarity: "normal"    },   // Acólitas da Terra
        ]
    },

    "c3_fire_water_neutral_2": {
        element: "fire", supports: ["water", "neutral"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand" },
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-007", rarity: "rare"      },
            { id: "S1-CR-FIR-011", rarity: "rare"      },
            { id: "S1-CR-FIR-012", rarity: "rare"      },
            { id: "S1-CR-FIR-015", rarity: "normal"    },
            { id: "S1-CR-FIR-016", rarity: "normal"    },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-006", rarity: "rare"      },
            { id: "S1-CR-WAT-008", rarity: "rare"      },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-014", rarity: "normal"    },
            { id: "S1-CR-WAT-015", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-005", rarity: "epic"      },   // Myra, Lâmina Sem Bandeira
            { id: "S1-CR-NEU-007", rarity: "rare"      },
            { id: "S1-CR-NEU-009", rarity: "rare"      },   // Brom, Forjador Exilado
            { id: "S1-CR-NEU-010", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-012", rarity: "normal"    },   // Exploradores Errantes
        ]
    },

    "c3_fire_water_neutral_3": {
        element: "fire", supports: ["water", "neutral"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand" },
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-006", rarity: "rare"      },
            { id: "S1-CR-FIR-008", rarity: "rare"      },
            { id: "S1-CR-FIR-010", rarity: "rare"      },
            { id: "S1-CR-FIR-013", rarity: "normal"    },
            { id: "S1-CR-FIR-017", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-007", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-012", rarity: "normal"    },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-004", rarity: "epic"      },
            { id: "S1-CR-NEU-006", rarity: "rare"      },
            { id: "S1-CR-NEU-008", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    },

    "c3_fire_water_neutral_4": {
        element: "fire", supports: ["water", "neutral"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand" },
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-009", rarity: "rare"      },
            { id: "S1-CR-FIR-011", rarity: "rare"      },
            { id: "S1-CR-FIR-012", rarity: "rare"      },
            { id: "S1-CR-FIR-014", rarity: "normal"    },
            { id: "S1-CR-FIR-016", rarity: "normal"    },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-008", rarity: "rare"      },
            { id: "S1-CR-WAT-009", rarity: "rare"      },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-015", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-005", rarity: "epic"      },
            { id: "S1-CR-NEU-007", rarity: "rare"      },
            { id: "S1-CR-NEU-010", rarity: "rare"      },
            { id: "S1-CR-NEU-012", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    },

    "c3_fire_water_neutral_5": {
        element: "fire", supports: ["water", "neutral"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand" },
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-006", rarity: "rare"      },
            { id: "S1-CR-FIR-007", rarity: "rare"      },
            { id: "S1-CR-FIR-012", rarity: "rare"      },
            { id: "S1-CR-FIR-015", rarity: "normal"    },
            { id: "S1-CR-FIR-017", rarity: "normal"    },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-006", rarity: "rare"      },
            { id: "S1-CR-WAT-009", rarity: "rare"      },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-014", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-004", rarity: "epic"      },
            { id: "S1-CR-NEU-008", rarity: "rare"      },
            { id: "S1-CR-NEU-009", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-012", rarity: "normal"    },
        ]
    },

    // ══════════════════════════════════════════════════════
    //  💧 ÁGUA (base principal)
    //  Combinação A: Água + Fogo + Terra
    //  Combinação N: Água + Fogo + Neutro
    // ══════════════════════════════════════════════════════

    "c3_water_fire_earth_1": {
        element: "water", supports: ["fire", "earth"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand" },   // Nerith, Voz das Profundezas
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-006", rarity: "rare"      },
            { id: "S1-CR-WAT-007", rarity: "rare"      },
            { id: "S1-CR-WAT-008", rarity: "rare"      },
            { id: "S1-CR-WAT-009", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-012", rarity: "normal"    },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-014", rarity: "normal"    },
            { id: "S1-CR-WAT-015", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-006", rarity: "rare"      },
            { id: "S1-CR-FIR-008", rarity: "rare"      },
            { id: "S1-CR-FIR-010", rarity: "rare"      },
            { id: "S1-CR-FIR-014", rarity: "normal"    },
            { id: "S1-CR-FIR-017", rarity: "normal"    },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },   // Brumgar, Colosso de Pedra
            { id: "S1-CR-EAR-004", rarity: "epic"      },   // Thargrim, Escudo de Granito
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-007", rarity: "rare"      },
            { id: "S1-CR-EAR-009", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ]
    },

    "c3_water_fire_earth_2": {
        element: "water", supports: ["fire", "earth"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand" },
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-006", rarity: "rare"      },
            { id: "S1-CR-WAT-008", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-007", rarity: "rare"      },
            { id: "S1-CR-FIR-011", rarity: "rare"      },
            { id: "S1-CR-FIR-015", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-005", rarity: "epic"      },   // Kolm, Punho Sísmico
            { id: "S1-CR-EAR-008", rarity: "rare"      },
            { id: "S1-CR-EAR-010", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-015", rarity: "normal"    },
        ]
    },

    "c3_water_fire_earth_3": {
        element: "water", supports: ["fire", "earth"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand" },
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-007", rarity: "rare"      },
            { id: "S1-CR-WAT-009", rarity: "rare"      },
            { id: "S1-CR-WAT-012", rarity: "normal"    },
            { id: "S1-CR-WAT-014", rarity: "normal"    },
            { id: "S1-CR-WAT-015", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-006", rarity: "rare"      },
            { id: "S1-CR-FIR-010", rarity: "rare"      },
            { id: "S1-CR-FIR-013", rarity: "normal"    },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-007", rarity: "rare"      },
            { id: "S1-CR-EAR-009", rarity: "rare"      },
            { id: "S1-CR-EAR-012", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ]
    },

    "c3_water_fire_earth_4": {
        element: "water", supports: ["fire", "earth"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand" },
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-006", rarity: "rare"      },
            { id: "S1-CR-WAT-007", rarity: "rare"      },
            { id: "S1-CR-WAT-009", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-012", rarity: "normal"    },
            { id: "S1-CR-WAT-015", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-009", rarity: "rare"      },
            { id: "S1-CR-FIR-012", rarity: "rare"      },
            { id: "S1-CR-FIR-016", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-010", rarity: "rare"      },
            { id: "S1-CR-EAR-013", rarity: "normal"    },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
        ]
    },

    "c3_water_fire_earth_5": {
        element: "water", supports: ["fire", "earth"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand" },
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-008", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-014", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-008", rarity: "rare"      },
            { id: "S1-CR-FIR-010", rarity: "rare"      },
            { id: "S1-CR-FIR-014", rarity: "normal"    },
            { id: "S1-CR-FIR-015", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-007", rarity: "rare"      },
            { id: "S1-CR-EAR-009", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ]
    },

    // ── ÁGUA + FOGO + NEUTRO ───────────────────────────────

    "c3_water_fire_neutral_1": {
        element: "water", supports: ["fire", "neutral"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand" },
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-006", rarity: "rare"      },
            { id: "S1-CR-WAT-009", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-006", rarity: "rare"      },
            { id: "S1-CR-FIR-010", rarity: "rare"      },
            { id: "S1-CR-FIR-014", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-004", rarity: "epic"      },
            { id: "S1-CR-NEU-006", rarity: "rare"      },
            { id: "S1-CR-NEU-009", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    },

    "c3_water_fire_neutral_2": {
        element: "water", supports: ["fire", "neutral"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand" },
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-007", rarity: "rare"      },
            { id: "S1-CR-WAT-008", rarity: "rare"      },
            { id: "S1-CR-WAT-012", rarity: "normal"    },
            { id: "S1-CR-WAT-014", rarity: "normal"    },
            { id: "S1-CR-WAT-015", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-007", rarity: "rare"      },
            { id: "S1-CR-FIR-012", rarity: "rare"      },
            { id: "S1-CR-FIR-017", rarity: "normal"    },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-005", rarity: "epic"      },
            { id: "S1-CR-NEU-007", rarity: "rare"      },
            { id: "S1-CR-NEU-010", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-012", rarity: "normal"    },
        ]
    },

    "c3_water_fire_neutral_3": {
        element: "water", supports: ["fire", "neutral"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand" },
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-006", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-009", rarity: "rare"      },
            { id: "S1-CR-FIR-011", rarity: "rare"      },
            { id: "S1-CR-FIR-016", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-004", rarity: "epic"      },
            { id: "S1-CR-NEU-008", rarity: "rare"      },
            { id: "S1-CR-NEU-010", rarity: "rare"      },
            { id: "S1-CR-NEU-012", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    },

    "c3_water_fire_neutral_4": {
        element: "water", supports: ["fire", "neutral"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand" },
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-007", rarity: "rare"      },
            { id: "S1-CR-WAT-009", rarity: "rare"      },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-014", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-006", rarity: "rare"      },
            { id: "S1-CR-FIR-008", rarity: "rare"      },
            { id: "S1-CR-FIR-015", rarity: "normal"    },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-005", rarity: "epic"      },
            { id: "S1-CR-NEU-006", rarity: "rare"      },
            { id: "S1-CR-NEU-009", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    },

    "c3_water_fire_neutral_5": {
        element: "water", supports: ["fire", "neutral"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand" },
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-008", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-015", rarity: "normal"    },
            { id: "S1-CR-WAT-015", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-007", rarity: "rare"      },
            { id: "S1-CR-FIR-010", rarity: "rare"      },
            { id: "S1-CR-FIR-017", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-004", rarity: "epic"      },
            { id: "S1-CR-NEU-007", rarity: "rare"      },
            { id: "S1-CR-NEU-010", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-012", rarity: "normal"    },
        ]
    },

    // ══════════════════════════════════════════════════════
    //  🌲 FLORESTA (base principal)
    //  Combinação A: Floresta + Terra + Fogo
    //  Combinação N: Floresta + Terra + Neutro
    // ══════════════════════════════════════════════════════

    "c3_forest_earth_fire_1": {
        element: "forest", supports: ["earth", "fire"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand" },
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-006", rarity: "rare"      },
            { id: "S1-CR-FOR-007", rarity: "rare"      },
            { id: "S1-CR-FOR-008", rarity: "rare"      },
            { id: "S1-CR-FOR-009", rarity: "rare"      },
            { id: "S1-CR-FOR-010", rarity: "rare"      },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
            { id: "S1-CR-FOR-014", rarity: "normal"    },
            { id: "S1-CR-FOR-015", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-007", rarity: "rare"      },
            { id: "S1-CR-EAR-008", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-006", rarity: "rare"      },
            { id: "S1-CR-FIR-010", rarity: "rare"      },
            { id: "S1-CR-FIR-014", rarity: "normal"    },
            { id: "S1-CR-FIR-015", rarity: "normal"    },
            { id: "S1-CR-FIR-017", rarity: "normal"    },
        ]
    },

    "c3_forest_earth_fire_2": {
        element: "forest", supports: ["earth", "fire"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand" },
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-006", rarity: "rare"      },
            { id: "S1-CR-FOR-009", rarity: "rare"      },
            { id: "S1-CR-FOR-010", rarity: "rare"      },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-008", rarity: "rare"      },
            { id: "S1-CR-EAR-009", rarity: "rare"      },
            { id: "S1-CR-EAR-010", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-013", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-007", rarity: "rare"      },
            { id: "S1-CR-FIR-009", rarity: "rare"      },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ]
    },

    "c3_forest_earth_fire_3": {
        element: "forest", supports: ["earth", "fire"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand" },
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-007", rarity: "rare"      },
            { id: "S1-CR-FOR-008", rarity: "rare"      },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
            { id: "S1-CR-FOR-014", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-007", rarity: "rare"      },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-006", rarity: "rare"      },
            { id: "S1-CR-FIR-008", rarity: "rare"      },
            { id: "S1-CR-FIR-015", rarity: "normal"    },
            { id: "S1-CR-FIR-017", rarity: "normal"    },
        ]
    },

    "c3_forest_earth_fire_4": {
        element: "forest", supports: ["earth", "fire"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand" },
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-006", rarity: "rare"      },
            { id: "S1-CR-FOR-007", rarity: "rare"      },
            { id: "S1-CR-FOR-010", rarity: "rare"      },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-009", rarity: "rare"      },
            { id: "S1-CR-EAR-010", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-005", rarity: "epic"      },
            { id: "S1-CR-FIR-011", rarity: "rare"      },
            { id: "S1-CR-FIR-012", rarity: "rare"      },
            { id: "S1-CR-FIR-013", rarity: "normal"    },
            { id: "S1-CR-FIR-019", rarity: "normal"    },
        ]
    },

    "c3_forest_earth_fire_5": {
        element: "forest", supports: ["earth", "fire"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand" },
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-008", rarity: "rare"      },
            { id: "S1-CR-FOR-009", rarity: "rare"      },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-015", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-008", rarity: "rare"      },
            { id: "S1-CR-EAR-015", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary" },
            { id: "S1-CR-FIR-004", rarity: "epic"      },
            { id: "S1-CR-FIR-007", rarity: "rare"      },
            { id: "S1-CR-FIR-010", rarity: "rare"      },
            { id: "S1-CR-FIR-016", rarity: "normal"    },
            { id: "S1-CR-FIR-018", rarity: "normal"    },
        ]
    },

    // ── FLORESTA + TERRA + NEUTRO ──────────────────────────

    "c3_forest_earth_neutral_1": {
        element: "forest", supports: ["earth", "neutral"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand" },
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-006", rarity: "rare"      },
            { id: "S1-CR-FOR-008", rarity: "rare"      },
            { id: "S1-CR-FOR-010", rarity: "rare"      },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-007", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-004", rarity: "epic"      },
            { id: "S1-CR-NEU-007", rarity: "rare"      },
            { id: "S1-CR-NEU-009", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    },

    "c3_forest_earth_neutral_2": {
        element: "forest", supports: ["earth", "neutral"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand" },
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-007", rarity: "rare"      },
            { id: "S1-CR-FOR-009", rarity: "rare"      },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-015", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-008", rarity: "rare"      },
            { id: "S1-CR-EAR-010", rarity: "rare"      },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-005", rarity: "epic"      },
            { id: "S1-CR-NEU-006", rarity: "rare"      },
            { id: "S1-CR-NEU-010", rarity: "rare"      },
            { id: "S1-CR-NEU-012", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    },

    "c3_forest_earth_neutral_3": {
        element: "forest", supports: ["earth", "neutral"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand" },
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-006", rarity: "rare"      },
            { id: "S1-CR-FOR-010", rarity: "rare"      },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-009", rarity: "rare"      },
            { id: "S1-CR-EAR-012", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-004", rarity: "epic"      },
            { id: "S1-CR-NEU-008", rarity: "rare"      },
            { id: "S1-CR-NEU-009", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-012", rarity: "normal"    },
        ]
    },

    "c3_forest_earth_neutral_4": {
        element: "forest", supports: ["earth", "neutral"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand" },
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-007", rarity: "rare"      },
            { id: "S1-CR-FOR-008", rarity: "rare"      },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-014", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-007", rarity: "rare"      },
            { id: "S1-CR-EAR-010", rarity: "rare"      },
            { id: "S1-CR-EAR-013", rarity: "normal"    },
            { id: "S1-CR-EAR-015", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-005", rarity: "epic"      },
            { id: "S1-CR-NEU-007", rarity: "rare"      },
            { id: "S1-CR-NEU-010", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    },

    "c3_forest_earth_neutral_5": {
        element: "forest", supports: ["earth", "neutral"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand" },
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-009", rarity: "rare"      },
            { id: "S1-CR-FOR-010", rarity: "rare"      },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
            { id: "S1-CR-FOR-015", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-008", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-004", rarity: "epic"      },
            { id: "S1-CR-NEU-006", rarity: "rare"      },
            { id: "S1-CR-NEU-008", rarity: "rare"      },
            { id: "S1-CR-NEU-012", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    },

    // ══════════════════════════════════════════════════════
    //  🪨 TERRA (base principal)
    //  Combinação A: Terra + Floresta + Água
    //  Combinação N: Terra + Floresta + Neutro
    // ══════════════════════════════════════════════════════

    "c3_earth_forest_water_1": {
        element: "earth", supports: ["forest", "water"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand" },   // Durmak, Martelo da Coroa
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-007", rarity: "rare"      },
            { id: "S1-CR-EAR-008", rarity: "rare"      },
            { id: "S1-CR-EAR-009", rarity: "rare"      },
            { id: "S1-CR-EAR-010", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-012", rarity: "normal"    },
            { id: "S1-CR-EAR-013", rarity: "normal"    },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
            { id: "S1-CR-EAR-015", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-006", rarity: "rare"      },
            { id: "S1-CR-FOR-008", rarity: "rare"      },
            { id: "S1-CR-FOR-010", rarity: "rare"      },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
            { id: "S1-CR-FOR-015", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-006", rarity: "rare"      },
            { id: "S1-CR-WAT-009", rarity: "rare"      },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ]
    },

    "c3_earth_forest_water_2": {
        element: "earth", supports: ["forest", "water"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand" },
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-009", rarity: "rare"      },
            { id: "S1-CR-EAR-010", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-007", rarity: "rare"      },
            { id: "S1-CR-FOR-009", rarity: "rare"      },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-007", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-012", rarity: "normal"    },
            { id: "S1-CR-WAT-015", rarity: "normal"    },
        ]
    },

    "c3_earth_forest_water_3": {
        element: "earth", supports: ["forest", "water"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand" },
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-007", rarity: "rare"      },
            { id: "S1-CR-EAR-008", rarity: "rare"      },
            { id: "S1-CR-EAR-012", rarity: "normal"    },
            { id: "S1-CR-EAR-013", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-006", rarity: "rare"      },
            { id: "S1-CR-FOR-010", rarity: "rare"      },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-015", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-008", rarity: "rare"      },
            { id: "S1-CR-WAT-009", rarity: "rare"      },
            { id: "S1-CR-WAT-014", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ]
    },

    "c3_earth_forest_water_4": {
        element: "earth", supports: ["forest", "water"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand" },
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-007", rarity: "rare"      },
            { id: "S1-CR-EAR-009", rarity: "rare"      },
            { id: "S1-CR-EAR-012", rarity: "normal"    },
            { id: "S1-CR-EAR-015", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-008", rarity: "rare"      },
            { id: "S1-CR-FOR-009", rarity: "rare"      },
            { id: "S1-CR-FOR-014", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-005", rarity: "epic"      },
            { id: "S1-CR-WAT-006", rarity: "rare"      },
            { id: "S1-CR-WAT-010", rarity: "rare"      },
            { id: "S1-CR-WAT-011", rarity: "normal"    },
            { id: "S1-CR-WAT-013", rarity: "normal"    },
        ]
    },

    "c3_earth_forest_water_5": {
        element: "earth", supports: ["forest", "water"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand" },
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-008", rarity: "rare"      },
            { id: "S1-CR-EAR-010", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-013", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-006", rarity: "rare"      },
            { id: "S1-CR-FOR-007", rarity: "rare"      },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary" },
            { id: "S1-CR-WAT-004", rarity: "epic"      },
            { id: "S1-CR-WAT-007", rarity: "rare"      },
            { id: "S1-CR-WAT-008", rarity: "rare"      },
            { id: "S1-CR-WAT-012", rarity: "normal"    },
            { id: "S1-CR-WAT-016", rarity: "normal"    },
        ]
    },

    // ── TERRA + FLORESTA + NEUTRO ──────────────────────────

    "c3_earth_forest_neutral_1": {
        element: "earth", supports: ["forest", "neutral"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand" },
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-008", rarity: "rare"      },
            { id: "S1-CR-EAR-010", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-007", rarity: "rare"      },
            { id: "S1-CR-FOR-009", rarity: "rare"      },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-015", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-004", rarity: "epic"      },
            { id: "S1-CR-NEU-006", rarity: "rare"      },
            { id: "S1-CR-NEU-009", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    },

    "c3_earth_forest_neutral_2": {
        element: "earth", supports: ["forest", "neutral"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand" },
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-007", rarity: "rare"      },
            { id: "S1-CR-EAR-009", rarity: "rare"      },
            { id: "S1-CR-EAR-012", rarity: "normal"    },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-008", rarity: "rare"      },
            { id: "S1-CR-FOR-010", rarity: "rare"      },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-005", rarity: "epic"      },
            { id: "S1-CR-NEU-007", rarity: "rare"      },
            { id: "S1-CR-NEU-010", rarity: "rare"      },
            { id: "S1-CR-NEU-012", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    },

    "c3_earth_forest_neutral_3": {
        element: "earth", supports: ["forest", "neutral"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand" },
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-006", rarity: "rare"      },
            { id: "S1-CR-EAR-010", rarity: "rare"      },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-011", rarity: "normal"    },
            { id: "S1-CR-EAR-015", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-006", rarity: "rare"      },
            { id: "S1-CR-FOR-009", rarity: "rare"      },
            { id: "S1-CR-FOR-012", rarity: "normal"    },
            { id: "S1-CR-FOR-014", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-004", rarity: "epic"      },
            { id: "S1-CR-NEU-008", rarity: "rare"      },
            { id: "S1-CR-NEU-009", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-012", rarity: "normal"    },
        ]
    },

    "c3_earth_forest_neutral_4": {
        element: "earth", supports: ["forest", "neutral"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand" },
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-007", rarity: "rare"      },
            { id: "S1-CR-EAR-008", rarity: "rare"      },
            { id: "S1-CR-EAR-013", rarity: "normal"    },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
            { id: "S1-CR-EAR-014", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-005", rarity: "epic"      },
            { id: "S1-CR-FOR-007", rarity: "rare"      },
            { id: "S1-CR-FOR-010", rarity: "rare"      },
            { id: "S1-CR-FOR-011", rarity: "normal"    },
            { id: "S1-CR-FOR-016", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-005", rarity: "epic"      },
            { id: "S1-CR-NEU-006", rarity: "rare"      },
            { id: "S1-CR-NEU-010", rarity: "rare"      },
            { id: "S1-CR-NEU-012", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    },

    "c3_earth_forest_neutral_5": {
        element: "earth", supports: ["forest", "neutral"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand" },
            { id: "S1-CR-EAR-003", rarity: "legendary" },
            { id: "S1-CR-EAR-004", rarity: "epic"      },
            { id: "S1-CR-EAR-005", rarity: "epic"      },
            { id: "S1-CR-EAR-009", rarity: "rare"      },
            { id: "S1-CR-EAR-010", rarity: "rare"      },
            { id: "S1-CR-EAR-012", rarity: "normal"    },
            { id: "S1-CR-EAR-015", rarity: "normal"    },
            { id: "S1-CR-EAR-016", rarity: "normal"    },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary" },
            { id: "S1-CR-FOR-004", rarity: "epic"      },
            { id: "S1-CR-FOR-008", rarity: "rare"      },
            { id: "S1-CR-FOR-009", rarity: "rare"      },
            { id: "S1-CR-FOR-013", rarity: "normal"    },
            { id: "S1-CR-FOR-015", rarity: "normal"    },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-003", rarity: "legendary" },
            { id: "S1-CR-NEU-004", rarity: "epic"      },
            { id: "S1-CR-NEU-007", rarity: "rare"      },
            { id: "S1-CR-NEU-008", rarity: "rare"      },
            { id: "S1-CR-NEU-011", rarity: "normal"    },
            { id: "S1-CR-NEU-013", rarity: "normal"    },
        ]
    }

};

// ============================================================
//  CouncilAI — Constrói decks de 40 cartas para a Campanha 3
//
//  Distribuição: 16 principal / 12 sup1 / 12 sup2
//  Regras de raridade:
//    Principal: 1×king_hand + 1×legendary + 2×epic + raras/normais
//    Sup1:      1×legendary + 1×epic + raras/normais
//    Sup2:      1×legendary + 1×epic + raras/normais
//    Boss:      +1 Rei (ancient -001) do elemento antes de tudo
// ============================================================

const CouncilAI = {

    ELEMENT_POOLS: {
        fire:   [
            "c3_fire_water_forest_1","c3_fire_water_forest_2","c3_fire_water_forest_3",
            "c3_fire_water_forest_4","c3_fire_water_forest_5",
            "c3_fire_water_neutral_1","c3_fire_water_neutral_2","c3_fire_water_neutral_3",
            "c3_fire_water_neutral_4","c3_fire_water_neutral_5"
        ],
        water:  [
            "c3_water_fire_earth_1","c3_water_fire_earth_2","c3_water_fire_earth_3",
            "c3_water_fire_earth_4","c3_water_fire_earth_5",
            "c3_water_fire_neutral_1","c3_water_fire_neutral_2","c3_water_fire_neutral_3",
            "c3_water_fire_neutral_4","c3_water_fire_neutral_5"
        ],
        forest: [
            "c3_forest_earth_fire_1","c3_forest_earth_fire_2","c3_forest_earth_fire_3",
            "c3_forest_earth_fire_4","c3_forest_earth_fire_5",
            "c3_forest_earth_neutral_1","c3_forest_earth_neutral_2","c3_forest_earth_neutral_3",
            "c3_forest_earth_neutral_4","c3_forest_earth_neutral_5"
        ],
        earth:  [
            "c3_earth_forest_water_1","c3_earth_forest_water_2","c3_earth_forest_water_3",
            "c3_earth_forest_water_4","c3_earth_forest_water_5",
            "c3_earth_forest_neutral_1","c3_earth_forest_neutral_2","c3_earth_forest_neutral_3",
            "c3_earth_forest_neutral_4","c3_earth_forest_neutral_5"
        ]
    },

    // IDs dos Reis (ancient -001) por elemento — usados pelo Boss
    KING_IDS: {
        fire:   "S1-CR-FIR-001",   // Ignivar, Rei da Coroa Flamejante
        water:  "S1-CR-WAT-001",   // Thalassor, Rei das Marés Eternas
        forest: "S1-CR-FOR-001",   // Sylpharis, Rainha da Raiz Ancestral
        earth:  "S1-CR-EAR-001",   // Grondar, Rei da Coroa Rochosa
        neutral:"S1-CR-NEU-001"    // Azhakar, O Dragão Exilado
    },

    _shuffle(arr) {
        return [...arr].sort(() => 0.5 - Math.random());
    },

    _pickPool(element) {
        const keys = this.ELEMENT_POOLS[element];
        if (!keys || keys.length === 0) return null;
        const key = keys[Math.floor(Math.random() * keys.length)];
        return COUNCIL_DECK_POOLS[key] || null;
    },

    // Preenche cartas de uma seção respeitando cotas de raridade
    _fillSection(sourcePool, targetDeck, limit, copyCount, rarityGlobal, mustInclude = []) {
        const pool = [
            ...mustInclude,
            ...this._shuffle(sourcePool.filter(c => !mustInclude.some(m => m.id === c.id)))
        ];

        let count = 0;
        for (const entry of pool) {
            if (count >= limit) break;

            const rar = (entry.rarity || "").toLowerCase();

            // Controle de cotas de raridade
            if (rar === "king_hand" && rarityGlobal.king_hand >= 1) continue;
            if (rar === "legendary" && rarityGlobal.legendary >= 2) continue;
            if (rar === "epic"      && rarityGlobal.epic      >= 2) continue;
            if (rar === "ancient"   && rarityGlobal.ancient   >= 1) continue;

            // Limite de cópias por carta
            const copyLimit = (rar === "epic" || rar === "legendary" ||
                               rar === "king_hand" || rar === "ancient") ? 1 : 3;
            copyCount[entry.id] = copyCount[entry.id] || 0;
            if (copyCount[entry.id] >= copyLimit) continue;

            targetDeck.push(entry.id);
            copyCount[entry.id]++;
            count++;

            if (rar === "king_hand") rarityGlobal.king_hand++;
            if (rar === "legendary") rarityGlobal.legendary++;
            if (rar === "epic")      rarityGlobal.epic++;
            if (rar === "ancient")   rarityGlobal.ancient++;
        }
    },

    // --------------------------------------------------------
    //  buildDeck(enemy) — gera 40 cartas para os inimigos
    //  Se enemy.isBoss = true, insere o Rei antes de tudo
    // --------------------------------------------------------
    buildDeck(enemy) {
        if (!enemy || !enemy.dynamicDeck) return enemy ? (enemy.deck || []) : [];

        const pool = this._pickPool(enemy.element);
        if (!pool) return [];

        const deckIds      = [];
        const copyCount    = {};
        const rarityGlobal = { king_hand: 0, legendary: 0, epic: 0, ancient: 0 };

        // Boss: começa com o Rei do elemento sorteado
        if (enemy.isBoss) {
            const kingId = this.KING_IDS[enemy.element];
            if (kingId) {
                deckIds.push(kingId);
                copyCount[kingId] = 1;
                rarityGlobal.ancient = 1;
            }
        }

        // Principal (16): king_hand obrigatória + legendary + 2×epic
        const mainRequired = pool.mainPool.filter(c =>
            c.rarity === "king_hand" || c.rarity === "epic"
        );
        this._fillSection(pool.mainPool, deckIds, 16, copyCount, rarityGlobal, mainRequired);

        // Sup1 (12): legendary + epic obrigatórias
        const sup1Required = pool.sup1Pool.filter(c =>
            c.rarity === "legendary" || c.rarity === "epic"
        );
        this._fillSection(pool.sup1Pool, deckIds, 12, copyCount, rarityGlobal, sup1Required);

        // Sup2 (12): legendary + epic obrigatórias
        const sup2Required = pool.sup2Pool.filter(c =>
            c.rarity === "legendary" || c.rarity === "epic"
        );
        this._fillSection(pool.sup2Pool, deckIds, 12, copyCount, rarityGlobal, sup2Required);

        return deckIds;
    }
};

// ============================================================
//  ENEMIES — Campanha 3 (Conselho da Coroa)
//  14 inimigos | ordem: 5 Líderes → 8 Generais → 1 Boss
// ============================================================

const ENEMIES_CAMPAIGN3 = [

    // ──────────────────────────────────────────────────────
    //  LÍDERES REVISITADOS (1–5) | aiLevel: 4
    //  Mesmos elementos da campanha 1 porém com decks de 40
    // ──────────────────────────────────────────────────────

    {
        id: "hand_fire",
        name: "Líder Valtherion",
        element: "fire",
        campaign: "campaign_3",
        rank: "hand_leader",
        aiLevel: 4,
        dynamicDeck: true,
        deck: [],
        rewardXP:   800,
        rewardGold: 20500
    },
    {
        id: "hand_water",
        name: "Líder Nerith",
        element: "water",
        campaign: "campaign_3",
        rank: "hand_leader",
        aiLevel: 4,
        dynamicDeck: true,
        deck: [],
        rewardXP:   900,
        rewardGold: 22000
    },
    {
        id: "hand_forest",
        name: "Líder Kaelthorn",
        element: "forest",
        campaign: "campaign_3",
        rank: "hand_leader",
        aiLevel: 4,
        dynamicDeck: true,
        deck: [],
        rewardXP:   1000,
        rewardGold: 25500
    },
    {
        id: "hand_earth",
        name: "Líder Durmak",
        element: "earth",
        campaign: "campaign_3",
        rank: "hand_leader",
        aiLevel: 4,
        dynamicDeck: true,
        deck: [],
        rewardXP:   28100,
        rewardGold: 6000
    },
    {
        id: "hand_neutral",
        name: "Líder Zeraphion",
        element: "neutral",
        campaign: "campaign_3",
        rank: "hand_leader",
        aiLevel: 4,
        dynamicDeck: true,
        randomElement: true,   // sorteia fogo/água/floresta/terra a cada batalha
        deck: [],
        rewardXP:   35000,
        rewardGold: 6500
    },

    // ──────────────────────────────────────────────────────
    //  GENERAIS REVISITADOS (6–13) | aiLevel: 5
    // ──────────────────────────────────────────────────────

    {
        id: "hand_general_fire",
        name: "General Drakarion",
        element: "fire",
        campaign: "campaign_3",
        rank: "hand_general",
        aiLevel: 5,
        dynamicDeck: true,
        deck: [],
        rewardXP:   1400,
        rewardGold: 40500
    },
    {
        id: "hand_general_water",
        name: "General Marilis",
        element: "water",
        campaign: "campaign_3",
        rank: "hand_general",
        aiLevel: 5,
        dynamicDeck: true,
        deck: [],
        rewardXP:   1600,
        rewardGold: 45000
    },
    {
        id: "hand_general_forest",
        name: "General Faelar",
        element: "forest",
        campaign: "campaign_3",
        rank: "hand_general",
        aiLevel: 5,
        dynamicDeck: true,
        deck: [],
        rewardXP:   1800,
        rewardGold: 50000
    },
    {
        id: "hand_general_earth",
        name: "General Brumgar",
        element: "earth",
        campaign: "campaign_3",
        rank: "hand_general",
        aiLevel: 5,
        dynamicDeck: true,
        deck: [],
        rewardXP:   2000,
        rewardGold: 60000
    },
    {
        id: "hand_general_fire_2",
        name: "General Azrakar",
        element: "fire",
        campaign: "campaign_3",
        rank: "hand_general",
        aiLevel: 5,
        dynamicDeck: true,
        deck: [],
        rewardXP:   2200,
        rewardGold: 65000
    },
    {
        id: "hand_general_water_2",
        name: "General Kaoryn",
        element: "water",
        campaign: "campaign_3",
        rank: "hand_general",
        aiLevel: 5,
        dynamicDeck: true,
        deck: [],
        rewardXP:   2400,
        rewardGold: 70000
    },
    {
        id: "hand_general_forest_2",
        name: "General Vorag",
        element: "forest",
        campaign: "campaign_3",
        rank: "hand_general",
        aiLevel: 5,
        dynamicDeck: true,
        deck: [],
        rewardXP:   3000,
        rewardGold: 75000
    },
    {
        id: "hand_general_earth_2",
        name: "General Thargrim",
        element: "earth",
        campaign: "campaign_3",
        rank: "hand_general",
        aiLevel: 5,
        dynamicDeck: true,
        deck: [],
        rewardXP:   3800,
        rewardGold: 80000
    },

    // ──────────────────────────────────────────────────────
    //  BOSS — REI ALEATÓRIO ★ | aiLevel: 5
    //  Elemento sorteado a cada batalha
    //  Deck inclui obrigatoriamente o Rei do elemento sorteado
    //  1ª vitória libera Campanha 4 — Tronos Ancestrais
    // ──────────────────────────────────────────────────────
    {
        id: "hand_neutral",
        name: "O Rei Desconhecido",
        element: "fire",           // padrão; sobrescrito a cada batalha
        campaign: "campaign_3",
        rank: "hand_boss",
        aiLevel: 5,
        dynamicDeck: true,
        isBoss: true,
        randomElement: true,       // sorteia fire/water/forest/earth antes de buildDeck
        deck: [],
        rewardXP:   5000,
        rewardGold: 100000,
        unlocksCampaign: "campaign_4"
    }

];

// ============================================================
//  Registro no array global ENEMIES
// ============================================================
if (typeof ENEMIES !== "undefined") {
    ENEMIES.push(...ENEMIES_CAMPAIGN3);
}

// ============================================================
//  campaigns.js — substitua campaign_3.enemies por:
//
//  enemies: [
//      "hand_fire",
//      "hand_water",
//      "hand_forest",
//      "hand_earth",
//      "hand_neutral",          ← líder neutro (5º)
//      "hand_general_fire",
//      "hand_general_water",
//      "hand_general_forest",
//      "hand_general_earth",
//      "hand_general_fire_2",
//      "hand_general_water_2",
//      "hand_general_forest_2",
//      "hand_general_earth_2",
//      "hand_neutral"           ← boss rei (14º)
//  ]
//
// ============================================================

// ============================================================
//  game.js — adicione campanha 3 no bloco de dynamicDeck:
//
//  if (enemyData.campaign === 'campaign_3' && typeof CouncilAI !== 'undefined') {
//      if (enemyData.randomElement) {
//          const els = ['fire','water','forest','earth'];
//          enemyData.element = els[Math.floor(Math.random() * els.length)];
//      }
//      enemyDeckIds = CouncilAI.buildDeck(enemyData);
//  }
//
// ============================================================

// ============================================================
//  campaignSystem.js — adicione campanha 3 no prepareBattle():
//
//  else if (enemy.campaign === "campaign_3") {
//      if (enemy.randomElement) {
//          const els = ["fire", "water", "forest", "earth"];
//          enemy.element = els[Math.floor(Math.random() * els.length)];
//      }
//      if (typeof CouncilAI !== "undefined") {
//          enemy.deck = CouncilAI.buildDeck(enemy);
//      }
//  }
//
// ============================================================

window.COUNCIL_DECK_POOLS  = COUNCIL_DECK_POOLS;
window.CouncilAI           = CouncilAI;
window.ENEMIES_CAMPAIGN3   = ENEMIES_CAMPAIGN3;
