// ============================================================
//  ENEMIES.JS
//  Campanha 1 — Provação Inicial (Deck 20 cartas)
//  Regra: 40% elemento principal / 30% suporte 1 / 30% suporte 2
// ============================================================

const ENEMIES = [

// ------------------------------------------------------------
//  1. LÍDER DE ESQUADRÃO FOGO
//  🔥 Fogo (8) + 💧 Água (6) + 🪨 Terra (6)
//  Épicas: Azrakar x1
// ------------------------------------------------------------
{
    id: "leader_fire",
    name: "Líder de Esquadrão Fogo",
    element: "fire",
    campaign: "campaign_1",
    rank: "leader",
    aiLevel: 0,   // IA Básica

    deck: [
        // 🔥 FOGO (8)
        "S1-CR-FIR-004",   // Azrakar, Flagelo Carmesim      [Épica]  ATK:14 DEF:3
        "S1-CR-FIR-007",   // Atsur, Demônio da Fenda        [Rara]   ATK:8  DEF:15
        "S1-CR-FIR-006",   // Drakthar, Cauda Escarlate      [Rara]   ATK:13 DEF:2
        "S1-CR-FIR-017",   // Cultista da Chama Viva         [Normal] ATK:3  DEF:12
        "S1-CR-FIR-017",   // Cultista da Chama Viva         [Normal] ATK:3  DEF:12
        "S1-CR-FIR-019",   // Draco Vigias Carmesim          [Normal] ATK:8  DEF:8
        "S1-CR-FIR-019",   // Draco Vigias Carmesim          [Normal] ATK:8  DEF:8
        "S1-CR-FIR-014",   // Imp das Brasas                 [Normal] ATK:7  DEF:4

        // 💧 ÁGUA (6)
        "S1-CR-WAT-006",   // Daryon, Escudo das Correntes   [Rara]   ATK:7  DEF:10
        "S1-CR-WAT-009",   // Naerys, Guardiã Coral          [Rara]   ATK:8  DEF:13
        "S1-CR-WAT-010",   // Thomar, Rocha Submersa         [Rara]   ATK:5  DEF:13
        "S1-CR-WAT-011",   // Soldados das Marés             [Normal] ATK:6  DEF:8
        "S1-CR-WAT-016",   // Guardiões da Maré Baixa        [Normal] ATK:2  DEF:10
        "S1-CR-WAT-016",   // Guardiões da Maré Baixa        [Normal] ATK:2  DEF:10

        // 🪨 TERRA (6)
        "S1-CR-EAR-006",   // Borin, Guerreiro da Forja      [Rara]   ATK:10 DEF:12
        "S1-CR-EAR-009",   // Krag, Fragmento Titânico       [Rara]   ATK:6  DEF:16
        "S1-CR-EAR-011",   // Soldados da Forja              [Normal] ATK:7  DEF:10
        "S1-CR-EAR-014",   // Guardião Basáltico             [Normal] ATK:4  DEF:17
        "S1-CR-EAR-014",   // Guardião Basáltico             [Normal] ATK:4  DEF:17
        "S1-CR-EAR-014"    // Guardião Basáltico             [Normal] ATK:4  DEF:17
    ],

    rewardXP:   150,     // 1ª vitória | revanche: ~45 XP
    rewardGold: 1000,    // 1ª vitória | revanche: ~300 Gold
},

// ------------------------------------------------------------
//  2. LÍDER DE ESQUADRÃO ÁGUA
//  💧 Água (8) + 🌲 Floresta (6) + 🪨 Terra (6)
//  Épicas: nenhuma
// ------------------------------------------------------------
{
    id: "leader_water",
    name: "Líder de Esquadrão Água",
    element: "water",
    campaign: "campaign_1",
    rank: "leader",
    aiLevel: 0,   // IA Básica

    deck: [
        // 💧 ÁGUA (8)
        "S1-CR-WAT-014",   // Acólitas da Concha Sagrada     [Normal] ATK:3  DEF:14
        "S1-CR-WAT-013",   // Batedores das Ondas            [Normal] ATK:8  DEF:5
        "S1-CR-WAT-006",   // Daryon, Escudo das Correntes   [Rara]   ATK:7  DEF:10
        "S1-CR-WAT-016",   // Guardiões da Maré Baixa        [Normal] ATK:2  DEF:10
        "S1-CR-WAT-008",   // Morvath, Vigia das Profundezas [Rara]   ATK:6  DEF:11
        "S1-CR-WAT-009",   // Naerys, Guardiã Coral          [Rara]   ATK:8  DEF:13
        "S1-CR-WAT-007",   // Serelis, Lâmina da Maré        [Rara]   ATK:11 DEF:6
        "S1-CR-WAT-011",   // Soldados das Marés             [Normal] ATK:6  DEF:8

        // 🌲 FLORESTA (6)
        "S1-CR-FOR-016",   // Batedores das Sombras Verdes   [Normal] ATK:7  DEF:10
        "S1-CR-FOR-006",   // Eldrin, Arqueiro das Copas     [Rara]   ATK:10 DEF:9
        "S1-CR-FOR-012",   // Lobos da Clareira              [Normal] ATK:10 DEF:5
        "S1-CR-FOR-009",   // Ravok, Uivo das Sombras        [Rara]   ATK:11 DEF:7
        "S1-CR-FOR-009",   // Ravok, Uivo das Sombras        [Rara]   ATK:11 DEF:7
        "S1-CR-FOR-014",   // Uivador Noturno                [Normal] ATK:10 DEF:6

        // 🪨 TERRA (6)
        "S1-CR-EAR-006",   // Borin, Guerreiro da Forja      [Rara]   ATK:10 DEF:12
        "S1-CR-EAR-006",   // Borin, Guerreiro da Forja      [Rara]   ATK:10 DEF:12
        "S1-CR-EAR-008",   // Durgan, Escavador Profundo     [Rara]   ATK:11 DEF:9
        "S1-CR-EAR-012",   // Fragmento Rochoso              [Normal] ATK:5  DEF:14
        "S1-CR-EAR-016",   // Sentinelas de Argila           [Normal] ATK:8  DEF:8
        "S1-CR-EAR-010"    // Thorin, Martelo Pesado         [Rara]   ATK:11 DEF:7
    ],

    rewardXP:   200,     // 1ª vitória | revanche: ~60 XP
    rewardGold: 1500,    // 1ª vitória | revanche: ~390 Gold
},

// ------------------------------------------------------------
//  3. LÍDER DE ESQUADRÃO FLORESTA
//  🌲 Floresta (8) + 🔥 Fogo (6) + 💧 Água (6)
//  Épicas: nenhuma
// ------------------------------------------------------------
{
    id: "leader_forest",
    name: "Líder de Esquadrão Floresta",
    element: "forest",
    campaign: "campaign_1",
    rank: "leader",
    aiLevel: 1,   // IA Intermediária — campo elemental

    deck: [
        // 🌲 FLORESTA (8)
        "S1-CR-FOR-013",   // Aprendiz da Folha Sagrada      [Normal] ATK:5  DEF:12
        "S1-CR-FOR-013",   // Aprendiz da Folha Sagrada      [Normal] ATK:5  DEF:12
        "S1-CR-FOR-016",   // Batedores das Sombras Verdes   [Normal] ATK:7  DEF:10
        "S1-CR-FOR-012",   // Lobos da Clareira              [Normal] ATK:10 DEF:5
        "S1-CR-FOR-012",   // Lobos da Clareira              [Normal] ATK:10 DEF:5
        "S1-CR-FOR-012",   // Lobos da Clareira              [Normal] ATK:10 DEF:5
        "S1-CR-FOR-009",   // Ravok, Uivo das Sombras        [Rara]   ATK:11 DEF:7
        "S1-CR-FOR-011",   // Sentinelas da Raiz Viva        [Normal] ATK:6  DEF:10

        // 🔥 FOGO (6)
        "S1-CR-FIR-007",   // Atsur, Demônio da Fenda        [Rara]   ATK:8  DEF:15
        "S1-CR-FIR-018",   // Batedores Incendiários         [Normal] ATK:9  DEF:2
        "S1-CR-FIR-015",   // Guardião da Lava               [Normal] ATK:2  DEF:20
        "S1-CR-FIR-015",   // Guardião da Lava               [Normal] ATK:2  DEF:20
        "S1-CR-FIR-010",   // Ignor, O Impetuoso             [Rara]   ATK:11 DEF:5
        "S1-CR-FIR-014",   // Imp das Brasas                 [Normal] ATK:7  DEF:4

        // 💧 ÁGUA (6)
        "S1-CR-WAT-013",   // Batedores das Ondas            [Normal] ATK:8  DEF:5
        "S1-CR-WAT-009",   // Naerys, Guardiã Coral          [Rara]   ATK:8  DEF:13
        "S1-CR-WAT-011",   // Soldados das Marés             [Normal] ATK:6  DEF:8
        "S1-CR-WAT-011",   // Soldados das Marés             [Normal] ATK:6  DEF:8
        "S1-CR-WAT-015",   // Vigias da Espuma               [Normal] ATK:5  DEF:9
        "S1-CR-WAT-015"    // Vigias da Espuma               [Normal] ATK:5  DEF:9
    ],

    rewardXP:   260,     // 1ª vitória | revanche: ~78 XP
    rewardGold: 2000,    // 1ª vitória | revanche: ~480 Gold
},

// ------------------------------------------------------------
//  4. LÍDER DE ESQUADRÃO TERRA
//  🪨 Terra (8) + 🔥 Fogo (6) + 🌲 Floresta (6)
//  Épicas: nenhuma
// ------------------------------------------------------------
{
    id: "leader_earth",
    name: "Líder de Esquadrão Terra",
    element: "earth",
    campaign: "campaign_1",
    rank: "leader",
    aiLevel: 1,   // IA Intermediária — campo elemental

    deck: [
        // 🪨 TERRA (8)
        "S1-CR-EAR-015",   // Aprendiz da Forja Antiga       [Normal] ATK:3  DEF:12
        "S1-CR-EAR-015",   // Aprendiz da Forja Antiga       [Normal] ATK:3  DEF:12
        "S1-CR-EAR-006",   // Borin, Guerreiro da Forja      [Rara]   ATK:10 DEF:12
        "S1-CR-EAR-008",   // Durgan, Escavador Profundo     [Rara]   ATK:11 DEF:9
        "S1-CR-EAR-014",   // Guardião Basáltico             [Normal] ATK:4  DEF:17
        "S1-CR-EAR-016",   // Sentinelas de Argila           [Normal] ATK:8  DEF:8
        "S1-CR-EAR-011",   // Soldados da Forja              [Normal] ATK:7  DEF:10
        "S1-CR-EAR-011",   // Soldados da Forja              [Normal] ATK:7  DEF:10

        // 🔥 FOGO (6)
        "S1-CR-FIR-008",   // Cyndra, Lâmina Ígnea           [Rara]   ATK:9  DEF:6
        "S1-CR-FIR-006",   // Drakthar, Cauda Escarlate      [Rara]   ATK:13 DEF:2
        "S1-CR-FIR-015",   // Guardião da Lava               [Normal] ATK:2  DEF:20
        "S1-CR-FIR-010",   // Ignor, O Impetuoso             [Rara]   ATK:11 DEF:5
        "S1-CR-FIR-010",   // Ignor, O Impetuoso             [Rara]   ATK:11 DEF:5
        "S1-CR-FIR-009",   // Volkris, Asa Ardente           [Rara]   ATK:6  DEF:8

        // 🌲 FLORESTA (6)
        "S1-CR-FOR-013",   // Aprendiz da Folha Sagrada      [Normal] ATK:5  DEF:12
        "S1-CR-FOR-010",   // Mythara, Guardiã da Seiva      [Rara]   ATK:7  DEF:16
        "S1-CR-FOR-008",   // Selene, Protetora do Bosque    [Rara]   ATK:8  DEF:14
        "S1-CR-FOR-011",   // Sentinelas da Raiz Viva        [Normal] ATK:6  DEF:10
        "S1-CR-FOR-011",   // Sentinelas da Raiz Viva        [Normal] ATK:6  DEF:10
        "S1-CR-FOR-007"    // Thorgal, Caçador da Mata       [Rara]   ATK:12 DEF:8
    ],

    rewardXP:   320,     // 1ª vitória | revanche: ~96 XP
    rewardGold: 2500,    // 1ª vitória | revanche: ~600 Gold
},

// ------------------------------------------------------------
//  5. LÍDER DE ESQUADRÃO NEUTRO  ★ CHEFE FINAL ★
//  IA Nível 01 — deck 100% aleatório a cada batalha
//  Elemento principal: 1 dos 5, aleatório por partida
//  Suportes: 2 dos 4 restantes, aleatórios
//  Pode usar Épicas e Lendárias (máx 2 cada)
//  1ª vitória libera Campanha 2 — pode ser enfrentado livremente
// ------------------------------------------------------------
{
    id: "leader_neutral",
    name: "Líder de Esquadrão Neutro",
    element: "neutral",
    campaign: "campaign_1",
    rank: "leader",
    aiLevel: 2,   // IA Avançada — campo para todos + facedown estratégico
    dynamicDeck: true,

    // deck gerado dinamicamente por EnemyAI.buildDeck()
    deck: [],

    rewardXP:   400,     // 1ª vitória | revanche: ~120 XP
    rewardGold: 3000,    // 1ª vitória | revanche: ~750 Gold
    unlocksCampaign: "campaign_2"
}

];

// ============================================================
//  EnemyAI — Geração de deck dinâmico para inimigos aiLevel 1+
//  Nível 00: deck fixo (padrão dos 4 primeiros líderes)
//  Nível 01: deck aleatório com épicas/lendárias — Líder Neutro
// ============================================================

const EnemyAI = {

    ELEMENTS: ["fire", "water", "forest", "earth", "neutral"],

    _shuffle(arr){
        return [...arr].sort(() => 0.5 - Math.random());
    },

    // Retorna cartas de um elemento filtrando raridades permitidas
    _getPool(element, allowedRarities){
        if(typeof CARDS === "undefined") return [];
        return CARDS.filter(c => {
            const el  = c.element || c.el;
            const rar = (c.rarity || c.rar || "").toLowerCase();
            return el === element && allowedRarities.includes(rar);
        });
    },

    // --------------------------------------------------------
    //  buildDeck(enemy) — gera array de IDs para aiLevel >= 1
    //
    //  Regras nível 01:
    //  - 20 cartas, 40/30/30
    //  - normal, rare, epic, legendary (sem ancient)
    //  - máx 2 épicas e 2 lendárias no deck inteiro
    //  - máx 3 cópias de normal/rara; 1 de épica/lendária
    //  - elemento principal e 2 suportes sorteados por partida
    // --------------------------------------------------------
    buildDeck(enemy){
        if(!enemy || !enemy.dynamicDeck) return enemy ? enemy.deck : [];

        const size      = 20;
        const mainCount = Math.floor(size * 0.4);       // 8
        const supCount  = Math.floor(size * 0.3);       // 6 cada suporte
        const allowed   = ["normal", "rare", "epic", "legendary"];

        // Sorteia elemento principal + 2 suportes
        const shuffledEls = this._shuffle(this.ELEMENTS);
        const mainEl  = shuffledEls[0];
        const sup1El  = shuffledEls[1];
        const sup2El  = shuffledEls[2];

        const deckIds    = [];
        const copyCount  = {};
        const rarityGlobal = { epic: 0, legendary: 0 };

        const fill = (element, limit) => {
            const pool = this._shuffle(this._getPool(element, allowed));

            for(const card of pool){
                const currentElCount = deckIds.filter(id => {
                    const c = CARDS.find(x => x.id === id);
                    return c && (c.element || c.el) === element;
                }).length;

                if(currentElCount >= limit) break;

                const rar = (card.rarity || card.rar || "").toLowerCase();

                // Limite global de épicas e lendárias
                if(rar === "epic"      && rarityGlobal.epic      >= 2) continue;
                if(rar === "legendary" && rarityGlobal.legendary >= 2) continue;

                // Limite de cópias por carta
                const copyLimit = (rar === "epic" || rar === "legendary") ? 1 : 3;
                copyCount[card.id] = copyCount[card.id] || 0;
                if(copyCount[card.id] >= copyLimit) continue;

                deckIds.push(card.id);
                copyCount[card.id]++;
                if(rar === "epic")      rarityGlobal.epic++;
                if(rar === "legendary") rarityGlobal.legendary++;
            }
        };

        fill(mainEl,  mainCount);
        fill(sup1El,  supCount);
        fill(sup2El,  supCount);

        // Fallback: completa com neutro se faltarem cartas
        if(deckIds.length < size){
            fill("neutral", size - deckIds.length);
        }

        return deckIds;
    }

};

window.EnemyAI = EnemyAI;
