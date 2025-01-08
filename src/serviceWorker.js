import { getConfig, setConfig } from './config.mjs';

// Network 요청 중 'playlist.m3u8'로 끝나고, 중간에 'hls' 들어간 요청 찾아서 url 전송
chrome.webRequest.onBeforeRequest.addListener(async function(details) {
      if (details.url.endsWith('playlist.m3u8')) {
        if (details.url.includes('hls')) {
          await chrome.tabs.sendMessage(details.tabId, {url: details.url});
          // console.log(details.url);
        }
      }
    },
    {urls: ['<all_urls>']}
  );

// const docLink = "https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberNetworkArticleListV1?search.cafeId=29844827&search.memberKey=QXl99m0EULgw5jhw03oeLA&search.perPage=15&search.page=1&requestFrom=A";
const docLink = "https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberNetworkArticleListV1?search.cafeId=31150943&search.memberKey=ze8OwS74I5rll5OlBTaoLQ&search.perPage=15&search.page=1&requestFrom=A";
// const commLink = "https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberNetworkReplyListV1?search.clubid=29844827&search.memberKey=QXl99m0EULgw5jhw03oeLA&search.perPage=15&search.page=1&requestFrom=A";
// Service Worker에서 fetch API 사용할 경우 manifest.json host_permissions에 도메인 추가해야 함... 이것때문에 개뻘짓했네

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.extension === "INGDLC_ALERT") {
    // console.log('after responded');
    await fetchArticleId(request);
  } else if (request.extension === "INGDLC_FIRSTALERT") {
    // console.log('first responded')
    await fetchFirstArticleId();
  }
});

const notifications = {};

async function fetchFirstArticleId() {
  try {
    const articleResponse = await fetch(docLink, {
      mode: "no-cors"
    });
    const articleJson = await articleResponse.json();
    const articleId = articleJson.message.result.articleList[0].articleid;
    // console.log("first = " + articleId);
    await setConfig("cafe.alert.articleId", articleId);
  } catch (e) {
    console.error(`Available after Login : ${e}`);
  }
}

async function fetchArticleId(r) {
  try {
    const enabled = await getConfig("cafe.alert.enabled");
    const pArticleId = await getConfig("cafe.alert.articleId");
    const articleResponse = await fetch(docLink);
    const articleJson = await articleResponse.json();
    const articleId = articleJson.message.result.articleList[0].articleid;
    // console.log(articleId);
    if (pArticleId >= articleId) return;

    const url = `https://cafe.naver.com/ingsfriends/${articleId}`
    await setConfig("cafe.alert.articleId", articleId);
    const id = 'NANAJAM777_NOTI_' + Math.random();
    if (enabled === 1 || enabled === 3) {
      chrome.notifications.create(id, {
        type: 'basic',
        iconUrl: `../icons/${r.image}.png`,
        title: r.title,
        message: r.body,
        priority: 2
      }, function (id){
          notifications[id] = url
      })
    }
    if (enabled === 2 || enabled === 3) {
      chrome.tabs.query({ active: true, currentWindow: true }, (pages) => {
        chrome.tabs.sendMessage(pages[0].id, {
          extension: "INGDLC_REALERT",
          message: url
        });
      });
    }
  } catch(e) {
    console.error(`Available after Login : ${e}`)
  }
}

// async function fetchCommId(r) {
//   try {
//     const enabled = await getConfig("cafe.alert.enabled");
//     const pCommId = await getConfig("cafe.alert.commId");
//     const commResponse = await fetch(commLink);
//     const commJson = await commResponse.json();
//     const commId = commJson.message.result.comments[0].commentId;
//     const commArticleId = commJson.message.result.comments[0].articleId;
//     if (pCommId >= commId) return;
//     const url = `https://cafe.naver.com/ingtesttest/${commArticleId}`
//     await setConfig("cafe.alert.commId", commId);
//     const id = 'NANAJAM777_NOTI_' + Math.random();
//     if (enabled == 1 || enabled == 3) {
//       chrome.notifications.create(id, {
//         type: 'basic',
//         iconUrl: `../icons/${r.image}.png`,
//         title: r.title,
//         message: r.body,
//         priority: 2
//       }, function (id){
//           notifications[id] = url
//       })
//     }
//     if (enabled == 2 || enabled == 3) {
//       chrome.tabs.query({ active: true, currentWindow: true }, (pages) => {
//         chrome.tabs.sendMessage(pages[0].id, {
//           extension: "INGDLC_REALERT",
//           message: url
//         });
//       });
//     }
//   } catch(e) {
//     console.log("Available after Login");
//   }
// }

// 운영체제 알림 생성
chrome.notifications.onClicked.addListener(function (id) {
  chrome.tabs.create({
    url: notifications[id]
  });
})