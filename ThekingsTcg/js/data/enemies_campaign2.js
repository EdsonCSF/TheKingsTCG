// ============================================================
//  ENEMIES_CAMPAIGN2.JS
//  Campanha 2 — Guerras Elementais (Deck 30 cartas)
//
//  8 Generais com decks ALEATÓRIOS a cada partida
//  Regra de distribuição: 40% principal (12) / 30% sup1 (9) / 30% sup2 (9)
//
//  Generais 1–4 → aiLevel: 3
//  Generais 5–8 → aiLevel: 4
//
//  Regras de raridade por deck:
//    - 1× Mão do Rei do elemento principal     (king_hand)
//    - 1× Lendária do elemento principal       (legendary)
//    - 1× Lendária do suporte 1                (legendary)
//    - 2× Épicas do elemento principal         (epic)
//    - Resto: Raras e Normais até fechar 30
//    - Máx 3 cópias por Normal/Rara; 1 por Épica/Lendária/King
//
//  25 POOLS DE DECK — 5 por elemento-base + 5 com neutro como sup2
//  Combinações:
//    FOGO:    Fogo+Água+Floresta (A) | Fogo+Água+Neutro (N)
//    ÁGUA:    Água+Fogo+Terra    (A) | Água+Fogo+Neutro (N)
//    FLORESTA:Floresta+Terra+Fogo(A) | Floresta+Terra+Neutro(N)
//    TERRA:   Terra+Floresta+Água(A) | Terra+Floresta+Neutro(N)
//    NEUTRO:  Neutro+qualquer combinação (5 pools variados)
// ============================================================

// ============================================================
//  DECK POOLS — arrays fixos de cartas para sorteio
//  Cada pool contém mais cartas do que o necessário para
//  o GeneralAI.buildDeck() poder sortear variações
// ============================================================

const GENERAL_DECK_POOLS = {

    // ──────────────────────────────────────────────────────
    //  POOLS DE FOGO (base principal)
    // ──────────────────────────────────────────────────────

    // POOL F-A1 | Fogo + Água + Floresta
    "fire_water_forest_1": {
        element:  "fire",
        supports: ["water", "forest"],
        mainPool: [
            // 🔥 FOGO
            { id: "S1-CR-FIR-002", rarity: "king_hand"  },  // Mão do Rei do Fogo
            { id: "S1-CR-FIR-003", rarity: "legendary"  },  // Lendária Fogo
            { id: "S1-CR-FIR-004", rarity: "epic"       },  // Azrakar, Flagelo Carmesim
            { id: "S1-CR-FIR-005", rarity: "epic"       },  // Épica Fogo 2
            { id: "S1-CR-FIR-006", rarity: "rare"       },  // Drakthar, Cauda Escarlate
            { id: "S1-CR-FIR-007", rarity: "rare"       },  // Atsur, Demônio da Fenda
            { id: "S1-CR-FIR-008", rarity: "rare"       },  // Cyndra, Lâmina Ígnea
            { id: "S1-CR-FIR-009", rarity: "rare"       },  // Volkris, Asa Ardente
            { id: "S1-CR-FIR-010", rarity: "rare"       },  // Ignor, O Impetuoso
            { id: "S1-CR-FIR-014", rarity: "normal"     },  // Imp das Brasas
            { id: "S1-CR-FIR-015", rarity: "normal"     },  // Guardião da Lava
            { id: "S1-CR-FIR-017", rarity: "normal"     },  // Cultista da Chama Viva
            { id: "S1-CR-FIR-018", rarity: "normal"     },  // Batedores Incendiários
            { id: "S1-CR-FIR-019", rarity: "normal"     },  // Draco Vigias Carmesim
        ],
        sup1Pool: [
            // 💧 ÁGUA (suporte 1)
            { id: "S1-CR-WAT-003", rarity: "legendary"  },  // Lendária Água
            { id: "S1-CR-WAT-006", rarity: "rare"       },  // Daryon, Escudo das Correntes
            { id: "S1-CR-WAT-007", rarity: "rare"       },  // Serelis, Lâmina da Maré
            { id: "S1-CR-WAT-008", rarity: "rare"       },  // Morvath, Vigia das Profundezas
            { id: "S1-CR-WAT-009", rarity: "rare"       },  // Naerys, Guardiã Coral
            { id: "S1-CR-WAT-010", rarity: "rare"       },  // Thomar, Rocha Submersa
            { id: "S1-CR-WAT-011", rarity: "normal"     },  // Soldados das Marés
            { id: "S1-CR-WAT-013", rarity: "normal"     },  // Batedores das Ondas
            { id: "S1-CR-WAT-015", rarity: "normal"     },  // Vigias da Espuma
            { id: "S1-CR-WAT-016", rarity: "normal"     },  // Guardiões da Maré Baixa
        ],
        sup2Pool: [
            // 🌲 FLORESTA (suporte 2)
            { id: "S1-CR-FOR-006", rarity: "rare"       },  // Eldrin, Arqueiro das Copas
            { id: "S1-CR-FOR-007", rarity: "rare"       },  // Thorgal, Caçador da Mata
            { id: "S1-CR-FOR-008", rarity: "rare"       },  // Selene, Protetora do Bosque
            { id: "S1-CR-FOR-009", rarity: "rare"       },  // Ravok, Uivo das Sombras
            { id: "S1-CR-FOR-010", rarity: "rare"       },  // Mythara, Guardiã da Seiva
            { id: "S1-CR-FOR-011", rarity: "normal"     },  // Sentinelas da Raiz Viva
            { id: "S1-CR-FOR-012", rarity: "normal"     },  // Lobos da Clareira
            { id: "S1-CR-FOR-013", rarity: "normal"     },  // Aprendiz da Folha Sagrada
            { id: "S1-CR-FOR-016", rarity: "normal"     },  // Batedores das Sombras Verdes
        ]
    },

    // POOL F-A2 | Fogo + Água + Floresta (variação)
    "fire_water_forest_2": {
        element:  "fire",
        supports: ["water", "forest"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand"  },
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-004", rarity: "epic"       },
            { id: "S1-CR-FIR-005", rarity: "epic"       },
            { id: "S1-CR-FIR-006", rarity: "rare"       },
            { id: "S1-CR-FIR-007", rarity: "rare"       },
            { id: "S1-CR-FIR-010", rarity: "rare"       },
            { id: "S1-CR-FIR-011", rarity: "rare"       },  // Rara alternativa
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-016", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-007", rarity: "rare"       },
            { id: "S1-CR-WAT-009", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-014", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-FOR-007", rarity: "rare"       },
            { id: "S1-CR-FOR-008", rarity: "rare"       },
            { id: "S1-CR-FOR-010", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
            { id: "S1-CR-FOR-014", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ]
    },

    // POOL F-A3 | Fogo + Água + Floresta (variação 3)
    "fire_water_forest_3": {
        element:  "fire",
        supports: ["water", "forest"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand"  },
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-004", rarity: "epic"       },
            { id: "S1-CR-FIR-005", rarity: "epic"       },
            { id: "S1-CR-FIR-008", rarity: "rare"       },
            { id: "S1-CR-FIR-009", rarity: "rare"       },
            { id: "S1-CR-FIR-010", rarity: "rare"       },
            { id: "S1-CR-FIR-011", rarity: "rare"       },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-017", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-006", rarity: "rare"       },
            { id: "S1-CR-WAT-008", rarity: "rare"       },
            { id: "S1-CR-WAT-009", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-015", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-FOR-006", rarity: "rare"       },
            { id: "S1-CR-FOR-007", rarity: "rare"       },
            { id: "S1-CR-FOR-009", rarity: "rare"       },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ]
    },

    // POOL F-A4 | Fogo + Água + Floresta (variação 4 — agressivo)
    "fire_water_forest_4": {
        element:  "fire",
        supports: ["water", "forest"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand"  },
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-004", rarity: "epic"       },
            { id: "S1-CR-FIR-005", rarity: "epic"       },
            { id: "S1-CR-FIR-006", rarity: "rare"       },
            { id: "S1-CR-FIR-010", rarity: "rare"       },
            { id: "S1-CR-FIR-011", rarity: "rare"       },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-007", rarity: "rare"       },
            { id: "S1-CR-WAT-008", rarity: "rare"       },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-FOR-007", rarity: "rare"       },
            { id: "S1-CR-FOR-009", rarity: "rare"       },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-014", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ]
    },

    // POOL F-A5 | Fogo + Água + Floresta (variação 5 — defensivo)
    "fire_water_forest_5": {
        element:  "fire",
        supports: ["water", "forest"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand"  },
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-004", rarity: "epic"       },
            { id: "S1-CR-FIR-005", rarity: "epic"       },
            { id: "S1-CR-FIR-007", rarity: "rare"       },
            { id: "S1-CR-FIR-009", rarity: "rare"       },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-017", rarity: "normal"     },
            { id: "S1-CR-FIR-017", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-006", rarity: "rare"       },
            { id: "S1-CR-WAT-009", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
            { id: "S1-CR-WAT-014", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-FOR-008", rarity: "rare"       },
            { id: "S1-CR-FOR-010", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
        ]
    },

    // POOL F-N1..5 | Fogo + Água + Neutro (5 variações)
    "fire_water_neutral_1": {
        element:  "fire",
        supports: ["water", "neutral"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand"  },
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-004", rarity: "epic"       },
            { id: "S1-CR-FIR-005", rarity: "epic"       },
            { id: "S1-CR-FIR-006", rarity: "rare"       },
            { id: "S1-CR-FIR-008", rarity: "rare"       },
            { id: "S1-CR-FIR-010", rarity: "rare"       },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-017", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-007", rarity: "rare"       },
            { id: "S1-CR-WAT-009", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-015", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-006", rarity: "rare"       },
            { id: "S1-CR-NEU-007", rarity: "rare"       },
            { id: "S1-CR-NEU-008", rarity: "rare"       },
            { id: "S1-CR-NEU-011", rarity: "normal"     },
            { id: "S1-CR-NEU-012", rarity: "normal"     },
            { id: "S1-CR-NEU-013", rarity: "normal"     },
            { id: "S1-CR-NEU-014", rarity: "normal"     },
        ]
    },

    "fire_water_neutral_2": {
        element:  "fire",
        supports: ["water", "neutral"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand"  },
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-004", rarity: "epic"       },
            { id: "S1-CR-FIR-005", rarity: "epic"       },
            { id: "S1-CR-FIR-007", rarity: "rare"       },
            { id: "S1-CR-FIR-009", rarity: "rare"       },
            { id: "S1-CR-FIR-011", rarity: "rare"       },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-017", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-006", rarity: "rare"       },
            { id: "S1-CR-WAT-008", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-014", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-006", rarity: "rare"       },
            { id: "S1-CR-NEU-008", rarity: "rare"       },
            { id: "S1-CR-NEU-009", rarity: "rare"       },
            { id: "S1-CR-NEU-011", rarity: "normal"     },
            { id: "S1-CR-NEU-013", rarity: "normal"     },
            { id: "S1-CR-NEU-015", rarity: "normal"     },
        ]
    },

    "fire_water_neutral_3": {
        element:  "fire",
        supports: ["water", "neutral"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand"  },
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-004", rarity: "epic"       },
            { id: "S1-CR-FIR-005", rarity: "epic"       },
            { id: "S1-CR-FIR-006", rarity: "rare"       },
            { id: "S1-CR-FIR-010", rarity: "rare"       },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-007", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-015", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-007", rarity: "rare"       },
            { id: "S1-CR-NEU-009", rarity: "rare"       },
            { id: "S1-CR-NEU-011", rarity: "normal"     },
            { id: "S1-CR-NEU-012", rarity: "normal"     },
            { id: "S1-CR-NEU-014", rarity: "normal"     },
            { id: "S1-CR-NEU-016", rarity: "normal"     },
        ]
    },

    "fire_water_neutral_4": {
        element:  "fire",
        supports: ["water", "neutral"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand"  },
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-004", rarity: "epic"       },
            { id: "S1-CR-FIR-005", rarity: "epic"       },
            { id: "S1-CR-FIR-008", rarity: "rare"       },
            { id: "S1-CR-FIR-011", rarity: "rare"       },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-017", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-006", rarity: "rare"       },
            { id: "S1-CR-WAT-009", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-007", rarity: "rare"       },
            { id: "S1-CR-NEU-008", rarity: "rare"       },
            { id: "S1-CR-NEU-012", rarity: "normal"     },
            { id: "S1-CR-NEU-013", rarity: "normal"     },
            { id: "S1-CR-NEU-015", rarity: "normal"     },
        ]
    },

    "fire_water_neutral_5": {
        element:  "fire",
        supports: ["water", "neutral"],
        mainPool: [
            { id: "S1-CR-FIR-002", rarity: "king_hand"  },
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-004", rarity: "epic"       },
            { id: "S1-CR-FIR-005", rarity: "epic"       },
            { id: "S1-CR-FIR-006", rarity: "rare"       },
            { id: "S1-CR-FIR-007", rarity: "rare"       },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-008", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-014", rarity: "normal"     },
            { id: "S1-CR-WAT-015", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-006", rarity: "rare"       },
            { id: "S1-CR-NEU-009", rarity: "rare"       },
            { id: "S1-CR-NEU-011", rarity: "normal"     },
            { id: "S1-CR-NEU-014", rarity: "normal"     },
            { id: "S1-CR-NEU-016", rarity: "normal"     },
        ]
    },

    // ──────────────────────────────────────────────────────
    //  POOLS DE ÁGUA (base principal)
    // ──────────────────────────────────────────────────────

    // POOL W-A1..5 | Água + Fogo + Terra
    "water_fire_earth_1": {
        element:  "water",
        supports: ["fire", "earth"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand"  },
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-004", rarity: "epic"       },
            { id: "S1-CR-WAT-005", rarity: "epic"       },
            { id: "S1-CR-WAT-006", rarity: "rare"       },
            { id: "S1-CR-WAT-007", rarity: "rare"       },
            { id: "S1-CR-WAT-008", rarity: "rare"       },
            { id: "S1-CR-WAT-009", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-014", rarity: "normal"     },
            { id: "S1-CR-WAT-015", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-006", rarity: "rare"       },
            { id: "S1-CR-FIR-007", rarity: "rare"       },
            { id: "S1-CR-FIR-010", rarity: "rare"       },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-007", rarity: "rare"       },
            { id: "S1-CR-EAR-008", rarity: "rare"       },
            { id: "S1-CR-EAR-009", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ]
    },

    "water_fire_earth_2": {
        element:  "water",
        supports: ["fire", "earth"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand"  },
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-004", rarity: "epic"       },
            { id: "S1-CR-WAT-005", rarity: "epic"       },
            { id: "S1-CR-WAT-006", rarity: "rare"       },
            { id: "S1-CR-WAT-008", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-008", rarity: "rare"       },
            { id: "S1-CR-FIR-009", rarity: "rare"       },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-017", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-009", rarity: "rare"       },
            { id: "S1-CR-EAR-010", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ]
    },

    "water_fire_earth_3": {
        element:  "water",
        supports: ["fire", "earth"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand"  },
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-004", rarity: "epic"       },
            { id: "S1-CR-WAT-005", rarity: "epic"       },
            { id: "S1-CR-WAT-007", rarity: "rare"       },
            { id: "S1-CR-WAT-009", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-015", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-006", rarity: "rare"       },
            { id: "S1-CR-FIR-010", rarity: "rare"       },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-EAR-007", rarity: "rare"       },
            { id: "S1-CR-EAR-008", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ]
    },

    "water_fire_earth_4": {
        element:  "water",
        supports: ["fire", "earth"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand"  },
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-004", rarity: "epic"       },
            { id: "S1-CR-WAT-005", rarity: "epic"       },
            { id: "S1-CR-WAT-006", rarity: "rare"       },
            { id: "S1-CR-WAT-007", rarity: "rare"       },
            { id: "S1-CR-WAT-009", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-014", rarity: "normal"     },
            { id: "S1-CR-WAT-015", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-007", rarity: "rare"       },
            { id: "S1-CR-FIR-011", rarity: "rare"       },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-010", rarity: "rare"       },
            { id: "S1-CR-EAR-012", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ]
    },

    "water_fire_earth_5": {
        element:  "water",
        supports: ["fire", "earth"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand"  },
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-004", rarity: "epic"       },
            { id: "S1-CR-WAT-005", rarity: "epic"       },
            { id: "S1-CR-WAT-008", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-008", rarity: "rare"       },
            { id: "S1-CR-FIR-010", rarity: "rare"       },
            { id: "S1-CR-FIR-017", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-EAR-007", rarity: "rare"       },
            { id: "S1-CR-EAR-009", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ]
    },

    // POOL W-N1..5 | Água + Fogo + Neutro
    "water_fire_neutral_1": {
        element:  "water",
        supports: ["fire", "neutral"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand"  },
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-004", rarity: "epic"       },
            { id: "S1-CR-WAT-005", rarity: "epic"       },
            { id: "S1-CR-WAT-006", rarity: "rare"       },
            { id: "S1-CR-WAT-009", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-006", rarity: "rare"       },
            { id: "S1-CR-FIR-008", rarity: "rare"       },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-006", rarity: "rare"       },
            { id: "S1-CR-NEU-007", rarity: "rare"       },
            { id: "S1-CR-NEU-011", rarity: "normal"     },
            { id: "S1-CR-NEU-013", rarity: "normal"     },
            { id: "S1-CR-NEU-015", rarity: "normal"     },
        ]
    },

    "water_fire_neutral_2": {
        element:  "water",
        supports: ["fire", "neutral"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand"  },
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-004", rarity: "epic"       },
            { id: "S1-CR-WAT-005", rarity: "epic"       },
            { id: "S1-CR-WAT-007", rarity: "rare"       },
            { id: "S1-CR-WAT-008", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-014", rarity: "normal"     },
            { id: "S1-CR-WAT-015", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-007", rarity: "rare"       },
            { id: "S1-CR-FIR-010", rarity: "rare"       },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-017", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-008", rarity: "rare"       },
            { id: "S1-CR-NEU-009", rarity: "rare"       },
            { id: "S1-CR-NEU-012", rarity: "normal"     },
            { id: "S1-CR-NEU-014", rarity: "normal"     },
            { id: "S1-CR-NEU-016", rarity: "normal"     },
        ]
    },

    "water_fire_neutral_3": {
        element:  "water",
        supports: ["fire", "neutral"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand"  },
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-004", rarity: "epic"       },
            { id: "S1-CR-WAT-005", rarity: "epic"       },
            { id: "S1-CR-WAT-006", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-009", rarity: "rare"       },
            { id: "S1-CR-FIR-011", rarity: "rare"       },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-006", rarity: "rare"       },
            { id: "S1-CR-NEU-008", rarity: "rare"       },
            { id: "S1-CR-NEU-011", rarity: "normal"     },
            { id: "S1-CR-NEU-015", rarity: "normal"     },
        ]
    },

    "water_fire_neutral_4": {
        element:  "water",
        supports: ["fire", "neutral"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand"  },
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-004", rarity: "epic"       },
            { id: "S1-CR-WAT-005", rarity: "epic"       },
            { id: "S1-CR-WAT-007", rarity: "rare"       },
            { id: "S1-CR-WAT-009", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-014", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-006", rarity: "rare"       },
            { id: "S1-CR-FIR-008", rarity: "rare"       },
            { id: "S1-CR-FIR-017", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-007", rarity: "rare"       },
            { id: "S1-CR-NEU-009", rarity: "rare"       },
            { id: "S1-CR-NEU-012", rarity: "normal"     },
            { id: "S1-CR-NEU-013", rarity: "normal"     },
        ]
    },

    "water_fire_neutral_5": {
        element:  "water",
        supports: ["fire", "neutral"],
        mainPool: [
            { id: "S1-CR-WAT-002", rarity: "king_hand"  },
            { id: "S1-CR-WAT-003", rarity: "legendary"  },
            { id: "S1-CR-WAT-004", rarity: "epic"       },
            { id: "S1-CR-WAT-005", rarity: "epic"       },
            { id: "S1-CR-WAT-008", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-015", rarity: "normal"     },
            { id: "S1-CR-WAT-015", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FIR-003", rarity: "legendary"  },
            { id: "S1-CR-FIR-007", rarity: "rare"       },
            { id: "S1-CR-FIR-010", rarity: "rare"       },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-006", rarity: "rare"       },
            { id: "S1-CR-NEU-009", rarity: "rare"       },
            { id: "S1-CR-NEU-011", rarity: "normal"     },
            { id: "S1-CR-NEU-014", rarity: "normal"     },
            { id: "S1-CR-NEU-016", rarity: "normal"     },
        ]
    },

    // ──────────────────────────────────────────────────────
    //  POOLS DE FLORESTA (base principal)
    // ──────────────────────────────────────────────────────

    // POOL FOR-A1..5 | Floresta + Terra + Fogo
    "forest_earth_fire_1": {
        element:  "forest",
        supports: ["earth", "fire"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand"  },
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-004", rarity: "epic"       },
            { id: "S1-CR-FOR-005", rarity: "epic"       },
            { id: "S1-CR-FOR-006", rarity: "rare"       },
            { id: "S1-CR-FOR-007", rarity: "rare"       },
            { id: "S1-CR-FOR-008", rarity: "rare"       },
            { id: "S1-CR-FOR-009", rarity: "rare"       },
            { id: "S1-CR-FOR-010", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-007", rarity: "rare"       },
            { id: "S1-CR-EAR-008", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-FIR-006", rarity: "rare"       },
            { id: "S1-CR-FIR-008", rarity: "rare"       },
            { id: "S1-CR-FIR-010", rarity: "rare"       },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-017", rarity: "normal"     },
        ]
    },

    "forest_earth_fire_2": {
        element:  "forest",
        supports: ["earth", "fire"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand"  },
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-004", rarity: "epic"       },
            { id: "S1-CR-FOR-005", rarity: "epic"       },
            { id: "S1-CR-FOR-006", rarity: "rare"       },
            { id: "S1-CR-FOR-009", rarity: "rare"       },
            { id: "S1-CR-FOR-010", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-008", rarity: "rare"       },
            { id: "S1-CR-EAR-009", rarity: "rare"       },
            { id: "S1-CR-EAR-010", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-FIR-007", rarity: "rare"       },
            { id: "S1-CR-FIR-009", rarity: "rare"       },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ]
    },

    "forest_earth_fire_3": {
        element:  "forest",
        supports: ["earth", "fire"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand"  },
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-004", rarity: "epic"       },
            { id: "S1-CR-FOR-005", rarity: "epic"       },
            { id: "S1-CR-FOR-007", rarity: "rare"       },
            { id: "S1-CR-FOR-008", rarity: "rare"       },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-007", rarity: "rare"       },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-FIR-006", rarity: "rare"       },
            { id: "S1-CR-FIR-010", rarity: "rare"       },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-017", rarity: "normal"     },
        ]
    },

    "forest_earth_fire_4": {
        element:  "forest",
        supports: ["earth", "fire"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand"  },
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-004", rarity: "epic"       },
            { id: "S1-CR-FOR-005", rarity: "epic"       },
            { id: "S1-CR-FOR-006", rarity: "rare"       },
            { id: "S1-CR-FOR-007", rarity: "rare"       },
            { id: "S1-CR-FOR-010", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-009", rarity: "rare"       },
            { id: "S1-CR-EAR-010", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-FIR-008", rarity: "rare"       },
            { id: "S1-CR-FIR-011", rarity: "rare"       },
            { id: "S1-CR-FIR-015", rarity: "normal"     },
            { id: "S1-CR-FIR-019", rarity: "normal"     },
        ]
    },

    "forest_earth_fire_5": {
        element:  "forest",
        supports: ["earth", "fire"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand"  },
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-004", rarity: "epic"       },
            { id: "S1-CR-FOR-006", rarity: "epic"       },
            { id: "S1-CR-FOR-008", rarity: "rare"       },
            { id: "S1-CR-FOR-009", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-008", rarity: "rare"       },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-FIR-007", rarity: "rare"       },
            { id: "S1-CR-FIR-009", rarity: "rare"       },
            { id: "S1-CR-FIR-014", rarity: "normal"     },
            { id: "S1-CR-FIR-018", rarity: "normal"     },
        ]
    },

    // POOL FOR-N1..5 | Floresta + Terra + Neutro
    "forest_earth_neutral_1": {
        element:  "forest",
        supports: ["earth", "neutral"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand"  },
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-004", rarity: "epic"       },
            { id: "S1-CR-FOR-005", rarity: "epic"       },
            { id: "S1-CR-FOR-006", rarity: "rare"       },
            { id: "S1-CR-FOR-008", rarity: "rare"       },
            { id: "S1-CR-FOR-010", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-007", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-006", rarity: "rare"       },
            { id: "S1-CR-NEU-008", rarity: "rare"       },
            { id: "S1-CR-NEU-011", rarity: "normal"     },
            { id: "S1-CR-NEU-012", rarity: "normal"     },
            { id: "S1-CR-NEU-014", rarity: "normal"     },
        ]
    },

    "forest_earth_neutral_2": {
        element:  "forest",
        supports: ["earth", "neutral"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand"  },
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-004", rarity: "epic"       },
            { id: "S1-CR-FOR-006", rarity: "epic"       },
            { id: "S1-CR-FOR-007", rarity: "rare"       },
            { id: "S1-CR-FOR-009", rarity: "rare"       },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-008", rarity: "rare"       },
            { id: "S1-CR-EAR-010", rarity: "rare"       },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-007", rarity: "rare"       },
            { id: "S1-CR-NEU-009", rarity: "rare"       },
            { id: "S1-CR-NEU-013", rarity: "normal"     },
            { id: "S1-CR-NEU-015", rarity: "normal"     },
        ]
    },

    "forest_earth_neutral_3": {
        element:  "forest",
        supports: ["earth", "neutral"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand"  },
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-004", rarity: "epic"       },
            { id: "S1-CR-FOR-005", rarity: "epic"       },
            { id: "S1-CR-FOR-006", rarity: "rare"       },
            { id: "S1-CR-FOR-010", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-009", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-006", rarity: "rare"       },
            { id: "S1-CR-NEU-008", rarity: "rare"       },
            { id: "S1-CR-NEU-012", rarity: "normal"     },
            { id: "S1-CR-NEU-016", rarity: "normal"     },
        ]
    },

    "forest_earth_neutral_4": {
        element:  "forest",
        supports: ["earth", "neutral"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand"  },
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-004", rarity: "epic"       },
            { id: "S1-CR-FOR-006", rarity: "epic"       },
            { id: "S1-CR-FOR-007", rarity: "rare"       },
            { id: "S1-CR-FOR-008", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-007", rarity: "rare"       },
            { id: "S1-CR-EAR-010", rarity: "rare"       },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-007", rarity: "rare"       },
            { id: "S1-CR-NEU-009", rarity: "rare"       },
            { id: "S1-CR-NEU-011", rarity: "normal"     },
            { id: "S1-CR-NEU-013", rarity: "normal"     },
        ]
    },

    "forest_earth_neutral_5": {
        element:  "forest",
        supports: ["earth", "neutral"],
        mainPool: [
            { id: "S1-CR-FOR-002", rarity: "king_hand"  },
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-004", rarity: "epic"       },
            { id: "S1-CR-FOR-006", rarity: "epic"       },
            { id: "S1-CR-FOR-009", rarity: "rare"       },
            { id: "S1-CR-FOR-010", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-008", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-006", rarity: "rare"       },
            { id: "S1-CR-NEU-007", rarity: "rare"       },
            { id: "S1-CR-NEU-014", rarity: "normal"     },
            { id: "S1-CR-NEU-015", rarity: "normal"     },
        ]
    },

    // ──────────────────────────────────────────────────────
    //  POOLS DE TERRA (base principal)
    // ──────────────────────────────────────────────────────

    // POOL EAR-A1..5 | Terra + Floresta + Água
    "earth_forest_water_1": {
        element:  "earth",
        supports: ["forest", "water"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand"  },
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-004", rarity: "epic"       },
            { id: "S1-CR-EAR-005", rarity: "epic"       },
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-007", rarity: "rare"       },
            { id: "S1-CR-EAR-008", rarity: "rare"       },
            { id: "S1-CR-EAR-009", rarity: "rare"       },
            { id: "S1-CR-EAR-010", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-012", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-006", rarity: "rare"       },
            { id: "S1-CR-FOR-007", rarity: "rare"       },
            { id: "S1-CR-FOR-008", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-WAT-006", rarity: "rare"       },
            { id: "S1-CR-WAT-007", rarity: "rare"       },
            { id: "S1-CR-WAT-009", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ]
    },

    "earth_forest_water_2": {
        element:  "earth",
        supports: ["forest", "water"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand"  },
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-004", rarity: "epic"       },
            { id: "S1-CR-EAR-005", rarity: "epic"       },
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-009", rarity: "rare"       },
            { id: "S1-CR-EAR-010", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-009", rarity: "rare"       },
            { id: "S1-CR-FOR-010", rarity: "rare"       },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-WAT-006", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-015", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ]
    },

    "earth_forest_water_3": {
        element:  "earth",
        supports: ["forest", "water"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand"  },
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-004", rarity: "epic"       },
            { id: "S1-CR-EAR-005", rarity: "epic"       },
            { id: "S1-CR-EAR-007", rarity: "rare"       },
            { id: "S1-CR-EAR-008", rarity: "rare"       },
            { id: "S1-CR-EAR-012", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-006", rarity: "rare"       },
            { id: "S1-CR-FOR-008", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-WAT-007", rarity: "rare"       },
            { id: "S1-CR-WAT-009", rarity: "rare"       },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ]
    },

    "earth_forest_water_4": {
        element:  "earth",
        supports: ["forest", "water"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand"  },
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-004", rarity: "epic"       },
            { id: "S1-CR-EAR-005", rarity: "epic"       },
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-007", rarity: "rare"       },
            { id: "S1-CR-EAR-009", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-012", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-007", rarity: "rare"       },
            { id: "S1-CR-FOR-010", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-WAT-008", rarity: "rare"       },
            { id: "S1-CR-WAT-010", rarity: "rare"       },
            { id: "S1-CR-WAT-011", rarity: "normal"     },
            { id: "S1-CR-WAT-014", rarity: "normal"     },
        ]
    },

    "earth_forest_water_5": {
        element:  "earth",
        supports: ["forest", "water"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand"  },
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-004", rarity: "epic"       },
            { id: "S1-CR-EAR-005", rarity: "epic"       },
            { id: "S1-CR-EAR-008", rarity: "rare"       },
            { id: "S1-CR-EAR-010", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-006", rarity: "rare"       },
            { id: "S1-CR-FOR-009", rarity: "rare"       },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-WAT-006", rarity: "rare"       },
            { id: "S1-CR-WAT-008", rarity: "rare"       },
            { id: "S1-CR-WAT-013", rarity: "normal"     },
            { id: "S1-CR-WAT-016", rarity: "normal"     },
        ]
    },

    // POOL EAR-N1..5 | Terra + Floresta + Neutro
    "earth_forest_neutral_1": {
        element:  "earth",
        supports: ["forest", "neutral"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand"  },
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-004", rarity: "epic"       },
            { id: "S1-CR-EAR-005", rarity: "epic"       },
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-008", rarity: "rare"       },
            { id: "S1-CR-EAR-010", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-006", rarity: "rare"       },
            { id: "S1-CR-FOR-009", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-006", rarity: "rare"       },
            { id: "S1-CR-NEU-007", rarity: "rare"       },
            { id: "S1-CR-NEU-011", rarity: "normal"     },
            { id: "S1-CR-NEU-012", rarity: "normal"     },
            { id: "S1-CR-NEU-015", rarity: "normal"     },
        ]
    },

    "earth_forest_neutral_2": {
        element:  "earth",
        supports: ["forest", "neutral"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand"  },
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-004", rarity: "epic"       },
            { id: "S1-CR-EAR-005", rarity: "epic"       },
            { id: "S1-CR-EAR-007", rarity: "rare"       },
            { id: "S1-CR-EAR-009", rarity: "rare"       },
            { id: "S1-CR-EAR-012", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-007", rarity: "rare"       },
            { id: "S1-CR-FOR-010", rarity: "rare"       },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-008", rarity: "rare"       },
            { id: "S1-CR-NEU-009", rarity: "rare"       },
            { id: "S1-CR-NEU-013", rarity: "normal"     },
            { id: "S1-CR-NEU-014", rarity: "normal"     },
        ]
    },

    "earth_forest_neutral_3": {
        element:  "earth",
        supports: ["forest", "neutral"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand"  },
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-004", rarity: "epic"       },
            { id: "S1-CR-EAR-005", rarity: "epic"       },
            { id: "S1-CR-EAR-006", rarity: "rare"       },
            { id: "S1-CR-EAR-010", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-008", rarity: "rare"       },
            { id: "S1-CR-FOR-009", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-013", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-006", rarity: "rare"       },
            { id: "S1-CR-NEU-008", rarity: "rare"       },
            { id: "S1-CR-NEU-012", rarity: "normal"     },
            { id: "S1-CR-NEU-016", rarity: "normal"     },
        ]
    },

    "earth_forest_neutral_4": {
        element:  "earth",
        supports: ["forest", "neutral"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand"  },
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-004", rarity: "epic"       },
            { id: "S1-CR-EAR-005", rarity: "epic"       },
            { id: "S1-CR-EAR-007", rarity: "rare"       },
            { id: "S1-CR-EAR-008", rarity: "rare"       },
            { id: "S1-CR-EAR-012", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
            { id: "S1-CR-EAR-014", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-006", rarity: "rare"       },
            { id: "S1-CR-FOR-010", rarity: "rare"       },
            { id: "S1-CR-FOR-012", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-007", rarity: "rare"       },
            { id: "S1-CR-NEU-009", rarity: "rare"       },
            { id: "S1-CR-NEU-011", rarity: "normal"     },
            { id: "S1-CR-NEU-015", rarity: "normal"     },
        ]
    },

    "earth_forest_neutral_5": {
        element:  "earth",
        supports: ["forest", "neutral"],
        mainPool: [
            { id: "S1-CR-EAR-002", rarity: "king_hand"  },
            { id: "S1-CR-EAR-003", rarity: "legendary"  },
            { id: "S1-CR-EAR-004", rarity: "epic"       },
            { id: "S1-CR-EAR-005", rarity: "epic"       },
            { id: "S1-CR-EAR-009", rarity: "rare"       },
            { id: "S1-CR-EAR-010", rarity: "rare"       },
            { id: "S1-CR-EAR-011", rarity: "normal"     },
            { id: "S1-CR-EAR-012", rarity: "normal"     },
            { id: "S1-CR-EAR-016", rarity: "normal"     },
        ],
        sup1Pool: [
            { id: "S1-CR-FOR-003", rarity: "legendary"  },
            { id: "S1-CR-FOR-007", rarity: "rare"       },
            { id: "S1-CR-FOR-008", rarity: "rare"       },
            { id: "S1-CR-FOR-011", rarity: "normal"     },
            { id: "S1-CR-FOR-016", rarity: "normal"     },
        ],
        sup2Pool: [
            { id: "S1-CR-NEU-006", rarity: "rare"       },
            { id: "S1-CR-NEU-009", rarity: "rare"       },
            { id: "S1-CR-NEU-013", rarity: "normal"     },
            { id: "S1-CR-NEU-014", rarity: "normal"     },
        ]
    }

};

// ============================================================
//  GeneralAI — Constrói decks aleatórios de 30 cartas para
//  os Generais da Campanha 2
//
//  Regras de montagem (por pool sorteado):
//    - 40% principal (12 cartas): inclui 1 king_hand + 1 legendary + 2 epic + raras/normais
//    - 30% suporte 1 (9 cartas):  inclui 1 legendary + raras/normais
//    - 30% suporte 2 (9 cartas):  raras/normais
//    - Máx 3 cópias por Normal/Rara; 1 por Épica/Lendária/King
// ============================================================

const GeneralAI = {

    // Identifica pools disponíveis para cada elemento
    ELEMENT_POOLS: {
        fire:   [
            "fire_water_forest_1", "fire_water_forest_2", "fire_water_forest_3",
            "fire_water_forest_4", "fire_water_forest_5",
            "fire_water_neutral_1", "fire_water_neutral_2", "fire_water_neutral_3",
            "fire_water_neutral_4", "fire_water_neutral_5"
        ],
        water:  [
            "water_fire_earth_1", "water_fire_earth_2", "water_fire_earth_3",
            "water_fire_earth_4", "water_fire_earth_5",
            "water_fire_neutral_1", "water_fire_neutral_2", "water_fire_neutral_3",
            "water_fire_neutral_4", "water_fire_neutral_5"
        ],
        forest: [
            "forest_earth_fire_1", "forest_earth_fire_2", "forest_earth_fire_3",
            "forest_earth_fire_4", "forest_earth_fire_5",
            "forest_earth_neutral_1", "forest_earth_neutral_2", "forest_earth_neutral_3",
            "forest_earth_neutral_4", "forest_earth_neutral_5"
        ],
        earth:  [
            "earth_forest_water_1", "earth_forest_water_2", "earth_forest_water_3",
            "earth_forest_water_4", "earth_forest_water_5",
            "earth_forest_neutral_1", "earth_forest_neutral_2", "earth_forest_neutral_3",
            "earth_forest_neutral_4", "earth_forest_neutral_5"
        ]
    },

    _shuffle(arr) {
        return [...arr].sort(() => 0.5 - Math.random());
    },

    // Sorteia um pool aleatório compatível com o elemento do general
    _pickPool(element) {
        const keys = this.ELEMENT_POOLS[element];
        if (!keys || keys.length === 0) return null;
        const key = keys[Math.floor(Math.random() * keys.length)];
        return GENERAL_DECK_POOLS[key] || null;
    },

    // Preenche cartas de uma section do pool respeitando regras de raridade
    _fillSection(sourcePool, targetDeck, limit, copyCount, rarityGlobal, options = {}) {
        const { mustInclude = [] } = options;
        const pool = [...mustInclude, ...this._shuffle(sourcePool.filter(
            c => !mustInclude.some(m => m.id === c.id)
        ))];

        let count = 0;
        for (const entry of pool) {
            if (count >= limit) break;

            const rar = (entry.rarity || "").toLowerCase();

            // Controle de raridades únicas (king_hand, legendary, epic)
            if (rar === "king_hand") {
                if (rarityGlobal.king_hand >= 1) continue;
            } else if (rar === "legendary") {
                if (rarityGlobal.legendary >= 2) continue;
            } else if (rar === "epic") {
                if (rarityGlobal.epic >= 2) continue;
            }

            // Limite de cópias
            const copyLimit = (rar === "epic" || rar === "legendary" || rar === "king_hand") ? 1 : 3;
            copyCount[entry.id] = copyCount[entry.id] || 0;
            if (copyCount[entry.id] >= copyLimit) continue;

            targetDeck.push(entry.id);
            copyCount[entry.id]++;
            count++;

            if (rar === "king_hand")  rarityGlobal.king_hand++;
            if (rar === "legendary")  rarityGlobal.legendary++;
            if (rar === "epic")       rarityGlobal.epic++;
        }
    },

    // --------------------------------------------------------
    //  buildDeck(enemy) — gera array de IDs para os Generais
    //  Chamado a cada batalha (deck muda por partida)
    // --------------------------------------------------------
    buildDeck(enemy) {
        if (!enemy || !enemy.dynamicDeck) return enemy ? (enemy.deck || []) : [];

        const pool = this._pickPool(enemy.element);
        if (!pool) return [];

        const deckIds      = [];
        const copyCount    = {};
        const rarityGlobal = { king_hand: 0, legendary: 0, epic: 0 };

        // 12 cartas do elemento principal (inclui obrigatórios de raridade)
        const mainRequired = pool.mainPool.filter(c =>
            c.rarity === "king_hand" || c.rarity === "epic"
        );
        this._fillSection(pool.mainPool, deckIds, 12, copyCount, rarityGlobal, { mustInclude: mainRequired });

        // 9 cartas do suporte 1 (inclui legendary obrigatória)
        const sup1Required = pool.sup1Pool.filter(c => c.rarity === "legendary");
        this._fillSection(pool.sup1Pool, deckIds, 9, copyCount, rarityGlobal, { mustInclude: sup1Required });

        // 9 cartas do suporte 2 (livres dentro das regras)
        this._fillSection(pool.sup2Pool, deckIds, 9, copyCount, rarityGlobal);

        return deckIds;
    }

};

// ============================================================
//  ENEMIES — Campanha 2 (Guerras Elementais)
//  8 Generais | aiLevel 3 (1–4) e aiLevel 4 (5–8)
//  Todos com dynamicDeck: true → deck via GeneralAI.buildDeck()
// ============================================================

const ENEMIES_CAMPAIGN2 = [

// ------------------------------------------------------------
//  GENERAL 1 — General de Fogo  ★ aiLevel 3 ★
//  Pool: fire_water_forest_* ou fire_water_neutral_*
// ------------------------------------------------------------
{
    id: "general_fire",
    name: "Drakarion, Asa Rubra",
    element: "fire",
    campaign: "campaign_2",
    rank: "general",
    aiLevel: 3,
    dynamicDeck: true,
    deck: [],          // gerado por GeneralAI.buildDeck() a cada partida

    rewardXP:   500,   // 1ª vitória | revanche: ~150 XP
    rewardGold: 5500,  // 1ª vitória | revanche: ~900 Gold
},

// ------------------------------------------------------------
//  GENERAL 2 — General de Água  ★ aiLevel 3 ★
//  Pool: water_fire_earth_* ou water_fire_neutral_*
// ------------------------------------------------------------
{
    id: "general_water",
    name: "Marilis, Tempestade Abissal",
    element: "water",
    campaign: "campaign_2",
    rank: "general",
    aiLevel: 3,
    dynamicDeck: true,
    deck: [],

    rewardXP:   600,
    rewardGold: 6500,
},

// ------------------------------------------------------------
//  GENERAL 3 — General de Floresta  ★ aiLevel 3 ★
//  Pool: forest_earth_fire_* ou forest_earth_neutral_*
// ------------------------------------------------------------
{
    id: "general_forest",
    name: "Faelar, Lâmina Verde",
    element: "forest",
    campaign: "campaign_2",
    rank: "general",
    aiLevel: 3,
    dynamicDeck: true,
    deck: [],

    rewardXP:   700,
    rewardGold: 8000,
},

// ------------------------------------------------------------
//  GENERAL 4 — General de Terra  ★ aiLevel 3 ★
//  Pool: earth_forest_water_* ou earth_forest_neutral_*
// ------------------------------------------------------------
{
    id: "general_earth",
    name: "Brumgar, Colosso de Pedra",
    element: "earth",
    campaign: "campaign_2",
    rank: "general",
    aiLevel: 3,
    dynamicDeck: true,
    deck: [],

    rewardXP:   800,
    rewardGold: 10500,
},

// ------------------------------------------------------------
//  GENERAL 5 — General de Fogo Supremo  ★ aiLevel 4 ★
// ------------------------------------------------------------
{
    id: "general_fire_2",
    name: "Drakthazar ,o Híbrido",
    element: "fire",
    campaign: "campaign_2",
    rank: "general",
    aiLevel: 4,
    dynamicDeck: true,
    deck: [],

    rewardXP:   1000,
    rewardGold: 16500,
},

// ------------------------------------------------------------
//  GENERAL 6 — General de Água Supremo  ★ aiLevel 4 ★
// ------------------------------------------------------------
{
    id: "general_water_2",
    name: "Hydrus ,o Escudo das Mares" ,
    element: "water",
    campaign: "campaign_2",
    rank: "general",
    aiLevel: 4,
    dynamicDeck: true,
    deck: [],

    rewardXP:   1200,
    rewardGold: 20200,
},

// ------------------------------------------------------------
//  GENERAL 7 — General de Floresta Supremo  ★ aiLevel 4 ★
// ------------------------------------------------------------
{
    id: "general_forest_2",
    name: "Thalor , Sentinela do bosque" ,
    element: "forest",
    campaign: "campaign_2",
    rank: "general",
    aiLevel: 4,
    dynamicDeck: true,
    deck: [],

    rewardXP:   1400,
    rewardGold: 25000,
},

// ------------------------------------------------------------
//  GENERAL 8 — General Neutro  ★ aiLevel 4 ★ CHEFE FINAL ★
//  Sorteia elemento aleatório a cada partida
//  1ª vitória libera Campanha 3 — Conselho da Coroa
// ------------------------------------------------------------
{
    id: "general_neutral",
    name: "Os Generais",
    element: "earth",      // elemento padrão; buildDeck() sorteia pool compatível
    campaign: "campaign_2",
    rank: "general",
    aiLevel: 4,
    dynamicDeck: true,
    randomElement: true,   // flag para sortear elemento a cada partida
    deck: [],

    rewardXP:   1800,
    rewardGold: 30000,
    unlocksCampaign: "campaign_3"
}

];

// ============================================================
//  PATCH — campanha 2 aponta para ENEMIES_CAMPAIGN2
//  Adiciona os generais ao array global ENEMIES
// ============================================================

if (typeof ENEMIES !== "undefined") {
    ENEMIES.push(...ENEMIES_CAMPAIGN2);
}

// ============================================================
//  PATCH — campaigns.js: atualiza inimigos da campanha 2
//  com os 8 IDs dos generais
// ============================================================
//
//  Substitua o objeto campaign_2 em campaigns.js por:
//
//  {
//      id: "campaign_2",
//      name: "Guerras Elementais",
//      deckSize: 30,
//      enemies: [
//          "general_fire",
//          "general_water",
//          "general_forest",
//          "general_earth",
//          "general_fire_2",
//          "general_water_2",
//          "general_forest_2",
//          "general_neutral"
//      ]
//  },
//
// ============================================================

// ============================================================
//  PATCH — campaignSystem.js: integrar GeneralAI ao buildDeck
//
//  No método getCurrentEnemy() (ou onde o deck é preparado
//  antes da batalha), adicione:
//
//  const enemy = this.getCurrentEnemy();
//  if (enemy && enemy.dynamicDeck) {
//      // Generais da campanha 2
//      if (enemy.campaign === "campaign_2") {
//          if (enemy.randomElement) {
//              const els = ["fire","water","forest","earth"];
//              enemy.element = els[Math.floor(Math.random() * els.length)];
//          }
//          enemy.deck = GeneralAI.buildDeck(enemy);
//      }
//      // Líderes da campanha 1 (sistema antigo)
//      else {
//          enemy.deck = EnemyAI.buildDeck(enemy);
//      }
//  }
//
// ============================================================

window.GENERAL_DECK_POOLS   = GENERAL_DECK_POOLS;
window.GeneralAI             = GeneralAI;
window.ENEMIES_CAMPAIGN2     = ENEMIES_CAMPAIGN2;
