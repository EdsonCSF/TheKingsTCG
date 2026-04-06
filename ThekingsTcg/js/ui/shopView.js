const ShopView = {

    timerInterval: null,
    filterElement: 'all',

    setFilter(el) {
        this.filterElement = el;
        this.updateFilterVisuals();
        this.render();
    },

    render() {
        if (typeof CARDS === 'undefined') {
            console.warn("[ShopView] CARDS não disponível");
            return;
        }
        
        if (!this.filterElement) this.filterElement = 'all';

        // Garante estrutura da loja
if (!S.shop) {
    S.shop = { dailyStock: [], lastRotation: null };
}

// Se a rotação atual ainda não foi gerada, gera agora.
// Isso corrige o caso de fechar o jogo e abrir depois do horário do reset.
const todayKey = ShopSystem.getTodayKey();

if (!Array.isArray(S.shop.dailyStock)) {
    S.shop.dailyStock = [];
}

if (S.shop.lastRotation !== todayKey || S.shop.dailyStock.length === 0) {
    console.log("[ShopView] Rotação vencida ou estoque vazio, gerando novo estoque...");
    ShopSystem.generateDailyStock();
}

        const g = document.getElementById('shop-grid');
        if (!g) return;

        // Se o estoque existe mas está vazio, mostra mensagem e não tenta renderizar
        if (!S.shop?.dailyStock || S.shop.dailyStock.length === 0) {
            g.innerHTML = `
                <div class="col-span-full text-center text-gray-400 p-8">
                    <span class="material-symbols-outlined text-4xl mb-2">store</span>
                    <p>Loja vazia. Aguardando nova rotação...</p>
                    <p class="text-xs mt-2 text-gray-500">Próxima rotação às 18h</p>
                </div>
            `;
            this.startTimer();
            return;
        }

        const credEl = document.getElementById('shop-cred');
        if (credEl) credEl.innerText = S.player?.credits ?? 0;

        const rubyEl = document.getElementById('shop-rubies');
        if (rubyEl) rubyEl.innerText = S.player?.rubies ?? 0;

        g.innerHTML = '';

        // PACOTES DE GOLD
        if (this.filterElement === 'all') {
            const packSection = document.createElement('div');
            packSection.className = 'col-span-full';
            packSection.style.cssText = 'padding: 8px 4px 4px; margin-bottom: 4px;';
            const _rubies = S.player.rubies || 0;
            let _packHtml = '<div style="display:inline-block; background:rgba(0,0,0,0.65); border-radius:4px; padding:4px 10px; margin-bottom:10px; font-family:Cinzel,serif; font-size:14px; font-weight:900; color:#ffffff; text-transform:uppercase; letter-spacing:0.1em;">Pacotes de Gold</div><div style="display:flex; flex-direction:column; gap:6px;">';
            ShopSystem.GOLD_PACKS.forEach(pack => {
                const canAfford = _rubies >= pack.rubies;
                _packHtml += '<div style="display:flex; align-items:center; justify-content:space-between; background:rgba(0,0,0,0.6); border:1px solid rgba(255,215,0,0.25); border-radius:6px; padding:10px 12px;">'
                    + '<div style="display:flex; align-items:center; gap:8px;"><span style="font-size:22px;">&#128176;</span>'
                    + '<div><div style="font-family:Cinzel,serif; font-size:14px; font-weight:900; color:#ffffff;">' + pack.gold.toLocaleString('pt-BR') + ' Gold</div>'
                    + '<div style="font-size:10px; color:rgba(255,255,255,0.4);">Pacote de ouro</div></div></div>'
                    + '<button onclick="ShopView.buyGoldPack(\'' + pack.id + '\')" style="display:flex; align-items:center; gap:5px; padding:6px 12px; border-radius:4px; border:1px solid ' + (canAfford ? '#fffff' : '#888') + '; background:' + (canAfford ? 'rgba(192,57,43,0.2)' : 'rgba(50,50,50,0.4)') + '; color:#ffffff; font-family:Cinzel,serif; font-size:15px; font-weight:900; cursor:' + (canAfford ? 'pointer' : 'not-allowed') + '; opacity:' + (canAfford ? '1' : '0.5') + ';">'
                    + '<img src="img/icones/rubi-real.png" style="width:30px;height:30px;object-fit:contain;"> ' + pack.rubies + '</button></div>';
            });
            _packHtml += '</div><div style="height:1px; background:linear-gradient(90deg,transparent,rgba(255,215,0,0.3),transparent); margin:14px 0 10px;"></div><div style="display:inline-block; background:rgba(0,0,0,0.65); border-radius:4px; padding:4px 10px; margin-bottom:10px; font-family:Cinzel,serif; font-size:14px; font-weight:900; color:#ffffff; text-transform:uppercase; letter-spacing:0.1em;">Cartas do Dia</div>';
            packSection.innerHTML = _packHtml;
            g.appendChild(packSection);
        }

        // FIX: dailyStock agora é um array de IDs (strings)
        let hasCards = false;
        
        S.shop.dailyStock.forEach(cardId => {
            // Suporte a saves antigos que ainda guardam objetos em vez de IDs
            const c = (typeof cardId === 'string') ? CARD_INDEX[cardId] : cardId;
            if (!c) return;

            if (this.filterElement !== 'all' && c.el !== this.filterElement) return;

            hasCards = true;
            
            const cardData = CARD_INDEX[c.id] || c;
            const owned = countInCollection(c.id);
            const price = ShopSystem.getPriceByRarity(c.rar);
            const rubyPrice = ShopSystem.getRubyPriceByRarity(c.rar);

            // Limite por raridade
            let limit = 3;
            const rarity = c.rar;
            if (rarity === "epic" || rarity === "épica") limit = 1;
            if (rarity === "legendary" || rarity === "lendária") limit = 1;
            if (rarity === "ancient" || rarity === "anciã") limit = 1;

            const isMax = owned >= limit;
            const isNew = owned === 0;
            const canAfford = S.player.credits >= price;
            const canAffordRuby = (S.player.rubies || 0) >= rubyPrice;

            // Wrapper 
            const w = document.createElement('div');
            w.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                position: relative;
            `;

            // Carta 
            const el = UI.cE(cardData);

            // Visual: MAX = escurecida, nova = brilho dourado sutil
            if (isMax) {
                el.style.filter = 'brightness(0.35) saturate(0.3)';
                el.style.opacity = '0.6';
            } else if (isNew) {
                el.style.boxShadow = '0 0 12px 2px rgba(255,215,0,0.5)';
            }

            w.onclick = () => UI.openCardZoom(cardData);

            // Badge de cópias 
            const badge = document.createElement('div');
            badge.className = 'deck-badge';
            badge.style.background = isMax ? '#222' : '#1a3a1a';
            badge.style.borderColor = isMax ? '#555' : 'var(--gold)';
            badge.style.color = isMax ? '#555' : 'var(--gold)';
            badge.innerText = `${owned}/${limit}`;
            el.appendChild(badge);

            // Etiqueta NEW para cartas que o jogador não possui 
            if (isNew) {
                const newTag = document.createElement('div');
                newTag.style.cssText = `
                    position: absolute;
                    top: 4px; left: 4px;
                    background: #d41132;
                    color: white;
                    font-size: 8px;
                    font-weight: 900;
                    padding: 2px 5px;
                    border-radius: 3px;
                    letter-spacing: 1px;
                    z-index: 10;
                    pointer-events: none;
                `;
                newTag.textContent = 'NOVO';
                el.appendChild(newTag);
            }

            // Botões de compra (Gold + Rubi) com tarja fosca única atrás
const btnWrap = document.createElement('div');
btnWrap.style.cssText = `
    display:flex;
    flex-direction:column;
    gap:4px;
    width:100%;
    margin-top:6px;
    padding:6px;
    background:rgba(10,10,14,0.72);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:10px;
    backdrop-filter:blur(4px);
    -webkit-backdrop-filter:blur(4px);
    box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.05),
        0 4px 10px rgba(0,0,0,0.28);
`;

// Base dos botões internos
const BASE_BTN = `
    width:100%;
    height:32px;
    font-size:0.82rem;
    font-weight:900;
    font-family:Cinzel,serif;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:6px;
    border-radius:7px;
    border-width:1px;
    border-style:solid;
    cursor:pointer;
    transition:all 0.15s ease;
    background:rgba(255,255,255,0.05);
    color:#ffffff;
    box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);
`;

if (isMax) {
    const btnMax = document.createElement('button');
    btnMax.style.cssText = BASE_BTN + `
        border-color:#666;
        cursor:not-allowed;
        opacity:0.55;
        background:rgba(80,80,80,0.18);
        filter:grayscale(1);
    `;
    btnMax.innerText = 'MAX';
    btnMax.disabled = true;
    btnWrap.appendChild(btnMax);
} else {
    // Estilo visual quando NÃO pode comprar
    const DISABLED_BTN = `
        border-color:rgba(150,150,150,0.35) !important;
        background:rgba(90,90,90,0.12) !important;
        color:#bdbdbd !important;
        filter:grayscale(1);
        opacity:0.72;
        cursor:not-allowed;
    `;

    const DISABLED_VALUE = `
        color:#cfcfcf;
        font-weight:900;
        text-shadow:none;
    `;

    const ENABLED_VALUE = `
        color:#ffffff;
        font-weight:900;
        text-shadow:0 1px 2px rgba(0,0,0,0.6);
    `;

    // Botão Gold
    const btnGold = document.createElement('button');
    btnGold.style.cssText = BASE_BTN + `
        border-color:rgba(255,215,0,0.55);
        ${!canAfford ? DISABLED_BTN : ''}
    `;
    btnGold.innerHTML = `
        <img src="img/icones/gold.png" style="
            width:22px;
            height:22px;
            object-fit:contain;
            display:block;
            ${!canAfford ? 'filter:grayscale(1); opacity:0.85;' : ''}
        ">
        <span style="${canAfford ? ENABLED_VALUE : DISABLED_VALUE}">
            ${price.toLocaleString('pt-BR')}
        </span>
    `;
    btnGold.onclick = (e) => { 
        e.stopPropagation(); 
        if (canAfford) {
            ShopSystem.buyCard(c.id);
            ShopView.render();
        } else {
            if (window.UI && UI.showMessage) {
                UI.showMessage('Gold insuficiente!', 'error');
            } else {
                alert('Gold insuficiente!');
            }
        }
    };

    // Linha divisória entre Gold e Rubi
    const btnDivider = document.createElement('div');
    btnDivider.style.cssText = `
        width:100%;
        height:1px;
        margin:2px 0;
        background:linear-gradient(
            to right,
            transparent,
            rgba(255,215,130,0.45),
            transparent
        );
        pointer-events:none;
        ${(!canAfford && !canAffordRuby) ? 'filter:grayscale(1); opacity:0.55;' : ''}
    `;

    // Botão Rubi
    const btnRuby = document.createElement('button');
    btnRuby.style.cssText = BASE_BTN + `
        border-color:rgba(255,68,68,0.55);
        ${!canAffordRuby ? DISABLED_BTN : ''}
    `;
    btnRuby.innerHTML = `
        <img src="img/icones/rubi-real.png" style="
            width:24px;
            height:24px;
            object-fit:contain;
            display:block;
            ${!canAffordRuby ? 'filter:grayscale(1); opacity:0.85;' : ''}
        ">
        <span style="${canAffordRuby ? ENABLED_VALUE : DISABLED_VALUE}">
            ${rubyPrice}
        </span>
    `;
    btnRuby.onclick = (e) => { 
        e.stopPropagation(); 
        if (canAffordRuby) {
            ShopSystem.buyCardWithRubies(c.id);
            ShopView.render();
        } else {
            if (window.UI && UI.showMessage) {
                UI.showMessage('Rubis insuficientes!', 'error');
            } else {
                alert('Rubis insuficientes!');
            }
        }
    };

    btnWrap.appendChild(btnGold);
    btnWrap.appendChild(btnDivider);
    btnWrap.appendChild(btnRuby);
}
            w.appendChild(el);
            w.appendChild(btnWrap);
            g.appendChild(w);
        });

        // Se não encontrou nenhuma carta com o filtro atual
        if (!hasCards && this.filterElement !== 'all') {
            g.innerHTML = `
                <div class="col-span-full text-center text-gray-400 p-8">
                    <span class="material-symbols-outlined text-4xl mb-2">filter_alt</span>
                    <p>Nenhuma carta deste elemento na loja hoje</p>
                </div>
            `;
        }

        this.startTimer();
    },

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            const next = ShopSystem.getNextResetTime();
            const now = ShopSystem.getBrazilDate();
            const diff = next - now;

            // CORREÇÃO: Verificar se a data é válida
            if (isNaN(diff)) {
                console.error("[ShopView] Data inválida, recriando timer...");
                clearInterval(this.timerInterval);
                this.startTimer();
                return;
            }

            if (diff <= 0) {
                clearInterval(this.timerInterval);
                console.log("[ShopView] Hora do reset! Gerando novo estoque...");
                ShopSystem.generateDailyStock(true); // force=true: ignora lastRotation e sempre rotaciona
                this.render();
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            const timerEl = document.getElementById('shop-reset-timer');
            if (timerEl) {
                timerEl.innerText =
                    `${hours.toString().padStart(2, '0')}:` +
                    `${minutes.toString().padStart(2, '0')}:` +
                    `${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    },

    buyGoldPack(packId) {
        const success = ShopSystem.buyGoldPack(packId);
        if (success) {
            this.render();
        } else {
            // Mensagem de aviso quando não tem rubis suficientes
            if (window.UI && UI.showMessage) {
                UI.showMessage('Rubis insuficientes para comprar este pacote!', 'error');
            } else {
                alert('Rubis insuficientes para comprar este pacote!');
            }
        }
    },

    updateFilterVisuals() {
        document.querySelectorAll('#shop-filter .btn-rpg').forEach(b => {
            b.style.border = '1px solid #555';
            b.style.boxShadow = 'none';
            b.style.opacity = '0.7';
        });

        const active = document.getElementById(`btn-shop-${this.filterElement}`);
        if (active) {
            active.style.border = '2px solid var(--gold)';
            active.style.boxShadow = '0 0 2px var(--gold)';
            active.style.opacity = '1';
        }
    }
};

window.ShopView = ShopView;