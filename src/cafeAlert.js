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

    const NANAJAM_LINK_COMM = "https://cafe.daum.net/_c21_/member_cmt_search?grpid=1YV3j&fldid=&enc_userid=Yt6bBuAqTIk0&nickname=우정잉";
    const NANAJAM_LINK_DOC = "https://cafe.naver.com/ca-fe/cafes/29844827/members/QXl99m0EULgw5jhw03oeLA";
    // const NANAJAM_LINK_COMM = "https://cafe.daum.net/_c21_/member_cmt_search?grpid=1YV3j&fldid=&enc_userid=FgcxpiZs-LQ0&nickname=우정나라할매국밥";
    // const NANAJAM_LINK_DOC = "https://cafe.daum.net/_c21_/member_article_cafesearch?grpid=1YV3j&item=writer&nickname=7Jqw7KCV64KY65287ZWg66ek6rWt67Cl&nickname_enc=base64&enc_userid=FgcxpiZs-LQ0";

    let NANAJAM_DOCID = 0;
    let NANAJAM_COMMID = 0;

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
        }).then(response => response.text()).then(async function (text){
            let v;
    
            try{
                text = text.split("\n");
    
                for (let i = 0; i < text.length; i++){
                    text[i] = text[i].trim()
                    // console.log(text[i]);
                    // let k = text[i].replace(/<td class="num" nowrap="nowrap">([0-9]+)<\/td>/, '$1');
                    if (k != text[i]){
                        v = parseInt(k);
                        break;
                    }
                }
            }catch (e){
                log("로그인 후 방장 알림이 작동됩니다.");
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