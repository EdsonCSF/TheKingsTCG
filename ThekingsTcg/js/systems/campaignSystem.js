// ============================================================
//  campaignSystem.js
// ============================================================

const CampaignSystem = {

    getCampaign(id){
        return CAMPAIGNS.find(c => c.id === id);
    },

    selectCampaign(id){
        S.campaign.current = id;
    },

    selectEnemy(enemyId){
        S.campaign.enemy = enemyId;
        S.battleScore = { player: 0, enemy: 0, currentGame: 1 };
    },

    getProgress(){
        const id = S.campaign.current;
        return S.campaign.progress[id] ?? 0;
    },

    getCurrentEnemyIndex(){
        const campaign = this.getCampaign(S.campaign.current);
        if(!campaign) return -1;
        return campaign.enemies.indexOf(S.campaign.enemy);
    },

    isRematch(){
        const index    = this.getCurrentEnemyIndex();
        const progress = this.getProgress();
        return index < progress;
    },

    unlockNextEnemy(){
        const id       = S.campaign.current;
        const index    = this.getCurrentEnemyIndex();
        const progress = this.getProgress();
        const campaign = this.getCampaign(id);
        const maxIndex = campaign ? campaign.enemies.length - 1 : 0;

        if(S.campaign.progress[id] == null) S.campaign.progress[id] = 0;

        if(index === progress && progress < maxIndex){
            S.campaign.progress[id]++;
        }

        Save.save();
    },

    isEnemyUnlocked(index){
        return index <= this.getProgress();
    },

    isEnemyDefeated(index){
        return index < this.getProgress();
    },

    getCurrentEnemy(){
        return ENEMIES.find(e => e.id === S.campaign.enemy) || null;
    },

    getRequiredDeckSize(){
        const campaign = this.getCampaign(S.campaign.current);
        return campaign ? (campaign.deckSize || 20) : 20;
    },

    hasValidActiveDeck(){
        const required = this.getRequiredDeckSize();
        const activeDeck = S.activeDeck;

        if(!activeDeck || !Array.isArray(activeDeck.cards)){
            return false;
        }

        return activeDeck.cards.length === required;
    },

    validateActiveDeck(showMessage = false){
        const required = this.getRequiredDeckSize();
        const activeDeck = S.activeDeck;
        const currentSize = activeDeck && Array.isArray(activeDeck.cards)
            ? activeDeck.cards.length
            : 0;

        const valid = currentSize === required;

        if(!valid && showMessage && typeof UI !== "undefined" && UI.t){
            UI.t(`Esta campanha exige deck de ${required} cartas. Seu deck atual tem ${currentSize}.`);
        }

        return valid;
    },

    syncUnlockedCampaigns(){
        if(!S.campaign.unlocked) S.campaign.unlocked = ["campaign_1"];

        CAMPAIGNS.forEach((camp, index) => {
            const progress   = S.campaign.progress?.[camp.id] ?? 0;
            const nextCamp   = CAMPAIGNS[index + 1];
            const isComplete = progress >= (camp.enemies.length - 1);

            if(isComplete && nextCamp){
                if(!S.campaign.unlocked.includes(nextCamp.id)){
                    S.campaign.unlocked.push(nextCamp.id);
                }
            }
        });

        Save.save();
    },

    prepareBattle(){
        if(!this.validateActiveDeck(true)){
            return null;
        }

        const enemy = this.getCurrentEnemy();
        if(!enemy) return null;

        if(enemy.dynamicDeck){

            // Campanha 2 — Generais: usa GeneralAI
            if(enemy.campaign === "campaign_2"){
                if(enemy.randomElement){
                    const els = ["fire", "water", "forest", "earth"];
                    enemy.element = els[Math.floor(Math.random() * els.length)];
                }
                if(typeof GeneralAI !== "undefined"){
                    enemy.deck = GeneralAI.buildDeck(enemy);
                }
            }

            // Campanha 1 — Líder Neutro: usa EnemyAI (sistema legado)
            else if(enemy.campaign === "campaign_1"){
                if(typeof EnemyAI !== "undefined"){
                    enemy.deck = EnemyAI.buildDeck(enemy);
                }
            }
        }

        return enemy;
    },

    grantRewards(){
        const enemy = this.getCurrentEnemy();
        if(!enemy) return { xp: 0, gold: 0, leveled: false, newLevel: 1, unlockedCampaign: null };

        const rematch  = this.isRematch();
        const penalty  = rematch ? 0.30 : 1.0;

        const xp   = Math.floor((enemy.rewardXP   || 0) * penalty);
        const gold = Math.floor((enemy.rewardGold || 0) * penalty);

        if(!S.player.xp)      S.player.xp      = 0;
        if(!S.player.credits) S.player.credits = 0;
        if(!S.player.level)   S.player.level   = 1;
        if(!S.player.xpMax)   S.player.xpMax   = 500;

        S.player.xp      += xp;
        S.player.credits += gold;

        const leveled = this._checkLevelUp();

        if(!rematch){
            this.unlockNextEnemy();
        }

        let unlockedCampaign = null;
        if(!rematch && enemy.unlocksCampaign){
            if(!S.campaign.unlocked) S.campaign.unlocked = ["campaign_1"];
            if(!S.campaign.unlocked.includes(enemy.unlocksCampaign)){
                S.campaign.unlocked.push(enemy.unlocksCampaign);
                unlockedCampaign = enemy.unlocksCampaign;
            }
        }

        Save.save();

        return { xp, gold, leveled, newLevel: S.player.level, unlockedCampaign, rematch };
    },

    _checkLevelUp(){
        let leveled = false;
        let needed  = this._xpForLevel(S.player.level);

        while(S.player.xp >= needed){
            S.player.xp    -= needed;
            S.player.level += 1;
            leveled         = true;
            needed          = this._xpForLevel(S.player.level);
        }

        S.player.xpMax = this._xpForLevel(S.player.level);
        return leveled;
    },

    _xpForLevel(level){
        return Math.floor(500 * Math.pow(1.6, level - 1));
    }

};