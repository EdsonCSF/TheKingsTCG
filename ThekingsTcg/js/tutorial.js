const TutorialUI = (() => {
    const TOTAL = 10;
    let current = 0;

    function syncUI() {
        document.querySelectorAll('.tut-page').forEach((page, i) => {
            page.classList.toggle('active', i === current);
        });

        document.querySelectorAll('.tut-tab').forEach((tab, i) => {
            tab.classList.toggle('active', i === current);
        });

        document.querySelectorAll('.tut-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });

        const activeTab = document.querySelector('.tut-tab.active');
        if (activeTab) {
            activeTab.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }

        const body = document.querySelector('#tutorial-screen .tut-body');
        if (body) body.scrollTop = 0;
    }

    function go(index) {
        if (index < 0) index = 0;
        if (index >= TOTAL) index = TOTAL - 1;
        current = index;
        syncUI();
    }

    function next() {
        go(current + 1);
    }

    function prev() {
        go(current - 1);
    }

    function reset() {
        current = 0;
        syncUI();
    }

    return { go, next, prev, reset };
})();