import {playAlert} from './utils.mjs';
import {getConfig} from './config.mjs';

/*
카페 알림 기능
 */
(async () => {
    const enabled = await getConfig("cafe.alert.enabled");
    const notificationOptions = {
      extension: "INGDLC_ALERT",
      title: await getConfig("cafe.alert.title"),
      body: await getConfig("cafe.alert.body"),
      image: await getConfig("cafe.alert.image"),
    }
    const volume = await getConfig("cafe.alert.volume");

    /*
    바로 sendNoti() 호출하면 페이지 실행 전에 온 알림이 있으면 페이지 접속하자마자 알림 울림.
    이를 방지하기 위해 페이지에 처음 접속하고 sendNoti()가 실행되기 전 cafe.alert.articleId를 갱신함.
    extension: "INGDLC_FIRSTALERT"로 serviceWorker.js에 메세지 전송. serviceWorker에서 갱신.
     */
    async function firstSetArticldId() {
        if (!enabled) return;

        try {
            await chrome.runtime.sendMessage({
                extension: "INGDLC_FIRSTALERT",
            });
        } catch(e) {
            console.log(e);
        }
    }

    await firstSetArticldId();

    /*
    3초마다 반복되는 새 글 확인
    serviceWorker.js에 notificationOptions 전송. serviceWorker에서 알림 전송.
     */
    async function sendNoti() {
        if (!enabled) return;

        try {
          await chrome.runtime.sendMessage(notificationOptions);
        } catch(e) {
          console.log(e);
        }
        setTimeout(() => {
          sendNoti();
        }, 3000);
    }
      
    await sendNoti();

    /*
    serviceWorker.js에서 메세지를 받고 브라우저 알림(cafe.alert.enabled == 2 or 3) 전송(confirm)
     */
    chrome.runtime.onMessage.addListener((request) => {
      if (request.extension !== "INGDLC_REALERT") return;
      playAlert(volume/100);
      setTimeout(() => {
        if (confirm(`[${notificationOptions.title}]\n${notificationOptions.body}\n해당 페이지로 이동하시겠습니까?`)) {
          location.href = request.message;
        }
      }, 3000);
    });
})();