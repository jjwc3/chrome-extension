/*
네이버 카페 가끔씩 게시판보기에서 iframe을 사용하지 않아 cafeReload, cafeReadArticle이 제대로 작동하지 않는 현상 발생
모든 ca-fe/~~~를 iframe을 사용하는 ArticleList.nhn으로 변경(인기글, 프로필 제외)
 */
(async () => {
    const mainFunc = async () => {
        const menuItems = document.querySelectorAll('[role="menuitem"]');
        menuItems.forEach((menuItem) => {
            if (menuItem.hasAttribute("href")) {
                const href = menuItem.getAttribute("href");
                if (href.includes("ArticleList.nhn") || href.includes("popular")) return;
                // if (href.includes("popular")) return;
                const cafeId = href.split('cafes/')[1].split('/')[0];
                const menuId = href.split('menus/')[1].split('/')[0];
                let newHref;
                if (menuId === '0') {
                    newHref = `https://cafe.naver.com/ArticleList.nhn?search.clubid=${cafeId}&search.boardtype=L`;
                } else {
                    newHref = `https://cafe.naver.com/ArticleList.nhn?search.clubid=${cafeId}&search.menuid=${menuId}&search.boardtype=L`;
                }
                menuItem.addEventListener("click", function(e) {
                    e.preventDefault();
                    if (newHref) {
                        window.location.href = newHref;
                    }
                })
                menuItem.setAttribute('href', newHref);
            }
        })
        return 1;
    }

    const observer = new MutationObserver(async () => {
        if (!document.getElementById("cafe_main")) {
            if (await mainFunc() === 1) {
                observer.disconnect();
                setTimeout(() => {
                    observer.observe(document.querySelector("head"), {
                        childList: true,
                        subtree: true,
                        characterData: true,
                        attributes: true,
                    })
                }, 1000)
            }
        }
    });
    observer.observe(document.querySelector("head"), {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
    });


    if (await mainFunc() === 1) {
        observer.disconnect();
        setTimeout(() => {
            observer.observe(document.querySelector("head"), {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true,
            })
        }, 1000)
    }
})()