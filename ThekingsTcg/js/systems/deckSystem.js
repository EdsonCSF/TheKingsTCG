/**
 * Sistema de Lógica de Decks (Model)
 * Gerencia os dados de S.decks, validações e manipulação de arrays.
 */

// Helper: Conta quantas de uma carta específica existem na coleção
window.countInCollection = function(id) {
    if (!S.col) return 0;
    return S.col.filter(x => x === id).length;
};
const DeckSystem = {

    /**
     * Cria um novo deck com tamanho específico.
     */
    createDeck(size) {
        if (![20, 30, 40, 50].includes(size)) {
            return { success: false, message: "Tamanho inválido" };
        }

        const newDeck = {
            id: Date.now(),
            name: `Deck ${S.decks.length + 1}`,
            cards: [],
            size: size
        };

        S.decks.push(newDeck);
        Save.save();
        return { success: true, deck: newDeck, index: S.decks.length - 1 };
    },
renameDeck(index, newName) {
    if (!S.decks || !S.decks[index]) {
        return { success: false, message: "Deck não encontrado" };
    }

    const cleanName = (newName || "").trim();

    if (!cleanName) {
        return { success: false, message: "Nome inválido" };
    }

    if (cleanName.length > 24) {
        return { success: false, message: "Máximo de 24 caracteres" };
    }

    S.decks[index].name = cleanName;
    Save.save();

    return { success: true, deck: S.decks[index] };
},
    /**
     * Exclui um deck pelo índice.
     */
    deleteDeck(index) {
        if (S.decks.length <= 1) {
            return { success: false, message: "Você precisa ter pelo menos 1 deck." };
        }

        const confirmDelete = confirm("Tem certeza que deseja excluir este deck?");
        if (!confirmDelete) return { success: false, message: "Cancelado" };

        S.decks.splice(index, 1);
        Save.save();

        return { success: true, newIndex: 0 };
    },

    /**
     * Adiciona uma carta ao deck.
     */
    addCard(deck, cardId) {
        if (!deck) return false;

        const deckLimit = deck.size || 20;
       

        if (deck.cards.length >= deckLimit) {
            UI.t("Deck cheio");
            return false;
        }

        const card = CARD_INDEX[cardId];
if (!card) return false;
if (countInCollection(cardId) <= 0) {
    UI.t("Você não possui essa carta");
    return false;
}

const rarity = card.rar;

let limit = 3;

if (rarity === "épica" || rarity === "epic") limit = 1;
if (rarity === "lendária" || rarity === "legendary") limit = 1;
if (rarity === "anciã" || rarity === "ancient") limit = 1;

const inDeck = deck.cards.filter(x => x === cardId).length;

if (inDeck >= limit) {
    UI.t("Limite dessa carta no deck atingido");
    return false;
}

        deck.cards.push(cardId);
        Save.save();
        return true;
    },

    /**
     * Remove uma carta do deck.
     */
    removeCard(deck, cardId) {
        if (!deck) return false;

        const i = deck.cards.indexOf(cardId);
        if (i > -1) {
            deck.cards.splice(i, 1);
            Save.save();
            return true;
        }

        return false;
    },

    /**
     * Lógica do Auto-Build (Preenche o deck automaticamente).
     */
    autoBuild(deck, filterElement) {

    if (!deck) return;

    deck.cards = [];

    const size = deck.size || 20;

    const mainLimit = Math.floor(size * 0.4);
    const secondLimit = Math.floor(size * 0.3);
    const thirdLimit = Math.floor(size * 0.3);

    const elementPool = {};

    S.col.forEach(id => {

        const c = CARD_INDEX[id];
        if (!c) return;

        if (filterElement !== 'all' && c.el !== filterElement) return;

        if (!elementPool[c.el]) elementPool[c.el] = [];

        elementPool[c.el].push(id);

    });

    const allElements = Object.entries(elementPool)
    .filter(([el, cards]) => cards.length > 0)
    .sort(() => 0.5 - Math.random()); // embaralha tudo aleatoriamente

// Pega os 3 primeiros após o embaralhamento — todos com chance igual
const sortedElements = allElements.slice(0, 3); 
  
 const limits = [mainLimit, secondLimit, thirdLimit];

    let rarityCount = { ancient: 0, legendary: 0, epic: 0 };

    sortedElements.forEach((entry, index) => {

        const elCards = entry[1].sort(() => 0.5 - Math.random());
        const elementLimit = limits[index];

        for (let id of elCards) {

            if (deck.cards.length >= size) break;

            const c = CARD_INDEX[id];
if (!c) continue;

const rarity = c.rar;

            // limite de raridade global
            if ((rarity === "ancient" || rarity === "anciã") && rarityCount.ancient >= 2) continue;
            if ((rarity === "legendary" || rarity === "lendária") && rarityCount.legendary >= 2) continue;
            if ((rarity === "epic" || rarity === "épica") && rarityCount.epic >= 2) continue;

            // limite de cartas do mesmo elemento
if (deck.cards.filter(x => {
    const cc = CARD_INDEX[x];
    return cc && cc.el === entry[0];
}).length >= elementLimit) continue;

            // limite de cópia da carta
            let copyLimit = 3;

            if (rarity === "epic" || rarity === "épica") copyLimit = 1;
            if (rarity === "legendary" || rarity === "lendária") copyLimit = 1;
            if (rarity === "ancient" || rarity === "anciã") copyLimit = 1;

            const inDeck = deck.cards.filter(x => x === id).length;

            if (inDeck >= copyLimit) continue;

            deck.cards.push(id);

            if (rarity === "ancient" || rarity === "anciã") rarityCount.ancient++;
            if (rarity === "legendary" || rarity === "lendária") rarityCount.legendary++;
            if (rarity === "epic" || rarity === "épica") rarityCount.epic++;

        }

    });

    if (deck.cards.length < size) {
        UI.t("Cartas insuficientes para montar deck inteligente");
    } else {
        UI.t("Deck inteligente criado!");
    }

    Save.save();
},

    /**
     * Validação avançada do deck
     */
    validateDeck(deck) {

    if (!deck) return { valid: false, errors: ["Deck inexistente"] };

    const errors = [];
    const size = deck.size || 20;
    const current = deck.cards.length;

    // 1️⃣ Tamanho exato
    if (current !== size) {
        errors.push(`Deck precisa ter exatamente ${size} cartas (atual: ${current}).`);
    }

    const elementCount = {};
    const rarityCount = { epic: 0, legendary: 0, ancient: 0 };

    deck.cards.forEach(id => {

    const c = CARD_INDEX[id];
    if (!c) return;

    // Elementos
    elementCount[c.el] = (elementCount[c.el] || 0) + 1;

    // Raridades
    const rarity = c.rar;

if (rarity === "épica" || rarity === "epic") rarityCount.epic++;
if (rarity === "lendária" || rarity === "legendary") rarityCount.legendary++;
if (rarity === "anciã" || rarity === "ancient") rarityCount.ancient++;
}); // ← ESTA CHAVE FALTAVA

    // 2️⃣ Regra 40/30/30
    const sorted = Object.values(elementCount).sort((a,b)=>b-a);

    const mainLimit = Math.floor(size * 0.4);
    const secondLimit = Math.floor(size * 0.3);
    const thirdLimit = Math.floor(size * 0.3);

    if (sorted[0] && sorted[0] > mainLimit)
        errors.push(`Elemento principal excede 40% (${sorted[0]}/${mainLimit}).`);

    if (sorted[1] && sorted[1] > secondLimit)
        errors.push(`Segundo elemento excede 30% (${sorted[1]}/${secondLimit}).`);

    if (sorted[2] && sorted[2] > thirdLimit)
        errors.push(`Terceiro elemento excede 30% (${sorted[2]}/${thirdLimit}).`);

    // 3️⃣ Limites de raridade
    if (rarityCount.ancient > 2)
        errors.push(`Máximo 2 Ancient (atual: ${rarityCount.ancient}).`);

    if (rarityCount.legendary > 2)
        errors.push(`Máximo 2 Lendárias (atual: ${rarityCount.legendary}).`);

    if (rarityCount.epic > 2)
        errors.push(`Máximo 2 Épicas (atual: ${rarityCount.epic}).`);

    return {
        valid: errors.length === 0,
        errors,
        rarityCount
    };
}
};

window.DeckSystem = DeckSystem;