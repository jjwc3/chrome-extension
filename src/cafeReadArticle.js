import {getConfig, setConfig} from './config.mts';

/*
카페 읽은 글 표시
 */
(async () => {
    const enabled = await getConfig("cafe.read.enabled");
    if (!enabled) return;
    // let timeOut;

    const mainFunc = async () => {
        try {
            setTimeout(async () => {

                if (window.location.href.includes("/members/") || window.location.href.includes("/popular")) {
                    return;
                }

                const iframe = document.getElementById("cafe_main");
                let iframeDocument;
                if (iframe) {
                    iframeDocument = iframe.contentDocument;
                }

                // const enabled = await getConfig("cafe.read.enabled");
                // if (!enabled) return;

                const pathname = window.location.pathname;
                let cafename;
                if (iframe) {
                    if (iframe.src.includes("clubid")) cafename = iframe.src.split('clubid=')[1].split('&')[0];
                    else if (iframe.src.includes("/articles/")) cafename = iframe.src.split('/articles')[1].split('?')[0];
                    else {
                        return;
                    }
                } else {
                    cafename = pathname.split("cafes/")[1].split('/')[0];
                }



                if (isNumericString(pathname.split('/')[2])) { // 게시글인 경우
                    const readArticle = await setReadArticle(cafename, Number(pathname.split('/')[2]));
                    const relatedArticleList = iframeDocument.querySelectorAll(".tit");
                    relatedArticleList.forEach((t) => {

                        if (readArticle.includes(Number(t.href.split("articleid=")[1]))) {
                            t.style.color = "#959595";
                        }
                    })
                } else if (pathname.split('/')[1].includes("ArticleList.nhn") || pathname.split('/')[1].includes("ca-fe")){ // iframe 게시판 또는 인기글 또는 프로필인 경우
                    const readArticle = await getReadArticle(cafename);
                    const articleList = iframeDocument.querySelectorAll(".article");
                    articleList.forEach((t) => {
                        if (readArticle.includes(Number(t.href.split('articleid=')[1].split('&')[0]))) {
                            if (getComputedStyle(t).color === 'rgb(255, 78, 89)') {
                                t.style.color = '#ffb7bc';
                            } else {
                                t.style.color = '#959595';
                            }
                        }
                    })
                } else if (pathname.split('/')[1] === "f-e") { // non-iframe 게시판인 경우
                    console.log("#board");
                    const readArticle = await getReadArticle(cafename);
                    const articleList = document.querySelectorAll(".article");
                    articleList.forEach((t) => {
                        if (readArticle.includes(Number(t.href.split('/articles/')[1].split('?menuid=')[0]))) {
                            if (getComputedStyle(t).color === 'rgb(255, 78, 89)') {
                                t.style.color = '#ffb7bc';
                            } else {
                                t.style.color = '#959595';
                            }
                        }
                    })

                }else if (pathname.split('/')[1]) { // 카페 메인인 경우
                    console.log("#main");
                    const readArticle = await getReadArticle(cafename);
                    // 우정잉 올림 or 공지사항
                    const articleList = iframeDocument.querySelectorAll(".article");
                    articleList.forEach((t) => {
                        if (readArticle.includes(Number(t.href.split('articleid=')[1].split('&')[0]))) {
                            if (getComputedStyle(t).color === 'rgb(255, 78, 89)') {
                                t.style.color = '#ffb7bc';
                            } else {
                                t.style.color = '#959595';
                            }
                        }
                    })
                    // 팬메이드 or 움짤/캡쳐/직찍
                    const imgArticleList = iframeDocument.querySelectorAll(".tit");
                    imgArticleList.forEach((t) => {
                        if (readArticle.includes(Number(t.children[0].href.split('articleid=')[1]))) {
                            t.children[0].style.color = '#959595';
                        }
                    })
                }
            }, 500);
            // clearInterval(timeOut);
        } catch (e) {
            console.log(e);
        }
    }

    // timeOut = setInterval(async () => {
    //     await mainFunc();
    // }, 200)


    const getReadArticle = async (cafeName) => {
        if (!(await getConfig(`cafe.read.read.${cafeName}`))) {
            await setConfig(`cafe.read.read.${cafeName}`, []);
        }
        return await getConfig(`cafe.read.read.${cafeName}`);
    }

    const setReadArticle = async (cafeName, articleId) => {
        const getData = await getReadArticle(cafeName);
        if (!getData.includes(articleId)) getData.push(articleId);
        await setConfig(`cafe.read.read.${cafeName}`, getData);
        return getData;
    }

    const isNumericString = (str) => !isNaN(str) && str.trim() !== "" && Number.isFinite(Number(str));


    const observer = new MutationObserver((mutations) => {
        console.log("#C");
        console.table(mutations);
        if (!(document.querySelector("head").querySelector("title").innerHTML === "Cafe")) {
            mainFunc();
        }
    });
    observer.observe(document.querySelector("head"), {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
    });

    await mainFunc();
})();