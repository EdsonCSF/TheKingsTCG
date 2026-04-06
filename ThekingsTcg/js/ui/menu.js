const Menu = {
    startGame() {
        UI.show('campaign-screen');
        CampaignView.render();
    },

    openProfile() {
        UI.show('profile-screen');
    },

    updateHeader() {
        const playerName = S.player.name || 'Rei da Arena';
        const avatarUrl  = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(playerName)}`;

        const avatarEl = document.getElementById('menu-avatar');
        if (avatarEl) avatarEl.style.backgroundImage = `url('${avatarUrl}')`;

        const nameEl = document.getElementById('menu-player-name');
        if (nameEl) nameEl.innerText = playerName;

        const lvlEl = document.getElementById('menu-level');
        if (lvlEl && S.player) lvlEl.innerText = `NV. ${S.player.level}`;

        const credEl = document.getElementById('menu-credits');
        if (credEl && S.player) credEl.innerText = S.player.credits;

        const rubyEl = document.getElementById('menu-rubies');
        if (rubyEl && S.player) rubyEl.innerText = S.player.rubies || 0;

        this.updateFeaturedCard();
    },

    updateFeaturedCard() {
        UI.updateFeaturedCard();
    },

    // Verifica se é primeiro login e redireciona para tela de login
    checkFirstLogin() {
        if (S.firstLogin === true) {
            UI.show('login-screen');
            LoginView.render();
        } else {
            UI.show('menu-screen-new');
            Menu.updateHeader();
        }
    }
};

// Definição separada de Settings (Global, fora do Menu)
const Settings = {
    firstInteraction() {
        AudioManager.unlock();
        AudioManager.playMenu();
        document.getElementById('settings-modal').classList.remove('hidden');
    },

    close() {
        document.getElementById('settings-modal').classList.add('hidden');
    },

    toggleMusic() {
        const btn = document.getElementById('btn-music');
        const on = btn.classList.toggle('on');
        btn.innerText = on ? 'ON' : 'OFF';
        on ? AudioManager.playMenu() : AudioManager.stop();
    },

    toggleSound() {
        const btn = document.getElementById('btn-sound');
        const on = btn.classList.toggle('on');
        btn.innerText = on ? 'ON' : 'OFF';
    }
};
