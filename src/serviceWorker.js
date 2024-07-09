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


async function fetchArticleId() {
  try {
    const pArticleId = await getConfig("cafe.alert.articleId");
    const response = await fetch("https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberNetworkArticleListV1?search.cafeId=31150943&search.memberKey=ze8OwS74I5rll5OlBTaoLQ&search.perPage=15&search.page=1&requestFrom=A");
    const jsonData = await response.json();
    const articleId = jsonData.message.result.articleList[0].articleid;
    console.log("첫 번째 articleid:", articleId);
    if (pArticleId != articleId) {
      await setConfig("cafe.alert.articleId", articleId);
      const id = 'NANAJAM777_NOTI_' + Math.random();

      chrome.notifications.create(id, {
          type: 'basic',
          iconUrl: `../icons/${request.image}.png`,
          title: request.title,
          message: request.body,
          priority: 2
      }, function (id){
          notifications[id] = request.url
      })
    }
    

  } catch(e) {
    console.log("잉친쓰 로그인 후 이용 가능");
  }
  setTimeout(() => {
    fetchArticleId();
  }, 1000);
}

fetchArticleId();