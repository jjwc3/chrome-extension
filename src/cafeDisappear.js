import { log } from './utils.mjs';
import { getConfig, setConfig } from './config.mjs';

(async () => {

    const enabled = await getConfig("cafe.molcom.enabled");
    await setConfig("cafe.molcom.enabled", 1);
    console.log(enabled);
    if (!enabled) return;

    setInterval(function () {
        try{
            document.getElementById("cafe-body");
            if (!document.getElementById('nanajam_style')){
                if (enabled === 1) inject();
                else inject2();

                log("Mode Applied")
            }
        }catch(e){
            console.log(e)
        }
    }, 100);
})();

document.addEventListener('DOMNodeInserted', function() {
    let element = document.getElementById('post_1');
    if (element) {
        element.style.display = 'none';
    }
});

const inject = () => {
    document.title = "Cafe"

    let css = '#front-img, #post_1{ display:none !important; } img:not(.thumb_img, .btn_write), .figure-video{ opacity:0.05; } img:hover, .figure-video:hover{ opacity:1; } .profile_thumb:after{ content:none !important; }';
    let style = document.createElement('style');
    // setTimeout(console.log(document.getElementById("post_1")), 2000);

    style.setAttribute('id', 'nanajam_style');
    // console.log(style.styleSheet);
    
    if (style.styleSheet) style.styleSheet.cssText = css;
    else style.appendChild(document.createTextNode(css));
    
    document.head.appendChild(style);
}

const inject2 = () => {
    let css = '#group-area{ display:none; flex-direction:column-reverse; } #TITLEMENUGROUP{ display:none; } .type2_1 #content{ margin-left:0; } .bbs_read_tit .tit_info{ font-size:40px; } .bbs_contents *{ font-size:28px !important; } .comment_section .comment_info .desc_info{ font-size:20px !important; } .txt_item{ font-size:18px !important; } .tbl_board_g td{ padding: 15px 0 !important; } .flexibled2_1 #wrap, .flexibled3_1 #wrap, .flexibled3_3 #wrap{ min-width:0; } body{ overflow-x:hidden; } .recent_list .tbl_board_g .td_board, .fav_list .tbl_board_g .td_board{ width:auto; } [class*=flexibled] .tbl_board_g .td_writer{ width:auto; } .tbl_board_g .td_date{ width:50px; } @media (max-width: 1200px) { .tbl_board_g .td_recommend{ display:none; } .tbl_board_g .td_look{ display:none; } .tbl_board_g .td_board{ display:none; } }';
    let style = document.createElement('style');

    style.setAttribute('id', 'nanajam_style');
    
    if (style.styleSheet) style.styleSheet.cssText = css;
    else style.appendChild(document.createTextNode(css));
    
    document.getElementsByTagName('head')[0].appendChild(style);

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

        return btn;
    }

    const btn = createBtn("☰");

    let toggle = true;

    btn.onclick = () => {
        if (toggle) {
            document.getElementById("cafemenu").style.display = "flex";
            document.getElementById("content").style.marginLeft = "230px";
        } else {
            document.getElementById("cafemenu").style.display = "none";
            document.getElementById("content").style.marginLeft = "0";
        }

        toggle = !toggle;
    }

    const btn최신 = createBtn("최신");
    btn최신.onclick = () => {
        location.href = "https://cafe.daum.net/_c21_/recent_bbs_list?grpid=1YV3j";
    }

    const btn잡담 = createBtn("잡담");
    btn잡담.onclick = () => {
        location.href = "https://cafe.daum.net/_c21_/bbs_list?grpid=1YV3j&fldid=pr4o";
    }

    const btn유우머 = createBtn("유우머");
    btn유우머.onclick = () => {
        location.href = "https://cafe.daum.net/_c21_/bbs_list?grpid=1YV3j&fldid=pr4n";
    }

    const btn글쓰기 = createBtn("글쓰기");
    btn글쓰기.onclick = () => {
        location.href = "https://cafe.daum.net/_c21_/united_write?grpid=1YV3j&fldid=&page=1";
    }

    btns.append(btn);
    btns.append(btn최신);
    btns.append(btn잡담);
    btns.append(btn유우머);
    btns.append(btn글쓰기);

    document.body.append(btns);
}