import {playAlert} from './utils.mjs';
import { getConfig } from './config.mjs';

(async () => {
    const enabled = await getConfig("cafe.alert.enabled");
    const notificationOptions = {
      extension: "INGDLC_ALERT",
      title: await getConfig("cafe.alert.title"),
      body: await getConfig("cafe.alert.body"),
      image: await getConfig("cafe.alert.image"),
    }
    const volume = await getConfig("cafe.alert.volume");
     
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

    chrome.runtime.onMessage.addListener((request) => {
      if (request.extension !== "INGDLC_REALERT") return;
      console.log(volume);
      playAlert(volume/100);
      setTimeout(() => {
        if (confirm(`[${notificationOptions.title}]\n${notificationOptions.body}\n해당 페이지로 이동하시겠습니까?`)) {
          location.href = request.message;
        }
      }, 3000);
    });
})();