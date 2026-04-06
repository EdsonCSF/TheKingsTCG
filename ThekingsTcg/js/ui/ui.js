const CardImageCache = {};
function preloadAllCards(){

    if(typeof CARDS === "undefined") return;

    CARDS.forEach(card => {

        const img = new Image();
        img.src = card.img;

        CardImageCache[card.img] = img.src;

    });

}

function getCardImage(src){

    if(CardImageCache[src]) return CardImageCache[src];

    const img = new Image();
    img.src = src;

    CardImageCache[src] = img.src;

    return img.src;
}

const CardPool = [];

const UI = {
    show: (id) => {
        document.querySelectorAll('.screen').forEach(e=>e.classList.add('hidden'));
        const target = document.getElementById(id);
        if(target) {
            target.classList.remove('hidden');
        }
        
        document.getElementById('modal').style.display='none';
        
        if(id==='shop-screen') Shop.render();
        if(id==='profile-screen') Profile.render();
        if(id==='collection-screen') Col.render(); 
        if(id === 'menu-screen-new') {
            Menu.updateHeader();
            Menu.updateFeaturedCard(); // Atualiza a carta do menu
        }
    },
    t: (m) => {
        const b = document.getElementById('toast-box');
        if(!b) return;
        const d = document.createElement('div'); d.className='toast'; d.innerText=m;
        b.appendChild(d); setTimeout(()=>d.remove(), 1600);
    },
    cE: (d, mini=false) => {

    let el;

    if(CardPool.length > 0){
        el = CardPool.pop();
    }else{
        el = document.createElement('div');
        el.className = 'card';
        el.style.contain = "layout paint";
    }

    // reset bsico
    el.className = 'card';
    el.style.transform = '';
    el.style.opacity = '';

    el.dataset.el = d.element;

    el.style.backgroundImage = `url('${getCardImage(d.img)}')`;

    if(mini){
        el.style.width='40px';
        el.style.height='60px';
        el.style.margin='0 2px';
    }else{
        el.style.width='';
        el.style.height='';
        el.style.margin='';
    }

    return el;
},

    // --- NOVO: Zoom de Carta Universal ---
    openCardZoom: (cardData) => {
        const preview = document.getElementById('card-preview');
        const card = document.getElementById('preview-card');
        const favBtn = document.getElementById('fav-card-btn');

        card.style.backgroundImage = `url('${cardData.img}')`;
        card.dataset.cardId = cardData.id;
        
        // Configurar boto favorito
        if(favBtn) {
            favBtn.onclick = (e) => {
                e.stopPropagation();
                S.player.favoriteCard = cardData;
                Save.save();
                UI.t("Carta Favorita definida!");
                preview.style.display = 'none';
                Menu.updateFeaturedCard(); // Atualiza menu imediatamente
            };
        }

        preview.style.display = 'flex';
    },

    // --- NOVO: Atualiza Carta do Menu ---
    updateFeaturedCard: () => {
        const cardBg = document.getElementById('menu-featured-card-bg');
        if (!cardBg) return;

        if (S.player && S.player.favoriteCard) {
            cardBg.style.backgroundImage = `url('${S.player.favoriteCard.i}')`;
            // Se quiser adicionar info de nome na legenda, precisaria selecionar o elemento h3/p interno
        } else {
            // Mantm o padro (O Escolhido) se no tiver favorita
            cardBg.style.backgroundImage = `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBiwTMRm_9cRrjm7BY-j7O3xcLj78bnBdcdK4eVBPW-NIVWo5fP9r8UgUSY2P-W7cz2Al12xLud0AvbOrKrkDjQ6_ew0b1FOpPPM3EF6HjxoGyTUhhBc6lPGNq5XJshU68WKB_tCbwuCx9QL0NUjbSQNL_00LB7ZSmkp-i0-wP9quLyW5TUCCEZE6maBweO5HW77KBiyyPnB4O-y0V4RWL-tw_gL5549k3fFyimcZLcR364L8MaVgo0QP1c8S7B4WUbH3xrI3BeYWMG")`;
        }
    }
};

const Profile = {
    render: () => {
        const playerName = S.player.name || 'Rei da Arena';
        const avatarUrl  = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(playerName)}`;

        document.getElementById('prof-avatar').src = avatarUrl;
        document.getElementById('prof-name').innerText = playerName;
        document.getElementById('prof-level').innerText = S.player.level;
        document.getElementById('prof-credits').innerText = S.player.credits;

        const profRubies = document.getElementById('prof-rubies');
        if (profRubies) profRubies.innerText = S.player.rubies || 0;

        const xpPct = (S.player.xp / S.player.xpMax) * 100;
        document.getElementById('prof-xp-bar').style.width = xpPct + '%';
        document.getElementById('prof-xp-text').innerText = `${S.player.xp} / ${S.player.xpMax}`;
    },

    editName: () => {
        const current = S.player.name || 'Rei da Arena';
        const input = document.getElementById('prof-name-input');
        if (input) input.value = current;
        document.getElementById('prof-name-display').classList.add('hidden');
        document.getElementById('prof-name-edit').classList.remove('hidden');
        if (input) input.focus();
    },

    saveName: () => {
        const input = document.getElementById('prof-name-input');
        const trimmed = (input ? input.value : '').trim();
        const name = trimmed.length > 0 ? trimmed : 'Rei da Arena';

        S.player.name = name;
        Save.save();

        const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
        document.getElementById('prof-name').innerText = name;
        document.getElementById('prof-avatar').src = avatarUrl;

        const menuName = document.getElementById('menu-player-name');
        if (menuName) menuName.innerText = name;
        const menuAvatar = document.getElementById('menu-avatar');
        if (menuAvatar) menuAvatar.style.backgroundImage = `url('${avatarUrl}')`;

        document.getElementById('prof-name-display').classList.remove('hidden');
        document.getElementById('prof-name-edit').classList.add('hidden');
    },

    cancelEditName: () => {
        document.getElementById('prof-name-display').classList.remove('hidden');
        document.getElementById('prof-name-edit').classList.add('hidden');
    },

    tab: (tabName) => {
        document.getElementById('profile-tab').classList.add('hidden');
        document.getElementById('decks-tab').classList.add('hidden');
        document.getElementById('collection-tab').classList.add('hidden');

        if(tabName === 'profile') {
            document.getElementById('profile-tab').classList.remove('hidden');
        } 
        else if (tabName === 'decks') {
            UI.show('collection-screen');
            setTimeout(() => Col.openDeckEditor(), 0);
        } 
        else if (tabName === 'avatar') {
            UI.show('avatar-screen');
        }
    }
};

window.addEventListener('load', () => {

    preloadAllCards(); //  carrega todas cartas

    const loading = document.getElementById('loading-screen');
    const menuId = 'menu-screen-new';

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));

    setTimeout(() => {
        if (loading) {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.remove();
            }, 600);
        }
        UI.show(menuId);
    }, 1800);

});