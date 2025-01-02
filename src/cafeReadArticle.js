import {getConfig, setConfig} from './config.mjs';

if (window.hasRun) {
    console.log("Script already running");
    return;
}
window.hasRun = true;


(async () => {
    const enabled = await getConfig("cafe.read.enabled");

    if (!enabled) return;

    setTimeout(async () => {
        console.log('enabled');
        // console.log(window);

        const iframe = document.getElementById("cafe_main");

        const pathname = window.location.pathname;
        // const cafename = window.g_sCafeHome.split('/').pop();
        // const cafename = document.querySelectorAll(".cafe_link")[0].innerHTML.split('/').pop();
        const cafename = iframe.src.split('clubid=')[1];
        console.log(`pathname: ${pathname}, cafename: ${cafename}`)

        if (isNumericString(pathname.split('/')[2])) { // 게시글인 경우
            const readArticle = await setReadArticle(cafename, Number(pathname.split('/')[2]));
            const relatedArticleList = document.querySelectorAll(".tit");
            relatedArticleList.forEach((t) => {
                if (readArticle.includes(Number(t.href.split("articleid=")[1]))) {
                    t.style.color = "#959595";
                }
            })
        } else if (pathname.split('/')[1].includes("ArticleList.nhn") || pathname.split('/')[1].includes("ca-fe")){ // 게시판 또는 인기글인 경우
            const readArticle = await getReadArticle(cafename);
            const articleList = document.querySelectorAll(".article");
            articleList.forEach((t) => {
                if (readArticle.includes(Number(t.href.split('articleid=')[1].split('&')[0]))) {
                    if (getComputedStyle(t).color === 'rgb(255, 78, 89)') {
                        t.color = '#ffb7bc';
                    } else {
                        t.color = '#959595';
                    }
                }
            })
        } else if (pathname.split('/')[1]) { // 카페 메인인 경우
            const readArticle = await getReadArticle(cafename);
            // 우정잉 올림 or 공지사항
            const articleList = iframe.querySelectorAll(".article");
            console.log(articleList);
            articleList.forEach((t) => {
                if (readArticle.includes(Number(t.href.split('articleid=')[1].split('&')[0]))) {
                    if (getComputedStyle(t).color === 'rgb(255, 78, 89)') {
                        t.color = '#ffb7bc';
                    } else {
                        t.color = '#959595';
                    }
                }
            })
            // 팬메이드 or 움짤/캡쳐/직찍
            const imgArticleList = document.querySelectorAll(".tit");
            imgArticleList.forEach((t) => {
                if (readArticle.includes(Number(t.children[0].href.split('articleid=')[1]))) {
                    t.children[0].style.color = '#959595';
                }
            })
        }
    }, 3000);


    const getReadArticle = async (cafeName) => {
        if (!await getConfig('cafe.read.read').cafeName) {
            await setConfig(`cafe.read.read.${cafeName}`, []);
        }
        return await getConfig(`cafe.read.read.${cafeName}`);
    }

    const setReadArticle = async (cafeName, articleId) => {
        const getData = await getReadArticle(cafeName);
        getData.push(articleId);
        await setConfig(`cafe.read.read.${cafeName}`, getData);
        return getData;
    }

    const isNumericString = (str) => !isNaN(str) && str.trim() !== "" && Number.isFinite(Number(str));



})();