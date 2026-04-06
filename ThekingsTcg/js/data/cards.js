const RAR = {
  NORMAL: 'normal',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  ANCIENT: 'ancient'
};
const ELS = { FIRE: 'fire', WATER: 'water', FOREST: 'forest', EARTH: 'earth', NEUTRAL: 'neutral' };
const ICS = { fire:'🔥', water:'💧', forest:'🌲', earth:'🪨', neutral:'⭐' };
const COLS = { 
  fire: 'var(--fire)', 
  water: 'var(--water)', 
  forest: 'var(--forest)', 
  earth: 'var(--earth)', 
  neutral: 'var(--neutral)' 
};

/*
  CARDS MASTER LIST
  Junta todas as cartas carregadas no jogo
*/

const CARDS = [

  ...CARDS_S1_FIRE,
  ...CARDS_S1_WATER,
  ...CARDS_S1_FOREST,
  ...CARDS_S1_EARTH,
  ...CARDS_S1_NEUTRAL

].map(c => ({

  ...c,

  // compatibilidade sistema antigo
  el: c.element,
  nome: c.name,
  i: c.img,

  // padronização de raridade
  rar: c.rarity?.toLowerCase()

}));

// índice rápido de cartas (melhora performance)
const CARD_INDEX = {};

CARDS.forEach(card => {
  CARD_INDEX[card.id] = card;
});

const MENU_CARD_ARTS = [
  "https://picsum.photos/seed/card1/300/450",
  "https://picsum.photos/seed/card2/300/450",
  "https://picsum.photos/seed/card3/300/450",
  "https://picsum.photos/seed/card4/300/450"
];