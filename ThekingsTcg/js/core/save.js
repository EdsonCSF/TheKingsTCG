const Save = {
  KEY: 'thekingstcg-save',

  save() {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(S));
      console.log('[Save] Jogo salvo');
    } catch (e) {
      console.error('[Save] Erro ao salvar o jogo', e);
    }
  },

  load() {
    try {
      const data = localStorage.getItem(this.KEY);
      if (!data) return false;

      const parsed = JSON.parse(data);

      // DETECÇÃO DE SAVE ANTIGO
      // Saves antigos não tinham a flag firstLogin.
      // Se detectar isso, limpa e força novo fluxo de login.
      if (parsed.firstLogin === undefined) {
        console.warn('[Save] Save antigo detectado — resetando para novo sistema.');
        this.clear();
        return false;
      }

      Object.assign(S, parsed);

      // Garante estrutura de campanha sempre correta
      if (!S.campaign) S.campaign = { current: null, enemy: null, unlocked: ["campaign_1"], progress: {} };
      if (!S.campaign.unlocked) S.campaign.unlocked = ["campaign_1"];
      if (!S.campaign.progress) S.campaign.progress = {};

      // Valida progresso — nunca pode ser negativo
      ["campaign_1","campaign_2","campaign_3","campaign_4"].forEach(id => {
        if (S.campaign.progress[id] == null) S.campaign.progress[id] = 0;
        if (S.campaign.progress[id] < 0)    S.campaign.progress[id] = 0;
      });

      // FIX: garante estrutura de shop sempre correta ao carregar
      if (!S.shop) S.shop = { dailyStock: [], lastRotation: null };
      if (!Array.isArray(S.shop.dailyStock)) S.shop.dailyStock = [];
      if (typeof S.shop.lastRotation !== 'string') S.shop.lastRotation = null;

      // FIX: saves antigos podem ter dailyStock com objetos completos em vez de IDs.
      // Normaliza para array de strings (IDs).
      S.shop.dailyStock = S.shop.dailyStock.map(entry =>
        (typeof entry === 'string') ? entry : entry?.id
      ).filter(Boolean);

      // Garante battleScore sempre limpo ao carregar
      S.battleScore = { player: 0, enemy: 0, currentGame: 1 };

      console.log('[Save] Save carregado');
      return true;
    } catch (e) {
      console.error('[Save] Erro ao carregar o save', e);
      return false;
    }
  },

  clear() {
    localStorage.removeItem(this.KEY);
    console.log('[Save] Save apagado');
  }
};
