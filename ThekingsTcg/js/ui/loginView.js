/**
 * LoginView.js — Tela de Primeiro Login
 * Aparece após o loading quando firstLogin === true.
 * O jogador digita o nome, vê o avatar gerado automaticamente e confirma.
 * Ao confirmar: recebe deck inicial aleatório e entra no jogo.
 */

const LoginView = {

    render() {
        const nameInput  = document.getElementById('login-name-input');
        const avatarEl   = document.getElementById('login-avatar-preview');

        // Atualiza avatar ao vivo conforme digita o nome
        if (nameInput) {
            nameInput.value = '';
            nameInput.addEventListener('input', () => {
                this.updateAvatar(nameInput.value.trim() || 'Rei da Arena');
            });
        }

        // Avatar inicial com seed padrão
        this.updateAvatar('Rei da Arena');
    },

    updateAvatar(seed) {
        const avatarEl = document.getElementById('login-avatar-preview');
        if (!avatarEl) return;
        const url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;
        avatarEl.style.backgroundImage = `url('${url}')`;
    },

    confirm() {
        const nameInput = document.getElementById('login-name-input');
        const name = nameInput ? nameInput.value.trim() : '';

        if (!name || name.length < 2) {
            UI.t('Digite um nome com pelo menos 2 caracteres!');
            return;
        }

        // Salva o nome do jogador
        S.player.name   = name;
        S.player.avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

        // Sorteia e dá o deck inicial
        const starter = StarterDeck.giveStarterDeck();

        // Marca que o primeiro login foi concluído
        S.firstLogin = false;

        // Salva tudo
        Save.save();

        // Mostra mensagem de boas-vindas com o deck sorteado
        UI.t(`Bem-vindo, ${name}! Deck recebido: ${starter.name}`);

        // Vai para o menu principal
        setTimeout(() => {
            UI.show('menu-screen-new');
            Menu.updateHeader();
        }, 1500);
    }
};

window.LoginView = LoginView;
