import { log, playAlert } from './utils.mjs';
import { getConfig, setConfig } from './config.mjs';

const NANAJAM_DOCCACHE = {};
const NANAJAM_COMMCACHE = {};

//navigator.serviceWorker.register(chrome.runtime.getURL('./scripts/serviceWorker.js'));

(async () => {
    const enabled = await getConfig("cafe.alert.enabled");

    if (!enabled) return;

    // setTimeout(() => {
    //     const alert_tester = document.createElement("div");
    //     alert_tester.style.position = "fixed";
    //     alert_tester.style.top = "5px";
    //     alert_tester.style.left = "20px";
    //     alert_tester.style.padding = "5px";
    //     alert_tester.style.backgroundColor = "#fee2e2";
    //     alert_tester.style.color = "#7f1d1d"
    //     alert_tester.style.opacity = "0.6"
    //     alert_tester.style.fontWeight = "700";
    //     alert_tester.style.lineHeight = "1.0";
    //     alert_tester.style.cursor = "pointer";

    //     alert_tester.innerHTML = "● TEST";
    //     alert_tester.onclick = () => {
    //         NANAJAM_ALERT("");
    //     }

    //     document.body.appendChild(alert_tester);

    // }, 1000);

    const notificationOptions = {
        extension: "INGDLC",
        title: await getConfig("cafe.alert.title"),
        body: await getConfig("cafe.alert.body"),
        image: await getConfig("cafe.alert.image"),
    }

    const NANAJAM_LINK_COMM = "https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberProfileCommentList?cafeId=31150943&memberKey=ze8OwS74I5rll5OlBTaoLQ&perPage=15&page=1&requestFrom=A";
    const NANAJAM_LINK_DOC = "https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberNetworkArticleListV1?search.cafeId=31150943&search.memberKey=ze8OwS74I5rll5OlBTaoLQ&search.perPage=15&search.page=1&requestFrom=A";
    // const NANAJAM_LINK_COMM = "https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberProfileCommentList?cafeId=31150943&memberKey=ze8OwS74I5rll5OlBTaoLQ&perPage=15&page=1&requestFrom=A";
    // const NANAJAM_LINK_DOC = "https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberNetworkArticleListV1?search.cafeId=31150943&search.memberKey=ze8OwS74I5rll5OlBTaoLQ&search.perPage=15&search.page=1&requestFrom=A";
  
    let NANAJAM_DOCID = 0;
    let NANAJAM_COMMID = 0;

    async function fetchArticleId() {
        try {
          const notificationOptions = {
            extension: "INGDLC",
            title: await getConfig("cafe.alert.title"),
            body: await getConfig("cafe.alert.body"),
            image: await getConfig("cafe.alert.image"),
          }
          const pArticleId = await getConfig("cafe.alert.articleId");
          const response = await fetch("https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberNetworkArticleListV1?search.cafeId=31150943&search.memberKey=ze8OwS74I5rll5OlBTaoLQ&search.perPage=15&search.page=1&requestFrom=A");
          const jsonData = await response.json();
          const articleId = jsonData.message.result.articleList[0].articleid;
          if (pArticleId != articleId) {
            console.log("articleid:", articleId);
            await setConfig("cafe.alert.articleId", articleId);
          }
        } catch(e) {
          console.log("Available after Login");
        }
        setTimeout(() => {
          fetchArticleId();
        }, 1000);
    }
      
    fetchArticleId();

    function NANAJAM_CHECK_COMM(){
        fetch(NANAJAM_LINK_COMM, {
            mode: 'no-cors'
        }).then(response => response.text()).then(async function (text){
            let v;
    
            try{
                text = text.split("\n");
                for (let i = 0; i < text.length; i++){
                    text[i] = text[i].trim()
                    let k = text[i].replace(/<td class="num" nowrap="nowrap">([0-9]+)<\/td>/, '$1');
                    if (k != text[i]){
                        v = parseInt(k);
                        break;
                    }
                }
            }catch (e){
                log("로그인 후 방장 알림이 작동됩니다.");
                return;
            }

            if (v && NANAJAM_COMMID != v && NANAJAM_COMMID && !NANAJAM_COMMCACHE[v]){
                await NANAJAM_ALERT(NANAJAM_LINK_COMM);
                NANAJAM_COMMCACHE[v] = true;
            }
            
            NANAJAM_COMMID = v;
    
            // console.log("[잉친쓰 DLC] 방장", "최근글번호 :", NANAJAM_DOCID, "최근댓글번호 :", NANAJAM_COMMID);

            setTimeout(NANAJAM_CHECK_COMM, 1000);
        }).catch(e => {
            log(e);
            setTimeout(NANAJAM_CHECK_COMM, 30000);
        });
    }
    
    function NANAJAM_CHECK_DOC(){
        fetch(NANAJAM_LINK_DOC, {
            mode: 'no-cors'
        }).then(response => response.json()).then(async function (jsonData){
            let v;
    
            try{
                let articleId = jsonData.message.result.articleList[0].articleid;
                


            }catch (e){
                log("로그인 후 알림이 작동됩니다.");
                return;
            }
    
            if (v && NANAJAM_DOCID != v && NANAJAM_DOCID && !NANAJAM_DOCCACHE[v]){
                await NANAJAM_ALERT(NANAJAM_LINK_DOC);
                NANAJAM_DOCCACHE[v] = true;
            }
    
            NANAJAM_DOCID = v;
    
            console.log("[잉친쓰 DLC] 방장", "최근글번호 :", NANAJAM_DOCID, "최근댓글번호 :", NANAJAM_COMMID);
            setTimeout(NANAJAM_CHECK_DOC, 1000);
        }).catch(e => {
            log(e);
            setTimeout(NANAJAM_CHECK_DOC, 1000);
        });
    }

    setTimeout(NANAJAM_CHECK_DOC, 3000);
    // NANAJAM_CHECK_COMM();

    const NANAJAM_ALERT = async (url) => {
        // let port;
        // function connect() {
        //   port = chrome.runtime.connect({name: 'foo'});
        //   port.onDisconnect.addListener(connect);
        //   port.onMessage.addListener(msg => {
        //     console.log('received', msg, 'from bg');
        //   });
        // }
        // connect();

        const latest = await getConfig("cafe.alert.latest");
        const now = Date.now();

        if (now - latest < 30 * 1000) return;

        await setConfig("cafe.alert.latest", now);

        const options = {
            ...notificationOptions,
            url
        }

        if (enabled == 1 || enabled == 3) chrome.runtime.sendMessage(options);
    
        if (enabled == 2 || enabled == 3) {
            playAlert(await getConfig("cafe.alert.volume") / 100);

            setTimeout(() => {
                const message = `[${options.title}]\n\n${options.body}\n\n해당 페이지로 이동하시겠습니까?`;
        
                if (confirm(message)) {
                    location.href = url;
                }
            }, 3000);
        }
    }

})();