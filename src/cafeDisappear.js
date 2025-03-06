import {getConfig} from './config.mts';

/*
카페 몰컴모드
 */
(async () => {
    const enabled = await getConfig("cafe.molcom.enabled");

    // const enabled = 2;

    setInterval(function () {
        try{
            if (!document.getElementById("cafe_main")) return;
            let iframeDocument = document.getElementById("cafe_main").contentDocument;
            if (!iframeDocument.getElementById('nanajam_style')){
                if (enabled === 0) noneMode();
                else if (enabled === 1) convenientMode();
                else if (enabled === 2) molcomMode();
                else {
                    convenientMode();
                    molcomMode();
                }

                // console.log("몰컴모드 적용 완료")
            }
        }catch(e){
            console.log(e)
        }
    }, 100);

})();

const noneMode = async () => {
    let iframeDocument = document.getElementById("cafe_main").contentDocument;
    let iframeCss = '.power_ad, .AdvertArea { display:none; } ';
    let iframeStyle = iframeDocument.createElement('style');
    iframeStyle.setAttribute('id', 'nanajam_style');
    if (iframeStyle.styleSheet) iframeStyle.styleSheet.cssText = iframeCss;
    else iframeStyle.appendChild(iframeDocument.createTextNode(iframeCss));
    iframeDocument.getElementsByTagName('head')[0].appendChild(iframeStyle);
}

const convenientMode = async () => {
    let iframeDocument = document.getElementById("cafe_main").contentDocument;
    let documentCss = '';
    let iframeCss = '.power_ad, .AdvertArea { display:none; }';
    let documentStyle = document.createElement('style');
    let iframeStyle = iframeDocument.createElement('style');

    documentStyle.setAttribute('id', 'nanajam_style_document');
    iframeStyle.setAttribute('id', 'nanajam_style');

    if (document.styleSheet) documentStyle.styleSheet.cssText = documentCss;
    else documentStyle.appendChild(document.createTextNode(documentCss));
    if (iframeStyle.styleSheet) iframeStyle.styleSheet.cssText = iframeCss;
    else iframeStyle.appendChild(iframeDocument.createTextNode(iframeCss));

    document.getElementsByTagName('head')[0].appendChild(documentStyle);
    iframeDocument.getElementsByTagName('head')[0].appendChild(iframeStyle);

    const btns = document.createElement("div");
    btns.style.position = "fixed";
    btns.style.top = "10px";
    btns.style.left = "10px";
    btns.style.zIndex = "999";
    btns.style.display = "flex";

    const createBtn = (text) => {
        const btn = document.createElement('button');
        btn.innerHTML = text;
        btn.style.background = "#FFF";
        btn.style.opacity = "0.7";
        btn.style.borderRadius = "20px";
        btn.style.padding = "5px 10px";
        btn.style.cursor = "pointer";
        btn.style.marginRight = "10px";
        btn.style.border = "2px solid black";

        return btn;
    }

    // const btn = createBtn("☰");
    //
    // let toggle = true;
    //
    // btn.onclick = () => {
    //     if (toggle) {
    //         document.getElementById("group-area").style.display = "block";
    //         // iframeDocument.getElementById("content").style.marginLeft = "230px";
    //     } else {
    //         document.getElementById("group-area").style.display = "none";
    //         // iframeDocument.getElementById("content").style.marginLeft = "0";
    //     }
    //
    //     toggle = !toggle;
    // }

    const btnLatest = createBtn("최신");
    btnLatest.onclick = () => {
        location.href = "https://cafe.naver.com/ArticleList.nhn?search.clubid=29844827&search.boardtype=L";
    }

    const btnChat = createBtn("잡담");
    btnChat.onclick = () => {
        location.href = "https://cafe.naver.com/ArticleList.nhn?search.clubid=29844827&search.menuid=38&search.boardtype=L";
    }

    const btnHumor = createBtn("유우머");
    btnHumor.onclick = () => {
        location.href = "https://cafe.naver.com/ArticleList.nhn?search.clubid=29844827&search.menuid=39&search.boardtype=L";
    }

    const btnWrite = createBtn("글쓰기");
    btnWrite.onclick = () => {
        window.open("https://cafe.naver.com/ca-fe/cafes/29844827/articles/write?boardType=L");
    }

    // btns.append(btn);
    btns.append(btnLatest);
    btns.append(btnChat);
    btns.append(btnHumor);
    btns.append(btnWrite);

    document.body.append(btns);
}

const molcomMode = async () => {
    setTimeout(()=>{document.title = "Cafe";},200);
    let iframeDocument = document.getElementById("cafe_main").contentDocument;

    let documentCss = ' img, #ia-info-data>ul>li.gm-tcol-c a img {opacity:0.05;} ';
    let iframeCss = '.power_ad, .AdvertArea { display:none; } #cafe-intro { display:none !important; } img { opacity:0.05; } img:hover { opacity:1; } ';
    let documentStyle = document.createElement('style');
    let iframeStyle = iframeDocument.createElement('style');

    documentStyle.setAttribute('id', 'nanajam_style_document');
    iframeStyle.setAttribute('id', 'nanajam_style');

    if (documentStyle.styleSheet) documentStyle.styleSheet.cssText = documentCss;
    else documentStyle.appendChild(document.createTextNode(documentCss));
    if (iframeStyle.styleSheet) iframeStyle.styleSheet.cssText = iframeCss;
    else iframeStyle.appendChild(iframeDocument.createTextNode(iframeCss));

    document.getElementsByTagName('head')[0].appendChild(documentStyle);
    iframeDocument.getElementsByTagName('head')[0].appendChild(iframeStyle);
}