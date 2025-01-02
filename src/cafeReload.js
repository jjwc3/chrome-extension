// 네이버 카페 새로고침 by getCurrentThread
// Modified: jQuery to VanillaJS

(() => {
    // If it is set to a detailed match on the manifest, it sometimes fails, so the exception is handled like this...
    if (window.name !== 'cafe_main') return;

    try {
        let _done = false;
        const url = document.location.href;
        console.log(url);

        // 1. If it is the main site, change the browser address to the global variable Cafe address url. 'g_sCafeHome'
        if (url.includes('cafe.naver.com/MyCafeIntro.nhn')) {
            console.log(1);
            const event = new CustomEvent('reset');
            document.documentElement.setAttribute('onreset', 'window.parent.history.replaceState(null, null, g_sCafeHome);');
            document.documentElement.dispatchEvent(event);
            document.documentElement.removeAttribute('onreset');
            return;
        }

        // 2. Change the browser address to the current main content url.
        if (!['ArticleRead.nhn', '/articles/'].some(x => url.includes(x))) {
            console.log(2);
            window.parent.history.replaceState(null, null, url);
        }

        // 3. If it is a post, change it to a clearer address url.
        const observer = new MutationObserver((mutations, observer) => {
            const spiBtn = document.querySelector('a#spiButton.naver-splugin');
            if (spiBtn) {
                console.log(3);
                const inUrl = spiBtn.getAttribute('data-url');
                if (inUrl != null) {
                    console.log(4);
                    window.parent.history.replaceState(null, null, inUrl);
                    _done = true;
                    observer.disconnect(); // Stop observing once the button is found
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 4. If some time has passed, it is assumed that the url is not a post.
        setTimeout(() => {
            if (!_done) {
                console.log(5);
                window.parent.history.replaceState(null, null, url);
                observer.disconnect();
            }
        }, 500);
    } catch (e) {
        console.log("error: ", e);
    }
})();
