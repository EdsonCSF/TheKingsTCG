// ============================================================
//  starterDeck.js — Decks Iniciais do Jogador
//  Sorteia 1 dos 9 decks e monta coleção + deck ativo
// ============================================================

const STARTER_DECKS = [
  {
    name: "Chamas e Ondas",
    cards: [
      "S1-CR-FIR-013","S1-CR-FIR-013",   // Draco Escama Rubra x2
      "S1-CR-FIR-016",                     // Draco Jovem Escarlate
      "S1-CR-FIR-019",                     // Draco Vigia Carmesim
      "S1-CR-FIR-006","S1-CR-FIR-006",    // Drakthar, Cauda Escarlate x2
      "S1-CR-FIR-011",                     // Pyron, Escudo Incandescente
      "S1-CR-FIR-009",                     // Volkris, Asa Ardente
      "S1-CR-WAT-014","S1-CR-WAT-014",    // Acólita da Concha Sagrada x2
      "S1-CR-WAT-012",                     // Escudeiro Coralino
      "S1-CR-WAT-009",                     // Naerys, Guardiã Coral
      "S1-CR-WAT-011","S1-CR-WAT-011",    // Soldado das Marés x2
      "S1-CR-FOR-013",                     // Aprendiz da Folha Sagrada
      "S1-CR-FOR-016",                     // Batedor das Sombras Verdes
      "S1-CR-FOR-006",                     // Eldrin, Arqueiro das Copas
      "S1-CR-FOR-015",                     // Guardião da Árvore Antiga
      "S1-CR-FOR-012",                     // Lobo da Clareira
      "S1-CR-FOR-007",                     // Thorgal, Caçador da Mata Profunda
    ]
  },
  {
    name: "Maré Profunda",
    cards: [
      "S1-CR-WAT-014","S1-CR-WAT-014",    // Acólita da Concha Sagrada x2
      "S1-CR-WAT-013",                     // Batedor das Ondas
      "S1-CR-WAT-016",                     // Guardiões da Maré Baixa
      "S1-CR-WAT-008",                     // Morvath, Vigia das Profundezas
      "S1-CR-WAT-007",                     // Serelis, Lâmina da Maré
      "S1-CR-WAT-011",                     // Soldado das Marés
      "S1-CR-WAT-010",                     // Thomar, Rocha Submersa
      "S1-CR-FOR-010","S1-CR-FOR-010",    // Mythara, Guardiã da Seiva x2
      "S1-CR-FOR-009",                     // Ravok, Uivo das Sombras
      "S1-CR-FOR-008",                     // Selene, Protetora do Bosque
      "S1-CR-FOR-011",                     // Sentinela da Raiz Viva
      "S1-CR-FOR-007",                     // Thorgal, Caçador da Mata Profunda
      "S1-CR-EAR-006","S1-CR-EAR-006",    // Borin, Guerreiro da Forja x2
      "S1-CR-EAR-014",                     // Guardião Basáltico
      "S1-CR-EAR-007",                     // Mekthor, Rocha Viva
      "S1-CR-EAR-016","S1-CR-EAR-016",    // Sentinela de Argila x2
    ]
  },
  {
    name: "Raízes e Pedras",
    cards: [
      "S1-CR-FOR-016",                     // Batedor das Sombras Verdes
      "S1-CR-FOR-006",                     // Eldrin, Arqueiro das Copas
      "S1-CR-FOR-015","S1-CR-FOR-015",    // Guardião da Árvore Antiga x2
      "S1-CR-FOR-012","S1-CR-FOR-012",    // Lobo da Clareira x2
      "S1-CR-FOR-011",                     // Sentinela da Raiz Viva
      "S1-CR-FOR-014",                     // Uivador Noturno
      "S1-CR-EAR-015",                     // Aprendiz da Forja Antiga
      "S1-CR-EAR-006",                     // Borin, Guerreiro da Forja
      "S1-CR-EAR-008",                     // Durgan, Escavador Profundo
      "S1-CR-EAR-009",                     // Krag, Fragmento Titânico
      "S1-CR-EAR-010","S1-CR-EAR-010",    // Thorin, Martelo Pesado x2
      "S1-CR-WAT-013",                     // Batedor das Ondas
      "S1-CR-WAT-008",                     // Morvath, Vigia das Profundezas
      "S1-CR-WAT-007",                     // Serelis, Lâmina da Maré
      "S1-CR-WAT-011","S1-CR-WAT-011",    // Soldado das Marés x2
      "S1-CR-WAT-015",                     // Vigia da Espuma
    ]
  },
  {
    name: "Forja e Chama",
    cards: [
      "S1-CR-EAR-015",                     // Aprendiz da Forja Antiga
      "S1-CR-EAR-008",                     // Durgan, Escavador Profundo
      "S1-CR-EAR-009","S1-CR-EAR-009",    // Krag, Fragmento Titânico x2
      "S1-CR-EAR-007",                     // Mekthor, Rocha Viva
      "S1-CR-EAR-013",                     // Mineiro das Profundezas
      "S1-CR-EAR-016","S1-CR-EAR-016",    // Sentinela de Argila x2
      "S1-CR-FIR-007","S1-CR-FIR-007",    // Atsur, Demônio da Fenda x2
      "S1-CR-FIR-016",                     // Draco Jovem Escarlate
      "S1-CR-FIR-015",                     // Guardião da Lava
      "S1-CR-FIR-010",                     // Ignor, O Impetuoso
      "S1-CR-FIR-011",                     // Pyron, Escudo Incandescente
      "S1-CR-FOR-013",                     // Aprendiz da Folha Sagrada
      "S1-CR-FOR-008","S1-CR-FOR-008",    // Selene, Protetora do Bosque x2
      "S1-CR-FOR-011",                     // Sentinela da Raiz Viva
      "S1-CR-FOR-014","S1-CR-FOR-014",    // Uivador Noturno x2
    ]
  },
  {
    name: "Espuma e Brasas",
    cards: [
      "S1-CR-WAT-012","S1-CR-WAT-012",    // Escudeiro Coralino x2
      "S1-CR-WAT-016",                     // Guardiões da Maré Baixa
      "S1-CR-WAT-009",                     // Naerys, Guardiã Coral
      "S1-CR-WAT-011",                     // Soldado das Marés
      "S1-CR-WAT-015","S1-CR-WAT-015",    // Vigia da Espuma x2
      "S1-CR-WAT-007",                     // Serelis, Lâmina da Maré
      "S1-CR-FIR-018",                     // Batedor Incendiário
      "S1-CR-FIR-017",                     // Cultista da Chama Viva
      "S1-CR-FIR-013",                     // Draco Escama Rubra
      "S1-CR-FIR-019",                     // Draco Vigia Carmesim
      "S1-CR-FIR-006",                     // Drakthar, Cauda Escarlate
      "S1-CR-FIR-012",                     // Dravenyx, Fúria Rubra
      "S1-CR-FOR-013",                     // Aprendiz da Folha Sagrada
      "S1-CR-FOR-008","S1-CR-FOR-008",    // Selene, Protetora do Bosque x2
      "S1-CR-FOR-011",                     // Sentinela da Raiz Viva
      "S1-CR-FOR-014","S1-CR-FOR-014",    // Uivador Noturno x2
    ]
  },
  {
    name: "Fogo e Corais",
    cards: [
      "S1-CR-FIR-007",                     // Atsur, Demônio da Fenda
      "S1-CR-FIR-018",                     // Batedor Incendiário
      "S1-CR-FIR-013",                     // Draco Escama Rubra
      "S1-CR-FIR-016",                     // Draco Jovem Escarlate
      "S1-CR-FIR-006",                     // Drakthar, Cauda Escarlate
      "S1-CR-FIR-010","S1-CR-FIR-010",    // Ignor, O Impetuoso x2
      "S1-CR-FIR-014",                     // Imp das Brasas
      "S1-CR-WAT-014",                     // Acólita da Concha Sagrada
      "S1-CR-WAT-013",                     // Batedor das Ondas
      "S1-CR-WAT-012","S1-CR-WAT-012",    // Escudeiro Coralino x2
      "S1-CR-WAT-007",                     // Serelis, Lâmina da Maré
      "S1-CR-WAT-011",                     // Soldado das Marés
      "S1-CR-FOR-013",                     // Aprendiz da Folha Sagrada
      "S1-CR-FOR-008","S1-CR-FOR-008",    // Selene, Protetora do Bosque x2
      "S1-CR-FOR-011","S1-CR-FOR-011",    // Sentinela da Raiz Viva x2
      "S1-CR-FOR-014",                     // Uivador Noturno
    ]
  },
  {
    name: "Rocha e Maré",
    cards: [
      "S1-CR-EAR-006",                     // Borin, Guerreiro da Forja
      "S1-CR-EAR-008","S1-CR-EAR-008",    // Durgan, Escavador Profundo x2
      "S1-CR-EAR-009",                     // Krag, Fragmento Titânico
      "S1-CR-EAR-007",                     // Mekthor, Rocha Viva
      "S1-CR-EAR-016","S1-CR-EAR-016",    // Sentinela de Argila x2
      "S1-CR-EAR-011",                     // Soldado da Forja
      "S1-CR-WAT-012","S1-CR-WAT-012",    // Escudeiro Coralino x2
      "S1-CR-WAT-016",                     // Guardiões da Maré Baixa
      "S1-CR-WAT-009",                     // Naerys, Guardiã Coral
      "S1-CR-WAT-011",                     // Soldado das Marés
      "S1-CR-WAT-015",                     // Vigia da Espuma
      "S1-CR-FOR-013",                     // Aprendiz da Folha Sagrada
      "S1-CR-FOR-008","S1-CR-FOR-008",    // Selene, Protetora do Bosque x2
      "S1-CR-FOR-011","S1-CR-FOR-011",    // Sentinela da Raiz Viva x2
      "S1-CR-FOR-014",                     // Uivador Noturno
    ]
  },
  {
    name: "Pedra e Chama",
    cards: [
      "S1-CR-EAR-006",                     // Borin, Guerreiro da Forja
      "S1-CR-EAR-008",                     // Durgan, Escavador Profundo
      "S1-CR-EAR-009","S1-CR-EAR-009",    // Krag, Fragmento Titânico x2
      "S1-CR-EAR-007",                     // Mekthor, Rocha Viva
      "S1-CR-EAR-016",                     // Sentinela de Argila
      "S1-CR-EAR-011","S1-CR-EAR-011",    // Soldado da Forja x2
      "S1-CR-FIR-007",                     // Atsur, Demônio da Fenda
      "S1-CR-FIR-016",                     // Draco Jovem Escarlate
      "S1-CR-FIR-019","S1-CR-FIR-019",    // Draco Vigia Carmesim x2
      "S1-CR-FIR-015",                     // Guardião da Lava
      "S1-CR-FIR-009",                     // Volkris, Asa Ardente
      "S1-CR-WAT-012",                     // Escudeiro Coralino
      "S1-CR-WAT-016","S1-CR-WAT-016",    // Guardiões da Maré Baixa x2
      "S1-CR-WAT-009",                     // Naerys, Guardiã Coral
      "S1-CR-WAT-011",                     // Soldado das Marés
      "S1-CR-WAT-015",                     // Vigia da Espuma
    ]
  },
  {
    name: "Abismo e Floresta",
    cards: [
      "S1-CR-WAT-006",                     // Daryon, Escudo das Correntes
      "S1-CR-WAT-016","S1-CR-WAT-016",    // Guardiões da Maré Baixa x2
      "S1-CR-WAT-008",                     // Morvath, Vigia das Profundezas
      "S1-CR-WAT-009","S1-CR-WAT-009",    // Naerys, Guardiã Coral x2
      "S1-CR-WAT-007",                     // Serelis, Lâmina da Maré
      "S1-CR-WAT-011",                     // Soldado das Marés
      "S1-CR-FIR-007",                     // Atsur, Demônio da Fenda
      "S1-CR-FIR-018","S1-CR-FIR-018",    // Batedor Incendiário x2
      "S1-CR-FIR-017",                     // Cultista da Chama Viva
      "S1-CR-FIR-016",                     // Draco Jovem Escarlate
      "S1-CR-FIR-015",                     // Guardião da Lava
      "S1-CR-FOR-013",                     // Aprendiz da Folha Sagrada
      "S1-CR-FOR-006",                     // Eldrin, Arqueiro das Copas
      "S1-CR-FOR-015",                     // Guardião da Árvore Antiga
      "S1-CR-FOR-009",                     // Ravok, Uivo das Sombras
      "S1-CR-FOR-011","S1-CR-FOR-011",    // Sentinela da Raiz Viva x2
    ]
  }
];

const StarterDeck = {

  /**
   * Sorteia 1 deck aleatório, monta a coleção inicial e o deck ativo.
   * Deve ser chamado APENAS no primeiro login.
   */
  giveStarterDeck() {
    const idx = Math.floor(Math.random() * STARTER_DECKS.length);
    const starter = STARTER_DECKS[idx];

    // Monta coleção: apenas as cartas do deck sorteado
    S.col = [...starter.cards];

    // Cria o deck ativo com as mesmas cartas
    const deck = {
      id: "deck_starter",
      name: starter.name,
      cards: [...starter.cards]
    };
    S.decks = [deck];
    S.activeDeck = deck.id;

    console.log(`[StarterDeck] Deck sorteado: "${starter.name}" (${starter.cards.length} cartas)`);
    return starter;
  }

};
