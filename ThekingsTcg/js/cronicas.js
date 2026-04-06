const CronicasUI = (() => {
    let current = 0;

    function syncUI() {
        document.querySelectorAll('.cron-page').forEach((page, i) => {
            page.classList.toggle('active', i === current);
        });

        document.querySelectorAll('.cron-tab').forEach((tab, i) => {
            tab.classList.toggle('active', i === current);
        });

        const activeTab = document.querySelector('.cron-tab.active');
        if (activeTab) {
            activeTab.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }

        const body = document.querySelector('#cronicas-screen .cron-body');
        if (body) body.scrollTop = 0;
    }

    function openChapter(index = 0) {
        const total = document.querySelectorAll('.cron-page').length;
        if (!total) return;
        if (index < 0) index = 0;
        if (index >= total) index = total - 1;
        current = index;
        syncUI();
    }

    function next() {
        openChapter(current + 1);
    }

    function prev() {
        openChapter(current - 1);
    }

    return { openChapter, next, prev };
})();