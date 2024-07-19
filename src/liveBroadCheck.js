let checkIntervalFlag = false;

setTimeout(() => {
    const userId = window.szBjId.value;
    const notBroading = document.getElementById("notBroadingList").style.cssText;
    if(!notBroading.includes("display")){
        checkLoop(userId);
    }
    const broadOffTarget = document.getElementById('layerAirOff');
    const observer = new MutationObserver(mutations => {
        mutations.forEach(function(mutation) {
            // 스타일 속성의 변경을 확인
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                // 스타일 속성이 변경된 요소
                let targetElement = mutation.target;
                // 변경된 스타일 속성 가져오기
                let newStyle = targetElement.style.cssText;
                // 방종을 하면 layerAirOff 요소에 "display: block" 이 추가됩니다.
                if (newStyle.includes('display: block')) {
                    checkLoop(userId);
                }
            }
        });
    })
    // 감시할 대상 요소 및 구성 옵션
    const config = { attributes: true, attributeFilter: ['style'], subtree: false };
    // 감시 시작
    observer.observe(broadOffTarget, config);
},1000)

function checkLoop(userId) {
    // observer에서 중복체크가 발생해서 interval 을 한번만 실행시키기위해 플래그 체크를 합니다.
    if(checkIntervalFlag) return
    checkIntervalFlag = true;
    console.log('방송이 시작되면 새로고침 합니다.');
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json'
    const interval = setInterval(function(){
        xhr.open("GET", `https://bjapi.afreecatv.com/api/${userId}/station`)
        xhr.send();
    },3000);

    xhr.onreadystatechange = ()=>{
        if(xhr.response === null || xhr.response.broad === null) {
            return
        }
        checkIntervalFlag = false;
        clearInterval(interval)
        window.location.href = `https://play.afreecatv.com/${userId}/`;
    }
}
