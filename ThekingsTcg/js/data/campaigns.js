const CAMPAIGNS = [

{
    id: "campaign_1",
    name: "Provação Inicial",
    deckSize: 20,
    enemies: [
        "leader_fire",
        "leader_water",
        "leader_forest",
        "leader_earth",
        "leader_neutral"
    ]
},

{
    id: "campaign_2",
    name: "Guerras Elementais",
    deckSize: 30,
    enemies: [
        "general_fire",        // General 1 — Fogo       | aiLevel 3
        "general_water",       // General 2 — Água       | aiLevel 3
        "general_forest",      // General 3 — Floresta   | aiLevel 3
        "general_earth",       // General 4 — Terra      | aiLevel 3
        "general_fire_2",      // General 5 — Fogo II    | aiLevel 4
        "general_water_2",     // General 6 — Água II    | aiLevel 4
        "general_forest_2",    // General 7 — Floresta II| aiLevel 4
        "general_neutral"      // General 8 — Neutro ★   | aiLevel 4 | libera camp.3
    ]
},

{
    id: "campaign_3",
    name: "Conselho da Coroa",
    deckSize: 40,
    enemies: [
        "hand_fire",             // Líder 1  — Fogo       | aiLevel 4
        "hand_water",            // Líder 2  — Água       | aiLevel 4
        "hand_forest",           // Líder 3  — Floresta   | aiLevel 4
        "hand_earth",            // Líder 4  — Terra      | aiLevel 4
        "hand_neutral",          // Líder 5  — Neutro     | aiLevel 4
        "hand_general_fire",     // General 6  — Fogo     | aiLevel 5
        "hand_general_water",    // General 7  — Água     | aiLevel 5
        "hand_general_forest",   // General 8  — Floresta | aiLevel 5
        "hand_general_earth",    // General 9  — Terra    | aiLevel 5
        "hand_general_fire_2",   // General 10 — Fogo II  | aiLevel 5
        "hand_general_water_2",  // General 11 — Água II  | aiLevel 5
        "hand_general_forest_2", // General 12 — Flor. II | aiLevel 5
        "hand_general_earth_2",  // General 13 — Terra II | aiLevel 5
        "hand_boss"              // Boss 14 — Rei Aleatório★| aiLevel 5 | libera camp.4
    ]
},

{
    id: "campaign_4",
    name: "Tronos Ancestrais",
    deckSize: 50,
    enemies: [
        "king_fire",
        "king_water",
        "king_forest",
        "king_earth",
        "king_neutral"
    ]
}

];
