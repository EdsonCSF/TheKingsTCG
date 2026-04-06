const ShopSystem = {

    getBrazilDate() {
        const now = new Date();
        return new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    },

    getNextResetTime() {
        const nowBR = this.getBrazilDate();
        const next = new Date(nowBR);
        next.setHours(18, 0, 0, 0); // 18h horário de Brasília

        // Se já passou das 18h hoje, agenda para amanhã
        if (nowBR >= next) {
            next.setDate(next.getDate() + 1);
        }

        return next;
    },

    getTodayKey() {
        const nowBR = this.getBrazilDate();
        // A "chave do dia" muda às 18h, não à meia-noite.
        // Antes das 18h = chave de ontem (ainda é o período anterior)
        // A partir das 18h = chave de hoje
        const h = nowBR.getHours();
        if (h < 18) {
            // Antes das 18h: pertence ao período que começou ontem às 18h
            const yesterday = new Date(nowBR);
            yesterday.setDate(yesterday.getDate() - 1);
            return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
        }
        return `${nowBR.getFullYear()}-${String(nowBR.getMonth() + 1).padStart(2, '0')}-${String(nowBR.getDate()).padStart(2, '0')}`;
    },

    getPriceByRarity(rar) {
        const table = {
            normal: 500,
            rare: 7500,
            epic: 35250,
            legendary: 85500,
            ancient: 250000
        };
        return table[rar] || 50;
    },

    // Preço em Rubis = 1% do Gold, arredondado para cima
    getRubyPriceByRarity(rar) {
        return Math.ceil(this.getPriceByRarity(rar) / 100);
    },

    // Pacotes de Gold comprados com Rubis (rotação fixa)
    GOLD_PACKS: [
        { id: 'pack_10k',  gold: 10000,  rubies: 15,  label: '10.000 💰' },
        { id: 'pack_30k',  gold: 30000,  rubies: 45,  label: '30.000 💰' },
        { id: 'pack_50k',  gold: 50000,  rubies: 75,  label: '50.000 💰' },
        { id: 'pack_100k', gold: 100000, rubies: 150, label: '100.000 💰' }
    ],

    buyGoldPack(packId) {
        const pack = this.GOLD_PACKS.find(p => p.id === packId);
        if (!pack) return false;

        if ((S.player.rubies || 0) < pack.rubies) {
            UI.t('💎 Rubis insuficientes!');
            return false;
        }

        S.player.rubies -= pack.rubies;
        S.player.credits += pack.gold;
        UI.t(`+${pack.gold.toLocaleString('pt-BR')} Gold recebido!`);
        Save.save();
        return true;
    },

    generateDailyStock(force = false) {
        const todayKey = this.getTodayKey();

        console.log("[ShopSystem] generateDailyStock chamado", {
            force,
            todayKey,
            lastRotation: S.shop?.lastRotation,
            hasStock: S.shop?.dailyStock?.length > 0
        });

        if (!S.shop) {
            S.shop = { dailyStock: [], lastRotation: null };
        }

        if (!force && S.shop.lastRotation === todayKey && S.shop.dailyStock.length > 0) {
            console.log("[ShopSystem] Estoque já existe para esse período, ignorando");
            return;
        }

        if (typeof CARDS === 'undefined' || !CARDS.length) {
            console.error("[ShopSystem] CARDS não disponível!");
            return;
        }

        const elementVariants = [
            ['fire', 'fogo'],
            ['water', 'agua', 'água'],
            ['forest', 'floresta'],
            ['earth', 'terra', 'ground'],
            ['neutral', 'neutro']
        ];

        const stock = [];

        // Garante 1 carta aleatória de cada elemento
        elementVariants.forEach(variants => {
            const pool = CARDS.filter(c => variants.includes(c.el));
            if (pool.length > 0) {
                const pick = pool[Math.floor(Math.random() * pool.length)];
                stock.push(pick);
            }
        });

        // Completa com 3 cartas aleatórias extras (qualquer elemento)
        const remaining = [...CARDS]
            .filter(c => !stock.find(s => s.id === c.id))
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        // Salva apenas IDs
        S.shop.dailyStock = [...stock, ...remaining]
            .sort(() => 0.5 - Math.random())
            .map(c => c.id);

        S.shop.lastRotation = todayKey;

        console.log("[ShopSystem] Novo estoque gerado:", S.shop.dailyStock.length, "cartas");

        Save.save();
    },

    buyCard(cardId) {
        const card = CARD_INDEX[cardId];
        if (!card) return false;

        const owned = countInCollection(cardId);
        const rarity = card.rar;

        let limit = 3;
        if (rarity === "epic"      || rarity === "épica")    limit = 1;
        if (rarity === "legendary" || rarity === "lendária") limit = 1;
        if (rarity === "ancient"   || rarity === "anciã")    limit = 1;

        if (owned >= limit) {
            UI.t("Você já possui o máximo dessa carta");
            return false;
        }

        const price = this.getPriceByRarity(card.rar);

        if (S.player.credits < price) {
            UI.t("Sem Gold suficiente");
            return false;
        }

        S.player.credits -= price;
        S.col.push(cardId);
        UI.t("Carta adquirida!");
        Save.save();
        return true;
    },

    buyCardWithRubies(cardId) {
        const card = CARD_INDEX[cardId];
        if (!card) return false;

        const owned = countInCollection(cardId);
        const rarity = card.rar;

        let limit = 3;
        if (rarity === "epic"      || rarity === "épica")    limit = 1;
        if (rarity === "legendary" || rarity === "lendária") limit = 1;
        if (rarity === "ancient"   || rarity === "anciã")    limit = 1;

        if (owned >= limit) {
            UI.t("Você já possui o máximo dessa carta");
            return false;
        }

        const price = this.getRubyPriceByRarity(card.rar);

        if ((S.player.rubies || 0) < price) {
            UI.t("💎 Rubis insuficientes!");
            return false;
        }

        S.player.rubies -= price;
        S.col.push(cardId);
        UI.t("💎 Carta adquirida com Rubi Real!");
        Save.save();
        return true;
    }
};

window.ShopSystem = ShopSystem;
