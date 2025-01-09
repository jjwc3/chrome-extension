// import { getConfig, setConfig } from './config.mjs';

/*
카페 몰컴모드
현재 사용되지 않음.
 */

/*
let toggle = false;
let domCheck = false;
(async () => {

    const enabled = await getConfig("cafe.molcom.enabled");
    await setConfig("cafe.molcom.enabled", 2);
    console.log(enabled);
    if (!enabled) return;
    let firstLoad = true;

    const observer = new MutationObserver(() => {
        let iframe = document.getElementsByTagName('iframe').cafe_main.contentWindow.document;
        if (firstLoad) {
            if (enabled === 1) molcFirst(iframe);
            if (enabled === 2) {
                createButton(iframe);
                convFirst(iframe);
            }
            firstLoad = false;
        } else {
            if (enabled === 1) molcSecond(iframe);
            if (enabled === 2) {
                setTimeout(convSecond(iframe), 100);
            };
        }
    });
    observer.observe(document.getElementsByTagName("iframe").cafe_main, {
        childList: true,
        subtree: true,
        attributeOldValue: true,
    });
    setTimeout(() => {
        let btn = document.getElementById("INGDLC-MENU");
        let iframe = document.getElementsByTagName('iframe').cafe_main.contentWindow.document;
        btn.onclick = () => {
            if (toggle) {
                document.getElementById("cafe_main").width = "1080";
                document.getElementById("group-area").style.display = "none";
                document.getElementById("main-area").style.width = "1080px";
                iframe.getElementById("cafe-body").style.width = "1080px";
                iframe.getElementById("main-area").style.width = "1080px";
            } else {
                document.getElementById("cafe_main").width = "860";
                document.getElementById("group-area").style.display = "block";
                document.getElementById("main-area").style.width = "860px";
                iframe.getElementById("cafe-body").style.width = "860px";
                iframe.getElementById("main-area").style.width = "860px";
            }
            toggle = !toggle;
        }
    }, 1000);

})();

// enabled === 1

const molcFirst = (iframe) => {
    document.title = "Cafe"

    let cafeIntroCss = '#cafe-intro{display:none !important;}';
    let cafeIntroStyle = iframe.createElement('style');
    cafeIntroStyle.setAttribute('id', 'nanajam_style_iframe');

    if (cafeIntroStyle.styleSheet) cafeIntroStyle.styleSheet.cssText = cafeIntroCss;
    else cafeIntroStyle.appendChild(iframe.createTextNode(cafeIntroCss));

    iframe.head.appendChild(cafeIntroStyle);

    let css = '#front-img{ display:none !important; } img:not(.thumb_img, .btn_write), .figure-video{ opacity:0.05; } img:hover, .figure-video:hover{ opacity:1; } .profile_thumb:after{ content:none !important; }';
    let style = document.createElement('style');

    style.setAttribute('id', 'nanajam_style');
    
    if (style.styleSheet) style.styleSheet.cssText = css;
    else style.appendChild(document.createTextNode(css));
    
    document.head.appendChild(style);
}

function molcSecond() {

}



// enabled === 2

function createButton(iframe) {
    const btns = document.createElement("div");
    btns.style.position = "fixed";
    btns.style.top = "10px";
    btns.style.left = "10px";
    btns.style.zIndex = "999";
    btns.style.display = "flex";

    const createBtn = (text, id) => {
        const btn = document.createElement('button');
        btn.innerHTML = text;
        btn.style.background = "#FFF";
        btn.style.opacity = "0.7";
        btn.style.borderRadius = "20px";
        btn.style.padding = "5px 10px";
        btn.style.cursor = "pointer";
        btn.style.marginRight = "10px";
        btn.id = id;

        return btn;
    }

    const btn = createBtn("☰", "INGDLC-MENU");
    const btn최신 = createBtn("최신", "INGDLC-LATEST");
    btn최신.onclick = () => {
        document.getElementById("menuLink0").click();
    }

    let menuLinks = document.getElementsByClassName("gm-tcol-c");
    let smallTalk, humor;
    for (let i of menuLinks) {
        if (i.innerHTML.includes("잡담")) {
            smallTalk = i;
        } else if (i.innerHTML.includes("유우머")) {
            humor = i;
        }
    }
    const btn잡담 = createBtn("잡담", "INGDLC-SMALLTALK");
    btn잡담.onclick = () => {
        smallTalk.click();
    }

    const btn유우머 = createBtn("유우머", "INGDLC-HUMOR");
    btn유우머.onclick = () => {
        humor.click();
    }

    const btn글쓰기 = createBtn("글쓰기", "INGDLC-WRITE");
    btn글쓰기.onclick = () => {
        document.getElementsByClassName("cafe-write-btn")[0].childNodes[1].click();
    }

    btns.append(btn);
    btns.append(btn최신);
    btns.append(btn잡담);
    btns.append(btn유우머);
    btns.append(btn글쓰기);

    document.body.append(btns);
}


const convFirst = (iframe) => {
    document.getElementById("cafe_main").width = "1080";
    document.getElementById("group-area").style.display = "none";
    document.getElementById("main-area").style.width = "1080px";
    iframe.getElementById("cafe-body").style.width = "1080px";
    iframe.getElementById("main-area").style.width = "1080px";

    let documentCss = '#special-menu{ display:none; } .bbs_read_tit .tit_info{ font-size:40px; } .bbs_contents *{ font-size:28px !important; } .comment_section .comment_info .desc_info{ font-size:20px !important; } .txt_item{ font-size:18px !important; } .tbl_board_g td{ padding: 15px 0 !important; } .flexibled2_1 #wrap, .flexibled3_1 #wrap, .flexibled3_3 #wrap{ min-width:0; } body{ overflow-x:hidden; } .recent_list .tbl_board_g .td_board, .fav_list .tbl_board_g .td_board{ width:auto; } [class*=flexibled] .tbl_board_g .td_writer{ width:auto; } .tbl_board_g .td_date{ width:50px; } @media (max-width: 1200px) { .tbl_board_g .td_recommend{ display:none; } .tbl_board_g .td_look{ display:none; } .tbl_board_g .td_board{ display:none; } }';
    let documentStyle = document.createElement('style');
    documentStyle.setAttribute('id', 'nanajam_style');
    if (documentStyle.styleSheet) documentStyle.styleSheet.cssText = documentCss;
    else documentStyle.appendChild(document.createTextNode(documentCss));
    document.getElementsByTagName('head')[0].appendChild(documentStyle);
    
    let iframeCss = '#cafe-intro{ display:none; !important }';
    let iframeStyle = iframe.createElement('style');
    iframeStyle.setAttribute('id', 'nanajam_iframe_style');
    if (iframeStyle.styleSheet) iframeStyle.styleSheet.cssText = iframeCss;
    else iframeStyle.appendChild(iframe.createTextNode(iframeCss));
    iframe.getElementsByTagName('head')[0].appendChild(iframeStyle);
}

function convSecond(iframe) {
    if (toggle) {
        document.getElementById("cafe_main").width = "860";
        document.getElementById("group-area").style.display = "block";
        document.getElementById("main-area").style.width = "860px";
        iframe.getElementById("cafe-body").style.width = "860px";
        iframe.getElementById("main-area").style.width = "860px";
    } else {
        document.getElementById("cafe_main").width = "1080";
        document.getElementById("group-area").style.display = "none";
        document.getElementById("main-area").style.width = "1080px";
        iframe.getElementById("cafe-body").style.width = "1080px";
        iframe.getElementById("main-area").style.width = "1080px";
    }
}
*/