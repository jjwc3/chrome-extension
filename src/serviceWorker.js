import { getConfig, setConfig } from './config.mjs';

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (details.url.endsWith('playlist.m3u8')) {
        if (details.url.includes('hls')) {
          chrome.tabs.sendMessage(details.tabId, {url: details.url});
          console.log(details.url);
        }
      }
    },
    {urls: ['<all_urls>']}
  );



const docLink = "https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberNetworkArticleListV1?search.cafeId=31150943&search.memberKey=ze8OwS74I5rll5OlBTaoLQ&search.perPage=15&search.page=1&requestFrom=A";
const commLink = "https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberProfileCommentList?cafeId=31150943&memberKey=ze8OwS74I5rll5OlBTaoLQ&perPage=15&page=1&requestFrom=A";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.extension !== "INGDLC_ALERT") return;
  console.log('responded');
  fetchArticleId(request);
});

const notifications = {};
async function fetchArticleId(r) {
  try {
    const pArticleId = await getConfig("cafe.alert.articleId");
    const response = await fetch(docLink);
    const jsonData = await response.json();
    const articleId = jsonData.message.result.articleList[0].articleid;
    // console.log(articleId);
    if (pArticleId == articleId) return;

    await setConfig("cafe.alert.articleId", articleId);
    const id = 'NANAJAM777_NOTI_' + Math.random();
    chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: `../icons/${r.image}.png`,
      title: r.title,
      message: r.body,
      priority: 2
    }, function (id){
        notifications[id] = `https://cafe.naver.com/ingtesttest/${articleId}`
    })
    // chrome.runtime.sendMessage();
    } catch(e) {
      console.log("Available after Login");
    }
}

chrome.notifications.onClicked.addListener(function (id) {
  chrome.tabs.create({
    url: notifications[id]
  });
})