// ============================================================
//  BattleAI — Sistema de Inteligência do Inimigo
//  Arquivo: js/core/battleAI.js
//  Carregar ANTES de battle.js no index.html
//
//  Uso no enemies.js:
//    aiLevel: 0  → Líderes 1 e 2 (Campanha 1)
//    aiLevel: 1  → Líderes 3 e 4 (Campanha 1)
//    aiLevel: 2  → Líder Neutro / Campanhas futuras
//    aiLevel: 3  → Campanhas avançadas
//    aiLevel: 4  → Reservado (a implementar com sistema de ATK)
//
// ============================================================
//  NÍVEL 0 — Básico
//    ATK > DEF → vanguarda (atk)
//    DEF >= ATK → retaguarda (def)
//    Se posição ideal cheia → coloca onde couber
//    Sem facedown, sem leitura de campo
//
//  NÍVEL 1 — Nível 0 + Campo elemental do inimigo
//    Herda tudo do nível 0
//    Ao decidir posição, considera o multiplicador do campo
//    MAS apenas para cartas do elemento principal do inimigo
//    Ex: inimigo fogo → prioriza jogar cartas de fogo quando
//        o campo dá bônus para fogo (mult > 1)
//40% chance de colocar carta virada aleatória 
//
//  NÍVEL 2 — Nível 1 + Campo para todos os elementos
//    Herda tudo do nível 1
//    Considera multiplicador do campo para TODAS as cartas
//    Vira facedown cartas do elemento que leva punição no campo
//    (multiplicador < 1) para não perder pontos
//    Blefe estratégico com cartas punidas
//
//  NÍVEL 3 — Nível 1 + 2 + Neutralidade como fallback
//    Herda tudo do nível 2
//    Também considera cartas neutras no campo (mult = 1)
//    como opção preferível a cartas punidas (mult < 1)
//    Prioridade: mult 2x > mult 1x > facedown se mult 0.5x
//
// ============================================================
//  BattleAI — Sistema de Inteligência do Inimigo
//  Arquivo: js/core/battleAI.js
//
//  NÍVEIS:
//    0 → básico
//    1 → + multiplicador do campo para elemento principal
//    2 → + mult para todas + facedown quando punido
//    3 → + neutralidade como fallback
//    4 → + sistema de ATK na vanguarda (vencer combates)
//    5 → + priorizar cartas mais fracas do oponente + facedown estratégico
// ============================================================

const BattleAI = {

    // --------------------------------------------------------
    //  Ponto de entrada
    // --------------------------------------------------------
    playCard(b, aiLevel = 0, options = {}) {
        if (b.hE.length === 0) return Promise.resolve();

        const { silent = false, onComplete = null } = options;

        switch (aiLevel) {
            case 0: return this._playLv0(b, silent, onComplete);
            case 1: return this._playLv1(b, silent, onComplete);
            case 2: return this._playLv2(b, silent, onComplete);
            case 3: return this._playLv3(b, silent, onComplete);
            case 4: return this._playLv4(b, silent, onComplete);
            case 5: return this._playLv5(b, silent, onComplete);
            default: return this._playLv0(b, silent, onComplete);
        }
    },

    // --------------------------------------------------------
    //  Utilitários
    // --------------------------------------------------------
    _getField(b) { return b.f[0] || null; },

    _getValidSpots(b) {
        const spots = [];
        b.f.forEach((field, fi) => {
            if (!field.s.e) field.s.e = { vanguarda: [], retaguarda: [] };
            // Vanguarda: slots fixos de 5 — conta apenas posições realmente ocupadas
            while (field.s.e.vanguarda.length < 5) field.s.e.vanguarda.push(null);
            const vanOccupied = field.s.e.vanguarda.filter(c => c !== null).length;
            if (vanOccupied < 5)
                spots.push({ fi, row: 'vanguarda', canFacedown: false });
            // Retaguarda: push normal
            const fdCount = field.s.e.retaguarda.filter(c => c && c.isFaceDown).length;
            const retOccupied = field.s.e.retaguarda.filter(c => c !== null).length;
            if (retOccupied < 5)
                spots.push({ fi, row: 'retaguarda', canFacedown: b.t <= 6 && fdCount < 2 });
        });
        return spots;
    },

    _mult(card, field) {
        if (!field || typeof Battle === 'undefined') return 1;
        return Battle.getFieldMultiplier(card.el, field);
    },

    _effAtk(card, field) { return card.atk * this._mult(card, field); },
    _effDef(card, field) { return card.def * this._mult(card, field); },

    _getOpponentCardAtSlot(field, slotIndex) {
        if (!field.s.p || !field.s.p.vanguarda) return null;
        const card = field.s.p.vanguarda[slotIndex];
        return card && !card.isFaceDown ? card : null;
    },

    // Retorna a lista de slots vazios da vanguarda do inimigo (IA)
    _getEmptyVanguardSlots(b) {
        const field = this._getField(b);
        if (!field || !field.s.e.vanguarda) return [];
        const empty = [];
        for (let i = 0; i < 5; i++) {
            if (!field.s.e.vanguarda[i]) empty.push(i);
        }
        return empty;
    },

    // Coloca a carta na posição escolhida com animação
    _placeWithAnimation(b, cardIndex, row, mode, faceDown = false, onComplete) {
        const card = { ...b.hE[cardIndex] };
        card.mode = mode;
        card.isFaceDown = faceDown;
        const spots = this._getValidSpots(b);
        const spot = spots.find(s => s.row === row) || spots[0];
        if (!spot) {
            if (onComplete) onComplete();
            return;
        }

        // Busca elementos DOM para animação
        const handContainer = document.getElementById('e-hand');
        const handCards = handContainer ? handContainer.querySelectorAll('.e-card-mini') : [];
        const fromEl = handCards[cardIndex] || null;

        const fieldRowId = `e-${spot.row}-${spot.fi}`;
        const fieldRowEl = document.getElementById(fieldRowId);

        let targetSlot = null;
        if (fieldRowEl) {
            const slots = fieldRowEl.querySelectorAll('.card-slot');
            for (let slot of slots) {
                if (!slot.querySelector('.field-card')) {
                    targetSlot = slot;
                    break;
                }
            }
            if (!targetSlot) targetSlot = slots[slots.length - 1];
        }

        const doPlace = () => {
            if (spot.row === 'vanguarda') {
                const van = b.f[spot.fi].s.e.vanguarda;
                while (van.length < 5) van.push(null);
                const nullIdx = van.indexOf(null);
                if (nullIdx !== -1) {
                    van[nullIdx] = card;
                }
            } else {
                b.f[spot.fi].s.e[spot.row].push(card);
            }
            b.hE.splice(cardIndex, 1);
            Battle.render();
            if (onComplete) onComplete();
        };

        if (!fromEl || !targetSlot) {
            doPlace();
            return;
        }

        this._animateEnemyCard(card, fromEl, targetSlot, doPlace);
    },

    _animateEnemyCard(card, fromEl, targetSlot, callback) {
        const from = fromEl.getBoundingClientRect();
        const to = targetSlot.getBoundingClientRect();

        const fly = document.createElement("div");
        fly.className = "flying-card";
        fly.style.backgroundImage = `url('${card.i}')`;
        fly.style.position = "fixed";
        fly.style.left = from.left + "px";
        fly.style.top = from.top + "px";
        fly.style.zIndex = "10000";

        document.body.appendChild(fly);

        const targetX = to.left;
        const targetY = to.top;
        const midX = (from.left + targetX) / 2;
        const midY = Math.min(from.top, targetY) - 100;

        gsap.timeline({
            onComplete: () => {
                fly.remove();
                if (callback) callback();
                gsap.fromTo(targetSlot, { scale: 1 }, { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1 });
            }
        })
            .to(fly, { duration: 0.3, x: midX - from.left, y: midY - from.top, scale: 0.9, rotate: -4, ease: "power2.out" })
            .to(fly, { duration: 0.4, x: targetX - from.left, y: targetY - from.top, scale: 1, rotate: 0, ease: "back.out(0.6)" });
    },

    // --------------------------------------------------------
    //  NÍVEL 0 — Básico
    // --------------------------------------------------------
    _playLv0(b, silent = false, onComplete) {
        const spots = this._getValidSpots(b);
        if (spots.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        const hasVanguarda = spots.some(s => s.row === 'vanguarda');
        const hasRetaguarda = spots.some(s => s.row === 'retaguarda');

        const ci = Math.floor(Math.random() * b.hE.length);
        const card = b.hE[ci];

        let row, mode;
        if (card.atk > card.def && hasVanguarda) {
            row = 'vanguarda'; mode = 'atk';
        } else if (card.def >= card.atk && hasRetaguarda) {
            row = 'retaguarda'; mode = 'def';
        } else {
            row = hasVanguarda ? 'vanguarda' : 'retaguarda';
            mode = row === 'vanguarda' ? 'atk' : 'def';
        }

        if (!silent) UI.t("Inimigo jogou uma carta!");
        this._placeWithAnimation(b, ci, row, mode, false, onComplete);
    },

    // --------------------------------------------------------
    //  NÍVEL 1 — Nível 0 + multiplicador de campo
    // --------------------------------------------------------
    _playLv1(b, silent = false, onComplete) {
        const spots = this._getValidSpots(b);
        if (spots.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        const field = this._getField(b);
        const hasVanguarda = spots.some(s => s.row === 'vanguarda');
        const hasRetaguarda = spots.some(s => s.row === 'retaguarda');

        const enemyData = (typeof ENEMIES !== 'undefined' && S.campaign && S.campaign.enemy)
            ? ENEMIES.find(e => e.id === S.campaign.enemy) : null;
        const mainElement = enemyData ? enemyData.element : null;

        const mainCards = b.hE.map((c, i) => ({ c, i })).filter(x => x.c.el === mainElement);
        const otherCards = b.hE.map((c, i) => ({ c, i })).filter(x => x.c.el !== mainElement);

        let chosen = null;

        if (mainCards.length > 0 && field) {
            const best = mainCards.reduce((acc, cur) => {
                const powAcc = Math.max(this._effAtk(acc.c, field), this._effDef(acc.c, field));
                const powCur = Math.max(this._effAtk(cur.c, field), this._effDef(cur.c, field));
                return powCur > powAcc ? cur : acc;
            });
            chosen = best;
        } else if (otherCards.length > 0) {
            chosen = otherCards[Math.floor(Math.random() * otherCards.length)];
        } else {
            chosen = { c: b.hE[0], i: 0 };
        }

        const card = chosen.c;
        const effA = field ? this._effAtk(card, field) : card.atk;
        const effD = field ? this._effDef(card, field) : card.def;

        let row, mode, faceDown = false;

        const retSpot = spots.find(s => s.row === 'retaguarda');
        const canFacedown = retSpot && retSpot.canFacedown && hasRetaguarda;
        const rollFacedown = Math.random() < 0.40;

        if (canFacedown && rollFacedown) {
            row = 'retaguarda';
            mode = 'def';
            faceDown = true;
        } else if (effA > effD && hasVanguarda) {
            row = 'vanguarda'; mode = 'atk';
        } else if (effD >= effA && hasRetaguarda) {
            row = 'retaguarda'; mode = 'def';
        } else {
            row = hasVanguarda ? 'vanguarda' : 'retaguarda';
            mode = row === 'vanguarda' ? 'atk' : 'def';
        }

        if (!silent) UI.t("Inimigo jogou uma carta!");
        this._placeWithAnimation(b, chosen.i, row, mode, faceDown, onComplete);
    },

    // --------------------------------------------------------
    //  NÍVEL 2 — Nível 1 + mult para todas as cartas
    // --------------------------------------------------------
    _playLv2(b, silent = false, onComplete) {
        const spots = this._getValidSpots(b);
        if (spots.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        const field = this._getField(b);
        const hasVanguarda = spots.some(s => s.row === 'vanguarda');
        const hasRetaguarda = spots.some(s => s.row === 'retaguarda');
        const retSpot = spots.find(s => s.row === 'retaguarda');

        const ranked = b.hE.map((c, i) => ({
            c, i,
            mult: this._mult(c, field),
            effA: this._effAtk(c, field),
            effD: this._effDef(c, field),
            bestPow: Math.max(this._effAtk(c, field), this._effDef(c, field))
        })).sort((a, b) => b.bestPow - a.bestPow);

        const best = ranked[0];
        const isPunished = best.mult < 1;
        const canFacedown = retSpot && retSpot.canFacedown;

        let row, mode, faceDown = false;

        if (isPunished && canFacedown && hasRetaguarda) {
            row = 'retaguarda';
            mode = 'def';
            faceDown = true;
        } else if (best.effA > best.effD && hasVanguarda) {
            row = 'vanguarda'; mode = 'atk';
        } else if (best.effD >= best.effA && hasRetaguarda) {
            row = 'retaguarda'; mode = 'def';
        } else {
            row = hasVanguarda ? 'vanguarda' : 'retaguarda';
            mode = row === 'vanguarda' ? 'atk' : 'def';
        }

        if (!silent) UI.t("Inimigo jogou uma carta!");
        this._placeWithAnimation(b, best.i, row, mode, faceDown, onComplete);
    },

    // --------------------------------------------------------
    //  NÍVEL 3 — Nível 2 + neutralidade como fallback
    // --------------------------------------------------------
    _playLv3(b, silent = false, onComplete) {
        const spots = this._getValidSpots(b);
        if (spots.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        const field = this._getField(b);
        const hasVanguarda = spots.some(s => s.row === 'vanguarda');
        const hasRetaguarda = spots.some(s => s.row === 'retaguarda');
        const retSpot = spots.find(s => s.row === 'retaguarda');

        const ranked = b.hE.map((c, i) => ({
            c, i,
            mult: this._mult(c, field),
            effA: this._effAtk(c, field),
            effD: this._effDef(c, field),
            bestPow: Math.max(this._effAtk(c, field), this._effDef(c, field))
        }));

        const bonus = ranked.filter(x => x.mult >= 2).sort((a, b) => b.bestPow - a.bestPow);
        const neutral = ranked.filter(x => x.mult === 1).sort((a, b) => b.bestPow - a.bestPow);
        const punish = ranked.filter(x => x.mult < 1).sort((a, b) => b.bestPow - a.bestPow);

        const best = bonus[0] || neutral[0] || punish[0];
        const isPunished = best.mult < 1;
        const canFacedown = retSpot && retSpot.canFacedown;

        let row, mode, faceDown = false;

        if (isPunished && canFacedown && hasRetaguarda) {
            row = 'retaguarda';
            mode = 'def';
            faceDown = true;
        } else if (best.effA > best.effD && hasVanguarda) {
            row = 'vanguarda'; mode = 'atk';
        } else if (best.effD >= best.effA && hasRetaguarda) {
            row = 'retaguarda'; mode = 'def';
        } else {
            row = hasVanguarda ? 'vanguarda' : 'retaguarda';
            mode = row === 'vanguarda' ? 'atk' : 'def';
        }

        if (!silent) UI.t("Inimigo jogou uma carta!");
        this._placeWithAnimation(b, best.i, row, mode, faceDown, onComplete);
    },

    // --------------------------------------------------------
    //  NÍVEL 4 — nível 3 + sistema de ATK na vanguarda (vencer combates)
    // --------------------------------------------------------
    _playLv4(b, silent = false, onComplete) {
        const spots = this._getValidSpots(b);
        if (spots.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        const field = this._getField(b);
        const hasVanguarda = spots.some(s => s.row === 'vanguarda');
        const hasRetaguarda = spots.some(s => s.row === 'retaguarda');
        const emptyVanguardSlots = this._getEmptyVanguardSlots(b);

        // Se há slots na vanguarda, escolhe a melhor carta para vencer combate
        if (hasVanguarda && emptyVanguardSlots.length > 0) {
            let bestChoice = null;
            let bestScore = -Infinity;

            for (let i = 0; i < b.hE.length; i++) {
                const card = b.hE[i];
                const effAtk = this._effAtk(card, field);
                const effDef = this._effDef(card, field);
                const bestPow = Math.max(effAtk, effDef);

                // Avalia cada slot vazio da vanguarda
                for (let slot of emptyVanguardSlots) {
                    const opponentCard = this._getOpponentCardAtSlot(field, slot);
                    let score = bestPow; // pontuação base

                    if (opponentCard) {
                        // Se há oponente, calcula vantagem de ataque
                        const oppAtk = opponentCard.mode === 'def'
                            ? this._effDef(opponentCard, field)
                            : this._effAtk(opponentCard, field);
                        const diff = effAtk - oppAtk;
                        if (diff > 0) {
                            score += diff * 10; // bônus por vencer
                        } else if (diff < 0) {
                            score -= Math.abs(diff) * 5; // penalidade por perder
                        }
                    } else {
                        // slot vazio – prioriza colocar poder alto
                        score += effAtk;
                    }

                    if (score > bestScore) {
                        bestScore = score;
                        bestChoice = { idx: i, card, slot, row: 'vanguarda', mode: 'atk', faceDown: false };
                    }
                }
            }

            if (bestChoice) {
                if (!silent) UI.t("Inimigo jogou uma carta (ataque estratégico)!");
                this._placeWithAnimation(b, bestChoice.idx, bestChoice.row, bestChoice.mode, bestChoice.faceDown, onComplete);
                return;
            }
        }

        // Fallback: usa lógica do nível 3
        this._playLv3(b, silent, onComplete);
    },

    // --------------------------------------------------------
    //  NÍVEL 5 — nível 4 + priorizar cartas mais fracas do oponente
    //            + facedown estratégico para cartas punidas
    // --------------------------------------------------------
    _playLv5(b, silent = false, onComplete) {
        const spots = this._getValidSpots(b);
        if (spots.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        const field = this._getField(b);
        const hasVanguarda = spots.some(s => s.row === 'vanguarda');
        const hasRetaguarda = spots.some(s => s.row === 'retaguarda');
        const emptyVanguardSlots = this._getEmptyVanguardSlots(b);
        const retSpot = spots.find(s => s.row === 'retaguarda');

        // ----------------------------------------------------
        // 1. Avalia se há carta na mão que sofre punição e pode ser colocada virada na retaguarda
        // ----------------------------------------------------
        if (hasRetaguarda && retSpot && retSpot.canFacedown) {
            for (let i = 0; i < b.hE.length; i++) {
                const card = b.hE[i];
                const mult = this._mult(card, field);
                if (mult < 1) {
                    // Carta punida – coloca virada na retaguarda (defesa)
                    if (!silent) UI.t("Inimigo posicionou uma carta virada para evitar punição!");
                    this._placeWithAnimation(b, i, 'retaguarda', 'def', true, onComplete);
                    return;
                }
            }
        }

        // ----------------------------------------------------
        // 2. Prioriza atacar cartas mais fracas do oponente na vanguarda
        // ----------------------------------------------------
        if (hasVanguarda && emptyVanguardSlots.length > 0) {
            // Descobre os slots ocupados por oponentes com menor poder de ataque
            const opponentSlots = [];
            for (let i = 0; i < 5; i++) {
                const oppCard = this._getOpponentCardAtSlot(field, i);
                if (oppCard) {
                    const oppPower = oppCard.mode === 'def'
                        ? this._effDef(oppCard, field)
                        : this._effAtk(oppCard, field);
                    opponentSlots.push({ slot: i, power: oppPower });
                }
            }
            // Ordena os oponentes do mais fraco para o mais forte
            opponentSlots.sort((a, b) => a.power - b.power);

            let bestChoice = null;
            let bestScore = -Infinity;

            for (let i = 0; i < b.hE.length; i++) {
                const card = b.hE[i];
                const effAtk = this._effAtk(card, field);
                const effDef = this._effDef(card, field);
                const bestPow = Math.max(effAtk, effDef);

                // Tenta colocar nos slots vazios, preferindo enfrentar o oponente mais fraco disponível
                for (let slot of emptyVanguardSlots) {
                    const opponentCard = this._getOpponentCardAtSlot(field, slot);
                    let score = bestPow;
                    if (opponentCard) {
                        const oppPower = opponentCard.mode === 'def'
                            ? this._effDef(opponentCard, field)
                            : this._effAtk(opponentCard, field);
                        const diff = effAtk - oppPower;
                        if (diff > 0) {
                            // bônus maior para vencer cartas fracas
                            score += diff * 15;
                        } else if (diff < 0) {
                            score -= Math.abs(diff) * 10;
                        }
                    } else {
                        // slot vazio – prioriza colocar poder alto
                        score += effAtk;
                    }
                    // Penaliza se a carta tiver mult baixo na vanguarda
                    if (this._mult(card, field) < 1) score -= 20;

                    if (score > bestScore) {
                        bestScore = score;
                        bestChoice = { idx: i, card, slot, row: 'vanguarda', mode: 'atk', faceDown: false };
                    }
                }
            }

            if (bestChoice) {
                if (!silent) UI.t("Inimigo ataca a posição mais fraca!");
                this._placeWithAnimation(b, bestChoice.idx, bestChoice.row, bestChoice.mode, bestChoice.faceDown, onComplete);
                return;
            }
        }

        // ----------------------------------------------------
        // 3. Prioriza retaguarda para cartas com alta defesa e bônus de campo
        // ----------------------------------------------------
        if (hasRetaguarda) {
            let bestDefCard = null;
            let bestDefScore = -Infinity;

            for (let i = 0; i < b.hE.length; i++) {
                const card = b.hE[i];
                const effDef = this._effDef(card, field);
                const mult = this._mult(card, field);
                // Prefere cartas com defesa alta e bônus no campo
                let score = effDef;
                if (mult >= 2) score += 100;
                else if (mult === 1) score += 50;
                // Se a carta sofre punição, não considera para retaguarda normal
                if (mult < 1) continue;

                if (score > bestDefScore) {
                    bestDefScore = score;
                    bestDefCard = { idx: i, card };
                }
            }

            if (bestDefCard) {
                if (!silent) UI.t("Inimigo reforça a retaguarda com alta defesa!");
                this._placeWithAnimation(b, bestDefCard.idx, 'retaguarda', 'def', false, onComplete);
                return;
            }
        }

        // ----------------------------------------------------
        // Fallback final: nível 4
        // ----------------------------------------------------
        this._playLv4(b, silent, onComplete);
    },

    // --------------------------------------------------------
    //  Múltiplas cartas em sequência (turno 10)
    // --------------------------------------------------------
    playMultipleCards(b, aiLevel = 0, count, onComplete) {
        if (count <= 0 || b.hE.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        let cardsPlayed = 0;
        const totalToPlay = Math.min(count, b.hE.length);

        const playNext = () => {
            if (cardsPlayed >= totalToPlay || b.hE.length === 0) {
                if (onComplete) onComplete();
                return;
            }

            this.playCard(b, aiLevel, {
                silent: true,
                onComplete: () => {
                    cardsPlayed++;
                    setTimeout(playNext, 350);
                }
            });
        };

        playNext();
    }
};

window.BattleAI = BattleAI;