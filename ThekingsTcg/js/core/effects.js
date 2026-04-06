const EffectQueue = [];

const Effects = {

  // Adiciona efeito à fila
  addToQueue(action) {
    EffectQueue.push(action);
    if (EffectQueue.length === 1) {
      this.processQueue();
    }
  },

  // Processa fila em ordem
  async processQueue() {
    if (EffectQueue.length === 0) return;

    const action = EffectQueue[0];
    await action();

    EffectQueue.shift();
    this.processQueue();
  },

  // Executa efeito de uma carta
  execute(card, context) {
    if (!card.effect) return;

    const { action, value } = card.effect;

    if (typeof this[action] === "function") {
      this.addToQueue(async () => {
        await this[action](card, context, value);
      });
    }
  },

  /* =========================
     AÇÕES BASE DO JOGO
     ========================= */

  async damageEnemy(card, context, value) {
    const target = context.enemy;

    if (target.elementRef) {
      await Visuals.glow(target.elementRef, "red");
      await Visuals.shake(target.elementRef);
      await Visuals.damageNumber(target.elementRef, value);
    }

    target.hp -= value;
  },

  async damageAllEnemy(card, context, value) {
    for (const enemyCard of context.enemy.field) {
      if (enemyCard.elementRef) {
        await Visuals.glow(enemyCard.elementRef, "red");
        await Visuals.shake(enemyCard.elementRef);
        await Visuals.damageNumber(enemyCard.elementRef, value);
      }

      enemyCard.def -= value;
    }
  },

  async healSelf(card, context, value) {
    const target = card;

    if (target.elementRef) {
      await Visuals.glow(target.elementRef, "green");
      await Visuals.damageNumber(target.elementRef, `+${value}`);
    }

    target.def += value;
  },

  async healAllAllies(card, context, value) {
    for (const ally of context.player.field) {
      if (ally.elementRef) {
        await Visuals.glow(ally.elementRef, "green");
        await Visuals.damageNumber(ally.elementRef, `+${value}`);
      }

      ally.def += value;
    }
  },

  async gainAtk(card, context, value) {
    if (card.elementRef) {
      await Visuals.glow(card.elementRef, "orange");
    }

    card.atk += value;
  },

  async gainDef(card, context, value) {
    if (card.elementRef) {
      await Visuals.glow(card.elementRef, "blue");
    }

    card.def += value;
  }

};