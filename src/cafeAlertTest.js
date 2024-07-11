import { log, playAlert } from './utils.mjs';
import { getConfig, setConfig } from './config.mjs';

(async () => {
    const enabled = await getConfig("cafe.alert.enabled");
    const docLink = "https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberNetworkArticleListV1?search.cafeId=31150943&search.memberKey=ze8OwS74I5rll5OlBTaoLQ&search.perPage=15&search.page=1&requestFrom=A";
    const commLink = "https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberProfileCommentList?cafeId=31150943&memberKey=ze8OwS74I5rll5OlBTaoLQ&perPage=15&page=1&requestFrom=A";
    
    async function sendNoti() {
        if (!enabled) return;

        try {
          const notificationOptions = {
            extension: "INGDLC_ALERT",
            title: await getConfig("cafe.alert.title"),
            body: await getConfig("cafe.alert.body"),
            image: await getConfig("cafe.alert.image"),
            // pArticleId: await getConfig("cafe.alert.articleId"),
          }
          chrome.runtime.sendMessage(notificationOptions);
        } catch(e) {
          console.log(e);
        }
        setTimeout(() => {
          sendNoti();
        }, 3000);
    }
      
    sendNoti();
    // setInterval(sendNoti, 1000)



})();