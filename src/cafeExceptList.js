import { getConfig } from './config.mts';

/*
카페 전체글 보기에서 특정 게시판 제외
 */
(async () => {
    let exceptList = (await getConfig("cafe.exceptList.list")).trim();
    if (exceptList === "") return;

    const mainFunc = async () => {
        try {
            setTimeout(async () => {
                if (!window.location.href.includes("ArticleList.nhn?search.clubid=29844827&search.boardtype=L")) return;
                const articleList = document.getElementById("cafe_main").contentDocument.querySelectorAll(".td_article");
                articleList.forEach((t) => {
                    try {
                        const listName = t?.querySelector(".board-name")?.querySelector(".inner_name")?.firstElementChild?.innerHTML;
                        if (exceptList.includes(listName)) {
                            t.parentElement.style.display = "none";
                        }
                    } catch (e) {
                        console.log(e);
                    }
                })
            }, 100)

        } catch (e) {
            console.log(e);
        }
    }

    const observer = new MutationObserver(() => {
        if (!(document.title === "Cafe")) mainFunc();
    });
    observer.observe(document.querySelector("title"), {
        childList: true,
        subtree: true,
    });

    await mainFunc();
})();