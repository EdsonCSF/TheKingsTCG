/**
 * View da Coleção (UI)
 * Renderiza TODAS as cartas do jogo.
 * - Cartas possuídas: visuais normais + badge com quantidade
 * - Cartas não possuídas: escurecidas + cadeado
 */

const CollectionView = {

    page: 0,
    perPage: 20,
    filteredCards: [],
    loading: false,

    render(filterElement) {

        if (typeof CARDS === 'undefined') return;

        const g = document.getElementById('col-grid');

        // Limpar grid usando pool
        while (g.firstChild) {
            CardPool.push(g.firstChild);
            g.removeChild(g.firstChild);
        }

        this.updateCounters();
        this.updateFilterVisuals(filterElement);

        // Usa TODAS as cartas do jogo (não apenas as possuídas)
        this.filteredCards = CARDS.filter(c => {
            if (!c) return false;
            if (filterElement !== 'all' && c.el !== filterElement) return false;
            return true;
        }).map(c => c.id);

        if (this.filteredCards.length === 0) {
            g.innerHTML = '<p style="text-align:center; width:100%; color:#666;">Nenhuma carta encontrada.</p>';
            return;
        }

        this.page = 0;
        this.renderNextPage();

        // Scroll infinito
        g.onscroll = () => {
            if (this.loading) return;
            const nearBottom = g.scrollTop + g.clientHeight >= g.scrollHeight - 100;
            if (nearBottom) this.renderNextPage();
        };
    },

    renderNextPage() {

        const g = document.getElementById('col-grid');
        if (!g) return;

        this.loading = true;

        const start = this.page * this.perPage;
        const end   = start + this.perPage;
        const slice = this.filteredCards.slice(start, end);

        slice.forEach(id => {

            const c = CARD_INDEX[id];
            if (!c) return;

            const owned = countInCollection(id);
            const el    = UI.cE(c);

            // ── RESET completo dos estilos antes de aplicar qualquer coisa ──
            el.style.filter     = '';
            el.style.opacity    = '';
            el.style.cursor     = '';
            el.style.boxShadow  = '';
            // Remove filhos extras (badges, cadeados) que vieram do pool
            [...el.querySelectorAll('.deck-badge, .card-lock-icon')].forEach(n => n.remove());

            if (owned > 0) {
                // ── CARTA POSSUÍDA ──────────────────────────────
                el.onclick = (e) => {
                    e.stopPropagation();
                    UI.openCardZoom(c);
                };

                const badge = document.createElement('div');
                badge.className = 'deck-badge';
                badge.style.borderColor = 'var(--gold)';
                badge.style.background  = '#222';
                badge.innerText = `x${owned}`;
                el.appendChild(badge);

            } else {
                // ── CARTA NÃO POSSUÍDA ──────────────────────────
                el.style.filter  = 'brightness(0.25) saturate(0.2)';
                el.style.opacity = '0.5';
                el.style.cursor  = 'default';

                // Ícone de cadeado
                const lock = document.createElement('div');
                lock.className = 'card-lock-icon';
                lock.style.cssText = `
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 28px;
                    pointer-events: none;
                    filter: drop-shadow(0 0 4px #000);
                    z-index: 10;
                `;
                lock.textContent = '🔒';
                el.appendChild(lock);

                el.onclick = null;
            }

            g.appendChild(el);
        });

        this.page++;
        this.loading = false;
    },

    updateCounters() {

        // Conta apenas cartas possuídas para os filtros
        const counts = { fire: 0, water: 0, forest: 0, earth: 0, neutral: 0 };

        S.col.forEach(id => {
            const c = CARD_INDEX[id];
            if (c && counts[c.el] !== undefined) counts[c.el]++;
        });

        if (document.getElementById('cnt-fire'))    document.getElementById('cnt-fire').innerText    = counts.fire;
        if (document.getElementById('cnt-water'))   document.getElementById('cnt-water').innerText   = counts.water;
        if (document.getElementById('cnt-forest'))  document.getElementById('cnt-forest').innerText  = counts.forest;
        if (document.getElementById('cnt-earth'))   document.getElementById('cnt-earth').innerText   = counts.earth;
        if (document.getElementById('cnt-neutral')) document.getElementById('cnt-neutral').innerText = counts.neutral;
    },

    updateFilterVisuals(currentFilter) {

        document.querySelectorAll('#element-filter .btn-rpg').forEach(b => {
            b.style.border    = '1px solid #555';
            b.style.boxShadow = 'none';
            b.style.opacity   = '0.7';
        });

        const activeBtn = document.getElementById(`btn-flt-${currentFilter}`);
        if (activeBtn) {
            activeBtn.style.border    = '2px solid var(--gold)';
            activeBtn.style.boxShadow = '0 0 10px var(--gold)';
            activeBtn.style.opacity   = '1';
        }
    }

};

window.CollectionView = CollectionView;
