const AudioManager = {
  bgMusic: null,
  unlocked: false,

  init() {
    if (this.bgMusic) return;
    this.bgMusic = document.getElementById('bg-music');
    if (!this.bgMusic) {
      console.warn('bg-music não encontrado');
      return;
    }
    this.bgMusic.volume = 0.5;
  },

  unlock() {
    if (this.unlocked) return;

    this.init();
    if (!this.bgMusic) return;

    // Tenta tocar para ativar o contexto de áudio do navegador
    this.bgMusic.play().then(() => {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
      this.bgMusic.muted = false;
      this.unlocked = true;
      console.log('🔓 Áudio desbloqueado');
    }).catch(err => {
      console.warn('Bloqueio de áudio:', err);
    });
  },

  playMenu() {
    if (!this.unlocked) return;
    this.bgMusic.play().catch(()=>{});
  },

  stop() {
    if (!this.bgMusic) return;
    this.bgMusic.pause();
  }
};