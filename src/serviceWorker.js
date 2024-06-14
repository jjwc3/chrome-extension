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

// https://cafe.naver.com/ca-fe/cafes/29844827/members/QXl99m0EULgw5jhw03oeLA 이 사이트에서 개발자 도구 열어서 network에서 뒤지다 보면 json 파일 나옴. 댓글도 똑같이 하면 될듯
async function fetchArticleId() {
  const response = await fetch("https://apis.naver.com/cafe-web/cafe-mobile/CafeMemberNetworkArticleListV1?search.cafeId=29844827&search.memberKey=QXl99m0EULgw5jhw03oeLA&search.perPage=15&search.page=1&requestFrom=A");
  const jsonData = await response.json();
  console.table(jsonData);
  const firstArticle = jsonData.message.result.articleList[0];
  const articleId = firstArticle.articleid;
  console.log("첫 번째 articleid:", articleId);
  // 여기서 articleId를 다른 변수에 저장하면 됩니다.
}

fetchArticleId();