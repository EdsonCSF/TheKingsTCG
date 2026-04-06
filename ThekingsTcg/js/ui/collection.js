/**
 * Controlador Principal (Bridge/Ponte)
 * Este arquivo coordena a abertura de telas e garante que as Views recebam os dados corretos.
 */

const Col = {
  mode: 'cards', 
  currentDeckIndex: 0,
  selectedDeck: null,
  filterElement: 'all', 

  // --- NAVEGAÇÃO: ABRE A COLEÇÃO GERAL ---
    // --- NAVEGAÇÃO: ABRE A COLEÇÃO GERAL ---
  openCollection() {
    this.mode = 'cards';

    // Garante que as ferramentas de DECK sumam
    document.getElementById('deck-toolbar').classList.add('hidden');
    document.getElementById('deck-actions').classList.add('hidden');
    document.getElementById('deck-tab').classList.add('hidden');
    
    // Garante que as abas e a grade de cartas apareçam
    document.getElementById('collection-tabs').classList.remove('hidden');
    document.getElementById('collection-tab').classList.remove('hidden');

    this.renderCollection(); // Chama a visualização das cartas
  },

  // --- NAVEGAÇÃO: ABRE O EDITOR DE DECKS ---
  openDeckEditor() {
    this.mode = 'decks';

    // Mostra as barras de ferramentas de deck e oculta as de coleção simples
    document.getElementById('deck-toolbar').classList.remove('hidden');
    document.getElementById('deck-actions').classList.remove('hidden'); // IMPORTANTE: Ativa botões Auto/Save
    document.getElementById('collection-tabs').classList.add('hidden');
    document.getElementById('collection-tab').classList.add('hidden');
    document.getElementById('deck-tab').classList.remove('hidden');

    // Sincroniza o deck selecionado antes de renderizar
    if (!this.selectedDeck && S.decks.length > 0) {
        this.selectedDeck = S.decks[this.currentDeckIndex];
    }

    this.renderDeckButtons();
    this.renderDecks();
  },

  // Atalho para as abas
  tab(tabName) {
    if(tabName === 'collection') this.openCollection();
    if(tabName === 'decks') this.openDeckEditor();
  },

  // --- LÓGICA DE FILTROS (CHAMADA PELOS BOTÕES DE ELEMENTO) ---
  setFilter(el) {
    this.filterElement = el;
    
    // Atualiza o visual dos botões de filtro (borda dourada no selecionado)
    if (typeof CollectionView !== 'undefined' && CollectionView.updateFilterVisuals) {
        CollectionView.updateFilterVisuals(el);
    }

    // Re-renderiza a tela atual com o novo filtro aplicado
    if(this.mode === 'cards') this.renderCollection();
    if(this.mode === 'decks') this.renderDecks();
  },

  // --- PONTES DE RENDERIZAÇÃO ---

  render() { 
    if(this.mode === 'cards') this.renderCollection(); 
  },

  renderCollection() {
    // Chama a View de Coleção passando o filtro atual
    if (typeof CollectionView !== 'undefined') {
        CollectionView.render(this.filterElement);
    }
  },

  renderDeckButtons() {
    // Chama a View de Decks para desenhar a lista de botões no topo
    if (typeof DeckView !== 'undefined') {
        DeckView.renderDeckButtons(S.decks, this.currentDeckIndex);
    }
  },

  renderDecks() {
    // Chama a View de Decks para desenhar o editor completo (Cartas do Deck + Adicionar)
    if (typeof DeckView !== 'undefined') {
        DeckView.renderDeckEditor(this.selectedDeck, this.filterElement);
    }
  },

  // --- AÇÕES DE SISTEMA ---
  autoBuild() {
    // Chama a lógica pura que agora deve estar em js/systems/deck.js
    if (typeof DeckSystem !== 'undefined' && DeckSystem.autoBuild) {
        DeckSystem.autoBuild(this.selectedDeck, this.filterElement);
        this.renderDecks(); // Atualiza a tela após preencher o deck
    }
  }
};

// Objeto para compatibilidade com o menu principal e início do jogo
const DeckSelect = {
  render() {
    if (typeof DeckView !== 'undefined') {
        DeckView.renderDeckSelectList();
    }
  }
};

// Objeto para compatibilidade com a loja
const Shop = {
    render: () => {
        if (typeof ShopView !== 'undefined') ShopView.render();
    }
};

window.Col = Col;
window.DeckSelect = DeckSelect;
window.Shop = Shop;
