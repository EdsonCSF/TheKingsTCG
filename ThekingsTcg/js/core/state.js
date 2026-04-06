const S = {
  // FLAG DE PRIMEIRO LOGIN
  firstLogin: true,

  // CENTRAL DE DADOS DO JOGADOR
  player: {
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=eu",
    name: "Rei da Arena",
    level: 1,
    xp: 0,
    xpMax: 100,
    credits: 500,
    rubies: 0
  },

  // Rotação da loja diária
  shop: {
    dailyStock: [],
    lastRotation: null
  },

  // COLEÇÃO E DECKS
  // col agora contém APENAS as cartas que o jogador possui (sem padrão cheio)
  col: [],
  decks: [],
  activeDeck: null,

  // CAMPANHA
  campaign: {
    current: null,
    enemy: null,
    unlocked: ["campaign_1"],
    progress: {
      campaign_1: 0,
      campaign_2: 0,
      campaign_3: 0,
      campaign_4: 0
    }
  },

  // PLACAR DA SÉRIE (MD3)
  battleScore: {
    player: 0,
    enemy: 0,
    currentGame: 1
  },

  // BATALHA
  b: {
    t:1, hP:[], hE:[], deckP:[], deckE:[], f:[],
    sel:-1, acted:false, playedFieldIdx:-1, modeSelect: null, targetField: null
  }
};

// Helpers
function countInDeck(deck, cardId) { return deck.cards.filter(id => id === cardId).length; }
function countInCollection(cardId) { return S.col.filter(id => id === cardId).length; }
function countAvailableForDeck(cardId, deck) { return countInCollection(cardId) - countInDeck(deck, cardId); }
